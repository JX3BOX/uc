<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_nav')"
        subtitle="sidebar / app_tabbar_icon_nav"
        layout="tabbar"
        target-tab="nav"
        active-tab="home"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconNavSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
