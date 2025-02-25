<template>
    <div id="app">
        <Header :key="headerKey" ></Header>
        <Breadcrumb name="个人中心" slug="dashboard" root="/dashboard" :crumbEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/dashboard/logo.svg" />
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main :withoutRight="true" class="m-dashboard-container">
            <router-view />
        </Main>
    </div>
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
</style>
