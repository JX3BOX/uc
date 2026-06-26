<template>
    <div class="p-mall">
        <CommonHeader :key="currentKey"></CommonHeader>
        <div class="m-mall-breadcrumb-container">
            <MallBreadcrumb></MallBreadcrumb>
        </div>
        <div class="m-vip-mall">
            <router-view v-slot="{ Component }">
                <keep-alive :include="['MallList']">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
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
<style lang="less">
html {
    font-size: calc(min(18px, (100vw / 414 * 16)));
}
.p-mall {
    font-size: 1rem;
}

.m-mall-breadcrumb-container {
    background: black;
    margin-top: 60px;
    height: 36px;
    position: sticky;
    top: 60px;
    z-index: 100;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        display: none;
    }
}

@media screen and (max-width: 750px) {
    .m-mall-breadcrumb-container {
        height: 2.75rem;
        position: static;
        top: auto;
        z-index: auto;
    }
}
</style>
