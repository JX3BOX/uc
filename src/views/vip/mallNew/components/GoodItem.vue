<template>
    <div class="good-item" @click="changeSelectItem(good)">
        <div class="good-item-image">
            <img v-if="previewImage" :src="previewImage" alt="" class="good-item-img" />
            <div v-else class="good-item-img u-good-image-null">暂无图片</div>
            <span v-if="good.has_owned" class="u-owned-tag">已拥有</span>
        </div>
        <div class="right">
            <div class="header">
                <div class="title">{{ good.title }}</div>
                <div v-if="good.subtitle" style="width: 100%; display: flex">
                    <div class="sub-title">{{ good.subtitle }}</div>
                </div>
                <div class="tags">
                    <div class="tag">lv.{{ getLevel(good.exp_limit) }}</div>
                    <div class="tag" v-if="good.vip_limit === 1">会员专享</div>
                </div>
            </div>
            <div class="footer">
                <button
                    :class="{ button: true, canBuy: good.canBuy.canBuy }"
                    @click.stop="buyGoods(good)"
                    :disabled="!good.canBuy.canBuy"
                >
                    <div v-if="!good.canBuy.canBuy" class="button-text">
                        {{ good.has_owned ? "已拥有" : "不满足兑换条件" }}
                    </div>
                    <div v-else class="button-text canBuy">
                        <template v-if="good.price_boxcoin">
                            <img :src="imgUrl + 'box_coin.svg'" alt="" />{{ good.price_boxcoin }}盒币
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img :src="imgUrl + 'point.svg'" alt="" />{{ good.price_points }}积分
                        </template>
                    </div>
                </button>
                <div class="icon" @click.stop="addCart" v-if="good.canBuy.canBuy">
                    <img :src="imgUrl + 'cart.svg'" alt="" />
                </div>
            </div>
        </div>
        <BuyConfirm :item="good" ref="buyConfirm" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { throttle } from "lodash";
import BuyConfirm from "./BuyConfirm.vue";
import { __cdn } from "@/utils/config";
import { playAddCartFly } from "@/utils/mallCartFly";
export default {
    name: "GoodItem",
    inject: ["changeSelectItem"],
    components: {
        BuyConfirm,
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
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
    },
    methods: {
        getLevel(exp_limit) {
            return User.getLevel(exp_limit);
        },
        buyGoods: throttle(function () {
            this.$refs.buyConfirm.isShow = true;
        }, 2000),
        addCart: throttle(function (e) {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            const num = this.$store.state.mallNew.cart?.find((item) => item.goods_id === this.good.id)?.amount || 0;
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
                        this.fly(e);
                    }
                });
        }, 1000),
        fly(e) {
            playAddCartFly(e, this.$store.state.mallNew.boundCart, { image: this.previewImage });
        },
    },
};
</script>

<style lang="less" scoped>
.good-item {
    width: 330px;
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
        .good-item-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .u-good-image-null {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
        }
        .u-owned-tag {
            position: absolute;
            top: 6px;
            right: 6px;
            height: 20px;
            padding: 0 8px;
            border-radius: 10px;
            background: rgba(36, 41, 46, 0.88);
            color: rgba(255, 195, 0, 1);
            font-size: 12px;
            font-weight: 700;
            line-height: 20px;
        }
    }
    .right {
        width: 240px;
        height: 120px;
        padding: 6px 8px 6px 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header {
            display: flex;
            flex-direction: column;
            gap: 4px;
            .title {
                width: 194px;
                font-size: 14px;
                font-weight: 700;
                color: rgba(255, 255, 255, 1);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .sub-title {
                height: 18px;
                border-radius: 4px;
                background: rgba(255, 195, 0, 0.3);
                color: rgba(255, 195, 0, 1);
                font-size: 12px;
                padding: 0px 4px 0px 4px;
            }
            .tags {
                display: flex;
                gap: 4px;
                .tag {
                    height: 16px;
                    border-radius: 2px;
                    border: 0.5px solid rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    line-height: 16px;
                    color: rgba(255, 255, 255, 0.5);
                    text-align: center;
                    padding: 0 4px;
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
                height: 28px;
                border-radius: 8px;
                background: rgba(255, 105, 105, 0.15);
                cursor: pointer;
                &:disabled {
                    cursor: not-allowed;
                }
                .button-text {
                    font-size: 12px;
                    overflow: hidden;
                    white-space: nowrap;
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
                        margin-right: 4px;
                    }
                }

                &.canBuy {
                    background: rgba(64, 128, 255, 1);
                    &:hover {
                        background: linear-gradient(180deg, rgba(64, 128, 255, 1) 52.47%, rgba(150, 236, 255, 1) 100%);
                    }
                }
            }
            .icon {
                width: 28px;
                height: 28px;
                border-radius: 8px;
                background: rgba(255, 163, 43, 1);
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover {
                    background: linear-gradient(180deg, rgba(255, 163, 43, 1) 51.39%, rgba(252, 221, 109, 1) 100%);
                }
            }
        }
    }
}
</style>
