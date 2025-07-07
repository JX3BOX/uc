<template>
    <div class="m-privacy-lover">
        <template v-if="list.length">
            <div class="m-members">
                <div class="u-item" v-if="me.id">
                    <a class="u-item-pic" :href="userLink(me)" target="_blank">
                        <img class="u-item-avatar" :src="getAvatar(me) | showAvatar" />
                    </a>
                    <a class="u-item-name" :href="userLink(me)" target="_blank">{{ getName(me) }}</a>
                </div>
                <div class="u-div">
                    <div class="u-div-icon"><i class="el-icon-connection"></i></div>
                    <template v-if="myLover.id">
                        <div class="u-div-meta">{{ formatTime(myLover.updated_at) }}</div>
                        <div class="u-div-meta u-div-unbind" v-if="myLover.status" @click="onExit(myLover)">
                            <img svg-inline src="@/assets/img/dashboard/lover/unbind.svg" alt="" />解除绑定
                        </div>
                    </template>
                </div>
                <template v-if="myLover.id">
                    <div class="m-wrapper" @click="toWait">
                        <div class="u-item">
                            <div v-if="!myLover.status" class="u-cancel" @click.stop="onCancel(myLover)">
                                <i class="el-icon-close"></i>
                            </div>
                            <a class="u-item-pic" :href="userLink(myLover)" target="_blank">
                                <img class="u-item-avatar" :src="getAvatar(myLover) | showAvatar" />
                            </a>
                            <a class="u-item-name" :href="userLink(myLover)" target="_blank">{{ getName(myLover) }}</a>
                            <div class="u-action">
                                <div class="u-item-remark" v-if="!myLover.status">
                                    <div class="u-pending"><i class="el-icon-time"></i>等待确认中...</div>
                                </div>
                                <div v-if="waitList.length" class="u-wait-tip">
                                    您有 <b>{{ waitList.length }}</b> 条情缘申请待处理，<span>查看</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="m-wrapper" v-else @click="toAdd">
                    <div class="u-item u-add-item">
                        <div class="u-add">
                            <i class="el-icon-plus"></i>
                        </div>
                        <div class="u-bind">绑定情缘</div>
                        <div class="u-action" v-if="waitList.length">
                            <div class="u-wait-tip" @click.stop="toWait">
                                您有 <b>{{ waitList.length }}</b> 条情缘申请待处理，<span>查看</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
        me() {
            return this.list.find((item) => item.user_id == this.userId) || {};
        },
        myLover() {
            return this.list.find((item) => item.user_id != this.userId) || {};
        },
    },
    watch: {
        list: {
            deep: true,
            handler(list) {
                if (!list.length) {
                    this.loadConf();
                }
            },
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
            return item.user_info?.display_name || item.creator_info?.display_name;
        },
        onExit(item) {
            this.$confirm(`是否和 ${item.user_info?.display_name} 解除情缘绑定？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.loading = true;
                exitNet(item.net_id)
                    .then(() => {
                        this.$notify({
                            title: "解除成功",
                            type: "success",
                        });
                        this.onRefresh();
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
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
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    filters: {
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
        authorLink,
    },
};
</script>

<style lang="less">
.m-privacy-lover {
    min-width: 800px;
    .m-members {
        .flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;

        .u-div {
            padding: 0 40px;
            .u-div-icon {
                .x;
                .fz(40px);
            }
            .u-div-meta {
                .x;
                .fz(12px, 2.5);
                color: #888;
            }
            .u-div-unbind {
                .flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #888;
                img,
                svg {
                    .size(16px);
                    margin-right: 5px;
                    fill: #888;
                }
            }
            .u-div-unbind:hover {
                color: orange;
                svg {
                    fill: orange;
                }
            }
        }

        .u-item {
            position: relative;
            .flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 40px 10px;
            width: 200px;
            min-height: 250px;
            box-sizing: border-box;
            &.u-add-item {
                font-size: 30px;
                cursor: pointer;
                &:hover {
                    background-color: #f2f2f2;
                }
                .u-add {
                    .flex;
                    align-items: center;
                    justify-content: center;
                    .size(68px);
                    .r(50%);
                    color: #999;
                }
                .u-bind {
                    .fz(14px, 2.5);
                    margin-top: 10px;
                    .bold;
                    .x;
                    .db;
                }
            }

            .u-action {
                position: absolute;
                bottom: 20px;
            }
        }

        .u-pending {
            color: orange;
            i {
                margin-right: 3px;
            }
        }
    }
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

    .u-item-name {
        .nobreak;
        .fz(14px, 2.5);
        margin-top: 10px;
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
    .m-wrapper {
        position: relative;
        padding: 40px 0;
        .u-wait-tip {
            font-size: 12px;
            text-align: center;
            width: 100%;
            b {
                color: orange;
            }
            span {
                color: @primary;
            }
        }
        .u-cancel {
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
        .u-item {
            &:hover {
                .u-cancel {
                    .dbi;
                }
            }
        }
    }
}
</style>
