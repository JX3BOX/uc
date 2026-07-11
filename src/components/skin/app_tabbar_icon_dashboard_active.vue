<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_dashboard_active')"
        subtitle="sidebar / app_tabbar_icon_dashboard_active"
        layout="tabbar"
        target-tab="dashboard"
        active-tab="dashboard"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconDashboardActiveSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
