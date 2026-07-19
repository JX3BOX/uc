<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.collection") }}</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> {{ $t("publish.collection.create") }}
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
            <PublishListError v-else-if="loadError" @retry="loadPosts" />
            <template v-else-if="data && data.length">
                <ul class="m-dashboard-box-list">
                    <li v-for="(item, i) in data" :key="i">
                        <a class="u-title" target="_blank" :href="getCollectionLink(item.id)">
                            <i class="u-icon">
                                <img v-if="item.public" svg-inline src="@/assets/img/publish/works/repo.svg" />
                                <img v-else svg-inline src="@/assets/img/publish/works/draft.svg" /> </i
                            >{{ item.title || $t("publish.common.untitled") }}
                        </a>
                        <div class="u-desc">
                            <time class="u-desc-subitem">
                                <i class="el-icon-finished"></i>
                                {{ $t("publish.common.publishedAt") }} :
                                <span class="u-time">{{ dateFormat(item.created) }}</span>
                            </time>
                            <time class="u-desc-subitem">
                                <i class="el-icon-refresh"></i>
                                {{ $t("publish.common.updatedAt") }} :
                                <span class="u-time">{{ dateFormat(item.updated) }}</span>
                            </time>
                        </div>
                        <el-button-group class="u-action">
                            <el-button icon="Edit" @click="post_edit(item.id)" :title="$t('publish.common.edit')"></el-button>
                            <el-button icon="Delete" @click="post_del(item.id)" :title="$t('publish.common.delete')"></el-button>
                        </el-button-group>
                    </li>
                </ul>
            </template>
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
import { remove_collection, get_my_collections } from "@/service/publish/collection";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import publishListSearch from "@/mixins/publishListSearch";
export default {
    name: "collection",
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
            type: "collection",
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                keyword: this.requestSearch,
                per: this.per,
            };
        },
        publishLink: function () {
            return "/publish/#/" + this.type;
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            this.loadError = false;
            get_my_collections(this.params)
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
        post_edit(id) {
            location.href = "/publish/#/collection/" + id;
        },
        post_del(id) {
            this.$confirm(this.$t("publish.confirm.deleteCollection"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        remove_collection(id).then((res) => {
                            this.$message({
                                type: "success",
                                message: this.$t("publish.message.deleteSucceeded"),
                            });
                            this.loadPosts();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val * 1000));
        },
        getCollectionLink: function (val) {
            return getLink("collection", val);
        },
    },
    mounted: function () {
        this.loadPosts();
    },
    components: {},
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
