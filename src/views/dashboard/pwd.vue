<template>
    <uc class="m-dashboard-pwd">
        <ContentSkeleton v-if="loading" variant="form" :rows="3" />
        <div v-else class="m-profile-pwd">
            <form v-if="status" class="m-dashboard-pwd-doing" @submit.prevent="done">
                <img
                    class="u-pic"
                    svg-inline
                    src="@/assets/img/dashboard/setting/pwd.svg"
                />
                <el-alert
                    v-if="showPasswordNotice"
                    class="u-ac"
                    :title="$t('dashboard.password.setPassword')"
                    type="warning"
                    :description="$t('dashboard.password.noPasswordTip')"
                    show-icon
                    :closable="false"
                >
                </el-alert>

                <!-- 新密码 -->
                <div class="u-pass">
                    <el-input
                        class="u-text"
                        :placeholder="$t('dashboard.password.newPassword')"
                        v-model="pwd1"
                        show-password
                        @change="checkPass"
                        size="large"
                    >
                        <template #prepend>
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
                        :placeholder="$t('dashboard.password.repeatPassword')"
                        v-model="pwd2"
                        show-password
                        @input="checkPass"
                        size="large"
                    >
                        <template #prepend>
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
                    native-type="submit"
                    :disabled="!ready || submitting"
                    :loading="submitting"
                    size="large"
                    >{{ $t("dashboard.common.submit") }}</el-button
                >
            </form>
            <div v-else class="m-dashboard-pwd-done">
                <img
                    class="u-icon"
                    svg-inline
                    src="@/assets/img/dashboard/setting/checked.svg"
                />
                <p>{{ $t("dashboard.common.updateSuccess") }}</p>
                <el-button
                    class="u-submit u-button"
                    type="primary"
                    @click="reset"
                    >{{ $t("dashboard.common.back") }}</el-button
                >
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { validator } from "sterilizer";
import User from "@jx3box/jx3box-common/js/user";
import { getPasswordStatus, updatePassword } from "@/service/dashboard/profile";
export default {
    name: "pwd",
    props: [],
    data: function() {
        return {
            pwd1: "",
            pwd2: "",
            pass_validate: null,
            pass_validate_tip: this.$t("dashboard.password.lengthTip"),
            pass_accordance_tip: this.$t("dashboard.password.mismatch"),
            status: true,
            loading: true,
            submitting: false,
            hasPassword: null,
        };
    },
    computed: {
        accordance: function() {
            return this.pwd1 === this.pwd2;
        },
        ready: function() {
            return this.pass_validate && this.accordance;
        },
        showPasswordNotice: function() {
            return this.hasPassword === false;
        },
    },
    methods: {
        getPasswordStatusMock: function() {
            if (process.env.NODE_ENV !== "development") return null;

            const mockValue = new URLSearchParams(window.location.search).get("pwd_mock_no_password");
            if (mockValue === "1") return false;
            if (mockValue === "0") return true;
            return null;
        },
        loadPasswordStatus: function() {
            this.loading = true;
            const mockStatus = this.getPasswordStatusMock();
            if (mockStatus !== null) {
                this.hasPassword = mockStatus;
                this.loading = false;
                return;
            }

            return getPasswordStatus()
                .then((res) => {
                    const hasPassword = res?.data?.data?.has_password;
                    this.hasPassword = typeof hasPassword === "boolean" ? hasPassword : null;
                })
                .catch(() => {
                    this.hasPassword = null;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        checkPass: function() {
            // 如果为空
            if (this.pwd1 == "") {
                this.pass_validate = null;
            }

            // 校验第1个值
            this.pass_validate = validator(this.pwd1, {
                len: [6, 30],
            });
        },
        done: function() {
            if (!this.ready || this.submitting) return;
            this.submitting = true;
            updatePassword({
                password: this.pwd1,
            })
                .then((res) => {
                    this.$message({
                        message: this.$t("dashboard.password.updateSuccess"),
                        type: "success",
                    });
                    this.status = false;

                    this.clearLocalLogin();
                    User.toLogin("/dashboard/");
                })
                .catch((err) => {
                    this.$message.error(this.getErrorMessage(err, this.$t("dashboard.password.updateFailed")));
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        reset: function() {
            this.status = true;
        },
        clearLocalLogin() {
            localStorage?.removeItem("created_at");
            localStorage?.setItem("logged_in", "false");
            localStorage?.removeItem("token");
            localStorage?.removeItem("jx3box_permission");
        },
        getErrorMessage(err, fallback) {
            return err?.response?.data?.msg || err?.data?.msg || fallback;
        },
    },
    mounted: function() {
        this.loadPasswordStatus();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/pwd.less";
</style>
