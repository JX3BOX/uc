<template>
    <el-dialog class="w-dialog m-wait-list-dialog" :visible.sync="show" title="待处理列表" @close="close">
        <div class="m-wait-list" v-loading="loading">
            <div class="u-item" v-for="(item, i) in waitList" :key="i">
                <div class="u-close" v-if="!item.status" @click.stop="onReject(item)">
                    <i class="el-icon-close"></i>
                </div>
                <a class="u-item-pic" :href="userLink(item)" target="_blank">
                    <img class="u-item-avatar" :src="getAvatar(item) | showAvatar" />
                </a>
                <a class="u-item-name" :href="userLink(item)" target="_blank">{{ getName(item) }}</a>
                <div class="u-action">
                    <span class="u-item-remark" v-if="!item.status">
                        <el-button v-if="list.length <= 1" size="mini" @click="onAccept(item)">接受</el-button>
                    </span>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div class="m-confirm">
                    <el-button @click="close">取消</el-button>
                </div>
            </div>
        </template>
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
    emits: ["close", "update"],
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
    filters: {
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
    },
    methods: {
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
            return item.user_info?.display_name || item.creator_info?.display_name;
        },
        onAccept(item) {
            this.$confirm(`是否接受 ${item.creator_info.display_name} 的邀请，成为ta的情缘？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
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
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
        onReject(item) {
            this.$confirm(`是否拒绝 ${item.creator_info.display_name} 的邀请？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = true;
                dealInvite(item.net_id, 2)
                    .then(() => {
                        this.$notify({
                            title: "拒绝成功",
                            type: "success",
                        });
                        this.$emit("refresh", "loadWaitInvites");
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
    },
};
</script>

<style lang="less">
.m-wait-list-dialog {
    .m-wait-list {
        .flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;

        .u-item {
            position: relative;
            .r(3px);
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            margin: 0 10px 10px 0;
            padding: 40px 10px;
            width: 200px;
            height: 251px;
            box-sizing: border-box;
            .u-action {
                position: absolute;
                bottom: 20px;
                .flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            .x;
            .u-item-pic {
                .dbi;
                .x;
                .pr;
                .auto(x);
                .size(68px);
                transition: 0.2s ease-in-out;
                &:hover {
                    filter: saturate(120%) brightness(110%);
                }
            }
            .u-item-avatar {
                .r(100%);
            }
            .u-item-status {
                .pa;
                .lt(50%, 50%);
                transform: translate(-50%, -50%);
                margin-top: -5px;
                margin-left: -5px;
            }

            overflow: hidden;
            .u-item-name {
                .nobreak;
                .fz(14px, 2.5);
                .bold;
                .x;
                .db;
                &:hover {
                    color: @pink;
                }
            }
            .u-item-remark {
                .x;
                .fz(12px, 2);
                color: #888;
                .db;
                &.u-exit {
                    cursor: pointer;
                    &:hover {
                        color: @primary;
                    }
                }
            }
            .u-item-btns {
                .x;
                .mt(10px);
            }
            .u-close {
                .none;
                position: absolute;
                top: 0;
                right: 0;
                padding: 10px;
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
            &:hover {
                .u-close {
                    .dbi;
                }
            }
        }
    }
}
</style>
