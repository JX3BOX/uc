<template>
    <div class="m-publish-wujie">
        <el-form-item label="适用">
            <el-checkbox :true-value="1" :fasle-value="0" v-model="visible">无界</el-checkbox>
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
    emits: ["update"],
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
};
</script>

<style scoped lang="less">
.m-publish-visible {
    .el-radio {
        .mb(0);
    }
}
</style>
