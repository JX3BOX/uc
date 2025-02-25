<template>
    <div class="m-publish-extend">
        <el-form-item label="其它">
            <el-checkbox v-model="post.include_video" :true-label="1" :false-label="0">内含视频</el-checkbox>
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
    model: {
        prop: "post",
        event: "update",
    },
    data() {
        return {};
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
            },
        },
    },
}
</script>
