<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ typeLabel }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布作品
            </a>
        </div>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-work-filter">
            <clientBy class="u-client" @filter="filter" :showWujie="showWujie" />
            <orderBy class="u-order" @filter="filter" />
        </div>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i class="u-icon">
                        <img src="@/assets/img/publish/works/repo.svg" v-if="item.post_status == 'publish'" />
                        <img v-else src="@/assets/img/publish/works/draft.svg" :title="item.post_status | statusFormat" />
                    </i>
                    <a class="u-title" target="_blank" :href="postLink(item.post_type, item.ID)">{{
                        item.post_title || "无标题"
                    }}</a>
                    <div class="u-desc">
                        <span class="u-desc-subitem">
                            <i class="el-icon-view"></i>
                            {{ item.visible | visibleFormat }}
                        </span>
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ item.post_date | dateFormat }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ item.post_modified | dateFormat }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            title="编辑"
                            @click="edit(item.post_type, item.ID)"
                        ></el-button>
                        <el-button size="mini" icon="el-icon-delete" title="删除" @click="del(item.ID)"></el-button>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                class="m-dashboard-box-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMyPosts, push, del } from "@/service/publish/cms.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
import { __postType, __visibleMap } from "@jx3box/jx3box-common/data/jx3box.json";
import dateFormat from "@/utils/dateFormat";
import statusMap from "@/assets/data/publish/status.json";
export default {
    name: "work",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            order: "update",
            client: "std",
            types: Object.assign(__postType, { joke: "剑三骚话" }),
            statusMap,
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        typeLabel: function () {
            return this.types[this.type];
        },
        params: function () {
            return {
                type: this.type,
                page: this.page,
                per: this.per,
                title: this.search,
                order: this.order,
                client: this.client,
            };
        },
        publishLink: function () {
            return "/publish/#/" + this.type;
        },
        showWujie: function () {
            return ["bps", "pvp", "bbs"].includes(this.type);
        },
    },
    watch: {
        type: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.page = 1;
            },
        },
        params: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getMyPosts(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        del: function (id) {
            this.$alert("确定要删除吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        del(id).then((res) => {
                            this.$message({
                                type: "success",
                                message: `删除成功`,
                            });
                            location.reload();
                        });
                    }
                },
            });
        },
        draft: function (id, i) {
            push(id, {
                publish_status: "draft",
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: `操作成功`,
                });
                this.data[i].post_status = "draft";
            });
        },
        publish: function (id, i) {
            push(id, {
                publish_status: "publish",
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: `操作成功`,
                });
                this.data[i].post_status = "publish";
            });
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
        filter: function (o) {
            this.page = 1;
            this[o.type] = o.val;
        },
        isSimpleType: function (val) {
            return simpleTypes.includes(val);
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        typeFormat: function (val) {
            return __postType[val];
        },
        visibleFormat: function (val) {
            return __visibleMap[~~val];
        },
        statusFormat: function (val) {
            return statusMap[val];
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";
</style>
