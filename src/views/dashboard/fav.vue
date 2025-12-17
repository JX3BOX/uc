<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-fav">
        <div class="m-dashboard-work-header">
            <h2 class="u-title"><i class="el-icon-star-off"></i> 收藏订阅</h2>
            <el-select v-model="searchType" placeholder="类型过滤" class="u-filter" size="small" @change="handleChange">
                <el-option label="全部" value="all"> </el-option>
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-option-group>
            </el-select>
        </div>
        <el-tabs v-model="favChangeCount" @tab-click="loadData">
            <el-tab-pane label="收藏" name="fav">
                <span slot="label"><i class="el-icon-star-off"></i> 收藏</span>
                <div v-if="favChangeCount === 'fav'" class="m-dashboard-box" v-loading="loading">
                    <div class="m-dashboard-msg-header">
                        <el-input
                            class="m-dashboard-work-search"
                            placeholder="请输入搜索内容"
                            v-model="search"
                            @keyup.enter.native="handleChange"
                        >
                            <template slot="prepend">关键词</template>
                            <el-button slot="append" icon="el-icon-search" @click="handleChange"></el-button>
                        </el-input>
                    </div>
                    <ul class="m-dashboard-box-list" v-if="data.length">
                        <li v-for="(item, i) in data" :key="i">
                            <i class="u-icon">
                                <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                            </i>
                            <a class="u-title" target="_blank" :href="getLink(item.post_type, item.post_id)">{{
                                item.post_title || "无标题"
                            }}</a>
                            <div class="u-desc">
                                <span class="u-category"
                                    ><i class="el-icon-folder"></i> {{ getTypeLabel(item.post_type) }}
                                </span>
                                <span><i class="el-icon-date"></i> 于 {{ dateFormat(item.created) }} 加入收藏 </span>
                            </div>
                            <el-button-group class="u-action">
                                <el-button
                                    size="mini"
                                    icon="el-icon-delete"
                                    title="取消收藏"
                                    @click="del(item.id)"
                                ></el-button>
                            </el-button-group>
                        </li>
                    </ul>
                    <el-alert v-else class="m-dashboard-box-null" title="没有找到相关条目" type="info" center show-icon>
                    </el-alert>
                    <el-pagination
                        v-if="showPagination"
                        class="m-dashboard-box-pages"
                        background
                        :hide-on-single-page="true"
                        :page-size="per"
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                        @current-change="currentChange"
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="订阅" name="sub">
                <span slot="label"><i class="u-tab-icon el-icon-news"></i> 订阅</span>
                <rss-list
                    v-if="favChangeCount === 'sub'"
                />
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="log">
                <span slot="label"><i class="el-icon-time"></i> 历史记录 </span>
                <visit-log
                    v-if="favChangeCount === 'log'"
                   :type="searchType"
                   :search="search"
                   @change-search="changeSearch"
                />
            </el-tab-pane>
            <el-tab-pane label="稍后再看" name="watch_later">
                <span slot="label"><i class="el-icon-news"></i> 稍后再看</span>
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
                    label: "文章作品",
                    options: Object.entries(__postType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: "百科词条",
                    options: Object.entries(__wikiType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: "游戏资料",
                    options: Object.entries(__gameType).map((item) => {
                        return { value: item[0], label: item[1] };
                    }),
                },
                {
                    label: "其它应用",
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
        loadFav(){
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
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        loadData() {
            if (this.favChangeCount === 'fav'){
                this.loadFav()
            }
        },
        changeSearch(val){
            this.search = val;
        },
        del: function (id) {
            this.$confirm('确定要取消收藏吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delFav(id).then(() => {
                    this.$message({
                        type: "success",
                        message: `取消收藏成功`,
                    });
                    this.loadData();
                });
            }).catch(() => {
            });
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
        favChangeCount(){
            this.$router.push({
                name: "fav",
                query: {
                    page: this.page,
                    tabs: this.favChangeCount,
                },
            });
        }
    },
    mounted: function () {
        this.favChangeCount = this.$route.query.tabs || "fav";
        this.page = Number(this.$route.query.page || 1);
        this.subtype && (this.searchType = this.subtype);
        this.loadData();
    },
};
</script>

<style  lang="less">
@import "~@/assets/css/dashboard/fav.less";
</style>
