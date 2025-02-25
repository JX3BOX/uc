<template>
    <uc class="m-dashboard-connect">
        <div class="m-profile-connect" v-loading="loading">
            <el-alert
                class="u-tip"
                title="通过第三方账号快速登录，如需解绑则需要先绑定一个邮箱"
                type="warning"
                show-icon
            >
            </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="type in oauth" :key="type">
                    <span class="u-profile-item">
                        <img :class="'u-' + type" svg-inline :src="icon(type)" />
                        <span class="u-status">
                            {{ types[type].name }}
                        </span>
                    </span>
                    <el-button
                        type="primary"
                        @click="bind(types[type].uuid)"
                        size="large"
                        v-if="!checkStatus(types[type].idKey)"
                    >
                        立即绑定
                    </el-button>

                    <!-- <a
                        class="el-button el-button--primary el-button--large"
                        v-if="!checkStatus(types[type].idKey)"
                        :href="getAuthUrl(types[type].uuid)"
                    >
                        <span class="u-status">
                            立即绑定
                        </span>
                    </a> -->
                    <el-button v-else @click="unbind(types[type].uuid)" size="large" type="danger">
                        <span class="u-status">
                            解除绑定
                        </span>
                    </el-button>
                </div>
            </div>
        </div>

        <el-dialog :visible.sync="showMiniProgram" title="绑定微信小程序" :width="isPhone ? '95%' : '400px'" custom-class="m-qrcode-dialog" :show-close="false">
            <div class="m-qr-content">
                <img class="u-login-qrcode" src="@/assets/img/dashboard/connect/loginqrcode.jpg" alt="">
                <i class="u-tip">打开微信扫一扫，绑定小程序</i>
                <small class="u-tip-small">绑定之后需要重新登陆方可生效</small>
            </div>

            <template #footer>
                <el-button type="primary" @click="ihadBind">我已绑定</el-button>
            </template>
        </el-dialog>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import links from "@jx3box/jx3box-common/js/connect";
import { __imgPath, __cdn, __cms } from "@jx3box/jx3box-common/data/jx3box.json";
import { unbindOAuth, checkOAuth } from "@/service/dashboard/profile";
const client = location.href.includes("origin") ? "origin" : "std";
import { unbindApp } from "@/service/dashboard/union";

const BASE_URL = __cms

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
        name: "微博",
        uuid: "weibosite",
        idKey: "weibo_id"
    },
    wechat: {
        icon: "wechat",
        name: "微信",
        uuid: "wesite",
        idKey: "wechat_openid"
    },
    wechat_miniprogram: {
        icon: "app",
        name: "微信小程序",
        uuid: "wechat_miniprogram",
        idKey: "wechat_miniprogram_openid"
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
            return this.data[type + "_name"] || "已绑定";
        },
        bind: function (type) {
            if (type == "wechat_miniprogram") {
                this.showMiniProgram = true;
                return;
            }
            location.href = this.getAuthUrl(type)
        },
        unbind: function (type) {
            if (!this.data.user_email) {
                this.$alert("当前账号未验证邮箱，无法解除绑定", "提示", {
                    confirmButtonText: "确定",
                    type: "warning",
                }).catch(() => {});
                return;
            }
            if (type != "wechat_miniprogram") {
                this.unbindApp(type);
                return;
            }
            const _type = Object.entries(types).find((item) => item[1].uuid == type)[0];
            const name = types[_type].name;
            this.$confirm(`确定要解绑【${name}】吗？`, "解绑", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    unbindOAuth(type).then((res) => {
                        this.$message({
                            message: "解绑成功",
                            type: "success",
                        });
                        this.loadAuth();
                    });
                })
                .catch(() => {});
        },
        icon: function (type) {
            return __cdn + "design/user/" + types[type]['icon'] + ".png";
        },
        loadAuth() {
            this.loading = true;
            checkOAuth().then((res) => {
                this.data = res.data.data;
            }).finally(() => {
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
            const desc = {
                wesite: "如果取消则无法再通过微信扫一扫登录",
                qqsite: "如果取消则无法再通过QQ登录",
                weibosite: "如果取消则无法再通过微博登录",
            }[type];
            this.$confirm(desc, "确定取消绑定吗？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    unbindApp(type).then((res) => {
                        this.$message({
                            message: "解绑成功",
                            type: "success",
                        });
                        this.loadAuth();
                    });
                })
                .catch(() => {});
        }
    },
    mounted: function () {
        this.loadAuth();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/connect.less";
</style>
