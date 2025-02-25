<template>
    <div class="m-callback m-invitation-kith">
        <h1 class="u-title">
            <i class="el-icon-message"></i> 邀请
        </h1>
        <p class="u-desc">你收到了一条亲友邀请。</p>
        <div class="u-post">
            <div class="u-post-avatar">
                <img :src="userdata.user_avatar | showAvatar" />
            </div>
            <div class="u-post-info">
                <a
                    class="u-post-title"
                    :href="uid | authorLink"
                    target="_blank"
                >{{userdata.display_name}}</a>
                <div class="u-post-desc">
                    <i class="el-icon-date"></i>
                    <time class="u-post-time">{{info.updated | dateFormat}}</time>
                </div>
            </div>
        </div>
        <div class="u-btns">
            <el-button
                type="primary"
                icon="el-icon-check"
                :disabled="alreadyAccept"
                @click="accept"
            >{{ alreadyAccept ? "已接受" : "接受" }}</el-button>
            <el-button type="info" icon="el-icon-close" @click="confirmQuit" :disabled="alreadyAccept">{{ alreadyAccept ? "解除亲友关系" : "拒绝" }}</el-button>
        </div>
    </div>
</template>

<script>
import { Base64 } from "js-base64";
import {
    getUser,
    isExistKithInvitation,
    refuseKithInvitation,
    acceptKithInvitation,
} from "@/service/dashboard/callback.js";
import {
    getLink,
    showAvatar,
    authorLink,
} from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "InvitationKith",
    props: [],
    components: {},
    data: function () {
        return {
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
        uid: function () {
            return this.info?.source_id;
        },
        isNotExist: function () {
            return !this.record;
        },
        alreadyAccept: function () {
            return !!(this.record && this.record.status);
        },
    },
    watch: {
        uid: {
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
            getUser(this.uid).then((res) => {
                this.userdata = res.data?.data;
            });
        },
        check: function () {
            isExistKithInvitation(this.uid).then((res) => {
                this.record = res.data?.data;
            });
        },
        confirmQuit: function() {
            this.$confirm("确定解除亲友关系吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
                this.refuse();
            })
            .catch(() => {});
        },
        refuse: function () {
            refuseKithInvitation(this.uid).then(() => {
                this.$message({
                    message: "操作成功",
                    type: "success",
                });
            });
            this.$router.push("/privacy?tab=whitelist");
        },
        accept: function () {
            acceptKithInvitation(this.uid).then((res) => {
                this.$message({
                    message: "操作成功",
                    type: "success",
                });
                this.$router.push("/privacy?tab=whitelist");
            });
        },
    },
    filters: {
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
.m-invitation-kith {
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
