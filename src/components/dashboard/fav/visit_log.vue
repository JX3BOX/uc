<template>
    <div class="m-dashboard-box">
        <div class="m-dashboard-msg-header">
            <el-input
                class="m-dashboard-work-search"
                :placeholder="$t('dashboard.common.searchPlaceholder')"
                v-model="currentSearch"
                clearable
                size="large"
                @clear="loadData"
            >
                <template #prepend>
                    <span>{{ $t("dashboard.common.keyword") }}</span>
                </template>
                <template #append>
                    <el-button icon="Search"></el-button>
                </template>
            </el-input>
        </div>
        <ContentSkeleton v-if="loading" variant="list" :rows="6" />
        <ul class="m-dashboard-box-list" v-else-if="filterData.length">
            <li v-for="(item, i) in filterData" :key="i">
                <i class="u-icon">
                    <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                </i>
                <a
                    class="u-title"
                    target="_blank"
                    :href="
                        getLink(item.source_type, (item.content_meta && item.content_meta.content_id) || item.source_id)
                    "
                    >{{ (item.content_meta && item.content_meta.title) || item.title || $t("dashboard.common.untitled") }}</a
                >
                <div class="u-desc">
                    <span class="u-category"><i class="el-icon-folder"></i> {{ getTypeLabel(item.source_type) }} </span>
                    <span><i class="el-icon-date"></i> {{ dateFormat(item.created_at) }} </span>
                </div>
                <el-button-group class="u-action">
                    <el-button icon="Delete" :title="$t('dashboard.common.deleteRecord')" @click="del(item.id)"></el-button>
                </el-button-group>
            </li>
        </ul>
        <el-alert v-else class="m-dashboard-box-null" :title="$t('dashboard.common.noItems')" type="info" center show-icon> </el-alert>
    </div>
</template>

<script>
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/moment";
import { deleteVisitHistory, getVisitHistory } from "@/service/dashboard/fav";

export default {
    name: "VisitLog",
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
            loading: true,
            total: 0,
        };
    },
    emits: ["change-search"],
    watch: {
        currentSearch(val) {
            this.$emit("change-search", val);
        },
    },
    computed: {
        filterData() {
            return this.data
                .filter((i) => i.title.indexOf(this.currentSearch || "") > -1)
                .filter((i) => {
                    if (!this.type || this.type === "all") {
                        return true;
                    }
                    return this.type === i.source_type;
                });
        },
    },
    methods: {
        dateFormat,
        getTypeLabel(type) {
            type = type?.replace(/dbm_/g, "");
            type = type.includes("community") ? "community" : type;
            return getTypeLabel(type);
        },
        getLink,
        del(id) {
            this.$confirm(this.$t("dashboard.favorites.deleteHistoryConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteVisitHistory(id).then(() => {
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
            getVisitHistory()
                .then(({ data }) => {
                    this.data = data.data || [];
                    this.total = this.data.length || 0;
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

<style lang="less"></style>
