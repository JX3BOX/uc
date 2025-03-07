<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />

            <main v-if="step == 0" class="m-main">
                <el-alert
                    title="未知异常"
                    type="error"
                    description="非法请求或网络异常"
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <el-button
                    class="u-button u-submit"
                    type="primary"
                    @click="reset"
                    >返回</el-button
                >
            </main>

            <!-- 1.是否存在可找回 -->
            <main v-if="step == 1" class="m-main">
                <el-alert
                    title="找回密码,请填写绑定的邮箱"
                    type="warning"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <!-- 邮箱 -->
                <div class="u-email">
                    <el-input
                        class="u-text u-email"
                        v-model="email"
                        placeholder="邮箱地址"
                        minlength="3"
                        maxlength="50"
                        type="email"
                        @input="checkEmail"
                    >
                        <template slot="prepend">
                            <i class="el-icon-message"></i>
                        </template>
                    </el-input>
                    <i
                        v-show="email_valid == true"
                        class="el-icon-success u-ok"
                    ></i>
                    <div class="u-tip">
                        <el-alert
                            v-show="email_validate == false"
                            :title="email_validate_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                        <el-alert
                            v-show="email_valid == false"
                            :title="email_valid_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                    </div>
                    <el-button
                        class="u-button"
                        type="primary"
                        @click="start"
                        :disabled="!available"
                        >下一步</el-button
                    >
                </div>
                <footer class="m-footer">
                    <p class="u-login">
                        已有账号? <a href="../login">登录 &raquo;</a>
                    </p>
                    <p class="u-register">
                        <a href="../register">免费注册</a>
                    </p>
                </footer>
            </main>

            <!-- 2.填写验证码与新密码 -->
            <main v-if="step == 2" class="m-main">
                <el-alert
                    title="请填写邮箱收到的验证码 (60分钟内有效)"
                    type="success"
                    :closable="false"
                >
                </el-alert>

                <!-- 验证码 -->
                <div class="u-code">
                    <el-input
                        class="u-text u-code"
                        v-model="code"
                        placeholder="验证码"
                        minlength="6"
                        maxlength="6"
                    >
                        <template slot="prepend">
                            <i class="el-icon-key"></i>
                        </template>
                    </el-input>
                    <i
                        v-show="code_available == true"
                        class="el-icon-success u-ok"
                    ></i>
                    <div class="u-tip">
                        <el-alert
                            v-show="code_validate == false"
                            :title="code_validate_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                        <el-alert
                            v-show="code_available == false"
                            :title="code_available_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                    </div>
                </div>

                <!-- 新密码 -->
                <div class="u-pass">
                    <el-input
                        class="u-text"
                        placeholder="新密码"
                        v-model="pwd1"
                        show-password
                        @change="checkPass"
                    >
                        <template slot="prepend">
                            <i class="el-icon-lock"></i>
                        </template>
                    </el-input>
                    <div class="u-tip">
                        <el-alert
                            v-show="pass_validate == false"
                            :title="pass_validate_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                    </div>
                </div>

                <!-- 重复密码 -->
                <div class="u-pass">
                    <el-input
                        class="u-text"
                        placeholder="重复密码"
                        v-model="pwd2"
                        show-password
                        @input="checkPass"
                    >
                        <template slot="prepend">
                            <i class="el-icon-lock"></i>
                        </template>
                    </el-input>
                    <div class="u-tip">
                        <el-alert
                            v-show="pwd2 && accordance == false"
                            :title="pass_accordance_tip"
                            type="error"
                            show-icon
                            :closable="false"
                        ></el-alert>
                    </div>
                </div>

                <!-- 提交 -->
                <el-button
                    class="u-submit u-button"
                    type="primary"
                    @click="done"
                    :disabled="!ready"
                    >提交</el-button
                >
            </main>

            <!-- 3.提交后 -->
            <main v-if="step == 3" class="m-main">
                <!-- 成功 -->
                <template v-if="success == true">
                    <el-alert
                        title="重设成功"
                        type="success"
                        description="您的密码已重设"
                        show-icon
                        :closable="false"
                    >
                    </el-alert>
                    <a
                        class="u-skip el-button u-button el-button--primary"
                        href="../login"
                        >立即登录</a
                    >
                </template>

                <!-- 失败 -->
                <template v-if="success == false">
                    <el-alert
                        title="操作失败"
                        type="error"
                        :description="failtips"
                        show-icon
                        :closable="false"
                    >
                    </el-alert>
                    <el-button
                        class="u-button u-submit"
                        type="primary"
                        @click="reset"
                        >返回</el-button
                    >
                </template>
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
const { validator } = require("sterilizer");
import { sendCode, checkCode, resetPassword } from "@/service/account/password.js";
import { checkEmail } from "@/service/account/email.js";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Password_Reset",
    data: function() {
        return {
            step: 1,
            success: false,

            email: "",
            email_validate: null,
            email_validate_tip: "邮箱地址格式不正确",
            email_valid: null,
            email_valid_tip: "账号不存在",

            code: "",
            code_validate: null,
            code_validate_tip: "验证码格式不正确",
            code_available: null,
            code_available_tip: "验证码无效",

            pwd1: "",
            pwd2: "",
            pass_validate: null,
            pass_validate_tip: "密码有效长度为6-50个字符",
            pass_accordance_tip: "两次密码不一致",

            failtips:"",

            homepage: __Root,
        };
    },
    computed: {
        available: function() {
            return this.email_validate && this.email_valid;
        },
        accordance: function() {
            return this.pwd1 === this.pwd2;
        },
        ready: function() {
            return (
                this.available &&
                // this.code_validate &&
                // this.code_available &&
                this.pass_validate &&
                this.accordance
            );
        },
    },
    methods: {
        checkEmail: function() {
            // 如果为空
            if (this.email == "") {
                this.email_validate = null;
                this.email_valid = null;
                return;
            }

            // 校验格式
            let result = validator(this.email, {
                isEmail: true,
                len: [3, 50],
            });
            this.email_validate = result;

            // 检查是否存在
            if (result) {
                checkEmail(this.email).then((res) => {
                    // 可以使用代表不存在
                    this.email_valid = res.data.data?.isExist
                });
            } else {
                this.email_valid = null;
            }
        },
        checkPass: function() {
            // 如果为空
            if (this.pwd1 == "") {
                this.pass_validate = null;
            }

            // 校验第1个值
            this.pass_validate = validator(this.pwd1, {
                len: [6, 50],
            });
        },
        start: function() {
            sendCode(this.email).then((res) => {
                if (!res.data.code) {
                    this.step = 2;
                } else {
                    this.$message.error(res.data.msg);
                    this.step = 0;
                }
            });
        },
        checkCode: function() {
            // 如果为空
            if (this.code == "") {
                this.code_validate = null;
                this.code_available = null;
                return;
            }

            // 校验格式
            let result = validator(this.code, {
                isAlphanumeric: true,
                len: 6,
            });
            this.code_validate = result;

            // 检查是否存在
            if (result) {
                checkCode({
                    email: this.email,
                    code: this.code,
                }).then((res) => {
                    this.code_available = res.data.data;
                });
            } else {
                this.code_available = null;
            }
        },
        done: function() {
            resetPassword({
                email: this.email,
                code: this.code,
                password: this.pwd1,
            }).then((res) => {
                this.step = 3;
                if(!res.data.code){
                    this.success = true;
                }else{
                    this.failtips = res.data.msg
                    this.success = false;
                }
            }).catch((err) => {
                this.step = 0
            })
        },
        reset: function() {
            this.step = 1;
            this.success = null;
            this.email = "";
            this.email_validate = null;
            this.email_valid = null;
            this.code = "";
            this.code_validate = null;
            this.code_available = null;
            this.pwd1 = "";
            this.pwd2 = "";
            this.pass_validate = null;
        },
    },
    filters: {},
    mounted: function() {},
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
