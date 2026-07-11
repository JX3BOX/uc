<template>
    <div class="m-notice-phone u-notice-box">
        <div class="u-notice-value">
            <span class="u-address" v-if="phone">{{ phoneStr(phone) }}</span>
            <el-tag class="u-notice-status" :type="phone ? 'success' : 'info'">{{
                phone ? $t("dashboard.common.bound") : $t("dashboard.common.unbound")
            }}</el-tag>
        </div>
        <el-button type="primary" size="large" :circle="isPhone" class="u-bind-button" @click="openDialog" icon="Edit">{{
            phone ? $t("dashboard.phone.change") : $t("dashboard.phone.bind")
        }}</el-button>
        <el-dialog
            :title="$t('dashboard.phone.bind')"
            v-model="visible"
            :width="isPhone ? '95%' : '600px'"
            class="m-notice-phone__dialog"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <div class="m-phone-content">
                <div class="m-phone-intro">
                    <span class="u-intro-tag">{{ $t("dashboard.phone.securityVerification") }}</span>
                    <h3>{{ phone ? $t("dashboard.phone.changeBound") : $t("dashboard.phone.bindMobile") }}</h3>
                    <p>{{ $t("dashboard.phone.purpose") }}</p>
                    <div class="m-current-phone" v-if="phone">
                        <span class="u-current-label">{{ $t("dashboard.phone.currentBound") }}</span>
                        <strong class="u-current-value">{{ phoneStr(phone) }}</strong>
                    </div>
                    <div class="m-current-phone is-empty" v-else>
                        <span class="u-current-label">{{ $t("dashboard.common.currentStatus") }}</span>
                        <strong class="u-current-value">{{ $t("dashboard.phone.unbound") }}</strong>
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
                                    :label="`${countryName(country)} +${country.callingCode}`"
                                    :value="country.iso2"
                                >
                                    <div class="u-country-option">
                                        <span>{{ countryName(country) }}</span>
                                        <strong>+{{ country.callingCode }}</strong>
                                    </div>
                                </el-option>
                            </el-select>
                            <el-input
                                v-model.trim="form.phoneInput"
                                class="u-phone-input"
                                :placeholder="$t('dashboard.phone.input')"
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
                            <el-input v-model.trim="form.code" :placeholder="$t('dashboard.common.inputCode')" class="u-code-input">
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
                <p class="u-submit-tip" v-if="lastSentPhone && normalizedPhone !== lastSentPhone">{{ $t("dashboard.phone.changedResend") }}</p>
                <el-button class="u-btn" type="primary" @click="verify" :loading="loading" :disabled="canSubmit">
                    {{ phone ? $t("dashboard.phone.confirmChange") : $t("dashboard.phone.confirmBind") }}
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
                code: [{ required: true, message: this.$t("dashboard.common.codePlaceholder"), trigger: "blur" }],
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
                return this.$t("dashboard.common.sending");
            }
            return this.interval > 0 ? `${this.interval}s` : this.$t("dashboard.common.sendCode");
        },
    },
    methods: {
        phoneStr: function (phone) {
            return maskPhone(phone);
        },
        countryName(country) {
            try {
                return new Intl.DisplayNames([this.$i18n.locale], { type: "region" }).of(country.iso2);
            } catch (e) {
                return country.name;
            }
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
        openDialog() {
            this.resetForm(true);
            this.visible = true;
        },
        handleClose(done) {
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
                return { valid: false, error: this.$t("dashboard.common.mobilePlaceholder") };
            }

            const normalizedPhone = this.normalizedPhone;
            if (!normalizedPhone) {
                return { valid: false, error: this.$t("dashboard.phone.invalid") };
            }

            if (this.currentPhone && normalizedPhone === this.currentPhone) {
                return { valid: false, error: this.$t("dashboard.phone.unchanged") };
            }

            if (!checkAvailability) {
                return { valid: true, phone: normalizedPhone };
            }

            this.checkingPhone = true;
            try {
                const res = await checkPhone({ phone: normalizedPhone });
                if (!res?.data?.data) {
                    this.hasBind = true;
                    return { valid: false, error: this.$t("dashboard.phone.alreadyBound") };
                }
                this.hasBind = false;
                return { valid: true, phone: normalizedPhone };
            } catch (error) {
                return { valid: false, error: error?.response?.data?.msg || this.$t("dashboard.phone.checkFailed") };
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
                this.$message.success(this.$t("dashboard.common.sendSuccess"));
            } catch (error) {
                this.$message.error(error?.response?.data?.msg || this.$t("dashboard.phone.codeSendFailed"));
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
                this.$message.warning(this.$t("dashboard.phone.getCodeFirst"));
                return;
            }
            if (!this.form.code) {
                this.$message.error(this.$t("dashboard.common.codePlaceholder"));
                return;
            }

            this.loading = true;
            try {
                await verifyPhone({ phone: result.phone, code: this.form.code });
                await this.loadProfile();
                this.$message.success(this.$t("dashboard.common.bindSuccess"));
                this.visible = false;
                this.resetForm();
            } catch (error) {
                this.$message.error(error?.response?.data?.msg || this.$t("dashboard.common.bindFailed"));
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
    .el-dialog__headerbtn{
        .flex(o);
    }
    .el-dialog {
        border-radius: 24px;
        overflow: hidden;
    }

    // .el-dialog__header {
    //     padding: 22px 24px 0;
    // }

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

        .m-current-phone {
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

        .m-current-phone.is-empty {
            background: rgba(123, 135, 148, 0.08);
            border-color: rgba(123, 135, 148, 0.1);
            box-shadow: none;
        }

        .u-current-label {
            color: #7b8794;
            font-size: 13px;
            font-weight: 600;
        }

        .u-current-value {
            color: @v4primary;
            font-size: 15px;
            line-height: 1.4;
            font-weight: 700;
            word-break: break-all;
            text-align: right;
        }

        .m-current-phone.is-empty .u-current-value {
            color: #1f2d3d;
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
        background: fade(@v4primary, 8%);
        color: @v4primary;
        font-weight: 700;
        box-shadow: inset 0 0 0 1px fade(@v4primary, 18%);
    }

    .u-send-code:not(.is-disabled):not(:disabled):hover {
        background: fade(@v4primary, 12%);
        color: darken(@v4primary, 6%);
        box-shadow: inset 0 0 0 1px fade(@v4primary, 28%);
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
        background: linear-gradient(135deg, @v4primary 0%, lighten(@v4primary, 10%) 100%);
        box-shadow: 0 14px 28px fade(@v4primary, 20%);
        font-size: 15px;
        font-weight: 700;
    }

    .u-btn:not(.is-disabled):not(:disabled):hover {
        background: linear-gradient(135deg, darken(@v4primary, 5%) 0%, lighten(@v4primary, 6%) 100%);
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
