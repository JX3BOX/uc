<template>
    <div class="m-dashboard-box" v-loading="loading">
        <div class="m-dashboard-msg-header">
            <el-input
                class="m-dashboard-work-search"
                :placeholder="$t('dashboard.common.searchPlaceholder')"
                v-model="currentSearch"
                @keyup.enter="handleChange"
                clearable
                size="large"
                @clear="handleChange"
            >
                <template #prepend>
                    <span>{{ $t("dashboard.common.keyword") }}</span>
                </template>
                <template #append>
                    <el-button icon="Search" @click="handleChange"></el-button>
                </template>
            </el-input>
        </div>
        <ul class="m-dashboard-box-list" v-if="data.length">
            <li v-for="(item, i) in filterData" :key="i">
                <i class="u-icon">
                    <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                </i>
                <a
                    class="u-title"
                    target="_blank"
                    :href="
                        getLink(item.category, (item.content_meta && item.content_meta.content_id) || item.source_id)
                    "
                    >{{ (item.content_meta && item.content_meta.title) || item.title || $t("dashboard.common.untitled") }}</a
                >
                <div class="u-desc">
                    <span class="u-category"><i class="el-icon-folder"></i> {{ getTypeLabel(item.category) }} </span>
                    <span><i class="el-icon-date"></i> {{ $t("dashboard.favorites.addedAtSimple", { time: dateFormat(item.created_at) }) }} </span>
                </div>
                <el-button-group class="u-action">
                    <el-button icon="Delete" :title="$t('dashboard.common.delete')" @click="del(item.id)"></el-button>
                </el-button-group>
            </li>
        </ul>
        <el-alert v-else class="m-dashboard-box-null" :title="$t('dashboard.common.noItems')" type="info" center show-icon> </el-alert>
        <el-pagination
            class="m-dashboard-box-pages"
            background
            :hide-on-single-page="true"
            :page-size="per"
            v-model:current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/moment";
import { deleteWaitWatch, getWaitWatch } from "@/service/dashboard/fav";

export default {
    name: "WaitList",
    props: {
        type: {
            type: String,
        },
        search: {
            type: String,
        },
    },
    data() {
        return {
            currentSearch: this.search,
            data: [],
            loading: false,
            total: 0,
            showPagination: false,
            page: 1,
            per: 10,
        };
    },
    emits: ["change-search"],
    watch: {
        currentSearch(val) {
            this.$emit("change-search", val);
        },
        type() {
            this.loadData();
        },
    },
    computed: {
        filterData() {
            return this.data;
        },
    },
    methods: {
        dateFormat,
        getTypeLabel(type) {
            type = type.replace(/dbm_/g, "");
            type = type.includes("community") ? "community" : type;
            return getTypeLabel(type);
        },
        getLink(type, id) {
            type = type.replace(/dbm_/g, "");
            type = type.includes("community") ? "community" : type;
            return getLink(type, id);
        },
        del(id) {
            this.$confirm(this.$t("dashboard.common.deleteRecordConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteWaitWatch(id).then(() => {
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
        loadData() {
            this.loading = true;
            const params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            if (this.currentSearch) params.title = this.currentSearch;
            if (this.type && this.type !== "all") params.category = this.type;
            getWaitWatch(params)
                .then(({ data }) => {
                    this.data = data.data.list || [];
                    this.total = data.data.page.total || 0;
                })
                .catch(() => {
                    this.data = [];
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        currentChange(val) {
            this.page = val;
            this.loadData();
        },
        handleChange() {
            this.page = 1;
            this.loadData();
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less"></style>
