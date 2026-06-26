<template>
    <div class="cart-mask" v-if="show" @click="closeCart"></div>
    <div class="cart" :class="{ show: show }" @click.stop>
        <div class="cart-title">
            <div>
                <div class="cart-title-text">购物车清单</div>
                <div class="cart-title-sub">已选 {{ $store.getters["mallNew/checked_num"] }} / {{ $store.getters["mallNew/num"] }} 件</div>
            </div>
            <button class="cart-close" type="button" @click="$store.dispatch('mallNew/changeCartIsShow', false)">
                <i class="el-icon-close"></i>
            </button>
        </div>
        <div class="cart-header">
            <div class="u-check-all-box">
                <div class="u-check-all" :class="{ checked: isAll }" @click="allChange">
                    <i class="el-icon-check"></i>
                </div>
                <div class="box-text">
                    全选&nbsp;({{ $store.getters["mallNew/checked_num"] }}/{{ $store.getters["mallNew/num"] }})
                </div>
            </div>
            <el-button type="info" plain @click="handleClear">清空</el-button>
        </div>
        <div class="m-cart-items">
            <div class="cart-empty" v-if="!list.length">
                <img :src="`${imgUrl}cart.svg`" alt="" />
                <div class="cart-empty-title">购物车还是空的</div>
                <div class="cart-empty-desc">把想要的商品加入购物车后，可以在这里统一结算</div>
            </div>
            <template v-else>
                <div class="m-cart-item" v-for="item in list" :key="item.id" :class="{ cannotBuy: item.can_buy === 0 }">
                    <div class="top">
                        <div
                            class="c-check"
                            :class="{ checked: item.checked, cannotCheck: item.can_buy === 0 }"
                            @click="itemChecked(item)"
                        >
                            <i class="el-icon-check"></i>
                        </div>
                        <img class="c-img" :src="item.goods.goods_images[0]" alt="" />
                        <div class="c-info">
                            <div class="c-name">{{ item.goods.title }}</div>
                            <div class="c-goods-info">
                                <div class="c-stepper" v-if="canAddMultipleGoods(item.goods)">
                                    <button
                                        type="button"
                                        :disabled="item.amount <= 1"
                                        @click="changeAmount(item, -1)"
                                    >
                                        −
                                    </button>
                                    <span>{{ item.amount }}</span>
                                    <button
                                        type="button"
                                        :disabled="item.amount >= item.goods.stock"
                                        @click="changeAmount(item, 1)"
                                    >
                                        +
                                    </button>
                                </div>
                                <span class="u-price" v-if="item.goods.price_points" >
                                    <img src="@/assets/img/vip/vip2/points.svg" alt="" class="icon" svg-inline />
                                    {{ item.goods.price_points }}
                                </span>
                                <span class="u-price" v-if="item.goods.price_boxcoin" >
                                    <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" class="icon" svg-inline />
                                    {{ item.goods.price_boxcoin }}
                                </span>
                            </div>
                        </div>
                        <div class="delete" @click="$store.dispatch('mallNew/deleteCartGoods', item.id)">
                            <i class="el-icon-close"></i>
                        </div>
                    </div>
                    <div class="bottom" v-if="item.can_buy === 0">{{ item.cannot_buy_reason }}</div>
                </div>
            </template>
        </div>
        <div class="user-info">
            <div class="receipt-meta">
                {{ name }}&emsp;{{ time }}
            </div>
            <img :src="`${imgUrl}bar-code.svg`" alt="" class="icon" svg-inline />
        </div>
        <div class="total-price">
            <div class="total-label">合计：</div>
            <div class="total">
                <div class="total-item">
                    <div class="right">
                        <img
                            src="@/assets/img/vip/vip2/box_icon.svg"
                            alt=""
                            svg-inline
                            style="fill: rgba(56, 56, 56, 1)"
                        />
                        <div>盒币<span>（=通宝）</span></div>
                    </div>
                    <div class="left">{{ $store.getters["mallNew/all_price_boxcoin"] }}</div>
                </div>
                <div class="total-item">
                    <div class="right">
                        <img
                            src="@/assets/img/vip/vip2/points.svg"
                            alt=""
                            svg-inline
                            style="fill: rgba(56, 56, 56, 1)"
                        />
                        <div>银铛<span>（=积分）</span></div>
                    </div>
                    <div class="left">{{ $store.getters["mallNew/all_price_points"] }}</div>
                </div>
            </div>
            <div class="total-btn" :class="{ disabled: !$store.getters['mallNew/checked_num'] }" @click="checkout">结算</div>
        </div>
    </div>
