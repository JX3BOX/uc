<template>
    <div class="v-bind-role2">
        <div class="m-steps">
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
                    <div class="u-notice">在弹窗内输入下方“角色认证”验证码 - 点击【④确认】</div>
                    <div class="u-timer">( 10分钟内有效，超时请刷新页面 )</div>
                    <div class="u-token" @click="copyToken">
                        {{ token }}
                    </div>
                    <div class="u-subtitle">
                        <span class="u-link-text"><img src="@/assets/img/dashboard/link.svg" alt="" />当前魔盒账号已绑定角色：</span>
                        <el-button size="small" @click="toMoreRoles">更多角色</el-button>
                    </div>
                    <ul class="u-roles">
                        <router-link :to="'/role/' + item.ID" class="u-role" :class="{'is-default': item.is_default_role}" v-for="item in roles" :key="item.id">
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
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { showSchoolIcon, showSchoolName, showTime, getThumbnail } from "@/utils/filters";
export default {
    name: "BindRole2",
    props: [],
    data: function () {
        return {
            token: "",

            notice: "",
            sync_notice: "",
            roles: [],
        };
    },
    computed: {
        isLogin() {
            return User.isLogin();
        },
    },
    watch: {},
    created() {},
    mounted() {
        this.loadBreadCrumb();
        if (this.isLogin) {
            this.loadRoles();
            this.loadToken();
        }
    },
    methods: {
        loadBreadCrumb: function () {
            getBreadcrumb("bind_role").then((res) => {
                this.notice = res;
            });
            getBreadcrumb("sync_data").then((res) => {
                this.sync_notice = res;
            });
        },
        loadRoles() {
            const params = {
                _no_page: 1,
            };
            getRoles(params).then((res) => {
                this.roles = res.data.data.list?.slice(0, 5) || [];
            });
        },
        loadToken() {
            getToken().then((res) => {
                this.token = res.data.data.token;
            });
        },
        copyToken() {
            if (!this.token) {
                this.$notify.error({
                    title: "复制失败",
                    message: "暂无验证码",
                });
                return;
            }
            navigator.clipboard
                .writeText(this.token)
                .then(() => {
                    this.$notify({
                        title: "复制成功",
                        message: this.token,
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$notify.error({
                        title: "复制失败",
                        message: "请手动复制",
                    });
                });
        },
        showAvatar: function (mount, body_type) {
            return getThumbnail(__cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png");
        },
        toMoreRoles() {
            const path = this.$router.resolve({ path: "/role" });
            window.open(path.href, "_blank");
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/bind_role2.less";
</style>
