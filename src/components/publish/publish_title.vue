<template>
    <div class="m-publish-title">
        <el-divider content-position="left" v-if="!hideDiv">标题</el-divider>
        <el-input
            v-model="title"
            :maxlength="50"
            :minlength="2"
            show-word-limit
            required
            :placeholder="placeholder || '请填写标题'"
        ></el-input>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_title",
    props: ["data","hideDiv","placeholder"],
    data: function () {
        return {
            title: this.data,
        };
    },
    model: {
        prop: "data",   //向上同步数据
        event: "update",
    },
    watch: {
        data: function(newval) {
            this.title = newval;
        },
        title: {
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
