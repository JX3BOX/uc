<template>
    <el-checkbox class="u-collapse" v-model="collection_collapse" :true-value="1" :fasle-value="0"
        >默认展开</el-checkbox
    >
</template>

<script>
export default {
    name: "PublishCollectionCollpase",
    props: ["data"],
    components: {},
    data: function () {
        return {
            collection_collapse: false,
        };
    },
    emits: ["update"],
    watch: {
        data: {
            immediate: true,
            handler(newval) {
                this.collection_collapse = newval;
            },
        },
        collection_collapse: {
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
};
</script>
