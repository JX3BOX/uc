<template>
    <div class="m-callback m-invitation-creators">
        <h1 class="u-title"><i class="el-icon-message"></i> {{ $t("dashboard.invitationCallback.title") }}</h1>
        <p class="u-desc">{{ $t("dashboard.invitationCallback.coCreationReceived") }}</p>
        <div class="u-post">
            <div class="u-post-avatar">
                <img :src="showAvatar(userdata.user_avatar)" />
            </div>
            <div class="u-post-info">
                <a class="u-post-title" :href="postLink(data)" target="_blank">{{ data.post_title }}</a>
                <a class="u-post-desc" :href="authorLink(uid)" target="_blank">
                    @
                    <b>{{ userdata.display_name }}</b>
                    <time class="u-post-time">{{ dateFormat(info.updated) }}</time>
                </a>
            </div>
        </div>
        <div class="u-btns">
            <el-button type="primary" icon="el-icon-check" :disabled="isNotExist || alreadyAccept" @click="accept">{{
                alreadyAccept ? $t("dashboard.common.accepted") : $t("dashboard.common.accept")
            }}</el-button>
            <el-button type="info" icon="el-icon-close" @click="confirmQuit" :disabled="isNotExist">{{
                alreadyAccept ? $t("dashboard.invitationCallback.leaveCoCreation") : $t("dashboard.common.reject")
            }}</el-button>
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
import { getLink, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
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
            return JSON.parse(Base64.decode(decodeURIComponent(this.$route.query.info)));
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
        confirmQuit: function () {
            this.$confirm(this.$t("dashboard.invitationCallback.leaveConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
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
                    message: this.$t("dashboard.common.operationSuccess"),
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
                    message: this.$t("dashboard.common.operationSuccess"),
                    type: "success",
                });
                location.href = this.post_link;
            });
        },
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
