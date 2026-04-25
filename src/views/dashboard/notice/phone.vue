<template>
    <div class="m-notice-phone u-notice-box">
        <div class="u-notice-value">
            <span class="u-address" v-if="phone">{{ phoneStr(phone) }}</span>
            <el-tag class="u-notice-status" :type="phone ? 'success' : 'info'">{{
                phone ? "已绑定" : "未绑定"
            }}</el-tag>
        </div>
        <el-button type="primary" size="large" :circle="isPhone" class="u-bind-button" @click="visible = true" icon="Edit">{{
            phone ? "修改手机" : "绑定手机"
        }}</el-button>
        <el-dialog
            title="绑定手机"
            v-model="visible"
            :width="isPhone ? '95%' : '600px'"
            class="m-notice-phone__dialog"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <div class="m-phone-content">
                <div class="m-phone-intro">
                    <span class="u-intro-tag">安全验证</span>
                    <h3>{{ phone ? "更换绑定手机号" : "绑定手机号" }}</h3>
                    <p>支持国际手机号，用于账号安全验证、通知提醒与重要操作确认。</p>
                    <div class="m-current-phone" v-if="phone">
                        <span class="u-current-label">当前已绑定</span>
                        <strong class="u-current-value">{{ phoneStr(phone) }}</strong>
                    </div>
                    <div class="m-current-phone is-empty" v-else>
                        <span class="u-current-label">当前状态</span>
                        <strong class="u-current-value">未绑定手机号</strong>
                    </div>
                </div>
                <el-form :model="form" :rules="rules" status-icon ref="phoneRef" size="large" class="m-phone-form">
                    <el-form-item label="" prop="phoneInput" class="u-phone-form-item">
                        <div class="m-phone-row">
                            <el-select
                                v-model="selectedCountryCode"
                                class="u-country-select"
                                filterable
                                @change="handleCountryChange"
                            >
                                <el-option
                                    v-for="country in countryOptions"
                                    :key="country.iso2"
                                    :label="`${country.name} +${country.callingCode}`"
                                    :value="country.iso2"
                                >
                                    <div class="u-country-option">
                                        <span>{{ country.name }}</span>
                                        <strong>+{{ country.callingCode }}</strong>
                                    </div>
                                </el-option>
                            </el-select>
                            <el-input
                                v-model.trim="form.phoneInput"
                                class="u-phone-input"
                                placeholder="输入手机号"
                                @input="onPhoneInput"
                            >
                                <template #prefix>
                                    <i class="el-icon-phone"></i>
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="" prop="code">
                        <div class="m-code-row">
                            <el-input v-model.trim="form.code" placeholder="输入验证码" class="u-code-input">
                                <template #prefix>
                                    <i class="el-icon-lock"></i>
                                </template>
                            </el-input>
                            <el-button class="u-send-code" :disabled="canSendCode" :loading="codeLoading" @click="sendCode">
                                {{ sendButtonText }}
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <p class="u-submit-tip" v-if="lastSentPhone && normalizedPhone !== lastSentPhone">手机号已变更，请重新获取验证码</p>
                <el-button class="u-btn" type="primary" @click="verify" :loading="loading" :disabled="canSubmit">
                    {{ phone ? "确认换绑" : "确认绑定" }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProfile, sendPhoneCode, verifyPhone, checkPhone } from "@/service/dashboard/profile";
import { PHONE_COUNTRY_OPTIONS, detectPhoneCountry, maskPhone, normalizeBindPhone, normalizeStoredPhone } from "@/assets/js/phone";

