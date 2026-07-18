<template>
    <uc class="m-dashboard-notice">
        <div class="m-dashboard-content" v-loading="loading">
            <el-alert class="u-tip" :title="$t('dashboard.notice.tip')" type="warning" show-icon> </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="(item, i) in list" :key="i">
                    <span class="u-notice-item">
                        <img class="u-icon" svg-inline :src="icon(item.key)" />
                        <span class="u-label">{{ $t(`dashboard.notice.types.${item.key}`) }}</span>
                    </span>
                    <component :is="item.component" />
                </div>
                <qqbot :data="authData" @refresh="loadAuth" />
            </div>
        </div>
    </uc>
</template>

<script>
import { markRaw } from "vue";
import uc from "@/components/dashboard/uc.vue";
import { __imgPath } from "@/utils/config";
import wechat from "./wechat.vue";
import email from "./email.vue";
import phone from "./phone.vue";
import qqbot from "../qqbot.vue";
import { checkOAuth } from "@/service/dashboard/profile";
export default {
    name: "notice",
    components: { uc, wechat: markRaw(wechat), email: markRaw(email), phone: markRaw(phone), qqbot },
    data: function () {
        return {
            loading: false,
            authData: {
                qqbot: "",
            },
            list: [
                { key: "email", component: email },
                { key: "phone", component: phone },
                { key: "wechat", component: wechat },
            ],
        };
    },
    methods: {
        icon: function (type) {
            return __imgPath + "image/connect/" + type + ".svg";
        },
        loadAuth: function () {
            this.loading = true;
            checkOAuth()
                .then((res) => {
                    this.authData = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function () {
        this.loadAuth();
    },
};
</script>

<style lang="less">
.m-dashboard-notice {
    .m-dashboard-content-list {
        .flex;
        box-sizing: border-box;
        flex-direction: column;
        gap: 20px;

        .m-item {
            .flex;
            padding: 30px 10px 10px 10px;
            box-sizing: border-box;
            gap: 60px;
            border-top: 1px dashed #ddd;

            &:first-child {
                border: 0;
            }
        }

        img,
        svg {
            .size(48px);
        }
    }

    .u-notice-item {
        .flex;
        flex: 0 0 150px;
        box-sizing: border-box;
        align-items: center;
        gap: 20px;
        padding: 0 20px;
        .bold;
    }
    .u-notice-value {
        width: 200px;
    }
    .u-notice-status {
        margin-left: 5px;
    }
    .u-notice-box {
        flex: 1;
        justify-content: space-between !important;
        max-width: 600px;
    }
}

@media screen and (max-width: @phone) {
    .m-dashboard-notice {
        .m-dashboard-content-list .m-item {
            gap: 20px;
        }

        img {
            min-width: 48px;
        }
        .u-notice-item {
            flex-basis: auto;
            flex-direction: column;
            padding: 0;
            gap: 10px;
        }
    }
}
</style>
