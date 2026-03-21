<template>
    <div class="m-publish-excerpt">
        <el-input v-model="excerpt" :maxlength="200" show-word-limit type="textarea" placeholder="摘要信息"></el-input>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_excerpt",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            excerpt: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.excerpt = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.excerpt = newval;
            }
        },
        excerpt: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
.m-publish-excerpt {
    .mb(10px);
}
</style>