export default {
    name: "phone",
    data: function () {
        return {
            visible: false,
            phone: "",
            currentPhone: "",
            currentCountryCode: "CN",
            selectedCountryCode: "CN",
            countryOptions: PHONE_COUNTRY_OPTIONS,
            isPhone: window.innerWidth < 768,
            loading: false,
            codeLoading: false,
            checkingPhone: false,
            form: {
                phoneInput: "",
                code: "",
            },
            timer: null,
            interval: 0,
            hasBind: false,
            lastSentPhone: "",
            rules: {
                phoneInput: [
                    {
                        validator: (rule, value, callback) => {
                            this.validatePhoneRule(callback);
                        },
                        trigger: "blur",
                    },
                ],
                code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
            },
        };
    },
    computed: {
        normalizedPhone() {
            return normalizeBindPhone(this.form.phoneInput, this.selectedCountryCode);
        },
        canSendCode() {
            return (
                this.codeLoading ||
                this.checkingPhone ||
                this.interval > 0 ||
                !this.form.phoneInput ||
                !this.normalizedPhone ||
                this.normalizedPhone === this.currentPhone ||
                this.hasBind
            );
        },
        canSubmit() {
            return this.loading || !this.form.code || !this.normalizedPhone || this.normalizedPhone !== this.lastSentPhone;
        },
        sendButtonText() {
            if (this.codeLoading) {
                return "发送中";
            }
            return this.interval > 0 ? `${this.interval}s` : "发送验证码";
        },
    },
    methods: {
        phoneStr: function (phone) {
            return maskPhone(phone);
        },
        async loadProfile() {
            const res = await getProfile();
            const rawPhone = res?.data?.data?.user_phone || "";
            this.phone = rawPhone;
            this.currentPhone = normalizeStoredPhone(rawPhone);
            this.currentCountryCode = detectPhoneCountry(rawPhone);
            if (!this.visible) {
                this.selectedCountryCode = this.currentCountryCode || "CN";
            }
        },
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        resetSendState() {
            this.clearTimer();
            this.interval = 0;
            this.hasBind = false;
            this.lastSentPhone = "";
            this.form.code = "";
        },
        resetForm(keepCountry = false) {
            this.form.phoneInput = "";
            this.form.code = "";
            this.hasBind = false;
            this.lastSentPhone = "";
            this.codeLoading = false;
            this.loading = false;
            this.checkingPhone = false;
            this.clearTimer();
            this.interval = 0;
            this.selectedCountryCode = keepCountry ? this.currentCountryCode || "CN" : "CN";
            this.$nextTick(() => {
                this.$refs.phoneRef?.clearValidate();
            });
        },
        handleClose(done) {
            this.visible = false;
            this.resetForm();
            if (typeof done === "function") {
                done();
            }
        },
        handleCountryChange() {
            this.resetSendState();
            this.$nextTick(() => {
                this.$refs.phoneRef?.clearValidate(["phoneInput", "code"]);
            });
        },
        onPhoneInput() {
            this.resetSendState();
            this.$refs.phoneRef?.clearValidate(["phoneInput", "code"]);
        },
        async runPhoneValidation(checkAvailability = true) {
            const value = String(this.form.phoneInput || "").trim();
            if (!value) {
                return { valid: false, error: "请输入手机号" };
            }

            const normalizedPhone = this.normalizedPhone;
            if (!normalizedPhone) {
                return { valid: false, error: "手机号格式不正确" };
            }

            if (this.currentPhone && normalizedPhone === this.currentPhone) {
                return { valid: false, error: "手机号未变更" };
            }

            if (!checkAvailability) {
                return { valid: true, phone: normalizedPhone };
            }

            this.checkingPhone = true;
            try {
                const res = await checkPhone({ phone: normalizedPhone });
                if (!res?.data?.data) {
                    this.hasBind = true;
                    return { valid: false, error: "手机号已被绑定" };
                }
                this.hasBind = false;
                return { valid: true, phone: normalizedPhone };
            } catch (error) {
                return { valid: false, error: error?.response?.data?.msg || "手机号校验失败" };
            } finally {
                this.checkingPhone = false;
            }
        },
        async validatePhoneRule(callback) {
            const result = await this.runPhoneValidation(true);
            if (!result.valid) {
                callback(new Error(result.error));
                return;
            }
            callback();
        },
        startTimer() {
            this.clearTimer();
            this.interval = 60;
            this.timer = setInterval(() => {
                if (this.interval > 1) {
                    this.interval -= 1;
                } else {
                    this.clearTimer();
                    this.interval = 0;
                }
            }, 1000);
        },
        async sendCode() {
            const result = await this.runPhoneValidation(true);
            if (!result.valid || this.canSendCode) {
                if (!result.valid) {
                    this.$message.error(result.error);
                }
                return;
            }

            this.codeLoading = true;
            try {
                await sendPhoneCode({ phone: result.phone });
                this.lastSentPhone = result.phone;
                this.startTimer();
                this.$message.success("发送成功");
            } catch (error) {
                this.$message.error(error?.response?.data?.msg || "验证码发送失败");
            } finally {
                this.codeLoading = false;
            }
        },
        async verify() {
            const result = await this.runPhoneValidation(false);
            if (!result.valid) {
                this.$message.error(result.error);
                return;
            }
            if (result.phone !== this.lastSentPhone) {
                this.$message.warning("请先获取验证码");
                return;
            }
            if (!this.form.code) {
                this.$message.error("请输入验证码");
                return;
            }

            this.loading = true;
            try {
                await verifyPhone({ phone: result.phone, code: this.form.code });
                await this.loadProfile();
                this.$message.success("绑定成功");
                this.visible = false;
                this.resetForm();
            } catch (error) {
                this.$message.error(error?.response?.data?.msg || "绑定失败");
            } finally {
                this.loading = false;
            }
        },
    },
    mounted: function () {
        this.loadProfile();
    },
    beforeUnmount: function () {
        this.clearTimer();
    },
};
</script>

