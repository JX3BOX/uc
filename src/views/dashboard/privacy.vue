<template>
    <div class="m-dashboard m-dashboard-profile m-dashboard-work m-dashboard-whitelist m-whitelist">
        <div class="m-whitelist-primary" v-loading="loading">
            <h2 class="m-whitelist-title u-title"><i class="el-icon-ship"></i> 隐私设置</h2>

            <el-tabs v-model="active" @tab-click="tabChange">
                <template v-if="relationNetTypes.length">
                    <el-tab-pane
                        :label="item.name"
                        :name="item.relationship_type"
                        :key="i"
                        v-for="(item, i) in relationNetTypes"
                    >
                        <lover
                            v-if="active === 'lover' && isRelationNet"
                            :list="members"
                            :waitList="waitList"
                            :relationId="relationId"
                            :relation-active-name="relationActiveName"
                            @refresh="onRefresh"
                        ></lover>
                        <div class="m-fun-open" v-if="showOpen">
                            <el-empty description="您尚未开启该功能"></el-empty>
                            <el-button type="success" @click="onOpen">立即启用</el-button>
                        </div>
                    </el-tab-pane>
                </template>
                <el-tab-pane label="我的亲友" name="whitelist"></el-tab-pane>
                <el-tab-pane label="黑名单" name="blacklist"></el-tab-pane>
                <el-tab-pane label="我的关注" name="myfollow"></el-tab-pane>
                <el-tab-pane label="我的粉丝" name="myfans"></el-tab-pane>
            </el-tabs>

            <template v-if="!isRelationNet">
                <el-input
                    v-if="active !== 'whitelist'"
                    class="m-privacy-search"
                    placeholder="请输入搜索内容"
                    v-model="keyword"
                    @keyup.enter.native="handleChange"
                    clearable
                    @clear="handleChange"
                >
                    <template slot="prepend">关键词</template>
                    <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
                </el-input>

                <div class="m-whitelist-list u-list" v-if="list && list.length">
                    <div class="u-item" v-for="(item, i) in list" :key="item.kith_id || item.id">
                        <a class="u-item-pic" :href="userLink(item)" target="_blank">
                            <img class="u-item-avatar" :src="getAvatar(item) | showAvatar" />
                        </a>
                        <a class="u-item-name" :href="userLink(item)" target="_blank">{{ getName(item) }}</a>
                        <template v-if="active === 'whitelist'">
                            <span class="u-item-remark" v-if="item.status">备注：{{ item.remark || "无" }}</span>
                            <span class="u-item-remark" v-else> <i class="el-icon-loading"></i> 等待确认中... </span>
                        </template>
                        <div class="u-item-btns">
                            <template v-if="active === 'whitelist'">
                                <el-popconfirm title="确认删除亲友关系吗？" @confirm="remove(item.kith_id, i)">
                                    <el-button slot="reference" type="warning" size="mini" icon="el-icon-delete"
                                        >删除</el-button
                                    >
                                </el-popconfirm>

                                <el-button
                                    @click="edit(item.kith_id, item)"
                                    size="mini"
                                    icon="el-icon-edit"
                                    class="u-btn-edit"
                                    >编辑</el-button
                                >
                            </template>
                            <template v-else>
                                <el-button
                                    @click="removeOther(item)"
                                    size="mini"
                                    icon="el-icon-delete"
                                    class="u-btn-delete"
                                    >移除</el-button
                                >
                            </template>
                        </div>
                    </div>
                </div>
                <el-pagination
                    background
                    v-if="active !== 'whitelist'"
                    hide-on-single-page
                    :current-page="pagination.pageIndex"
                    @current-change="currentChange"
                    :total="pagination.total"
                ></el-pagination>
            </template>
        </div>
        <div class="m-whitelist-sidebar" v-if="active !== 'myfans' && !isRelationNet">
            <div class="u-title"><i class="el-icon-news"></i> {{ sideTitle }}</div>
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
                    <i class="u-item-exist" v-if="!isNewKith">已添加</i>
                </div>
            </div>
            <div class="u-null" v-if="isNull">
                <el-alert title="无搜索结果" type="info" show-icon :closable="false"></el-alert>
            </div>
            <el-button
                class="u-submit"
                type="success"
                :disabled="active === 'wihtelist' && !allowAppend"
                @click="add"
                >{{ btnText }}</el-button
            >
        </div>
    </div>
