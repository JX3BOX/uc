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
                            placeholder="邮箱地址"
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
                        <el-input class="u-text" placeholder="验证码" size="large" v-model="form.code" minlength="6" maxlength="6" name="code" autocomplete="one-time-code">
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
                        <el-input class="u-text" placeholder="输入密码" size="large" v-model="form.pass" show-password name="password" autocomplete="new-password">
                            <template #prepend>
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <!-- 邀请码 -->
                    <el-form-item class="u-invite" prop="invite">
                        <el-input class="u-text" size="large" placeholder="邀请码（非必填）" v-model="form.invite" name="invitation">
                            <template #prepend>
                                <i class="el-icon-present"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item class="u-terms" prop="agreement">
                        <el-checkbox v-model="form.agreement" class="u-checkbox">
                            我已阅读并同意
                            <a href="/about/license" target="_blank">《用户协议》</a>、<a
                                href="/about/privacy"
                                target="_blank"
                                >《隐私政策》</a
                            >、<a href="/about/treaty" target="_blank">《创作公约》</a>
                        </el-checkbox>
                    </el-form-item>
                </el-form>
                <!-- 提交 -->
                <el-button class="u-submit u-button" type="primary" size="large" @click="submit" :disabled="!ready || submitting" :loading="submitting">
                    注册
                </el-button>

                <Union mode="register" :includes="['qq', 'wechat', 'weibo']" />

                <footer class="m-footer">
                    <p class="u-login">
                        已有账号?
                        <a :href="login_url">登录 &raquo;</a>
                    </p>
                    <p class="u-resetpwd">
                        <a href="/account/password_reset">忘记密码?</a>
                    </p>
                </footer>
            </main>

            <main v-if="success == true" class="m-main">
                <el-alert
                    title="注册成功"
                    type="success"
                    description="恭喜，您现在已经是「魔盒」的一员啦！"
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="login_url">立即登录</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert title="注册失败" type="error" :description="failtips" show-icon :closable="false"> </el-alert>
                <el-button class="u-button u-submit" type="primary" @click="reset" size="large">返回</el-button>
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
    validateAgreement,
    validateCode,
    validatePassword,
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
            failtips: "请求异常,请重试",

            homepage: __Root,
            redirect: "",

            code_text: "发送验证码",
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
                code: [{ validator: validateCode, trigger: "blur" }],
                pass: [{ validator: validatePassword, trigger: "blur" }],
                agreement: [{ validator: validateAgreement, trigger: "change" }],
            };
        },
    },
    methods: {
        handleEmailInput: function () {
            this.emailAvailable = null;
            this.emailRequestId++;
        },
        validateRegisterEmail: function (rule, value, callback) {
            if (!isValidEmail(value)) {
                this.emailAvailable = null;
                callback(new Error("必须为有效的Email,长度限3-50个字符"));
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
                        callback(new Error("邮箱地址已被使用"));
                        return;
                    }

                    callback();
                })
                .catch(() => {
                    if (requestId === this.emailRequestId) {
                        this.emailAvailable = null;
                    }
                    callback(new Error("邮箱校验失败，请稍后重试"));
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
                        this.failtips = "网络请求异常,请稍后重试";
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
                            msg = "抱歉,暂不支持该邮件服务商,请更换邮箱服务商";
                        } else {
                            msg = res.data.msg;
                        }
                        ElMessage.error(msg);
                        return;
                    }

                    ElMessage.success("验证码已发送至您的邮箱");
                    // 倒计时
                    this.interval = 60;
                    this.code_text = this.interval + "s";
                    this.clearCodeTimer();
                    this.codeTimer = setInterval(() => {
                        this.interval--;
                        this.code_text = this.interval + "s";
                        if (this.interval <= 0) {
                            this.clearCodeTimer();
                            this.code_text = "发送验证码";
                        }
                    }, 1000);
                })
                .catch(() => {
                    ElMessage.error("网络请求异常,请稍后重试");
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
