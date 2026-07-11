<template>
    <div class="v-role-bind">
        <h2 class="u-title">
            <i class="el-icon-connection"></i> {{ $t("dashboard.role.bind") }}
            <!-- <div class="u-op">
                <router-link to="/role/add" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div> -->
            <el-button class="u-back" icon="ArrowLeft" @click="goBack">{{ $t("dashboard.common.back") }}</el-button>
        </h2>
        <div class="m-role-bind">
            <el-tabs v-model="tab">
                <el-tab-pane :label="$t('dashboard.role.pluginBindOfficialOnly')" name="std">
                    <template #label>
                        <span>{{ $t("dashboard.role.pluginBind") }}<span class="u-tab-tip">{{ $t("dashboard.role.officialOnly") }}</span></span>
                    </template>
                    <div class="m-token" v-loading="loading">
                        <h2 class="u-title-name">
                            {{ $t("dashboard.role.bindToken") }}
                            <span class="u-desc">{{ $t("dashboard.role.tokenValidity") }}</span>
                        </h2>
                        <span
                            class="u-token"
                            :title="$t('dashboard.common.clickToCopy')"
                            @click="copyToken"
                        >
                            <i class="el-icon-document-copy"></i>
                            {{ token }}
                        </span>
                    </div>
                    <div class="m-tutorial" v-html="notice"></div>
                </el-tab-pane>
                <!-- <el-tab-pane label="自定义创建" name="origin">
                    <roleform :data="form" @submit="submit" btn_txt="创建" :processing="processing" />
                </el-tab-pane> -->
            </el-tabs>
        </div>

        <!-- <div class="m-custom-tip">
            <el-alert type="info" :closable="false">
                <i class="el-icon-info"></i> 添加一个不属于自己账号的角色，可尝试添加<router-link to="/role/add">自定义角色</router-link>
            </el-alert>
        </div>-->
    </div>
</template>

<script>
import { getToken, createRole } from "@/service/dashboard/role.js";
import { __imgPath, __ossMirror } from "@/utils/config";
import { copyText } from "@/utils/index";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
// import roleform from "@/components/dashboard/role/roleform.vue";
export default {
    name: "BindRole",
    props: [],
    data: function () {
        return {
            token: "INVALIDTESTTOKEN",
            demo_url: __ossMirror + "upload/post/2025/1/15/28338_2338192.jpg",
            loading: false,
            tab: location.href.includes("origin") ? "origin" : "std",

            form: {
                name: "",
                server: (localStorage && localStorage.getItem("team_role_default_server")) || "",
                mount: "0",
                body_type: "1",
                note: "",
                custom: 1,
            },
            processing: false,

            notice: "",
        };
    },
    computed: {},
    methods: {
        copyToken: function () {
            copyText(this.token)
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
        submit: function () {
            this.processing = true;
            createRole(this.form)
                .then((res) => {
                    this.$message({
                        message: this.$t("dashboard.common.updateSuccess"),
                        type: "success",
                    });
                    this.$router.push("/role");
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        goBack: function () {
            this.$router.push("/role");
        },
        loadBreadCrumb: function () {
            getBreadcrumb("bind_role").then((res) => {
                this.notice = res;
            });
        },
    },
    mounted: function () {
        this.loading = true;
        getToken()
            .then((res) => {
                this.token = res.data.data.token;
            })
            .finally(() => {
                this.loading = false;
            });

        this.loadBreadCrumb();
    },
    components: {
        // roleform,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/bind_role.less";
</style>
