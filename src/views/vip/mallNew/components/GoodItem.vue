<template>
    <div class="good-item" @click="changeSelectItem(good)">
        <div class="good-item-image">
            <img
                v-if="displayImage"
                :src="displayImage"
                :alt="good.title || '商品图片'"
                class="good-item-img"
                loading="lazy"
                decoding="async"
                @error="handleImageError"
            />
            <div v-else class="good-item-img u-good-image-null">{{ imageFailed ? "图片加载失败" : "暂无图片" }}</div>
            <span v-if="skinDisplayName" class="skin-name" :class="`skin-name--${skinCategory}`">{{ skinDisplayName }}</span>
        </div>
        <div class="right">
            <div class="header">
                <div class="title" :title="good.title">{{ good.title }}</div>
                <div v-if="good.subtitle" class="sub-title-wrap">
                    <div class="sub-title" :title="good.subtitle">{{ good.subtitle }}</div>
                </div>
                <div class="tags">
                    <div class="tag level-tag">Lv.{{ getLevel(good.exp_limit) }}</div>
                    <div class="tag vip-tag" v-if="good.vip_limit === 1">会员专享</div>
                </div>
            </div>
            <div class="footer">
                <button
                    class="button canBuy"
                    :class="{ owned: isOwnedSingleGood }"
                    :disabled="isOwnedSingleGood"
                    @click.stop="buyGoods(good)"
                >
                    <span v-if="isOwnedSingleGood" class="u-owned-tag">
                        <Check class="owned-icon" />
                        已拥有
                    </span>
                    <div class="button-text canBuy">
                        <template v-if="good.price_boxcoin">
                            <img :src="imgUrl + 'box_coin.svg'" alt="" />{{ good.price_boxcoin }}盒币
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img :src="imgUrl + 'point.svg'" alt="" />{{ good.price_points }}积分
                        </template>
                        <template v-if="!good.price_boxcoin && !good.price_points">免费兑换</template>
                    </div>
                </button>
                <button
                    class="icon"
                    type="button"
                    :class="{ 'is-added': addFeedbackVisible, disabled: isOwnedSingleGood }"
                    :disabled="isOwnedSingleGood"
                    @click.stop="addCart"
                >
                    <img :src="imgUrl + 'cart.svg'" alt="" />
                    <span v-if="cartAmount" class="cart-count">{{ cartAmountText }}</span>
                    <span v-if="addFeedbackVisible" :key="addFeedbackKey" class="cart-plus">+1</span>
                </button>
            </div>
        </div>
        <BuyConfirm :item="good" ref="buyConfirm" @exchanged="$emit('exchanged', $event)" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { throttle } from "lodash";
