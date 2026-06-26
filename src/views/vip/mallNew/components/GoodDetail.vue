<template>
    <div class="good-detail" :class="{ 'without-nav': !isShowNav }">
        <div class="status-row">
            <span class="status-label">当前商品</span>
            <span class="status-pill" :class="{ canBuy: canBuyInfo.canBuy }">
                <i :class="canBuyInfo.canBuy ? 'el-icon-circle-check' : 'el-icon-circle-close'"></i>
                {{ buyStatusText }}
            </span>
        </div>
        <div class="title-card">
            <div class="title">{{ good.title }}</div>
            <div class="apply" v-if="apply[goodInfo.category]">
                <span>应用场景</span>
                <strong>{{ apply[goodInfo.category] }}</strong>
            </div>
        </div>
        <div class="card">
            <div class="m-good-preview">
                <div v-if="isDecorationPreview && goodInfo.img" class="skeleton-container">
                    <Skeleton :category="goodInfo.category" :img="goodInfo.img"></Skeleton>
                </div>
                <el-carousel
                    v-else-if="previewImages.length > 1"
                    class="goods-image-carousel"
                    height="400px"
                    arrow="always"
                >
                    <el-carousel-item v-for="(image, index) in previewImages" :key="`${image}-${index}`">
                        <img :src="image" class="goods-carousel-image" />
                    </el-carousel-item>
                </el-carousel>
                <img v-else-if="previewImages.length === 1" :src="previewImages[0]" class="u-good-image" />
                <div v-else class="u-good-image u-good-image-null">暂无预览</div>
            </div>
        </div>
        <div class="buy-detail">
            <div class="detail-card">
                <div class="condition">
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.level }">
                        <span>等级</span>
                        <b>Lv.{{ canBuyInfo.user_level }}</b>
                        <i class="el-icon-circle-check" v-if="canBuyInfo.level"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.vip_limit }" v-if="good.vip_limit !== 0">
                        <span>会员</span>
                        <b>专属</b>
                        <i class="el-icon-circle-check" v-if="canBuyInfo.vip_limit"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.box_coin }" v-if="good.price_boxcoin">
                        <span>盒币</span>
                        <b>{{ good.price_boxcoin }}</b>
                        <i class="el-icon-circle-check" v-if="canBuyInfo.box_coin"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: canBuyInfo.points }" v-if="good.price_points">
                        <span>积分</span>
                        <b>{{ good.price_points }}</b>
                        <i class="el-icon-circle-check" v-if="canBuyInfo.points"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                </div>
                <div class="buy-time" :class="{ canBuy: canBuyInfo.buy_time }" :title="sellTimeFullText">
                    <span>兑换期</span>
                    <b>{{ sellTimeRangeText }}</b>
                    <em v-if="!canBuyInfo.buy_time">不在兑换期内</em>
                </div>
                <div class="buttons">
                    <button class="button add-cart" :class="{ 'is-added': addFeedbackVisible }" @click="addCart">
                        <img :src="imgUrl + 'cart-fill.svg'" alt="" />
                        加购
                        <span v-if="addFeedbackVisible" :key="addFeedbackKey" class="cart-plus">+1</span>
                    </button>
                    <button class="button buy" @click="buyGoods">
                        <img :src="redeemIcon" alt="" />
                        <span>兑换</span>
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
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
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
                palu: "论坛帖子风格",
                avatar: "头像框",
                emoticon: "表情包",
                homebg: "PC/移动主页风格、移动个人中心主题",
                atcard: "PC/移动个人名片",
                calendar: "PC首页日历、移动首屏KV",
                comment: "PC评论风格、移动论坛风格",
                sidebar: "PC作品侧栏、移动底部图标",
            },
        };
    },
    computed: {
        id() {
            return this.good.id;
        },
        isDecorationPreview() {
            return this.good.category === "virtual" && this.good.sub_category === "skin";
        },
        previewImages() {
            return Array.isArray(this.good.goods_images) ? this.good.goods_images.filter(Boolean) : [];
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
            return this.canBuyInfo.canBuy ? "可兑换" : "不满足兑换条件";
        },
        redeemIcon() {
            return this.good.price_boxcoin ? this.imgUrl + "box_coin_fill.svg" : this.imgUrl + "point.svg";
        },
        sellTimeFullText() {
            const start = this.good.start_sell_time || "-";
            const end = this.good.end_sell_time || "-";
            return `可兑换时间：${start} ~ ${end}`;
        },
        sellTimeRangeText() {
            const start = this.formatSellTime(this.good.start_sell_time);
            const end = this.formatSellTime(this.good.end_sell_time);
            return `${start} - ${end}`;
        },
        sanitizedDescribe() {
            const html = this.good.describe ? DOMPurify.sanitize(this.good.describe) : "";
            return this.normalizeHtmlImageUrls(html);
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
        formatSellTime(value) {
            const text = String(value || "-");
            return text.replace(/-/g, ".").replace(/:\d{2}$/, "");
        },
        normalizeImageUrl(url) {
            const value = String(url || "").trim();
            if (!value) return "";
            if (/^(?:data:|blob:)/i.test(value)) return value;
            if (value.startsWith("//")) return resolveImagePath(`https:${value}`);
            if (/^https?:\/\//i.test(value)) return resolveImagePath(value);
            return resolveImagePath(`${__cdn}${value.replace(/^\/+/, "")}`);
        },
        normalizeHtmlImageUrls(html) {
            if (!html || typeof window === "undefined" || typeof window.DOMParser === "undefined") return html;
            const doc = new window.DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
            doc.querySelectorAll("img").forEach((img) => {
                const src = this.normalizeImageUrl(img.getAttribute("src"));
                if (src) img.setAttribute("src", src);
            });
            return doc.body.firstElementChild?.innerHTML || html;
        },
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
    height: calc(100vh - 96px);
    min-height: calc(100vh - 100px);
    padding: 24px clamp(16px, 3vw, 48px);
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    transition: margin-left 0.3s ease-in-out;

    &::-webkit-scrollbar {
        display: none;
    }

    .status-row {
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        background: rgba(2, 10, 24, 0.36);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);

        .status-label {
            font-size: 12px;
            font-weight: 700;
            line-height: 18px;
            color: rgba(255, 255, 255, 0.64);
        }

        .status-pill {
            height: 20px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 0 8px;
            border-radius: 999px;
            background: rgba(255, 105, 105, 0.14);
            color: rgba(255, 123, 123, 1);
            font-size: 12px;
            font-weight: 800;
            line-height: 20px;

            &.canBuy {
                background: rgba(85, 255, 165, 0.14);
                color: rgba(150, 255, 192, 1);
            }

            i {
                font-size: 13px;
                line-height: 1;
            }
        }
    }
    .title-card {
        width: min(620px, 100%);
        min-height: 70px;
        padding: 8px 16px 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-top: 1px solid rgba(111, 180, 255, 0.08);
        border-bottom: 1px solid rgba(111, 180, 255, 0.08);
        background:
            radial-gradient(ellipse at center, rgba(97, 173, 255, 0.18), rgba(97, 173, 255, 0) 68%),
            linear-gradient(
                90deg,
                rgba(64, 128, 255, 0) 0%,
                rgba(64, 128, 255, 0.22) 31%,
                rgba(64, 128, 255, 0.22) 69%,
                rgba(64, 128, 255, 0) 100%
            );
        .title {
            max-width: 100%;
            font-size: 22px;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 30px;
            word-break: break-word;
            overflow-wrap: anywhere;
            text-shadow: 0 6px 24px rgba(0, 0, 0, 0.32);
        }
        .apply {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 6px;
            min-height: 22px;
            padding: 0 10px;
            border: 1px solid rgba(97, 173, 255, 0.24);
            border-radius: 999px;
            background: rgba(5, 20, 45, 0.22);
            font-size: 12px;
            color: rgba(161, 207, 255, 0.86);
            text-align: center;
            line-height: 22px;
            white-space: normal;

            span {
                color: rgba(255, 255, 255, 0.52);
            }

            strong {
                color: rgba(97, 173, 255, 1);
                font-weight: 800;
            }
        }
    }
    .card {
        width: min(500px, 100%);
        height: auto;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        .m-good-preview {
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
        .u-good-image {
            width: min(400px, 100%);
            height: min(400px, 52vh);
            min-height: 320px;
            object-fit: cover;
        }
        .goods-image-carousel {
            width: 400px;
            max-width: 100%;
            height: 400px;
            flex: 0 0 auto;
            border-radius: 10px;
            overflow: hidden;

            :deep(.el-carousel__container) {
                height: 100%;
            }

            :deep(.el-carousel__item) {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .goods-carousel-image {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
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
            background: transparent;
            padding: 0;
            border-radius: 10px;
            overflow: hidden;
        }
    }
    .buy-detail {
        width: min(500px, 100%);
        min-height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 34px;
        padding-top: 2px;
        .detail-card {
            width: 100%;
            min-height: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .condition {
                width: min(420px, 100%);
                display: flex;
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
                height: auto;
                min-height: 22px;
                .condition-item {
                    height: 22px;
                    opacity: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    border-radius: 999px;
                    background: rgba(255, 105, 105, 0.3);
                    color: rgba(255, 105, 105, 1);
                    padding: 0 8px;
                    border: 1px solid rgba(255, 105, 105, 0.16);
                    font-size: 12px;
                    font-weight: 800;
                    line-height: 22px;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);

                    &.canBuy {
                        background: rgba(85, 255, 165, 0.14);
                        border-color: rgba(150, 255, 192, 0.16);
                        color: rgba(150, 255, 192, 1);
                    }

                    span {
                        color: currentColor;
                        opacity: 0.72;
                        font-weight: 700;
                    }

                    b {
                        color: currentColor;
                        font-weight: 900;
                    }

                    i {
                        font-size: 13px;
                    }
                }
            }
            .buy-time {
                margin-top: 8px;
                min-height: 20px;
                width: min(500px, 100%);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                text-align: center;
                font-size: 12px;
                font-weight: 400;
                line-height: 20px;
                color: rgba(255, 105, 105, 1);
                &.canBuy {
                    color: rgba(255, 255, 255, 0.72);
                }

                span {
                    color: rgba(255, 255, 255, 0.46);
                    font-weight: 700;
                }

                b {
                    color: currentColor;
                    font-weight: 700;
                }

                em {
                    color: rgba(255, 105, 105, 1);
                    font-style: normal;
                    font-weight: 800;
                }
            }
            .buttons {
                width: 100%;
                min-height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 12px;
                .button {
                    cursor: pointer;
                    min-width: 112px;
                    height: 40px;
                    border-radius: 14px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 40px;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                    border: none;
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
                    &:disabled {
                        cursor: not-allowed;
                    }
                    img {
                        margin-right: 0;
                    }

                    b {
                        font-weight: 900;
                    }

                    &.buy {
                        width: auto;
                        min-width: 96px;
                        padding: 0 12px;
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
                        min-width: 96px;
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
                        min-width: 104px;
                        background: rgba(255, 133, 184, 1);
                    }
                }
            }
        }

        .good-comment {
            width: 100%;
            box-sizing: border-box;
            margin: 0 0 48px;
            padding: 18px 43px;
            overflow: visible;
            scrollbar-width: none;
            color: rgba(#fff, 0.75);
            font-size: 12px;
            font-weight: 400;
            line-height: 1.8;
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.1) 29.64%,
                rgba(255, 255, 255, 0.1) 76.39%,
                rgba(255, 255, 255, 0) 100%
            );

            :deep(img) {
                max-width: min(320px, 100%);
                height: auto;
            }

            :deep(a) {
                color: rgba(97, 173, 255, 1);
                text-decoration: none;

                &:hover {
                    color: rgba(150, 255, 192, 1);
                }
            }
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
