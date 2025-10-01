<template>
    <div class="m-card m-register" id="app">
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <main v-if="success == null" class="m-main">
                <form ref="registerForm" class="m-form">
                    <!-- 账号 -->
                    <div class="u-email">
                        <el-input class="u-text u-email" v-model="email" placeholder="邮箱地址" minlength="3" maxlength="50" type="email" @change="checkEmail">
                            <template slot="prepend">
                                <i class="el-icon-message"></i>
                            </template>
                        </el-input>
                        <i v-show="email_available == true" class="el-icon-success u-ok"></i>
                        <div class="u-tip">
                            <el-alert v-show="email_validate == false" :title="email_validate_tip" type="error" show-icon :closable="false"></el-alert>
                            <el-alert v-show="email_available == false" :title="email_available_tip" type="error" show-icon :closable="false"></el-alert>
                        </div>
                    </div>

                    <!-- 验证码 -->
                    <div class="u-code">
                        <el-input class="u-text" placeholder="验证码" v-model="code">
                            <template slot="prepend">
                                <i class="el-icon-postcard"></i>
                            </template>
                        </el-input>
                        <el-button class="u-code-btn" size="mini" type="primary" @click="getCode" :disabled="code_disabled">{{ code_text }}</el-button>
                    </div>

                    <!-- 密码 -->
                    <div class="u-pass">
                        <el-input class="u-text" placeholder="输入密码" v-model="pass" show-password @input="checkPass">
                            <template slot="prepend">
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                        <div class="u-tip">
                            <el-alert v-show="pass_validate == false" :title="pass_validate_tip" type="error" show-icon :closable="false"></el-alert>
                        </div>
                    </div>

                    <!-- 邀请码 -->
                    <div class="u-invite">
                        <el-input class="u-text" placeholder="邀请码（非必填）" v-model="invite">
                            <template slot="prepend">
                                <i class="el-icon-present"></i>
                            </template>
                        </el-input>
                    </div>

                    <div class="u-terms">
                        <el-checkbox v-model="agreement" class="u-checkbox">
                            我已阅读并同意
                            <a href="/about/license" target="_blank">《用户协议》</a>、<a href="/about/privacy" target="_blank">《隐私政策》</a>、<a href="/about/treaty" target="_blank"
                                >《创作公约》</a
                            >
                        </el-checkbox>
                    </div>

                </form>
                <!-- 提交 -->
                <el-button class="u-submit u-button" type="primary" @click="submit" :disabled="!ready"> 注册 </el-button>

                <Union mode="register" :includes="['qq','wechat','weibo']" />

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
                <el-alert title="注册成功" type="success" description="恭喜，您现在已经是「魔盒」的一员啦！" show-icon :closable="false"> </el-alert>
                <a class="u-skip el-button u-button el-button--primary" :href="login_url">立即登录</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert title="注册失败" type="error" :description="failtips" show-icon :closable="false"> </el-alert>
                <el-button class="u-button u-submit" type="primary" @click="reset">返回</el-button>
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
const { validator } = require("sterilizer");
import CardHeader from "@/components/account/CardHeader.vue";
import { checkEmail, registerByEmail, verifyEmail } from "@/service/account/email.js";
import { __Root } from "@/utils/config";
import Msg from "@/components/account/Msg.vue";
import Union from "@/components/account/Union.vue";

export default {
    name: "Register",
    data: function () {
        return {
            email: "",
            email_validate: null,
            email_validate_tip: "必须为有效的Email,长度限3-50个字符",
            email_available: null,
            email_available_tip: "邮箱地址已被使用",

            pass: "",
            pass_validate: null,
            pass_validate_tip: "密码有效长度为6-50个字符",

            invite: "",

            success: null,
            failtips: "请求异常,请重试",

            homepage: __Root,
            redirect: "",

            agreement: false,

            code: "",
            code_text: "发送验证码",
            interval: 0,
        };
    },
    computed: {
        ready: function () {
            return this.email_validate && this.email_available && this.pass_validate && this.agreement;
        },
        login_url: function () {
            return "/account/login?redirect=" + this.redirect;
        },
        code_disabled: function () {
            return !this.email || !this.email_available || this.interval > 0;
        },
    },
    methods: {
        checkEmail: function () {
            // 如果为空
            if (this.email == "") {
                this.email_validate = null;
                this.email_available = null;
                return;
            }

            // 校验格式
            let result = validator(this.email, {
                isEmail: true,
                len: [3, 50],
            });
            this.email_validate = result;

            // 检查可用性
            if (result) {
                checkEmail(this.email).then((res) => {
                    this.email_available = !res.data.data.isExist;
                });
            } else {
                this.email_available = null;
            }
        },
        checkPass: function () {
            // 如果为空
            if (this.pass == "") {
                this.pass_validate = null;
                return;
            }

            // 校验格式
            this.pass_validate = validator(this.pass, {
                len: [6, 50],
            });
        },
        submit: function () {
            if (this.ready) {
                verifyEmail({
                    email: this.email,
                    password: this.pass,
                    invitation: this.invite,
                    code: this.code,
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
                    });
            }
        },
        reset: function () {
            this.success = null;
            this.agreement = false;
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
        getCode: function () {
            registerByEmail({ email: this.email }).then(res => {

                if(res.data.code){
                    let msg = '';
                    if(res.data.code == 99999){
                        msg = '抱歉,暂不支持该邮件服务商,请更换邮箱服务商';
                    }else{
                        msg = res.data.msg;
                    }
                    this.$message({
                        message: msg,
                        type: "error",
                    });
                    return;
                }

                this.$message({
                    message: "验证码已发送至您的邮箱",
                    type: "success",
                });
                // 倒计时
                this.interval = 60;
                this.code_text = this.interval + "s";
                let timer = setInterval(() => {
                    this.interval--;
                    this.code_text = this.interval + "s";
                    if (this.interval <= 0) {
                        clearInterval(timer);
                        this.code_text = "发送验证码";
                    }
                }, 1000);
            })
        },
    },
    filters: {},
    mounted: function () {
        this.checkDirect();
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
