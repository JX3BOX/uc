<template>
    <el-dialog
        :title="email ? $t('dashboard.email.update') : $t('dashboard.email.bind')"
        v-model="visible"
        :width="isPhone ? '95%' : '600px'"
        class="m-email-dialog"
        :before-close="handleClose"
        :close-on-click-modal="false"
    >
        <div class="m-email-content">
            <div class="m-email-intro">
                <span class="u-intro-tag">{{ $t("dashboard.email.verification") }}</span>
                <h3>{{ email ? $t("dashboard.email.changeBound") : $t("dashboard.email.bind") }}</h3>
                <p>{{ $t("dashboard.email.purpose") }}</p>
                <div class="m-current-email" :class="{ 'is-empty': !email }">
                    <span class="u-current-label">{{ email ? $t("dashboard.email.current") : $t("dashboard.common.currentStatus") }}</span>
                    <div class="m-current-email__value">
                        <strong class="u-current-value">{{ email || $t("dashboard.email.unbound") }}</strong>
                        <el-tag v-if="email" class="u-status" :type="verified ? 'success' : 'warning'">
                            {{ verified ? $t("dashboard.common.verified") : $t("dashboard.common.unverified") }}
                        </el-tag>
                        <el-button v-if="email" class="u-unbind-email" type="danger" link :loading="unbindLoading" @click="handleUnbind">
                            [{{ $t("dashboard.common.unbind") }}]
                        </el-button>
                    </div>
                </div>
            </div>

            <el-form :model="form" ref="form" :rules="rules" status-icon size="large" class="m-email-form">
                <el-form-item prop="email">
                    <el-input v-model.trim="form.email" :placeholder="$t('dashboard.email.placeholder')" clearable @input="onEmailInput">
                        <template #prefix>
                            <el-icon><Message /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code" v-if="hasSendBindEmail" class="u-code-input">
                    <el-input v-model.trim="form.code" :placeholder="$t('dashboard.common.codePlaceholder')">
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-alert
                class="u-alert"
                v-if="hasSendBindEmail"
                :title="$t('dashboard.email.sent')"
                type="success"
                :description="$t('dashboard.email.sentDescription')"
                show-icon
                :closable="false"
            />
            <p class="u-submit-tip" v-if="lastSentEmail && form.email !== lastSentEmail">{{ $t("dashboard.email.changedResend") }}</p>
            <div class="m-action">
                <template v-if="!hasSendBindEmail">
                    <el-button
                        class="u-btn"
                        type="primary"
                        :disabled="!form.email || sendLoading"
                        icon="Position"
                        :loading="sendLoading"
                        @click="bind"
                    >
                        {{ $t("dashboard.email.sendVerification") }}
                    </el-button>
                    <div class="u-tips">{{ $t("dashboard.email.providerTip") }}</div>
                </template>
                <el-button
                    v-if="hasSendBindEmail"
                    class="u-btn"
                    type="primary"
                    :disabled="canSubmit"
                    icon="Position"
                    @click="submit"
                    :loading="loading"
                >
                    {{ $t("dashboard.email.confirmBind") }}
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { sendVerifyEmail, sendBindEmail, checkEmailAvailable, sendUnbindEmailCode, unbindEmail } from "@/service/dashboard/profile";
export default {
    name: "email_dialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            default: "",
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue", "update"],
    data() {
        return {
            form: {
                email: "",
                code: "",
            },
            rules: {
                email: [
                    { required: true, message: this.$t("dashboard.email.placeholder"), trigger: "blur" },
                    { type: "email", message: this.$t("dashboard.email.invalid"), trigger: "blur" },
                    { validator: this.checkEmail, trigger: "blur" },
                ],
                code: [{ required: true, message: this.$t("dashboard.common.codePlaceholder"), trigger: "blur" }],
            },
            loading: false,
            sendLoading: false,
            unbindLoading: false,

            hasSendBindEmail: false,
            lastSentEmail: "",

            isPhone: window.innerWidth < 768,
            visible: false,
        };
    },
    watch: {
        modelValue(val) {
            this.visible = val;
            if (val) {
                this.resetForm();
            }
        },
        visible(val) {
            if (!val) {
                this.resetForm();
                this.$emit("update:modelValue", false);
            }
        },
    },
    computed: {
        canSubmit() {
            return this.loading || !this.form.code || !this.form.email || this.form.email !== this.lastSentEmail;
        },
    },
    methods: {
        resetForm() {
            this.form.email = this.email && !this.verified ? this.email : "";
            this.form.code = "";
            this.hasSendBindEmail = false;
            this.lastSentEmail = "";
            this.loading = false;
            this.sendLoading = false;
            this.unbindLoading = false;
            this.$nextTick(() => {
                this.$refs.form?.clearValidate();
            });
        },
        handleClose(done) {
            if (typeof done === "function") {
                done();
                return;
            }
            this.visible = false;
        },
        onEmailInput() {
            if (this.hasSendBindEmail) {
                this.hasSendBindEmail = false;
                this.lastSentEmail = "";
                this.form.code = "";
            }
            this.$refs.form?.clearValidate(["email", "code"]);
        },
        checkEmail(rule, value, callback) {
            if (!value) {
                return callback();
            }
            if (value === this.email && this.verified) {
                return callback(new Error(this.$t("dashboard.email.sameEmail")));
            }
            if (value === this.email && !this.verified) {
                return callback();
            }
            checkEmailAvailable(value)
                .then((res) => {
                    if (res.data.data?.isExist) {
                        callback(new Error(this.$t("dashboard.email.alreadyBound")));
                    } else {
                        callback();
                    }
                })
                .catch(() => {
                    callback(new Error(this.$t("dashboard.email.checkFailed")));
                });
        },
        bind() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.sendLoading = true;
                    sendBindEmail({
                        email: this.form.email,
                    })
                        .then((res) => {
                            this.hasSendBindEmail = true;
                            this.lastSentEmail = this.form.email;
                            this.form.code = "";
                        })
                        .catch(() => {
                            this.$message.error(this.$t("dashboard.email.sendFailed"));
                        })
                        .finally(() => {
                            this.sendLoading = false;
                        });
                }
            });
        },
        submit() {
            if (!this.form.code) {
                this.$message.error(this.$t("dashboard.common.codePlaceholder"));
                return;
            }
            if (this.form.email !== this.lastSentEmail) {
                this.$message.warning(this.$t("dashboard.email.resend"));
                return;
            }

            this.loading = true;
            sendVerifyEmail(this.form.code)
                .then((res) => {
                    this.$emit("update");
                    this.$message.success(this.$t("dashboard.email.bindSuccess"));
                    this.handleClose();
                })
                .catch(() => {
                    this.$message.error(this.$t("dashboard.email.bindFailed"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async handleUnbind() {
            try {
                await this.$confirm(this.$t("dashboard.email.unbindConfirm"), this.$t("dashboard.common.tip"), {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    type: "warning",
                });
                this.unbindLoading = true;
                await sendUnbindEmailCode();
                this.unbindLoading = false;
                const { value: code } = await this.$prompt(
                    this.$t("dashboard.email.unbindCodeTip", { email: this.email }),
                    this.$t("dashboard.email.unbindTitle"),
                    {
                        confirmButtonText: this.$t("dashboard.common.confirm"),
                        cancelButtonText: this.$t("dashboard.common.cancel"),
                        inputPattern: /^[A-Za-z0-9]{6}$/,
                        inputErrorMessage: this.$t("dashboard.email.codeInvalid"),
                    }
                );
                this.unbindLoading = true;
                await unbindEmail({ code });
                this.$emit("update");
                this.$message.success(this.$t("dashboard.common.unbindSuccess"));
                this.handleClose();
            } catch (error) {
                if (error !== "cancel" && error !== "close") {
                    this.$message.error(error?.response?.data?.msg || this.$t("dashboard.email.unbindFailed"));
                }
            } finally {
                this.unbindLoading = false;
            }
        },
    },
};
</script>

<style lang="less">
.m-email-dialog {
    .el-dialog__headerbtn {
        .flex(o);
    }

    .el-dialog {
        border-radius: 24px;
        overflow: hidden;
    }

    .el-dialog__body {
        padding: 18px 24px 24px;
    }

    .m-email-content {
        .flex;
        flex-direction: column;
        gap: 16px;
    }

    .m-email-intro {
        padding: 18px;
        border: 1px solid fade(@v4primary, 8%);
        border-radius: 18px;
        background: linear-gradient(180deg, fade(@v4primary, 6%) 0%, #ffffff 100%);

        .u-intro-tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 10px;
            border-radius: 999px;
            background: fade(@v4primary, 10%);
            color: @v4primary;
            font-size: 12px;
            font-weight: 700;
        }

        h3 {
            margin: 12px 0 6px;
            color: #1f2d3d;
            font-size: 22px;
            line-height: 1.3;
        }

        p {
            margin: 0;
            color: #7b8794;
            font-size: 14px;
            line-height: 1.7;
        }
    }

    .m-current-email {
        margin-top: 14px;
        padding: 12px 14px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid fade(@v4primary, 16%);
        box-shadow: 0 10px 24px fade(@v4primary, 8%);
        .flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .m-current-email.is-empty {
        background: rgba(123, 135, 148, 0.08);
        border-color: rgba(123, 135, 148, 0.1);
        box-shadow: none;
    }

    .u-current-label {
        color: #7b8794;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
    }

    .u-current-value {
        color: @v4primary;
        font-size: 15px;
        line-height: 1.4;
        font-weight: 700;
        word-break: break-all;
        text-align: right;
    }

    .m-current-email.is-empty .u-current-value {
        color: #1f2d3d;
    }

    .u-status {
        vertical-align: 1px;
    }

    .m-current-email__value {
        .flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        min-width: 0;
    }

    .u-unbind-email {
        flex: none;
        margin-left: 0;
    }

    .m-email-form {
        .el-form-item {
            margin-bottom: 18px;
        }
    }

    .el-input__wrapper {
        min-height: 52px;
        border-radius: 14px;
        box-shadow: none;
        border: 1px solid rgba(31, 45, 61, 0.08);
        background: #f7f9fc;
    }

    .u-alert {
        margin-top: -4px;
    }

    .m-action {
        .x;
    }

    .u-btn {
        width: 100%;
        height: 48px;
        border: 0;
        border-radius: 14px;
        background: linear-gradient(135deg, @v4primary 0%, lighten(@v4primary, 10%) 100%);
        box-shadow: 0 14px 28px fade(@v4primary, 20%);
        font-size: 15px;
        font-weight: 700;
    }

    .u-btn:not(.is-disabled):not(:disabled):hover {
        background: linear-gradient(135deg, darken(@v4primary, 5%) 0%, lighten(@v4primary, 6%) 100%);
    }

    .u-submit-tip {
        margin: -4px 2px 0;
        color: #e6a23c;
        font-size: 13px;
        line-height: 1.6;
    }

    .u-tips {
        .fz(12px, 1.8);
        color: #999;
        margin-top: 10px;
        white-space: nowrap;
    }

    .el-form-item.is-success {
        .el-input__validateIcon {
            color: #67c23a;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-email-dialog {
        .el-dialog__body {
            padding: 16px;
        }

        .m-current-email {
            align-items: flex-start;
            flex-direction: column;
        }

        .u-current-value {
            text-align: left;
        }

        .m-current-email__value {
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        .u-tips {
            white-space: normal;
        }
    }
}
</style>
