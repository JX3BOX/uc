<template>
    <div class="m-dashboard m-dashboard-profile m-dashboard-work m-dashboard-whitelist m-whitelist">
        <div class="m-whitelist-primary">
            <h2 class="m-whitelist-title u-title"><i class="el-icon-ship"></i> {{ $t("dashboard.privacy.title") }}</h2>

            <el-tabs v-model="active" @tab-change="tabChange">
                <template v-if="relationNetTypes.length">
                    <el-tab-pane
                        :label="getRelationName(item)"
                        :name="item.relationship_type"
                        :key="i"
                        v-for="(item, i) in relationNetTypes"
                    >
                        <ContentSkeleton
                            v-if="loading && active === item.relationship_type"
                            variant="cards"
                            :rows="4"
                            :columns="2"
                        />
                        <lover
                            v-else-if="active === 'lover' && isRelationNet && !showOpen"
                            :list="members"
                            :waitList="waitList"
                            :relationId="relationId"
                            :relation-active-name="relationActiveName"
                            @refresh="onRefresh"
                        ></lover>
                        <div class="m-fun-open" v-else-if="showOpen">
                            <el-empty :description="$t('dashboard.privacy.notEnabled')"></el-empty>
                            <el-button type="success" @click="onOpen">{{ $t("dashboard.privacy.enableNow") }}</el-button>
                        </div>
                    </el-tab-pane>
                </template>
                <el-tab-pane :label="$t('dashboard.privacy.friends')" name="whitelist"></el-tab-pane>
                <el-tab-pane :label="$t('dashboard.privacy.following')" name="myfollow"></el-tab-pane>
                <el-tab-pane :label="$t('dashboard.privacy.followers')" name="myfans"></el-tab-pane>
                <el-tab-pane :label="$t('dashboard.privacy.blacklist')" name="blacklist"></el-tab-pane>
            </el-tabs>

            <template v-if="!isRelationNet">
                <ContentSkeleton v-if="loading" variant="cards" :rows="6" :columns="3" />
                <template v-else>
                    <el-input
                        class="m-privacy-search"
                        size="large"
                        :placeholder="$t('dashboard.common.searchPlaceholder')"
                        v-model="keyword"
                        @keyup.enter="handleChange"
                        clearable
                        @clear="handleChange"
                    >
                        <template #prepend>{{ $t("dashboard.common.keyword") }}</template>
                        <template #append>
                            <el-button icon="Search" @click="handleChange"></el-button>
                        </template>
                    </el-input>

                    <div class="m-whitelist-list u-list" v-if="list && list.length">
                        <div class="u-item" v-for="(item, i) in list" :key="itemKey(item, i)">
                            <div class="u-item-actions" v-if="!isReceivedKithInvitation(item)">
                                <el-dropdown trigger="click" placement="bottom-end">
                                    <span class="u-item-dropdown" @click.stop>
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-if="active === 'whitelist'" class="u-item-dropdown-menu">
                                                <el-popconfirm
                                                    :title="$t('dashboard.privacy.deleteFriendConfirm')"
                                                    @confirm="remove(item.kith_id, i)"
                                                >
                                                    <template #reference>
                                                        <span class="u-item-dropdown-action" @click.stop>{{ $t("dashboard.common.remove") }}</span>
                                                    </template>
                                                </el-popconfirm>
                                            </el-dropdown-item>
                                            <el-dropdown-item
                                                v-else
                                                class="u-item-dropdown-menu"
                                                @click="removeOther(item)"
                                            >
                                                {{ $t("dashboard.common.remove") }}
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
                                    {{ $t("dashboard.common.remark") }}：{{ item.remark || $t("dashboard.common.none") }}
                                    <i class="el-icon-edit-outline u-btn-edit" @click="edit(item.kith_id, item)"></i>
                                </span>
                                <div class="u-item-invitation" v-else-if="isReceivedKithInvitation(item)">
                                    <span class="u-item-remark u-pending">{{ $t("dashboard.privacy.invitesYou") }}</span>
                                    <div class="u-item-invitation-actions">
                                        <el-button
                                            size="small"
                                            type="primary"
                                            :loading="invitationLoadingId === item.kith_id"
                                            @click="handleKithInvitation(item, true)"
                                        >{{ $t("dashboard.common.accept") }}</el-button>
                                        <el-button
                                            size="small"
                                            :disabled="invitationLoadingId === item.kith_id"
                                            @click="handleKithInvitation(item, false)"
                                        >{{ $t("dashboard.common.reject") }}</el-button>
                                    </div>
                                </div>
                                <span class="u-item-remark u-pending" v-else> <i class="el-icon-loading"></i> {{ $t("dashboard.privacy.awaitingConfirmation") }} </span>
                            </template>
                            <div class="u-item-time" :title="$t('dashboard.privacy.createdAtValue', { time: formatCreatedAt(item) })">
                                {{ $t("dashboard.privacy.createdAt") }}：{{ formatCreatedAt(item) }}
                            </div>
                        </div>
                    </div>
                    <el-empty v-else :description="$t('dashboard.common.noItems')" />
                    <el-pagination
                        class="m-whitelist-pagination"
                        background
                        v-if="active !== 'whitelist' && pagination.total"
                        :page-sizes="[10, 20, 50]"
                        v-model:current-page="pagination.pageIndex"
                        v-model:page-size="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="currentChange"
                        @size-change="handleSizeChange"
                        :total="pagination.total"
                    ></el-pagination>
                </template>
            </template>
        </div>
        <div class="m-whitelist-sidebar" v-if="active !== 'myfans' && !isRelationNet">
            <div class="u-title"><i class="el-icon-news"></i> {{ sideTitle }}</div>
            <el-input
                class="u-input"
                v-model.number="uid"
                :placeholder="$t('dashboard.privacy.uidPlaceholder')"
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
                    <i class="u-item-exist" v-if="!isNewKith">{{ $t("dashboard.privacy.added") }}</i>
                </div>
            </div>
            <div class="u-null" v-if="isNull">
                <el-alert :title="$t('dashboard.common.noSearchResults')" type="info" show-icon :closable="false"></el-alert>
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
    acceptKithInvitation,
    refuseKithInvitation,
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
            kithList: [],
            loading: true,
            loadingCount: 0,
            invitationLoadingId: 0,

            // 侧边栏
            uid: "",
            userdata: "",
            flag: false,

            // 上限
            limit_map: {
                member: 100,
                vip: 100,
                pro: Infinity,
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
            const relation = this.relationNetTypes.find((item) => item.relationship_type === this.active);
            return this.getRelationName(relation);
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
            const list = this.active === "whitelist" ? this.kithList : this.list;
            return list.map((item) => {
                return item.kith_id;
            });
        },
        // 上限
        limit: function () {
            return this.limit_map[this.identity] || 100;
        },
        displayLimit: function () {
            return Number.isFinite(this.limit) ? this.limit : this.$t("dashboard.privacy.unlimited");
        },
        // 当前亲友总数
        total: function () {
            if (this.active === "whitelist") {
                return this.kithList?.length || 0;
            }
            return this.list?.length || 0;
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
                ? this.$t("dashboard.common.add")
                : {
                      blacklist: this.$t("dashboard.privacy.block"),
                      myfollow: this.$t("dashboard.privacy.follow"),
                      whitelist: this.$t("dashboard.privacy.addFriendCount", { total: this.total, limit: this.displayLimit }),
                  }[this.active];
        },
        sideTitle() {
            return this.isRelationNet
                ? this.relationActiveName
                : {
                      blacklist: this.$t("dashboard.privacy.addBlacklist"),
                      myfollow: this.$t("dashboard.privacy.addFollow"),
                      whitelist: this.$t("dashboard.privacy.addFriend"),
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
        beginLoading() {
            this.loadingCount += 1;
            this.loading = true;
        },
        endLoading() {
            this.loadingCount = Math.max(0, this.loadingCount - 1);
            this.loading = this.loadingCount > 0;
        },
        isReceivedKithInvitation(item) {
            return !item.status && !!item.invitation_received;
        },
        handleKithInvitation(item, accepted) {
            const name = this.getName(item);
            const confirmKey = accepted ? "acceptInvitationConfirm" : "rejectInvitationConfirm";
            const successKey = accepted ? "acceptInvitationSuccess" : "rejectInvitationSuccess";
            const request = accepted ? acceptKithInvitation : refuseKithInvitation;

            this.$confirm(
                this.$t(`dashboard.privacy.${confirmKey}`, { name }),
                this.$t("dashboard.common.tip"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    type: "warning",
                }
            )
                .then(() => {
                    this.invitationLoadingId = item.kith_id;
                    return request(item.kith_id).then(() => {
                        this.$notify({
                            title: this.$t("dashboard.common.success"),
                            message: this.$t(`dashboard.privacy.${successKey}`),
                            type: "success",
                        });
                        this.loadList();
                    });
                })
                .catch((err) => {
                    if (err !== "cancel" && err !== "close") this.handleRequestError(err);
                })
                .finally(() => {
                    this.invitationLoadingId = 0;
                });
        },
        getRelationName(item) {
            if (item?.relationship_type === "lover") {
                return this.$t("dashboard.relationship.myRelationship");
            }
            return item?.name || "";
        },
        onOpen() {
            this.$confirm(this.$t("dashboard.privacy.enableConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            }).then(() => {
                setUserConf({ accept_lover_request: 1 })
                    .then(() => {
                        this.$notify({
                            title: this.$t("dashboard.privacy.enableSuccess"),
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
            const message = data?.msg || data?.message || err?.message || this.$t("dashboard.common.requestFailed");
            this.$notify({
                title: this.$t("dashboard.common.operationFailed"),
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
            if (!this.isRelationNet && this.keyword) {
                query.keyword = this.keyword;
            }
            if (this.active !== "whitelist") {
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
            this.keyword = this.$route.query.keyword || "";
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
                    this.endLoading();
                });
        },
        loadConf() {
            this.beginLoading();
            getUserConf()
                .then((res) => {
                    this.isAllowLover = !!res?.data?.data?.accept_lover_request;
                    if (this.isAllowLover) {
                        this.loadRelationNetMembersByType();
                    }
                })
                .catch((err) => this.handleRequestError(err))
                .finally(() => this.endLoading());
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
            if (this.active === "whitelist") {
                this.applyKithFilter();
                this.syncRoute();
                return;
            }
            this.loadList();
        },
        getKithSearchText(item) {
            return [
                item.kith_id,
                item.user_id,
                item.ID,
                item.id,
                item.remark,
                this.getName(item),
                this.getUserInfo(item)?.display_name,
                this.getUserInfo(item)?.name,
            ]
                .filter((val) => val !== undefined && val !== null)
                .join(" ")
                .toLowerCase();
        },
        applyKithFilter() {
            const keyword = String(this.keyword || "")
                .trim()
                .toLowerCase();
            if (!keyword) {
                this.list = this.kithList;
                return;
            }
            this.list = this.kithList.filter((item) => this.getKithSearchText(item).includes(keyword));
        },
        loadRelationNetMembersByType() {
            // 加载关系网成员
            // 官方关系网类型且唯一
            const type = this.active;
            this.beginLoading();
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
                    this.endLoading();
                });
        },
        // 获取待处理的关系邀请
        loadWaitInvites() {
            this.beginLoading();
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
                    this.endLoading();
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
                    title: this.$t("dashboard.common.tip"),
                    message: this.$t("dashboard.privacy.searchUidFirst"),
                    type: "warning",
                });
                return;
            }
            if (this.active === "whitelist" && !this.allowAppend) {
                this.$notify({
                    title: this.$t("dashboard.common.tip"),
                    message: this.isNewKith ? this.$t("dashboard.privacy.friendLimit") : this.$t("dashboard.privacy.userAdded"),
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
                            title: this.$t("dashboard.common.success"),
                            message: this.$t("dashboard.privacy.followSuccess"),
                            type: "success",
                        });
                        this.loadList();
                    })
                    .catch((err) => this.handleRequestError(err));
            } else {
                addFn(this.userdata.ID)
                    .then(() => {
                        this.$notify({
                            title: this.$t("dashboard.common.success"),
                            message: this.active === "blacklist" ? this.$t("dashboard.privacy.blockSuccess") : this.$t("dashboard.common.addSuccess"),
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
            this.beginLoading();
            this.syncRoute();
            if (this.active === "whitelist") {
                this.runListRequest(getKithList(), (res) => {
                    let list = this.getResponseList(res);
                    if (Array.isArray(list)) {
                        list = list.sort((a, b) => {
                            return b.level - a.level;
                        });
                    }
                    this.kithList = list || [];
                    this.applyKithFilter();
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
        remove(kith_id) {
            removeKith(kith_id)
                .then(() => {
                    this.$notify({
                        title: this.$t("dashboard.common.success"),
                        message: this.$t("dashboard.common.deleteSuccess"),
                        type: "success",
                    });
                    this.kithList = this.kithList.filter((item) => item.kith_id !== kith_id);
                    this.applyKithFilter();
                })
                .catch((err) => this.handleRequestError(err));
        },
        // 编辑备注
        edit(kith_id, item) {
            this.$prompt(this.$t("dashboard.common.remarkPlaceholder"), this.$t("dashboard.common.settings"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
            })
                .then(({ value }) => {
                    editKith(kith_id, { remark: value })
                        .then(() => {
                            this.$notify({
                                title: this.$t("dashboard.common.success"),
                                message: this.$t("dashboard.common.editSuccess"),
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
            const message = this.$t(`dashboard.privacy.removeConfirm.${this.active}`);
            this.$confirm(message, this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
            })
                .then(() => {
                    const id = this.getUserId(item);
                    const removeFn = this.removeFns[this.active];
                    if (!id || !removeFn) return;

                    removeFn(id)
                        .then(() => {
                            this.$notify({
                                title: this.$t("dashboard.common.success"),
                                message: this.$t("dashboard.common.operationSuccess"),
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
            return user?.display_name || user?.name || this.$t("dashboard.common.anonymousUser");
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
        this.beginLoading();
        this.loadRelationNetTypes()
            .then(() => {
                this.setActiveTab(this.$route.query.tab);
            })
            .finally(() => this.endLoading());
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
