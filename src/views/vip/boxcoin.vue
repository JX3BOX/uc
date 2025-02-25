<template>
    <div id="app">
        <Header></Header>
        <!-- <Breadcrumb name="充值盒币" slug="vip" root="/vip/boxcoin" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />
        </Breadcrumb> -->
        <Main class="m-vip-container" :withoutRight="true" :withoutLeft="true">
            <div class="m-boxcoin">
                <div class="m-boxcoin-box" v-if="!done">
                    <simple-header class="m-boxcoin-title" title="充值盒币" desc="Charge your boxcoin" />
                    <div class="m-boxcoin-form">
                        <div class="u-desc">
                            <i class="el-icon-question"></i>
                            盒币可用于打赏作者或魔盒商城限定商品，所有虚拟货币充值均无法退款，请知晓。
                        </div>
                        <el-form ref="form" label-width="80px" :label-position="position">
                            <el-form-item label="当前拥有">
                                <div class="u-current">
                                    <b>{{ total }}</b>
                                </div>
                            </el-form-item>
                            <el-form-item label="购买数量">
                                <el-radio-group v-model="count" size="small">
                                    <el-radio label="15" border>1500盒币</el-radio>
                                    <el-radio label="30" border>3000盒币</el-radio>
                                    <el-radio label="50" border>5000盒币</el-radio>
                                    <el-radio label="100" border>10000盒币</el-radio>
                                    <el-radio label="500" border>50000盒币</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="支付金额">
                                <div>
                                    <span>¥</span>
                                    <b class="u-price">{{ count | formatPrice }}</b>
                                    <span>元</span>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="u-btn" type="primary" @click="buy">充值</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <result class="m-boxcoin-result" v-else>
                    <div slot="title" class="m-boxcoin-result-title">充值成功</div>
                    <div slot="desc" class="m-boxcoin-result-desc">
                        <p>
                            当前剩余盒币：
                            <b>{{ total }}</b>
                        </p>
                        <el-button class="u-back" @click="goBack" plain icon="el-icon-refresh-left">返回</el-button>
                    </div>
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
        <Footer></Footer>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import paypop from "@/components/vip/paypop.vue";
import callback from "@/utils/callback.js";
import result from "@/components/vip/result.vue";
import simple_header from "@/components/vip/simple_header.vue";
export default {
    data: function () {
        return {
            // 状态与流程控制
            isLogin: User.isLogin(),
            done: false, //是否开通完成
            pay_success: false, //支付完成回调
            refer: "", //开通完成后跳转至付费产品
            total: 0, //盒币余额

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "5", //5为盒币产品
            count: "15",
            returnUrl: callback("boxcoin"), //支付宝回调地址，当前页面

            // 其他
            position: window.innerWidth < 768 ? "top" : "left",
        };
    },
    computed: {
        productDesc: function () {
            return "充值盒币" + this.count * 100;
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
                this.total = data?.box_coin || 0;
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
    },
    created: function () {
        this.isLogin && this.loadAsset();

        let params = new URLSearchParams(location.search);
        this.refer = params.get("redirect") || "";
    },
    filters: {
        formatPrice: function (val) {
            return val && (~~val).toFixed(2);
        },
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
