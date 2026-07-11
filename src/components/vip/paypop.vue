<template>
    <el-dialog
        class="c-pay-pop"
        :title="t || $t('vip.payment.title')"
        v-model="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :width="width"
    >
        <div class="c-pay-pop-box">
            <el-tabs class="c-pay-pop-tab" v-model="pay_type" type="card">
                <el-tab-pane :label="$t('vip.payment.alipay')" name="alipay">
                    <template #label>
                        <span class="u-tab"
                            ><img src="@/assets/img/vip/paypop/alipay.png" />{{ $t("vip.payment.alipayPay")
                            }}<em>{{ $t("vip.payment.installmentSupported") }}</em></span
                        >
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="$t('vip.payment.wechat')" name="wepay">
                    <template #label>
                        <span class="u-tab"
                            ><img src="@/assets/img/vip/paypop/wepay.png" />{{ $t("vip.payment.wechatPay")
                            }}<em>{{ $t("vip.payment.creditCardSupported") }}</em></span
                        >
                    </template>
                </el-tab-pane>
            </el-tabs>
            <div class="c-pay-pop-content">
                <h2 class="u-title">{{ productDesc }}</h2>
                <div class="u-price" v-if="price">
                    <b>{{ formatPrice(price) }}</b
                    ><em>{{ $t("vip.common.yuan") }}</em>
                </div>
                <div class="u-paybox">
                    <i class="u-qrcode u-wechat">
                        <qrcode-vue v-if="qrcode" class="u-pic" :value="qrcode" :size="260" level="H"></qrcode-vue>
                    </i>
                    <i18n-t v-if="isAlipay" keypath="vip.payment.desktopAlipayTip" tag="span" class="u-skip u-skip-alipay">
                        <a :href="skip_url" target="_blank">{{ $t("vip.payment.desktopAlipay") }}</a>
                    </i18n-t>
                    <span class="u-exp">{{ $t("vip.payment.expireTip") }}</span>
                    <transition name="fade">
                        <el-alert
                            class="u-warning"
                            v-show="warning_visible"
                            :title="$t('vip.payment.unpaidOrExpired')"
                            type="error"
                            show-icon
                            @close="closeWarning"
                        >
                        </el-alert>
                    </transition>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="u-btns">
                <el-button size="large" @click="cancel">{{ $t("vip.common.cancel") }}</el-button>
                <el-button size="large" type="primary" @click="check">{{ $t("vip.payment.completed") }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { checkOrder, createOrder } from "@/service/vip/order.js";
import { postStat } from "@jx3box/jx3box-common/js/stat";
import { getQuery } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "paypop",
    props: ["v", "w", "t", "payMode", "returnUrl", "productId", "productDesc", "count"],
    data: function () {
        return {
            // 窗口可见性
            visible: this.v || false,
            width: this.w || "50%",

            // 产品
            pay_type: this.payMode || "alipay",
            product_id: this.productId,
            return_url: this.returnUrl,

            // 订单信息
            qrcode: "",
            order_id: "",
            price: 0,
            status: "",
            skip_url: "", //支付宝跳转支付地址

            // 支付失败或过期提醒
            warning_visible: false,
        };
    },
    computed: {
        from: function () {
            return getQuery("from") || "pay";
        },
        params: function () {
            return {
                pay_type: this.pay_type,
                product_id: this.product_id,
                return_url: this.return_url,
                count: this.count || 1,
            };
        },
        isAlipay: function () {
            return this.pay_type == "alipay";
        },
    },
    model: {
        prop: "v",
        event: "switchPayPop",
    },
    watch: {
        // 可见双向数据
        v: function (val) {
            this.visible = val;
        },
        visible: function (val) {
            this.$emit("switchPayPop", val);
        },
        // 小窗口可二次定制数据
        payMode: function (val) {
            this.pay_type = val;
        },
        productId: function (val) {
            this.product_id = val;
        },
        returnUrl: function (val) {
            this.return_url = val;
        },
        // 创建订单
        params: {
            immediate: true,
            handler: function (params) {
                this.build();
            },
        },
    },
    methods: {
        cancel: function () {
            this.visible = false;
        },
        closeWarning: function () {
            this.warning_visible = false;
        },
        stat: function () {
            postStat(this.from, this.product_id);
        },
        build: function () {
            createOrder(this.params).then((res) => {
                // 兼容升级
                if (this.pay_type == "wepay") {
                    this.qrcode = res.data.data?.qrcode;
                } else {
                    this.qrcode = res.data.data?.toPayClient;
                    this.skip_url = res.data.data?.toPayWebSite;
                }

                this.order_id = res.data.data.orderId;
                this.price = res.data.data.price;
            });
        },
        check: function () {
            if (!this.order_id) {
                this.$notify.error({
                    title: this.$t("vip.common.error"),
                    message: this.$t("vip.payment.invalidOrderId"),
                });
                return;
            }
            checkOrder(this.order_id).then((res) => {
                this.status = res.data.data.pay_status;
                if (this.status == 1) {
                    this.visible = false;
                    this.$emit("done");
                    postStat(this.from + "_success", this.product_id);
                    location.reload();
                } else {
                    this.warning_visible = true;
                    postStat(this.from + "_fail", this.product_id);
                }
            });
        },
        formatPrice: function (val) {
            return (val && (val / 100).toFixed(2)) || "-";
        },
    },
    mounted: function () {
        this.stat();
    },
    components: {
        QrcodeVue,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/paypop.less";
</style>
