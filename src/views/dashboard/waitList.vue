<template>
    <el-dialog class="w-dialog m-wait-list-dialog" v-model="show" width="560px" title="待处理列表" @close="close">
        <div class="m-wait-list" v-loading="loading">
            <div class="u-wait-intro">
                <span class="u-intro-tag">情缘申请</span>
                <h3>待处理列表</h3>
                <p>处理来自其他用户的情缘邀请。接受后将建立情缘关系，拒绝后该申请会从列表移除。</p>
            </div>
            <div class="u-empty" v-if="!waitList.length">
                <el-empty description="暂无待处理申请"></el-empty>
            </div>
            <div class="u-list" v-else>
                <div class="u-item" v-for="(item, i) in waitList" :key="item.id || item.net_id || i">
                    <a class="u-item-pic" :href="userLink(item)" target="_blank">
                        <img class="u-item-avatar" :src="showAvatar(getAvatar(item))" />
                    </a>
                    <div class="u-item-info">
                        <a class="u-item-name" :href="userLink(item)" target="_blank">{{ getName(item) }}</a>
                        <span class="u-item-desc">邀请你成为情缘</span>
                    </div>
                    <div class="u-action" v-if="!item.status">
                        <el-button v-if="list.length <= 1" @click="onAccept(item)" type="primary">接受</el-button>
                        <el-button @click="onReject(item)">拒绝</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { dealInvite } from "@/service/dashboard/relation.js";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "inviteUser",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        waitList: {
            type: Array,
            default: () => [],
        },
        list: {
            type: Array,
            default: () => [],
        },
    },
    emits: ["close", "update", "refresh"],
    data() {
        return {
            loading: false,
            show: false,
        };
    },
    computed: {},
    watch: {
        visible: {
            immediate: true,
            handler(bol) {
                this.show = bol;
            },
        },
    },
    methods: {
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
        close() {
            this.show = false;
            this.$emit("close", false);
        },
        // 用户链接
        userLink(item) {
            const id = item.initiator_id || item.creator_info?.id;
            return authorLink(id);
        },
        getAvatar(item) {
            return item.user_info?.avatar || item.creator_info?.avatar;
        },
        getName(item) {
            return item.user_info?.display_name || item.creator_info?.display_name || "该用户";
        },
        handleRequestError(err) {
            const data = err?.response?.data;
            const message = data?.msg || data?.message || err?.message || "操作失败，请稍后再试";
            this.$notify({
                title: "操作失败",
                message,
                type: "error",
            });
        },
        onAccept(item) {
            this.$confirm(`是否接受 ${this.getName(item)} 的邀请，成为ta的情缘？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;
                    dealInvite(item.net_id, 1)
                        .then(() => {
                            this.$notify({
                                title: "接受成功",
                                type: "success",
                            });
                            this.close();
                            this.$emit("refresh", "loadWaitInvites");
                            this.$emit("refresh", "loadRelationNetMembersByType");
                        })
                        .catch((err) => this.handleRequestError(err))
                        .finally(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },
        onReject(item) {
            this.$confirm(`是否拒绝 ${this.getName(item)} 的邀请？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;
                    dealInvite(item.net_id, 2)
                        .then(() => {
                            this.$notify({
                                title: "拒绝成功",
                                type: "success",
                            });
                            this.close();
                            this.$emit("refresh", "loadWaitInvites");
                        })
                        .catch((err) => this.handleRequestError(err))
                        .finally(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less">
.m-wait-list-dialog {
    .el-dialog {
        border-radius: 24px;
        overflow: hidden;
    }

    .el-dialog__headerbtn {
        .flex(o);
    }

    .el-dialog__body {
        padding: 18px 24px 24px;
    }

    .m-wait-list {
        .flex;
        flex-direction: column;
        gap: 16px;
    }

    .u-wait-intro {
        padding: 18px;
        border: 1px solid fade(@v4primary, 8%);
        border-radius: 18px;
        background: linear-gradient(180deg, fade(@v4primary, 6%) 0%, #ffffff 100%);

        .u-intro-tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 10px;
            border-radius: 999px;
            background: fade(@v4primary, 10%);
            color: @v4primary;
            font-size: 12px;
            font-weight: 700;
        }

        h3 {
            margin: 12px 0 6px;
            color: #1f2d3d;
            font-size: 22px;
            line-height: 1.3;
        }

        p {
            margin: 0;
            color: #7b8794;
            font-size: 14px;
            line-height: 1.7;
        }
    }

    .u-list {
        .flex;
        flex-direction: column;
        gap: 10px;
    }

    .u-item {
        .flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid fade(@v4primary, 16%);
        box-shadow: 0 10px 24px fade(@v4primary, 8%);
        box-sizing: border-box;

        .u-item-pic {
            .flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            .size(52px);
            border-radius: 14px;
            overflow: hidden;
            background-color: #f7f9fc;
            &:hover {
                filter: saturate(120%) brightness(110%);
            }
        }

        .u-item-avatar {
            .size(52px);
            border-radius: 14px;
        }

        .u-item-info {
            .flex;
            flex: 1;
            min-width: 0;
            flex-direction: column;
            gap: 2px;
        }

        .u-item-name {
            .nobreak;
            .fz(15px, 24px);
            .bold;
            color: @v4primary;
            &:hover {
                color: @pink;
            }
        }

        .u-item-desc {
            .fz(13px, 20px);
            color: #7b8794;
        }

        .u-action {
            .flex;
            gap: 8px;
            flex-shrink: 0;
        }
    }

    .u-empty {
        padding: 8px 0 0;
    }
}

@media screen and (max-width: @phone) {
    .m-wait-list-dialog {
        .el-dialog {
            width: 95% !important;
        }

        .el-dialog__body {
            padding: 16px;
        }

        .u-item {
            align-items: flex-start;
            flex-wrap: wrap;

            .u-action {
                width: 100%;
                justify-content: flex-end;
            }
        }
    }
}
</style>
