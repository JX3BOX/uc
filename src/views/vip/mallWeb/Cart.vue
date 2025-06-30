<template>
    <div class="cart-web">
        <div class="cart-title">
            购物车清单<i
                class="el-icon-close"
                @click="$store.dispatch('mallNew/changeCartIsShow', false)"
                style="cursor: pointer"
            ></i>
        </div>
        <div class="dashed"></div>
        <div class="cart-header">
            <div class="u-check-all-box">
                <div class="u-check-all" :class="{ checked: isAll }" @click="allChange">
                    <i class="el-icon-check"></i>
                </div>
                <div class="box-text">
                    全选&nbsp;({{ $store.getters["mallNew/checked_num"] }}/{{ $store.getters["mallNew/num"] }})
                </div>
            </div>
            <div class="clear-btn" @click="handleClear">清空</div>
        </div>
        <div class="m-cart-items">
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
                            <el-input-number
                                v-model="item.amount"
                                :max="item.goods.stock"
                                @change="itemChange(item, $event)"
                            ></el-input-number>
                            <span v-if="item.goods.price_points" style="color: rgba(116, 120, 237, 1)">
                                <img src="@/assets/img/vip/vip2/points.svg" alt="" class="icon" svg-inline />
                                {{ item.goods.price_points }}
                            </span>
                            <span v-if="item.goods.price_boxcoin" style="color: rgba(42, 130, 228, 1)">
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
        </div>
        <div class="user-info">
            <div
                style="
                    font-size: 3.2vw;
                    color: rgba(56, 56, 56, 1);
                    text-align: center;
                    height: 4.8vw;
                    line-height: 4.8vw;
                "
            >
                {{ name }}&emsp;{{ time }}
            </div>
            <img :src="`${imgurl}条形码.svg`" alt="" class="icon" svg-inline />
        </div>
        <div class="dashed"></div>
        <div class="total-price">
            <div style="font-size: 3.2vw; color: rgba(56, 56, 56, 1)">合计：</div>
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
            <div class="total-btn" @click="$router.push({ name: 'mall_batch_order_web' })">结算</div>
        </div>
    </div>
</template>

