<template>
    <div>
        <CommonHeader></CommonHeader>
        <Main class="m-vip-container m-premium-page" :withoutRight="true" :withoutLeft="true">
            <div class="m-vip-premium">
                <simple-header class="m-vip-premium-title" :title="$t('vip.premium.title')" :desc="$t('vip.premium.subtitle')" />

                <div class="m-vip-premium-main">
                    <div class="m-premium-panel">
                        <Premium :data="premiumData" />

                        <div class="m-premium-exchange">
                            <div>
                                <b>{{ $t("vip.premium.pointsExchange") }}</b>
                                <span v-if="isItemLoading || isInitializing">{{ $t("vip.common.loadingExchange") }}</span>
                                <span v-else-if="loadError">{{ loadError }}</span>
                                <span v-else>{{ $t("vip.premium.pointsPerExchange", { points: requiredPointsText }) }}</span>
                            </div>
                            <el-button type="primary" @click="exchangePremium" :loading="isSubmitting" :disabled="isItemLoading || isInitializing">
                                {{ exchangeButtonText }}
                            </el-button>
                        </div>
                    </div>

                    <Privilege class="m-premium-privilege" />

                    <section class="m-premium-levels">
                        <h3>{{ $t("vip.premium.levelDiscountTitle") }}</h3>
                        <p>{{ $t("vip.premium.levelDiscountHint") }}</p>
                        <div class="m-premium-level-grid">
                            <div
                                v-for="tier in premiumTiers"
                                :key="tier.id"
                                class="m-premium-level-card"
                                :class="{ 'is-current': isLogin && assetLoaded && tier.id === premiumItemId }"
                            >
                                <div class="u-level-head">
                                    <b>{{ $t(`vip.premium.${tier.label}`) }}</b>
                                    <span v-if="isLogin && assetLoaded && tier.id === premiumItemId" class="u-current">{{ $t("vip.premium.currentTier") }}</span>
                                </div>
                                <div class="u-price"><strong>{{ tier.points }}</strong> {{ $t("vip.premium.pointsUnit") }}</div>
                                <span class="u-discount">{{ $t(`vip.premium.${tier.discount}`) }}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Main>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import dayjs from "dayjs";
import Privilege from "./components/privilege.vue";
import Premium from "./components/premium.vue";
import simple_header from "@/components/vip/simple_header.vue";

import { showDate } from "@jx3box/jx3box-common/js/moment";
import { getItem } from "@/service/vip/mall";
import { alertMallRequirement, handleMallExchangeError } from "@/utils/mallExchangeError";

const PREMIUM_TIERS = [
    { id: 160, minLevel: 1, points: 200, label: "levelOneTwo", discount: "standardPrice" },
    { id: 387, minLevel: 3, points: 100, label: "levelThreeFour", discount: "halfPrice" },
    { id: 388, minLevel: 5, points: 60, label: "levelFivePlus", discount: "thirtyPercentPrice" },
];
const ASSET_REFRESH_RETRY = 4;
const ASSET_REFRESH_DELAY = 600;

