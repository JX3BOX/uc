<template>
    <el-dialog :visible="modelValue" @close="close" custom-class="m-email-dialog" :width="isPhone ? '90%' : '950px'">
        <div class="m-content">
            <div class="m-pic"></div>
            <div class="m-info">
                <div class="u-title">更新邮箱</div>
                <div class="u-email">
                    当前邮箱地址：<span class="u-value">{{ email || "当前未绑定邮箱" }}<el-tag v-if="email" class="u-status" :type="verified ? 'success' : 'warning'" size="mini">{{ verified ? '已验证' : '未验证' }}</el-tag></span>
                </div>

                <el-form :model="form" ref="form" :rules="rules" status-icon>
                    <el-form-item prop="email">
                        <el-input
                            v-model.trim="form.email"
                            size="large"
                            prefix-icon="el-icon-message"
                            placeholder="请输入邮箱"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="code" v-if="hasSendBindEmail" class="u-code-input">
                        <el-input
                            v-model.trim="form.code"
                            size="large"
                            prefix-icon="el-icon-lock"
                            placeholder="请输入验证码"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-alert class="u-alert" v-if="hasSendBindEmail" title="邮件发送成功" type="success" description="一封邮箱验证的邮件已发送至您的邮箱,请注意查收" show-icon :closable="false"> </el-alert>
                <div class="m-action">
                    <!-- 未发送验证邮件 -->
                    <el-button v-if="!hasSendBindEmail"
                        type="primary"
                        size="large"
                        :disabled="!!!form.email"
                        icon="el-icon-position"
                        @click="bind">
                        发送验证邮件</el-button>
                    <!-- 已发送验证邮件 -->
                    <el-button
                        v-if="hasSendBindEmail"
                        type="primary"
                        size="large"
                        :disabled="!!!form.code"
                        icon="el-icon-position"
                        @click="submit"
                        :loading="loading"
                        >确认</el-button
                    >
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { sendVerifyEmail, sendBindEmail, checkEmailAvailable } from "@/service/dashboard/profile";
export default {
    name: "email_dialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            default: "",
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            form: {
                email: "",
                code: ""
            },
            rules: {
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
                    { validator: this.checkEmail, trigger: "blur" },
                ],
            },
            loading: false,

            hasSendBindEmail: false,

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        btnText() {
            return this.hasSendBindEmail ? "确认" : "发送验证邮件";
        },
    },
    methods: {
        close() {
            this.$emit("update:modelValue", false);
            this.form.email = "";
            this.form.code = "";
            this.hasSendBindEmail = false;
            this.$refs.form.resetFields();
        },
        checkEmail(rule, value, callback) {
            if (value === this.email && this.verified) {
                callback(new Error("不可重复验证相同邮箱"));
            }
            checkEmailAvailable(value).then((res) => {
                if (res.data.data?.isExist) {
                    callback(new Error("邮箱已被绑定"));
                } else {
                    callback();
                }
            });
        },
        bind() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    sendBindEmail({
                        email: this.form.email,
                    }).then((res) => {
                        this.hasSendBindEmail = true;
                    });
                }
            });
        },
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    sendVerifyEmail(this.form.code).then((res) => {
                        this.$emit("update");
                        this.$message.success("邮箱绑定成功")
                        this.close();
                        this.loading = false;
                    });
                }
            });
        },
    },
};
</script>

<style lang="less">
.m-email-dialog {
    .m-pic {
        width: 500px;
        height: 500px;
        background: url("~@/assets/img/dashboard/setting/email.png") no-repeat 0 0;
        background-size: auto 100%;
    }

    .m-info {
        .pa;
        .rt(100px,150px);
        height: 500px;
    }

    .u-title {
        .bold;
        font-size: 32px;
        margin-bottom: 10px;
        .x;
    }

    .u-email {
        padding: 10px;
        font-size: 14px;
        color: #999;
        .flex;
        align-items: center;
    }

    .u-value {
        color: orange;
    }

    .u-status {
        margin-left: 5px;
    }

    .u-alert {
        margin-bottom: 20px;
    }

    .m-action {
        .x;
    }

    .el-form-item.is-success {
        .el-input__validateIcon {
            color: #67c23a;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-email-dialog {
        .m-pic {
            background: none;
            .none;
        }

        .m-info {
            .pr;
            .rt(0);
            height: auto;
        }
        .u-email {
            .flex;
            align-items: center;
            flex-direction: column;
            gap: 10px;
        }
    }
}
</style>
