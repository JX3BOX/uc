<template>
    <div>
        <CommonHeader :key="currentKey"></CommonHeader>
        <Main class="m-vip-container m-premium-page" :withoutRight="true" :withoutLeft="true">
            <div class="m-vip-premium">
                <simple-header class="m-vip-premium-title" title="会员中心" desc="Professional Account" />

                <div class="m-vip-premium-main">
                    <div class="m-premium-panel">
                        <Premium :data="premiumData" />

                        <div class="m-premium-exchange">
                            <div>
                                <b>积分兑换会员</b>
                                <span v-if="isItemLoading">正在读取兑换信息...</span>
                                <span v-else-if="loadError">{{ loadError }}</span>
                                <span v-else>{{ requiredPointsText }} 积分 / 次</span>
                            </div>
                            <el-button type="primary" @click="exchangePremium" :loading="isSubmitting" :disabled="isItemLoading">
                                {{ exchangeButtonText }}
                            </el-button>
                        </div>
                    </div>

                    <Privilege class="m-premium-privilege" />
                </div>
            </div>
        </Main>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Privilege from "./components/privilege.vue";
import Premium from "./components/premium.vue";
import simple_header from "@/components/vip/simple_header.vue";

import { showDate } from "@jx3box/jx3box-common/js/moment";
import { setUserMeta, getConfig } from "@/service/vip/cms";
import { getItem } from "@/service/vip/mall";
import { alertMallRequirement, handleMallExchangeError } from "@/utils/mallExchangeError";

const PREMIUM_ITEM_ID = 160;
const ASSET_REFRESH_RETRY = 4;
const ASSET_REFRESH_DELAY = 600;

export default {
    data: function () {
        return {
            currentKey: 0,
            premiumItemId: PREMIUM_ITEM_ID,
            premiumItem: {},
            isItemLoading: false,
            isSubmitting: false,
            loadError: "",
            // 资产与权限
            isLogin: User.isLogin(),
            asset: {
                pro_expire_date: "",
                pro_total_day: 0,
                was_pro: 0,
                points: 0,
                box_coin: 0,
                cny: 0,
                experience: 0,
            },
        };
    },
    components: {
        Privilege,
        Premium,
        "simple-header": simple_header,
    },
    computed: {
        premiumData() {
            return {
                isLogin: this.isLogin,
                expireDate: this.asset.pro_expire_date ? showDate(this.asset.pro_expire_date) : "",
            };
        },
        assetPoints() {
            return Number(this.asset.points) || 0;
        },
        requiredPoints() {
            return Number(this.premiumItem.price_points) || 0;
        },
        requiredPointsText() {
            return this.requiredPoints ? this.requiredPoints : "待配置";
        },
        stock() {
            return Number(this.premiumItem.stock) || 0;
        },
        configError() {
            return !!(Number(this.premiumItem.price_cny) || Number(this.premiumItem.price_boxcoin));
        },
        canBuyInfo() {
            const item = this.premiumItem || {};
            const info = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                cny: true,
                points: true,
                level: true,
                user_level: User.getLevel(item.exp_limit),
                buy_time: true,
                stock: true,
            };

            if (!item.id || this.configError) {
                info.canBuy = false;
            }
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                info.canBuy = false;
                info.vip_limit = false;
            }
            if (this.assetPoints < this.requiredPoints || !this.requiredPoints) {
                info.canBuy = false;
                info.points = false;
            }
            if ((Number(this.asset.cny) || 0) < (Number(item.price_cny) || 0)) {
                info.canBuy = false;
                info.cny = false;
            }
            if ((Number(this.asset.experience) || 0) < (Number(item.exp_limit) || 0)) {
                info.canBuy = false;
                info.level = false;
            }
            if (!this.isInSellTime(item)) {
                info.canBuy = false;
                info.buy_time = false;
            }
            if (this.stock <= 0) {
                info.canBuy = false;
                info.stock = false;
            }

            return info;
        },
        canExchange() {
            return !!this.canBuyInfo.canBuy && !this.configError && !this.isSubmitting;
        },
        exchangeButtonText() {
            if (this.isSubmitting) return "兑换中...";
            if (this.configError) return "兑换配置异常";
            if (!this.isLogin) return "兑换";
            return "兑换";
        },
    },
    methods: {
        showDate,
        wait(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async loadAsset() {
            const data = await User.getAsset();
            this.asset = data;
            this.$store.commit("mallNew/toState", { asset: data });
            return data;
        },
        async refreshAssetAfterExchange(prevExpireDate) {
            let latest = await this.loadAsset();
            for (let i = 0; i < ASSET_REFRESH_RETRY && latest.pro_expire_date === prevExpireDate; i++) {
                await this.wait(ASSET_REFRESH_DELAY);
                latest = await this.loadAsset();
            }
            return latest;
        },
        loadPremiumItem() {
            this.isItemLoading = true;
            this.loadError = "";
            return getItem(this.premiumItemId)
                .then((res) => {
                    this.premiumItem = res.data?.data || {};
                })
                .catch((err) => {
                    this.loadError = err?.response?.data?.msg || err?.message || "请稍后再试";
                })
                .finally(() => {
                    this.isItemLoading = false;
                });
        },
        isInSellTime(item = {}) {
            if (item.on_selling === 0) return false;

            const now = Date.now();
            const start = item.start_sell_time ? new Date(item.start_sell_time).getTime() : null;
            const end = item.end_sell_time ? new Date(item.end_sell_time).getTime() : null;

            if (start && now < start) return false;
            if (end && now > end) return false;
            return true;
        },
        exchangePremium() {
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (this.configError) {
                return this.$alert("当前兑换配置包含非积分消耗项，请联系管理员处理。", "暂不能兑换", {
                    confirmButtonText: "知道了",
                    type: "warning",
                });
            }
            if (!this.premiumItem.id) {
                return this.loadPremiumItem().then(() => {
                    if (!this.premiumItem.id) {
                        return this.$alert("兑换信息暂不可用，请稍后再试", "暂不能兑换", {
                            confirmButtonText: "知道了",
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return alertMallRequirement(this, this.premiumItem, this.canBuyInfo);
            }

            this.$confirm(`确认使用 ${this.requiredPoints} 积分开通高级版会员？`, "确认兑换", {
                confirmButtonText: "确认兑换",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.isSubmitting = true;
                    const prevExpireDate = this.asset.pro_expire_date || "";
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: this.premiumItemId,
                            count: 1,
                            addressId: 0,
                            remark: "高级版会员积分兑换",
                        })
                        .then(() => {
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            return Promise.all([this.refreshAssetAfterExchange(prevExpireDate), this.loadPremiumItem()]);
                        })
                        .then(() => {
                            this.$notify.success({
                                title: "兑换成功",
                                message: "会员权益已开通或续期",
                            });
                        });
                })
                .catch((error) => {
                    if (error === "cancel" || error === "close") return;
                    return handleMallExchangeError(this, error);
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        },
    },
    mounted: async function () {
        this.loadPremiumItem();
        this.isLogin && this.loadAsset();

        if (User.isLogin()) {
            this.$nextTick(async () => {
                await setUserMeta("vip_pop", { val: 0 });
                let config = await getConfig({ key: "vip" });
                localStorage.setItem("vip_pop", config.val);

                this.currentKey++;
            });
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/premium.less";
</style>
