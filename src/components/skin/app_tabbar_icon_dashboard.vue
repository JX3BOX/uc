<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_dashboard')"
        subtitle="sidebar / app_tabbar_icon_dashboard"
        layout="tabbar"
        target-tab="dashboard"
        active-tab="home"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconDashboardSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
