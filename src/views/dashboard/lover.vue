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
                <template v-if="myLover.id">
                    <div class="u-switch">
                        <i class="el-icon-d-arrow-right"></i>
                    </div>
                    <div class="m-wrapper">
                        <div class="u-item">
                            <a class="u-item-pic" :href="userLink(myLover)" target="_blank">
                                <img class="u-item-avatar" :src="getAvatar(myLover) | showAvatar" />
                            </a>
                            <a class="u-item-name" :href="userLink(myLover)" target="_blank">{{ getName(myLover) }}</a>
                            <span class="u-item-remark" v-if="!myLover.status">
                                等待确认中...
                                <el-button size="mini" @click="onCancel(myLover)">取消</el-button>
                            </span>
                            <span v-else class="u-item-remark u-exit" @click="onExit(myLover)"> 解除关系 </span>
                        </div>
                        <el-alert
                            v-if="waitList.length"
                            class="u-wait-tip"
                            :title="`您有 ${waitList.length} 条邀请待处理！`"
                            type="warning"
                            show-icon
                            :closable="false"
                            @click.native="waitVisible = true"
                        >
                        </el-alert>
                    </div>
                </template>
                <div class="m-wrapper" v-else>
                    <div class="u-item u-add" @click="toAdd">
                        <i class="el-icon-plus"></i>
                    </div>
                    <el-alert
                        v-if="waitList.length"
                        class="u-wait-tip"
                        :title="`您有 ${waitList.length} 条邀请待处理！`"
                        type="warning"
                        show-icon
                        :closable="false"
                        @click.native="waitVisible = true"
                    >
                    </el-alert>
                </div>
            </div>
        </template>
        <el-button type="success" v-if="showOpen" @click="onOpen">启用</el-button>
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
import { deleteInvite, exitNet, createRelationNet } from "@/service/dashboard/relation.js";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import { getUserConf, setUserConf } from "@/service/dashboard/conf";
import User from "@jx3box/jx3box-common/js/user.js";
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
            isAllowLover: false, // 是否允许情缘。允许则在未创建情缘关系网时自动创建，不允许则显示开启按钮
        };
    },
    computed: {
        showOpen() {
            return !this.isAllowLover && !this.list.length;
        },
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
        toAdd() {
            this.inviteVisible = true;
        },
        onEmit(fn) {
            this.$emit("refresh", fn);
        },
        onRefresh() {
            this.$emit("refresh", "loadRelationNetMembersByType");
        },
        onOpen() {
            this.$confirm(`是否立即启用情缘功能？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                setUserConf({ accept_lover_request: 1 }).then(() => {
                    this.$notify({
                        title: "开启成功",
                        type: "success",
                    });
                    this.autoCreateNet();
                });
            });
        },
        autoCreateNet() {
            // 当成员为空时,且isAllowLover为true时，自动建立关系网
            if (this.list.length) return;
            createRelationNet({ relationship_type: "lover" }).then(() => {
                this.onRefresh();
            });
        },
        loadConf() {
            getUserConf().then((res) => {
                this.isAllowLover = !!res?.data?.data?.accept_lover_request;
                if (this.isAllowLover) {
                    this.autoCreateNet();
                }
            });
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
            this.$confirm(`是否和 ${item.user_info?.display_name} 解除情缘关系？`, "提示", {
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
    .m-members {
        .flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        .u-item {
            .flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 40px 10px;
            width: 200px;
            height: 251px;
            box-sizing: border-box;
            &.u-add {
                font-size: 30px;
                cursor: pointer;
                &:hover {
                    background-color: #f2f2f2;
                }
            }
        }
    }
    .u-wait-tip {
        cursor: pointer;
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
    .m-wrapper {
        position: relative;
        padding: 40px 0;
        .u-wait-tip {
            position: absolute;
            bottom: 0;
        }
    }
}
</style>
