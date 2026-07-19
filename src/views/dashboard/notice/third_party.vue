<template>
    <div class="m-notice-third-party u-notice-box">
        <div class="u-notice-value">
            <span v-if="bound" class="u-value">***</span>
            <el-tag class="u-notice-status" :type="bound ? 'success' : 'info'">
                {{ bound ? $t("dashboard.common.bound") : $t("dashboard.common.unbound") }}
            </el-tag>
        </div>
        <el-button type="primary" size="large" icon="Connection" disabled>
            {{ $t("dashboard.notice.bind") }}
        </el-button>
    </div>
</template>

<script>
export default {
    name: "third-party-notice",
    props: {
        bound: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="less">
.m-notice-third-party {
    .flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .u-value {
        margin-right: 5px;
    }
}
</style>
