<template>
    <div class="m-points">
        <h2><i class="el-icon-sugar"></i> {{ $t("dashboard.points.title") }}</h2>
        <div class="m-balance">
            <span class="u-label">{{ $t("dashboard.common.balance") }} : </span>
            <b :class="money > 0 ? 'u-have' : ''" class="u-num">{{ money }}</b>
            <a class="el-button u-btn el-button--primary el-button--small" href="/vip/mall" target="_blank">{{
                $t("dashboard.common.exchange")
            }}</a>
        </div>
        <div class="m-points-filters">
            <el-select v-model="filterMode" :aria-label="$t('dashboard.points.filterMode')" @change="changeFilterMode">
                <el-option value="action_group" :label="$t('dashboard.points.byGroup')" />
                <el-option value="action_type" :label="$t('dashboard.points.byType')" />
            </el-select>
            <el-select
                v-model="filterValue"
                :placeholder="$t('dashboard.points.allTypes')"
                filterable
                :loading="optionsLoading"
                :aria-label="$t('dashboard.common.type')"
                @change="changeFilter"
            >
                <el-option value="" :label="$t('dashboard.points.allTypes')" />
                <el-option v-for="option in filterOptions" :key="option.value" :value="option.value" :label="option.label" />
            </el-select>
            <el-button v-if="optionsFailed" link type="primary" @click="loadOptions">
                {{ $t("dashboard.points.retryOptions") }}
            </el-button>
        </div>
        <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="5" />
        <el-tabs v-else class="m-tabs" type="border-card" v-model="tab_value" @tab-change="changeTab">
            <!-- 积分记录 -->
            <el-tab-pane :label="$t('dashboard.points.pointsHistory')" name="point" lazy>
                <el-table
                    class="m-table"
                    :data="list"
                    show-header
                    cell-class-name="u-table-cell"
                    header-cell-class-name="u-header-cell"
                    size="large"
                >
                    <el-table-column :label="$t('dashboard.common.type')">
                        <template #default="scope">{{ formatType(scope.row) }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.quantity')">
                        <template #default="scope">
                            <div class="u-count" :class="{ isNegative: Number(scope.row.count) < 0 }">
                                <span>{{ Number(scope.row.count) > 0 ? "+" : "" }}</span> <b>{{ scope.row.count }}</b>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="count" :label="$t('dashboard.common.sourceWork')">
                        <template #default="scope">
                            <a
                                class="u-link"
                                :href="getPostLink(scope.row)"
                                target="_blank"
                                v-if="getPostLink(scope.row)"
                                ><i class="el-icon-link"></i> {{ $t("dashboard.common.clickToView") }}
                            </a>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.remark')">
                        <template #default="scope">{{ formatRemark(scope.row.remark) }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.time')">
                        <template #default="scope">
                            <span>{{ showTime(scope.row.created_at) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="m-packet-pages"
                    background
                    :pager-count="5"
                    :page-size="per"
                    :hide-on-single-page="true"
                    v-model:current-page="page"
                    @current-change="handlePageChange"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                ></el-pagination>
            </el-tab-pane>
            <el-tab-pane :label="$t('dashboard.points.experienceHistory')" name="ex" lazy>
                <el-table
                    class="m-table"
                    :data="list"
                    show-header
                    cell-class-name="u-table-cell"
                    header-cell-class-name="u-header-cell"
                    size="large"
                >
                    <el-table-column :label="$t('dashboard.common.type')">
                        <template #default="scope">{{ formatType(scope.row) }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.quantity')">
                        <template #default="scope">
                            <div class="u-count" :class="{ isNegative: Number(scope.row.count) < 0 }">
                                <span>{{ Number(scope.row.count) > 0 ? "+" : "" }}</span> <b>{{ scope.row.count }}</b>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="count" :label="$t('dashboard.common.sourceWork')">
                        <template #default="scope">
                            <a
                                class="u-link"
                                :href="getPostLink(scope.row)"
                                target="_blank"
                                v-if="getPostLink(scope.row)"
                                ><i class="el-icon-link"></i> {{ $t("dashboard.common.clickToView") }}
                            </a>
                            <span v-else> - </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.remark')">
                        <template #default="scope">{{ formatRemark(scope.row.remark) }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.time')">
                        <template #default="scope">
                            <span>{{ showTime(scope.row.created_at) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="m-packet-pages"
                    background
                    :pager-count="5"
                    :page-size="per"
                    :hide-on-single-page="true"
                    v-model:current-page="page"
                    @current-change="handlePageChange"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                ></el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { getPointsHistory, getExperienceHistory, getActionGroups, getActionTypes } from "@/service/dashboard/points.js";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import types from "@/assets/data/dashboard/points_types.json";
export default {
    name: "points",
    components: {},
    data: function () {
        return {
            money: 0,
            loading: false,
            list: [],
            tab_value: "point",

            page: 1,
            per: 10,
            total: 0,
            types,
            actionGroups: [],
            actionTypes: [],
            filterMode: "action_group",
            filterValue: "",
            optionsLoading: false,
            optionsFailed: false,
            requestId: 0,
        };
    },
    computed: {
        filterOptions() {
            return this.filterMode === "action_group"
                ? this.actionGroups.map((item) => ({ value: item.action_group, label: item.group_desc }))
                : this.actionTypes.map((item) => ({ value: item.action_type, label: item.action_desc }));
        },
        actionDescriptions() {
            const entries = [...this.actionGroups.flatMap((group) => group.action_types || []), ...this.actionTypes];
            return Object.fromEntries(entries.map((item) => [item.action_type, item.action_desc]));
        },
        params() {
            let _params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            if (this.filterValue) _params[this.filterMode] = this.filterValue;
            return _params;
        },
    },
    methods: {
        async loadOptions() {
            this.optionsLoading = true;
            const results = await Promise.allSettled([getActionGroups(), getActionTypes()]);
            if (results[0].status === "fulfilled") this.actionGroups = results[0].value || [];
            if (results[1].status === "fulfilled") this.actionTypes = results[1].value || [];
            this.optionsFailed = results.some((result) => result.status === "rejected");
            this.optionsLoading = false;
        },
        changeFilterMode() {
            this.filterValue = "";
            this.changeFilter();
        },
        changeFilter() {
            this.page = 1;
            this.loadData();
        },
        loadAsset() {
            User.getAsset().then((data) => {
                this.money = data?.points || 0;
            });
        },
        loadData() {
            const requestId = ++this.requestId;
            this.loading = true;
            this.$router.push({
                name: "points",
                query: {
                    tab: this.tab_value,
                    page: this.page,
                    ...(this.filterValue ? { [this.filterMode]: this.filterValue } : {}),
                },
            });
            const fn = this.tab_value === "point" ? getPointsHistory : getExperienceHistory;
            fn(this.params)
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.list = res.list || [];
                    this.total = res.page?.total || 0;
                })
                .catch(() => {
                    if (requestId !== this.requestId) return;
                    this.list = [];
                    this.total = 0;
                })
                .finally(() => {
                    if (requestId === this.requestId) this.loading = false;
                });
        },
        getPostLink(item) {
            return getLink(item.post_type, item.article_id);
        },
        formatType: function (row) {
            const val = row.action_type;
            const description = row.action_desc || this.actionDescriptions[val];
            if (description) return description;
            const key = `dashboard.dataLabels.pointsTypes.${val}`;
            return val && this.$te(key) ? this.$t(key) : this.types[val] || val || this.$t("dashboard.common.unknown");
        },
        formatRemark: function (str) {
            if (str) {
                if (str.length > 18) {
                    return str.slice(0, 18) + "...";
                } else {
                    return str;
                }
            } else {
                return "-";
            }
        },
        changeTab() {
            this.page = 1;
            this.loadData();
        },
        handlePageChange(val) {
            this.page = val;
            this.loadData();
        },
        showTime,
    },
    created: function () {
        this.tab_value = this.$route.query.tab === "ex" ? "ex" : "point";
        const page = Number(this.$route.query.page);
        this.page = Number.isInteger(page) && page > 0 ? page : 1;
        const query = this.$route.query;
        this.filterMode = query.action_group ? "action_group" : query.action_type ? "action_type" : "action_group";
        this.filterValue = typeof query[this.filterMode] === "string" ? query[this.filterMode] : "";
        this.loadOptions();
        this.loadData();
        this.loadAsset();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/packet.less";
@import "~@/assets/css/dashboard/points.less";

@media screen and (max-width: @phone) {
    .m-points {
        .m-table {
            .el-table__header-wrapper,
            .el-table__body-wrapper {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            .el-table__header,
            .el-table__body {
                min-width: 760px;
                table-layout: auto;
            }
            .cell {
                white-space: nowrap;
                overflow: visible;
                text-overflow: clip;
            }
        }
    }
}
</style>
