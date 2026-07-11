<template>
    <div class="m-card m-register">
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <main v-if="success == null" class="m-main">
                <el-form ref="registerForm" :model="form" :rules="registerRules" class="m-form" @submit.prevent>
                    <!-- 账号 -->
                    <el-form-item class="u-email" prop="email">
                        <el-input
                            class="u-text u-email"
                            v-model="form.email"
                            :placeholder="$t('account.common.emailPlaceholder')"
                            minlength="3"
                            maxlength="50"
                            type="email"
                            name="email"
                            autocomplete="email"
                            @input="handleEmailInput"
                            size="large"
                        >
                            <template #prepend>
                                <i class="el-icon-message"></i>
                            </template>
                        </el-input>
                        <i v-show="emailAvailable == true" class="el-icon-success u-ok"></i>
                    </el-form-item>

                    <!-- 验证码 -->
                    <el-form-item class="u-code" prop="code">
                        <el-input class="u-text" :placeholder="$t('account.common.codePlaceholder')" size="large" v-model="form.code" minlength="6" maxlength="6" name="code" autocomplete="one-time-code">
                            <template #prepend>
                                <i class="el-icon-postcard"></i>
                            </template>
                        </el-input>
                        <el-button class="u-code-btn" type="primary" @click="getCode" :disabled="code_disabled" :loading="sendingCode">{{
                            code_text
                        }}</el-button>
                    </el-form-item>

                    <!-- 密码 -->
                    <el-form-item class="u-pass" prop="pass">
                        <el-input class="u-text" :placeholder="$t('account.common.passwordPlaceholder')" size="large" v-model="form.pass" show-password name="password" autocomplete="new-password">
                            <template #prepend>
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <!-- 邀请码 -->
                    <el-form-item class="u-invite" prop="invite">
                        <el-input class="u-text" size="large" :placeholder="$t('account.register.invitationPlaceholder')" v-model="form.invite" name="invitation">
                            <template #prepend>
                                <i class="el-icon-present"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="u-terms" prop="agreement">
                        <el-checkbox v-model="form.agreement" class="u-checkbox">
                            {{ $t("account.register.agreementPrefix") }}
                            <a href="/about/license" target="_blank">{{ $t("account.register.userAgreement") }}</a>{{ $t("account.register.agreementSeparator") }}<a
                                href="/about/privacy"
                                target="_blank"
                                >{{ $t("account.register.privacyPolicy") }}</a
                            >{{ $t("account.register.agreementSeparator") }}<a href="/about/treaty" target="_blank">{{ $t("account.register.creationConvention") }}</a>
                        </el-checkbox>
                    </el-form-item>
                </el-form>
                <!-- 提交 -->
                <el-button class="u-submit u-button" type="primary" size="large" @click="submit" :disabled="!ready || submitting" :loading="submitting">
                    {{ $t("account.common.register") }}
                </el-button>

                <Union mode="register" :includes="['qq', 'wechat', 'weibo']" />

                <footer class="m-footer">
                    <p class="u-login">
                        {{ $t("account.common.haveAccount") }}
                        <a :href="login_url">{{ $t("account.common.login") }} &raquo;</a>
                    </p>
                    <p class="u-resetpwd">
                        <a href="/account/password_reset">{{ $t("account.common.forgotPassword") }}</a>
                    </p>
                </footer>
            </main>

            <main v-if="success == true" class="m-main">
                <el-alert
                    :title="$t('account.register.successTitle')"
                    type="success"
                    :description="$t('account.register.successDescription')"
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="login_url">{{ $t("account.common.loginNow") }}</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert :title="$t('account.register.failureTitle')" type="error" :description="failtips" show-icon :closable="false"> </el-alert>
                <el-button class="u-button u-submit" type="primary" @click="reset" size="large">{{ $t("account.common.back") }}</el-button>
            </main>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import { checkEmail, registerByEmail, verifyEmail } from "@/service/account/email.js";
import { __Root } from "@/utils/config";
import Msg from "@/components/account/Msg.vue";
import Union from "@/components/account/Union.vue";
import {ElMessage} from "element-plus";
import {
    isValidCode,
    isValidEmail,
    isValidPassword,
} from "@/utils/account/validators.js";