</template>
<script>
import { __cdn } from "@/utils/config";
import { debounce } from "lodash";
import moment from "moment";
import { canAddMultipleMallGoods } from "@/utils/mallCartLimit";
export default {
    name: "Cart",
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            list: [],
            name: localStorage.getItem("name"),
            time: moment().format("YYYY/MM/DD HH:mm"),
        };
    },
    watch: {
        cart: {
            handler(val) {
                this.list = val.map((item) => {
                    return {
                        ...item,
                        checked: Object.hasOwn(item, "checked") ? !!item.can_buy && item.checked : !!item.can_buy,
                    };
                });
            },
            deep: true,
            immediate: true,
        },
        show: {
            handler(val) {
                if (val) {
                    this.time = moment().format("YYYY/MM/DD HH:mm");
                }
            },
        },
    },
    computed: {
        show() {
            return this.$store.state.mallNew.cartIsShow;
        },
        cart() {
            return this.$store.state.mallNew.cart;
        },
        isAll() {
            return this.list.length > 0 && this.list.every((item) => item.checked);
        },
    },
    mounted() {
        this.$store.commit("mallNew/toState", { cart: this.list });
    },
    methods: {
        allChange() {
            const boolen = this.isAll;
            this.list.forEach((item) => {
                item.checked = item.can_buy && !boolen;
            });
            this.$store.commit("mallNew/toState", { cart: this.list });
        },
        handleClear() {
            this.$store.dispatch("mallNew/clearCart");
        },
        closeCart() {
            this.$store.dispatch("mallNew/changeCartIsShow", false);
        },
        checkout() {
            if (!this.$store.getters["mallNew/checked_num"]) {
                return this.$message.warning("请先选择要结算的商品");
            }
            this.$store.dispatch("mallNew/changeCartConfirmIsShow", true);
        },
        itemChecked(item) {
            if (item.can_buy === 0) return;
            this.list.forEach((i) => {
                if (i.id === item.id) {
                    i.checked = !i.checked;
                }
            });
            this.$store.commit("mallNew/toState", { cart: this.list });
        },
        itemChange: debounce(function (item, val) {
            this.$store.dispatch("mallNew/updateGoodsNum", {
                shopping_item_id: item.id,
                amount: val,
            });
        }, 500),
        changeAmount(item, delta) {
            const stock = Number(item.goods?.stock) || 1;
            const next = Math.min(stock, Math.max(1, Number(item.amount) + delta));
            if (next === item.amount) return;
            item.amount = next;
            this.itemChange(item, next);
        },
        canAddMultipleGoods(good) {
            return canAddMultipleMallGoods(good);
        },
    },
};
</script>

