<template>
    <div class="m-publish-extend">
        <el-form-item label="其它">
            <el-checkbox v-model="includeVideo" :true-value="1" :fasle-value="0">内含视频</el-checkbox>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "publish_extend",
    props: {
        post: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    emits: ["update"],
    data() {
        return {
            localPost: this.post,
        };
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
                this.localPost = val;
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
                this.$emit("update", next);
            },
        },
    },
};
</script>
