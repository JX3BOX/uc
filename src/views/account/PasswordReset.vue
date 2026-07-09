
<template>
    <div class="m-card" >
        <el-card class="box-card">
            <CardHeader />

            <main v-if="step == 0" class="m-main">
                <el-alert title="未知异常" type="error" description="非法请求或网络异常" show-icon :closable="false">
                </el-alert>
                <el-button class="u-button u-submit" type="primary" @click="reset">返回</el-button>
            </main>

            <!-- 1.是否存在可找回 -->
            <main v-if="step == 1" class="m-main">
                <el-form ref="accountForm" :model="form" :rules="accountRules" @submit.prevent="start">
                    <!-- 邮箱或手机号 -->
                    <el-form-item class="u-account" prop="account">
                        <el-input
                            class="u-text u-account"
                            v-model.trim="form.account"
                            placeholder="邮箱地址 / 手机号"
                            minlength="3"
                            maxlength="50"
                            name="account"
                            autocomplete="username"
                            @input="handleAccountInput"
                            size="large"
                        >
                            <template #prepend>
                                <i :class="recoverMode === 'phone' ? 'el-icon-phone' : 'el-icon-message'"></i>
                            </template>
                        </el-input>
                        <i v-show="accountValid == true" class="el-icon-success u-ok"></i>
                    </el-form-item>
                    <el-button
                        class="u-submit u-button"
                        type="primary"
                        native-type="submit"
                        :disabled="!available || account_checking"
                        :loading="account_checking"
                        size="large"
                    >下一步</el-button>
                </el-form>
                <footer class="m-footer">
                    <p class="u-login">已有账号? <a href="/account/login">登录 &raquo;</a></p>
                    <p class="u-register">
                        <a href="/account/register">免费注册</a>
                    </p>
                </footer>
            </main>

            <!-- 2.填写验证码与新密码 -->
            <main v-if="step == 2" class="m-main">
                <el-alert class="u-notice" :title="codeNotice" type="success" :closable="false"> </el-alert>

                <el-form ref="resetForm" :model="form" :rules="resetRules" @submit.prevent="done">
                    <!-- 验证码 -->
                    <el-form-item class="u-code" prop="code">
                        <el-input class="u-text u-code" v-model="form.code" placeholder="验证码" size="large" minlength="6" maxlength="6" name="code" autocomplete="one-time-code">
                            <template #prepend>
                                <i class="el-icon-key"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <!-- 新密码 -->
                    <el-form-item class="u-pass" prop="pwd1">
                        <el-input class="u-text" placeholder="新密码" size="large" v-model="form.pwd1" show-password name="password" autocomplete="new-password">
                            <template #prepend>
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <!-- 重复密码 -->
                    <el-form-item class="u-pass" prop="pwd2">
                        <el-input class="u-text" placeholder="重复密码" size="large" v-model="form.pwd2" show-password name="password_confirmation" autocomplete="new-password">
                            <template #prepend>
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!-- 提交 -->
                    <el-button class="u-submit u-button" type="primary" native-type="submit" size="large" :disabled="!ready || submitting" :loading="submitting">提交</el-button>
                </el-form>
            </main>

            <!-- 3.提交后 -->
            <main v-if="step == 3" class="m-main">
                <!-- 成功 -->
                <template v-if="success == true">
                    <el-alert title="重设成功" type="success" description="您的密码已重设" show-icon :closable="false">
                    </el-alert>
                    <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" href="/account/login">立即登录</a>
                </template>

                <!-- 失败 -->
                <template v-if="success == false">
                    <el-alert title="操作失败" type="error" :description="failtips" show-icon :closable="false">
                    </el-alert>
                    <el-button class="u-button u-submit" type="primary" @click="reset" size="large">返回</el-button>
                </template>
            </main>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import { sendCode, sendPhoneCode, resetPassword, resetPhonePassword } from "@/service/account/password.js";
