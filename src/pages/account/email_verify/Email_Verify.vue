<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />

            <main class="m-main">
                <el-alert
                    v-if="success == null"
                    title="未知异常"
                    type="error"
                    description="非法请求或网络异常"
                    show-icon
                    :closable="false"
                >
                </el-alert>

                <el-alert
                    v-if="success == true"
                    title="验证成功"
                    type="success"
                    description="欢迎成为JX3BOX大家庭的正式一员:)"
                    show-icon
                    :closable="false"
                >
                </el-alert>

                <el-alert
                    v-if="success == false"
                    title="验证失败"
                    type="warning"
                    description="无效链接 或 链接已失效"
                    show-icon
                    :closable="false"
                >
                </el-alert>

                <a
                    class="u-skip el-button u-button el-button--primary"
                    :href="homepage"
                    >返回首页</a
                >
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import { verifyEmail } from "@/service/account/email.js";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "Register",
    data: function() {
        return {
            success: null,
            homepage: __Root,
            token: "",
        };
    },
    computed: {
        ready: function() {
            return this.token;
        },
    },
    methods: {
        parse: function() {
            let search = new URLSearchParams(document.location.search);
            this.token = search.get("token");
        },
        verify: function() {
            verifyEmail({
                token: this.token,
            })
                .then((res) => {
                    if (!res.data.code) {
                        this.success = true;
                        // 跳转至首页
                        setTimeout(() => {
                            location.href = "/login";
                        }, 2000);
                    } else {
                        this.success = false;
                    }
                })
                .catch((err) => {
                    this.success = null;
                });
        },
    },
    filters: {},
    mounted: function() {
        // 解析请求字符串
        this.parse();

        // 不合法字符串
        if (!this.ready) {
            this.success = null;
            return;
        }

        // 验证
        this.verify();
    },
    components: {
        CardHeader,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
</style>
