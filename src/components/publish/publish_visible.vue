<template>
    <div class="m-publish-visible">
        <el-form-item :label="$t('publish.form.visibility')">
            <el-radio-group v-model="visible">
                <el-radio value="0">{{ $t("publish.visibility.public") }}</el-radio>
                <el-radio value="1" :disabled="disabled">{{ $t("publish.visibility.private") }}</el-radio>
                <el-radio value="2" :disabled="disabled">{{ $t("publish.visibility.friends") }}</el-radio>
                <el-radio value="3" disabled>{{ $t("publish.visibility.password") }}</el-radio>
                <el-radio value="4" disabled>{{ $t("publish.visibility.paid") }}</el-radio>
                <el-radio value="5" :disabled="disabled">{{ $t("publish.visibility.followers") }}</el-radio>
            </el-radio-group>
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
            default: "0",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    components: {},
    data: function () {
        return {
            visible:
                this.modelValue !== undefined ? String(this.modelValue) : String(this.data ?? "0"),
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.visible = String(newval);
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.visible = String(newval);
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
