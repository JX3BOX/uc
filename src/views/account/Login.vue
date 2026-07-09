<template>
    <div class="m-card" >
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <template v-if="!isLogin || isAlternate">
                <main v-if="success == null" class="m-main">
                    <el-form ref="loginForm" :model="form" :rules="loginRules" class="m-form" @submit.prevent>
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
                                size="large"
                            >

                                <template #prepend>
                                    <i class="el-icon-message"></i>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 密码 -->
                        <el-form-item class="u-pass" prop="pass">
                            <el-input
                                class="u-text"
                                placeholder="输入密码"
                                v-model="form.pass"
                                show-password
                                name="password"
                                autocomplete="current-password"
                                @keyup.enter="submit"
                                size="large"
                            >
                                <template #prepend>
                                    <i class="el-icon-lock"></i>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 提交 -->
                        <el-button class="u-submit u-button" type="primary" @click="submit" :loading="submitting" size="large">登录</el-button>
                    </el-form>

                    <Union mode="login" :includes="['qq', 'wechat', 'weibo']" />

                    <footer class="m-footer">
                        <p class="u-login">
                            还没有账号?
                            <a :href="register_url">立即注册 &raquo;</a>
                        </p>
                        <p class="u-resetpwd">
                            <a :href="reset_url">忘记密码?</a>
                        </p>
                    </footer>
                </main>

                <main v-if="success == true" class="m-main">
                    <el-alert title="登录成功" type="success" description="欢迎回来(#^.^#)" show-icon :closable="false">
                    </el-alert>
                    <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="redirect">{{ redirect_button }}</a>
                </main>

                <main v-if="success == false" class="m-main">
                    <el-alert title="登录失败" type="error" :description="errors" show-icon :closable="false">
                    </el-alert>
                    <el-button class="u-button u-submit" type="primary" @click="reset" size="large">返回</el-button>
                </main>
            </template>
            <template v-else>
                <div class="m-login-in">
                    <el-alert class="u-current-info" type="warning" show-icon :closable="false" center>
                        <template #title>
                            <span
                                >已登录为 <b>{{ username }}</b></span
                            >
                        </template>
                    </el-alert>
                    <el-button class="u-logout" type="danger" @click="logout" size="large" icon="SwitchButton">登 出</el-button>
                </div>
            </template>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import Union from "@/components/account/Union.vue";
const cookie = require("@/utils/cookie");
import { loginByEmail } from "@/service/account/email.js";
import { __Root, __Links } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import Msg from "@/components/account/Msg.vue";
import { validateEmail, validatePassword } from "@/utils/account/validators.js";
import { ensureDeviceFingerprint } from "@/utils/account/fingerprint.js";
export default {
    name: "Login",
    data: function () {
        return {
            success: null,

            redirect: "",
            redirect_button: "",
            errors: "未知异常",

            form: {
                email: "",
                pass: "",
            },
            submitting: false,

            homepage: __Root,

            failcount: 0,
            faillimit: 10,
            device_id: "",

            isLogin: User.isLogin(),
            username: User.getInfo().name,

            isAlternate: false,
        };
    },
    computed: {
        loginRules: function () {
            return {
                email: [{ validator: validateEmail, trigger: "blur" }],
                pass: [{ validator: validatePassword, trigger: "blur" }],
            };
        },
        register_url: function () {
            return __Links.account.register + "?redirect=" + this.redirect;
        },
        reset_url: function () {
            return "/account/password_reset";
        },
    },
    methods: {
        submit: async function () {
            if (this.isfrozen()) return;
            if (this.submitting) return;

            try {
                await this.$refs.loginForm.validate();
            } catch (e) {
                return;
            }

            this.submitting = true;
            try {
                loginByEmail({
                    email: this.form.email,
                    pass: this.form.pass,
                    // device_id: this.device_id,
                })
                    .then((res) => {
                        if (!res.data.code) {
                            this.success = true;
                            let data = res.data.data;
                            const _data = {
                                token: data.token,
                                uid: data?.user?.ID,
                                group: data?.user?.user_group || 1,
                                name: data?.user?.display_name,
                                status: data?.user?.user_status,
                                bind_wx: data?.user?.wechat_unionid ? 1 : 0,
                                avatar: data?.user?.user_avatar || "",
                            };
                            User.update(_data)
                                .then(() => {
                                    if (this.isAlternate) {
                                        localStorage.setItem(
                                            `jx3box-alternate-${_data.uid}`,
                                            JSON.stringify({
                                                ..._data,
                                                created_at: Number(localStorage.getItem("created_at")),
                                            })
                                        );
                                    }

                                    // 跳转至来源页
                                    this.skip();
                                })
                                .catch((err) => {
                                    alert("浏览器版本太低,不支持本站");
                                });
                        } else {
                            this.success = false;
                            this.errors = res.data.msg;
                            this.failcount++;
                            this.frozen();
                        }
                    })
                    .catch((err) => {
                        this.success = false;
                        this.errors = "网络异常或非法请求";
                    })
                    .finally(() => {
                        this.submitting = false;
                    });
            } catch (e) {
                this.submitting = false;
            }
        },
        reset: function () {
            this.success = null;
            this.form.email = "";
            this.form.pass = "";
            this.$refs.loginForm?.clearValidate();
        },
        frozen: function () {
            if (this.failcount >= this.faillimit) {
                cookie.set("loginIsFrozen", "true", 86400);
            }
        },
        isfrozen: function () {
            if (this.failcount >= this.faillimit) {
                this.success = false;
                this.errors = "失败次数过多,请24小时后再试";
                return true;
            }
            return false;
        },
        checkDirect: function () {
            let search = new URLSearchParams(document.location.search);
            let redirect = search.get("redirect");
            if (redirect) {
                this.redirect = redirect;
                this.redirect_button = "即将跳转";
            } else {
                this.redirect = this.homepage;
                this.redirect_button = "返回首页";
            }
            let alternate = search.get("alternate");

            if (~~alternate) {
                this.isAlternate = true;

                sessionStorage.setItem("alternate", 1);
            }
        },
        checkDeviceID: function () {
            ensureDeviceFingerprint();
        },
        skip: function () {
            if (this.redirect) {
                setTimeout(() => {
                    location.href = decodeURIComponent(this.redirect);
                }, 1200);
            }
        },
        logout: function () {
            User.destroy().then(() => {
                location.reload();
            });
        },
    },
    mounted: function () {
        this.checkDirect();
    },
    created: function () {
        this.checkDeviceID();
    },
    components: {
        CardHeader,
        Union,
        Msg,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";
</style>
