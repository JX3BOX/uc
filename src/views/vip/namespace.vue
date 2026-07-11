<template>
    <div>
        <CommonHeader></CommonHeader>
        <Main class="m-vip-container m-namespace-page" :withoutRight="true" :withoutLeft="true">
            <div class="m-namespace">
                <simple-header class="m-namespace-title" title="剑网3.com" :desc="$t('vip.namespace.subtitle')" />

                <div class="m-namespace-main" v-if="!done">
                    <div class="m-namespace-panel">
                        <div class="m-namespace-count">
                            <span>{{ $t("vip.namespace.remainingCount") }}</span>
                            <b>{{ namespaceCount }}</b>
                        </div>

                        <div class="m-namespace-exchange">
                            <div>
                                <b>{{ $t("vip.namespace.pointsExchange") }}</b>
                                <span v-if="isCardLoading">{{ $t("vip.common.loadingExchange") }}</span>
                                <span v-else-if="cardLoadError">{{ cardLoadError }}</span>
                                <span v-else>{{ cardCostText || $t("vip.common.exchangeInfoUnavailableShort") }}</span>
                            </div>
                            <el-button type="primary" plain @click="buy" :loading="isBuying" :disabled="isCardLoading">
                                {{ $t("vip.common.exchange") }}
                            </el-button>
                        </div>
                    </div>

                    <div class="m-namespace-guide">
                        <h3>{{ $t("vip.namespace.register") }}</h3>
                        <i18n-t keypath="vip.namespace.guide" tag="p"><b>{{ $t("vip.namespace.exampleUrl") }}</b></i18n-t>
                        <a class="u-register-link" :href="register_namespace_url" target="_blank">{{ $t("vip.namespace.goRegister") }}</a>
                    </div>
                </div>

                <result class="m-namespace-result" v-else>
                    <template #title>
                        <div class="m-namespace-result-title">{{ $t("vip.common.purchaseSuccess") }}</div>
                    </template>
                    <template #desc>
                        <div class="m-namespace-result-desc">
                            <i18n-t keypath="vip.namespace.purchaseSuccessGuide" tag="p"><a :href="register_namespace_url" target="_blank">{{ $t("vip.namespace.goRegister") }}</a></i18n-t>
                            <el-button class="u-back" @click="goBack" plain icon="RefreshLeft">{{ $t("vip.common.back") }}</el-button>
                        </div>
                    </template>
                </result>
            </div>
        </Main>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import result from "@/components/vip/result.vue";
import simple_header from "@/components/vip/simple_header.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { getItem } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";

const NAMESPACE_CARD_ID = 39;
const NAMESPACE_MIN_LEVEL = 3;

