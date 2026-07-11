<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.app_tabbar_icon_forum_active')"
        subtitle="sidebar / app_tabbar_icon_forum_active"
        layout="tabbar"
        target-tab="forum"
        active-tab="forum"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "AppTabbarIconForumActiveSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
