<template>
    <div class="m-dashboard-box" v-loading="loading">
        <div class="m-dashboard-msg-header">
            <el-input
                class="m-dashboard-work-search"
                :placeholder="$t('dashboard.common.searchPlaceholder')"
                v-model="search"
                @keyup.enter="loadData"
                clearable
                size="large"
                @clear="loadData"
            >
                <template #prepend>
                    <span>{{ $t("dashboard.common.keyword") }}</span>
                </template>
                <template #append>
                    <el-button icon="Search" @click="loadData"></el-button>
                </template>
            </el-input>
        </div>
        <ul class="m-dashboard-box-list" v-if="data.length">
            <li v-for="(item, i) in data" :key="i">
                <i class="u-icon">
                    <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                </i>
                <a class="u-title" target="_blank" :href="getLink(item)">{{ item.overview.title || $t("dashboard.common.untitled") }}</a>
                <div class="u-desc">
                    <span class="u-category"><i class="el-icon-folder"></i> {{ getTypeLabel(item) }} </span>
                    <span><i class="el-icon-date"></i> {{ dateFormat(item.created_at) }} </span>
                </div>
                <el-button-group class="u-action">
                    <el-button icon="Delete" :title="$t('dashboard.common.deleteRecord')" @click="del(item.id)"></el-button>
                </el-button-group>
            </li>
        </ul>
        <el-alert v-else class="m-dashboard-box-null" :title="$t('dashboard.common.noItems')" type="info" center show-icon> </el-alert>
        <el-pagination
            class="m-dashboard-box-pages"
            background
            :hide-on-single-page="true"
            :page-size="pageSize"
            v-model:current-page="index"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentChange"
        />
    </div>
</template>

<script>
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/moment";
import { getRssList, deleteRss } from "@/service/dashboard/fav";

const categories = {
    2: "author",
    3: "community",
};

export default {
    name: "RssList",
    data() {
        return {
            search: "",
            data: [],
            loading: false,
            total: 0,

            index: 1,
            pageSize: 10,
        };
    },
    methods: {
        dateFormat,
        getTypeLabel(item) {
            let type = item.rss_category;
            if (categories[type]) {
                return this.$t(`dashboard.favorites.categories.${categories[type]}`);
            }
            type = item.post_type;
            return getTypeLabel(type);
        },
        getLink(item) {
            let type = item.rss_category;
            if (categories[type]) {
                return `/${categories[type]}/${~~item.post_id || ~~item.author_id}`;
            }
            type = item.post_type;
            return getLink(type, item.post_id);
        },
        del(id) {
            this.$confirm(this.$t("dashboard.favorites.deleteSubscriptionConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRss(id).then(() => {
                            this.$message({
                                type: "success",
                                message: this.$t("dashboard.common.operationSuccess"),
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        currentChange(val) {
            this.index = val;
            this.loadData();
        },
        loadData() {
            const params = {
                index: this.index,
                pageSize: this.pageSize,
                q: this.search,
                category: -2,
            };
            this.loading = true;
            getRssList(params)
                .then(({ data }) => {
                    this.data = data.data.list || [];
                    this.total = data.data.page?.total;
                })
                .catch(() => {
                    this.data = [];
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>
