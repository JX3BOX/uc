<template>
    <div class="m-dashboard m-dashboard-profile m-dashboard-work m-dashboard-whitelist m-whitelist">
        <div class="m-whitelist-primary" v-loading="loading">
            <h2 class="m-whitelist-title u-title"><i class="el-icon-ship"></i> 隐私设置</h2>

            <el-tabs v-model="active" @tab-change="tabChange">
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
                    @keyup.enter="handleChange"
                    clearable
                    @clear="handleChange"
                >
                    <template #prepend>关键词</template>
                    <template #append>
                        <el-button icon="Search" @click="handleChange"></el-button>
                    </template>
                </el-input>

                <div class="m-whitelist-list u-list" v-if="list && list.length">
                    <div class="u-item" v-for="(item, i) in list" :key="itemKey(item, i)">
                        <div class="u-item-actions">
                            <el-dropdown trigger="click" placement="bottom-end">
                                <span class="u-item-dropdown" @click.stop>
                                    <i class="el-icon-more"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item v-if="active === 'whitelist'" class="u-item-dropdown-menu">
                                            <el-popconfirm
                                                title="确认删除亲友关系吗？"
                                                @confirm="remove(item.kith_id, i)"
                                            >
                                                <template #reference>
                                                    <span class="u-item-dropdown-action" @click.stop>移除</span>
                                                </template>
                                            </el-popconfirm>
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            v-else
                                            class="u-item-dropdown-menu"
                                            @click="removeOther(item)"
                                        >
                                            移除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <a class="u-item-pic" :href="userLink(item)" target="_blank">
                            <img class="u-item-avatar" :src="showAvatar(getAvatar(item))" />
                        </a>
                        <a class="u-item-name" :href="userLink(item)" target="_blank">{{ getName(item) }}</a>
                        <template v-if="active === 'whitelist'">
                            <span class="u-item-remark" v-if="item.status">
                                备注：{{ item.remark || "无" }}
                                <i class="el-icon-edit-outline u-btn-edit" @click="edit(item.kith_id, item)"></i>
                            </span>
                            <span class="u-item-remark u-pending" v-else> <i class="el-icon-loading"></i> 等待确认中... </span>
                        </template>
                        <div class="u-item-time" :title="`建立时间：${formatCreatedAt(item)}`">
                            建立时间：{{ formatCreatedAt(item) }}
                        </div>
                    </div>
                </div>
                <el-pagination
                    class="m-whitelist-pagination"
                    background
                    v-if="active !== 'whitelist'"
                    :page-sizes="[10, 20, 50]"
                    v-model:current-page="pagination.pageIndex"
                    v-model:page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="currentChange"
                    @size-change="handleSizeChange"
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
                suffix-icon="Search"
                @keyup.enter="search"
                @change="search"
            ></el-input>
            <div class="u-list" v-if="userdata">
                <div class="u-item">
                    <img class="u-item-avatar" :src="showAvatar(userdata.user_avatar)" :alt="userdata.display_name" />
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
                :disabled="!canAddUser"
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
    deny,
    undeny,
} from "@/service/dashboard/privacy.js";
import { getMyRss, getMySubscribers, removeRssUser, addRssUser, cancelRssUser } from "@/service/dashboard/rss";
import { getRelationNetTypes, getRelationNetMembersByType, getWaitInvites } from "@/service/dashboard/relation.js";
import { getUserConf, setUserConf } from "@/service/dashboard/conf";
import dateFormat from "@/utils/dateFormat";
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
        canAddUser() {
            if (this.active === "whitelist") {
                return this.allowAppend;
            }
            return !!this.userdata && ["blacklist", "myfollow"].includes(this.active);
        },
    },
    methods: {
        onOpen() {
            this.$confirm(`是否立即启用？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                setUserConf({ accept_lover_request: 1 })
                    .then(() => {
                        this.$notify({
                            title: "开启成功",
                            type: "success",
                        });
                        this.isAllowLover = true;
                        this.loadRelationNetMembersByType();
                    })
                    .catch((err) => this.handleRequestError(err));
            });
        },
        handleRequestError(err) {
            const data = err?.response?.data;
            const message = data?.msg || data?.message || err?.message || "请求失败，请稍后再试";
            this.$notify({
                title: "操作失败",
                message,
                type: "error",
            });
        },
        isRelationTab(tab) {
            return this.relationNetTypes.some((item) => item.relationship_type === tab);
        },
        isNormalTab(tab) {
            return ["whitelist", "blacklist", "myfollow", "myfans"].includes(tab);
        },
        normalizeTab(tab) {
            if (!tab) {
                return this.relationNetTypes[0]?.relationship_type || "whitelist";
            }
            if (tab && this.isRelationTab(tab)) {
                return tab;
            }
            if (tab && this.isNormalTab(tab)) {
                return tab;
            }
            return "whitelist";
        },
        routeQuery() {
            const query = {
                tab: this.active,
            };
            if (this.active !== "whitelist") {
                if (this.keyword) {
                    query.keyword = this.keyword;
                }
                if (this.pagination.pageIndex > 1) {
                    query.page = this.pagination.pageIndex;
                }
                if (this.pagination.pageSize !== 10) {
                    query.pageSize = this.pagination.pageSize;
                }
            }
            return query;
        },
        syncRoute() {
            const query = this.routeQuery();
            const currentQuery = this.$route.query || {};
            const same =
                Object.keys(query).length === Object.keys(currentQuery).length &&
                Object.keys(query).every((key) => String(query[key]) === String(currentQuery[key]));

            if (!same) {
                this.$router.replace({
                    name: "privacy",
                    query,
                });
            }
        },
        loadRelationTab() {
            if (this.active == "lover") {
                this.loadConf();
            } else {
                this.loadRelationNetMembersByType();
            }
            this.loadWaitInvites();
            this.syncRoute();
        },
        initNormalTabQuery() {
            this.keyword = this.active === "whitelist" ? "" : this.$route.query.keyword || "";
            const page = Number(this.$route.query.page);
            const pageSize = Number(this.$route.query.pageSize);
            this.pagination.pageIndex = Number.isInteger(page) && page > 0 ? page : 1;
            this.pagination.pageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
        },
        resetSidebarSearch() {
            this.uid = "";
            this.userdata = "";
            this.flag = false;
        },
        setActiveTab(tab) {
            this.active = this.normalizeTab(tab);
            if (this.isRelationTab(this.active)) {
                this.loadRelationTab();
            } else {
                this.initNormalTabQuery();
                this.loadList();
            }
        },
        getUserId(item) {
            if (this.active === "whitelist") {
                return item.kith_id || item.user_id || item.ID || item.id;
            }
            if (this.active === "myfans") {
                return item.user_id || item.user_info?.id || item.user_info?.ID || item.id;
            }
            if (this.active === "blacklist") {
                return item.bind_user_id || item.user_id || item.user_info?.id || item.user_info?.ID || item.id;
            }
            return item.author_id || item.author_info?.id || item.author_info?.ID || item.user_id || item.id;
        },
        getUserInfo(item) {
            if (this.active === "whitelist") {
                return item.kith_info || item.user_info || item;
            }
            if (this.active === "myfollow") {
                return item.author_info || item.user_info || item.author || item;
            }
            return item.user_info || item.bind_user_info || item.author_info || item;
        },
        itemKey(item, i) {
            return `${this.active}-${this.getUserId(item) || item.id || i}`;
        },
        getResponseList(res) {
            const data = res?.data?.data;
            if (Array.isArray(data?.list)) return data.list;
            if (Array.isArray(data)) return data;
            return [];
        },
        getResponseTotal(res) {
            return res?.data?.data?.page?.total ?? 0;
        },
        runListRequest(request, resolveList) {
            request
                .then(resolveList)
                .catch((err) => {
                    this.list = [];
                    this.pagination.total = 0;
                    this.handleRequestError(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadConf() {
            getUserConf()
                .then((res) => {
                    this.isAllowLover = !!res?.data?.data?.accept_lover_request;
                    if (this.isAllowLover) {
                        this.loadRelationNetMembersByType();
                    }
                })
                .catch((err) => this.handleRequestError(err));
        },
        onRefresh(fn) {
            this?.[fn]();
        },
        async loadRelationNetTypes() {
            // 暂时只筛选官方的关系网类型 is_official & is_only_one
            return await getRelationNetTypes()
                .then((res) => {
                    this.relationNetTypes = res.data.data?.filter((item) => item.is_official && item.is_only_one);
                })
                .catch(() => {
                    this.relationNetTypes = [];
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
                .catch((err) => {
                    this.members = [];
                    this.net = {};
                    this.handleRequestError(err);
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
                .catch((err) => {
                    this.waitList = [];
                    this.handleRequestError(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        tabChange() {
            this.resetSidebarSearch();
            if (this.isRelationTab(this.active)) {
                this.loadRelationTab();
                return;
            }
            this.keyword = "";
            this.pagination.pageIndex = 1;
            this.loadList();
        },
        currentChange(val) {
            this.pagination.pageIndex = val;
            this.loadList();
        },
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.pagination.pageIndex = 1;
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
                .catch((err) => {
                    this.userdata = "";
                    this.handleRequestError(err);
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
            if (this.active === "whitelist" && !this.allowAppend) {
                this.$notify({
                    title: "提示",
                    message: this.isNewKith ? "亲友数量已达上限" : "该用户已添加",
                    type: "warning",
                });
                return;
            }
            const addFn = this.active === "myfollow" ? addRssUser : this.addFns[this.active];
            if (!addFn) return;
            if (this.active === "myfollow") {
                addFn(this.userdata.ID, { title: this.userdata.display_name })
                    .then(() => {
                        this.$notify({
                            title: "成功",
                            message: "关注成功",
                            type: "success",
                        });
                        this.loadList();
                    })
                    .catch((err) => this.handleRequestError(err));
            } else {
                addFn(this.userdata.ID)
                    .then(() => {
                        this.$notify({
                            title: "成功",
                            message: this.active === "blacklist" ? "拉黑成功" : "添加成功",
                            type: "success",
                        });
                        this.loadList();
                    })
                    .catch((err) => this.handleRequestError(err));
            }
        },
        // 加载列表
        loadList() {
            if (!this.isNormalTab(this.active)) {
                this.active = "whitelist";
            }
            this.loading = true;
            this.syncRoute();
            if (this.active === "whitelist") {
                this.runListRequest(getKithList(), (res) => {
                    let list = this.getResponseList(res);
                    if (Array.isArray(list)) {
                        list = list.sort((a, b) => {
                            return b.level - a.level;
                        });
                    }
                    this.list = list || [];
                });
            } else if (this.active === "myfollow") {
                const params = {
                    index: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                    q: this.keyword,
                    category: 2,
                };

                this.runListRequest(getMyRss(params), (res) => {
                    this.list = this.getResponseList(res);
                    this.pagination.total = this.getResponseTotal(res);
                });
            } else {
                const params = {
                    pageIndex: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                    display_name: this.keyword,
                };
                this.runListRequest(this.fns[this.active](params), (res) => {
                    this.list = this.getResponseList(res);
                    this.pagination.total = this.getResponseTotal(res);
                });
            }
        },
        // 删除亲友
        remove(kith_id, i) {
            removeKith(kith_id)
                .then(() => {
                    this.$notify({
                        title: "成功",
                        message: "删除成功",
                        type: "success",
                    });
                    this.list.splice(i, 1);
                })
                .catch((err) => this.handleRequestError(err));
        },
        // 编辑备注
        edit(kith_id, item) {
            this.$prompt("请输入备注", "设置", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(({ value }) => {
                    editKith(kith_id, { remark: value })
                        .then(() => {
                            this.$notify({
                                title: "成功",
                                message: "编辑成功",
                                type: "success",
                            });
                            item.remark = value;
                        })
                        .catch((err) => this.handleRequestError(err));
                })
                .catch(() => {});
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
                    const id = this.getUserId(item);
                    const removeFn = this.removeFns[this.active];
                    if (!id || !removeFn) return;

                    removeFn(id)
                        .then(() => {
                            this.$notify({
                                title: "成功",
                                message: "操作成功",
                                type: "success",
                            });
                            this.loadList();
                        })
                        .catch((err) => this.handleRequestError(err));
                })
                .finally(() => {});
        },
        userLink(item) {
            return authorLink(this.getUserId(item));
        },
        getAvatar(item) {
            const user = this.getUserInfo(item);
            return user?.avatar || user?.user_avatar;
        },
        getName(item) {
            const user = this.getUserInfo(item);
            return user?.display_name || user?.name || "匿名用户";
        },
        formatCreatedAt(item) {
            const createdAt = item?.created_at;
            if (!createdAt) return "--";

            const date = new Date(createdAt);
            if (isNaN(date.getTime())) return createdAt;

            return dateFormat(date);
        },
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
        authorLink,
    },
    mounted: function () {
        this.loadRelationNetTypes().then(() => {
            this.setActiveTab(this.$route.query.tab);
        });
        User.getAsset()
            .then((asset) => {
                if (User._isPRO(asset)) {
                    this.identity = "pro";
                } else if (User._isVIP(asset)) {
                    this.identity = "vip";
                } else {
                    this.identity = "member";
                }
            })
            .catch(() => {
                this.identity = "member";
            });
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/dashboard/whitelist.less";
</style>