export default {
    name: "namespace",
    data: function () {
        return {
            isLogin: User.isLogin(),
            done: false,
            refer: "",
            asset: {
                namespace_card_count: 0,
            },
            namespaceCardId: NAMESPACE_CARD_ID,
            namespaceCard: {},
            isCardLoading: false,
            isBuying: false,
            cardLoadError: "",
        };
    },
    computed: {
        register_namespace_url: function () {
            return publishLink("namespace");
        },
        namespaceCount() {
            return (this.asset && this.asset.namespace_card_count) || 0;
        },
        stock() {
            return Number(this.namespaceCard.stock) || 0;
        },
        cardCostText() {
            const costs = [];
            if (this.namespaceCard.price_points) costs.push(this.$t("vip.common.pointsAmount", { amount: this.namespaceCard.price_points }));
            if (this.namespaceCard.price_boxcoin) costs.push(this.$t("vip.common.boxcoinAmount", { amount: this.namespaceCard.price_boxcoin }));
            if (this.namespaceCard.price_cny) costs.push(this.$t("vip.common.cnyAmount", { amount: this.namespaceCard.price_cny }));
            return costs.join(" + ");
        },
        canBuyInfo() {
            const item = this.namespaceCard || {};
            const info = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                points: true,
                cny: true,
                level: true,
                namespace_level: true,
                current_level: User.getLevel(this.asset.experience || 0),
                required_level: NAMESPACE_MIN_LEVEL,
                buy_time: true,
                stock: true,
            };
            if (!item.id) info.canBuy = false;
            if (info.current_level < NAMESPACE_MIN_LEVEL) {
                info.canBuy = false;
                info.namespace_level = false;
            }
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                info.canBuy = false;
                info.vip_limit = false;
            }
            if ((Number(this.asset.points) || 0) < (Number(item.price_points) || 0)) {
                info.canBuy = false;
                info.points = false;
            }
            if ((Number(this.asset.box_coin) || 0) < (Number(item.price_boxcoin) || 0)) {
                info.canBuy = false;
                info.box_coin = false;
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
    },
    methods: {
        loadAsset: function () {
            if (!User.isLogin()) return Promise.resolve({});
            return User.getAsset().then((data) => {
                this.asset = data;
                this.$store.commit("mallNew/toState", { asset: data });
                return data;
            });
        },
        loadNamespaceCard() {
            this.isCardLoading = true;
            this.cardLoadError = "";
            return getItem(this.namespaceCardId)
                .then((res) => {
                    this.namespaceCard = res.data?.data || {};
                })
                .catch((err) => {
                    this.cardLoadError = err?.response?.data?.msg || err?.message || this.$t("vip.common.tryLater");
                })
                .finally(() => {
                    this.isCardLoading = false;
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
        getUnavailableMessage() {
            if (!this.canBuyInfo.namespace_level) return this.$t("vip.namespace.minimumLevel", { level: NAMESPACE_MIN_LEVEL });
            if (!this.canBuyInfo.points) return this.$t("vip.requirements.pointsInsufficient", { amount: this.namespaceCard.price_points || 0 });
            if (!this.canBuyInfo.box_coin) return this.$t("vip.requirements.boxcoinInsufficient", { amount: this.namespaceCard.price_boxcoin || 0 });
            if (!this.canBuyInfo.cny) return this.$t("vip.requirements.cnyInsufficient", { amount: this.namespaceCard.price_cny || 0 });
            if (!this.canBuyInfo.stock) return this.$t("vip.requirements.outOfStock");
            if (!this.canBuyInfo.buy_time) return this.$t("vip.requirements.outsideSaleTime");
            if (!this.canBuyInfo.level) return this.$t("vip.requirements.levelTooLow");
            if (!this.canBuyInfo.vip_limit) return this.$t("vip.requirements.membersOnly");
            return this.$t("vip.requirements.notEligible");
        },
        buy() {
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (!this.namespaceCard.id) {
                return this.loadNamespaceCard().then(() => {
                    if (!this.namespaceCard.id) {
                        return this.$alert(this.$t("vip.common.exchangeInfoUnavailable"), this.$t("vip.common.exchangeUnavailable"), {
                            confirmButtonText: this.$t("vip.common.gotIt"),
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), this.$t("vip.common.purchaseUnavailable"), {
                    confirmButtonText: this.$t("vip.common.gotIt"),
                    type: "warning",
                }).catch(() => {});
            }
            const cost = Number(this.namespaceCard.price_points) || 0;
            this.$confirm(this.$t("vip.namespace.confirmExchangeMessage", { points: cost }), this.$t("vip.common.confirmExchange"), {
                confirmButtonText: this.$t("vip.common.confirmExchange"),
                cancelButtonText: this.$t("vip.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    this.isBuying = true;
                    const nextCount = this.namespaceCount + 1;
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: this.namespaceCardId,
                            count: 1,
                            addressId: 0,
                            remark: "铭牌直接购买",
                        })
                        .then(() => {
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            return Promise.all([this.loadAsset(), this.loadNamespaceCard()]);
                        })
                        .then(() => {
                            this.asset = {
                                ...this.asset,
                                namespace_card_count: Math.max(this.namespaceCount, nextCount),
                            };
                            this.$notify.success({
                                title: this.$t("vip.common.exchangeSuccess"),
                                message: this.$t("vip.namespace.countRefreshed"),
                            });
                            this.done = true;
                        });
                })
                .catch((error) => {
                    if (error === "cancel" || error === "close") return;
                    return handleMallExchangeError(this, error);
                })
                .finally(() => {
                    this.isBuying = false;
                });
        },
        redirect: function () {
            if (this.refer) {
                location.href = this.refer;
            }
        },
        goBack: function () {
            this.done = false;
        },
    },
    created: function () {
        this.isLogin && this.loadAsset();
        this.loadNamespaceCard();

        let params = new URLSearchParams(location.search);
        this.refer = params.get("redirect") || "";
    },
    components: {
        result,
        "simple-header": simple_header,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/vip/namespace.less";
</style>
