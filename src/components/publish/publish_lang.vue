<template>
    <div class="m-publish-lang">
        <el-form-item label="语言">
            <el-radio-group v-model="lang">
                <el-radio value="cn">简体中文</el-radio>
                <el-radio value="tr">繁體中文</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_lang",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "cn",
        },
    },
    data: function () {
        return {
            lang: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.lang = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.lang = newval;
            }
        },
        lang: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
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
