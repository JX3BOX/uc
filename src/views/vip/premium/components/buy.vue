<template>
    <div class="m-premium-buy--content">
        <div class="m-buy-box">
            <div class="u-title">
                <img src="@/assets/img/vip/vip2/menu.svg" alt="套餐选择" />
                <span>已选（1/1）</span>
            </div>
            <ul class="m-list">
                <li
                    :class="`u-item ${key} ${key === mode ? 'active' : ''}`"
                    v-for="(item, key) in vip_map"
                    :key="item.id"
                    @click="changeMenu(key)"
                >
                    <div :class="`u-item-title ${key}`">{{ item.label }}</div>
                    <div>开通{{ item.number }}个月</div>
                    <div :class="`u-price ${key}`">
                        <img class="u-icon-price" svg-inline src="@/assets/img/vip/vip2/money.svg" />
                        <b>{{ item.price }} </b>
                        /月
                    </div>
                    <div>优惠{{ showDiscount(key) }}元</div>
                    <div :class="`u-discount ${key}`">{{ item.discount ? `${item.discount}折` : "无折扣" }}</div>
                </li>
            </ul>
        </div>
        <div class="m-buy-box m-buy-box--special">
            <div class="u-title">
                <img src="@/assets/img/vip/vip2/special.svg" alt="魔盒5周年庆特惠" />
                <span class="u-time">2024.12.28~2025.2.28</span>
                <span>已选（2/2）</span>
            </div>
            <ul class="m-list m-list-text">
                <li class="u-item" v-for="(item, i) in five" :key="i">
                    <div>{{ item.text1 }}</div>
                    <div>{{ item.text2 }}</div>
                    <img class="u-checked" src="@/assets/img/vip/vip2/checked.svg" />
                </li>
            </ul>
        </div>
        <!-- * 开通年费会员后需前往专题页申请领取实物奖品（<a href="/event/birthday/#/5?anchor=gift" target="_blank">点击前往</a>）<br> -->
        <div class="u-tips">
            * 本虚拟商品无退货服务<br>
            * 获取的积分以实际支付金额为准
        </div>
        <div class="m-pay-content">
            <div class="m-pay-price">
                <div class="u-price">
                    <img class="u-icon-price" svg-inline src="@/assets/img/vip/vip2/money.svg" />
                    <b>{{ showPrice(mode) }}</b>
                </div>
                <div class="u-desc">
                    原价{{ vip_map[mode].number * vip_price }}元，已优惠{{ showDiscount(mode) }}元。
                </div>
            </div>
            <div class="u-pay-button" @click="toPay">立即支付</div>
        </div>
        <paypop
            v-if="will"
            v-model="dialog_visible"
            :productDesc="productDesc"
            :productId="productId"
            :returnUrl="returnUrl"
            @done="finish"
        />
    </div>
</template>

<script>
import callback from "@/utils/callback.js";
import paypop from "@/components/vip/paypop.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "premiumStatus",
    data: function () {
        return {
            isLogin: User.isLogin(),
            mode: "year",
            vip_map: {
                year: {
                    label: "年度会员",
                    id: 8,
                    number: 12,
                    price: 9.8,
                    discount: 6.5,
                },
                season: {
                    label: "季度会员",
                    id: 15,
                    number: 3,
                    price: 13.5,
                    discount: 9,
                },
                month: {
                    label: "月度会员",
                    id: 14,
                    number: 1,
                    price: 15,
                    discount: 0,
                },
            },
            five: [
                { text1: "每充值1元，", text2: "即可获得10魔盒积分" },
                { text1: "每开通一次年费会员，", text2: "即可领取一套精美笔记本（4选1）" },
            ],

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "", //7|8|9|12|13|14|15三种产品
            productDesc: "", //开通会员描述
            returnUrl: callback("premium"), //支付宝回调地址，当前页面
        };
    },
    components: { paypop },
    computed: {
        vip_price() {
            return this.vip_map.month.price;
        },
    },
    methods: {
        showPrice(mode = this.mode) {
            const { price, number } = this.vip_map[mode];
            return (price * number).toFixed(1);
        },
        showDiscount(mode = this.mode) {
            const { price, number } = this.vip_map[mode];
            if (mode === "month") {
                return 0;
            }
            return (this.vip_price * number - price * number).toFixed(1);
        },
        changeMenu(key) {
            this.mode = key;
        },
        toPay() {
            if (!this.isLogin) {
                User.toLogin();
            } else {
                const product_desc = "开通/续费" + this.vip_map[this.mode]["number"] + "个月会员";
                this.productId = this.vip_map[this.mode]["id"];
                this.productDesc = product_desc;
                this.will = true;
                this.dialog_visible = true;
            }
        },
        finish() {
            this.$emit("done");
        },
    },
};
</script>

