<template>
    <div class="m-feedback-list">
        <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
        <el-table
            v-else-if="data.length"
            :data="data"
            highlight-current-row
            row-class-name="u-row"
            @row-click="viewFeedback"
            size="large"
        >
            <el-table-column :label="$t('dashboard.common.status')" prop="status" width="100">
                <template #default="{ row }">
                    <el-tag :type="statusTypes[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.common.client')" prop="client" width="100">
                <template #default="{ row }">
                    <span class="u-client" :class="'i-client-' + row.client">{{ formatClient(row.client) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.feedback.sourceType')" prop="type" width="200">
                <template #default="{ row }">
                    {{ `${types[row.type]} - ${subtypes[row.subtype]}` }}
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('dashboard.common.content')"
                prop="content"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column :label="$t('dashboard.common.submittedAt')" prop="created_at" width="160">
                <template #default="{ row }">
                    {{ formatTime(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.common.actions')" width="100">
                <template #default>
                    <el-button size="small" plain icon="View">{{ $t("dashboard.common.view") }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-empty v-else :description="$t('dashboard.common.noItems')" />
        <el-pagination
            v-if="!loading && total"
            class="m-credit-pages m-packet-pages"
            background
            :page-size="per"
            :hide-on-single-page="true"
            v-model:current-page="page"
            @current-change="currentChange"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
import { getFeedbackList } from "@/service/dashboard/feedback";
import feedbackData from "@/assets/data/dashboard/feedback.json";
const { statusColors, statusTypes } = feedbackData;
import { __clients } from "@/utils/config";
import moment from "moment";
export default {
    name: "FeedbackList",
    data() {
        return {
            data: [],
            loading: true,
            page: 1,
            per: 15,
            total: 0,

            statusColors,
            statusTypes,
        };
    },
    computed: {
        types() {
            return this.localizeMap(feedbackData.types, "feedbackTypes");
        },
        subtypes() {
            return this.localizeMap(feedbackData.subtypes, "feedbackSubtypes");
        },
        statusMap() {
            return this.localizeMap(feedbackData.statusMap, "feedbackStatuses");
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        localizeMap(source, name) {
            return Object.keys(source).reduce((result, key) => {
                const path = `dashboard.dataLabels.${name}.${key}`;
                result[key] = this.$te(path) ? this.$t(path) : source[key];
                return result;
            }, {});
        },
        async getData() {
            try {
                this.loading = true;
                const params = {
                    pageIndex: this.page,
                    pageSize: this.per,
                };
                let res = await getFeedbackList(params);
                this.data = res.data.data.list || [];
                this.total = res.data.data.page.total;
            } catch (e) {
                this.data = [];
                this.total = 0;
                console.log(e);
            } finally {
                this.loading = false;
            }
        },
        formatTime(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        formatClient(client = "std") {
            const path = `dashboard.dataLabels.clients.${client}`;
            return this.$te(path) ? this.$t(path) : __clients[client] || client;
        },
        handleView(row) {
            this.$router.push({
                name: "feedback_single",
                params: {
                    id: row.id,
                },
            });
        },
        currentChange(val) {
            this.page = val;
            this.getData();
        },
        viewFeedback: function (row) {
            const path = this.$router.resolve({
                name: "feedback_single",
                params: { id: row.id },
            });

            window.open(path.href, "_blank");
        },
    },
};
</script>

<style lang="less">
.m-feedback-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 12px;

    .u-row * {
        .pointer !important;
    }

    .u-status {
        color: #fff;
        padding: 2px 5px;
        .r(2px);
    }
    .u-client {
        padding: 3px 8px;
        .r(3px);
    }
}
</style>
