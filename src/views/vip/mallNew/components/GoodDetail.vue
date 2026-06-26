<template>
    <div class="good-detail" :class="{ 'without-nav': !isShowNav }">
        <div :class="{ 'canBuy-text': true, canBuy: canBuyInfo.canBuy }">
            {{ buyStatusText }}
        </div>
        <div class="title-card">
            <div class="title">{{ good.title }}</div>
            <div class="apply" v-if="apply[goodInfo.category]">应用场景：{{ apply[goodInfo.category] }}</div>
        </div>
        <div class="card">
            <div class="m-good-preview">
                <div v-if="goodInfo.img" class="skeleton-container">
                    <Skeleton :category="goodInfo.category" :img="goodInfo.img"></Skeleton>
                </div>
                <img v-if="previewImage" :src="previewImage" class="u-good-image" />
                <div v-else class="u-good-image u-good-image-null">暂无图片</div>
            </div>
        </div>
        <div class="buy-detail">
            <div class="detail-card">
                <div class="condition">
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.level }">
                        所需等级：lv.{{ canBuyInfo.user_level }}
                        <i class="el-icon-circle-check" v-if="canBuyInfo.level"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.vip_limit }" v-if="good.vip_limit !== 0">
                        会员专属
                        <i class="el-icon-circle-check" v-if="canBuyInfo.vip_limit"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.box_coin }" v-if="good.price_boxcoin">
                        所需盒币：{{ good.price_boxcoin }}
                        <i class="el-icon-circle-check" v-if="canBuyInfo.box_coin"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.points }" v-if="good.price_points">
                        所需积分：{{ good.price_points }}
                        <i class="el-icon-circle-check" v-if="canBuyInfo.points"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                </div>
                <div class="buy-time" :class="{ canBuy: canBuyInfo.buy_time }">
                    可兑换时间：{{ good.start_sell_time }} ~ {{ good.end_sell_time
                    }}{{ canBuyInfo.buy_time ? "" : "(不在兑换期内)" }}
                </div>
                <div class="buttons">
                    <button class="button add-cart" :class="{ 'is-added': addFeedbackVisible }" @click="addCart">
                        <img :src="imgUrl + 'cart-fill.svg'" alt="" />
                        加购
                        <span v-if="addFeedbackVisible" :key="addFeedbackKey" class="cart-plus">+1</span>
                    </button>
                    <button class="button buy" @click="buyGoods">
                        <template v-if="good.price_boxcoin">
                            <img :src="imgUrl + 'box_coin_fill.svg'" alt="" />{{ good.price_boxcoin }}盒币
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img :src="imgUrl + 'point.svg'" alt="" />{{ good.price_points }}积分
                        </template>
                        <template v-if="!good.price_boxcoin && !good.price_points">免费兑换</template>
                    </button>
                    <button class="button like" @click="$refs.like.addLike()">
                        <img :src="imgUrl + 'like.svg'" alt="" />
                        <Like class="like" :postId="id" postType="mall" ref="like"></Like>
                    </button>
                </div>
            </div>
            <div v-if="sanitizedDescribe" class="good-comment" v-html="sanitizedDescribe"></div>
        </div>
        <BuyConfirm ref="buyConfirm" :item="good" @exchanged="$emit('exchanged', $event)"></BuyConfirm>
    </div>
</template>

