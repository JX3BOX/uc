<template>
    <div class="m-vip-namespace">
        <div class="m-vip-namespace-index" v-if="!done">
            <simple-header :title="$t('vip.namespace.purchaseTitle')" :desc="$t('vip.namespace.purchaseSubtitle')" />
            <div class="m-vip-namespac-cont">
                <!-- 铭牌解释 -->
                <div class="m-vip-namespac-info">
                    <h3>{{ $t("vip.namespace.termExplanation") }}</h3>
                    <i18n-t keypath="vip.namespace.explanation" tag="p">
                        <a href="https://www.剑网3.com" target="_blank">剑网3.com</a>
                        <a href="https://剑网3.com/某某气纯宏" target="_blank">剑网3.com/{{ $t("vip.namespace.exampleKeyword") }}</a>
                    </i18n-t>
                </div>
                <!-- 活动购买 -->
                <div class="m-vip-namespace-buy">
                    <!-- <div class="u-item">
                        <i class="u-img">
                            <img :src="banner" />
                        </i>
                        <div class="u-info">
                            <div class="u-price"><span>0.99</span>元</div>
                            <div class="u-title">秒杀活动</div>
                            <div class="u-txt">
                                特惠价： ¥ 0.99元 / 10个铭牌
                            </div>
                            <div href="http://" target="_blank" class="u-btn" @click="buyNamespacePro"><i class="el-icon-shopping-cart-2"></i> 购买</div>
                        </div>
                        <div class="u-mark">
                            <img src="../../assets/img/vip/sale.png" />
                        </div>
                    </div> -->
                    <div class="u-item">
                        <i class="u-img">
                            <img :src="banner" />
                        </i>
                        <div class="u-info">
                            <div class="u-price"><span>10.00</span>{{ $t("vip.common.yuan") }}</div>
                            <div class="u-title">{{ $t("vip.namespace.discountEvent") }}</div>
                            <div class="u-txt">{{ $t("vip.namespace.specialOfferLine", { price: 10, original: 20, count: 20 }) }}</div>
                            <div class="u-btn" @click="buyNamespace"><i class="el-icon-shopping-cart-2"></i> {{ $t("vip.common.purchase") }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <result class="m-vip-result" v-else>
            <template title>
                <div class="m-premium-result-title">
                    {{ $t("vip.common.purchaseSuccess") }}
                </div>
            </template>
            <template #desc>
                    <i18n-t keypath="vip.namespace.purchaseSuccessGuide" tag="div" class="m-rename-result-desc"><a :href="register_namespace_url">{{ $t("vip.namespace.goRegister") }}</a></i18n-t>
            </template>
        </result>
        <paypop v-if="will" v-model="dialog_visible" :productDesc="productDesc" :productId="productId" :returnUrl="returnUrl" @done="finish" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import paypop from "@/components/vip/paypop.vue";
import callback from "@/utils/callback.js";
import result from "@/components/vip/result.vue";
import simple_header from "@/components/vip/simple_header.vue";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@/utils/config";
export default {
    data: function() {
        return {
            // 资产与权限
            isLogin: User.isLogin(),
            asset: "",

            // 状态与流程控制
            done: false, //是否开通完成
            pay_success: false, //支付完成回调
            refer: "", //开通完成后跳转至付费产品

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "", //7|8|9三种产品
            productDesc: "", //开通PRE/PRO+升级PRE到PRO
            returnUrl: callback("namespace"), //支付宝回调地址，当前页面
        };
    },
    computed: {
        register_namespace_url: function() {
            return publishLink("namespace");
        },
        banner: function() {
            return __imgPath + "image/event/namespace-1.png";
        },
    },
    methods: {
        doBuy: function(type) {
            if (!this.isLogin) {
                User.toLogin();
            } else {
                this.will = true;
                this.productId = type;
                this.dialog_visible = true;
            }
        },
        loadAsset: function() {
            return User.getAsset().then((data) => {
                this.asset = data;
            });
        },
        redirect: function() {
            if (this.refer) {
                location.href = this.refer;
            }
        },
        finish: function() {
            // location.reload();
            this.loadAsset().then(() => {
                this.done = true;
                this.redirect();
            });
        },
        buyNamespacePro: function() {
            this.productDesc = this.$t("vip.namespace.flashSaleProduct");
            this.doBuy("10");
        },
        buyNamespace: function() {
            this.productDesc = this.$t("vip.namespace.namespaceProduct");
            this.doBuy("11");
        },
    },
    created: function() {
        this.isLogin && this.loadAsset();

        let params = new URLSearchParams(location.search);
        this.refer = params.get("redirect") || "";
        // this.redirect()
    },
    components: {
        paypop,
        result,
        "simple-header": simple_header,
    },
};
</script>
