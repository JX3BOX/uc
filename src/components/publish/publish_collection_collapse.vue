<template>
    <el-checkbox class="u-collapse" v-model="collection_collapse" :true-value="1" :fasle-value="0"
        >默认展开</el-checkbox
    >
</template>

<script>
export default {
    name: "PublishCollectionCollpase",
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: undefined,
        },
        data: {
            type: [String, Number, Boolean],
            default: 0,
        },
    },
    components: {},
    data: function () {
        return {
            collection_collapse: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: {
            immediate: true,
            handler(newval) {
                if (newval !== undefined) {
                    this.collection_collapse = newval;
                }
            },
        },
        data: {
            immediate: true,
            handler(newval) {
                if (this.modelValue === undefined) {
                    this.collection_collapse = newval;
                }
            },
        },
        collection_collapse: {
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
    },
};
</script>
