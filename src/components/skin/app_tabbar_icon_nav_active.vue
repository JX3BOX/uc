<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_nav_active')"
        subtitle="sidebar / app_tabbar_icon_nav_active"
        layout="tabbar"
        target-tab="nav"
        active-tab="nav"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconNavActiveSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
