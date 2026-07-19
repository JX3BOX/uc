<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.postComments") }}</h2>
        </div>

        <el-input
            class="m-dashboard-work-search u-source-search"
            :placeholder="$t('publish.common.searchPlaceholder')"
            v-model="search"
            size="large"
        >
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <PublishListError v-else-if="loadError" @retry="loadData" />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <a class="u-title" target="_blank" :href="postLink(item.topic_id)"
                        ><i class="u-icon el-icon-chat-line-square"> </i>{{ item.content || $t("publish.common.unknown") }}</a
                    >
                    <!-- <span class="u-desc">{{item.content || '未知'}}</span> -->
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            <span class="u-time">{{ showTime(item.created_at) }}</span>
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-tooltip class="item" effect="dark" :content="$t('publish.common.delete')" placement="top-start">
                            <el-button icon="Delete" @click="del(item.id, i)"></el-button>
                        </el-tooltip>
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
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { getMyCommentList as getMyComments, deleteMyComment as deleteComment } from "@/service/publish/community";
import publishListSearch from "@/mixins/publishListSearch";
export default {
    name: "comments",
    props: [],
    mixins: [publishListSearch],
    data: function () {
        return {
            loading: true,
            loadError: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
        };
    },
    computed: {
        params: function () {
            return {
                per: this.per,
                page: this.page,
                search: this.requestSearch,
            };
        },
    },
    methods: {
        showTime,
        loadData: function () {
            this.loading = true;
            this.loadError = false;
            getMyComments(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .catch(() => {
                    this.loadError = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (id) {
            return `/community/${id}`;
        },
        del: function (id, i) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        deleteComment(id).then((res) => {
                            this.$message({
                                message: this.$t("publish.message.deleteSucceeded"),
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
