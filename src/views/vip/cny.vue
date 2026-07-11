<template>
    <div>
        <CommonHeader></CommonHeader>
        <!-- <Breadcrumb name="充值金箔" slug="vip" root="/vip/cny" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />
        </Breadcrumb> -->
        <Main class="m-vip-container" :withoutRight="true" :withoutLeft="true">
            <div class="m-boxcoin">
                <div class="m-boxcoin-box" v-if="!done">
                    <simple-header class="m-boxcoin-title" :title="$t('vip.recharge.cnyTitle')" :desc="$t('vip.recharge.cnySubtitle')" />
                    <div class="m-boxcoin-form">
                        <div class="u-desc">
                            <i class="el-icon-question"></i>
                            {{ $t("vip.recharge.cnyNotice") }}
                        </div>
                        <el-form ref="form" label-width="80px" :label-position="position">
                            <el-form-item :label="$t('vip.recharge.currentBalance')">
                                <div class="u-current">
                                    <b>{{ total }}</b>
                                </div>
                            </el-form-item>
                            <el-form-item :label="$t('vip.recharge.purchaseAmount')">
                                <el-radio-group v-model="count">
                                    <el-radio v-for="amount in cnyOptions" :key="amount" :value="amount" border>{{ $t("vip.recharge.cnyAmount", { amount }) }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item :label="$t('vip.recharge.paymentAmount')">
                                <div>
                                    <span>¥</span>
                                    <b class="u-price">{{ formatPrice(count) }}</b>
                                    <span>{{ $t("vip.common.yuan") }}</span>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="u-btn" type="primary" @click="buy" :disabled="!cny_enable"
                                    >{{ $t("vip.recharge.recharge") }}</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <result class="m-boxcoin-result" v-else>
                    <template #title>
                        <div class="m-boxcoin-result-title">{{ $t("vip.recharge.success") }}</div>
                    </template>
                    <template #desc>
                        <div class="m-boxcoin-result-desc">
                            <p>
                                {{ $t("vip.recharge.remainingCny") }}
                                <b>{{ total }}</b>
                            </p>
                        </div>
                        <el-button class="u-back" @click="goBack" plain icon="RefreshLeft">{{ $t("vip.common.back") }}</el-button>
                    </template>
                </result>
            </div>
        </Main>
        <paypop
            v-if="will"
            v-model="dialog_visible"
            :productDesc="productDesc"
            :productId="productId"
            :count="count"
            :returnUrl="returnUrl"
            @done="finish"
        />
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import paypop from "@/components/vip/paypop.vue";
import callback from "@/utils/callback.js";
import result from "@/components/vip/result.vue";
import simple_header from "@/components/vip/simple_header.vue";
import { getConfig } from "@/service/vip/cms";
export default {
    data: function () {
        return {
            // 状态与流程控制
            isLogin: User.isLogin(),
            done: false, //是否开通完成
            pay_success: false, //支付完成回调
            refer: "", //开通完成后跳转至付费产品
            total: 0, //金箔余额

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "16", //16为金箔产品
            count: 1688,
            returnUrl: callback("cny"), //支付宝回调地址，当前页面

            // 其他
            position: window.innerWidth < 768 ? "top" : "left",

            cny_enable: 0,
        };
    },
    computed: {
        cnyOptions() {
            return [1688, 8888, 12888, 36888, 68888];
        },
        productDesc: function () {
            return this.$t("vip.recharge.cnyProduct", { amount: this.count });
        },
    },
    methods: {
        buy: function (type) {
            if (!this.isLogin) {
                User.toLogin();
            } else {
                this.will = true;
                this.dialog_visible = true;
            }
        },
        loadAsset: function () {
            return User.getAsset().then((data) => {
                this.total = data?.cny || 0;
            });
        },
        redirect: function () {
            if (this.refer) {
                location.href = this.refer;
            }
        },
        finish: function () {
            this.loadAsset().then(() => {
                this.done = true;
                this.redirect();
            });
        },
        goBack: function () {
            this.done = false;
        },
        loadConfig: function () {
            getConfig({ key: "cny_enable" }).then((res) => {
                this.cny_enable = Number(res.val);
            });
        },
        formatPrice: function (val) {
            return val && (~~val / 100).toFixed(2);
        },
    },
    created: function () {
        if (this.isLogin) {
            this.loadAsset();

            this.loadConfig();
        }

        let params = new URLSearchParams(location.search);
        this.refer = params.get("redirect") || "";
    },
    components: {
        paypop,
        result,
        "simple-header": simple_header,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/boxcoin.less";
</style>
