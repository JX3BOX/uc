<template>
    <div class="m-notice-phone u-notice-box">
        <div class="u-notice-value">
            <span class="u-address" v-if="phone">{{ phoneStr(phone) }}</span>
            <el-tag class="u-notice-status" :type="phone ? 'success' : 'info'" size="small">{{
                phone ? "已绑定" : "未绑定"
            }}</el-tag>
        </div>
        <el-button type="primary" :circle="isPhone" class="u-bind-button" @click="visible = true" icon="el-icon-edit">{{
            phone ? "修改手机" : "绑定手机"
        }}</el-button>
        <el-dialog
            title="绑定手机"
            :visible.sync="visible"
            :width="isPhone ? '95%' : '400px'"
            custom-class="m-notice-phone__dialog"
            :before-close="handleClose"
            :close-on-click-modal="false"
        >
            <!-- <div class="m-phone-content" v-loading="loading">
                <img class="u-qr" src="@/assets/img/dashboard/bindphone.jpg" />
                <i class="u-tip">打开微信扫一扫，{{ phone ? "修改" : "绑定" }}手机号</i>
            </div> -->
            <div class="m-phone-content">
                <el-form :model="form" :rules="rules" status-icon ref="phoneRef">
                    <el-form-item label="" prop="user_phone">
                        <el-input v-model="form.user_phone" placeholder="输入手机号">
                            <template #prepend>
                                <i class="el-icon-phone"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="code">
                        <el-input v-model="form.code" placeholder="输入验证码">
                            <template #prepend>
                                <i class="el-icon-lock"></i>
                            </template>
                            <template #append>
                                <el-button :disabled="canSendCode" @click="sendCode">{{ interval > 0 ? interval + 's' : '发送验证码' }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button class="u-btn" type="primary" @click="verify" :disabled="!this.form.user_phone || !this.form.code">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProfile, sendPhoneCode, verifyPhone, checkPhone } from "@/service/dashboard/profile";
export default {
    name: "phone",
    data: function () {
        return {
            visible: false,

            phone: "",

            isPhone: window.innerWidth < 768,

            loading: false,

            form: {
                user_phone: "",
                code: "",
            },

            timer: null,
            interval: 0,
            // 已被绑定
            hasBind: false,

            rules: {
                user_phone: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                return callback(new Error("请输入手机号"));
                            }
                            if (!/^1[3456789]\d{9}$/.test(value)) {
                                return callback(new Error("手机号格式错误"));
                            }
                            if (value == this.phone) {
                                return callback(new Error("手机号未变更"));
                            }
                            checkPhone({ phone: value }).then((res) => {
                                if (!res.data.data) {
                                    this.hasBind = true;
                                    callback(new Error("手机号已被绑定"));
                                } else {
                                    callback();
                                }
                            });
                        },
                        trigger: "blur",
                    },
                ],
                code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
            }
        };
    },
    computed: {
        canSendCode() {
            return !this.form.user_phone || this.interval > 0 || this.form.user_phone == this.phone || this.hasBind;
        }
    },
    methods: {
        phoneStr: function (phone) {
            if (!phone) return "";
            return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        },
        onUpdate: function () {
            this.visible = false;
        },
        handleClose: function () {
            this.form.user_phone = "";
            this.form.code = "";
            this.interval = 0;
            this.visible = false;
            clearInterval(this.timer);
            this.$refs.phoneRef.clearValidate();
        },
        sendCode: function () {
            // 检验手机号
            const regex = /^1[3456789]\d{9}$/;
            if (!regex.test(this.form.user_phone)) {
                this.$message.error("手机号格式错误");
                return;
            }
            this.interval = 60;
            sendPhoneCode({phone: this.form.user_phone}).then((res) => {
                this.timer = setInterval(() => {
                    if (this.interval > 0) {
                        this.interval--;
                    } else {
                        clearInterval(this.timer);
                    }
                }, 1000);
                this.$message.success("发送成功");
            });
        },
        verify: function () {
            // 检验手机号
            const regex = /^1[3456789]\d{9}$/;
            if (!regex.test(this.form.user_phone)) {
                this.$message.error("手机号格式错误");
                return;
            }
            verifyPhone({phone: this.form.user_phone, code: this.form.code}).then((res) => {
                this.$message.success("绑定成功");
                this.visible = false;
                this.phone = this.form.user_phone;
            });
        },
    },
    mounted: function () {
        getProfile().then((res) => {
            this.phone = res.data.data.user_phone;
        });
    },
    beforeDestroy: function () {
        clearInterval(this.timer);
    },
};
</script>

<style lang="less">
.m-notice-phone {
    .flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.m-notice-phone__dialog {
    .m-phone-content {
        .flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        .u-qr {
            .flex;
            align-items: center;
            justify-content: center;
            .size(180px);
            .el-image__inner {
                .full;
            }
        }
        .u-error {
            .fz(120px);
        }

        .u-btn {
            width: 100%;
        }
    }
}
@media screen and (max-width: @phone) {
    .m-notice-phone {
        .u-value {
            font-size: 12px;
        }
        .u-bind-button {
            span {
                .none;
            }
        }
    }
}
</style>
