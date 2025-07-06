<template>
    <el-dialog class="w-dialog m-invite-user" width="500" :visible.sync="show" :title="title" @close="close">
        <el-input
            class="u-input"
            v-model.number="uid"
            placeholder="输入UID添加"
            suffix-icon="el-icon-search"
            @keyup.enter.native="search"
            @change="search"
        ></el-input>
        <div class="u-list" v-if="userdata">
            <div class="u-item">
                <img class="u-item-avatar" :src="userdata.user_avatar | showAvatar" :alt="userdata.display_name" />
                <div class="u-item-info">
                    <span class="u-item-uid">UID：{{ userdata.ID }}</span>
                    <b class="u-item-name">{{ userdata.display_name }}</b>
                </div>
            </div>
        </div>
        <div class="u-null" v-if="isNull">
            <el-alert title="无搜索结果" type="info" show-icon :closable="false"></el-alert>
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
        // 搜索
        search(val) {
            if (!val || isNaN(val)) return;

            this.flag = false;
            searchUserById(val)
                .then((res) => {
                    this.userdata = res.data.data;
                })
                .finally(() => {
                    this.flag = true;
                });
        },
        inviteUser() {
            if (!this.relationId) return;
            this.loading = true;
            inviteUserJoin(this.relationId, this.userdata.ID)
                .then(() => {
                    this.$notify({
                        title: "已发送邀请",
                        type: "success",
                    });
                    this.$emit("update");
                    this.close();
                })
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
                createRelationNet({ relationship_type: this.type }).then(() => {
                    this.inviteUser();
                });
            }
        }, 500),
    },
};
</script>

<style lang="less">
.m-invite-user {
    .u-null {
        .mt(10px);
    }

    .u-list {
        .mt(10px);
    }

    .u-item {
        .w(100%);
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin-bottom: 10px;
        background-color: #f9f9f9;
        padding: 10px;
        .u-item-avatar {
            .size(40px);
            .r(10px);
            margin-right: 20px;
        }
        .u-item-info {
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
        .pr;
        .u-item-exist {
            .pa;
            .fz(12px);
            font-style: normal;
            right: 5px;
            top: 5px;
            color: #fba524;
        }
    }
}
</style>
