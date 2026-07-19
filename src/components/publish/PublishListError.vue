<template>
    <div class="m-publish-list-error" role="alert" aria-live="polite">
        <el-alert
            :title="$t('publish.message.requestFailed')"
            type="error"
            center
            show-icon
            :closable="false"
        />
        <el-button type="primary" plain icon="RefreshRight" @click="$emit('retry')">
            {{ $t("publish.message.retry") }}
        </el-button>
    </div>
</template>

<script>
export default {
    name: "PublishListError",
    emits: ["retry"],
};
</script>

<style scoped lang="less">
.m-publish-list-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px 20px;

    .el-alert {
        max-width: 480px;
    }
}
</style>