export default {
    name: "Register",
    data: function () {
        return {
            form: {
                email: "",
                code: "",
                pass: "",
                invite: "",
                agreement: false,
            },
            emailAvailable: null,
            emailChecking: false,
            emailRequestId: 0,

            success: null,
            failtips: this.$t("account.common.requestFailedRetry"),

            homepage: __Root,
            redirect: "",

            code_text: this.$t("account.common.sendCode"),
            interval: 0,
            codeTimer: null,
            sendingCode: false,
            submitting: false,
        };
    },
    computed: {
        ready: function () {
            return (
                isValidEmail(this.form.email) &&
                this.emailAvailable &&
                isValidCode(this.form.code) &&
                isValidPassword(this.form.pass) &&
                this.form.agreement
            );
        },
        login_url: function () {
            return "/account/login?redirect=" + this.redirect;
        },
        code_disabled: function () {
            return !this.form.email || !this.emailAvailable || this.interval > 0 || this.sendingCode || this.emailChecking;
        },
        registerRules: function () {
            return {
                email: [{ validator: this.validateRegisterEmail, trigger: "blur" }],
                code: [{ validator: this.validateRegisterCode, trigger: "blur" }],
                pass: [{ validator: this.validateRegisterPassword, trigger: "blur" }],
                agreement: [{ validator: this.validateRegisterAgreement, trigger: "change" }],
            };
        },
    },
    methods: {
        validateRegisterCode: function (rule, value, callback) {
            callback(isValidCode(value) ? undefined : new Error(this.$t("account.validation.code")));
        },
        validateRegisterPassword: function (rule, value, callback) {
            callback(isValidPassword(value) ? undefined : new Error(this.$t("account.validation.password")));
        },
        validateRegisterAgreement: function (rule, value, callback) {
            callback(value ? undefined : new Error(this.$t("account.validation.agreement")));
        },
        handleEmailInput: function () {
            this.emailAvailable = null;
            this.emailRequestId++;
        },
        validateRegisterEmail: function (rule, value, callback) {
            if (!isValidEmail(value)) {
                this.emailAvailable = null;
                callback(new Error(this.$t("account.validation.email")));
                return;
            }

            const email = value;
            const requestId = ++this.emailRequestId;
            this.emailChecking = true;
            checkEmail(email)
                .then((res) => {
                    if (requestId !== this.emailRequestId || email !== this.form.email) {
                        callback();
                        return;
                    }

                    const available = !res.data.data.isExist;
                    this.emailAvailable = available;
                    if (!available) {
                        callback(new Error(this.$t("account.register.emailInUse")));
                        return;
                    }

                    callback();
                })
                .catch(() => {
                    if (requestId === this.emailRequestId) {
                        this.emailAvailable = null;
                    }
                    callback(new Error(this.$t("account.register.emailCheckFailed")));
                })
                .finally(() => {
                    if (requestId === this.emailRequestId) {
                        this.emailChecking = false;
                    }
                });
        },
        submit: async function () {
            if (this.submitting) return;

            try {
                await this.$refs.registerForm.validate();
            } catch (e) {
                return;
            }

            if (this.ready) {
                this.submitting = true;
                verifyEmail({
                    email: this.form.email,
                    password: this.form.pass,
                    invitation: this.form.invite,
                    code: this.form.code,
                })
                    .then((res) => {
                        if (!res.data.code) {
                            this.success = true;
                        } else {
                            this.success = false;
                            this.failtips = res.data.msg;
                        }
                    })
                    .catch((err) => {
                        this.success = false;
                        this.failtips = this.$t("account.common.networkRetryLater");
                    })
                    .finally(() => {
                        this.submitting = false;
                    });
            }
        },
        reset: function () {
            this.success = null;
            this.form.agreement = false;
            this.form.code = "";
            this.$refs.registerForm?.clearValidate();
        },
        checkDirect: function () {
            let search = new URLSearchParams(document.location.search);
            let redirect = search.get("redirect");
            this.redirect = redirect ? redirect : this.homepage;
            /*if (redirect) {
                this.redirect = redirect;
            } else {
                this.redirect = this.homepage;
            }*/
        },
        getCode: async function () {
            if (this.sendingCode) return;

            try {
                await this.$refs.registerForm.validateField("email");
            } catch (e) {
                return;
            }

            this.sendingCode = true;
            registerByEmail({ email: this.form.email })
                .then((res) => {
                    if (res.data.code) {
                        let msg = "";
                        if (res.data.code == 99999) {
                            msg = this.$t("account.register.emailProviderUnsupported");
                        } else {
                            msg = res.data.msg;
                        }
                        ElMessage.error(msg);
                        return;
                    }

                    ElMessage.success(this.$t("account.register.codeSent"));
                    // 倒计时
                    this.interval = 60;
                    this.code_text = this.interval + "s";
                    this.clearCodeTimer();
                    this.codeTimer = setInterval(() => {
                        this.interval--;
                        this.code_text = this.interval + "s";
                        if (this.interval <= 0) {
                            this.clearCodeTimer();
                            this.code_text = this.$t("account.common.sendCode");
                        }
                    }, 1000);
                })
                .catch(() => {
                    ElMessage.error(this.$t("account.common.networkRetryLater"));
                })
                .finally(() => {
                    this.sendingCode = false;
                });
        },
        clearCodeTimer: function () {
            if (this.codeTimer) {
                clearInterval(this.codeTimer);
                this.codeTimer = null;
            }
        },
    },

    mounted: function () {
        this.checkDirect();
    },
    beforeUnmount: function () {
        this.clearCodeTimer();
    },
    components: {
        CardHeader,
        Msg,
        Union,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";
</style>
