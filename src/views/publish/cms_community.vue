<template>
    <div class="m-dashboard-work m-dashboard-cms p-cms-community">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.forum") }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> {{ $t("publish.common.publishWork") }}
            </a>
        </div>

        <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('publish.types.topic')" name="topic"></el-tab-pane>
            <el-tab-pane :label="$t('publish.types.reply')" name="reply"></el-tab-pane>
        </el-tabs>

        <el-input class="m-dashboard-work-search" :placeholder="$t('publish.common.searchPlaceholder')" v-model="search" size="large">
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-work-filter" v-if="activeTab == 'topic'">
            <!-- <clientBy class="u-client" @filter="filter" :showWujie="showWujie" /> -->
            <!-- <orderBy class="u-order" @filter="filter" /> -->
        </div>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <a class="u-title" target="_blank" :href="postLink(item)">
                        <i class="u-icon">
                            <img src="@/assets/img/publish/works/repo.svg" v-if="item.visible == 0" />
                            <el-tooltip v-else :content="visibleFormat(item.is_self_visit || item.visible)" placement="top">
                                <img
                                    src="@/assets/img/publish/works/draft.svg"
                                />
                            </el-tooltip>
                        </i>
                        <span v-if="activeTab == 'topic'">{{ item.title || item.content || $t("publish.common.untitled") }}</span>
                        <span class="u-title_content" v-else v-html="getContent(item)"></span>
                        <!-- <div class="u-tags">
                            <el-tag type="danger" v-if="item.is_top == 1">{{ $t("publish.status.pinned") }}</el-tag>
                            <el-tag type="danger" v-if="item.is_star == 1">{{ $t("publish.status.featured") }}</el-tag>
                            <el-tag type="danger" v-if="item.is_hight == 1">{{ $t("publish.status.highlighted") }}</el-tag>
                        </div> -->
                    </a>
                    <div class="u-desc">
                        <!-- <span class="u-desc-subitem">
                            <i class="el-icon-view"></i>
                            {{ visibleFormat(item.is_self_visit || item.visible) }}
                        </span> -->
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            <span class="u-time">{{ dateFormat(item.created_at) }}</span>
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            <span class="u-time">{{ dateFormat(item.updated_at) }}</span>
                        </time>
                        <!-- <time class="u-desc-subitem">
                            <i class="el-icon-receiving"></i>
                            {{ $t("publish.common.status") }} :
                            {{ getStatusCn(item.status) }}
                        </time> -->
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Edit" :title="$t('publish.common.edit')" @click="edit(item)"></el-button>
                        <el-button icon="Delete" :title="$t('publish.common.delete')" @click="del(item)"></el-button>
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
import { getMyList, del, getMyReplyList, deleteMyReply } from "@/service/publish/community.js";
import dateFormat from "@/utils/dateFormat";
import { pick } from "lodash";
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
            content: "",
            // order: "update",
            client: "",
            search: "",

            activeTab: "topic",
            requestId: 0,
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        params: function () {
            return {
                type: this.type,
                title: this.search || undefined,
                // order: this.order,
                pageSize: this.per,
                index: this.page,
                // client: this.client,
            };
        },
        publishLink: function () {
            return "/publish/#/community";
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
        activeTab: {
            handler: function () {
                this.page = 1;
                this.loadPosts();
            },
        },
    },
    methods: {
        getStatusCn: function (status) {
            switch (status) {
                case 1:
                    return this.$t("publish.status.normal");
                case 2:
                    return this.$t("publish.status.pendingReview");
                case 3:
                    return this.$t("publish.status.rejected");

                default:
                    return this.$t("publish.status.unknown");
            }
        },
        loadPosts: function () {
            const requestId = ++this.requestId;
            this.loading = true;
            this.data = [];
            if (this.activeTab == "topic") {
                getMyList(this.params)
                    .then((res) => {
                        if (requestId !== this.requestId) return;
                        this.data = res.data.data.list;
                        this.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        if (requestId === this.requestId) this.loading = false;
                    });
            } else {
                const params = pick(this.params, ["pageSize", "index"]);
                this.search && (params.content = this.search);
                getMyReplyList(params)
                    .then((res) => {
                        if (requestId !== this.requestId) return;
                        this.data = res.data.data.list;
                        this.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        if (requestId === this.requestId) this.loading = false;
                    });
            }
        },
        edit: function (item) {
            const routeName = this.activeTab == "topic" ? "community" : "community_reply";

            const path = this.$router.resolve({
                name: routeName,
                params: {
                    id: item.id,
                },
            });

            window.open(path.href, "_blank");
        },
        del: function (item) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        const fn = this.activeTab == "topic" ? del : deleteMyReply;
                        fn(item.id).then(() => {
                            this.$message({
                                type: "success",
                                message: this.$t("publish.message.deleteSucceeded"),
                            });

                            this.page = 1;
                            this.loadPosts();
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
        postLink: function (item) {
            return this.activeTab == "topic" ? `/community/${item.id}` : `/community/${item.topic_id}`;
        },
        filter: function (o) {
            this.page = 1;
            this[o.type] = o.val;
        },
        isSimpleType: function (val) {
            return simpleTypes.includes(val);
        },
        getContent(item) {
            const val = item.content;
            if (val) {
                return this.$t("publish.community.replyPreview", {
                    floor: item.floor,
                    title: item?.topic?.title,
                    content: val.slice(0, 12),
                });
            }
            return "";
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
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

.p-cms-community {
    .u-title {
        .u-tags {
            display: flex;
            gap: 4px;
        }

        p {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    .u-title_content {
        .flex;

        p {
            margin-left: 5px;
        }
    }
}
</style>
