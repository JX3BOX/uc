<template>
    <SkinScenePreview :title="$t('dashboard.skin.scenes.pc_homebg')" subtitle="homebg / pc_homebg" layout="pcHomeBg" />
</template>

<script>
import SkinScenePreview from "./SkinScenePreview.vue";

export default {
    name: "PcHomebgSkinScene",
    components: {
        SkinScenePreview,
    },
};
</script>