<script>
import Like from "./Like.vue";
import BuyConfirm from "./BuyConfirm.vue";
import Skeleton from "@/views/vip/mallNew/components/skeleton/index.vue";
import { throttle } from "lodash";
import { __cdn } from "@/utils/config";
import { resolveMallSkinCategory } from "@/utils/mallDecoration";
import { alertMallRequirement } from "@/utils/mallExchangeError";
import {
    getMallGoodsCartAmount,
    isOwnedSingleMallGoods,
    MALL_DECORATION_OWNED_MESSAGE,
    MALL_DECORATION_SINGLE_LIMIT_MESSAGE,
    shouldBlockSingleDecorationAdd,
} from "@/utils/mallCartLimit";
import DOMPurify from "dompurify";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "GoodMallDetail",
    emits: ["exchanged"],
    components: {
        Skeleton,
        Like,
        BuyConfirm,
    },
    props: {
        good: {
            type: Object,
            required: true,
        },
        isShowNav: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            addFeedbackVisible: false,
            addFeedbackKey: 0,
            addFeedbackTimer: null,
            apply: {
                palu: "魔盒论坛列表页",
                avatar: "头像框",
                emoticon: "表情包",
                comment: "评论皮肤",
                sidebar: "侧边栏主题",
                atcard: "个人名片",
                calendar: "首页日历",
                homebg: "主页风格",
            },
        };
    },
    computed: {
        id() {
            return this.good.id;
        },
        previewImage() {
            return this.good.goods_images?.[0] || "";
        },
        canBuyInfo() {
            return (
                this.good.canBuy || {
                    canBuy: false,
                    vip_limit: false,
                    box_coin: false,
                    points: false,
                    level: false,
                    user_level: "-",
                    buy_time: false,
                }
            );
        },
        buyStatusText() {
            return this.canBuyInfo.canBuy ? "— 当前商品 · 可兑换 —" : "— 当前商品 · 不满足兑换条件 —";
        },
        sanitizedDescribe() {
            return this.good.describe ? DOMPurify.sanitize(this.good.describe) : "";
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
                        img: __cdn + `design/decoration/images/${this.good.remark}/${category}.png`,
                    };
                }
                if (this.good.sub_category === "palu") {
                    return {
                        category: "palu",
                        img: __cdn + `design/decoration/palu/${this.good.remark}.png`,
                    };
                }
            }
            return {
                category: this.good.sub_category,
            };
        },
    },
    methods: {
        buyGoods: throttle(function () {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.canBuyInfo.canBuy) {
                return alertMallRequirement(this, this.good, this.canBuyInfo);
            }
            if (isOwnedSingleMallGoods(this.good)) {
                return this.$message({
                    type: "warning",
                    message: MALL_DECORATION_OWNED_MESSAGE,
                });
            }
            this.$refs.buyConfirm.isShow = true;
        }, 2000),
        addCart: throttle(function () {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.canBuyInfo.canBuy) {
                return alertMallRequirement(this, this.good, this.canBuyInfo);
            }
            if (isOwnedSingleMallGoods(this.good)) {
                return this.$message({
                    type: "warning",
                    message: MALL_DECORATION_OWNED_MESSAGE,
                });
            }
            if (shouldBlockSingleDecorationAdd(this.$store.state.mallNew.cart, this.good)) {
                return this.$message({
                    type: "warning",
                    message: MALL_DECORATION_SINGLE_LIMIT_MESSAGE,
                });
            }
            const num = getMallGoodsCartAmount(this.$store.state.mallNew.cart, this.good);
            if (1 + num > this.good.stock) {
                return this.$message({
                    type: "warning",
                    message: "可兑换库存不足",
                });
            }
            this.$store
                .dispatch("mallNew/addCart", {
                    id: this.good.id,
                    amount: 1,
                })
                .then((bol) => {
                    if (bol) {
                        this.playAddFeedback();
                    }
                });
        }, 1000),
        playAddFeedback() {
            this.addFeedbackKey += 1;
            this.addFeedbackVisible = true;
            clearTimeout(this.addFeedbackTimer);
            this.addFeedbackTimer = setTimeout(() => {
                this.addFeedbackVisible = false;
            }, 620);
        },
    },
    beforeUnmount() {
        clearTimeout(this.addFeedbackTimer);
    },
};
</script>

