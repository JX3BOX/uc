<template>
    <uc class="m-dashboard-pwd">
        <div class="m-profile-pwd">
            <form v-if="status" class="m-dashboard-pwd-doing">
                <img
                    class="u-pic"
                    svg-inline
                    src="@/assets/img/dashboard/setting/pwd.svg"
                />
                <el-alert
                    class="u-ac"
                    title="请妥善保管"
                    type="warning"
                    description="未绑定邮箱用户将无法使用找回密码功能"
                    show-icon
                    :closable="false"
                >
                </el-alert>

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
                            <img
                                class="i-pass"
                                svg-inline
                                src="@/assets/img/dashboard/nav/pass.svg"
                            />
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
                            <img
                                class="i-pass"
                                svg-inline
                                src="@/assets/img/dashboard/nav/pass.svg"
                            />
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
            </form>
            <div v-else class="m-dashboard-pwd-done">
                <img
                    class="u-icon"
                    svg-inline
                    src="@/assets/img/dashboard/setting/checked.svg"
                />
                <p>修改成功</p>
                <el-button
                    class="u-submit u-button"
                    type="primary"
                    @click="reset"
                    >返回</el-button
                >
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { validator } from "sterilizer";
import User from "@jx3box/jx3box-common/js/user";
import { updatePassword } from "@/service/dashboard/profile";
export default {
    name: "pwd",
    props: [],
    data: function() {
        return {
            pwd1: "",
            pwd2: "",
            pass_validate: null,
            pass_validate_tip: "密码有效长度为6-50个字符",
            pass_accordance_tip: "两次密码不一致",
            status: true,
        };
    },
    computed: {
        accordance: function() {
            return this.pwd1 === this.pwd2;
        },
        ready: function() {
            return this.pass_validate && this.accordance;
        },
    },
    methods: {
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
        done: function() {
            updatePassword({
                password: this.pwd1,
            }).then((res) => {
                this.$message({
                    message: "密码修改成功",
                    type: "success",
                });
                this.status = false;

                User.destroy().then(() => {
                    User.toLogin();
                });
            });
        },
        reset: function() {
            this.status = true;
        },
    },
    mounted: function() {},
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/pwd.less";
</style>
