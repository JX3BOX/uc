<template>
    <div class="m-dashboard-work m-dashboard-cms">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.faceData") }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> {{ $t("publish.common.publishData") }}
            </a>
        </div>

        <el-input class="m-dashboard-work-search" :placeholder="$t('publish.common.searchPlaceholder')" v-model.lazy="search" size="large">
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <PublishListError v-else-if="loadError" @retry="loadPosts" />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <a class="u-title" target="_blank" :href="postLink(item.id)">
                        <i class="u-icon">
                            <img src="@/assets/img/publish/works/repo.svg" v-if="item.status == 1" />
                            <img
                                v-else
                                src="@/assets/img/publish/works/draft.svg"
                                :title="$t('publish.status.offline')"
                            />
                        </i>
                        {{ item.title || $t("publish.common.unnamed") }}</a
                    >
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            <span class="u-time">{{ item.created_at }}</span>
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            <span class="u-time">{{ item.updated_at }}</span>
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Edit" @click="edit(item.id)" :title="$t('publish.common.edit')"></el-button>
                        <el-button
                            v-if="item.status == 1"
                            icon="Download"
                            @click="handleOffline(item.id)"
                            :title="$t('publish.common.takeOffline')"
                        ></el-button>
                        <el-button v-else icon="Upload" @click="handleOnline(item.id)" :title="$t('publish.common.putOnline')"></el-button>
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
import { getFaceList, faceOnline, faceOffline, delFace } from "@/service/publish/face.js";
export default {
    name: "face",
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
        };
    },
    computed: {
        params: function () {
            return {
                pageIndex: this.page,
                pageSize: this.per,
                title: this.search,
            };
        },
        publishLink: function () {
            return "/publish/#/face";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            this.loadError = false;
            const _params = {
                ...this.params,
            };
            getFaceList(_params)
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
        edit: function (id) {
            location.href = "/publish/#/face/" + id;
        },
        postLink: function (id) {
            return "/face/" + id;
        },
        handleOnline: function (id) {
            faceOnline(id).then((res) => {
                this.$message.success(this.$t("publish.message.onlineSucceeded"));
                this.loadPosts();
            });
        },
        handleOffline: function (id) {
            this.$confirm(this.$t("publish.confirm.takeOffline"), this.$t("publish.common.prompt"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
                type: "warning",
            }).then(() => {
                faceOffline(id).then((res) => {
                    this.$message.success(this.$t("publish.message.offlineSucceeded"));
                    this.loadPosts();
                });
            });
        },
        del(id) {
            this.$confirm(this.$t("publish.confirm.permanentDelete"), this.$t("publish.common.prompt"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
                type: "warning",
            }).then(() => {
                delFace(id).then((res) => {
                    this.$message.success(this.$t("publish.message.deleteSucceeded"));
                    this.loadPosts();
                });
            });
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
