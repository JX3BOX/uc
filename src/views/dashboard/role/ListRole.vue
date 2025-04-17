<template>
    <div class="v-role-list" v-loading="loading">
        <h2 class="u-title">
            <i class="el-icon-coordinate"></i> 我的角色
            <!-- <goback /> -->
            <div class="u-op">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-connection"></i> 绑定角色
                </router-link>
                <router-link to="/role/add" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div>
        </h2>
        <div class="m-role-list-filter">
            <el-select size="small" v-model="mount" popper-class="m-school-pop">
                <el-option label="全部" value=""></el-option>
                <el-option
                    v-for="(school, school_id) in school_id_map"
                    :key="school_id"
                    :value="school_id"
                    :label="school"
                    class="u-school"
                >
                    <img width="24" height="24" :src="school_id | showSchoolIcon" />
                    {{ school }}
                </el-option>
            </el-select>
            <el-input class="u-name" v-model="name" placeholder="请输入角色名称" size="small">
                <template slot="prepend"> <i class="el-icon-search"></i> 查找 </template>
            </el-input>
        </div>
        <div class="m-team-rolelist" v-if="data && data.length">
            <ul class="u-list">
                <li class="u-item" v-for="(item, i) in data" :key="i">
                    <router-link :to="'/role/' + item.ID" class="u-pic u-avatar">
                        <img :src="showAvatar(item.mount, item.body_type)" alt />
                        <i class="u-status" v-if="!item.custom" title="已认证">
                            <img svg-inline src="@/assets/img/dashboard/verify.svg" />
                        </i>
                    </router-link>
                    <span class="u-title">
                        <router-link class="u-rolename" :to="'/role/' + item.ID">{{ item.name }}</router-link>
                        <el-tag v-if="item.is_default_role" size="mini" type="warning">默认</el-tag>
                        <span class="u-star" :class="{ on: item.priority }" @click="starRole(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.priority ? '取消置顶' : '置顶'"
                                placement="top"
                            >
                                <i class="el-icon-star-on" v-if="item.priority"></i>
                                <i class="el-icon-star-off" v-else></i>
                            </el-tooltip>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-server">
                            <em>服务器</em>
                            {{ item.server }}
                        </span>
                        <span class="u-mount">
                            <em>门派</em>
                            <img class="u-icon" :src="item.mount | showSchoolIcon" />
                            {{ item.mount | showSchoolName }}
                        </span>
                        <span class="u-team-name" v-if="item.team_relation && item.team_relation.team_id">
                            <em>团队名</em>
                            {{ item.team_relation.team_name }}
                        </span>
                        <span class="u-team-status" v-if="item.team_relation && item.team_relation.team_id">
                            <em>状态</em>
                            <span class="u-team-status" :class="`u-team-status-${item.team_relation.status}`">{{ teamStatus(item.team_relation.status) }}</span>
                        </span>
                        <span class="u-note">
                            <em>备注</em>
                            {{ item.note }}
                            <span class="u-addnote" @click="addNote(item)">
                                <el-tooltip class="item" effect="dark" content="设置备注" placement="top">
                                    <i class="el-icon-edit-outline"></i>
                                </el-tooltip>
                            </span>
                        </span>
                    </span>
                    <span class="u-time">绑定时间 : {{ item.created_at | showTime }}</span>
                    <div class="u-op">
                        <el-switch
                            v-model="item.is_public_visible"
                            :active-value="1"
                            :inactive-value="0"
                            @change="onPublicChange(item)"
                            class="u-public"
                            active-text="公开"
                        >
                        </el-switch>
                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button type="default" size="small">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{ item, command: 'default' }">
                                    <i class="el-icon-setting"></i>
                                    {{ item.is_default_role ? "取消默认" : "设为默认" }}
                                </el-dropdown-item>
                                <el-dropdown-item v-if="!item.custom" :command="{ item, command: 'unbind' }">
                                    <i class="el-icon-remove-outline"></i>
                                    解绑
                                </el-dropdown-item>
                                <template v-else>
                                    <el-dropdown-item :command="{ item, command: 'edit' }">
                                        <i class="el-icon-edit-outline"></i>
                                        编辑
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{ item, command: 'delete' }">
                                        <i class="el-icon-delete"></i>
                                        删除
                                    </el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
        </div>
        <template v-else>
            <el-alert class="m-archive-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
            <div class="m-role-null">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-connection"></i> 绑定角色
                </router-link>
                <router-link to="/role/add" class="el-button el-button--primary el-button--mini">
                    <i class="el-icon-plus"></i> 自定义角色
                </router-link>
            </div>
        </template>
        <el-dialog
            title="设置备注"
            :visible.sync="noteVisible"
            :width="isPhone ? '95%' : '30%'"
            class="m-team-note-dialog"
        >
            <div>
                <el-input v-model="note" placeholder="请输入内容" :maxlength="20" :show-word-limit="true"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="noteVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmNote">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRoles,
    unbindRole,
    noteRole,
    deleteRole,
    starRole,
    unstarRole,
    updateRoleVisible,
    defaultRole,
} from "@/service/dashboard/role.js";
import school_id_map from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { showSchoolIcon, showSchoolName, showTime, getThumbnail } from "@/utils/filters";
export default {
    name: "ListRole",
    props: [],
    filters: {
        showSchoolIcon,
        showSchoolName,
        showTime,
    },
    data: function () {
        return {
            data: [],
            loading: false,

            // 备注
            noteVisible: false,
            currentItem: "",
            note: "",

            // 角色过滤
            mount: "",
            name: "",
            xfmap,
            school_id_map,

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        params: function () {
            return {
                mount: this.mount,
                name: this.name,
            };
        },
    },
    methods: {
        unbind: function (id) {
            this.$confirm("在网站进行解绑游戏内需要小退方可生效", "提示", {
                confirmButtonText: "确定解绑",
                cancelButtonText: "取消",
                callback: (action) => {
                    if (action == "confirm") {
                        unbindRole(id).then((res) => {
                            this.$notify({
                                title: "解绑成功",
                                message: "角色解绑成功",
                                type: "success",
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        loadData: function () {
            this.loading = true;
            getRoles(this.params)
                .then((res) => {
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showAvatar: function (mount, body_type) {
            return getThumbnail(__cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png");
        },
        go: function (route) {
            this.$router.push(route);
        },
        addNote: function (item) {
            this.noteVisible = true;
            this.currentItem = item;
        },
        confirmNote: function () {
            noteRole(this.currentItem.ID, this.note).then((res) => {
                this.noteVisible = false;
                this.currentItem.note = this.note;
                this.note = "";

                this.$notify({
                    title: "成功",
                    message: "备注设置成功",
                    type: "success",
                });
            });
        },
        delRole: function (role_id) {
            this.$alert("确定删除该角色吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRole(role_id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                message: "角色删除成功",
                                type: "success",
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        starRole: function (item) {
            if (item.priority) {
                unstarRole(item.ID).then((res) => {
                    item.priority = 0;
                    this.$notify({
                        title: "取消星标成功",
                        message: "角色取消星标成功",
                        type: "success",
                    });
                });
            } else {
                starRole(item.ID).then((res) => {
                    item.priority = Date.now();
                    this.$notify({
                        title: "星标成功",
                        message: "角色星标成功",
                        type: "success",
                    });
                });
            }
        },

        handleCommand(data) {
            if (data.command == "unbind") {
                this.unbind(data.item.ID);
            } else if (data.command == "edit") {
                this.$router.push("/role/edit/" + data.item.ID);
            } else if (data.command == "delete") {
                this.delRole(data.item.ID);
            } else if (data.command == "default") {
                defaultRole(data.item.ID, ~~!data.item.is_default_role).then((res) => {
                    this.$message({
                        title: "成功",
                        message: ~~!data.item.is_default_role ? "设置成功" : "取消成功",
                        type: "success",
                    });
                    this.loadData();
                });
            }
        },
        onPublicChange: function (item) {
            updateRoleVisible(item.ID, item.is_public_visible).then((res) => {
                this.$notify({
                    title: "成功",
                    message: "设置成功",
                    type: "success",
                });
            });
        },
        teamStatus(status) {
            return {
                0: "待审核",
                1: "已通过",
            }[status]
        }
    },
    created: function () {},
    watch: {
        params: {
            immediate: true,
            handler: function (val) {
                this.loadData();
            },
        },
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/list_role.less";
</style>