</template>
<script>
import {
    searchUserById,
    addKith,
    getKithList,
    editKith,
    removeKith,
    getBlackList,
    follow,
    deny,
    undeny,
} from "@/service/dashboard/privacy.js";
import { getMyRss, getMySubscribers, removeRssUser, addRssUser, cancelRssUser } from "@/service/dashboard/rss";
import { getRelationNetTypes, getRelationNetMembersByType, getWaitInvites } from "@/service/dashboard/relation.js";
import { getUserConf, setUserConf } from "@/service/dashboard/conf";
import User from "@jx3box/jx3box-common/js/user.js";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import lover from "./lover.vue";
export default {
    name: "privacy",
    components: {
        lover,
    },
    props: [],
    data: function () {
        return {
            // 列表区
            list: [],
            loading: false,

            // 侧边栏
            uid: "",
            userdata: "",
            flag: false,

            // 上限
            limit_map: {
                member: 5,
                vip: 20,
                pro: 100,
            },
            identity: "member",

            active: "lover",
            keyword: "",
            pagination: {
                pageIndex: 1,
                pageSize: 10,
                total: 0,
            },

            relationNetTypes: [], // 关系网类型
            net: {},
            members: [],
            waitList: [], // 待处理的关系列表
            inviteVisible: false,
            isAllowLover: false, // 是否允许情缘。允许则后端在未创建情缘关系网时自动创建，不允许则显示开启按钮
        };
    },
    computed: {
        isRelationNet: function () {
            return this.relationNetTypes.find((item) => item.relationship_type === this.active);
        },
        relationActiveName() {
            return this.relationNetTypes.find((item) => item.relationship_type === this.active)?.name;
        },
        relationId() {
            return this.net?.id || 0;
        },
        allowAppend: function () {
            // 有搜索结果
            // 且未达到上限
            // 且未重复添加
            return this.userdata && this.total < this.limit && this.isNewKith;
        },
        // 未重复
        isNewKith: function () {
            let kith_id = this.userdata?.ID;
            return !this.currentIdList.includes(kith_id);
        },
        // 当前用户UID列表
        currentIdList: function () {
            return this.list.map((item) => {
                return item.kith_id;
            });
        },
        // 上限
        limit: function () {
            return this.limit_map[this.identity] || 5;
        },
        // 当前亲友总数
        total: function () {
            return this.list?.length;
        },
        // 无搜索结果
        isNull: function () {
            return this.uid && !this.userdata && this.flag;
        },
        fns() {
            return {
                blacklist: getBlackList,
                myfans: getMySubscribers,
            };
        },
        removeFns() {
            return {
                blacklist: undeny,
                myfollow: cancelRssUser,
                myfans: removeRssUser,
            };
        },
        addFns() {
            return {
                blacklist: deny,
                myfollow: follow,
                whitelist: addKith,
            };
        },
        btnText() {
            return this.isRelationNet
                ? "添加"
                : {
                      blacklist: "拉黑",
                      myfollow: "关注",
                      whitelist: `添加亲友 (${this.total} / ${this.limit})`,
                  }[this.active];
        },
        sideTitle() {
            return this.isRelationNet
                ? this.relationActiveName
                : {
                      blacklist: "添加黑名单",
                      myfollow: "添加关注",
                      whitelist: "添加亲友",
                  }[this.active];
        },
        userId() {
            return User.getInfo().uid;
        },
        showOpen() {
            return this.active == "lover" && !this.isAllowLover;
        },
    },
    methods: {
        onOpen() {
            this.$confirm(`是否立即启用？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                setUserConf({ accept_lover_request: 1 }).then(() => {
                    this.$notify({
                        title: "开启成功",
                        type: "success",
                    });
                    this.isAllowLover = true;
                    this.loadRelationNetMembersByType();
                });
            });
        },
        loadConf() {
            getUserConf().then((res) => {
                this.isAllowLover = !!res?.data?.data?.accept_lover_request;
                if (this.isAllowLover) {
                    this.loadRelationNetMembersByType();
                }
            });
        },
        onRefresh(fn) {
            this?.[fn]();
        },
        async loadRelationNetTypes() {
            // 暂时只筛选官方的关系网类型 is_official & is_only_one
            return await getRelationNetTypes().then((res) => {
                this.relationNetTypes = res.data.data?.filter((item) => item.is_official && item.is_only_one);
            });
        },
        handleChange() {
            this.pagination.pageIndex = 1;
            this.loadList();
        },
        loadRelationNetMembersByType() {
            // 加载关系网成员
            // 官方关系网类型且唯一
            const type = this.active;
            this.loading = true;
            getRelationNetMembersByType(type)
                .then((res) => {
                    this.members = res.data.data?.members || [];
                    this.net = res.data.data?.net || {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取待处理的关系邀请
        loadWaitInvites() {
            this.loading = true;
            getWaitInvites()
                .then((res) => {
                    this.waitList =
                        res.data?.data?.list?.filter((item) => item.net?.relationship_type === this.active) || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        tabChange() {
            if (this.relationNetTypes.find((item) => item.relationship_type === this.active)) {
                if (this.active == "lover") {
                    this.loadConf();
                } else {
                    this.loadRelationNetMembersByType();
                }
                this.$router.push({
                    name: "privacy",
                    query: {
                        tab: this.active,
                    },
                });
                return;
            }
            this.keyword = this.$route.query.keyword || "";
            this.pagination.pageIndex = 1;
            this.loadList();
        },
        currentChange(val) {
            this.pagination.pageIndex = val;
            this.loadList();
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
        add() {
            if (!this.userdata) {
                this.$notify({
                    title: "提示",
                    message: "请先输入UID进行搜索",
                    type: "warning",
                });
                return;
            }
            if (this.active === "myfollow") {
                addRssUser(this.userdata.ID, { title: this.userdata.display_name }).then((res) => {
                    this.loadList();
                });
            } else {
                this.addFns[this.active](this.userdata.ID).then((res) => {
                    this.loadList();
                });
            }
        },
        // 添加亲友
        addKith() {
            this.allowAppend &&
                addKith(this.uid).then(() => {
                    this.$notify({
                        title: "成功",
                        message: "添加成功",
                        type: "success",
                    });
                    this.list.push({
                        kith_id: this.uid,
                        level: 0,
                        status: 0,
                        kith_info: this.userdata,
                    });
                });
        },
        // 添加关注
        follow() {
            follow(this.userdata.ID).then(() => {
                this.$notify({
                    title: "成功",
                    message: "关注成功",
                    type: "success",
                });
                this.loadList();
            });
        },
        // 添加黑名单
        deny() {
            deny(this.userdata.ID).then(() => {
                this.$notify({
                    title: "成功",
                    message: "拉黑成功",
                    type: "success",
                });
                this.loadList();
            });
        },
        // 加载列表
        loadList() {
            this.loading = true;
            this.$router.push({
                name: "privacy",
                query: {
                    tab: this.active,
                },
            });
            if (this.active === "whitelist") {
                getKithList()
                    .then((res) => {
                        let list = res.data.data;
                        list = list.sort((a, b) => {
                            return b.level - a.level;
                        });
                        this.list = list;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else if (this.active === "myfollow") {
                const params = {
                    index: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                    q: this.keyword,
                    category: 2,
                };

                getMyRss(params)
                    .then((res) => {
                        this.list = res.data.data.list || [];
                        this.pagination.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                const params = {
                    pageIndex: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                    display_name: this.keyword,
                };
                this.fns[this.active](params)
                    .then((res) => {
                        this.list = res.data.data.list || [];
                        this.pagination.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        // 删除亲友
        remove(kith_id, i) {
            removeKith(kith_id).then(() => {
                this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                });
                this.list.splice(i, 1);
            });
        },
        // 编辑备注
        edit(kith_id, item) {
            this.$prompt("请输入备注", "设置", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                editKith(kith_id, { remark: value }).then(() => {
                    this.$notify({
                        title: "成功",
                        message: "编辑成功",
                        type: "success",
                    });
                    item.remark = value;
                });
            });
        },
        // 移除
        removeOther(item) {
            const msgs = {
                blacklist: "确认解除对该用户的屏蔽？",
                myfollow: "确认不再订阅该用户？",
                myfans: "确认要移除粉丝？",
            };
            this.$confirm(msgs[this.active], "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    // const id = this.active === 'myfans' || this.active == 'myfollow' ? item.user_id : item.bind_user_id;
                    let id = "";
                    if (this.active === "whitelist") {
                        id = item.kith_id;
                    } else if (this.active === "myfans") {
                        id = item.user_id;
                    } else if (this.active === "blacklist") {
                        id = item.bind_user_id;
                    } else {
                        id = item.author_id;
                    }

                    this.removeFns[this.active](id).then(() => {
                        this.$notify({
                            title: "成功",
                            message: "操作成功",
                            type: "success",
                        });
                        this.loadList();
                    });
                })
                .finally(() => {});
        },
        userLink(item) {
            let id = "";
            if (this.active === "whitelist") {
                id = item.kith_id;
            } else if (this.active === "myfans") {
                id = item.user_id;
            } else if (this.active === "blacklist") {
                id = item.bind_user_id;
            } else {
                id = item.author_id;
            }
            return authorLink(id);
        },
        getAvatar(item) {
            if (this.active == "myfans") {
                return item.user_info?.avatar;
            } else if (this.active == "myfollow") {
                return item.author_info?.avatar;
            }
            return (item.kith_info || item).user_avatar;
        },
        getName(item) {
            if (this.active == "myfans") {
                return item.user_info?.display_name;
            } else if (this.active == "myfollow") {
                return item.author_info?.display_name;
            }
            return (item.kith_info || item).display_name;
        },
    },
    mounted: function () {
        this.loadRelationNetTypes().then(() => {
            let routeTab = this.$route.query.tab;
            const relationNetTypes = this.relationNetTypes;
            if (relationNetTypes.length && !routeTab) {
                routeTab = relationNetTypes[0].relationship_type;
            }
            if (routeTab && relationNetTypes.find((item) => item.relationship_type === routeTab)) {
                this.active = routeTab;
                if (this.active == "lover") {
                    this.loadConf();
                } else {
                    this.loadRelationNetMembersByType();
                }
                this.loadWaitInvites();
            } else {
                this.active = routeTab || "whitelist";
                this.loadList();
            }
        });
        User.getAsset().then((asset) => {
            if (User._isPRO(asset)) {
                this.identity = "pro";
            } else if (User._isVIP(asset)) {
                this.identity = "vip";
            } else {
                this.identity = "member";
            }
        });
    },
    filters: {
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
        authorLink,
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/dashboard/whitelist.less";
</style>
