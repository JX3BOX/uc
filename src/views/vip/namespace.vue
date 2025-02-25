<template>
    <div id="app">
        <Header></Header>
        <Main class="m-vip-container" :withoutRight="true" :withoutLeft="true">
            <div class="m-namespace m-boxcoin">
                <div class="m-namespace-box m-boxcoin-box" v-if="!done">
                    <simple-header class="m-boxcoin-title" title="剑网3.com" desc="Register your namespace" />
                    <div class="m-boxcoin-form">
                        <div class="u-desc">
                            <i class="el-icon-question"></i>
                            铭牌可通过关键词快速在浏览器中输入<b>剑网3.com/您的关键词</b>访问您所指定的链接地址。
                        </div>
                        <el-form ref="form" label-width="80px" :label-position="position">
                            <el-form-item label="当前拥有">
                                <div class="u-current">
                                    <b>{{ (asset && asset.namespace_card_count) || 0 }}</b>
                                </div>
                            </el-form-item>
                            <el-form-item label="购买数量">
                                <el-radio-group v-model="count" size="small">
                                    <el-radio :label="20" border>20个铭牌</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="支付金额">
                                <div>
                                    <span>¥</span>
                                    <b class="u-price">10.00</b>
                                    <span>元</span>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="u-btn" type="primary" @click="buy">购买</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <result class="m-boxcoin-result" v-else>
                    <div slot="title" class="m-boxcoin-result-title">购买成功</div>
                    <div slot="desc" class="m-boxcoin-result-desc">
                        <p>购买成功，<a :href="register_namespace_url" target="_blank">前往注册铭牌</a></p>
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
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "namespace",
    data: function () {
        return {
            // 状态与流程控制
            isLogin: User.isLogin(),
            done: false, //是否开通完成
            pay_success: false, //支付完成回调
            refer: "", //开通完成后跳转至付费产品
            asset: {
                namespace_card_count: 0,
            },

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "11", //7|8|9三种产品
            count: 20,
            productDesc: "20个铭牌", //开通PRE/PRO+升级PRE到PRO
            returnUrl: callback("namespace"), //支付宝回调地址，当前页面

            // 其他
            position: window.innerWidth < 768 ? "top" : "left",
        };
    },
    computed: {
        // TODO:跳转到新铭牌注册页
        register_namespace_url: function () {
            return publishLink("namespace");
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
                this.asset = data;
            });
        },
        redirect: function () {
            if (this.refer) {
                location.href = this.refer;
            }
        },
        finish: function () {
            // location.reload();
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
@import "~@/assets/css/vip/namespace.less";
</style>
