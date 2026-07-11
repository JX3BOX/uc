<template>
    <div class="m-card" >
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <template v-if="!isLogin || isAlternate">
                <main v-if="success == null" class="m-main">
                    <el-form ref="loginForm" :model="form" :rules="loginRules" class="m-form" @submit.prevent>
                        <!-- 账号 -->
                        <el-form-item class="u-email" prop="account">
                            <el-input
                                class="u-text u-email"
                                v-model="form.account"
                                :placeholder="$t('account.common.accountPlaceholder')"
                                minlength="3"
                                maxlength="50"
                                type="text"
                                name="username"
                                autocomplete="username"
                                size="large"
                            >

                                <template #prepend>
                                    <i class="el-icon-user"></i>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 密码 -->
                        <el-form-item class="u-pass" prop="pass">
                            <el-input
                                class="u-text"
                                :placeholder="$t('account.common.passwordPlaceholder')"
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
                        <el-button class="u-submit u-button" type="primary" @click="submit" :loading="submitting" size="large">{{ $t("account.common.login") }}</el-button>
                    </el-form>

                    <Union mode="login" :includes="['qq', 'wechat', 'weibo']" />

                    <footer class="m-footer">
                        <p class="u-login">
                            {{ $t("account.login.noAccount") }}
                            <a :href="register_url">{{ $t("account.login.registerNow") }} &raquo;</a>
                        </p>
                        <p class="u-resetpwd">
                            <a :href="reset_url">{{ $t("account.common.forgotPassword") }}</a>
                        </p>
                    </footer>
                </main>

                <main v-if="success == true" class="m-main">
                    <el-alert :title="$t('account.login.successTitle')" type="success" :description="$t('account.login.successDescription')" show-icon :closable="false">
                    </el-alert>
                    <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="redirect">{{ redirect_button }}</a>
                </main>

                <main v-if="success == false" class="m-main">
                    <el-alert :title="$t('account.login.failureTitle')" type="error" :description="errors" show-icon :closable="false">
                    </el-alert>
                    <el-button class="u-button u-submit" type="primary" @click="reset" size="large">{{ $t("account.common.back") }}</el-button>
                </main>
            </template>
            <template v-else>
                <div class="m-login-in">
                    <el-alert class="u-current-info" type="warning" show-icon :closable="false" center>
                        <template #title>
                            <span
                                >{{ $t("account.login.loggedInAs") }} <b>{{ username }}</b></span
                            >
                        </template>
                    </el-alert>
                    <el-button class="u-logout" type="danger" @click="logout" size="large" icon="SwitchButton">{{ $t("account.common.logout") }}</el-button>
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
import { loginByAccount } from "@/service/account/email.js";
import { __Root, __Links } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import Msg from "@/components/account/Msg.vue";
import { isValidAccountLogin, isValidPassword } from "@/utils/account/validators.js";
import { ensureDeviceFingerprint } from "@/utils/account/fingerprint.js";
export default {
    name: "Login",
    data: function () {
        return {
            success: null,

            redirect: "",
            redirect_button: "",
            errors: this.$t("account.common.unknownError"),

            form: {
                account: "",
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
                account: [{ validator: this.validateAccount, trigger: "blur" }],
                pass: [{ validator: this.validateLoginPassword, trigger: "blur" }],
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
        validateAccount: function (rule, value, callback) {
            callback(isValidAccountLogin(value) ? undefined : new Error(this.$t("account.validation.account")));
        },
        validateLoginPassword: function (rule, value, callback) {
            callback(isValidPassword(value) ? undefined : new Error(this.$t("account.validation.password")));
        },
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
                loginByAccount({
                    account: this.form.account,
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
                                    alert(this.$t("account.login.browserUnsupported"));
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
                        this.errors = this.$t("account.common.invalidRequestOrNetwork");
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
            this.form.account = "";
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
                this.errors = this.$t("account.login.tooManyAttempts");
                return true;
            }
            return false;
        },
        checkDirect: function () {
            let search = new URLSearchParams(document.location.search);
            let redirect = search.get("redirect");
            if (redirect) {
                this.redirect = redirect;
                this.redirect_button = this.$t("account.login.redirecting");
            } else {
                this.redirect = this.homepage;
                this.redirect_button = this.$t("account.common.backHome");
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
