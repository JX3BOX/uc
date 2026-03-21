<template>
    <div class="m-publish-comment">
        <el-form-item label="礼物开关">
            <el-switch v-model="allow_gift" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_gift",
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
            allow_gift: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.allow_gift = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.allow_gift = newval;
            }
        },
        allow_gift: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
    },
};
</script>
