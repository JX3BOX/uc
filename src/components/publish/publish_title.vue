<template>
    <div class="m-publish-title">
        <el-divider content-position="left" v-if="!hideDiv">标题</el-divider>
        <el-input
            v-model="title"
            :maxlength="50"
            :minlength="2"
            show-word-limit
            required
            size="large"
            :placeholder="placeholder || '请填写标题'"
        ></el-input>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_title",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "",
        },
        hideDiv: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            title: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.title = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.title = newval;
            }
        },
        title: {
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
