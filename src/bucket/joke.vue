<template>
    <div class="m-dashboard-work m-dashboard-cms">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.jokes") }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> {{ $t("publish.joke.publish") }}
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

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <div class="u-header">
                        <i class="u-item-icon el-icon-chat-dot-round" v-if="item.status"></i>
                        <i class="u-item-icon el-icon-lock" v-else :title="$t('publish.status.pendingReview')"></i>
                        <a class="u-title" target="_blank" :href="postLink(type, item.id)">{{
                            item.desc || $t("publish.common.unnamed")
                        }}</a>
                    </div>
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            {{ dateFormat(item.created_at) }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            {{ dateFormat(item.updated_at) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Edit" @click="edit(type, item.id)" :title="$t('publish.common.edit')"></el-button>
                        <el-button icon="Delete" @click="del(item.id, i)" :title="$t('publish.common.delete')"></el-button>
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
import { getMyJokes, deleteJoke } from "@/service/publish/pvx.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "joke",
    props: [],
    data: function () {
        return {
            loading: true,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
            type: "joke",
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
                search: this.search,
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
            getMyJokes(this.params)
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
        del: function (id, i) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        deleteJoke(id).then((res) => {
                            this.$notify({
                                title: this.$t("publish.message.deleteSucceeded"),
                                message: this.$t("publish.joke.deleteSucceeded"),
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
