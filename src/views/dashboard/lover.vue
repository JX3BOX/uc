<template>
    <div class="m-privacy-lover">
        <div class="u-lover-panel">
            <div class="u-lover-header">
                <div class="u-lover-heading">
                    <b>{{ relationActiveName || "我的情缘" }}</b>
                    <span>{{ statusText }}</span>
                </div>
                <div class="u-lover-actions">
                    <el-button v-if="canInvite" type="primary" @click="toAdd">邀请绑定</el-button>
                </div>
            </div>

            <div class="m-members">
                <div class="m-wrapper">
                    <div class="u-lover-card" v-if="myLover.id" :class="{ 'is-bound': isBound, 'is-pending': isPending }">
                        <div class="u-lover-user">
                            <a class="u-item-pic" :href="userLink(myLover)" target="_blank">
                                <img class="u-item-avatar" :src="showAvatar(getAvatar(myLover))" />
                            </a>
                            <div class="u-lover-info">
                                <span class="u-item-label">{{ isPending ? "待确认" : "当前情缘" }}</span>
                                <a class="u-item-name" :href="userLink(myLover)" target="_blank">{{ getName(myLover) }}</a>
                            </div>
                        </div>
                        <div class="u-lover-meta">
                            <div class="u-div-icon"><i class="el-icon-connection"></i></div>
                            <div class="u-div-meta">
                                <template v-if="isBound">绑定于 {{ formatTime(myLover.updated_at) }}</template>
                                <template v-else>邀请已发送，等待对方确认</template>
                            </div>
                            <div class="u-div-unbind" v-if="isBound" @click="onExit(myLover)">
                                <img svg-inline src="@/assets/img/dashboard/lover/unbind.svg" alt="" />解除绑定
                            </div>
                            <el-button v-else plain type="info" @click.stop="onCancel(myLover)">取消邀请</el-button>
                        </div>
                    </div>
                    <div class="u-lover-card u-add-item" v-else @click="toAdd">
                        <div class="u-item-pic u-add">
                            <i class="el-icon-plus"></i>
                        </div>
                        <span class="u-item-label">未绑定</span>
                        <div class="u-bind">邀请情缘</div>
                    </div>
                </div>
            </div>

            <div class="u-wait-tip" v-if="waitList.length">
                <i class="el-icon-warning-outline"></i>
                您有 <b>{{ waitList.length }}</b> 条情缘申请待处理
                <span class="u-pending-btn" @click.stop="toWait">查看</span>
            </div>
        </div>

        <!-- 待处理列表 -->
        <waitList
            v-if="waitVisible"
            :visible="waitVisible"
            :waitList="waitList"
            :list="list"
            @refresh="onEmit"
            @close="waitVisible = false"
        ></waitList>
        <!-- 关系网邀请 -->
        <inviteUser
            v-if="inviteVisible"
            :visible="inviteVisible"
            :list="list"
            :type="'lover'"
            :relationId="relationId"
            :relation-active-name="relationActiveName"
            @update="onRefresh"
            @close="inviteVisible = false"
        ></inviteUser>
    </div>
</template>

<script>
import { deleteInvite, exitNet } from "@/service/dashboard/relation.js";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user.js";
import moment from "moment";
import inviteUser from "./inviteUser.vue";
import waitList from "./waitList.vue";

