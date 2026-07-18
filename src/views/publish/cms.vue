<template>
    <div class="m-dashboard-work m-dashboard-cms">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ typeLabel }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button">
                <i class="el-icon-document"></i> {{ $t("publish.common.publishWork") }}
            </a>
        </div>

        <el-input class="m-dashboard-work-search" :placeholder="$t('publish.common.searchPlaceholder')" v-model="search" size="large">
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-work-filter">
            <clientBy class="u-client" @filter="filter" :showWujie="false" />
            <orderBy class="u-order" @filter="filter" />
        </div>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <a class="u-title" target="_blank" :href="postLink(item.post_type, item.ID)">
                        <i class="u-icon">
                            <img src="@/assets/img/publish/works/repo.svg" v-if="item.visible == 0" />
                            <el-tooltip v-else :content="visibleFormat(item.visible)" placement="top">
                                <img
                                    src="@/assets/img/publish/works/draft.svg"
                                    :title="statusFormat(item.post_status)"
                                />
                            </el-tooltip>
                        </i>
                        {{ item.post_title || $t("publish.common.untitled") }}</a
                    >
                    <div class="u-desc">
                        <!-- <span class="u-desc-subitem">
                            <i class="el-icon-view"></i>
                            {{ visibleFormat(item.visible) }}
                        </span> -->
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            <span class="u-time">{{ dateFormat(item.post_date) }}</span>
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            <span class="u-time">{{ dateFormat(item.post_modified) }}</span>
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Edit" :title="$t('publish.common.edit')" @click="edit(item.post_type, item.ID)"></el-button>
                        <el-button icon="Delete" :title="$t('publish.common.delete')" @click="del(item.ID)"></el-button>
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
                v-if="!loading"
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
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            order: "update",
            client: "std",
            requestId: 0,
            types: { ...__postType, joke: "剑三骚话" },
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        typeLabel: function () {
            return this.postTypeLabel(this.type, this.types[this.type]);
        },
        params: function () {
            return {
                type: this.type,
                page: this.page,
                per: this.per,
                title: this.search,
                order: this.order,
                client: this.client == 'all' ? '' : this.client,
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
        postTypeLabel(type, fallback) {
            const key = {
                macro: "macros",
                bps: "classGuides",
                pvp: "pvpTips",
                fb: "dungeonGuides",
                tool: "tools",
                notice: "news",
                joke: "jokes",
            }[type];
            return key ? this.$t(`publish.types.${key}`) : fallback;
        },
        loadPosts: function () {
            const requestId = ++this.requestId;
            this.loading = true;
            getMyPosts(this.params)
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    if (requestId === this.requestId) this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        del: function (id) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        del(id).then((res) => {
                            this.$message({
                                type: "success",
                                message: this.$t("publish.message.deleteSucceeded"),
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
        isSimpleType: function (val) {
            return simpleTypes.includes(val);
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        typeFormat: function (val) {
            return this.postTypeLabel(val, __postType[val]);
        },
        visibleFormat: function (val) {
            const key = ["public", "private", "friends", "password", "paid", "followers"][~~val];
            return this.$t(`publish.visibility.${key || "public"}`);
        },
        statusFormat: function (val) {
            const key = {
                publish: "published",
                draft: "draft",
                pending: "pendingReview",
                dustbin: "deleted",
            }[val];
            return this.$t(`publish.status.${key || "unknown"}`);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";
</style>
