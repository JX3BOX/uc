<template>
    <main class="mx-auto max-w-lg px-5 py-12">
        <el-card shadow="never">
            <h1 class="mb-5 text-xl font-semibold">绑定微信公众号</h1>
            <template v-if="preview">
                <Login v-if="!loggedIn" embedded preview />
                <template v-else>
                    <p class="mb-4">将当前微信绑定到魔盒账号 <strong>{{ accountName }}</strong>。</p>
                    <el-button type="primary" disabled>确认绑定</el-button>
                </template>
                <p class="mt-3 text-sm text-gray-500">开发预览，仅展示页面。</p>
            </template>
            <p v-else-if="busy" role="status">正在处理，请稍候…</p>
            <el-alert v-else-if="bound" type="success" title="绑定成功，可以返回公众号使用账号功能。" :closable="false" />
            <template v-else>
                <el-alert v-if="error" class="mb-4" type="error" :title="error" :closable="false" />
                <p v-if="!inWechat">请在微信中打开此页面。</p>
                <template v-else-if="ticket && loggedIn">
                    <p class="mb-4">将当前微信绑定到魔盒账号 <strong>{{ accountName }}</strong>。</p>
                    <el-button type="primary" @click="confirm">确认绑定</el-button>
                </template>
                <template v-else-if="ticket">
                    <p class="mb-4">登录要绑定的魔盒账号。</p>
                    <Login embedded @logged-in="onLoggedIn" />
                </template>
                <el-button v-else type="primary" @click="start">{{ error ? "重新授权" : "开始绑定" }}</el-button>
            </template>
        </el-card>
    </main>
</template>

<script>
import Login from "./Login.vue";
import User from "@jx3box/jx3box-common/js/user";
import { $cms } from "@/service/account/axios";

const stateKey = "wxmp-bind-state";
const ticketKey = "wxmp-bind-ticket";

async function request(action, payload = {}) {
    const { data } = await $cms().post(`/api/cms/wechat/mp/web-bind/${action}`, payload);
    if (data?.code !== 0) throw new Error(data?.msg || "请求失败，请稍后重试");
    return data.data;
}

export default {
    name: "WxmpBind",
    components: { Login },
    data() {
        return {
            inWechat: /MicroMessenger/i.test(navigator.userAgent),
            loggedIn: User.isLogin(),
            accountName: User.getInfo().name || User.getInfo().uid,
            ticket: "",
            busy: false,
            bound: false,
            error: "",
        };
    },
    computed: {
        preview() {
            return process.env.NODE_ENV === "development" && !this.inWechat;
        },
    },
    async mounted() {
        document.title = "绑定微信公众号 - JX3BOX";
        if (!this.inWechat) return;

        const query = new URLSearchParams(location.search);
        if (!query.has("code") && !query.has("state")) {
            this.ticket = sessionStorage.getItem(ticketKey) || "";
            if (!this.ticket) await this.start();
            return;
        }

        this.busy = true;
        const state = sessionStorage.getItem(stateKey);
        sessionStorage.removeItem(stateKey);
        sessionStorage.removeItem(ticketKey);
        try {
            await this.$router.replace({ name: "account_wxmp_bind" });
            if (!state || query.get("state") !== state || !query.get("code")) {
                throw new Error("微信授权已失效，请重新授权");
            }
            const { ticket } = await request("exchange", { code: query.get("code"), state });
            sessionStorage.setItem(ticketKey, ticket);
            this.ticket = ticket;
        } catch (error) {
            this.error = error.response ? "微信授权失败，请重新授权" : error.message;
        } finally {
            this.busy = false;
        }
    },
    methods: {
        async start() {
            this.busy = true;
            this.error = "";
            try {
                const { state, authorize_url } = await request("start");
                sessionStorage.setItem(stateKey, state);
                location.replace(authorize_url);
            } catch (error) {
                this.error = "无法发起微信授权，请稍后重试";
                this.busy = false;
            }
        },
        onLoggedIn(user) {
            this.accountName = user.name || user.uid;
            this.loggedIn = true;
        },
        async confirm() {
            this.busy = true;
            this.error = "";
            try {
                await request("confirm", { ticket: this.ticket });
                this.bound = true;
            } catch (error) {
                if (error.response?.status === 401) {
                    this.loggedIn = false;
                    this.error = "登录已失效，请重新登录魔盒。";
                    return;
                }
                this.error = error.response ? "暂时无法绑定，请稍后重试" : error.message;
            } finally {
                if (this.loggedIn) {
                    this.ticket = "";
                    sessionStorage.removeItem(ticketKey);
                }
                this.busy = false;
            }
        },
    },
};
</script>
