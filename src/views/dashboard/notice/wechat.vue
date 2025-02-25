<template>
    <div class="m-notice-wechat u-notice-box">
        <div class="u-notice-value">
            <span class="u-value" v-if="isWechatVerified">******</span>
            <el-tag class="u-notice-status" :type="isWechatVerified ? 'success' : 'info'" size="small">{{
                isWechatVerified ? "已绑定" : "未绑定"
            }}</el-tag>
        </div>
        <el-button
            v-if="isWechatVerified"
            class="u-bind-button"
            type="danger"
            icon="el-icon-connection"
            @click="unbind"
            :circle="isPhone"
            >解除绑定
        </el-button>
        <el-button type="primary" :circle="isPhone" class="u-bind-button" icon="el-icon-connection" @click="open" v-else
            >绑定公众号
        </el-button>
        <el-dialog
            title="绑定微信公众号"
            :visible.sync="visible"
            :width="isPhone ? '95%' : '400px'"
            custom-class="m-notice-wechat__dialog"
            :before-close="handleClose"
        >
            <div class="m-wechat-content" v-loading="loading">
                <el-image class="u-qr" v-if="ticket" :src="qrcodeValue" lazy>
                    <div slot="error" class="u-error">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <i class="u-tip">打开微信扫一扫，关注公众号接收通知告警</i>
                <small class="u-tip-small">关注之后需要重新登陆方可生效</small>
                <div class="u-bind" v-show="success">
                    <i class="el-icon-success" style="color: #67c23a; margin-right: 5px"> </i>
                    <span class="u-bind-text">绑定成功</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getWechatQrcode, unbindWechat } from "@/service/dashboard/profile";
import { getMyInfo } from "@/service/dashboard/index";
import { SSE } from "@jx3box/jx3box-common/js/https";
import User from "@jx3box/jx3box-common/js/user";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
const base = `https://mp.weixin.qq.com/cgi-bin/showqrcode`;
export default {
    name: "wechat",
    data: function () {
        return {
            ticket: "",
            visible: false,
            sse: null,
            profile: null,
            success: false,
            loading: false,

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        token() {
            return User.getToken();
        },
        url() {
            return __cms + "api/cms/wechat/mp/bind/result?token=" + this.token;
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
            });
        },
        open() {
            this.visible = true;
            this.loadQrcode();
        },
        handleClose() {
            this.visible = false;
            if (this.sse) {
                this.sse.disconnect();
            }
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

            setTimeout(() => {
                this.visible = false;
            }, 4000);
        },
        unbind() {
            this.$confirm("解绑后无法用微信接收魔盒通知消息，确定解绑吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                unbindWechat().then(() => {
                    this.$notify({
                        title: "解绑成功",
                        type: "success",
                        duration: 2000,
                    });
                    this.loadUser();
                });
            });
        },
    },
};
</script>
<style lang="less">
.m-notice-wechat {
    .flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

}
.m-notice-wechat__dialog {
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
        .u-error {
            .fz(120px);
        }
    }

    .u-tip-small {
        font-size: 13px;
        color: #F56C6C;
        font-weight: 600;
    }
}
@media screen and (max-width: @phone) {
    .m-notice-wechat {
        .u-value {
            font-size: 12px;
        }
        .u-bind-button {
            span {
                .none;
            }
        }
    }
}
</style>