import { Check } from "@element-plus/icons-vue";
import BuyConfirm from "./BuyConfirm.vue";
import { __cdn } from "@/utils/config";
import { alertMallRequirement } from "@/utils/mallExchangeError";
import {
    getMallGoodsCartAmount,
    isOwnedSingleMallGoods,
    MALL_DECORATION_OWNED_MESSAGE,
    MALL_DECORATION_SINGLE_LIMIT_MESSAGE,
    shouldBlockSingleDecorationAdd,
} from "@/utils/mallCartLimit";
import { getMallSkinDisplayName, resolveMallSkinCategory } from "@/utils/mallDecoration";
export default {
    name: "GoodItem",
    emits: ["exchanged"],
    inject: ["changeSelectItem"],
    components: {
        BuyConfirm,
        Check,
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            imageFailed: false,
            addFeedbackVisible: false,
            addFeedbackKey: 0,
            addFeedbackTimer: null,
        };
    },
    props: {
        good: {
            type: Object,
            required: true,
        },
    },
    computed: {
        previewImage() {
            return this.good.goods_images?.[0] || "";
        },
        displayImage() {
            if (!this.previewImage || this.imageFailed) return "";
            return this.toThumbUrl(this.previewImage);
        },
        isLoggedIn() {
            return User.isLogin();
        },
        cartAmount() {
            return getMallGoodsCartAmount(this.$store.state.mallNew.cart, this.good);
        },
        cartAmountText() {
            return this.cartAmount > 99 ? "99+" : String(this.cartAmount);
        },
        isOwnedSingleGood() {
            return this.isLoggedIn && isOwnedSingleMallGoods(this.good);
        },
        skinCategory() {
            if (this.good.category !== "virtual" || this.good.sub_category !== "skin") return "";
            return resolveMallSkinCategory(this.good);
        },
        skinDisplayName() {
            if (!this.skinCategory) return "";
            return getMallSkinDisplayName(this.good);
        },
    },
    watch: {
        "good.id"() {
            this.imageFailed = false;
        },
    },
    methods: {
        toThumbUrl(url) {
            if (!url || /^data:|^blob:/i.test(url) || /x-oss-process=/.test(url)) return url;
            const joiner = url.includes("?") ? "&" : "?";
            return `${url}${joiner}x-oss-process=image/resize,m_fill,w_240,h_240/quality,q_85`;
        },
        handleImageError() {
            this.imageFailed = true;
        },
        getLevel(exp_limit) {
            return User.getLevel(exp_limit);
        },
        buyGoods: throttle(function () {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.good.canBuy?.canBuy) {
                return alertMallRequirement(this, this.good, this.good.canBuy);
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
            if (!this.good.canBuy?.canBuy) {
                return alertMallRequirement(this, this.good, this.good.canBuy);
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
            const num = this.cartAmount;
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
.good-item {
    width: 100%;
    height: 120px;
    border-radius: 12px;
    background: rgba(36, 41, 46, 1);
    &:hover {
        background: linear-gradient(
            149.47deg,
            rgba(36, 41, 46, 1) 0%,
            rgba(82, 82, 82, 1) 66.39%,
            rgba(36, 41, 46, 1) 100%
        );
    }
    display: flex;
    overflow: hidden;
    cursor: pointer;
    .good-item-image {
        position: relative;
        flex: none;
        width: 120px;
        height: 120px;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 46px;
            background: linear-gradient(180deg, rgba(7, 10, 14, 0) 0%, rgba(7, 10, 14, 0.5) 100%);
            pointer-events: none;
        }
        .good-item-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .u-good-image-null {
            display: flex;
            align-items: center;
            justify-content: center;
            background:
                linear-gradient(135deg, rgba(64, 128, 255, 0.16), rgba(255, 163, 43, 0.12)),
                rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.62);
            font-size: 0.6rem;
            font-weight: 500;
        }
        .skin-name {
            position: absolute;
            z-index: 1;
            left: 7px;
            bottom: 7px;
            max-width: calc(100% - 14px);
            height: 23px;
            padding: 0 11px 0 12px;
            border: 1px solid rgba(255, 245, 220, 0.5);
            border-radius: 13px 16px 16px 8px / 12px 16px 13px 10px;
            background:
                radial-gradient(ellipse at 34% 120%, rgba(255, 247, 231, 0.23) 0 42%, transparent 43%),
                radial-gradient(ellipse at 78% 116%, rgba(255, 227, 253, 0.18) 0 28%, transparent 29%),
                linear-gradient(120deg, rgba(255, 237, 190, 0.5) 0%, rgba(244, 191, 255, 0.36) 46%, rgba(151, 207, 255, 0.34) 100%),
                rgba(38, 31, 58, 0.52);
            background-size:
                auto,
                auto,
                180% 180%,
                auto;
            color: rgba(255, 252, 244, 0.98);
            font-size: 10px;
            font-weight: 700;
            line-height: 21px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
            box-shadow:
                0 6px 18px rgba(77, 54, 119, 0.28),
                0 0 14px rgba(255, 230, 166, 0.22),
                inset 0 1px 0 rgba(255, 255, 255, 0.45),
                inset 0 -1px 0 rgba(255, 215, 247, 0.28);
            text-shadow:
                0 1px 3px rgba(72, 46, 91, 0.42),
                0 0 7px rgba(255, 255, 255, 0.28);
            backdrop-filter: blur(9px) saturate(1.2);
            animation: skinRibbonGlow 4.8s ease-in-out infinite;

            &::before {
                content: "✦";
                position: absolute;
                left: 8px;
                top: 2px;
                width: 8px;
                height: 8px;
                color: rgba(214, 239, 255, 0.68);
                font-size: 6px;
                line-height: 8px;
                text-shadow: 0 0 7px rgba(214, 239, 255, 0.72);
                pointer-events: none;
                animation: skinSparkleSoft 3.9s ease-in-out infinite 0.7s;
            }

            &::after {
                content: "✦";
                position: absolute;
                right: 3px;
                top: 10px;
                width: 8px;
                height: 8px;
                color: rgba(255, 255, 255, 0.95);
                font-size: 7px;
                line-height: 8px;
                text-shadow:
                    0 0 8px rgba(255, 239, 186, 0.9),
                    0 0 7px rgba(255, 217, 250, 0.72);
                pointer-events: none;
                animation: skinSparkle 2.6s ease-in-out infinite;
            }

            &.skin-name--homebg {
                background:
                    radial-gradient(ellipse at 34% 120%, rgba(255, 190, 218, 0.34) 0 42%, transparent 43%),
                    radial-gradient(ellipse at 78% 116%, rgba(255, 162, 205, 0.24) 0 28%, transparent 29%),
                    linear-gradient(120deg, rgba(255, 205, 224, 0.66) 0%, rgba(255, 156, 199, 0.52) 48%, rgba(255, 217, 232, 0.44) 100%),
                    rgba(74, 32, 51, 0.5);
            }

            &.skin-name--atcard {
                background:
                    radial-gradient(ellipse at 34% 120%, rgba(224, 247, 255, 0.27) 0 42%, transparent 43%),
                    radial-gradient(ellipse at 78% 116%, rgba(196, 226, 255, 0.2) 0 28%, transparent 29%),
                    linear-gradient(120deg, rgba(222, 250, 255, 0.5) 0%, rgba(174, 218, 255, 0.38) 48%, rgba(231, 219, 255, 0.34) 100%),
                    rgba(24, 43, 65, 0.52);
            }

            &.skin-name--calendar {
                background:
                    radial-gradient(ellipse at 34% 120%, rgba(255, 252, 210, 0.34) 0 42%, transparent 43%),
                    radial-gradient(ellipse at 78% 116%, rgba(255, 230, 128, 0.26) 0 28%, transparent 29%),
                    linear-gradient(120deg, rgba(255, 248, 174, 0.64) 0%, rgba(255, 218, 92, 0.46) 48%, rgba(255, 239, 184, 0.38) 100%),
                    rgba(66, 48, 18, 0.52);
                box-shadow:
                    0 6px 18px rgba(120, 86, 26, 0.3),
                    0 0 16px rgba(255, 228, 96, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.52),
                    inset 0 -1px 0 rgba(255, 218, 84, 0.34);
            }

            &.skin-name--comment {
                background:
                    radial-gradient(ellipse at 34% 120%, rgba(220, 255, 242, 0.27) 0 42%, transparent 43%),
                    radial-gradient(ellipse at 78% 116%, rgba(184, 246, 224, 0.18) 0 28%, transparent 29%),
                    linear-gradient(120deg, rgba(213, 255, 239, 0.5) 0%, rgba(151, 226, 207, 0.36) 48%, rgba(219, 244, 255, 0.32) 100%),
                    rgba(22, 50, 45, 0.52);
            }

            &.skin-name--sidebar {
                background:
                    radial-gradient(ellipse at 34% 120%, rgba(233, 224, 255, 0.28) 0 42%, transparent 43%),
                    radial-gradient(ellipse at 78% 116%, rgba(206, 190, 255, 0.2) 0 28%, transparent 29%),
                    linear-gradient(120deg, rgba(226, 217, 255, 0.52) 0%, rgba(185, 166, 255, 0.38) 48%, rgba(232, 219, 255, 0.34) 100%),
                    rgba(40, 32, 70, 0.52);
            }
        }
    }
    .right {
        flex: 1;
        width: auto;
        min-width: 0;
        height: 120px;
        padding: 10px 12px 10px 12px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header {
            display: flex;
            flex-direction: column;
            min-width: 0;
            .title {
                width: 100%;
                font-size: 0.72rem;
                font-weight: 800;
                color: rgba(255, 255, 255, 1);
                line-height: 1.1rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
            }
            .sub-title-wrap {
                width: 100%;
                display: flex;
                min-width: 0;
                margin-top: 0.16rem;
            }
            .sub-title {
                max-width: 100%;
                color: rgba(255, 255, 255, 0.58);
                font-size: 0.6rem;
                font-weight: 500;
                line-height: 0.9rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .tags {
                display: flex;
                gap: 5px;
                min-width: 0;
                flex-wrap: wrap;
                margin-top: 0.22rem;

                .tag {
                    height: 19px;
                    border-radius: 99px;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    font-size: 0.6rem;
                    font-weight: 500;
                    line-height: 17px;
                    color: rgba(255, 255, 255, 0.62);
                    text-align: center;
                    padding: 0 7px;
                    box-sizing: border-box;
                    white-space: nowrap;
                }

                .level-tag {
                    color: rgba(255, 255, 255, 0.6);
                    border-color: rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.04);
                }

                .vip-tag {
                    color: rgba(255, 220, 140, 0.86);
                    border-color: rgba(255, 195, 0, 0.28);
                    background: rgba(255, 195, 0, 0.05);
                }
            }
        }
        .footer {
            display: flex;
            justify-content: space-between;
            gap: 4px;
            width: 100%;
            .button {
                border: none;
                flex: 1;
                min-width: 0;
                height: 28px;
                border-radius: 8px;
                background: rgba(255, 105, 105, 0.15);
                cursor: pointer;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                transition:
                    background 0.18s ease,
                    box-shadow 0.18s ease,
                    transform 0.18s ease;
                &:disabled {
                    cursor: not-allowed;
                }
                .button-text {
                    position: relative;
                    z-index: 1;
                    font-size: 12px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: rgba(255, 105, 105, 1);
                    height: 100%;
                    text-align: center;
                    line-height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.canBuy {
                        color: rgba(255, 255, 255, 1);
                        font-weight: 700;
                    }
                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 4px;
                        flex: none;
                    }
                }

                &.canBuy {
                    background: linear-gradient(180deg, rgba(78, 137, 255, 1) 0%, rgba(57, 123, 255, 1) 100%);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.16),
                        inset 0 -8px 14px rgba(74, 202, 255, 0.08);

                    &::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        background:
                            linear-gradient(
                                105deg,
                                transparent 0%,
                                transparent 33%,
                                rgba(255, 255, 255, 0.18) 48%,
                                transparent 64%,
                                transparent 100%
                            ),
                            radial-gradient(120% 80% at 50% 100%, rgba(139, 229, 255, 0.36), transparent 62%);
                        opacity: 0;
                        transform: translateX(-24%);
                        transition:
                            opacity 0.2s ease,
                            transform 0.28s ease;
                        pointer-events: none;
                    }

                    &:hover {
                        background: linear-gradient(180deg, rgba(86, 145, 255, 1) 0%, rgba(60, 130, 255, 1) 100%);
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.22),
                            inset 0 -10px 16px rgba(111, 218, 255, 0.18),
                            0 4px 12px rgba(64, 128, 255, 0.2);

                        &::before {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    &:active {
                        transform: translateY(1px);
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.12),
                            inset 0 5px 12px rgba(24, 76, 180, 0.24);
                    }

                    &.owned {
                        overflow: visible;
                        cursor: not-allowed;
                        background: linear-gradient(180deg, rgba(75, 91, 119, 1) 0%, rgba(55, 70, 96, 1) 100%);
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                            inset 0 -8px 14px rgba(20, 30, 48, 0.16);

                        &:hover,
                        &:active {
                            transform: none;
                            background: linear-gradient(180deg, rgba(75, 91, 119, 1) 0%, rgba(55, 70, 96, 1) 100%);
                            box-shadow:
                                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                inset 0 -8px 14px rgba(20, 30, 48, 0.16);
                        }

                        &::before {
                            display: none;
                        }

                        .button-text {
                            color: rgba(255, 255, 255, 0.72);
                        }
                    }
                }

                .u-owned-tag {
                    position: absolute;
                    z-index: 3;
                    top: -8px;
                    right: -4px;
                    height: 18px;
                    padding: 0 7px 0 6px;
                    border-radius: 999px;
                    background:
                        linear-gradient(180deg, rgba(37, 42, 50, 0.94), rgba(24, 29, 36, 0.92)),
                        rgba(24, 29, 36, 0.88);
                    border: 1px solid rgba(255, 216, 128, 0.36);
                    color: rgba(255, 226, 157, 0.92);
                    box-shadow:
                        0 3px 10px rgba(0, 0, 0, 0.24),
                        inset 0 1px 0 rgba(255, 255, 255, 0.08);
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    font-size: 0.54rem;
                    font-weight: 700;
                    line-height: 18px;
                    white-space: nowrap;
                    pointer-events: none;
                    backdrop-filter: blur(4px);

                    .owned-icon {
                        width: 10px;
                        height: 10px;
                        flex: none;
                    }
                }

            }
            .icon {
                border: 0;
                width: 28px;
                height: 28px;
                border-radius: 8px;
                background: linear-gradient(180deg, rgba(255, 177, 66, 1) 0%, rgba(255, 150, 35, 1) 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                flex: none;
                cursor: pointer;
                position: relative;
                overflow: visible;
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.22),
                    inset 0 -6px 10px rgba(196, 92, 8, 0.1);
                transition:
                    background 0.18s ease,
                    box-shadow 0.18s ease,
                    transform 0.18s ease;

                &::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background:
                        linear-gradient(120deg, transparent 0%, transparent 34%, rgba(255, 255, 255, 0.28) 50%, transparent 66%),
                        radial-gradient(120% 80% at 50% 100%, rgba(255, 226, 128, 0.24), transparent 64%);
                    opacity: 0;
                    transform: translateX(-28%);
                    transition:
                        opacity 0.18s ease,
                        transform 0.26s ease;
                    pointer-events: none;
                }

                &:hover {
                    background: linear-gradient(180deg, rgba(255, 187, 78, 1) 0%, rgba(255, 156, 38, 1) 100%);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.28),
                        inset 0 -7px 12px rgba(255, 222, 112, 0.18),
                        0 4px 12px rgba(255, 145, 31, 0.22);

                    &::before {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                &:active {
                    transform: translateY(1px);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.12),
                        inset 0 5px 10px rgba(171, 80, 6, 0.26);
                }

                &.disabled {
                    cursor: not-allowed;
                    background: linear-gradient(180deg, rgba(130, 136, 146, 1) 0%, rgba(96, 105, 118, 1) 100%);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        inset 0 -6px 10px rgba(20, 30, 48, 0.1);

                    &:hover,
                    &:active {
                        transform: none;
                        background: linear-gradient(180deg, rgba(130, 136, 146, 1) 0%, rgba(96, 105, 118, 1) 100%);
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                            inset 0 -6px 10px rgba(20, 30, 48, 0.1);
                    }

                    &::before {
                        display: none;
                    }

                    img {
                        opacity: 0.68;
                    }
                }

                &.is-added {
                    animation: cart-pop 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                img {
                    position: relative;
                    z-index: 1;
                    width: 20px;
                    height: 20px;
                }

                .cart-count {
                    position: absolute;
                    z-index: 2;
                    top: -6px;
                    right: -6px;
                    min-width: 16px;
                    height: 16px;
                    padding: 0 4px;
                    box-sizing: border-box;
                    border-radius: 999px;
                    background: linear-gradient(180deg, rgba(255, 92, 92, 1), rgba(233, 55, 74, 1));
                    border: 1px solid rgba(36, 41, 46, 0.72);
                    color: #fff;
                    font-size: 10px;
                    font-weight: 800;
                    line-height: 14px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(233, 55, 74, 0.32);
                    pointer-events: none;
                }

                .cart-plus {
                    position: absolute;
                    z-index: 3;
                    top: -20px;
                    right: -4px;
                    color: rgba(255, 220, 126, 1);
                    font-size: 13px;
                    font-weight: 900;
                    line-height: 1;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
                    pointer-events: none;
                    animation: cart-plus-rise 0.62s cubic-bezier(0.18, 0.82, 0.2, 1) both;
                }
            }
        }
    }
}

