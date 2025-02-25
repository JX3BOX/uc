<template>
    <div class="m-publish-excerpt">
        <el-input
            v-model="excerpt"
            :maxlength="200"
            show-word-limit
            type="textarea"
            placeholder="摘要信息"
        ></el-input>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_excerpt",
    props: ["data"],
    data: function () {
        return {
            excerpt: this.data,
        };
    },
    model: {
        prop: "data",   //向上同步数据
        event: "update",
    },
    watch: {
        data: function(newval) {
            this.excerpt = newval;
        },
        excerpt: {
            deep: true,
            handler: function(newval) {
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
    .m-publish-excerpt{
        .mb(10px);
    }
</style>