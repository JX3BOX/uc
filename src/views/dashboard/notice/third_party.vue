<template>
    <div class="m-notice-third-party u-notice-box">
        <div class="u-notice-value">
            <span v-if="bound && !loadError" class="u-webhook-mask" :title="maskedWebhook">
                {{ webhookSummary }}
            </span>
            <el-tag class="u-notice-status" :type="loadError ? 'danger' : bound ? 'success' : 'info'">
                {{ statusText }}
            </el-tag>
        </div>
        <el-button
            type="primary"
            size="large"
            :icon="loadError ? 'Refresh' : bound ? 'Edit' : 'Connection'"
            :circle="isPhone"
            :loading="loading"
            :disabled="loading"
            :aria-label="actionText"
            @click="handleAction"
        >
            <span class="u-button-label">{{ actionText }}</span>
        </el-button>

        <el-dialog
            v-model="visible"
            append-to-body
            class="m-webhook-dialog"
            :title="dialogTitle"
            :width="isPhone ? '95%' : '620px'"
            :close-on-click-modal="false"
            :close-on-press-escape="!saveLoading && !removeLoading"
            :show-close="!saveLoading && !removeLoading"
            @closed="resetForm"
        >
            <el-alert
                class="u-security-tip"
                :title="$t('dashboard.notice.webhook.securityTip')"
                type="info"
                show-icon
                :closable="false"
            />

            <div v-if="bound" class="m-current-webhook">
                <span class="u-current-label">{{ $t("dashboard.notice.webhook.currentConfig") }}</span>
                <div class="m-current-webhook__row">
                    <span>Webhook</span>
                    <div class="m-current-webhook__value">
                        <code :title="maskedWebhook">{{ maskedWebhook }}</code>
                        <el-tooltip :content="$t('dashboard.common.clickToCopy')" placement="top">
                            <el-button
                                class="u-copy-webhook"
                                text
                                circle
                                size="small"
                                icon="DocumentCopy"
                                :aria-label="$t('dashboard.common.copy')"
                                @click="copyWebhook"
                            />
                        </el-tooltip>
                    </div>
                </div>
                <div v-if="supportsSecret" class="m-current-webhook__row">
                    <span>{{ $t("dashboard.notice.webhook.secret") }}</span>
                    <code v-if="hasSecret">{{ maskedSecret }}</code>
                    <el-tag v-else size="small" type="info">
                        {{ $t("dashboard.notice.webhook.secretNotConfigured") }}
                    </el-tag>
                </div>
            </div>

            <el-form
                ref="webhookForm"
                class="m-webhook-form"
                :model="form"
                :rules="rules"
                label-position="top"
                size="large"
            >
                <el-form-item :label="$t('dashboard.notice.webhook.webhook')" prop="webhook">
                    <el-input
                        v-model.trim="form.webhook"
                        type="textarea"
                        :rows="3"
                        resize="none"
                        :placeholder="webhookPlaceholder"
                    />
                </el-form-item>

                <el-form-item v-if="supportsSecret" prop="secret">
                    <template #label>
                        <span>
                            {{ $t("dashboard.notice.webhook.secret") }}
                            <small v-if="type === 'feishu'">{{ $t("dashboard.notice.webhook.optional") }}</small>
                        </span>
                    </template>
                    <el-input
                        v-model.trim="form.secret"
                        type="password"
                        show-password
                        :disabled="form.clearSecret"
                        :placeholder="secretPlaceholder"
                        @input="form.clearSecret = false"
                    />
                    <el-checkbox
                        v-if="type === 'feishu' && bound && hasSecret"
                        v-model="form.clearSecret"
                        class="u-clear-secret"
                        @change="onClearSecretChange"
                    >
                        {{ $t("dashboard.notice.webhook.clearSecret") }}
                    </el-checkbox>
                </el-form-item>
            </el-form>

            <details class="m-webhook-guide">
                <summary>{{ $t("dashboard.notice.webhook.guideTitle", { name: platformName }) }}</summary>
                <p>{{ guideText }}</p>
                <a :href="guideUrl" target="_blank" rel="noopener noreferrer">
                    {{ $t("dashboard.notice.webhook.officialGuide") }}
                </a>
            </details>

            <template #footer>
                <div class="m-webhook-footer">
                    <el-button
                        v-if="bound"
                        type="danger"
                        plain
                        :loading="removeLoading"
                        :disabled="saveLoading"
                        @click="handleUnbind"
                    >
                        {{ $t("dashboard.common.unbind") }}
                    </el-button>
                    <span class="u-footer-spacer"></span>
                    <el-button :disabled="saveLoading || removeLoading" @click="visible = false">
                        {{ $t("dashboard.common.cancel") }}
                    </el-button>
                    <el-button type="primary" :loading="saveLoading" :disabled="removeLoading" @click="submit">
                        {{ $t("dashboard.common.save") }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { saveUserWebhook, removeUserWebhook } from "@/service/dashboard/webhook";
import { copyText } from "@/utils/index";

const GUIDE_URLS = {
    wecom: "https://developer.work.weixin.qq.com/document/path/91770",
    feishu: "https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN",
    dingtalk: "https://open.dingtalk.com/document/dingstart/custom-bot-creation-and-installation",
};

export default {
    name: "third-party-notice",
    props: {
        type: {
            type: String,
            required: true,
            validator: (value) => ["wecom", "feishu", "dingtalk"].includes(value),
        },
        webhook: {
            type: Object,
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadError: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["refresh"],
    data: function () {
        return {
            visible: false,
            form: {
                webhook: "",
                secret: "",
                clearSecret: false,
            },
            saveLoading: false,
            removeLoading: false,
            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        platformName: function () {
            return this.$t(`dashboard.notice.types.${this.type}`);
        },
        bound: function () {
            return !!this.webhook?.is_bound;
        },
        hasSecret: function () {
            return !!this.webhook?.has_secret;
        },
        supportsSecret: function () {
            return this.type !== "wecom";
        },
        maskedWebhook: function () {
            return this.webhook?.webhook_masked || "******";
        },
        webhookSummary: function () {
            try {
                const url = new URL(this.maskedWebhook);
                let token = "";
                if (this.type === "wecom") token = url.searchParams.get("key");
                if (this.type === "dingtalk") token = url.searchParams.get("access_token");
                if (this.type === "feishu") token = url.pathname.split("/").filter(Boolean).pop();
                const suffix = String(token || "").replace(/^\*+/, "").slice(-4);
                return suffix ? `****${suffix}` : "****";
            } catch (e) {
                return "****";
            }
        },
        maskedSecret: function () {
            return this.webhook?.secret_masked || "******";
        },
        actionText: function () {
            if (this.loadError) return this.$t("dashboard.common.retry");
            return this.bound ? this.$t("dashboard.common.edit") : this.$t("dashboard.notice.bind");
        },
        statusText: function () {
            if (this.loadError) return this.$t("dashboard.notice.webhook.loadFailed");
            return this.bound ? this.$t("dashboard.common.bound") : this.$t("dashboard.common.unbound");
        },
        dialogTitle: function () {
            const key = this.bound ? "editTitle" : "bindTitle";
            return this.$t(`dashboard.notice.webhook.${key}`, { name: this.platformName });
        },
        webhookPlaceholder: function () {
            return this.bound
                ? this.$t("dashboard.notice.webhook.webhookKeepPlaceholder")
                : this.$t("dashboard.notice.webhook.webhookPlaceholder");
        },
        secretPlaceholder: function () {
            return this.bound && this.hasSecret
                ? this.$t("dashboard.notice.webhook.secretKeepPlaceholder")
                : this.$t("dashboard.notice.webhook.secretPlaceholder");
        },
        guideUrl: function () {
            return GUIDE_URLS[this.type];
        },
        guideText: function () {
            return this.$t(`dashboard.notice.webhook.guides.${this.type}`);
        },
        rules: function () {
            return {
                webhook: [
                    {
                        required: !this.bound,
                        message: this.$t("dashboard.notice.webhook.webhookRequired"),
                        trigger: "blur",
                    },
                    { validator: this.validateWebhook, trigger: "blur" },
                ],
                secret: [
                    {
                        required: this.type === "dingtalk" && !this.hasSecret,
                        message: this.$t("dashboard.notice.webhook.secretRequired"),
                        trigger: "blur",
                    },
                ],
            };
        },
    },
    methods: {
        copyWebhook: function () {
            copyText(this.maskedWebhook)
                .then(() => {
                    this.$message.success(this.$t("dashboard.common.copySuccess"));
                })
                .catch(() => {
                    this.$message.error(this.$t("dashboard.common.copyFailed"));
                });
        },
        validateWebhook: function (rule, value, callback) {
            if (!value) return callback();

            try {
                const url = new URL(value);
                if (url.protocol !== "https:") throw new Error("invalid protocol");
                callback();
            } catch (e) {
                callback(new Error(this.$t("dashboard.notice.webhook.invalidWebhook")));
            }
        },
        openDialog: function () {
            this.resetForm();
            this.visible = true;
        },
        handleAction: function () {
            if (this.loadError) {
                this.$emit("refresh");
                return;
            }
            this.openDialog();
        },
        resetForm: function () {
            this.form.webhook = "";
            this.form.secret = "";
            this.form.clearSecret = false;
            this.saveLoading = false;
            this.removeLoading = false;
            this.$nextTick(() => this.$refs.webhookForm?.clearValidate());
        },
        onClearSecretChange: function (checked) {
            if (checked) this.form.secret = "";
            this.$refs.webhookForm?.clearValidate("secret");
        },
        buildPayload: function () {
            const payload = {};
            if (this.form.webhook) payload.webhook = this.form.webhook;

            if (this.supportsSecret) {
                if (this.form.secret) payload.secret = this.form.secret;
                if (this.type === "feishu" && this.form.clearSecret) payload.secret = "";
            }

            return payload;
        },
        submit: function () {
            this.$refs.webhookForm.validate((valid) => {
                if (!valid) return;

                const payload = this.buildPayload();
                if (this.bound && !Object.keys(payload).length) {
                    this.$message.info(this.$t("dashboard.notice.webhook.noChanges"));
                    return;
                }

                this.saveLoading = true;
                saveUserWebhook(this.type, payload)
                    .then(() => {
                        this.$message.success(
                            this.$t(this.bound ? "dashboard.common.updateSuccess" : "dashboard.common.bindSuccess")
                        );
                        this.visible = false;
                        this.$emit("refresh");
                    })
                    .finally(() => {
                        this.saveLoading = false;
                    });
            });
        },
        handleUnbind: function () {
            this.$confirm(
                this.$t("dashboard.notice.webhook.unbindConfirm", { name: this.platformName }),
                this.$t("dashboard.common.unbind"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.removeLoading = true;
                    return removeUserWebhook(this.type).then(() => {
                        this.$message.success(this.$t("dashboard.common.unbindSuccess"));
                        this.visible = false;
                        this.$emit("refresh");
                    });
                })
                .catch(() => {})
                .finally(() => {
                    this.removeLoading = false;
                });
        },
    },
};
</script>

<style lang="less">
.m-notice-third-party {
    .flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;

    .u-notice-value {
        .flex;
        align-items: center;
        min-width: 0;
    }

    .u-webhook-mask {
        max-width: 130px;
        overflow: hidden;
        color: #606266;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.m-webhook-dialog {
    .u-security-tip {
        margin-bottom: 18px;
    }

    .m-current-webhook {
        padding: 14px 16px;
        margin-bottom: 18px;
        border: 1px solid #ebeef5;
        border-radius: 6px;
        background: #fafafa;
    }

    .u-current-label {
        display: block;
        margin-bottom: 8px;
        color: #909399;
        font-size: 13px;
    }

    .m-current-webhook__row {
        .flex;
        align-items: center;
        gap: 10px;
        min-width: 0;

        & + .m-current-webhook__row {
            margin-top: 8px;
        }

        > span:first-child {
            flex: 0 0 90px;
            color: #909399;
            font-size: 13px;
        }

        code {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            color: #303133;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .m-current-webhook__value {
            .flex;
            flex: 1;
            align-items: center;
            gap: 6px;
            min-width: 0;
        }

        .u-copy-webhook {
            flex: 0 0 auto;
            color: #909399;

            &:hover {
                color: @color-link;
            }
        }
    }

    .m-webhook-form {
        .el-form-item__label small {
            margin-left: 5px;
            color: #909399;
            font-weight: normal;
        }

        .u-clear-secret {
            margin-top: 8px;
        }
    }

    .m-webhook-guide {
        padding: 12px 14px;
        border: 1px solid #e4e7ed;
        border-radius: 6px;
        background: #fff;
        color: #606266;

        summary {
            color: #303133;
            font-weight: 600;
            cursor: pointer;
        }

        p {
            margin: 10px 0 8px;
            line-height: 1.7;
        }

        a {
            color: @color-link;
        }
    }

    .m-webhook-footer {
        .flex;
        align-items: center;
        width: 100%;

        .u-footer-spacer {
            flex: 1;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-notice-third-party {
        flex: 1;

        .u-notice-value {
            width: auto;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
        }

        .u-notice-status {
            margin-left: 0;
        }

        .u-webhook-mask {
            max-width: 110px;
            font-size: 12px;
        }

        .u-button-label {
            .none;
        }
    }

    .m-webhook-dialog {
        .el-dialog__body {
            padding: 16px;
        }

        .m-current-webhook__row {
            align-items: flex-start;

            code {
                max-width: 100%;
            }
        }

        .m-webhook-footer {
            flex-wrap: wrap;
            gap: 8px;

            .el-button + .el-button {
                margin-left: 0;
            }
        }
    }
}
</style>
