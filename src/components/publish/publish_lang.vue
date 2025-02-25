<template>
    <div class="m-publish-lang">
        <el-form-item label="语言">
            <el-radio-group v-model="lang">
                <el-radio label="cn">简体中文</el-radio>
                <el-radio label="tr">繁體中文</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_lang",
    props: ["data"],
    data: function () {
        return {
            lang: this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.lang = newval;
        },
        lang: {
            deep: true,
            handler: function (newval) {
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