<style lang="less" scoped>
.good-detail {
    margin-left: 0;
    &.without-nav {
        margin-left: -120px;
    }
    @media screen and (max-width: 1550px) {
        &.without-nav {
            margin-left: -124px;
        }
    }
    flex: 1;
    box-sizing: border-box;
    min-width: 500px;
    min-height: calc(100vh - 100px);
    padding: 24px clamp(16px, 3vw, 48px);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: margin-left 0.3s ease-in-out;
    .canBuy-text {
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: rgba(255, 105, 105, 1);
        &.canBuy {
            color: rgba(150, 255, 192, 1);
        }
    }
    .title-card {
        width: min(500px, 100%);
        height: 58px;
        padding: 4px 0;
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
            font-size: 20px;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 30px;
        }
        .apply {
            font-size: 14px;
            color: rgba(97, 173, 255, 1);
            text-align: center;
            line-height: 21px;
        }
    }
    .card {
        width: min(500px, 100%);
        height: clamp(360px, 52vh, 480px);
        display: flex;
        justify-content: center;
        align-items: center;
        .m-good-preview {
            position: relative;
            display: inline-flex;
        }
        .u-good-image {
            width: min(400px, 100%);
            height: min(400px, 52vh);
            min-height: 320px;
            object-fit: cover;
        }
        .u-good-image-null {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.68);
            font-size: 14px;
        }
        .skeleton-container {
            background-color: #fff;
            padding: 10px;
            border-radius: 10px;
        }
    }
    .buy-detail {
        width: min(500px, 100%);
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 6px;
        .detail-card {
            width: 100%;
            min-height: 90px;
            .condition {
                width: 100%;
                display: flex;
                justify-content: center;
                gap: 16px;
                flex-wrap: wrap;
                height: auto;
                min-height: 18px;
                .condition-item {
                    height: 18px;
                    opacity: 1;
                    border-radius: 4px;
                    background: rgba(255, 105, 105, 0.3);
                    color: rgba(255, 105, 105, 1);
                    padding: 0px 4px 0px 4px;
                    font-size: 12px;
                    line-height: 18px;
                    &.canBuy {
                        background: rgba(150, 255, 192, 0.3);
                        color: rgba(150, 255, 192, 1);
                    }
                }
            }
            .buy-time {
                margin-top: 6px;
                height: 18px;
                width: 100%;
                text-align: center;
                font-size: 12px;
                font-weight: 400;
                line-height: 18px;
                color: rgba(255, 105, 105, 1);
                &.canBuy {
                    color: rgba(255, 255, 255, 1);
                }
            }
            .buttons {
                width: 100%;
                height: 36px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                margin-top: 10px;
                .button {
                    cursor: pointer;
                    width: 100px;
                    height: 36px;
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 36px;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                    border: none;
                    &:disabled {
                        cursor: not-allowed;
                    }
                    img {
                        margin-right: 4px;
                    }
                    &.buy {
                        width: auto;
                        min-width: 100px;
                        padding: 0 10px;
                        box-sizing: border-box;
                        background: rgba(64, 128, 255, 1);
                        &:disabled {
                            background: rgba(168, 168, 168, 1);
                            cursor: not-allowed;
                        }
                    }
                    &.add-cart {
                        position: relative;
                        overflow: visible;
                        background: rgba(255, 163, 43, 1);
                        &:disabled {
                            background: rgba(168, 168, 168, 1);
                            cursor: not-allowed;
                        }
                        &.is-added {
                            animation: detail-cart-pop 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
                        }
                        .cart-plus {
                            position: absolute;
                            z-index: 2;
                            top: -18px;
                            right: 10px;
                            color: rgba(255, 220, 126, 1);
                            font-size: 13px;
                            font-weight: 900;
                            line-height: 1;
                            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
                            pointer-events: none;
                            animation: detail-cart-plus-rise 0.62s cubic-bezier(0.18, 0.82, 0.2, 1) both;
                        }
                    }
                    &.like {
                        background: rgba(255, 133, 184, 1);
                    }
                }
            }
        }

        .good-comment {
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            padding: 0 43px;
            overflow: scroll;
            scrollbar-width: none;
            color: rgba(#fff, 0.75);
            font-size: 12px;
            font-weight: 400;
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

@keyframes detail-cart-pop {
    0% {
        transform: scale(1);
    }

    45% {
        transform: scale(1.08);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes detail-cart-plus-rise {
    0% {
        opacity: 0;
        transform: translate3d(0, 6px, 0) scale(0.86);
    }

    18% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: translate3d(0, -18px, 0) scale(1);
    }
}
</style>
