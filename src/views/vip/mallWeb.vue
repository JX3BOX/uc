<template>
    <div id="app">
        <div style="height: 9.6vw">
            <!-- 这个放这里干啥的？ -->
            <Header :key="currentKey" style="display: none"></Header>
            <Breadcrumb></Breadcrumb>
        </div>
        <div v-if="isSky" class="sky"></div>
        <keep-alive include="Index"><router-view></router-view> </keep-alive>
        <div class="cart" @click="$router.push('/mallWeb/cart')" v-if="$route.path !== '/mallWeb/cart'">
            <img :src="imgUrl + '购物车.svg'" alt="" id="cartBtn" />
        </div>
    </div>
</template>

<script>
import Breadcrumb from "@/views/vip/mallWeb/components/Breadcrumb.vue";
export default {
    name: "mallWeb",
    data() {
        return {
            currentKey: 0,
            imgUrl: "https://cdn.jx3box.com/design/mall/",
        };
    },
    components: {
        Breadcrumb,
    },
    computed: {
        isSky() {
            return this.$store.state.mallNew.assetIsShow || this.$store.state.mallNew.navIsShow;
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
.sky {
    width: 100%;
    height: calc(100vh - 9.6vw);
    background: #808080;
    position: fixed;
    top: 9.6vw;
    left: 0;
    z-index: 1000;
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
</style>
