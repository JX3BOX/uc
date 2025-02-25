<template>
    <div class="m-feedback-list" v-loading="loading">
        <el-table :data="data" highlight-current-row size="small" row-class-name="u-row" @row-click="viewFeedback">
            <el-table-column label="状态" prop="status" width="100">
                <template #default="{ row }">
                    <span class="u-status" :style="{ backgroundColor: statusColors[row.status] }">{{
                        statusMap[row.status]
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户端" prop="client" width="100">
                <template #default="{ row }">
                    <span class="u-client" :class="'i-client-' + row.client">{{ formatClient(row.client) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="来源" prop="type" width="200">
                <template #default="{ row }">
                    {{ `${types[row.type]} - ${subtypes[row.subtype]}` }}
                </template>
            </el-table-column>
            <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
            <el-table-column label="提交时间" prop="created_at" width="160">
                <template #default="{ row }">
                    {{ formatTime(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default>
                    <el-button type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="m-credit-pages m-packet-pages"
            background
            :page-size="per"
            :hide-on-single-page="true"
            :current-page.sync="page"
            @current-change="currentChange"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
import { getFeedbackList } from "@/service/dashboard/feedback";
import { types, subtypes, statusMap, statusColors } from "@/assets/data/dashboard/feedback.json";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import moment from "moment";
export default {
    name: "FeedbackList",
    data() {
        return {
            data: [],
            loading: false,
            page: 1,
            per: 15,
            total: 0,

            types,
            subtypes,
            statusMap,
            statusColors,
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
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
                console.log(e);
            } finally {
                this.loading = false;
            }
        },
        formatTime(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        formatClient(client = "std") {
            return __clients[client] || client;
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
            window.open("/feedback/" + row.id, "_blank");
        },
    },
};
</script>

<style lang="less" scoped>
.m-feedback-list {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .u-row * {
        .pointer !important;
    }

    .u-status {
        color: #fff;
        padding: 2px 5px;
        .r(2px);
    }
    .u-client {
        padding: 2px 5px;
        .r(2px);
    }
}
</style>
