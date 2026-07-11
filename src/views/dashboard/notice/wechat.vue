<template>
    <div class="m-notice-wechat u-notice-box">
        <div class="u-notice-value">
            <span class="u-value" v-if="isWechatVerified">******</span>
            <el-tag class="u-notice-status" :type="isWechatVerified ? 'success' : 'info'">{{
                isWechatVerified ? $t("dashboard.common.bound") : $t("dashboard.common.unbound")
            }}</el-tag>
        </div>
        <el-button
            v-if="isWechatVerified"
            class="u-bind-button"
            type="info"
            icon="Connection"
            @click="unbind"
            :circle="isPhone"
            size="large"
            >{{ $t("dashboard.common.unbind") }}
        </el-button>
        <el-button type="primary" size="large" :circle="isPhone" class="u-bind-button" icon="Connection" @click="open" v-else
            >{{ $t("dashboard.wechat.bindOfficial") }}
        </el-button>
        <el-dialog
            v-model="visible"
            :width="isPhone ? '92%' : '480px'"
            class="m-notice-wechat__dialog"
            :before-close="handleClose"
        >
            <template #header>
                <div class="m-wechat-header">
                    <div class="u-wechat-icon">
                        <i class="el-icon-chat-dot-round"></i>
                    </div>
                    <div>
                        <div class="u-title">{{ $t("dashboard.wechat.bindOfficialAccount") }}</div>
                        <div class="u-subtitle">{{ $t("dashboard.wechat.notificationTip") }}</div>
                    </div>
                </div>
            </template>
            <div class="m-wechat-content" v-loading="loading">
                <div class="m-qr-card">
                    <el-image class="u-qr" v-if="ticket" :src="qrcodeValue">
                        <template #error>
                            <div class="u-error">
                                <i class="el-icon-picture-outline"></i>
                                <span>{{ $t("dashboard.wechat.qrFailed") }}</span>
                            </div>
                        </template>
                    </el-image>
                    <div class="u-qr-placeholder" v-else>
                        <i class="el-icon-loading"></i>
                    </div>
                </div>
                <div class="m-wechat-steps">
                    <div class="u-step">
                        <span class="u-step-index">1</span>
                        <span>{{ $t("dashboard.wechat.openScan") }}</span>
                    </div>
                    <div class="u-step">
                        <span class="u-step-index">2</span>
                        <span>{{ $t("dashboard.wechat.followOfficial") }}</span>
                    </div>
                </div>
                <small class="u-tip-small">{{ $t("dashboard.wechat.reloginTip") }}</small>
                <div class="u-bind" v-show="success">
                    <i class="el-icon-success" style="color: #67c23a; margin-right: 5px"> </i>
                    <span class="u-bind-text">{{ $t("dashboard.common.bindSuccess") }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getWechatQrcode, unbindWechat } from "@/service/dashboard/profile";
