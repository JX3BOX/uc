<template>
    <div class="m-publish-box" v-loading="loading">
        <publish-header :name="`${getContent(data)}`"> </publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">回帖内容</el-divider>
                <Tinymce v-model="data.content" :attachmentEnable="true" :resourceEnable="true" />
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button type="primary" @click="onSubmit" :disabled="processing"
                    >更 &nbsp;&nbsp; 新</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import publish_header from "@/components/publish/publish_header.vue";
import { getMyReply, updateMyReply, getAdminReply, updateAdminReply } from "@/service/publish/community.js";
import { pick } from "lodash";
export default {
    name: "community_reply",
    components: {
        Tinymce,
        "publish-header": publish_header,
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
    },
    data() {
        return {
            data: {
                content: "",
            },
            loading: false,
            processing: false,

            from: ""
        };
    },
    watch: {
        $route: {
            immediate: true,
            deep: true,
            handler() {
                const from = this.$route.query?.from;
                if (from) {
                    this.from = from;
                }
                this.loadData();
            },
        },
    },
    methods: {
        loadData() {
            this.loading = true;
            const fn = this.from === "admin" ? getAdminReply : getMyReply;
            fn(this.id)
                .then((res) => {
                    this.data = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onSubmit() {
            this.processing = true;
            const data = pick(this.data, ["content"]);
            const fn = this.from === "admin" ? updateAdminReply : updateMyReply;
            fn(this.id, data)
                .then(() => {
                    this.$message({
                        message: "更新回帖成功",
                        type: "success",
                    });
                    setTimeout(() => {
                        location.href = `/community/${this.data?.topic_id}`;
                    }, 500);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        getContent(item) {
            const val = item?.topic?.title?.slice(0, 30);
            if (val) {
                return `回复：${val}`;
            }
            return "";
        }
    },
};
</script>

<style lang=""></style>
