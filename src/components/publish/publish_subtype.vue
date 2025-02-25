<template>
    <div class="m-publish-subtype">
        <el-form-item label="类型">
            <el-radio-group v-model="subtype">
                <el-radio
                    v-for="(name, key) in subtypes"
                    :label="key"
                    border
                    :key="key"
                    :disabled="frozen && $route.params.id && subtype != key"
                >{{ name }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_subtype",
    props: ["data", "options", "lock"],
    data: function () {
        return {
            subtype: this.data,
            subtypes: this.options || [],
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.subtype = newval;
        },
        subtype: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        options: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.subtypes = newval;
                }
            },
        },
    },
    computed: {
        // 是否可以变更类型
        frozen: function () {
            return this.lock;
        },
    },
    methods: {},
    mounted: function () {},
    components: {},
};
</script>
