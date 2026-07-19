<template>
    <div class="m-publish-tags">
        <el-form-item :label="label || $t('publish.common.tags')">
            <template v-if="tags && tags.length">
                <el-checkbox-group v-model="tag">
                    <el-checkbox v-for="item in tags" :value="item" :key="item">{{ optionLabel(item) }}</el-checkbox>
                </el-checkbox-group>
            </template>
            <span v-else>{{ $t("publish.common.none") }}</span>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_tags",
    props: {
        modelValue: {
            type: Array,
            default: undefined,
        },
        data: {
            type: Array,
            default: () => [],
        },
        options: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            tag: (this.modelValue !== undefined ? this.modelValue : this.data) || [],
            tags: this.options || [],
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: {
            deep: true,
            handler: function (newval) {
                if (newval !== undefined) {
                    this.tag = newval || [];
                }
            },
        },
        data: {
            deep: true,
            handler: function (newval) {
                if (this.modelValue === undefined) {
                    this.tag = newval || [];
                }
            },
        },
        tag: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        options: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.tags = newval;
                }
            },
        },
    },
    computed: {},
    methods: {
        optionLabel(item) {
            const key = {
                抓马: "horseCatching",
                宠物: "pets",
                奇遇: "adventures",
                浪客行: "wanderer",
                体服: "testServer",
                其它: "other",
                其他: "other",
            }[item];
            return key ? this.$t(`publish.optionLabels.${key}`) : item;
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
.m-publish-tags {
    .mb(10px);
}
</style>
