<template>
    <div id="app">
        <Header :key="currentKey"></Header>
        <Main :withoutRight="true" :withoutLeft="true">
            <div class="m-premium-container">
                <img class="u-vip-title" src="@/assets/img/vip/vip2/title.png" alt="" srcset="" />
                <div class="m-premium">
                    <!-- 左侧 -->
                    <Premium :data="premiumData" />
                    <!-- 中间 -->
                    <div class="m-premium-buy"><Buy @done="finish" /></div>
                    <!-- 右侧 -->
                    <Privilege />
                </div>
            </div>
        </Main>
        <Footer></Footer>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Privilege from "./components/privilege.vue";
import Buy from "./components/buy.vue";
import Premium from "./components/premium.vue";

import { showDate } from "@jx3box/jx3box-common/js/moment";
import { checkIsTeammate } from "@/service/vip/premium.js";
import { setUserMeta, getConfig } from "@/service/vip/cms";
export default {
    data: function () {
        return {
            done: false,
            currentKey: 0,
            // 资产与权限
            isLogin: User.isLogin(),
            asset: {
                pro_expire_date: "",
                pro_total_day: 0,
                was_pro: 0,
            },

            is_teammate: false,
        };
    },
    components: {
        Privilege,
        Premium,
        Buy,
    },
    computed: {
        premiumData() {
            return {
                isLogin: this.isLogin,
                expireDate: this.asset.pro_expire_date ? showDate(this.asset.pro_expire_date) : "",
                isTeammate: this.is_teammate,
            };
        },
    },
    methods: {
        showDate,
        async loadAsset() {
            const data = await User.getAsset();
            this.asset = data;
        },
        goBack() {
            this.done = false;
        },
        finish() {
            this.$notify.success({
                title: "支付成功",
                message: "已成功开通魔盒会员",
            });
            this.loadAsset().then(() => {
                this.done = true;
                // this.redirect();
            });
        },
        checkIsTeammate() {
            if (User.isLogin()) {
                checkIsTeammate().then((res) => {
                    this.is_teammate = res.data.data;
                });
            }
        },
    },
    mounted: async function () {
        this.isLogin && this.loadAsset();

        this.checkIsTeammate();

        if (User.isLogin()) {
            this.$nextTick(async () => {
                await setUserMeta("vip_pop", { val: 0 });
                let config = await getConfig({ key: "vip" });
                localStorage.setItem("vip_pop", config.val);

                this.currentKey++;
            });
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/premium.less";
</style>
