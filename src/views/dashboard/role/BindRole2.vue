<template>
    <div class="v-bind-role2">
        <h2 class="u-title">
            <i class="el-icon-connection"></i> {{ $t("dashboard.role.bind") }}
            <!-- <div class="u-op">
                <router-link to="/role/add" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div> -->
            <el-button class="u-back" icon="ArrowLeft" @click="goBack">{{ $t("dashboard.common.back") }}</el-button>
        </h2>
        <ContentSkeleton v-if="pageLoading" variant="form" :rows="4" />
        <div class="m-bind-login" v-else-if="!isLogin">
            <el-alert :title="$t('dashboard.role.loginFirst')" type="warning" center show-icon :closable="false"></el-alert>
            <el-button type="primary" @click="toLogin">{{ $t("dashboard.common.loginNow") }}</el-button>
        </div>
        <div class="m-steps" v-else>
            <!-- STEP 1 -->
            <div class="m-step is-1">
                <div class="u-step-head">
                    <img class="u-step-img" src="@/assets/img/dashboard/role/step1.png" alt="" />
                </div>
                <div class="u-step-body">
                    <div v-html="notice"></div>
                </div>
                <div class="u-line1">
                    <img class="u-line1-img" src="@/assets/img/dashboard/role/line1to2.png" alt="" />
                </div>
            </div>

            <!-- STEP 2 -->
            <div class="m-step is-2">
                <div class="u-step-head">
                    <img class="u-step-img" src="@/assets/img/dashboard/role/step2.png" alt="" />
                </div>
                <div class="u-step-body">
                    <div class="u-notice">{{ $t("dashboard.role.tokenInstruction") }}</div>
                    <div class="u-timer">{{ $t("dashboard.role.tokenValidity") }}</div>
                    <el-alert
                        v-if="tokenError"
                        class="u-token-error"
                        :title="tokenError"
                        type="error"
                        center
                        show-icon
                        :closable="false"
                    ></el-alert>
                    <div class="u-token" :class="{ 'is-disabled': tokenLoading || !token }" v-loading="tokenLoading" @click="copyToken">
                        {{ tokenText }}
                    </div>
                    <div class="u-subtitle">
                        <span class="u-link-text"
                            ><img src="@/assets/img/dashboard/link.svg" alt="" />{{ $t("dashboard.role.boundRoles") }}：</span
                        >
                        <el-button @click="toMoreRoles" icon="ArrowRight">{{ $t("dashboard.role.moreRoles") }}</el-button>
                    </div>
                    <el-alert
                        v-if="rolesError"
                        class="u-roles-error"
                        :title="rolesError"
                        type="error"
                        center
                        show-icon
                        :closable="false"
                    ></el-alert>
                    <ul class="u-roles">
                        <router-link
                            :to="'/role/' + item.ID"
                            class="u-role"
                            :class="{ 'is-default': item.is_default_role }"
                            v-for="item in roles"
                            :key="item.ID"
                        >
                            <img class="u-avatar" :src="showAvatar(item.mount, item.body_type)" />
                            <span class="u-name">{{ item.name }}</span>
                        </router-link>
                    </ul>
                </div>
                <div class="u-line2">
                    <img class="u-line2-img" src="@/assets/img/dashboard/role/line2to3.png" alt="" />
                </div>
            </div>

            <!-- STEP 3 -->
            <div class="m-step is-3">
                <div class="u-step-head">
                    <img class="u-step-img" src="@/assets/img/dashboard/role/step3.png" alt="" />
                </div>
                <div class="u-step-body">
                    <div v-html="sync_notice"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getToken, getRoles } from "@/service/dashboard/role.js";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath, __cdn } from "@/utils/config";
import { showSchoolIcon, showSchoolName, showTime, getThumbnail } from "@/utils/filters";
export default {
    name: "BindRole2",
    props: [],
    data: function () {
        return {
            pageLoading: true,
            token: "",
            tokenLoading: false,
            tokenError: "",

            notice: "",
            sync_notice: "",
            roles: [],
            rolesError: "",
        };
    },
    computed: {
        isLogin() {
            return User.isLogin();
        },
        tokenText() {
            if (this.tokenLoading) return this.$t("dashboard.role.tokenLoading");
            return this.token || this.$t("dashboard.role.noToken");
        },
    },
    watch: {},
    created() {},
    mounted() {
        const requests = [this.loadBreadCrumb()];
        if (this.isLogin) requests.push(this.loadRoles(), this.loadToken());
        Promise.allSettled(requests).finally(() => {
            this.pageLoading = false;
        });
    },
    methods: {
        loadBreadCrumb: function () {
            const bindNoticeRequest = getBreadcrumb("bind_role").then((res) => {
                this.notice = res;
            });
            const syncNoticeRequest = getBreadcrumb("sync_data").then((res) => {
                this.sync_notice = res;
            });
            return Promise.allSettled([bindNoticeRequest, syncNoticeRequest]);
        },
        loadRoles() {
            const params = {
                _no_page: 1,
            };
            this.rolesError = "";
            return getRoles(params)
                .then((res) => {
                    this.roles = res.data.data.list?.slice(0, 5) || [];
                })
                .catch((err) => {
                    this.roles = [];
                    this.rolesError = this.getErrorMessage(err, this.$t("dashboard.role.rolesLoadFailed"));
                });
        },
        loadToken() {
            this.tokenLoading = true;
            this.tokenError = "";
            return getToken()
                .then((res) => {
                    this.token = res.data.data.token || "";
                    if (!this.token) this.tokenError = this.$t("dashboard.role.tokenLoadFailed");
                })
                .catch((err) => {
                    this.token = "";
                    this.tokenError = this.getErrorMessage(err, this.$t("dashboard.role.tokenLoadFailed"));
                })
                .finally(() => {
                    this.tokenLoading = false;
                });
        },
        copyToken() {
            if (this.tokenLoading || !this.token) {
                this.$notify.error({
                    title: this.$t("dashboard.common.copyFailed"),
                    message: this.tokenLoading ? this.$t("dashboard.role.tokenLoading") : this.$t("dashboard.role.noToken"),
                });
                return;
            }
            navigator.clipboard
                .writeText(this.token)
                .then(() => {
                    this.$notify({
                        title: this.$t("dashboard.common.copySuccess"),
                        message: this.token,
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$notify.error({
                        title: this.$t("dashboard.common.copyFailed"),
                        message: this.$t("dashboard.common.copyManually"),
                    });
                });
        },
        showAvatar: function (mount, body_type) {
            return getThumbnail(__cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png");
        },
        toMoreRoles() {
            const path = this.$router.resolve({ path: "/role" });
            window.open(path.href, "_blank");
        },
        goBack: function () {
            this.$router.push("/role");
        },
        toLogin: function () {
            User.toLogin();
        },
        getErrorMessage: function (err, fallback) {
            return err?.response?.data?.msg || err?.response?.data?.message || err?.message || fallback;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/bind_role2.less";
</style>
