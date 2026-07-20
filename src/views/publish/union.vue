<template>
    <div class="m-dashboard-work m-dashboard-cms m-dashboard-union">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">
                {{ $t("publish.nav.collaboration") }}
                <span class="u-subtype">
                    <i class="el-icon-arrow-right"></i>
                    <span>{{ subtype }}</span>
                </span>
            </h2>
        </div>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <PublishListError v-else-if="loadError" @retry="loadPosts" />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li
                    v-for="(item, i) in data"
                    :key="`${isActive ? 'active' : 'passive'}-${item.union_post_raw ? item.union_post_raw.ID : i}`"
                >
                    <template v-if="item.union_post_raw">
                        <a
                            class="u-title"
                            target="_blank"
                            :href="postLink(item.union_post_raw.post_type, item.union_post_raw.ID)"
                        >
                            <i class="u-icon">
                                <img
                                    v-if="item.union_post_raw.visible == 0"
                                    svg-inline
                                    src="@/assets/img/publish/works/repo.svg"
                                />
                                <el-tooltip v-else :content="visibleFormat(item.union_post_raw.visible)" placement="top">
                                <img
                                    src="@/assets/img/publish/works/draft.svg"
                                    :title="statusFormat(item.union_post_raw.post_status)"
                                />
                            </el-tooltip>
                            </i>
                            {{ item.union_post_raw.post_title || $t("publish.common.untitled") }}
                        </a>
                        <div class="u-desc">
                            <!-- <span class="u-desc-subitem">
                                <i class="el-icon-view"></i>
                                {{ visibleFormat(item.union_post_raw.visible) }}
                            </span> -->
                            <time class="u-desc-subitem">
                                <i class="el-icon-finished"></i>
                                {{ $t("publish.common.publishedAt") }} :
                                {{ dateFormat(item.union_post_raw.post_date) }}
                            </time>
                            <time class="u-desc-subitem">
                                <i class="el-icon-refresh"></i>
                                {{ $t("publish.common.updatedAt") }} :
                                {{ dateFormat(item.union_post_raw.post_modified) }}
                            </time>
                        </div>

                        <el-button-group class="u-action">
                            <el-button
                                icon="Edit"
                                :title="$t('publish.common.edit')"
                                @click="edit(item.union_post_raw.post_type, item.union_post_raw.ID)"
                            ></el-button>
                            <el-button
                                v-if="isActive"
                                icon="Delete"
                                :title="$t('publish.common.delete')"
                                @click="del(item.union_post_raw.ID, i)"
                            ></el-button>
                            <el-popconfirm
                                v-else
                                :title="$t('publish.confirm.leaveCollaboration')"
                                @confirm="quit(item.union_post_raw.ID, i)"
                            >
                                <template #reference>
                                    <el-button class="u-quit" icon="Download" :title="$t('publish.common.leaveCollaboration')"></el-button>
                                </template>
                            </el-popconfirm>
                        </el-button-group>
                    </template>
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
import { del } from "@/service/publish/cms.js";
import { getUnionPosts, quitUnionPost } from "@/service/publish/union.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
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
            requestId: 0,
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
                is_active: ~~this.isActive,
            };
        },
        subtype: function () {
            return this.$route.name == "union_active"
                ? this.$t("publish.nav.invitedCreation")
                : this.$t("publish.nav.receivedCreation");
        },
        isActive: function () {
            return this.$route.name == "union_active";
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
            const requestId = ++this.requestId;
            this.loading = true;
            this.loadError = false;
            getUnionPosts(this.params)
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.data = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .catch(() => {
                    if (requestId === this.requestId) this.loadError = true;
                })
                .finally(() => {
                    if (requestId === this.requestId) this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
        quit: function (id, i) {
            quitUnionPost(id).then((res) => {
                this.$notify({
                    title: this.$t("publish.message.leaveSucceeded"),
                    message: this.$t("publish.message.leftCollaboration"),
                    type: "success",
                });
                this.data.splice(i, 1);
            });
        },
        del: function (id, i) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        del(id).then((res) => {
                            this.$notify({
                                title: this.$t("publish.message.deleteSucceeded"),
                                message: this.$t("publish.message.workDeleted"),
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
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
.m-dashboard-union {
    .u-quit {
        i {
            transform: rotate(-90deg);
        }
    }
    .u-subtype {
        .fz(12px);
        color: #999;
        // .ml(10px);
        font-weight: normal;
        span {
            color: #fba524;
        }
        i {
            padding-right: 10px;
        }
    }
}
</style>