<script>
import { debounce } from "lodash";
import moment from "moment";
export default {
    name: "Cart",
    data() {
        return {
            imgurl: "https://cdn.jx3box.com/design/mall/",
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
    },
    computed: {
        cart() {
            return this.$store.state.mallNew.cart;
        },
        isAll() {
            return this.list.every((item) => item.checked);
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
        itemChecked(item) {
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
    },
};
</script>

<style lang="less" scoped>
.cart-web {
    width: 100vw;
    height: calc(100vh - 64px - 9.6vw);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(207, 207, 207, 1) 47.15%,
        rgba(255, 255, 255, 1) 100%
    );
    box-sizing: border-box;
    padding: 3.2vw;
    overflow: scroll;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    .cart-title {
        height: 6.4vw;
        font-size: 4.2667vw;
        font-weight: 700;
        line-height: 6.4vw;
        color: rgba(56, 56, 56, 1);
        display: flex;
        justify-content: space-between;
    }
    .dashed {
        height: 0vw;
        border: 0.2667vw dashed rgba(166, 166, 166, 1);
        margin: 2.1333vw 0;
    }
    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 93.6vw;
        height: 5.8667vw;
        .u-check-all-box {
            display: flex;
            align-items: center;
            gap: 1.0667vw;
            .u-check-all {
                width: 3.7333vw;
                height: 3.7333vw;
                border-radius: 50%;
                border: none;
                color: #fff;
                font-size: 2.6667vw;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                cursor: pointer;
                &.checked {
                    background: rgba(255, 141, 26, 1);
                }
            }
            .box-text {
                font-size: 3.7333vw;
            }
        }
        .clear-btn {
            width: 10.6667vw;
            height: 5.8667vw;
            border-radius: 0.5333vw;
            border: 0.5px solid rgba(0, 0, 0, 0.5);
            text-align: center;
            line-height: 5.8667vw;
            font-size: 3.2vw;
            color: rgba(0, 0, 0, 1);
            cursor: pointer;
        }
    }
    .m-cart-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.0667vw;
        margin-top: 2.1333vw;
        overflow: scroll;
        scrollbar-width: none;
        min-height: 30vw;
        .m-cart-item {
            width: 93.6vw;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
            padding: 2.1333vw 2.1333vw 2.1333vw 2.1333vw;
            &.cannotBuy {
                border: 0.2667vw solid rgba(255, 105, 105, 1);
            }
            .top {
                display: flex;
                gap: 2.1333vw;
                .c-check {
                    width: 3.7333vw;
                    height: 3.7333vw;
                    border-radius: 50%;
                    border: none;
                    color: #fff;
                    font-size: 2.6667vw;
                    background: rgba(0, 0, 0, 0.2);
                    text-align: center;
                    cursor: pointer;
                    &.checked {
                        background: rgba(255, 141, 26, 1);
                    }
                    &.cannotCheck {
                        cursor: not-allowed;
                    }
                }
                .c-img {
                    width: 8.5333vw;
                    height: 8.5333vw;
                    align-self: center;
                }
                .c-info {
                    align-self: center;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .c-name {
                        font-size: 3.4667vw;
                        color: rgba(0, 0, 0, 1);
                    }
                    .c-goods-info {
                        display: flex;
                        gap: 2.1333vw;
                        align-items: center;
                        /deep/ .el-input-number {
                            width: 18.6667vw;
                            height: 3.7333vw;
                            .el-input-number__decrease,
                            .el-input-number__increase {
                                width: 3.7333vw;
                                height: 3.7333vw;
                                line-height: 3.7333vw;
                                background: rgba(128, 128, 128, 0.2);
                                border: none;
                                border-radius: 1.0667vw;
                            }
                            .el-input {
                                height: 3.7333vw;
                                input {
                                    width: 18.6667vw;
                                    height: 4.2667vw;
                                    padding: 0 3.7333vw;
                                    position: absolute;
                                    top: 1;
                                    left: 0;
                                    background: #f2f2f2;
                                    color: rgba(56, 56, 56, 0.5);
                                    border-radius: 1.3333vw;
                                    font-size: 3.2vw;
                                }
                            }
                        }
                        span {
                            display: flex;
                            align-items: center;
                            font-size: 3.4667vw;
                            .icon {
                                width: 3vw;
                                height: 3vw;
                                margin-right: 0.6667vw;
                            }
                        }
                    }
                }
                .delete {
                    font-size: 3.2vw;
                    cursor: pointer;
                    display: flex;
                    align-items: flex-start;
                }
            }
            .bottom {
                height: 4.2667vw;
                border-radius: 1.0667vw;
                background: rgba(255, 141, 26, 0.1);
                margin-top: 1.0667vw;
                font-size: 3.2vw;
                line-height: 4.2667vw;
                color: rgba(255, 141, 26, 1);
                text-align: center;
            }
        }
    }
    .user-info {
        margin-top: 2.1333vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .total-price {
        display: flex;
        flex-direction: column;
        gap: 2.1333vw;
        .total {
            height: 16.2667vw;
            border-radius: 2.1333vw;
            background: #ffffff;
            .total-item {
                height: 8vw;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 3.2vw;
                padding: 0 3.2vw;
                color: rgba(0, 0, 0, 1);
                .right {
                    display: flex;
                    align-items: center;
                    svg {
                        margin-right: 1.0667vw;
                        width: 2.5vw;
                        height: 2.5vw;
                    }
                    span {
                        color: rgba(153, 153, 153, 1);
                    }
                }
            }
        }
        .total-btn {
            width: 42.9333vw;
            height: 13.3333vw;
            border-radius: 13.3333vw;
            background: rgba(255, 163, 43, 1);
            align-self: center;
            text-align: center;
            line-height: 13.3333vw;
            font-size: 4.8vw;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
        }
    }
}
</style>
