<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <template v-if="!isLogin || isAlternate">
                <main v-if="success == null" class="m-main">
                    <form ref="loginForm">
                        <!-- 账号 -->
                        <div class="u-email">
                            <el-input class="u-text u-email" v-model="email" placeholder="邮箱地址" minlength="3" maxlength="50" @change="checkEmail">
                                <template slot="prepend">
                                    <i class="el-icon-message"></i>
                                </template>
                            </el-input>
                            <div class="u-tip">
                                <el-alert v-show="email_validate == false" :title="email_validate_tip" type="error" show-icon :closable="false"></el-alert>
                            </div>
                        </div>

                        <!-- 密码 -->
                        <div class="u-pass">
                            <el-input class="u-text" placeholder="输入密码" v-model="pass" show-password @input="checkPass" @keyup.enter.native="submit">
                                <template slot="prepend">
                                    <i class="el-icon-lock"></i>
                                </template>
                            </el-input>
                            <div class="u-tip">
                                <el-alert v-show="pass_validate == false" :title="pass_validate_tip" type="error" show-icon :closable="false"></el-alert>
                            </div>
                        </div>

                        <!-- 提交 -->
                        <el-button class="u-submit u-button" type="primary" @click="submit">登录</el-button>
                    </form>

                    <Union mode="login" :includes="['qq', 'wechat', 'weibo']" />

                    <footer class="m-footer">
                        <p class="u-login">
                            还没有账号?
                            <a :href="register_url">立即注册 &raquo;</a>
                        </p>
                        <p class="u-resetpwd">
                            <a href="../password_reset">忘记密码?</a>
                        </p>
                    </footer>
                </main>

                <main v-if="success == true" class="m-main">
                    <el-alert title="登录成功" type="success" description="欢迎回来(#^.^#)" show-icon :closable="false"> </el-alert>
                    <a class="u-skip el-button u-button el-button--primary" :href="redirect">{{ redirect_button }}</a>
                </main>

                <main v-if="success == false" class="m-main">
                    <el-alert title="登录失败" type="error" :description="errors" show-icon :closable="false"> </el-alert>
                    <el-button class="u-button u-submit" type="primary" @click="reset">返回</el-button>
                </main>
            </template>
            <template v-else>
                <div class="m-login-in">
                    <el-alert class="u-current-info" type="warning" show-icon :closable="false" center>
                        <span slot="title"
                            >已登录为 <b>{{ username }}</b></span
                        >
                    </el-alert>
                    <el-button class="u-logout" type="danger" @click="logout" size="medium">登 出</el-button>
                </div>
            </template>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import Union from "@/components/account/Union.vue";
const { validator } = require("sterilizer");
const cookie = require("@/utils/cookie");
import { loginByEmail } from "@/service/account/email.js";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import Msg from "@/components/account/Msg.vue";
export default {
    name: "Login",
    data: function () {
        return {
            success: null,

            redirect: "",
            redirect_button: "",
            errors: "未知异常",

            email: "",
            email_validate: null,
            email_validate_tip: "用户名有效长度为3-50个字符",

            pass: "",
            pass_validate: null,
            pass_validate_tip: "密码有效长度为6-50个字符",

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
        ready: function () {
            return this.email_validate && this.pass_validate;
        },
        register_url: function () {
            return "../register?redirect=" + this.redirect;
        },
    },
    methods: {
        checkEmail: function () {
            // 如果为空
            if (this.email == "") {
                this.email_validate = false;
                return;
            }

            // 校验格式
            let result = validator(this.email, {
                len: [3, 50],
            });
            this.email_validate = result;
        },
        checkPass: function () {
            // 如果为空
            if (this.pass == "") {
                this.pass_validate = false;
                return;
            }

            // 校验格式
            let result = validator(this.pass, {
                len: [6, 50],
            });
            this.pass_validate = result;
        },
        submit: function () {
            if (this.isfrozen()) return;

            // FIX:当使用填充器时,无法激活change事件,则提交时验证
            if (!this.ready) {
                this.checkPass();
                this.checkEmail();
            }

            if (this.ready) {
                loginByEmail({
                    email: this.email,
                    pass: this.pass,
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
                                avatar: data?.user?.user_avatar || '',
                            }
                            User.update(_data)
                                .then(() => {

                                    if (this.isAlternate) {
                                        localStorage.setItem(`jx3box-alternate-${_data.uid}`, JSON.stringify({
                                            ..._data,
                                            created_at: Number(localStorage.getItem("created_at")),
                                        }));
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
                    });
            }
        },
        reset: function () {
            this.success = null;
            this.email = "";
            this.email_validate = null;
            this.pass = "";
            this.pass_validate = null;
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
            User.generateFingerprint();
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
    filters: {},
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
