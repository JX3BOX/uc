<template>
    <div class="cart" :class="{ show: show }">
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
            <el-button type="info" plain size="mini" @click="handleClear">清空</el-button>
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
                                :min="1"
                                v-if="item.goods.category === 'virtual' && item.goods.sub_category === 'palu'"
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
                style="font-size: 12px; color: rgba(56, 56, 56, 1); text-align: center; height: 18px; line-height: 18px"
            >
                {{ name }}&emsp;{{ time }}
            </div>
            <img :src="`${imgUrl}bar-code.svg`" alt="" class="icon" svg-inline />
        </div>
        <div class="dashed"></div>
        <div class="total-price">
            <div style="font-size: 12px; color: rgba(56, 56, 56, 1)">合计：</div>
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
            <div class="total-btn" @click="$store.dispatch('mallNew/changeCartConfirmIsShow', true)">结算</div>
        </div>
    </div>
</template>
<script>
import { __cdn } from "@/utils/config";
import { debounce } from "lodash";
import moment from "moment";
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
.cart {
    width: 375px;
    height: calc(100vh - 100px);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(207, 207, 207, 1) 47.15%,
        rgba(255, 255, 255, 1) 100%
    );
    position: fixed;
    right: -375px;
    top: 100px;
    z-index: 1000;
    transition: all 0.3s ease;
    box-sizing: border-box;
    padding: 12px;
    overflow: scroll;
    scrollbar-width: none;
    &.show {
        transform: translateX(-100%);
    }
    .cart-title {
        height: 24px;
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        color: rgba(56, 56, 56, 1);
        display: flex;
        justify-content: space-between;
    }
    .dashed {
        height: 0px;
        border: 1px dashed rgba(166, 166, 166, 1);
        margin: 8px 0;
    }
    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 351px;
        height: 22px;
        .u-check-all-box {
            display: flex;
            align-items: center;
            gap: 4px;
            .u-check-all {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: none;
                color: #fff;
                font-size: 10px;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                cursor: pointer;
                &.checked {
                    background: rgba(255, 141, 26, 1);
                }
                .box-text {
                    font-size: 14px;
                }
            }
        }
    }
    .m-cart-items {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
        min-height: 500px;
        overflow: scroll;
        scrollbar-width: none;
        .m-cart-item {
            width: 351px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
            padding: 8px 8px 8px 8px;
            &.cannotBuy {
                border: 1px solid rgba(255, 105, 105, 1);
            }
            .top {
                display: flex;
                gap: 8px;
                .c-check {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: none;
                    color: #fff;
                    font-size: 10px;
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
                    width: 32px;
                    height: 32px;
                    align-self: center;
                }
                .c-info {
                    align-self: center;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .c-name {
                        font-size: 13px;
                        color: rgba(0, 0, 0, 1);
                    }
                    .c-goods-info {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                        /deep/ .el-input-number {
                            width: 70px;
                            height: 14px;
                            .el-input-number__decrease,
                            .el-input-number__increase {
                                width: 14px;
                                height: 14px;
                                line-height: 14px;
                                background: rgba(128, 128, 128, 0.2);
                                border: none;
                                border-radius: 4px;
                            }
                            .el-input {
                                height: 14px;
                                input {
                                    width: 70px;
                                    height: 16px;
                                    padding: 0 14px;
                                    position: absolute;
                                    top: 1;
                                    left: 0;
                                    background: #f2f2f2;
                                    color: rgba(56, 56, 56, 0.5);
                                    border-radius: 5px;
                                }
                            }
                        }
                    }
                }
                .delete {
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: flex-start;
                }
            }
            .bottom {
                height: 16px;
                border-radius: 4px;
                background: rgba(255, 141, 26, 0.1);
                margin-top: 4px;
                font-size: 12px;
                line-height: 16px;
                color: rgba(255, 141, 26, 1);
                text-align: center;
            }
        }
    }
    .user-info {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .total-price {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .total {
            height: 61px;
            border-radius: 8px;
            background: #ffffff;
            .total-item {
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                padding: 0 12px;
                color: rgba(0, 0, 0, 1);
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
            width: 161px;
            height: 50px;
            border-radius: 50px;
            background: rgba(255, 163, 43, 1);
            align-self: center;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            &:hover {
                box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
            }
        }
    }
}
</style>
