<template>
    <uc class="m-dashboard-notice">
        <ContentSkeleton v-show="loading" variant="list" :rows="4" />
        <div v-show="!loading" class="m-dashboard-content">
            <el-alert class="u-tip" :title="$t('dashboard.notice.tip')" type="warning" show-icon> </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="item in list" :key="item.key">
                    <span class="u-notice-item">
                        <img class="u-icon" :src="icon(item.key)" />
                        <span class="u-label">{{ $t(`dashboard.notice.types.${item.key}`) }}</span>
                    </span>
                    <component :is="item.component" v-bind="item.props" @refresh="loadWebhooks" />
                </div>
                <qqbot :data="authData" @refresh="loadAuth" />
            </div>
        </div>
    </uc>
</template>

<script>
import { markRaw } from "vue";
import uc from "@/components/dashboard/uc.vue";
import { __cdn } from "@/utils/config";
import wechat from "./wechat.vue";
import email from "./email.vue";
import phone from "./phone.vue";
import thirdParty from "./third_party.vue";
import qqbot from "../qqbot.vue";
import { checkOAuth } from "@/service/dashboard/profile";
import { getUserWebhooks } from "@/service/dashboard/webhook";
export default {
    name: "notice",
    components: {
        uc,
        wechat: markRaw(wechat),
        email: markRaw(email),
        phone: markRaw(phone),
        thirdParty: markRaw(thirdParty),
        qqbot,
    },
    data: function () {
        return {
            loading: true,
            authData: {
                qqbot: "",
            },
            list: [
                { key: "email", component: email },
                { key: "phone", component: phone },
                { key: "wechat", component: wechat },
                {
                    key: "wecom",
                    component: thirdParty,
                    props: { type: "wecom", webhook: null, loading: true, loadError: false },
                },
                {
                    key: "feishu",
                    component: thirdParty,
                    props: { type: "feishu", webhook: null, loading: true, loadError: false },
                },
                {
                    key: "dingtalk",
                    component: thirdParty,
                    props: { type: "dingtalk", webhook: null, loading: true, loadError: false },
                },
            ],
        };
    },
    methods: {
        icon: function (type) {
            return __cdn + "design/user/" + type + ".svg";
        },
        loadAuth: function ({ showLoading = true } = {}) {
            if (showLoading) this.loading = true;
            return checkOAuth()
                .then((res) => {
                    this.authData = res.data.data || {};
                })
                .finally(() => {
                    if (showLoading) this.loading = false;
                });
        },
        loadWebhooks: function () {
            const webhookItems = this.list.filter((item) => item.props?.type);
            webhookItems.forEach((item) => {
                item.props.loading = true;
            });

            return getUserWebhooks()
                .then((res) => {
                    const data = res?.data?.data;
                    const records = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : [];
                    const recordMap = Object.fromEntries(records.map((item) => [item.type, item]));

                    webhookItems.forEach((item) => {
                        item.props.webhook = recordMap[item.key] || null;
                        item.props.loadError = false;
                    });
                })
                .catch(() => {
                    webhookItems.forEach((item) => {
                        item.props.loadError = true;
                    });
                })
                .finally(() => {
                    webhookItems.forEach((item) => {
                        item.props.loading = false;
                    });
                });
        },
        loadPage: function () {
            this.loading = true;
            return Promise.allSettled([this.loadAuth({ showLoading: false }), this.loadWebhooks()]).finally(() => {
                this.loading = false;
            });
        },
    },
    mounted: function () {
        this.loadPage();
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

        .u-notice-item img,
        .u-notice-item svg {
            .size(48px);
        }
    }

    .u-notice-item {
        .flex;
        flex: 0 0 180px;
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
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr) 40px;
            grid-template-rows: minmax(20px, auto) minmax(24px, auto);
            align-items: center;
            column-gap: 12px;
            row-gap: 2px;
            min-width: 0;
            padding: 16px 0;
        }

        .u-notice-item img,
        .u-notice-item svg {
            .size(40px);
            min-width: 40px;
        }

        .u-notice-item {
            display: contents;

            img,
            svg {
                grid-column: 1;
                grid-row: 1 / 3;
                align-self: center;
                justify-self: center;
            }

            .u-label,
            .u-status {
                grid-column: 2;
                grid-row: 1;
                align-self: end;
                width: auto;
                line-height: 1.5;
                text-align: left;
            }
        }

        .u-notice-box {
            display: contents;
        }

        .u-notice-value {
            grid-column: 2;
            grid-row: 2;
            display: flex;
            width: auto;
            min-width: 0;
            align-items: center !important;
            flex-direction: row !important;
            gap: 8px;
        }

        .u-notice-status {
            margin-left: 0;
        }

        .u-bind-button,
        .u-button,
        .u-bind-btn,
        .u-unbind-btn {
            grid-column: 3;
            grid-row: 1 / 3;
            align-self: center;
            justify-self: end;
            width: 40px;
            min-width: 40px;
            height: 40px;
            padding: 0;
            border-radius: 50%;
        }

        .m-qqbot .u-button-label,
        .m-qqbot .u-unbind-btn span {
            display: none;
        }
    }
}
</style>
