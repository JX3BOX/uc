<template>
    <div class="m-qqbot m-item">
        <span class="u-notice-item">
            <img class="u-qqbot" svg-inline :src="icon('qqbot')" />
            <span class="u-status"> {{ $t("dashboard.qqbot.name") }} </span>
        </span>
        <div class="u-notice-box">
            <div class="u-notice-value">
                <span class="u-value" v-if="checkStatus">******</span>
                <el-tag class="u-notice-status" :type="checkStatus ? 'success' : 'info'">
                    {{ checkStatus ? $t("dashboard.common.bound") : $t("dashboard.common.unbound") }}
                </el-tag>
            </div>
            <el-button type="primary" class="u-bind-btn" @click="bind" size="large" v-if="!checkStatus">
                <i class="el-icon-connection"></i>{{ $t("dashboard.common.bindNow") }}
            </el-button>
            <el-button v-else class="u-unbind-btn" icon="Connection" @click="unbind" size="large" type="info">
                {{ $t("dashboard.common.unbind") }}
            </el-button>
        </div>

        <el-dialog
            class="m-qqbot-dialog"
            :width="isPhone ? '95%' : ''"
            align="center"
            :title="$t('dashboard.qqbot.bindTitle')"
            v-model="showDialog"
        >
            <div class="m-qqbot-content">
                <span
                    class="u-token"
                    :title="$t('dashboard.common.clickToCopy')"
                    @click="copyBindText"
                >
                    <i class="el-icon-document-copy"></i>
                    {{ bindText }}
                </span>
            </div>
            <div class="m-custom-tip">
                {{ $t("dashboard.qqbot.instruction") }}<br />
                QQ: <b>{{ qq }}</b>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
import { getQQbotToken, unbindQQbot } from "@/service/dashboard/profile";
import { copyText } from "@/utils/index";
export default {
    name: "qqbot",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data: function () {
        return {
            showDialog: false,

            token: "",
            qq: "3889010020",

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        checkStatus: function () {
            return this.data.qqbot;
        },
        bindText() {
            return this.$t("dashboard.qqbot.bindText", { token: this.token });
        },
    },
    methods: {
        icon: function (type) {
            return __cdn + "design/user/" + "qqbot.svg";
        },
        bind: function () {
            getQQbotToken().then((res) => {
                this.token = res.data.data.token;
                this.showDialog = true;
            });
        },
        unbind: function () {
            this.$confirm(this.$t("dashboard.qqbot.unbindConfirm"), this.$t("dashboard.common.unbind"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    unbindQQbot().then((res) => {
                        this.$message({
                            type: "success",
                            message: this.$t("dashboard.common.unbindSuccess"),
                        });
                        this.$emit("refresh");
                    });
                })
                .catch(() => {});
        },
        copyBindText: function () {
            copyText(this.bindText)
                .then(() => {
                    this.$notify({
                        title: this.$t("dashboard.common.copySuccess"),
                        message: this.bindText,
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$notify.error({
                        title: this.$t("dashboard.common.copyFailed"),
                        message: this.$t("dashboard.common.copyManually"),
                    });
                });
        },
    },
};
</script>

<style lang="less">
.m-qqbot {
    align-items: center;

    .u-status {
        white-space: nowrap;
    }

    .u-notice-box {
        .flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .u-bind-btn i {
        .mr(6px);
        vertical-align: -1px;
    }

}

.m-qqbot-dialog {
    .m-qqbot-content {
        padding: 20px;
        max-width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        .u-token {
            .fz(20px);
            background-color: #e6f0fb;
            border: 1px solid @color-link;
            color: @color-link;
            padding: 20px;
            font-weight: 400;
            .r(4px);
            white-space: nowrap;

            i {
                .fz(20px);
                .y;
            }
            .pointer;
        }
    }
    .m-custom-tip {
        .x;
        .mt(20px);
        max-width: 680px;
        .auto(x);
        .fz(14px,2);
        b {
            color: orange;
        }
    }

    @media screen and (max-width: @phone) {
        .m-qqbot-content {
            padding: 8px;
            .u-token {
                .fz(14px);
                background-color: #e6f0fb;
                border: 1px solid @color-link;
                color: @color-link;
                padding: 8px 2px;
                .r(4px);

                i {
                    .fz(13px);
                    .y;
                }
                .pointer;
            }
        }
    }
}
</style>
