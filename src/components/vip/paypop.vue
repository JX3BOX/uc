<template>
    <el-dialog
        class="c-pay-pop"
        :title="title"
        :visible.sync="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :width="width"
    >
        <div class="c-pay-pop-box">
            <el-tabs class="c-pay-pop-tab" v-model="pay_type" type="card">
                <el-tab-pane label="支付宝" name="alipay">
                    <span slot="label" class="u-tab"
                        ><img src="@/assets/img/vip/paypop/alipay.png" />支付宝支付<em>支持花呗分期</em></span
                    >
                </el-tab-pane>
                <el-tab-pane label="微信" name="wepay">
                    <span slot="label" class="u-tab"
                        ><img src="@/assets/img/vip/paypop/wepay.png" />微信支付<em>支持信用卡</em></span
                    >
                </el-tab-pane>
            </el-tabs>
            <div class="c-pay-pop-content">
                <h2 class="u-title">{{ productDesc }}</h2>
                <div class="u-price" v-if="price">
                    <b>{{ price | formatPrice }}</b
                    ><em>元</em>
                </div>
                <div class="u-paybox">
                    <i class="u-qrcode u-wechat">
                        <qrcode-vue v-if="qrcode" class="u-pic" :value="qrcode" :size="260" level="H"></qrcode-vue>
                    </i>
                    <span class="u-skip u-skip-alipay" v-if="isAlipay"
                        >手机不在身边？使用<a :href="skip_url" target="_blank">电脑版支付宝</a>支付。</span
                    >
                    <span class="u-exp">（20分钟过期，请在支付完成后点击【已完成支付】）</span>
                    <transition name="fade">
                        <el-alert
                            class="u-warning"
                            v-show="warning_visible"
                            title="订单尚未支付或已过期"
                            type="error"
                            show-icon
                            @close="closeWarning"
                        >
                        </el-alert>
                    </transition>
                </div>
            </div>
        </div>
        <div slot="footer" class="u-btns">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="check">已完成支付</el-button>
        </div>
    </el-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import User from "@jx3box/jx3box-common/js/user";
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
            title: this.t || "支付中心",

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
                    title: "错误",
                    message: "无效订单号",
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
    },
    filters: {
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
