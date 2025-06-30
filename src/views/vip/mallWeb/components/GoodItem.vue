<template>
    <div class="good-item" @click="$router.push({ name: 'mall_detail_web', params: { id: good.id } })">
        <img :src="good.goods_images[0]" alt="" class="good-item-img" />
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
                    <div v-if="!good.canBuy.canBuy" class="button-text">不满足兑换条件</div>
                    <div v-else class="button-text canBuy">
                        <template v-if="good.price_boxcoin">
                            <img
                                src="@/assets/img/vip/vip2/box_icon.svg"
                                svg-inline
                                style="fill: white; margin-right: 0.6vw;width: 3.2vw;height: 3.2vw;"
                            />{{ good.price_boxcoin }}盒币
                        </template>
                        <template v-if="good.price_boxcoin && good.price_points"> + </template>
                        <template v-if="good.price_points">
                            <img
                                src="@/assets/img/vip/vip2/points.svg"
                                svg-inline
                                style="fill: white; margin-right: 0.6vw;width: 3.2vw;height: 3.2vw;"
                            />{{ good.price_points }}积分
                        </template>
                    </div>
                </button>
                <div class="icon" @click.stop="addCart" v-if="good.canBuy.canBuy">
                    <img :src="imgUrl + '购物车.svg'" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { throttle } from "lodash";
export default {
    name: "GoodItem",
    data() {
        return {
            imgUrl: "https://cdn.jx3box.com/design/mall/",
        };
    },
    props: {
        good: {
            type: Object,
            required: true,
        },
    },
    methods: {
        getLevel(exp_limit) {
            return User.getLevel(exp_limit);
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
                                const url = `${this.root}dashboard/mall`;
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
                        transform: `translate(${leftCart - left}px, ${topCart - top}px)`,
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
.good-item {
    flex-shrink: 0;
    align-self: stretch;
    height: 32vw;
    border-radius: 3.2vw;
    background: rgba(36, 41, 46, 1);
    display: flex;
    cursor: pointer;
    overflow: hidden;
    .good-item-img {
        width: 32vw;
        height: 32vw;
    }
    .right {
        flex: 1;
        height: 32vw;
        padding: 1.6vw 2.1333vw 1.6vw 2.1333vw;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .header {
            display: flex;
            flex-direction: column;
            gap: 1.0667vw;
            .title {
                width: 53.3333vw;
                font-size: 3.7333vw;
                font-weight: 700;
                color: rgba(255, 255, 255, 1);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .sub-title {
                height: 4.8vw;
                border-radius: 1.0667vw;
                background: rgba(255, 195, 0, 0.3);
                color: rgba(255, 195, 0, 1);
                font-size: 3.2vw;
                padding: 0vw 1.0667vw 0vw 1.0667vw;
            }
            .tags {
                display: flex;
                gap: 1.0667vw;
                .tag {
                    height: 4.2667vw;
                    border-radius: 0.5333vw;
                    border: 0.1333vw solid rgba(255, 255, 255, 0.5);
                    font-size: 3.2vw;
                    line-height: 4.2667vw;
                    color: rgba(255, 255, 255, 0.5);
                    text-align: center;
                    padding: 0 1.0667vw;
                }
            }
        }
        .footer {
            display: flex;
            justify-content: space-between;
            gap: 1.0667vw;
            width: 100%;
            .button {
                flex: 1;
                height: 7.4667vw;
                border-radius: 2.1333vw;
                background: rgba(255, 105, 105, 0.15);
                cursor: pointer;
                &:disabled {
                    cursor: not-allowed;
                }
                .button-text {
                    font-size: 3.2vw;
                    overflow: hidden;
                    white-space: nowrap;
                    color: rgba(255, 105, 105, 1);
                    height: 100%;
                    text-align: center;
                    line-height: 7.4667vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.canBuy {
                        color: rgba(255, 255, 255, 1);
                        font-weight: 700;
                    }
                    img {
                        margin-right: 1.0667vw;
                    }
                }

                &.canBuy {
                    background: rgba(64, 128, 255, 1);
                }
            }
            .icon {
                width: 7.4667vw;
                height: 7.4667vw;
                border-radius: 2.1333vw;
                background: rgba(255, 163, 43, 1);
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 4.2667vw;
                    height: 4.2667vw;
                }
            }
        }
    }
}
</style>
