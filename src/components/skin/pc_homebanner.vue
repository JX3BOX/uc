<template>
    <SkinScenePreview
        :title="$t('dashboard.skin.scenes.pc_homebanner')"
        subtitle="homebg / pc_homebanner"
        layout="pcHomeBanner"
    />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "PcHomebannerSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
