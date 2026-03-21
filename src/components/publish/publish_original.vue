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
            original: ~~(this.modelValue !== undefined ? this.modelValue : this.data),
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.original = ~~newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.original = ~~newval;
            }
        },
        original: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", ~~newval);
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