<style lang="less">
.m-notice-phone {
    .flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.m-notice-phone__dialog {
    .el-dialog {
        border-radius: 24px;
        overflow: hidden;
    }

    .el-dialog__header {
        padding: 22px 24px 0;
    }

    .el-dialog__body {
        padding: 18px 24px 24px;
    }

    .m-phone-content {
        .flex;
        flex-direction: column;
        gap: 16px;
    }

    .m-phone-intro {
        padding: 18px;
        border: 1px solid rgba(62, 108, 255, 0.08);
        border-radius: 18px;
        background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);

        .u-intro-tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 10px;
            border-radius: 999px;
            background: rgba(47, 107, 255, 0.1);
            color: #2f6bff;
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

        .m-current-phone {
            margin-top: 14px;
            padding: 12px 14px;
            border-radius: 14px;
            background: rgba(47, 107, 255, 0.06);
            border: 1px solid rgba(47, 107, 255, 0.08);
            .flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .m-current-phone.is-empty {
            background: rgba(123, 135, 148, 0.08);
            border-color: rgba(123, 135, 148, 0.1);
        }

        .u-current-label {
            color: #7b8794;
            font-size: 13px;
            font-weight: 600;
        }

        .u-current-value {
            color: #1f2d3d;
            font-size: 15px;
            line-height: 1.4;
            font-weight: 700;
            word-break: break-all;
            text-align: right;
        }
    }

    .m-phone-form {
        .u-phone-form-item {
            margin-bottom: 18px;
        }
    }

    .m-phone-row {
        display: grid;
        grid-template-columns: 140px minmax(0, 1fr);
        gap: 10px;
        width: 100%;
    }

    .m-code-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 160px;
        gap: 12px;
        width: 100%;
        align-items: stretch;
    }

    .u-country-select,
    .u-phone-input,
    .u-code-input {
        width: 100%;
    }

    .u-country-select {
        .el-select__wrapper {
            min-height: 52px;
            border-radius: 14px;
            box-shadow: none;
            border: 1px solid rgba(31, 45, 61, 0.08);
            background: #f7f9fc;
        }
    }

    .u-phone-input,
    .u-code-input {
        .el-input__wrapper {
            min-height: 52px;
            border-radius: 14px;
            box-shadow: none;
            border: 1px solid rgba(31, 45, 61, 0.08);
            background: #f7f9fc;
        }
    }

    .u-send-code {
        width: 100%;
        height: 52px;
        border: 0;
        border-radius: 14px;
        background: #eef3ff;
        color: #2f6bff;
        font-weight: 700;
        box-shadow: inset 0 0 0 1px rgba(47, 107, 255, 0.12);
    }

    .u-send-code.is-disabled,
    .u-send-code:disabled {
        background: #f1f4fa;
        color: #a0a8b8;
        box-shadow: inset 0 0 0 1px rgba(31, 45, 61, 0.08);
    }

    .u-country-option {
        .flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .u-submit-tip {
        margin: -4px 2px 0;
        color: #e6a23c;
        font-size: 13px;
        line-height: 1.6;
    }

    .u-btn {
        width: 100%;
        height: 48px;
        border: 0;
        border-radius: 14px;
        background: linear-gradient(135deg, #2f6bff 0%, #5b8cff 100%);
        box-shadow: 0 14px 28px rgba(47, 107, 255, 0.2);
        font-size: 15px;
        font-weight: 700;
    }
}

@media screen and (max-width: @phone) {
    .m-notice-phone {
        .u-value {
            font-size: 12px;
        }
        .u-bind-button {
            span {
                .none;
            }
        }
    }

    .m-notice-phone__dialog {
        .el-dialog__body {
            padding: 16px;
        }

        .m-phone-row {
            grid-template-columns: 112px minmax(0, 1fr);
            gap: 8px;
        }

        .m-code-row {
            grid-template-columns: minmax(0, 1fr) 120px;
            gap: 8px;
        }

        .m-phone-intro .m-current-phone {
            align-items: flex-start;
            flex-direction: column;
        }

        .m-phone-intro .u-current-value {
            text-align: left;
        }

        .u-send-code {
            height: 52px;
            padding: 0 10px;
        }
    }
}
</style>