<style lang="less" scoped>
.cart-mask {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(2px);
}
.cart {
    width: 390px;
    height: calc(100vh - 96px);
    background: #f7f8fb;
    position: fixed;
    right: -390px;
    top: 96px;
    z-index: 1000;
    transition:
        transform 0.28s ease,
        box-shadow 0.28s ease;
    box-sizing: border-box;
    padding: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: -16px 0 42px rgba(0, 0, 0, 0.22);
    &.show {
        transform: translateX(-100%);
    }
    .cart-title {
        flex: none;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(36, 41, 46, 0.1);

        .cart-title-text {
            font-size: 20px;
            font-weight: 800;
            line-height: 28px;
            color: rgba(36, 41, 46, 1);
        }

        .cart-title-sub {
            margin-top: 2px;
            font-size: 12px;
            line-height: 18px;
            color: rgba(93, 99, 110, 0.78);
        }

        .cart-close {
            width: 32px;
            height: 32px;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: rgba(36, 41, 46, 0.72);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition:
                background 0.16s ease,
                color 0.16s ease;

            &:hover {
                background: rgba(36, 41, 46, 0.08);
                color: rgba(36, 41, 46, 1);
            }
        }
    }
    .cart-header {
        flex: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-height: 38px;
        margin: 12px 0;
        .u-check-all-box {
            display: flex;
            align-items: center;
            gap: 8px;
            .u-check-all {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: none;
                color: #fff;
                font-size: 12px;
                line-height: 18px;
                background: rgba(36, 41, 46, 0.18);
                text-align: center;
                cursor: pointer;
                transition: background 0.16s ease;
                &.checked {
                    background: rgba(255, 141, 26, 1);
                }
            }
            .box-text {
                font-size: 15px;
                font-weight: 700;
                line-height: 22px;
                color: rgba(36, 41, 46, 1);
            }
        }
        :deep(.el-button) {
            height: 32px;
            padding: 0 14px;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 700;
        }
    }
    .m-cart-items {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: auto;
        scrollbar-width: none;
        padding: 2px 2px 12px;

        &::-webkit-scrollbar {
            display: none;
        }

        .cart-empty {
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px 24px;
            box-sizing: border-box;
            color: rgba(36, 41, 46, 0.62);

            img {
                width: 52px;
                height: 52px;
                padding: 14px;
                border-radius: 18px;
                background: rgba(255, 163, 43, 0.12);
                filter: grayscale(0.1);
                opacity: 0.88;
            }

            .cart-empty-title {
                margin-top: 14px;
                font-size: 15px;
                font-weight: 800;
                line-height: 22px;
                color: rgba(36, 41, 46, 0.82);
            }

            .cart-empty-desc {
                width: min(230px, 100%);
                margin-top: 4px;
                font-size: 12px;
                line-height: 18px;
                color: rgba(93, 99, 110, 0.68);
            }
        }

        .m-cart-item {
            width: 100%;
            box-sizing: border-box;
            background: #fff;
            padding: 12px;
            border: 1px solid rgba(36, 41, 46, 0.08);
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(9, 17, 30, 0.06);
            &.cannotBuy {
                border-color: rgba(255, 141, 26, 0.34);
                background: linear-gradient(180deg, #fff 0%, rgba(255, 141, 26, 0.05) 100%);
            }
            .top {
                display: flex;
                gap: 10px;
                align-items: flex-start;
                .c-check {
                    flex: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    border: none;
                    color: #fff;
                    font-size: 12px;
                    line-height: 18px;
                    background: rgba(36, 41, 46, 0.18);
                    text-align: center;
                    cursor: pointer;
                    margin-top: 12px;
                    transition: background 0.16s ease;
                    &.checked {
                        background: rgba(255, 141, 26, 1);
                    }
                    &.cannotCheck {
                        cursor: not-allowed;
                    }
                }
                .c-img {
                    flex: none;
                    width: 46px;
                    height: 46px;
                    border-radius: 8px;
                    object-fit: cover;
                    background: rgba(36, 41, 46, 0.08);
                }
                .c-info {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 8px;
                    .c-name {
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 20px;
                        color: rgba(16, 24, 40, 1);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .c-goods-info {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        flex-wrap: wrap;
                        .c-stepper {
                            width: 104px;
                            height: 28px;
                            flex: none;
                            display: grid;
                            grid-template-columns: 30px 1fr 30px;
                            align-items: center;
                            overflow: hidden;
                            border: 1px solid rgba(88, 94, 226, 0.22);
                            border-radius: 9px;
                            background: rgba(36, 41, 46, 0.05);

                            button,
                            span {
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-sizing: border-box;
                            }

                            button {
                                border: 0;
                                padding: 0;
                                background: rgba(36, 41, 46, 0.07);
                                color: rgba(36, 41, 46, 0.72);
                                cursor: pointer;
                                font-size: 18px;
                                line-height: 1;
                                transition:
                                    background 0.16s ease,
                                    color 0.16s ease;

                                &:hover:not(:disabled) {
                                    background: rgba(255, 141, 26, 0.16);
                                    color: rgba(255, 141, 26, 1);
                                }

                                &:disabled {
                                    cursor: not-allowed;
                                    color: rgba(36, 41, 46, 0.24);
                                }
                            }

                            span {
                                min-width: 0;
                                color: rgba(36, 41, 46, 0.78);
                                font-size: 14px;
                                font-weight: 800;
                                line-height: 28px;
                            }
                        }
                    }
                    .u-price {
                        color: rgba(88, 94, 226, 1);
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        font-size: 16px;
                        font-weight: 800;

                        .icon {
                            width: 16px;
                            height: 16px;
                        }
                    }
                }
                .delete {
                    flex: none;
                    width: 26px;
                    height: 26px;
                    border-radius: 8px;
                    color: rgba(36, 41, 46, 0.62);
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition:
                        background 0.16s ease,
                        color 0.16s ease;

                    &:hover {
                        background: rgba(255, 92, 92, 0.1);
                        color: rgba(219, 54, 67, 1);
                    }
                }
            }
            .bottom {
                min-height: 24px;
                border-radius: 8px;
                background: rgba(255, 141, 26, 0.09);
                margin-top: 10px;
                padding: 3px 8px;
                box-sizing: border-box;
                font-size: 12px;
                font-weight: 700;
                line-height: 18px;
                color: rgba(255, 141, 26, 1);
                text-align: center;
            }
        }
    }
    .user-info {
        flex: none;
        margin-top: 12px;
        padding: 12px 0 10px;
        border-top: 1px dashed rgba(36, 41, 46, 0.18);
        border-bottom: 1px dashed rgba(36, 41, 46, 0.18);
        display: flex;
        flex-direction: column;
        align-items: center;

        .receipt-meta {
            height: 18px;
            font-size: 12px;
            line-height: 18px;
            text-align: center;
            color: rgba(56, 56, 56, 0.82);
        }

        .icon {
            margin-top: 4px;
            width: 160px;
            height: auto;
            color: rgba(0, 0, 0, 0.88);
        }
    }
    .total-price {
        flex: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 12px;

        .total-label {
            font-size: 13px;
            font-weight: 700;
            line-height: 18px;
            color: rgba(56, 56, 56, 0.82);
        }

        .total {
            min-height: 68px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid rgba(36, 41, 46, 0.06);
            box-shadow: 0 8px 20px rgba(9, 17, 30, 0.05);
            .total-item {
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                font-weight: 700;
                padding: 0 16px;
                color: rgba(36, 41, 46, 1);
                .right {
                    display: flex;
                    align-items: center;
                    svg {
                        margin-right: 4px;
                    }
                    span {
                        color: rgba(153, 153, 153, 1);
                    }
                }
            }
        }
        .total-btn {
            cursor: pointer;
            width: 176px;
            height: 46px;
            border-radius: 999px;
            background: linear-gradient(180deg, rgba(255, 176, 63, 1) 0%, rgba(255, 150, 35, 1) 100%);
            align-self: center;
            text-align: center;
            line-height: 46px;
            font-size: 18px;
            font-weight: 800;
            color: rgba(255, 255, 255, 1);
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                0 10px 24px rgba(255, 145, 31, 0.26);
            transition:
                transform 0.16s ease,
                box-shadow 0.16s ease;
            &:hover {
                transform: translateY(-1px);
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.24),
                    0 14px 28px rgba(255, 145, 31, 0.34);
            }

            &.disabled {
                cursor: not-allowed;
                opacity: 0.58;

                &:hover {
                    transform: none;
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        0 10px 24px rgba(255, 145, 31, 0.26);
                }
            }
        }
    }
}

@media screen and (max-width: 750px) {
    .cart {
        width: min(100vw, 390px);
        height: calc(100vh - 60px);
        right: max(-100vw, -390px);
        top: 60px;
        padding: 14px;

        .cart-title {
            padding-bottom: 12px;

            .cart-title-text {
                font-size: 18px;
                line-height: 26px;
            }
        }

        .cart-header {
            margin: 10px 0;
        }

        .m-cart-items {
            gap: 8px;

            .m-cart-item {
                padding: 10px;

                .top {
                    gap: 8px;

                    .c-img {
                        width: 42px;
                        height: 42px;
                    }

                    .c-info {
                        .c-name {
                            font-size: 13px;
                            line-height: 18px;
                        }

                        .u-price {
                            font-size: 15px;
                        }
                    }
                }
            }
        }

        .user-info {
            margin-top: 10px;
            padding: 10px 0 8px;
        }

        .total-price {
            gap: 10px;

            .total-btn {
                width: 168px;
                height: 44px;
                line-height: 44px;
            }
        }
    }
}
</style>
