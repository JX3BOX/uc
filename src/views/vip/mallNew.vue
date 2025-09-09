<template>
    <div id="app">
        <Header :key="currentKey"></Header>
        <div class="m-mall-breadcrumb-container">
            <MallBreadcrumb></MallBreadcrumb>
        </div>
        <div class="m-vip-mall">
            <keep-alive :include="['MallList']"><router-view></router-view> </keep-alive>
        </div>
    </div>
</template>

<script>
import MallBreadcrumb from "@/views/vip/mallNew/components/MallBreadcrumb.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Mall",
    components: {
        MallBreadcrumb,
    },
    props: [],
    data: function () {
        return {
            keepAlive: false,
            currentKey: 0,
        };
    },
    methods: {},
    created: function () {
        if (User.isLogin()) {
            this.$store.dispatch("mallNew/getAsset").catch((err) => {
                this.$message.error("获取资产失败");
            });
            this.$store.dispatch("mallNew/getCart").catch((err) => {
                this.$message.error("获取购物车失败");
            });
        }
    },
};
</script>
<style lang="less" scoped>
.m-mall-breadcrumb-container {
    background: black;
    margin-top: 64px;
    height: 36px;
    position: sticky;
    top: 64px;
    z-index: 100;
}
</style>
