<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="订购会员" slug="vip" root="/vip/premium" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />
        </Breadcrumb>
        <Main class="m-vip-container" :withoutRight="true" :withoutLeft="true">
            <div class="m-vip-premium" v-if="!done">
                <simple-header title="升级您的账号" desc="Upgrade your account" />
                主体内容
            </div>
            <result class="m-vip-result" v-else>
                <div slot="title" class="m-premium-result-title">
                    成功标题
                </div>
                <div slot="desc" class="m-rename-result-desc">
                    成功描述
                </div>
            </result>
        </Main>
        <paypop v-if="will" v-model="dialog_visible" :productDesc="productDesc" :productId="productId" :returnUrl="returnUrl" @done="finish" />
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
            returnUrl: callback("premium"), //支付宝回调地址，当前页面
        };
    },
    computed: {},
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

<style lang="less">
// @import "../assets/css/premium.less";
</style>
