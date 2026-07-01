<template>
    <CommonHeader :key="currentKey"></CommonHeader>
    <Main :withoutRight="true" :withoutLeft="true">
        <div class="m-premium-container">
            <img class="u-vip-title" src="@/assets/img/vip/vip2/title.png" alt="高级版会员" />
            <div class="m-premium">
                <Premium :data="premiumData" />
                <div class="m-premium-exchange">
                    <div class="m-exchange-head">
                        <div>
                            <div class="u-kicker">积分兑换</div>
                            <h1>使用积分开通高级版会员</h1>
                        </div>
                        <a class="u-mall-link" :href="`/vip/mall/${premiumItemId}`" target="_blank">查看商品</a>
                    </div>

                    <div v-if="isItemLoading" class="m-exchange-card is-loading">
                        <i class="el-icon-loading"></i>
                        <span>正在读取会员兑换商品...</span>
                    </div>
                    <div v-else-if="loadError" class="m-exchange-card is-error">
                        <b>商品信息加载失败</b>
                        <span>{{ loadError }}</span>
                        <button type="button" @click="loadPremiumItem">重试</button>
                    </div>
                    <div v-else class="m-exchange-card">
                        <div class="m-good-summary">
                            <img v-if="previewImage" class="u-good-cover" :src="previewImage" :alt="premiumItem.title" />
                            <div v-else class="u-good-cover u-good-cover-null">会员</div>
                            <div class="m-good-info">
                                <div class="u-good-title">{{ premiumItem.title || "高级版会员" }}</div>
                                <div class="u-good-desc">兑换后将按商品规则开通或续期高级版会员权益</div>
                            </div>
                        </div>

                        <div class="m-cost-panel">
                            <div class="u-cost-item">
                                <span>本次消耗</span>
                                <b>
                                    <img src="@/assets/img/vip/vip2/points.svg" alt="" svg-inline />
                                    {{ requiredPointsText }}
                                </b>
                            </div>
                            <div class="u-cost-item">
                                <span>当前积分</span>
                                <b>
                                    <img src="@/assets/img/vip/vip2/points.svg" alt="" svg-inline />
                                    {{ assetPoints }}
                                </b>
                            </div>
                        </div>

                        <div class="m-condition-list">
                            <span :class="{ canBuy: canBuyInfo.points }">积分{{ canBuyInfo.points ? "充足" : "不足" }}</span>
                            <span :class="{ canBuy: canBuyInfo.stock }">库存{{ stockText }}</span>
                            <span :class="{ canBuy: canBuyInfo.buy_time }">{{
                                canBuyInfo.buy_time ? "兑换期内" : "不在兑换期"
                            }}</span>
                            <span v-if="premiumItem.vip_limit" :class="{ canBuy: canBuyInfo.vip_limit }">会员限制</span>
                        </div>

                        <div class="u-period">兑换时间：{{ sellTimeRangeText }}</div>
                        <div v-if="configError" class="u-warning">
                            当前会员商品包含非积分消耗配置，请联系管理员检查商品 {{ premiumItemId }}。
                        </div>
                        <button
                            class="u-exchange-button"
                            type="button"
                            :class="{ disabled: !canExchange }"
                            :disabled="isSubmitting"
                            @click="exchangePremium"
                        >
                            {{ exchangeButtonText }}
                        </button>
                        <div class="u-tips">
                            * 本虚拟商品兑换后不支持退货<br />
                            * 实际开通时长、消耗积分以商品配置为准
                        </div>
                    </div>
                </div>
                <Privilege />
            </div>
        </div>
    </Main>
    <CommonFooter></CommonFooter>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Privilege from "./components/privilege.vue";
import Premium from "./components/premium.vue";

import { showDate } from "@jx3box/jx3box-common/js/moment";
import { checkIsTeammate } from "@/service/vip/premium.js";
import { setUserMeta, getConfig } from "@/service/vip/cms";
import { getItem } from "@/service/vip/mall";
import { alertMallRequirement, handleMallExchangeError } from "@/utils/mallExchangeError";
import { __cdn } from "@/utils/config";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";

const PREMIUM_ITEM_ID = 160;

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
            is_teammate: false,
        };
    },
    components: {
        Privilege,
        Premium,
    },
    computed: {
        premiumData() {
            return {
                isLogin: this.isLogin,
                expireDate: this.asset.pro_expire_date ? showDate(this.asset.pro_expire_date) : "",
                isTeammate: this.is_teammate,
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
        stockText() {
            return this.stock > 0 ? `${this.stock} 件` : "不足";
        },
        previewImage() {
            return this.normalizeImageUrl(this.premiumItem.goods_images?.[0]);
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
            if (this.configError) return "商品配置异常";
            if (!this.isLogin) return "登录后兑换会员";
            return "立即兑换会员";
        },
        sellTimeRangeText() {
            const start = this.formatSellTime(this.premiumItem.start_sell_time);
            const end = this.formatSellTime(this.premiumItem.end_sell_time);
            return `${start} - ${end}`;
        },
    },
    methods: {
        showDate,
        async loadAsset() {
            const data = await User.getAsset();
            this.asset = data;
            this.$store.commit("mallNew/toState", { asset: data });
            return data;
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
        normalizeImageUrl(url) {
            const value = String(url || "").trim();
            if (!value) return "";
            if (/^(?:data:|blob:)/i.test(value)) return value;
            if (value.startsWith("//")) return resolveImagePath(`https:${value}`);
            if (/^https?:\/\//i.test(value)) return resolveImagePath(value);
            return resolveImagePath(`${__cdn}${value.replace(/^\/+/, "")}`);
        },
        formatSellTime(value) {
            if (!value) return "-";
            return String(value).replace(/-/g, ".").replace(/:\d{2}$/, "");
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
                return this.$alert(`商品 ${this.premiumItemId} 当前包含非积分消耗配置，请联系管理员处理。`, "暂不能兑换", {
                    confirmButtonText: "知道了",
                    type: "warning",
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return alertMallRequirement(this, this.premiumItem, this.canBuyInfo);
            }

            this.$confirm(`确认使用 ${this.requiredPoints} 积分兑换「${this.premiumItem.title || "高级版会员"}」？`, "确认兑换", {
                confirmButtonText: "确认兑换",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.isSubmitting = true;
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: this.premiumItemId,
                            count: 1,
                            addressId: 0,
                            remark: "高级版会员积分兑换",
                        })
                        .then(() => {
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            return Promise.all([this.loadAsset(), this.loadPremiumItem()]);
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
        checkIsTeammate() {
            if (User.isLogin()) {
                checkIsTeammate().then((res) => {
                    this.is_teammate = res.data.data;
                });
            }
        },
    },
    mounted: async function () {
        this.loadPremiumItem();
        this.isLogin && this.loadAsset();

        this.checkIsTeammate();

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