export default {
    name: "Lover",
    components: {
        inviteUser,
        waitList,
    },
    emits: ["refresh"],
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        waitList: {
            type: Array,
            default: () => [],
        },
        relationActiveName: {
            type: String,
            default: "",
        },
        relationId: {
            type: [String, Number],
            default: 0,
        },
    },
    data() {
        return {
            inviteVisible: false,
            waitVisible: false,
        };
    },
    computed: {
        userId() {
            return User.getInfo().uid;
        },
        myLover() {
            return this.list.find((item) => item.user_id != this.userId) || {};
        },
        isBound() {
            return !!(this.myLover.id && this.myLover.status);
        },
        isPending() {
            return !!(this.myLover.id && !this.myLover.status);
        },
        canInvite() {
            return !this.myLover.id;
        },
        statusText() {
            if (this.isBound) {
                return "当前已绑定情缘，可在此查看绑定时间或解除关系。";
            }
            if (this.isPending) {
                return "已发出情缘邀请，等待对方确认。";
            }
            return "当前尚未绑定情缘，可通过 UID 邀请对方建立关系。";
        },
    },
    mounted() {},
    methods: {
        toWait() {
            if (this.waitList.length) {
                this.waitVisible = true;
            }
        },
        formatTime(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        toAdd() {
            this.inviteVisible = true;
        },
        onEmit(fn) {
            this.$emit("refresh", fn);
        },
        onRefresh() {
            this.$emit("refresh", "loadRelationNetMembersByType");
        },
        // 用户链接
        userLink(item) {
            const id = item.user_id || item.creator_info?.id;
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
        onExit(item) {
            this.$confirm(`是否和 ${this.getName(item)} 解除情缘绑定？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.loading = true;
                    exitNet(item.net_id)
                        .then(() => {
                            this.$notify({
                                title: "解除成功",
                                type: "success",
                            });
                            this.onRefresh();
                        })
                        .catch((err) => this.handleRequestError(err))
                        .finally(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },
        onCancel(item) {
            // 取消已发出但未接受的关系
            this.loading = true;
            deleteInvite(item.id)
                .then((res) => {
                    this.$notify({
                        title: "取消成功",
                        type: "success",
                    });
                    this.onRefresh();
                })
                .catch((err) => this.handleRequestError(err))
                .finally(() => {
                    this.loading = false;
                });
        },
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
        authorLink,
    },
};
</script>

<style lang="less">
.m-privacy-lover {
    .u-lover-panel {
        max-width: 600px;
        margin: 24px auto 0;
        padding: 24px;
        border-radius: 24px;
        background: #fff;
        box-sizing: border-box;
    }

    .u-lover-header {
        padding: 18px;
        border: 1px solid fade(@v4primary, 8%);
        border-radius: 18px;
        background: linear-gradient(180deg, fade(@v4primary, 6%) 0%, #ffffff 100%);
    }

    .u-lover-heading {
        &::before {
            content: "关系绑定";
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

        b {
            .db;
            margin: 12px 0 6px;
            color: #1f2d3d;
            font-size: 22px;
            line-height: 1.3;
        }

        span {
            .db;
            color: #7b8794;
            font-size: 14px;
            line-height: 1.7;
        }
    }

    .u-lover-actions {
        .flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
    }

    .m-members {
        .flex;
        flex-direction: column;
        padding: 16px 0 0;

        .m-wrapper {
            width: 100%;
        }

        .u-lover-card {
            .flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            padding: 14px;
            border-radius: 14px;
            background-color: #fff;
            border: 1px solid fade(@v4primary, 16%);
            box-sizing: border-box;
            box-shadow: 0 10px 24px fade(@v4primary, 8%);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;

            &:hover {
                border-color: fade(@v4primary, 28%);
                box-shadow: 0 14px 28px fade(@v4primary, 12%);
            }

            &.u-add-item {
                border-color: rgba(123, 135, 148, 0.1);
                background: rgba(123, 135, 148, 0.08);
                box-shadow: none;
            }

            &.is-pending {
                border-color: fade(#e6a23c, 45%);
            }

            &.u-add-item {
                cursor: pointer;

                &:hover {
                    background: fade(@v4primary, 6%);
                }

                .u-add {
                    .flex;
                    align-items: center;
                    justify-content: center;
                    color: @primary;
                    background-color: fade(@primary, 8%);
                }

                .u-bind {
                    .fz(15px, 24px);
                    .bold;
                    color: @primary;
                }
            }
        }

        .u-lover-user,
        .u-lover-meta {
            .flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            box-sizing: border-box;
        }

        .u-lover-info {
            .flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            min-width: 0;
        }

        .u-lover-meta {
            padding: 12px;
            border-radius: 12px;
            background: #f7f9fc;
            border: 1px solid rgba(31, 45, 61, 0.06);
        }

        .u-div-icon {
            .flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            .size(28px);
            .r(50%);
            background-color: rgba(123, 135, 148, 0.08);
            border: 1px solid rgba(123, 135, 148, 0.16);
            color: #8b95a5;
            .fz(14px);
        }

        .u-div-meta {
            flex: 1;
            min-width: 0;
            .fz(13px, 20px);
            color: #7b8794;
            font-weight: 600;
        }

        .u-div-unbind {
            .flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            .fz(12px, 20px);
            cursor: pointer;
            color: #8b95a5;

            img,
            svg {
                .size(16px);
                fill: #8b95a5;
            }
        }

        .u-div-unbind:hover {
            color: #e67e22;

            svg {
                fill: #e67e22;
            }
        }

        .is-pending {
            .u-div-icon {
                color: #b7791f;
                border-color: fade(#e6a23c, 22%);
                background-color: fade(#e6a23c, 8%);
            }
        }

        .u-pending {
            .fz(12px, 20px);
            color: #e6a23c;

            i {
                margin-right: 3px;
            }
        }
    }

    .u-item-pic {
        .flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        .size(52px);
        border-radius: 14px;
        overflow: hidden;
        background-color: #f7f9fc;
        transition: 0.2s ease-in-out;

        &:hover {
            filter: saturate(120%) brightness(110%);
        }
    }

    .u-item-avatar {
        .size(52px);
        border-radius: 14px;
    }

    .u-item-placeholder {
        color: #a8b0bd;
        .fz(22px);
    }

    .u-item-label {
        color: #7b8794;
        font-size: 12px;
        line-height: 18px;
        font-weight: 500;
    }

    .u-item-name {
        .nobreak;
        flex: 1;
        min-width: 0;
        .fz(15px, 26px);
        .bold;
        .db;
        color: @v4primary;
        text-align: left;

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

    .u-wait-tip {
        margin-top: 14px;
        padding: 12px 14px;
        border-radius: 14px;
        background-color: #fdf6ec;
        border: 1px solid #faecd8;
        .fz(13px, 22px);
        color: #8a5a13;

        b {
            color: #e6a23c;
        }

        .u-pending-btn {
            margin-left: 8px;
            color: @primary;
            .pointer;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-privacy-lover {
        .u-lover-panel {
            padding: 16px;
            max-width: 100%;
            border-radius: 18px;
        }

        .u-lover-actions {
            justify-content: flex-start;
        }

        .m-members {
            gap: 14px;
            padding-top: 18px;

            .u-lover-card {
                padding: 12px;
            }

            .u-lover-meta {
                flex-wrap: wrap;
                align-items: flex-start;

                .u-div-meta {
                    width: calc(100% - 48px);
                }
            }
        }
    }
}
</style>