import { getMyInfo } from "@/service/dashboard/index";
import { SSE } from "@jx3box/jx3box-common/js/api";
import User from "@jx3box/jx3box-common/js/user";
import { __cms } from "@/utils/config";
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
            bindCloseTimer: null,

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
            this.clearBindCloseTimer();
            this.success = false;
            this.ticket = "";
            this.visible = true;
            this.loadQrcode();
        },
        handleClose(done) {
            this.clearBindCloseTimer();
            this.visible = false;
            this.closeSSE();
            if (typeof done === "function") {
                done();
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
            this.profile = {
                ...(this.profile || {}),
                wechat_mp_openid: true,
            };
            this.closeSSE();
            this.clearBindCloseTimer();

            this.bindCloseTimer = setTimeout(() => {
                this.visible = false;
                this.bindCloseTimer = null;
            }, 4000);
        },
        closeSSE() {
            if (this.sse) {
                this.sse.disconnect();
                this.sse = null;
            }
        },
        clearBindCloseTimer() {
            if (this.bindCloseTimer) {
                clearTimeout(this.bindCloseTimer);
                this.bindCloseTimer = null;
            }
        },
        unbind() {
            this.$confirm(this.$t("dashboard.wechat.unbindConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            }).then(() => {
                unbindWechat().then(() => {
                    this.$notify({
                        title: this.$t("dashboard.common.unbindSuccess"),
                        type: "success",
                        duration: 2000,
                    });
                    this.loadUser();
                });
            }).catch(() => {});
        },
    },
    beforeUnmount() {
        this.clearBindCloseTimer();
        this.closeSSE();
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
    .el-dialog {
        border-radius: 14px;
        overflow: hidden;
    }
    .el-dialog__header {
        margin-right: 0;
        padding: 26px 30px 12px;
    }
    .el-dialog__body {
        padding: 0 30px 30px;
    }
    .el-dialog__headerbtn {
        .flex(o);
        top: 18px;
        right: 18px;
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 50%;
        line-height: 1;
        color: #3b42ff;
        background: transparent;
        transition: background-color 0.2s ease;

        &:hover {
            color: #2f35e8;
            background-color: #f5f6ff;
        }
        .el-dialog__close {
            font-size: 20px;
        }
    }
    .m-wechat-header {
        .flex;
        align-items: center;
        gap: 14px;

        .u-wechat-icon {
            .flex;
            align-items: center;
            justify-content: center;
            .size(44px);
            flex: none;
            border-radius: 12px;
            color: #16a34a;
            background: linear-gradient(135deg, #e9fbea 0%, #f3fff5 100%);
            box-shadow: inset 0 0 0 1px #c9efcf;
            font-size: 22px;
        }
        .u-title {
            .fz(22px);
            .bold;
            color: #1f2937;
            line-height: 1.25;
        }
        .u-subtitle {
            margin-top: 6px;
            .fz(13px);
            color: #6b7280;
            line-height: 1.5;
        }
    }
    .m-wechat-content {
        .flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        min-height: 366px;

        .m-qr-card {
            .flex;
            align-items: center;
            justify-content: center;
            .size(232px);
            box-sizing: border-box;
            padding: 14px;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 18px 42px rgba(31, 41, 55, 0.08);
        }
        .u-qr {
            .flex;
            align-items: center;
            justify-content: center;
            .size(204px);
            border-radius: 10px;
            overflow: hidden;
            .el-image__inner {
                .size(100%);
            }
        }
        .u-qr-placeholder {
            .flex;
            align-items: center;
            justify-content: center;
            .size(204px);
            border-radius: 10px;
            color: #9ca3af;
            background: #f3f4f6;
            font-size: 28px;
        }
        .u-error {
            .flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            .size(204px);
            color: #9ca3af;
            background: #f3f4f6;
            font-size: 42px;

            span {
                .fz(13px);
            }
        }
        .m-wechat-steps {
            .flex;
            justify-content: center;
            gap: 10px;
            width: 100%;
        }
        .u-step {
            .flex;
            align-items: center;
            gap: 8px;
            box-sizing: border-box;
            padding: 9px 12px;
            border-radius: 999px;
            color: #374151;
            background: #f9fafb;
            border: 1px solid #edf0f3;
            .fz(13px);
            line-height: 1;
        }
        .u-step-index {
            .flex;
            align-items: center;
            justify-content: center;
            .size(18px);
            flex: none;
            border-radius: 50%;
            color: #fff;
            background: #16a34a;
            .fz(12px);
            .bold;
        }
        .u-bind {
            .flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            box-sizing: border-box;
            padding: 11px 14px;
            border-radius: 10px;
            color: #166534;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            .bold;
        }
    }

    .u-tip-small {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 13px;
        line-height: 1.5;
        text-align: center;
        color: #b45309;
        background: #fffbeb;
        border: 1px solid #fde68a;
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
    .m-notice-wechat__dialog {
        .el-dialog__header {
            padding: 22px 20px 10px;
        }
        .el-dialog__body {
            padding: 0 20px 24px;
        }
        .m-wechat-header {
            padding-right: 32px;

            .u-title {
                .fz(20px);
            }
        }
        .m-wechat-content {
            min-height: 350px;

            .m-qr-card {
                .size(220px);
            }
            .u-qr,
            .u-qr-placeholder,
            .u-error {
                .size(192px);
            }
            .m-wechat-steps {
                flex-direction: column;
            }
            .u-step {
                justify-content: center;
            }
        }
    }
}
</style>
