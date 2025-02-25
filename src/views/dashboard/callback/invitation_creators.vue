<template>
    <div class="m-callback m-invitation-creators">
        <h1 class="u-title">
            <i class="el-icon-message"></i> 邀请
        </h1>
        <p class="u-desc">你收到了一条联合创作邀请。</p>
        <div class="u-post">
            <div class="u-post-avatar">
                <img :src="userdata.user_avatar | showAvatar" />
            </div>
            <div class="u-post-info">
                <a class="u-post-title" :href="data | postLink" target="_blank">{{data.post_title}}</a>
                <a class="u-post-desc" :href="uid | authorLink" target="_blank">
                    @
                    <b>{{userdata.display_name}}</b>
                    <time class="u-post-time">{{info.updated | dateFormat}}</time>
                </a>
            </div>
        </div>
        <div class="u-btns">
            <el-button
                type="primary"
                icon="el-icon-check"
                :disabled="isNotExist || alreadyAccept"
                @click="accept"
            >{{ alreadyAccept ? "已接受" : "接受" }}</el-button>
            <el-button type="info" icon="el-icon-close" @click="confirmQuit" :disabled="isNotExist">{{ alreadyAccept ? "退出联合创作" : "拒绝" }}</el-button>
        </div>
    </div>
</template>

<script>
import { Base64 } from "js-base64";
import {
    getPost,
    getUser,
    quitUnionPost,
    isExistPostInvitation,
    acceptPostInvitation,
} from "@/service/dashboard/callback.js";
import {
    getLink,
    showAvatar,
    authorLink,
} from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "CallbackCreators",
    props: [],
    components: {},
    data: function () {
        return {
            data: "",
            userdata: "",
            record: null,
        };
    },
    computed: {
        info: function () {
            return JSON.parse(
                Base64.decode(decodeURIComponent(this.$route.query.info))
            );
        },
        id: function () {
            return ~~this.info.source_id;
        },
        uid: function () {
            return this.data?.post_author;
        },
        isNotExist: function () {
            return !this.record;
        },
        alreadyAccept: function () {
            return !!(this.record && this.record.status);
        },
        post_link: function () {
            return getLink(this.data?.post_type, this.data?.ID);
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.loadData();
                    this.check();
                }
            },
        },
    },
    methods: {
        loadData: function () {
            getPost(this.id)
                .then((res) => {
                    this.data = res.data?.data;
                })
                .then(() => {
                    getUser(this.uid).then((res) => {
                        this.userdata = res.data?.data;
                    });
                });
        },
        confirmQuit: function() {
            this.$confirm("确定退出联合创作吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
                this.quit();
            })
            .catch(() => {});
        },
        quit: function () {
            quitUnionPost(this.id).then(() => {
                this.$message({
                    message: "操作成功",
                    type: "success",
                });
            });
            this.$router.push("/msg");
        },
        check: function () {
            isExistPostInvitation(this.id).then((res) => {
                this.record = res.data?.data;
            });
        },
        accept: function () {
            acceptPostInvitation(this.id).then((res) => {
                this.$message({
                    message: "操作成功",
                    type: "success",
                });
                location.href = this.post_link;
            });
        },
    },
    filters: {
        postLink: function (post) {
            return getLink(post.post_type, post.ID);
        },
        authorLink,
        showAvatar,
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
.m-invitation-creators {
    padding: 100px 0;
    max-width: 1280px;
    .auto(x);
    .u-title {
        font-weight: 400;
        i {
            .fz(38px);
            .y(-3px);
        }
        .x;
        // color: @primary;
    }
    .u-desc {
        .fz(24px);
        .x;
    }
    .u-post {
        display: flex;
        border: 1px solid #ddd;
        .r(6px);
        max-width: 800px;
        .auto(x);
        background-color: @bg-light;
    }
    .u-post-avatar {
        flex-shrink: 0;
        img {
            .size(68px);
            padding: 10px;
        }
    }
    .u-post-info {
        padding: 10px;
        flex-grow: 1;
        overflow: hidden;
    }
    .u-post-title {
        .fz(15px,2.5);
        .db;
        .bold;
        &:hover {
            text-decoration: underline;
            color: @pink;
        }
        .nobreak;
    }
    .u-post-desc {
        .fz(13px,2);
        .db;
        color: #555;
        &:hover {
            color: @pink;
        }
    }
    .u-post-time {
        .ml(10px);
        color: #888 !important;
    }
    .u-btns {
        .x;
        .mt(20px);
    }
}
</style>