<style lang="less" scope>
.m-premium-buy--content {
    .auto(x);
    max-width: 528px;
    .m-buy-box {
        .u-title {
            .flex;
            .fz(12px);
            color: #4d4d4d;
            align-items: center;
            span {
                margin-left: 10px;
            }
            .u-time {
                .r(2px);
                padding: 0 6px;
                color: #71523e;
                background: #bf8b6a33;
            }
        }
    }
    .m-list {
        .flex;
        padding: 10px 0 0 0;
        justify-content: space-between;
        .u-item {
            .pr;
            .x;
            .pointer;
            .r(12px);
            .fz(12px);
            .size(160px,170px);
            color: #00000080;
            padding: 20px 0 0 0;
            border: 1px solid #24292e33;
            box-sizing: border-box;
            &:hover,
            &.active {
                border: 1px solid #4080ff;
                background: linear-gradient(180deg, #e0ebff 0%, #ffffff 50%);
            }
            &.year:hover,
            &.year.active {
                border: 1px solid #bf8b6a;
                background: linear-gradient(180deg, #fff8ea 0%, #ffffff 50%);
            }
        }

        .u-item-title {
            .fz(18px);
            .bold;
            color: #24292e;
            &.year {
                color: #bf8b6a;
            }
        }
        .u-price {
            .bold;
            .fz(16px);
            margin: 10px 0 5px 0;
            color: #24292e;
            .u-icon-price {
                .size(12px);
                fill: #24292e;
            }
            b {
                .fz(28px);
            }
            &.year {
                color: #bf8b6a;
                .u-icon-price {
                    fill: #bf8b6a;
                }
            }
        }
        .u-discount {
            .pa;
            .size(120px,20px);
            .lh(20px);
            color: #fff;
            bottom: 10px;
            border-bottom-right-radius: 12px;
            border-top-left-radius: 12px;
            &.year {
                background: linear-gradient(270deg, #e72525 0%, #811414 100%);
            }
            &.season {
                background: linear-gradient(90deg, #000000 0%, #666666 100%);
            }
            &.month {
                background: #00000033;
            }
        }
    }
    .m-list-text {
        justify-content: flex-start;
        gap: 20px;
        .u-item {
            .size(auto);
            color: #4d4d4d;
            padding: 10px 50px 10px 10px;
            text-align: left;
            border: 1px solid #bf8b6a;
            &:hover {
                background: #fff;
                border: 1px solid #bf8b6a;
            }
            .u-checked {
                .pa;
                .rt(10px);
            }
        }
    }
}
.u-tips {
    .mt(5px);
    .fz(12px);
    color: #4d4d4d80;
    a:hover{
        text-decoration: underline;
    }
}
.m-buy-box--special {
    .mt(40px);
    .none;
}
.m-pay-content {
    .pt(40px);
    .flex;
    gap: 20px;
    .m-pay-price {
        .u-price {
            .fz(48px);
            .bold;
            .u-icon-price {
                .size(20px);
                fill: #bf8b6a;
            }
            b {
                background: linear-gradient(180deg, #bf8b6a 0%, #ffd16f 100%);
                -webkit-background-clip: text;
                color: transparent;
            }
        }
        .u-desc {
            .fz(12px,20px);
            .r(2px);
            padding: 0 15px;
            color: #bf8b6a;
            background: #bf8b6a1a;
        }
    }
    .u-pay-button {
        .x;
        .bold;
        .pointer;
        .size(180px,80px);
        .r(4px);
        .fz(18px,80px);
        color: #fff;
        background: linear-gradient(360deg, #4080ff 0%, #4080ff 100%);
        transition: 0.2s ease-in-out;
        &:hover {
            background: linear-gradient(360deg, #7accff 0%, #4080ff 100%);
        }
    }
}
</style>
