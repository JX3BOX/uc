<template>
    <uc class="m-auth">
        <div class="m-block">
            <div v-html="content"></div>
        </div>

        <div class="m-dashboard-content-list" v-loading="loading">
            <div class="m-item" v-for="type in oauth" :key="type">
                <span class="u-profile-item">
                    <img :class="'u-' + type" svg-inline :src="icon(type)" />
                    <span class="u-status">
                        {{ types[type].name }}
                        <!-- {{ checkStatus(type) ? getNickname(type) : "未绑定" }} -->
                    </span>
                </span>
                <template v-if="type != 'user_phone' || (type == 'user_phone' && level >= 3)">
                    <el-button
                        class="u-button"
                        :type="!checkStatus(type) ? 'primary' : 'danger'"
                        @click="toBind(type)"
                        v-if="!checkStatus(type)"
                    >
                        前往绑定
                    </el-button>
                    <i class="el-icon-success u-bind" v-else></i>
                </template>
            </div>
        </div>
    </uc>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { checkOAuth } from "@/service/dashboard/profile";
import { getMyInfo } from "@/service/dashboard/index.js";
import uc from "@/components/dashboard/uc.vue";
import { __imgPath, __cdn } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";

const types = {
    wechat_mp_openid: {
        icon: "official",
        name: "微信公众号",
    },
    wechat_miniprogram_openid: {
        icon: "app",
        name: "微信小程序",
    },
    user_phone: {
        icon: "phone",
        name: "手机号",
    },
};

export default {
    name: "auth",
    components: {
        uc,
    },
    data: function () {
        return {
            content: "",
            data: {},
            oauth: ["wechat_mp_openid", "wechat_miniprogram_openid", "user_phone"],

            types,
            loading: false,

            info: {},
        };
    },
    computed: {
        level: function () {
            return User.getLevel(this.info?.experience || 0);
        },
    },
    mounted() {
        getBreadcrumb("auth_ac").then((res) => {
            this.content = res;
        });

        this.loadAuth();

        this.loadUserInfo();
    },
    methods: {
        checkStatus: function (type) {
            return !!this.data[type];
        },
        getNickname: function (type) {
            return this.data[type + "_name"] || "已绑定";
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
        toBind(type) {
            const routeName = {
                wechat_mp_openid: "notice",
                wechat_miniprogram_openid: "connect",
                user_phone: "notice",
            }[type];

            this.$router.push({ name: routeName });
        },
        loadUserInfo: function () {
            getMyInfo().then((res) => {
                this.info = res.data.data || {};
            });
        },
    },
};
</script>

<style lang="less">
.m-auth {
    .m-block {
        background-color: #fafbfc;
        border: 1px solid @color-link;
        margin: 15px 15px 5px 15px;
        padding: 10px 10px 10px 30px;
        border-radius: 6px;
        position: relative;

        h3,
        h6 {
            .fz(13px,22px);
            color: #333;
            margin: 10px 0;
        }
        p {
            font-size: 12px;
            line-height: 26px;
            margin: 0;
        }
    }

    .m-dashboard-content-list {
        .flex;
        box-sizing: border-box;
        flex-direction: column;
        gap: 20px;
        .u-profile-item {
            .flex;
            align-items: center;
            gap: 20px;
            padding: 0 20px;
            .bold;
        }
    }

    .m-item {
        .flex;
        padding: 30px 10px 10px 10px;
        box-sizing: border-box;
        gap: 60px;
        border-top: 1px dashed #ddd;
        align-items: center;
        &:first-child {
            border: 0;
        }
    }

    img,
    svg {
        .size(40px);
    }

    .u-button {
        .w(auto) !important;
    }

    .u-status {
        .nobreak;
        .w(200px);
    }

    .u-tip {
        .mb(10px);
    }

    .u-bind {
        color: #67c23a;
        font-size: 32px;
    }
}
</style>
