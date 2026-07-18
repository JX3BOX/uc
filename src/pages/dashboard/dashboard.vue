<template>
    <CommonHeader :key="headerKey"></CommonHeader>
    <Breadcrumb :name="$t('dashboard.common.dashboard')" slug="dashboard" root="/dashboard" :crumbEnable="true">
        <template #logo>
            <img svg-inline src="@/assets/img/dashboard/logo.svg" />
        </template>
        <Info />
    </Breadcrumb>
    <LeftSidebar class="m-dashboard-left" :open="sidebarOpen">
        <Nav />
    </LeftSidebar>
    <button
        class="m-dashboard-sidebar-toggle"
        :class="{ 'is-open': sidebarOpen }"
        :title="sidebarOpen ? $t('vip.mall.collapseSidebar') : $t('vip.mall.expandSidebar')"
        type="button"
        @click.stop="toggleSidebar"
    >
        <el-icon><ArrowLeft v-if="sidebarOpen" /><ArrowRight v-else /></el-icon>
    </button>
    <Main :withoutRight="true" class="m-dashboard-container p-dashboard">
        <router-view />
    </Main>
</template>

<script>
import Info from "@/components/dashboard/Info.vue";
import Nav from "@/components/dashboard/Nav.vue";
import mitt from "@/utils/mitt";
export default {
    name: "dashboard",
    props: [],
    data: function () {
        return {
            headerKey: 0,
            sidebarOpen: window.innerWidth >= 1200,
        };
    },
    methods: {
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        closeSidebarState() {
            if (window.innerWidth < 1200) {
                this.sidebarOpen = false;
            }
        },
    },
    mounted() {
        document.addEventListener("click", this.closeSidebarState);
        mitt.on("refresh", () => {
            this.headerKey++;
        });
    },
    beforeUnmount() {
        document.removeEventListener("click", this.closeSidebarState);
    },
    components: {
        Info,
        Nav,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/app.less";
@import "~@/assets/css/dashboard/dashboard.less";
@import "~@/assets/css/miniprogram.less";
</style>
