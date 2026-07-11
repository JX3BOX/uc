<template>
    <uc class="m-dashboard-connect">
        <div class="m-profile-connect" v-loading="loading">
            <el-alert
                class="u-tip"
                :title="$t('dashboard.connect.tip')"
                type="warning"
                show-icon
            >
            </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="type in oauth" :key="type">
                    <span class="u-profile-item">
                        <img :class="'u-' + type" svg-inline :src="icon(type)" />
                        <span class="u-status">
                            {{ typeName(type) }}
                        </span>
                    </span>
                    <el-button
                        type="primary"
                        class="u-bind-btn"
                        @click="bind(types[type].uuid)"
                        size="large"
                        v-if="!checkStatus(types[type].idKey)"
                    >
                        <i class="el-icon-connection"></i>{{ $t("dashboard.common.bindNow") }}
                    </el-button>
                    <el-button
                        v-else
                        class="u-unbind-btn"
                        @click="unbind(types[type].uuid)"
                        size="large"
                        type="info"
                    >
                        <img class="u-unbind-icon" svg-inline src="@/assets/img/dashboard/unbind.svg" alt="" />{{ $t("dashboard.common.unbind") }}
                    </el-button>
                </div>
                <qqbot :data="data" @refresh="loadAuth"></qqbot>
            </div>
        </div>

        <el-dialog
            v-model="showMiniProgram"
            :title="$t('dashboard.connect.bindMiniProgram')"
            :width="isPhone ? '95%' : '400px'"
            class="m-qrcode-dialog"
            :show-close="false"
        >
            <div class="m-qr-content">
                <img class="u-login-qrcode" src="@/assets/img/dashboard/connect/loginqrcode.jpg" alt="" />
                <i class="u-tip">{{ $t("dashboard.connect.scanTip") }}</i>
                <small class="u-tip-small">{{ $t("dashboard.connect.reloginTip") }}</small>
            </div>

            <template #footer>
                <el-button type="primary" @click="ihadBind">{{ $t("dashboard.connect.alreadyBound") }}</el-button>
            </template>
        </el-dialog>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { __imgPath, __cdn, __cms } from "@/utils/config";
import { unbindOAuth, checkOAuth } from "@/service/dashboard/profile";
const client = location.href.includes("origin") ? "origin" : "std";
import { unbindApp } from "@/service/dashboard/union";
import qqbot from "./qqbot.vue";

const BASE_URL = __cms;

const types = {
    // github: {
    //     icon: "github",
    //     name: "Github",
    //     uuid: "github",
    //     idKey: "github_id",
    // },
    qq: {
        icon: "qq",
        name: "QQ",
        uuid: "qqsite",
        idKey: "qq_openid",
    },
    weibo: {
        icon: "weibo",
        uuid: "weibosite",
        idKey: "weibo_id",
    },
    wechat: {
        icon: "wechat",
        uuid: "wesite",
        idKey: "wechat_openid",
    },
    wechat_miniprogram: {
        icon: "app",
        uuid: "wechat_miniprogram",
        idKey: "wechat_miniprogram_openid",
    },
};

export default {
    name: "connect",
    props: [],
    data: function () {
        return {
            data: {
                github_name: "",
                github_id: "",

                weibo_name: "",
                weibo_id: "",

                qq_name: "",
                qq_unionid: "",

                wechat_name: "",
                wechat_unionid: "",

                wechat_miniprogram_openid: "",

                user_email: "",
            },
            oauth: ["qq", "weibo", "wechat", "wechat_miniprogram"],
            types,

            showMiniProgram: false,
            isPhone: window.innerWidth < 768,

            loading: false,
        };
    },
    computed: {},
    methods: {
        checkStatus: function (idKey) {
            return this.data[idKey];
        },
        getNickname: function (type) {
            return this.data[type + "_name"] || this.$t("dashboard.common.bound");
        },
        typeName: function (type) {
            return this.$t(`dashboard.connect.types.${type}`);
        },
        bind: function (type) {
            if (type == "wechat_miniprogram") {
                this.showMiniProgram = true;
                return;
            }
            location.href = this.getAuthUrl(type);
        },
        unbind: function (type) {
            if (!this.data.user_email) {
                this.$alert(this.$t("dashboard.connect.emailRequired"), this.$t("dashboard.common.tip"), {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    type: "warning",
                }).catch(() => {});
                return;
            }
            if (type != "wechat_miniprogram") {
                this.unbindApp(type);
                return;
            }
            const _type = Object.entries(types).find((item) => item[1].uuid == type)[0];
            const name = this.typeName(_type);
            this.$confirm(this.$t("dashboard.connect.unbindConfirm", { name }), this.$t("dashboard.common.unbind"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    unbindOAuth(type).then((res) => {
                        this.$message({
                            message: this.$t("dashboard.common.unbindSuccess"),
                            type: "success",
                        });
                        this.loadAuth();
                    });
                })
                .catch(() => {});
        },
        icon: function (type) {
            return __cdn + "design/user/" + types[type]["icon"] + ".png";
        },
        loadAuth() {
            this.loading = true;
            checkOAuth()
                .then((res) => {
                    this.data = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        ihadBind() {
            this.showMiniProgram = false;
            this.loadAuth();
        },
        getAuthUrl(uuid) {
            return BASE_URL + `api/cms/user/union/${uuid}/bind?client=${client}`;
        },
        unbindApp(type) {
            const desc = this.$t(`dashboard.connect.unbindWarnings.${type}`);
            this.$confirm(desc, this.$t("dashboard.connect.cancelBindingConfirm"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    unbindApp(type).then((res) => {
                        this.$message({
                            message: this.$t("dashboard.common.unbindSuccess"),
                            type: "success",
                        });
                        this.loadAuth();
                    });
                })
                .catch(() => {});
        },
    },
    mounted: function () {
        this.loadAuth();
    },
    components: {
        uc,
        qqbot,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/connect.less";
</style>
