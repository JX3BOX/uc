<template>
    <div>
        <CommonHeader></CommonHeader>
        <Main class="m-vip-container m-namespace-page" :withoutRight="true" :withoutLeft="true">
            <div class="m-namespace">
                <simple-header class="m-namespace-title" title="剑网3.com" desc="Register your namespace" />
                <div class="m-namespace-desc">
                    <i class="el-icon-question"></i>
                    铭牌可通过关键词快速在浏览器中输入<b>剑网3.com/您的关键词</b>访问您所指定的链接地址。
                </div>

                <div class="m-namespace-main" v-if="!done">
                    <div class="m-namespace-owned">
                        <div class="u-owned-label">当前拥有</div>
                        <div class="u-owned-count">{{ namespaceCount }}</div>
                        <div class="u-owned-desc">购买后可前往发布中心注册新的剑网3铭牌。</div>
                        <a class="u-register-link" :href="register_namespace_url" target="_blank">前往注册铭牌</a>
                    </div>

                    <div class="m-namespace-card">
                        <div class="m-card-head">
                            <div class="u-card-kicker">铭牌兑换</div>
                            <a class="u-mall-link" :href="`/vip/mall/${namespaceCardId}`" target="_blank">查看商品</a>
                        </div>
                        <div class="m-namespace-good" v-if="isCardLoading">
                            <i class="el-icon-loading"></i>
                            <span>正在读取商品信息...</span>
                        </div>
                        <div class="m-namespace-good is-error" v-else-if="cardLoadError">
                            <b>商品信息加载失败</b>
                            <span>{{ cardLoadError }}</span>
                            <button type="button" @click="loadNamespaceCard">重试</button>
                        </div>
                        <template v-else>
                            <div class="m-namespace-good">
                                <img
                                    v-if="namespaceCardCover"
                                    class="u-card-cover"
                                    :src="namespaceCardCover"
                                    :alt="namespaceCard.title"
                                />
                                <div v-else class="u-card-cover u-card-cover-null">铭牌</div>
                                <div class="m-card-info">
                                    <div class="u-card-title">{{ namespaceCard.title || "剑网3铭牌" }}</div>
                                    <div class="u-card-desc">购买后增加铭牌注册次数</div>
                                </div>
                            </div>
                            <div class="m-card-cost">
                                <span v-if="namespaceCard.price_points">
                                    <img src="@/assets/img/vip/vip2/points.svg" alt="" svg-inline />
                                    {{ namespaceCard.price_points }} 积分
                                </span>
                                <span v-if="namespaceCard.price_boxcoin">
                                    <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" svg-inline />
                                    {{ namespaceCard.price_boxcoin }} 盒币
                                </span>
                                <span v-if="namespaceCard.price_cny">{{ namespaceCard.price_cny }} 金箔</span>
                                <span v-if="!cardCostText">待配置</span>
                            </div>
                            <div class="m-card-meta">
                                <span :class="{ canBuy: canBuyInfo.points }">积分</span>
                                <span :class="{ canBuy: canBuyInfo.box_coin }">盒币</span>
                                <span :class="{ canBuy: canBuyInfo.cny }">金箔</span>
                                <span :class="{ canBuy: canBuyInfo.stock }">库存{{ stockText }}</span>
                                <span :class="{ canBuy: canBuyInfo.buy_time }">购买期</span>
                            </div>
                            <button
                                class="u-card-buy"
                                type="button"
                                :class="{ disabled: !canBuyNamespaceCard }"
                                :disabled="isBuying"
                                @click="buy"
                            >
                                {{ buyButtonText }}
                            </button>
                        </template>
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
import { publishLink, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __cdn } from "@/utils/config";
import { getItem } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";

const NAMESPACE_CARD_ID = 39;

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
        namespaceCardCover() {
            return this.normalizeImageUrl(this.namespaceCard.goods_images?.[0]);
        },
        stock() {
            return Number(this.namespaceCard.stock) || 0;
        },
        stockText() {
            return this.stock > 0 ? `${this.stock} 件` : "不足";
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
                buy_time: true,
                stock: true,
            };
            if (!item.id) info.canBuy = false;
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
        canBuyNamespaceCard() {
            return !!this.canBuyInfo.canBuy && !this.isBuying;
        },
        buyButtonText() {
            if (this.isBuying) return "购买中...";
            if (!this.isLogin) return "登录后购买铭牌";
            return "直接购买铭牌";
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
        normalizeImageUrl(url) {
            const value = String(url || "").trim();
            if (!value) return "";
            if (/^(?:data:|blob:)/i.test(value)) return value;
            if (value.startsWith("//")) return resolveImagePath(`https:${value}`);
            if (/^https?:\/\//i.test(value)) return resolveImagePath(value);
            return resolveImagePath(`${__cdn}${value.replace(/^\/+/, "")}`);
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
                return this.loadNamespaceCard();
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), "暂不能购买", {
                    confirmButtonText: "知道了",
                    type: "warning",
                });
            }
            this.$confirm(`确认购买「${this.namespaceCard.title || "剑网3铭牌"}」？`, "确认购买", {
                confirmButtonText: "确认购买",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.isBuying = true;
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
                            this.done = true;
                            this.$notify.success({
                                title: "购买成功",
                                message: "铭牌数量已刷新",
                            });
                            this.redirect();
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