export default {
    data: function () {
        return {
            premiumTiers: PREMIUM_TIERS,
            isInitializing: true,
            assetLoaded: false,
            pendingExpireDate: "",
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
        userLevel() {
            return Number(User.getLevel(this.asset.experience)) || 1;
        },
        premiumItemId() {
            return [...this.premiumTiers].reverse().find((tier) => this.userLevel >= tier.minLevel).id;
        },
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
            return this.requiredPoints ? this.requiredPoints : this.$t("vip.common.pendingConfig");
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

            if (!item.id || Number(item.id) !== this.premiumItemId || !this.assetLoaded || this.configError) {
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
            if (this.isSubmitting) return this.$t("vip.common.exchanging");
            if (this.configError) return this.$t("vip.premium.configError");
            return this.$t("vip.common.exchange");
        },
    },
    methods: {
        showDate,
        wait(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        async loadAsset() {
            const data = await User.getAsset();
            const pending = dayjs(this.pendingExpireDate);
            const actual = dayjs(data.pro_expire_date);
            if (pending.isValid() && (!actual.isValid() || actual.isBefore(pending))) {
                this.asset = { ...data, pro_expire_date: this.pendingExpireDate };
            } else {
                this.asset = data;
                this.pendingExpireDate = "";
            }
            this.assetLoaded = true;
            this.$store.commit("mallNew/toState", { asset: this.asset });
            return data;
        },
        extendPremiumAfterExchange(prevExpireDate) {
            const now = dayjs();
            const previous = dayjs(prevExpireDate);
            const base = previous.isValid() && previous.isAfter(now) ? previous : now;
            this.pendingExpireDate = base.add(30, "day").toISOString();
            this.asset = { ...this.asset, pro_expire_date: this.pendingExpireDate };
            this.$store.commit("mallNew/toState", { asset: this.asset });
        },
        async refreshAssetAfterExchange() {
            for (let i = 0; i <= ASSET_REFRESH_RETRY; i++) {
                if (i) await this.wait(ASSET_REFRESH_DELAY);
                try {
                    await this.loadAsset();
                    if (!this.pendingExpireDate) break;
                } catch {
                    // 兑换已成功，资产同步失败时保留本地更新的到期时间。
                }
            }
            return this.asset;
        },
        async initializeExchange() {
            this.isInitializing = true;
            this.loadError = "";
            try {
                if (this.isLogin) await this.loadAsset();
                await this.loadPremiumItem();
            } catch (err) {
                this.loadError = err?.response?.data?.msg || err?.message || this.$t("vip.common.tryLater");
            } finally {
                this.isInitializing = false;
            }
        },
        loadPremiumItem() {
            this.isItemLoading = true;
            this.loadError = "";
            this.premiumItem = {};
            return getItem(this.premiumItemId)
                .then((res) => {
                    this.premiumItem = res.data?.data || {};
                })
                .catch((err) => {
                    this.loadError = err?.response?.data?.msg || err?.message || this.$t("vip.common.tryLater");
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
            if (this.isInitializing || this.isItemLoading || this.isSubmitting) return;
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (!this.assetLoaded) return this.initializeExchange();
            if (this.configError) {
                return this.$alert(this.$t("vip.premium.invalidConfigMessage"), this.$t("vip.common.exchangeUnavailable"), {
                    confirmButtonText: this.$t("vip.common.gotIt"),
                    type: "warning",
                });
            }
            if (!this.premiumItem.id) {
                return this.loadPremiumItem().then(() => {
                    if (!this.premiumItem.id) {
                        return this.$alert(this.$t("vip.common.exchangeInfoUnavailable"), this.$t("vip.common.exchangeUnavailable"), {
                            confirmButtonText: this.$t("vip.common.gotIt"),
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return alertMallRequirement(this, this.premiumItem, this.canBuyInfo);
            }

            const itemId = this.premiumItemId;
            this.isSubmitting = true;
            return this.$confirm(this.$t("vip.premium.confirmMessage", { points: this.requiredPoints }), this.$t("vip.common.confirmExchange"), {
                confirmButtonText: this.$t("vip.common.confirmExchange"),
                cancelButtonText: this.$t("vip.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    const prevExpireDate = this.asset.pro_expire_date || "";
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: itemId,
                            count: 1,
                            addressId: 0,
                            remark: "高级版会员积分兑换",
                        })
                        .then(() => {
                            this.extendPremiumAfterExchange(prevExpireDate);
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            this.$notify.success({
                                title: this.$t("vip.common.exchangeSuccess"),
                                message: this.$t("vip.premium.exchangeSuccessMessage"),
                            });
                            return this.refreshAssetAfterExchange().then(() => this.loadPremiumItem());
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
    mounted: function () {
        this.initializeExchange();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/premium.less";
</style>
