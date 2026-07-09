
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
                <el-form ref="emailForm" :model="form" :rules="emailRules" @submit.prevent>
                    <!-- 邮箱 -->
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
                        <i v-show="emailValid == true" class="el-icon-success u-ok"></i>
                    </el-form-item>
                    <el-button
                        class="u-submit u-button"
                        type="primary"
                        @click="start"
                        :disabled="!available || email_checking"
                        :loading="email_checking"
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
                <el-alert class="u-notice" title="请填写邮箱收到的验证码 (60分钟内有效)" type="success" :closable="false"> </el-alert>

                <el-form ref="resetForm" :model="form" :rules="resetRules" @submit.prevent>
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
                </el-form>

                <!-- 提交 -->
                <el-button class="u-submit u-button" type="primary" @click="done" size="large" :disabled="!ready || submitting" :loading="submitting">提交</el-button>
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
import { sendCode, resetPassword } from "@/service/account/password.js";
import { checkEmail } from "@/service/account/email.js";
import { __Root } from "@/utils/config";
import {ElMessage} from "element-plus";
import {
    isValidCode,
    isValidEmail,
    isValidPassword,
    validateCode,
    validateEmail,
    validatePassword,
} from "@/utils/account/validators.js";
export default {
    name: "Password_Reset",
    data: function () {
        return {
            step: 1,
            success: false,

            form: {
                email: "",
                code: "",
                pwd1: "",
                pwd2: "",
            },
            emailValid: null,
            email_checking: false,

            failtips: "",
            submitting: false,

            homepage: __Root,
        };
    },
    computed: {
        available: function () {
            return isValidEmail(this.form.email);
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
        emailRules: function () {
            return {
                email: [{ validator: validateEmail, trigger: "blur" }],
            };
        },
        resetRules: function () {
            return {
                code: [{ validator: validateCode, trigger: "blur" }],
                pwd1: [{ validator: validatePassword, trigger: "blur" }],
                pwd2: [{ validator: this.validateConfirmPassword, trigger: "blur" }],
            };
        },
    },
    methods: {
        handleEmailInput: function () {
            this.emailValid = null;
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
            if (this.email_checking) return;

            try {
                await this.$refs.emailForm.validate();
            } catch (e) {
                return;
            }

            const email = this.form.email;
            this.email_checking = true;
            checkEmail(email)
                .then((res) => {
                    // 可以使用代表不存在
                    const isExist = res.data.data?.isExist;
                    if (email !== this.form.email) return;

                    this.emailValid = isExist;
                    if (!isExist) {
                        ElMessage.error("账号不存在");
                        return;
                    }

                    return sendCode(email).then((res) => {
                        if (email !== this.form.email) return;

                        if (!res.data.code) {
                            this.step = 2;
                        } else {
                            ElMessage.error(res.data.msg);
                            this.step = 0;
                        }
                    });
                })
                .catch(() => {
                    this.step = 0;
                })
                .finally(() => {
                    this.email_checking = false;
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
            resetPassword({
                email: this.form.email,
                code: this.form.code,
                password: this.form.pwd1,
            })
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
            this.form.email = "";
            this.emailValid = null;
            this.email_checking = false;
            this.form.code = "";
            this.form.pwd1 = "";
            this.form.pwd2 = "";
            this.submitting = false;
            this.$refs.emailForm?.clearValidate();
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
