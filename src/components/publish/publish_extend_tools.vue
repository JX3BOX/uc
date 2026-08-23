<template>
    <div class="m-publish-extend-tools">
        <a
            v-if="canUseFilterTest"
            class="u-extend-tool"
            href="/dashboard/filter"
            target="_blank"
            rel="noopener noreferrer"
        >
            <el-icon class="u-tool-icon"><Search /></el-icon>
            <span>{{ $t("publish.form.filterTest") }}</span>
            <span class="u-tool-arrow">→</span>
        </a>
        <a class="u-extend-tool" href="/ai/editor" target="_blank" rel="noopener noreferrer">
            <el-icon class="u-tool-icon"><Cellphone /></el-icon>
            <span>{{ $t("publish.form.mobileUiCheck") }}</span>
            <span class="u-tool-arrow">→</span>
        </a>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";

export default {
    name: "PublishExtendTools",
    computed: {
        profile() {
            return this.$store.state.profile;
        },
        canUseFilterTest() {
            return User.getLevel(this.profile?.experience || 0) >= 4;
        },
    },
};
</script>
