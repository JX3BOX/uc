<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_home')"
        subtitle="sidebar / app_tabbar_icon_home"
        layout="tabbar"
        target-tab="home"
        active-tab="nav"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconHomeSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
