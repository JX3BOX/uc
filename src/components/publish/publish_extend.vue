<template>
    <div class="m-publish-extend">
        <el-form-item :label="$t('publish.common.other')">
            <el-checkbox v-model="includeVideo" :true-value="1" :fasle-value="0">{{ $t("publish.form.containsVideo") }}</el-checkbox>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "publish_extend",
    props: {
        modelValue: {
            type: Object,
            default: undefined,
        },
        post: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    emits: ["update", "update:modelValue"],
    data() {
        return {
            localPost: this.modelValue !== undefined ? this.modelValue : this.post,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
                this.localPost = val;
            },
        },
        post: {
            immediate: true,
            deep: true,
            handler(val) {
                if (this.modelValue === undefined && val) {
                    this.localPost = val;
                }
            },
        },
    },
    computed: {
        includeVideo: {
            get() {
                return this.localPost?.include_video;
            },
            set(val) {
                const next = { ...(this.localPost || {}), include_video: val };
                this.localPost = next;
                this.$emit("update:modelValue", next);
                this.$emit("update", next);
            },
        },
    },
};
</script>
