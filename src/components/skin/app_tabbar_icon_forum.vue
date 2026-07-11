<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_forum')"
        subtitle="sidebar / app_tabbar_icon_forum"
        layout="tabbar"
        target-tab="forum"
        active-tab="home"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconForumSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
