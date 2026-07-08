<template>
    <div>
        <CommonHeader></CommonHeader>
        <Main class="m-vip-container m-namespace-page" :withoutRight="true" :withoutLeft="true">
            <div class="m-namespace">
                <simple-header class="m-namespace-title" title="剑网3.com" desc="Register your namespace" />

                <div class="m-namespace-main" v-if="!done">
                    <div class="m-namespace-panel">
                        <div class="m-namespace-count">
                            <span>剩余铭牌次数</span>
                            <b>{{ namespaceCount }}</b>
                        </div>

                        <div class="m-namespace-exchange">
                            <div>
                                <b>积分兑换铭牌次数</b>
                                <span v-if="isCardLoading">正在读取兑换信息...</span>
                                <span v-else-if="cardLoadError">{{ cardLoadError }}</span>
                                <span v-else>{{ cardCostText || "兑换信息暂不可用" }}</span>
                            </div>
                            <el-button type="primary" plain @click="buy" :loading="isBuying" :disabled="isCardLoading">
                                兑换
                            </el-button>
                        </div>
                    </div>

                    <div class="m-namespace-guide">
                        <h3>注册铭牌</h3>
                        <p>
                            铭牌可通过关键词快速在浏览器中输入<b>剑网3.com/您的关键词</b>访问指定链接地址。
                        </p>
                        <a class="u-register-link" :href="register_namespace_url" target="_blank">前往注册铭牌</a>
                    </div>
                </div>

                <result class="m-namespace-result" v-else>
                    <template #title>
                        <div class="m-namespace-result-title">购买成功</div>
                    </template>
                    <template #desc>
                        <div class="m-namespace-result-desc">
                            <p>购买成功，<a :href="register_namespace_url" target="_blank">前往注册铭牌</a></p>
                            <el-button class="u-back" @click="goBack" plain icon="RefreshLeft">返回</el-button>
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
            if (this.namespaceCard.price_points) costs.push(`${this.namespaceCard.price_points} 积分`);
            if (this.namespaceCard.price_boxcoin) costs.push(`${this.namespaceCard.price_boxcoin} 盒币`);
            if (this.namespaceCard.price_cny) costs.push(`${this.namespaceCard.price_cny} 金箔`);
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
                    this.cardLoadError = err?.response?.data?.msg || err?.message || "请稍后再试";
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
            if (!this.canBuyInfo.namespace_level) return `账号等级不足：Lv.${NAMESPACE_MIN_LEVEL} 及以上用户才可兑换铭牌`;
            if (!this.canBuyInfo.points) return `积分不足：需要 ${this.namespaceCard.price_points || 0} 积分`;
            if (!this.canBuyInfo.box_coin) return `盒币不足：需要 ${this.namespaceCard.price_boxcoin || 0} 盒币`;
            if (!this.canBuyInfo.cny) return `金箔不足：需要 ${this.namespaceCard.price_cny || 0} 金箔`;
            if (!this.canBuyInfo.stock) return "库存不足：当前不可购买";
            if (!this.canBuyInfo.buy_time) return "当前不在可购买时间内";
            if (!this.canBuyInfo.level) return "账号等级不足，暂不能购买";
            if (!this.canBuyInfo.vip_limit) return "该商品仅会员可购买";
            return "当前不满足购买条件";
        },
        buy() {
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (!this.namespaceCard.id) {
                return this.loadNamespaceCard().then(() => {
                    if (!this.namespaceCard.id) {
                        return this.$alert("兑换信息暂不可用，请稍后再试", "暂不能兑换", {
                            confirmButtonText: "知道了",
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), "暂不能购买", {
                    confirmButtonText: "知道了",
                    type: "warning",
                }).catch(() => {});
            }
            const cost = Number(this.namespaceCard.price_points) || 0;
            this.$confirm(`确认消耗${cost}积分兑换一个铭牌吗？`, "确认兑换", {
                confirmButtonText: "确认兑换",
                cancelButtonText: "取消",
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
                                title: "兑换成功",
                                message: "铭牌数量已刷新",
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
