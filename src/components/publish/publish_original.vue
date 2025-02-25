<template>
    <div class="m-publish-original">
        <el-form-item label="原创">
            <el-switch v-model="original" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_original",
    props: ["data"],
    data: function () {
        return {
            original: ~~this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.original = ~~newval;
        },
        original: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", ~~newval);
            },
        },
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>
