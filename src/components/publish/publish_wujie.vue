<template>
    <div class="m-publish-wujie">
        <el-form-item :label="$t('publish.form.appliesTo')">
            <el-checkbox :true-value="1" :false-value="0" v-model="visible">{{ $t("publish.form.wujie") }}</el-checkbox>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "",
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
    components: {},
    data: function () {
        return {
            visible: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.visible = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.visible = newval;
            }
        },
        visible: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
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
