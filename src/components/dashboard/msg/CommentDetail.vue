<template>
    <el-dialog class="m-comment-detail-dialog" v-model="show" :title="title" :before-close="close">
        <ContentSkeleton v-if="loading" variant="form" :rows="4" />
        <el-descriptions v-else class="m-msg-comment-detail" direction="vertical" :column="2" border>
            <el-descriptions-item :label="$t('dashboard.message.commentContent')" :span="2">
                <div v-html="renderContent || '-'"></div>
            </el-descriptions-item>
            <el-descriptions-item v-if="attachments.length" :label="$t('dashboard.message.commentAttachments')" :span="2">
                <el-image
                    v-for="(item, index) in attachments"
                    :key="index"
                    :src="resolveImagePath(item)"
                    :preview-src-list="[item]"
                ></el-image>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.message.commenter')">
                <div class="m-user" v-if="data.userId">
                    <a class="u-name" :href="authorLink(data.userId)" target="_blank">
                        <img class="u-avatar" :src="showAvatar(data.user_info?.avatar)" alt="" />
                        {{ data.user_info?.display_name }}
                    </a>
                    <!-- <span class="u-uid"> (UID:{{ data.userId }}) </span> -->
                </div>
                <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('dashboard.message.commentTime')">
                {{ formatDate(data.commentDate) }}
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>
<script>
import { getCommentMsgDetail } from "@/service/dashboard/msg.js";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { formatContent } from "@/utils/emotion";
const { authorLink, resolveImagePath, showAvatar } = require("@jx3box/jx3box-common/js/utils");
export default {
    name: "MsgCommentDetail",
    emits: ["close"],
    props: ["visible", "id"],
    data() {
        return {
            loading: false,
            data: {},
            attachments: [],
            renderContent: "",
        };
    },
    computed: {
        title() {
            return this.$t("dashboard.message.detailsTitle");
        },
    },
    watch: {
        visible: {
            handler: function (val) {
                this.show = val;
            },
            immediate: true,
        },
        id: {
            immediate: true,
            handler(id) {
                this.loading = true;
                getCommentMsgDetail(id)
                    .then((res) => {
                        this.data = res.data.data || {};
                        this.getImages(this.data.attachments);
                        this.formatContent(this.data.content);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
        },
    },
    methods: {
        async formatContent(str) {
            this.renderContent = await formatContent(str);
        },
        getImages(attachmentsStr) {
            try {
                this.attachments = JSON.parse(attachmentsStr);
            } catch {
                this.attachments = [];
            }
        },
        resolveImagePath(val) {
            return resolveImagePath(val) + "?x-oss-process=style/comment_thumb";
        },
        showAvatar,
        authorLink,
        formatDate: function (val) {
            return showTime(val);
        },
        close() {
            this.show = false;
            this.$emit("close");
        },
    },
};
</script>
<style lang="less">
.m-comment-detail-dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
}
.m-msg-comment-detail {
    .m-user,
    .u-name {
        .flex;
        gap: 5px;
        align-items: center;
        .color(var(--el-text-color-regular),var(--el-color-primary));
    }
    .u-avatar {
        .size(30px);
    }
    .u-uid {
        .fz(12px);
        color: #999;
        .flex;
        align-items: center;
        gap: 3px;
    }
    .u-copy {
        cursor: pointer;
    }
    .u-posts {
        white-space: pre-line;
    }
}
</style>
