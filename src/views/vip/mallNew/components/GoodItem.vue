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
            <span v-if="isLoggedIn && good.has_owned" class="u-owned-tag">
                <Check class="owned-icon" />
                已拥有
            </span>
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
                    @click.stop="buyGoods(good)"
                >
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
                <div class="icon" @click.stop="addCart">
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
import { Check } from "@element-plus/icons-vue";
import BuyConfirm from "./BuyConfirm.vue";
import { __cdn } from "@/utils/config";
import { playAddCartFly } from "@/utils/mallCartFly";
import { alertMallRequirement } from "@/utils/mallExchangeError";
export default {
    name: "GoodItem",
    inject: ["changeSelectItem"],
    components: {
        BuyConfirm,
        Check,
    },
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
            imageFailed: false,
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
            this.$refs.buyConfirm.isShow = true;
        }, 2000),
        addCart: throttle(function (e) {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.good.canBuy?.canBuy) {
                return alertMallRequirement(this, this.good, this.good.canBuy);
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
            playAddCartFly(e, this.$store.state.mallNew.boundCart, { image: this.displayImage || this.previewImage });
        },
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
        .u-owned-tag {
            position: absolute;
            top: 6px;
            right: 6px;
            height: 22px;
            padding: 0 9px 0 7px;
            border-radius: 999px;
            background:
                linear-gradient(180deg, rgba(42, 38, 27, 0.92), rgba(15, 17, 20, 0.86)),
                rgba(18, 20, 24, 0.82);
            border: 1px solid rgba(255, 203, 82, 0.46);
            color: rgba(255, 219, 124, 1);
            box-shadow:
                0 5px 14px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.12);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.6rem;
            font-weight: 500;
            line-height: 22px;
            backdrop-filter: blur(6px);

            .owned-icon {
                width: 12px;
                height: 12px;
                flex: none;
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
                }

            }
            .icon {
                width: 28px;
                height: 28px;
                border-radius: 8px;
                background: linear-gradient(180deg, rgba(255, 177, 66, 1) 0%, rgba(255, 150, 35, 1) 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                flex: none;
                position: relative;
                overflow: hidden;
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

                img {
                    position: relative;
                    z-index: 1;
                    width: 20px;
                    height: 20px;
                }
            }
        }
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

            .u-owned-tag {
                top: 0.375rem;
                right: 0.375rem;
                height: 1.375rem;
                padding: 0 0.5rem 0 0.375rem;
                border-radius: 999px;
                font-size: 0.6rem;
                line-height: 1.375rem;

                .owned-icon {
                    width: 0.75rem;
                    height: 0.75rem;
                }
            }
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

                    img {
                        width: 1rem;
                        height: 1rem;
                    }
                }
            }
        }
    }
}
</style>
