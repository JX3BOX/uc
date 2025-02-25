<template>
    <div class="m-publish-wujie">
        <el-form-item label="适用">
            <el-checkbox :true-label="1" :false-label="0" v-model="visible">无界</el-checkbox>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "",
    props: ["data"],
    components: {},
    data: function () {
        return {
            visible: 0,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.visible = newval;
        },
        visible: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
    .m-publish-visible{
        .el-radio{
            .mb(0);
        }
    }
</style>
