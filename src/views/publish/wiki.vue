<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.wikiTitle", { type: typeLabel }) }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary"
                ><i class="el-icon-document"></i> {{ $t("publish.common.publishWork") }}</a
            >
        </div>

        <el-input
            class="m-dashboard-work-search u-source-search"
            :placeholder="$t('publish.common.searchPlaceholder')"
            v-model="achievement_post.keyword"
            @change="search_post"
            size="large"
        >
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search" @click="search_post"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="length" compact />
            <PublishListError v-else-if="loadError" @retry="post_page_change(post_page)" />
            <ul
                v-else-if="achievement_post.data && achievement_post.data.length"
                class="m-dashboard-box-list"
            >
                <li class="u-wiki" v-for="(post, key) in achievement_post.data" :key="key">
                    <span class="u-tab" v-text="getTypeLabel(post.type)"></span>
                    <div class="u-header">
                        <a class="u-title" target="_blank" :href="getLink(post)">
                            {{ post.title || $t("publish.common.untitled") }}
                        </a>
                        <el-tag type="warning" size="small" v-if="post.checked == 0">{{ $t("publish.status.pendingReview") }}</el-tag>
                        <el-tag type="success" size="small" v-if="post.checked == 1">{{ $t("publish.status.approved") }}</el-tag>
                        <el-tag type="danger" size="small" v-if="post.checked == 2">{{ $t("publish.status.rejected") }}</el-tag>
                        <el-tag type="warning" size="small" v-if="post.checked == 3">{{ $t("publish.status.pendingVerification") }}</el-tag>
                    </div>
                    <div class="u-desc">
                        <span
                            v-if="post.checked == 2 && post.check_remark"
                            class="u-check_remark"
                            v-html="$t('publish.status.rejectionReason', { reason: post.check_remark })"
                        ></span>
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            {{ dateFormat(new Date(post.created * 1000)) }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            {{ dateFormat(new Date(post.updated * 1000)) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button
                            icon="Edit"
                            :disabled="post.checked == 1 || post.checked == 3"
                            :title="$t('publish.common.edit')"
                            @click="post_edit(post)"
                        ></el-button>
                        <el-button icon="Delete" :title="$t('publish.common.delete')" @click="post_del(post)"></el-button>
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
                :total="achievement_post.total"
                hide-on-single-page
                layout="total, prev, pager, next, jumper"
                :current-page="post_page"
                :page-size="length"
                @current-change="post_page_change"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { __wikiType } from "@/utils/config";
import dateFormat from "@/utils/dateFormat";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
const wikiTypes = { ...__wikiType };
export default {
    name: "wiki",
    props: [],
    data: function () {
        return {
            loading: true,
            loadError: false,

            achievement_post: {
                data: null,
                total: 0,
                keyword: null,
            },
            post_page: 1,
            length: 10,
            requestId: 0,
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        typeLabel: function () {
            return this.wikiTypeLabel(this.type, wikiTypes[this.type]);
        },
        publishLink: function () {
            return "/publish/#/" + this.type;
        },
    },
    methods: {
        getTypeLabel: function (val) {
            return this.wikiTypeLabel(val, wikiTypes[val]);
        },
        wikiTypeLabel(type, fallback) {
            const key = {
                achievement: "achievements",
                item: "items",
                quest: "quests",
                knowledge: "knowledge",
                skill: "skills",
            }[type];
            return key ? this.$t(`publish.mobile.${key}`) : fallback;
        },
        post_page_change(i = 1) {
            const requestId = ++this.requestId;
            this.post_page = i;
            this.loading = true;
            this.loadError = false;
            wiki.mine({
                type: this.type,
                _search: this.achievement_post.keyword,
                page: i,
                per: this.length,
            })
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.achievement_post.data = res.data.data.list || [];
                    this.achievement_post.total = res.data.data.total || 0;
                })
                .catch(() => {
                    if (requestId !== this.requestId) return;
                    this.loadError = true;
                })
                .finally(() => {
                    if (requestId !== this.requestId) return;
                    this.loading = false;
                });
        },
        search_post() {
            this.post_page_change(1);
        },
        post_edit(post) {
            this.$router.push({
                path: `/${this.type}/${post.source_id}?post_id=${post.id}`,
            });
        },
        post_del(post) {
            this.$confirm(this.$t("publish.confirm.delete"), this.$t("publish.common.prompt"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        wiki.remove(post.id)
                            .then(() => {
                                this.$message.success(this.$t("publish.message.deleteSucceeded"));
                                this.post_page_change();
                            })
                            .catch(() => {
                                this.$message.error(this.$t("publish.message.requestFailed"));
                            })
                            .finally(done);
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        getLink: function (post) {
            return getLink(post?.type, post?.source_id) + "/" + post?.id;
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
    watch: {
        "$route.params.type": {
            immediate: true,
            handler(type, previousType) {
                if (previousType && type !== previousType) {
                    this.achievement_post.keyword = "";
                }
                this.post_page_change();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/wiki.less";
</style>
