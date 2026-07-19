<template>
    <div class="m-dashboard-work m-dashboard-cms">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.feedback") }}</h2>
        </div>

        <!-- <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="Search"></el-button>
        </el-input>-->

        <div class="m-dashboard-work-filter">
            <clientBy class="u-client" @filter="filter" />
            <orderBy class="u-order" @filter="filter" />
        </div>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <PublishListError v-else-if="loadError" @retry="loadPosts" />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i class="u-icon">
                        <img
                            v-if="item.post_status == 'publish'"
                            svg-inline
                            src="@/assets/img/publish/works/repo.svg"
                        />
                        <img v-else svg-inline src="@/assets/img/publish/works/draft.svg" />
                    </i>
                    <a class="u-title" target="_blank" :href="postLink(item.post_type, item.ID)">{{
                        item.post_excerpt || $t("publish.common.untitled")
                    }}</a>
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.messageAt") }} :
                            {{ dateFormat(item.post_date) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Delete" :title="$t('publish.common.delete')" @click="del(item.ID, i)"></el-button>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                :title="$t('publish.common.noResults')"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                v-if="!loading && !loadError"
                class="m-dashboard-box-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                v-model:current-page="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMyPosts, push, del } from "@/service/publish/cms.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
import { __postType } from "@/utils/config";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "work",
    props: [],
    data: function () {
        return {
            loading: true,
            loadError: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            order: "update",
            client: "all",
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        params: function () {
            return {
                type: "feedback",
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
    },
    watch: {
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
            this.loadError = false;
            getMyPosts(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .catch(() => {
                    this.loadError = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        del: function (id, i) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        del(id).then((res) => {
                            this.$notify({
                                title: this.$t("publish.common.success"),
                                message: this.$t("publish.message.deleteSucceeded"),
                                type: "success",
                            });
                            this.data.splice(i, 1);
                            // location.reload();
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
                    message: this.$t("publish.message.operationSucceeded"),
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
                    message: this.$t("publish.message.operationSucceeded"),
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
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        typeFormat: function (val) {
            const key = {
                macro: "macros",
                bps: "classGuides",
                pvp: "pvpTips",
                fb: "dungeonGuides",
                tool: "tools",
                notice: "news",
            }[val];
            return key ? this.$t(`publish.types.${key}`) : __postType[val];
        },
        visibleFormat: function (val) {
            const key = ["public", "private", "friends", "password", "paid", "followers"][~~val];
            return this.$t(`publish.visibility.${key || "public"}`);
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
