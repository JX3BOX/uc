<template>
    <div id="app">
        <Header :key="currentKey"></Header>
        <Breadcrumb
            name="积分商城"
            slug="mall"
            root="/vip/mall"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
        >
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />

            <el-badge
                slot="op-append"
                v-show="showCart"
                id="shopCart"
                class="u-cart"
                :class="!isLogin ? 'is-disabled' : ''"
                :value="cartNum"
                :max="99"
                :hidden="!cartNum"
            >
                <i class="el-icon-shopping-cart-full u-icon" @click="openCart"></i>
            </el-badge>
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main class="m-vip-container" :withoutRight="true">
            <div class="m-vip-mall">
                <template v-if="$route.meta.keepAlive">
                    <keep-alive><router-view></router-view> </keep-alive>
                </template>
                <router-view v-else></router-view>
            </div>
            <Footer></Footer>
        </Main>
        <Cart v-if="cartVisible"></Cart>
    </div>
</template>

<script>
import Nav from "@/views/vip/mall/components/Nav.vue";
import Cart from "@/views/vip/mall/Cart";
import { setUserMeta, getConfig } from "@/service/vip/cms";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Mall",
    components: {
        Nav,
        Cart,
    },
    props: [],
    data: function () {
        return {
            currentKey: 0,
        };
    },
    computed: {
        fullPath() {
            return this.$route.fullPath;
        },
        cartVisible() {
            return this.$store.state.mall.cartVisible;
        },
        isLogin() {
            return User.isLogin();
        },
        cartNum() {
            return this.$store.getters["mall/cartNum"];
        },
        showCart() {
            return this.$route.name !== "mall_batch_order";
        },
    },
    methods: {
        openCart() {
            if (this.isLogin) {
                this.$store.commit("mall/SET_STATE", {
                    key: "cartVisible",
                    value: true,
                });
            }
        },
        getBoundCart() {
            var eleCart = document.querySelector("#shopCart");
            const boundCart = eleCart.getBoundingClientRect();
            this.$store.commit("mall/SET_STATE", {
                key: "boundCart",
                value: boundCart,
            });
        },
    },
    watch: {
        fullPath: {
            immediate: true,
            handler() {
                if (this.isLogin) {
                    this.$store.dispatch("mall/getCart");
                }
            },
        },
    },
    mounted: function () {
        if (this.isLogin) {
            this.$nextTick(async () => {
                await setUserMeta("mall_pop", { val: 0 });
                let config = await getConfig({ key: "mall" });
                localStorage.setItem("mall_pop", config.val);

                this.currentKey++;
            });
        }

        // this.$store.dispatch("mall/getSkinJson");

        this.getBoundCart();
        const self = this;
        window.onresize = function () {
            self.getBoundCart();
        };
    },
};
</script>
<style lang="less">
@import "~@/assets/css/vip/event.less";
</style>
