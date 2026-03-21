<template>
    <div class="m-publish-comment">
        <el-form-item label="评论开关">
            <el-switch v-model="comment" active-color="#13ce66" :active-value="0" :inactive-value="1"></el-switch>
        </el-form-item>
        <div class="m-comment-extend">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "publish_comment",
    props: {
        modelValue: {
            type: [String, Number],
            default: undefined,
        },
        data: {
            type: [String, Number],
            default: 0,
        },
    },
    data: function () {
        return {
            comment: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.comment = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.comment = newval;
            }
        },
        comment: {
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

<style lang="less" scoped>
.m-publish-comment {
    .flex;
    align-items: center;
    gap: 20px;
}
.m-comment-extend {
    margin-bottom: 22px;
}
</style>
