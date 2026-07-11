<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-fav">
        <div class="m-dashboard-work-header">
            <h2 class="u-title"><i class="el-icon-star-off"></i> {{ $t("dashboard.favorites.title") }}</h2>
            <el-select v-model="searchType" :placeholder="$t('dashboard.favorites.typeFilter')" class="u-filter" @change="handleChange" style="width:200px;">
                <el-option :label="$t('dashboard.common.all')" value="all"> </el-option>
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-option-group>
            </el-select>
        </div>
        <el-tabs v-model="favChangeCount" @tab-change="loadData">
            <el-tab-pane :label="$t('dashboard.favorites.favorites')" name="fav">
                <template #label> <i class="el-icon-star-off"></i> {{ $t("dashboard.favorites.favorites") }} </template>
                <div v-if="favChangeCount === 'fav'" class="m-dashboard-box" v-loading="loading">
                    <div class="m-dashboard-msg-header">
                        <el-input
                            class="m-dashboard-work-search"
                            :placeholder="$t('dashboard.common.searchPlaceholder')"
                            v-model="search"
                            @keyup.enter="handleChange"
                            size="large"
                        >
                            <template #prepend>{{ $t("dashboard.common.keyword") }}</template>
                            <template #append>
                                <el-button icon="Search" @click="handleChange"></el-button>
                            </template>
                        </el-input>
                    </div>
                    <ul class="m-dashboard-box-list" v-if="data.length">
                        <li v-for="(item, i) in data" :key="i">
                            <i class="u-icon">
                                <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                            </i>
                            <a class="u-title" target="_blank" :href="getLink(item.post_type, item.post_id)">{{
                                item.post_title || $t("dashboard.common.untitled")
                            }}</a>
                            <div class="u-desc">
                                <span class="u-category"
                                    ><i class="el-icon-folder"></i> {{ getTypeLabel(item.post_type) }}
                                </span>
                                <span><i class="el-icon-date"></i> {{ $t("dashboard.favorites.addedAt", { time: dateFormat(item.created) }) }} </span>
                            </div>
                            <el-button-group class="u-action">
                                <el-button icon="Delete" :title="$t('dashboard.favorites.unfavorite')" @click="del(item.id)"></el-button>
                            </el-button-group>
                        </li>
                    </ul>
                    <el-alert v-else class="m-dashboard-box-null" :title="$t('dashboard.common.noItems')" type="info" center show-icon>
                    </el-alert>
                    <el-pagination
                        v-if="showPagination"
                        class="m-dashboard-box-pages"
                        background
                        :hide-on-single-page="true"
                        :page-size="per"
                        v-model:current-page="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                        @current-change="currentChange"
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('dashboard.favorites.subscriptions')" name="sub">
                <template #label> <i class="u-tab-icon el-icon-news"></i> {{ $t("dashboard.favorites.subscriptions") }} </template>
                <rss-list v-if="favChangeCount === 'sub'" />
            </el-tab-pane>
            <el-tab-pane :label="$t('dashboard.favorites.history')" name="log">
                <template #label> <i class="el-icon-time"></i> {{ $t("dashboard.favorites.history") }} </template>
                <visit-log
                    v-if="favChangeCount === 'log'"
                    :type="searchType"
                    :search="search"
                    @change-search="changeSearch"
                />
            </el-tab-pane>
            <el-tab-pane :label="$t('dashboard.favorites.watchLater')" name="watch_later">
                <template #label> <i class="el-icon-news"></i> {{ $t("dashboard.favorites.watchLater") }} </template>
                <wait-list
                    v-if="favChangeCount === 'watch_later'"
                    :type="searchType"
                    :search="search"
                    @change-search="changeSearch"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getMyFavs, delFav, deleteVisitHistory } from "@/service/dashboard/fav";
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { __postType, __wikiType, __appType, __gameType } from "@/utils/config";
import VisitLog from "@/components/dashboard/fav/visit_log.vue";
import WaitList from "@/components/dashboard/fav/wait_list.vue";
import RssList from "@/components/dashboard/fav/rss_list.vue";
export default {
    name: "fav",
    components: { WaitList, VisitLog, RssList },
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            showPagination: true,
            search: "",
            searchType: "all",
            options: [
                {
                    label: this.$t("dashboard.favorites.postWorks"),
                    options: Object.entries(__postType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: this.$t("dashboard.favorites.wikiEntries"),
                    options: Object.entries(__wikiType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: this.$t("dashboard.favorites.gameData"),
                    options: Object.entries(__gameType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: this.$t("dashboard.favorites.otherApps"),
                    options: Object.entries(__appType)
                        .map((item) => {
                            return { value: item[0], label: item[1] };
                        })
                        .map((item) => {
                            return {
                                label: item.label,
                                value: item.value == "community" ? "community_topic" : item.value,
                            };
                        }),
                },
            ],
            favChangeCount: "fav",
        };
    },
    computed: {
        subtype: function () {
            return this.$route.params.subtype || "";
        },
    },
    methods: {
        loadFav() {
            this.loading = true;
            this.showPagination = false;
            this.$router.push({
                name: "fav",
                query: {
                    page: this.page,
                    tabs: this.favChangeCount,
                },
            });
            const params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            if (this.search) params.post_title = this.search;
            if (this.searchType && this.searchType !== "all") params.post_type = this.searchType;
            getMyFavs(params)
                .then((res) => {
                    this.data = res.list || [];
                    this.total = res.page.total || 0;
                })
                .catch(() => {
                    this.data = [];
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        loadData() {
            if (this.favChangeCount === "fav") {
                this.loadFav();
            }
        },
        changeSearch(val) {
            this.search = val;
        },
        del: function (id) {
            this.$confirm(this.$t("dashboard.favorites.unfavoriteConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    delFav(id).then(() => {
                        this.$message({
                            type: "success",
                            message: this.$t("dashboard.favorites.unfavoriteSuccess"),
                        });
                        this.loadData();
                    });
                })
                .catch(() => {});
        },
        getLink,
        getTypeLabel(type) {
            type = type.replace(/dbm_/g, "");
            type = type.includes("community") ? "community" : type;
            return getTypeLabel(type);
        },
        dateFormat: function (val) {
            val = val * 1000;
            return dateFormat(new Date(val));
        },
        handleChange() {
            this.loadData();
        },
        currentChange: function (val) {
            this.page = val;
            this.loadData();
        },
    },
    watch: {
        searchType(val) {
            if (!val) val = "all";
            this.$router.push({ name: "fav", params: { subtype: val } });
        },
        favChangeCount() {
            this.$router.push({
                name: "fav",
                query: {
                    page: this.page,
                    tabs: this.favChangeCount,
                },
            });
        },
    },
    mounted: function () {
        this.favChangeCount = this.$route.query.tabs || "fav";
        this.page = Number(this.$route.query.page || 1);
        this.subtype && (this.searchType = this.subtype);
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/fav.less";
</style>