import { checkEmail } from "@/service/account/email.js";
import { __Root } from "@/utils/config";
import {ElMessage} from "element-plus";
import {
    isValidAccountLogin,
    isValidCode,
    isValidEmail,
    isValidLoginPhone,
    isValidPassword,
    validateAccountLogin,
    validateCode,
    validatePassword,
} from "@/utils/account/validators.js";
export default {
    name: "Password_Reset",
    data: function () {
        return {
            step: 1,
            success: false,

            form: {
                account: "",
                code: "",
                pwd1: "",
                pwd2: "",
            },
            recoverMode: "",
            accountValid: null,
            account_checking: false,

            failtips: "",
            submitting: false,

            homepage: __Root,
        };
    },
    computed: {
        available: function () {
            return isValidAccountLogin(this.form.account);
        },
        accordance: function () {
            return this.form.pwd1 === this.form.pwd2;
        },
        ready: function () {
            return (
                this.available &&
                isValidCode(this.form.code) &&
                isValidPassword(this.form.pwd1) &&
                this.accordance
            );
        },
        accountRules: function () {
            return {
                account: [{ validator: this.validateRecoverableAccount, trigger: "blur" }],
            };
        },
        resetRules: function () {
            return {
                code: [{ validator: validateCode, trigger: "blur" }],
                pwd1: [{ validator: validatePassword, trigger: "blur" }],
                pwd2: [{ validator: this.validateConfirmPassword, trigger: "blur" }],
            };
        },
        codeNotice: function () {
            return this.recoverMode === "phone"
                ? "请填写手机收到的验证码"
                : "请填写邮箱收到的验证码 (60分钟内有效)";
        },
    },
    methods: {
        getRecoverMode: function (value) {
            if (isValidEmail(value)) return "email";
            if (isValidLoginPhone(value)) return "phone";
            return "";
        },
        handleAccountInput: function () {
            this.accountValid = null;
            this.recoverMode = this.getRecoverMode(this.form.account);
            this.$refs.accountForm?.clearValidate("account");
        },
        validateRecoverableAccount: function (rule, value, callback) {
            validateAccountLogin(rule, value, (error) => {
                if (error) {
                    callback(error);
                    return;
                }

                if (this.accountValid === false) {
                    callback(new Error("账号不存在"));
                    return;
                }

                callback();
            });
        },
        validateConfirmPassword: function (rule, value, callback) {
            if (!value) {
                callback(new Error("请再次输入密码"));
                return;
            }

            if (value !== this.form.pwd1) {
                callback(new Error("两次密码不一致"));
                return;
            }

            callback();
        },
        start: async function () {
            if (this.account_checking) return;

            try {
                await this.$refs.accountForm.validate();
            } catch (e) {
                return;
            }

            const account = this.form.account;
            const mode = this.getRecoverMode(account);
            this.recoverMode = mode;
            this.account_checking = true;

            if (mode === "email") {
                checkEmail(account)
                .then((res) => {
                    // 可以使用代表不存在
                    const isExist = res.data.data?.isExist;
                    if (account !== this.form.account) return;

                    this.accountValid = isExist;
                    if (!isExist) {
                        this.$refs.accountForm?.validateField("account").catch(() => {});
                        return;
                    }

                    return sendCode(account).then((res) => {
                        if (account !== this.form.account) return;

                        if (!res.data.code) {
                            this.step = 2;
                        } else {
                            ElMessage.error(res.data.msg || "验证码发送失败");
                        }
                    });
                })
                .catch(() => {
                    this.step = 0;
                })
                .finally(() => {
                    this.account_checking = false;
                });
                return;
            }

            sendPhoneCode(account)
                .then((res) => {
                    if (account !== this.form.account) return;

                    if (!res.data.code) {
                        this.accountValid = true;
                        this.step = 2;
                    } else if (res.data.code === 20047) {
                        this.accountValid = false;
                        this.$refs.accountForm?.validateField("account").catch(() => {});
                    } else {
                        ElMessage.error(res.data.msg || "验证码发送失败");
                    }
                })
                .catch(() => {
                    this.step = 0;
                })
                .finally(() => {
                    this.account_checking = false;
                });
        },
        done: async function () {
            if (this.submitting) return;

            try {
                await this.$refs.resetForm.validate();
            } catch (e) {
                return;
            }

            this.submitting = true;
            const mode = this.recoverMode || this.getRecoverMode(this.form.account);
            const action = mode === "phone" ? resetPhonePassword : resetPassword;
            const payload = {
                code: this.form.code,
                password: this.form.pwd1,
            };

            if (mode === "phone") {
                payload.phone = this.form.account;
            } else {
                payload.email = this.form.account;
            }

            action(payload)
                .then((res) => {
                    this.step = 3;
                    if (!res.data.code) {
                        this.success = true;
                    } else {
                        this.failtips = res.data.msg;
                        this.success = false;
                    }
                })
                .catch((err) => {
                    this.step = 0;
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        reset: function () {
            this.step = 1;
            this.success = null;
            this.form.account = "";
            this.recoverMode = "";
            this.accountValid = null;
            this.account_checking = false;
            this.form.code = "";
            this.form.pwd1 = "";
            this.form.pwd2 = "";
            this.submitting = false;
            this.$refs.accountForm?.clearValidate();
            this.$refs.resetForm?.clearValidate();
        },
    },

    mounted: function () {},
    components: {
        CardHeader,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/pwd_reset.less";
</style>
