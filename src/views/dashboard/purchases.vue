<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-purchases">
        <h2 class="u-title"><i class="el-icon-shopping-cart-2"></i> 付费资源</h2>

        <el-table
            class="m-table"
            :data="list"
            v-loading="loading"
            @row-click="rowClick"
            @filter-change="filterChange"
            show-header
            cell-class-name="u-table-cell"
            header-cell-class-name="u-header-cell"
        >
            <el-table-column
                label="购买类型"
                :filters="postTypeFilters"
                :filter-multiple="false"
                column-key="post_type"
                min-width="120"
            >
                <template #default="{ row }">
                    <div>{{ postType(row.post_type) }}</div>
                </template>
            </el-table-column>
            <el-table-column label="货币类型" min-width="100">
                <template #default="{ row }">
                    {{ priceType(row.price_type) }}
                </template>
            </el-table-column>
            <el-table-column label="货币数量" prop="price_count" min-width="90" />
            <el-table-column label="购买时间" prop="created_at" min-width="160" />
            <el-table-column label="操作" min-width="100">
                <template #default="{ row }">
                    <el-button class="u-detail-btn" plain @click="toDetails(row)" icon="View">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="m-pagination"
            background
            :page-size="limit"
            :hide-on-single-page="true"
            v-model:current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
import { getPurchases } from "@/service/dashboard/purchases";
import purchaseData from "@/assets/data/dashboard/purchase.json";
const { priceType, postType } = purchaseData;
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "purchasesList",
    data() {
        return {
            loading: false,
            list: [],
            page: 1,
            post_type: "",
            limit: 10,
            total: 0,
        };
    },
    computed: {
        params() {
            return {
                post_type: this.post_type,
                pageIndex: this.page,
                pageSize: this.limit,
            };
        },
        postTypeFilters() {
            return Object.keys(postType).map((key) => {
                return {
                    text: postType[key],
                    value: key,
                };
            });
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        loadData() {
            this.loading = true;
            getPurchases(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.page = res.data.data.page.index || 1;
                    this.limit = res.data.data.page.pageSize || 10;
                    this.total = res.data.data.page.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getLink,
        rowClick(row) {
            const url = getLink(row.post_type, row.post_id);
            if (url) {
                window.open(url, "_blank");
            }
        },
        // 查看详情
        toDetails(row) {
            const url = getLink(row.post_type, row.post_id);
            if (url) {
                window.open(url, "_blank");
            }
        },
        filterChange(filters) {
            this.post_type = filters.post_type[0] || "";
        },

        // filters
        priceType(type) {
            return priceType[type];
        },
        postType(type) {
            return postType[type];
        },
    },
};
</script>

<style lang="less">
.m-dashboard-purchases {
    .m-table {
        width: 100%;
        .u-header-cell {
            .fz(12px);
            color: @color;
        }
        .u-table-cell {
            .fz(12px);
            cursor: pointer;
        }
    }
    @media screen and (max-width: @phone) {
        .m-table {
            .u-header-cell,
            .u-table-cell {
                white-space: nowrap;
            }
            .el-table__header,
            .el-table__body,
            .el-table__footer {
                min-width: 630px;
            }
            .el-table__header-wrapper,
            .el-table__body-wrapper,
            .el-table__footer-wrapper {
                overflow-x: auto;
            }
        }
        .u-detail-btn {
            .pl(10px);
            .pr(10px);
        }
    }
    .m-pagination {
        .x;
        .pt(20px);
        overflow-x: auto;
    }
}
</style>
