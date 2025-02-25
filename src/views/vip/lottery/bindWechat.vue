<template>
    <div class="m-notice-wechat" v-loading="loading" @click="handleClose">
        <div class="m-wechat-content">
            <el-image class="u-qr" v-if="ticket" :src="qrcodeValue" lazy> </el-image>
            <i class="u-tip" v-if="!success">请关注公众号再进行抽奖</i>
            <template v-else>
                <div class="u-bind">
                    <i class="el-icon-success" style="color: #67c23a; margin-right: 5px"> </i>
                    <span class="u-bind-text">绑定成功</span>
                </div>
                <span class="u-tips">请刷新页面后再进行抽奖</span>
            </template>
        </div>
    </div>
</template>

<script>
import { getWechatQrcode, getMyInfo } from "@/service/vip/lottery";
const { SSE } = require("@jx3box/jx3box-common/js/https");
import User from "@jx3box/jx3box-common/js/user";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
const base = `https://mp.weixin.qq.com/cgi-bin/showqrcode`;
export default {
    name: "wechat",
    data: function () {
        return {
            ticket: "",
            sse: null,
            profile: null,
            success: false,
            loading: false,

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        url() {
            return __cms + "api/cms/wechat/mp/bind/result?token=" + User.getToken();
        },
        isWechatVerified() {
            return !!this.profile?.wechat_mp_openid;
        },
        qrcodeValue() {
            return `${base}?ticket=${encodeURIComponent(this.ticket)}`;
        },
    },
    mounted() {
        this.loadUser();
    },
    methods: {
        loadUser() {
            getMyInfo().then((res) => {
                this.profile = res.data.data;
                this.loadQrcode();
            });
        },

        handleClose() {
            if (this.sse) {
                this.sse.disconnect();
            }
            this.$emit("close");
        },
        loadQrcode() {
            this.loading = true;
            getWechatQrcode()
                .then((res) => {
                    this.ticket = res.data.data?.ticket;
                    if (!this.isWechatVerified && this.ticket) {
                        if (this.sse) {
                            this.sse.disconnect();
                        }
                        this.initSSE();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        initSSE() {
            this.sse = new SSE(this.url);
            this.sse.connect();
            this.sse.on("open", (e) => {
                console.log("SSE Initialization");
            });
            this.sse.on("bind_wx_mp", this.onMessage);
            this.sse.on("error", (e) => {
                console.log("SSE Error", e);
            });
        },
        onMessage() {
            this.success = true;
            this.profile.wechat_mp_openid = true;
            localStorage.setItem("bind_wx", 1);
        },
    },
};
</script>
<style lang="less">
.m-notice-wechat {
    .flex;
    .r(10px);
    padding: 50px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
.m-wechat-content {
    .flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .u-qr {
        .flex;
        align-items: center;
        justify-content: center;
        .size(180px);
        .el-image__inner {
            .full;
        }
    }
    .u-tips {
        .fz(12px);
        color: #888;
    }
}
</style>
