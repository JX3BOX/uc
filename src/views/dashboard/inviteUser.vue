<template>
    <el-dialog class="w-dialog m-invite-user-dialog" width="500" v-model="show" :title="title" @close="close">
        <div class="m-invite-user">
            <el-input
                class="u-input"
                v-model.number="uid"
                placeholder="输入UID添加"
                suffix-icon="Search"
                @keyup.enter="search"
                @change="search"
            ></el-input>
            <div class="u-list" v-if="userdata">
                <div class="u-item">
                    <img class="u-avatar" :src="showAvatar(userdata.user_avatar)" :alt="userdata.display_name" />
                    <div class="u-info">
                        <span class="u-uid">UID：{{ userdata.ID }}</span>
                        <b class="u-name">{{ userdata.display_name }}</b>
                    </div>
                </div>
            </div>
            <div class="u-null" v-if="isNull">
                <el-alert title="无搜索结果" type="info" show-icon :closable="false"></el-alert>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <div class="m-confirm">
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" :loading="loading" :disabled="loading" @click="add"> 提交 </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { searchUserById } from "@/service/dashboard/privacy.js";
import { createRelationNet, inviteUserJoin } from "@/service/dashboard/relation.js";
import User from "@jx3box/jx3box-common/js/user.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { throttle } from "lodash";
export default {
    name: "inviteUser",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        relationActiveName: {
            type: String,
            default: "",
        },
        relationId: {
            type: [String, Number],
            default: 0,
        },
        list: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: "lover",
        },
    },
    emits: ["close", "update"],
    data() {
        return {
            loading: false,
            show: false,
            uid: "",
            userdata: "",
            flag: false,
        };
    },
    computed: {
        // 无搜索结果
        isNull: function () {
            return this.uid && !this.userdata && this.flag;
        },
        title() {
            return "邀请" + this.relationActiveName;
        },
        userId() {
            return User.getInfo().uid;
        },
    },
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
        // 搜索
        search(val) {
            if (!val || isNaN(val)) return;

            this.flag = false;
            searchUserById(val)
                .then((res) => {
                    this.userdata = res.data.data;
                })
                .catch((err) => {
                    this.userdata = "";
                    this.handleRequestError(err);
                })
                .finally(() => {
                    this.flag = true;
                });
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
        getCreatedRelationId(res) {
            const data = res?.data?.data;
            return data?.id || data?.ID || data?.net?.id || data?.relation_id || 0;
        },
        inviteUser(relationId = this.relationId) {
            if (!relationId) {
                this.$notify({
                    title: "操作失败",
                    message: "未找到关系网，请稍后再试",
                    type: "error",
                });
                return Promise.resolve();
            }
            this.loading = true;
            return inviteUserJoin(relationId, this.userdata.ID)
                .then(() => {
                    this.$notify({
                        title: "已发送邀请",
                        type: "success",
                    });
                    this.$emit("update");
                        this.close();
                    })
                    .catch((err) => this.handleRequestError(err))
                    .finally(() => {
                        this.loading = false;
                    });
        },
        add: throttle(function () {
            if (!this.userdata) {
                this.$notify({
                    title: "提示",
                    message: "请先输入UID进行搜索",
                    type: "warning",
                });
                return;
            }

            if (this.list.length) {
                this.inviteUser();
            } else {
                // 当成员为空时，要先建立关系网再邀请
                this.loading = true;
                createRelationNet({ relationship_type: this.type })
                    .then((res) => {
                        return this.inviteUser(this.getCreatedRelationId(res));
                    })
                    .catch((err) => this.handleRequestError(err))
                    .finally(() => {
                        this.loading = false;
                    });
            }
        }, 500),
    },
};
</script>

<style lang="less">
.m-invite-user-dialog {
    .m-invite-user {
        .u-null {
            .mt(10px);
        }

        .u-list {
            .mt(10px);
        }

        .u-item {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            background-color: #f9f9f9;
            padding: 10px;
            .r(4px);
            .u-avatar {
                .size(40px);
                .r(10px);
                margin-right: 20px;
            }
            .u-info {
                .clip;
                width: calc(100% - 60px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .fz(13px, 20px);
                b,
                span {
                    .x(left);
                    .w(100%);
                    .nobreak;
                    text-overflow: ellipsis;
                    align-self: flex-start;
                }
            }
        }
    }
}
</style>