@keyframes cart-pop {
    0% {
        transform: scale(1);
    }

    45% {
        transform: scale(1.12);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes cart-plus-rise {
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

@media screen and (max-width: 750px) {
    .good-item {
        width: 100%;
        height: 7.25rem;
        border-radius: 0.75rem;

        .good-item-image {
            width: 7.25rem;
            height: 7.25rem;
        }

        .right {
            width: auto;
            min-width: 0;
            flex: 1;
            height: 7.25rem;
            padding: 0.5rem;

            .header {
                min-width: 0;
                gap: 0.25rem;

                .title {
                    width: 100%;
                    font-size: 0.82rem;
                    line-height: 1.1rem;
                }

                .sub-title {
                    max-width: 100%;
                    font-size: 0.68rem;
                    line-height: 1rem;
                }

                .tags {
                    gap: 0.25rem;

                    .tag {
                        height: 1.125rem;
                        font-size: 0.68rem;
                        line-height: 1rem;
                        padding: 0 0.4375rem;
                    }
                }
            }

            .footer {
                gap: 0.25rem;

                .button {
                    min-width: 0;
                    height: 1.75rem;
                    border-radius: 0.5rem;

                    &.owned {
                        background: linear-gradient(180deg, rgba(75, 91, 119, 1) 0%, rgba(55, 70, 96, 1) 100%);
                    }

                    .u-owned-tag {
                        top: -0.42rem;
                        right: -0.22rem;
                        height: 1rem;
                        padding: 0 0.38rem 0 0.32rem;
                        gap: 0.16rem;
                        font-size: 0.56rem;
                        line-height: 1rem;

                        .owned-icon {
                            width: 0.58rem;
                            height: 0.58rem;
                        }
                    }

                    .button-text {
                        min-width: 0;
                        height: 1.75rem;
                        line-height: 1.75rem;
                        padding: 0 0.375rem;
                        box-sizing: border-box;
                        font-size: 0.75rem;

                        img {
                            width: 0.875rem;
                            height: 0.875rem;
                            margin-right: 0.25rem;
                        }
                    }
                }

                .icon {
                    width: 1.75rem;
                    height: 1.75rem;
                    border-radius: 0.5rem;

                    &.disabled {
                        background: linear-gradient(180deg, rgba(130, 136, 146, 1) 0%, rgba(96, 105, 118, 1) 100%);
                    }

                    img {
                        width: 1rem;
                        height: 1rem;
                    }

                    .cart-count {
                        top: -0.375rem;
                        right: -0.375rem;
                        min-width: 1rem;
                        height: 1rem;
                        padding: 0 0.25rem;
                        font-size: 0.625rem;
                        line-height: 0.875rem;
                    }

                    .cart-plus {
                        top: -1.25rem;
                        right: -0.25rem;
                        font-size: 0.8rem;
                    }
                }
            }
        }
    }
}

@keyframes skinRibbonGlow {
    0%,
    100% {
        background-position:
            0 0,
            0 0,
            0% 50%,
            0 0;
        box-shadow:
            0 6px 18px rgba(77, 54, 119, 0.24),
            0 0 10px rgba(255, 230, 166, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(255, 215, 247, 0.24);
    }
    50% {
        background-position:
            0 0,
            0 0,
            100% 50%,
            0 0;
        box-shadow:
            0 7px 20px rgba(106, 72, 148, 0.3),
            0 0 16px rgba(255, 230, 166, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.48),
            inset 0 -1px 0 rgba(255, 215, 247, 0.32);
    }
}

@keyframes skinSparkle {
    0%,
    100% {
        opacity: 0.52;
        transform: scale(0.86) rotate(0deg);
    }
    45% {
        opacity: 1;
        transform: scale(1.08) rotate(12deg);
    }
}

@keyframes skinSparkleSoft {
    0%,
    100% {
        opacity: 0.28;
        transform: scale(0.78) rotate(-8deg);
    }
    58% {
        opacity: 0.86;
        transform: scale(1) rotate(8deg);
    }
}
</style>
