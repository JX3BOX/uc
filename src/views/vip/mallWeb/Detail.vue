<template>
    <div class="good-detail">
        <div :class="{ 'canBuy-text': true, canBuy: good.canBuy?.canBuy }">
            {{ good.canBuy?.canBuy ? $t("vip.mall.currentAvailable") : $t("vip.mall.currentUnavailable") }}
        </div>
        <div class="title-card">
            <div class="title">{{ good.title }}</div>
            <div class="apply" v-if="apply[goodInfo.category]">{{ $t("vip.mall.applicationSceneValue", { scene: apply[goodInfo.category] }) }}</div>
        </div>
        <div class="card">
            <div v-if="goodInfo.img" class="skeleton-container">
                <Skeleton :category="goodInfo.category" :img="goodInfo.img"></Skeleton>
            </div>
            <img :src="normalizeMallImage(good.goods_images?.[0])" v-else style="width: 90vw; height: 90vw" />
        </div>
        <div class="buy-detail">
            <div class="detail-card">
                <div class="condition">
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.level }">
                        {{ $t("vip.mall.requiredLevel", { level: good.canBuy?.user_level }) }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.level"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.vip_limit }">
                        {{ $t("vip.mall.memberExclusive") }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.vip_limit"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.box_coin }" v-if="good.price_boxcoin">
                        {{ $t("vip.mall.requiredBoxcoin", { amount: good.price_boxcoin }) }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.box_coin"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.points }" v-if="good.price_points">
                        {{ $t("vip.mall.requiredPoints", { amount: good.price_points }) }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.points"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                </div>
                <div class="buy-time" :class="{ canBuy: good.canBuy?.buy_time }">
                    {{ $t("vip.mall.exchangeTime", { start: good.start_sell_time, end: good.end_sell_time })
                    }}{{ good.canBuy?.buy_time ? "" : $t("vip.mall.outsideExchangePeriodSuffix") }}
                </div>
                <div class="buttons">
                    <button class="button add-cart" :disabled="!good.canBuy?.canBuy" @click="addCart">
                        <img :src="imgUrl + 'cart-fill.svg'" alt="" />
                        {{ $t("vip.mall.addToCart") }}
                    </button>
                    <button class="button buy" @click="buyGoods" :disabled="!good?.canBuy?.canBuy">
                        <template v-if="good.price_boxcoin">
                            <img :src="imgUrl + 'box_coin_fill.svg'" alt="" />{{ $t("vip.common.boxcoinAmount", { amount: good.price_boxcoin }) }}
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img :src="imgUrl + 'point.svg'" alt="" />{{ $t("vip.common.pointsAmount", { amount: good.price_points }) }}
                        </template>
                    </button>
                    <button class="button like" @click="$refs.like.addLike()">
                        <img :src="imgUrl + 'like.svg'" alt="" />
                        <Like :postId="id" postType="mall" ref="like"></Like>
                    </button>
                </div>
            </div>
            <div v-if="good.describe" class="good-comment" v-html="good.describe"></div>
        </div>
        <BuyConfirm ref="buyConfirm" :item="good"></BuyConfirm>
    </div>
</template>

<script>
import { getItem } from "@/service/vip/mall";
import User from "@jx3box/jx3box-common/js/user";
import Skeleton from "../mallNew/components/skeleton/index.vue";
import Like from "../mallNew/components/Like.vue";
import { throttle } from "lodash";
import { __cdn } from "@/utils/config";
import BuyConfirm from "./components/BuyConfirm.vue";
import { playAddCartFly } from "@/utils/mallCartFly";
import { resolveMallSkinCategory } from "@/utils/mallDecoration";
import { normalizeMallImage } from "@/utils/mallImage";
export default {
    name: "mall_detail_web",
    components: {
        Skeleton,
        Like,
        BuyConfirm,
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            id: this.$route.params.id,
            good: {},
        };
    },
    computed: {
        apply() {
            return {
                palu: this.$t("vip.mall.scenes.forumStyle"),
                avatar: this.$t("vip.mall.scenes.avatar"),
                emoticon: this.$t("vip.mall.scenes.emoticon"),
                comment: this.$t("vip.mall.scenes.comment"),
                sidebar: this.$t("vip.mall.scenes.sidebar"),
                atcard: this.$t("vip.mall.scenes.profileCard"),
                calendar: this.$t("vip.mall.scenes.calendar"),
                homebg: this.$t("vip.mall.scenes.homeBackground"),
            };
        },
        asset() {
            return this.$store.state.mallNew.asset;
        },
        goodInfo() {
            if (this.good && this.good.category === "virtual") {
                if (this.good.sub_category === "skin") {
                    const category = resolveMallSkinCategory(this.good);
                    if (!category) {
                        return {
                            category: this.good.sub_category,
                        };
                    }
                    return {
                        category,
                        img: `${__cdn}design/decoration/images/${this.good.remark}/${category}.png`,
                    };
                }
                if (this.good.sub_category === "palu") {
                    return {
                        category: "palu",
                        img: `https://cdn.jx3box.com/design/decoration/palu/${this.good.remark}.png`,
                    };
                }
            }
            return {
                category: this.good.sub_category,
            };
        },
    },
    watch: {
        id: {
            immediate: true,
            handler() {
                this.loadGood();
            },
        },
        asset: {
            deep: true,
            handler() {
                if (this.good.id) {
                    this.good = {
                        ...this.good,
                        canBuy: this.checkCanBuy(this.good),
                    };
                }
            },
        },
    },
    methods: {
        normalizeMallImage,
        checkCanBuy(item) {
            const obj = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                points: true,
                level: true,
                user_level: User.getLevel(item.exp_limit),
                buy_time: true,
            };
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                obj.canBuy = false;
                obj.vip_limit = false;
            }
            if (this.asset.box_coin < item.price_boxcoin) {
                obj.canBuy = false;
                obj.box_coin = false;
            }
            if (this.asset.points < item.price_points) {
                obj.canBuy = false;
                obj.points = false;
            }
            if (this.asset.experience < item.exp_limit) {
                obj.canBuy = false;
                obj.level = false;
            }
            if (item.on_selling === 0) {
                obj.canBuy = false;
                obj.buy_time = false;
            }
            return obj;
        },
        loadGood() {
            if (!this.id) return;
            getItem(this.id).then((res) => {
                const data = res.data?.data || {};
                data.canBuy = this.checkCanBuy(data) || {};
                this.good = data;
            });
        },
        buyGoods: throttle(function () {
            this.$refs.buyConfirm.isShow = true;
        }, 2000),
        addCart: throttle(function (e) {
            const num = this.$store.state.mallNew.cart?.find((item) => item.goods_id === this.good.id)?.amount || 0;
            if (1 + num > this.good.stock) {
                return this.$message({
                    type: "warning",
                    message: this.$t("vip.mall.insufficientStock"),
                });
            }
            this.$store
                .dispatch("mallNew/addCart", {
                    id: this.good.id,
                    amount: 1,
                })
                .then((bol) => {
                    if (bol) {
                        this.fly(e);
                    }
                });
        }, 1000),
        fly(e) {
            playAddCartFly(e, this.$store.state.mallNew.boundCart, { image: this.normalizeMallImage(this.good.goods_images?.[0]) });
        },
    },
};
</script>

<style lang="less" scoped>
.good-detail {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    min-height: calc(100vh - 26.6667vw);
    padding: 6.4vw 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, rgba(27, 58, 105, 1) 0%, rgba(0, 0, 0, 1) 99.23%);
    .canBuy-text {
        height: 6.6667vw;
        line-height: 6.6667vw;
        font-size: 3.7333vw;
        color: rgba(255, 105, 105, 1);
        &.canBuy {
            color: rgba(150, 255, 192, 1);
        }
    }
    .title-card {
        width: 100%;
        height: 15.4667vw;
        padding: 1.0667vw 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: linear-gradient(
            90deg,
            rgba(64, 128, 255, 0) 0%,
            rgba(64, 128, 255, 0.3) 29.64%,
            rgba(64, 128, 255, 0.3) 76.39%,
            rgba(64, 128, 255, 0) 100%
        );
        .title {
            font-size: 5.3333vw;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 8vw;
        }
        .apply {
            font-size: 3.7333vw;
            color: rgba(97, 173, 255, 1);
            text-align: center;
            line-height: 5.6vw;
        }
    }
    .card {
        height: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        .skeleton-container {
            background-color: #fff;
            padding: 2.6667vw;
            border-radius: 2.6667vw;
        }
    }
    .buy-detail {
        min-height: 48vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1.6vw;
        .detail-card {
            min-height: 24vw;
            .condition {
                width: 100%;
                // height: 4.8vw;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                box-sizing: border-box;
                gap: 2.2667vw;
                .condition-item {
                    height: 4.8vw;
                    opacity: 1;
                    border-radius: 1.0667vw;
                    background: rgba(255, 105, 105, 0.3);
                    color: rgba(255, 105, 105, 1);
                    padding: 0vw 1.0667vw 0vw 1.0667vw;
                    font-size: 3.2vw;
                    line-height: 4.8vw;
                    &.canBuy {
                        background: rgba(150, 255, 192, 0.3);
                        color: rgba(150, 255, 192, 1);
                    }
                }
            }
            .buy-time {
                margin-top: 6px;
                height: 4.8vw;
                width: 100%;
                text-align: center;
                font-size: 3.2vw;
                font-weight: 400;
                line-height: 4.8vw;
                color: rgba(255, 105, 105, 1);
                &.canBuy {
                    color: rgba(255, 255, 255, 1);
                }
            }
            .buttons {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 3.2vw;
                margin-top: 2.6667vw;
                .button {
                    cursor: pointer;
                    width: 26.6667vw;
                    height: 9.6vw;
                    border-radius: 3.2vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 3.2vw;
                    font-weight: 700;
                    line-height: 9.6vw;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                    border: none;
                    img {
                        margin-right: 1.0667vw;
                        width: 4.2667vw;
                        height: 4.2667vw;
                    }
                    &.buy {
                        order: 2;
                        width: auto;
                        min-width: 26.6667vw;
                        padding: 0 2.6667vw;
                        box-sizing: border-box;
                        background: rgba(64, 128, 255, 1);
                        &:disabled {
                            background: rgba(168, 168, 168, 1);
                            cursor: not-allowed;
                        }
                    }
                    &.add-cart {
                        background: rgba(255, 163, 43, 1);
                        &:disabled {
                            background: rgba(168, 168, 168, 1);
                            cursor: not-allowed;
                        }
                    }
                    &.like {
                        order: 1;
                        background: rgba(255, 133, 184, 1);
                    }
                }
            }
        }

        .good-comment {
            margin-top: 30px;
            width: 100vw;
            height: 20.5333vw;
            box-sizing: border-box;
            padding: 1.6vw 11.4667vw;
            overflow-y: scroll;
            scrollbar-width: none;
            overflow-x: hidden;
            font-size: 10px;
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.1) 29.64%,
                rgba(255, 255, 255, 0.1) 76.39%,
                rgba(255, 255, 255, 0) 100%
            );
        }
    }
}
</style>
