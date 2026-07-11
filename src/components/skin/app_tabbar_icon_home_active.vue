<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_home_active')"
        subtitle="sidebar / app_tabbar_icon_home_active"
        layout="tabbar"
        target-tab="home"
        active-tab="home"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconHomeActiveSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
