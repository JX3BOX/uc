<template>
    <div class="good-detail" :class="{ 'without-nav': !isShowNav }">
        <div :class="{ 'canBuy-text': true, canBuy: good.canBuy?.canBuy }">
            {{ good.canBuy?.canBuy ? "—&emsp;当前商品 · 可兑换&emsp;—" : "—&emsp;当前商品 · 不满足兑换条件&emsp;—" }}
        </div>
        <div class="title-card">
            <div class="title">{{ good.title }}</div>
            <div class="apply" v-if="apply[goodInfo.category]">应用场景：{{ apply[goodInfo.category] }}</div>
        </div>
        <div class="card">
            <div v-if="goodInfo.img" class="skeleton-container">
                <Skeleton :category="goodInfo.category" :img="goodInfo.img"></Skeleton>
            </div>
            <img :src="good.goods_images?.[0]" v-else style="width: 400px; height: 400px" />
        </div>
        <div class="buy-detail">
            <div class="detail-card">
                <div class="condition">
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.level }">
                        所需等级：lv.{{ good.canBuy?.user_level }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.level"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.vip_limit }">
                        会员专属
                        <i class="el-icon-circle-check" v-if="good.canBuy?.vip_limit"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.box_coin }" v-if="good.price_boxcoin">
                        所需盒币：{{ good.price_boxcoin }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.box_coin"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                    <div class="condition-item" :class="{ canBuy: good.canBuy?.points }" v-if="good.price_points">
                        所需积分：{{ good.price_points }}
                        <i class="el-icon-circle-check" v-if="good.canBuy?.points"></i>
                        <i class="el-icon-circle-close" v-else></i>
                    </div>
                </div>
                <div class="buy-time" :class="{ canBuy: good.canBuy?.buy_time }">
                    可兑换时间：{{ good.start_sell_time }} ~ {{ good.end_sell_time
                    }}{{ good.canBuy?.buy_time ? "" : "(不在兑换期内)" }}
                </div>
                <div class="buttons">
                    <button class="button add-cart" :disabled="!good?.canBuy?.canBuy" @click="addCart">
                        <img :src="imgUrl + 'cart-fill.svg'" alt="" />
                        加购
                    </button>
                    <button class="button buy" @click="buyGoods" :disabled="!good?.canBuy?.canBuy">
                        <template v-if="good.price_boxcoin">
                            <img :src="imgUrl + 'box_coin_fill.svg'" alt="" />{{ good.price_boxcoin }}盒币
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img :src="imgUrl + 'point.svg'" alt="" />{{ good.price_points }}积分
                        </template>
                    </button>
                    <!-- <button class="button like">
                        <img :src="imgUrl + 'like.svg'" alt="" />
                        点赞
                    </button> -->
                    <Like class="like" :postId="id" postType="mall"></Like>
                </div>
            </div>
            <div class="good-comment" v-html="good.describe"></div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Like from "@jx3box/jx3box-common-ui/src/interact/Like2.vue";
import Skeleton from "@/views/vip/mallNew/components/skeleton/index.vue";
import { throttle } from "lodash";
// import { getItem } from "@/service/vip/mall";
import { __cdn, __root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "GoodWebDetail",
    components: {
        Skeleton,
        Like,
    },
    props: {
        isShowNav: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            apply: {
                palu: "魔盒论坛列表页",
                avatar: "头像框",
                emoticon: "表情包",
                comment: "评论皮肤",
                sidebr: "侧边栏主题",
                atcard: "个人名片",
                calendar: "首页日历",
                homebg: "主页风格",
            },
            good: {},
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },

        goodInfo() {
            if (this.good && this.good.category === "virtual") {
                if (this.good.sub_category === "skin" && this.good.virtual_stock_item_details) {
                    return {
                        category: this.good.virtual_stock_item_details.category,
                        img:
                            __cdn +
                            `design/decoration/images/${this.good.remark}/${this.good.virtual_stock_item_details.category}.png`,
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
        buyGoods: throttle(function () {
            if (!User.isLogin()) {
                this.$message.error("请先登录");
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }
            const { category, is_virtual, id } = this.good;
            if (is_virtual && category == "virtual") {
                return this.$store
                    .dispatch("mallNew/buyGoods", {
                        id,
                        count: 1,
                        addressId: 0,
                        remark: "虚拟商品购买",
                    })
                    .then((res) => {
                        this.$confirm("购买成功，是否跳转至订单界面?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                const url = `${__root}dashboard/mall`;
                                window.open(url);
                            })
                            .catch(() => {});
                    });
            }

            this.$router.push({
                name: "mall_order_new",
                params: { id },
            });
        }, 2000),
        addCart: throttle(function (e) {
            const num = this.$store.state.mall.cart?.find((item) => item.goods_id === this.good.id)?.amount || 0;
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
            const eleBtn = e.target.tagName === "IMG" ? e.target.parentElement : e.target;
            const parent = eleBtn.parentElement;
            const { left, top } = eleBtn.getBoundingClientRect();
            const { left: leftCart, top: topCart } = this.$store.state.mallNew.boundCart;
            const flyele = eleBtn.cloneNode(true);
            flyele.style.cssText = `
                position: fixed;
                left: ${left}px;
                top: ${top}px;
                z-index: 1000;
            `;
            parent.appendChild(flyele);
            flyele.animate(
                [
                    {
                        transform: `translate(${leftCart - left}px, ${topCart - top}px) scale(0.3)`,
                    },
                ],
                { duration: 500, easing: "ease-in-out", fill: "forwards" }
            );
            setTimeout(() => {
                parent.removeChild(flyele);
            }, 500);
        },
    },
};
</script>

<style lang="less" scoped>
.good-detail {
    margin-left: 0;
    &.without-nav {
        margin-left: -820px;
    }
    @media screen and (max-width: 1550px) {
        &.without-nav {
            margin-left: -420px;
        }
    }
    flex: 1;
    box-sizing: border-box;
    min-width: 600px;
    min-height: calc(100vh - 100px);
    padding: 24px 292px 24px 0;
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
        width: 500px;
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
        width: 500px;
        height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        .skeleton-container {
            background-color: #fff;
            padding: 10px;
            border-radius: 10px;
        }
    }
    .buy-detail {
        width: 500px;
        height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 6px;
        .detail-card {
            width: 500px;
            height: 90px;
            .condition {
                width: 100%;
                height: 18px;
                display: flex;
                justify-content: center;
                gap: 16px;
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
                        background: rgba(255, 163, 43, 1);
                        &:disabled {
                            background: rgba(168, 168, 168, 1);
                            cursor: not-allowed;
                        }
                    }
                    &.like {
                        background: rgba(255, 133, 184, 1);
                    }
                }
            }
        }

        .good-comment {
            width: 500px;
            height: 77px;
            box-sizing: border-box;
            padding: 6px 43px;
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
</style>
