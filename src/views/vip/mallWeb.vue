<template>
    <div id="app">
        <div class="m-mall-web-header">
            <Header :key="currentKey"></Header>
            <Breadcrumb></Breadcrumb>
        </div>
        <div
            v-if="isSky"
            class="u-mark u-sky"
            @click="$store.commit('mallNew/toState', { assetIsShow: !$store.state.mallNew.assetIsShow })"
        ></div>
        <div v-if="isNavShow" class="u-mark" @click="$store.commit('mallNew/toState', { navIsShow: false })"></div>

        <keep-alive include="Index"><router-view></router-view> </keep-alive>

        <div class="cart" @click="$router.push('/mallWeb/cart')" v-if="$route.path !== '/mallWeb/cart'">
            <img :src="imgUrl + 'cart.svg'" alt="" id="cartBtn" />
        </div>
    </div>
</template>

<script>
import Breadcrumb from "@/views/vip/mallWeb/components/Breadcrumb.vue";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "mallWeb",
    data() {
        return {
            currentKey: 0,
            imgUrl: __cdn + "design/mall/",
        };
    },
    components: {
        Breadcrumb,
    },
    computed: {
        isSky() {
            return this.$store.state.mallNew.assetIsShow;
        },
        isNavShow() {
            return this.$store.state.mallNew.navIsShow;
        },
    },
    created() {
        this.$store.dispatch("mallNew/getAsset").catch((err) => {
            this.$message.error("获取资产失败");
        });
        this.$store.dispatch("mallNew/getCart").catch((err) => {
            this.$message.error("获取购物车失败");
        });
    },
};
</script>

<style lang="less" scoped>
.m-mall-web-header {
    height: calc(64px + 9.6vw);
}
.u-mark {
    width: 100%;
    height: calc(100vh - 64px - 9.6vw);
    position: fixed;
    top: calc(64px + 9.6vw);
    left: 0;
    z-index: 50;
    &.u-sky {
        background: #808080;
    }
}
.cart {
    width: 17.0667vw;
    height: 17.0667vw;
    background: rgba(255, 163, 43, 1);
    border-radius: 50%;
    position: fixed;
    bottom: 3.2vw;
    left: 3.2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 8vw;
        height: 8vw;
    }
}
.no-click {
    .full;
}
</style>
