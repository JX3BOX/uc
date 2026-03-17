<template>
    <CommonHeader :key="headerKey"></CommonHeader>
    <Breadcrumb name="个人中心" slug="dashboard" root="/dashboard" :crumbEnable="true">
        <template #logo>
            <img svg-inline src="@/assets/img/dashboard/logo.svg" />
        </template>
        <Info />
    </Breadcrumb>
    <LeftSidebar class="m-dashboard-left">
        <Nav />
    </LeftSidebar>
    <Main :withoutRight="true" class="m-dashboard-container">
        <router-view />
    </Main>
</template>

<script>
import Info from "@/components/dashboard/Info.vue";
import Nav from "@/components/dashboard/Nav.vue";
import checkLogin from "@/utils/checkLogin";
import mitt from "@/utils/mitt";
export default {
    name: "dashboard",
    props: [],
    data: function () {
        return {
            headerKey: 0,
        };
    },
    methods: {},
    created: function () {
        checkLogin();
    },
    mounted() {
        mitt.on("refresh", () => {
            this.headerKey++;
        });
    },
    components: {
        Info,
        Nav,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/dashboard.less";
@import "~@/assets/css/miniprogram.less";
</style>
