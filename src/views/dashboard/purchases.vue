<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-purchases">
        <h2 class="u-title"><i class="el-icon-shopping-cart-2"></i> 付费资源</h2>

        <el-table class="m-table" :data="list" v-loading="loading" @row-click="rowClick" @filter-change="filterChange" show-header cell-class-name="u-table-cell" header-cell-class-name="u-header-cell">
            <el-table-column label="购买类型" :filters="postTypeFilters" :filter-multiple="false"  column-key="post_type">
                <template slot-scope="{ row }">
                    <div>{{ postType(row.post_type) }}</div>
                </template>
            </el-table-column>
            <el-table-column label="货币类型">
                <template slot-scope="{ row }">
                    {{ priceType(row.price_type) }}
                </template>
            </el-table-column>
            <el-table-column label="货币数量" prop="price_count" />
            <el-table-column label="购买时间" prop="created_at" />
            <el-table-column>
                <template slot-scope="{ row }">
                    <el-button size="mini" plain @click="toDetails(row)" icon="el-icon-view">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="m-pagination" background :page-size="limit" :hide-on-single-page="true" :current-page.sync="page" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
</template>


<script>
import { getPurchases } from "@/service/dashboard/purchases"
import { priceType, postType } from "@/assets/data/dashboard/purchase.json"
import { getLink } from "@jx3box/jx3box-common/js/utils"
export default {
    name: 'purchasesList',
    data () {
        return {
            loading: false,
            list: [],
            page: 1,
            post_type: '',
            limit: 10,
            total: 0,
        }
    },
    computed: {
        params() {
            return {
                post_type: this.post_type,
                pageIndex: this.page,
                pageSize: this.limit,
            }
        },
        postTypeFilters() {
            return Object.keys(postType).map((key) => {
                return {
                    text: postType[key],
                    value: key,
                }
            })
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler() {
                this.loadData()
            },
        }
    },
    methods: {
        loadData() {
            this.loading = true
            getPurchases(this.params).then(res => {
                this.list = res.data.data.list || []
                this.page = res.data.data.page.index || 1
                this.limit = res.data.data.page.pageSize || 10
                this.total = res.data.data.page.total || 0
            }).finally(() => {
                this.loading = false
            })
        },
        getLink,
        rowClick(row) {
            const url = getLink(row.post_type, row.post_id)
            if (url) {
                window.open(url, '_blank')
            }
        },
        // 查看详情
        toDetails(row) {
            const url = getLink(row.post_type, row.post_id)
            if (url) {
                window.open(url, '_blank')
            }
        },
        filterChange(filters) {
            this.post_type = filters.post_type[0] || ''
        },

        // filters
        priceType(type) {
            return priceType[type]
        },
        postType(type) {
            return postType[type]
        },
    }
}
</script>

<style lang="less">
.m-dashboard-purchases {
    .m-table {
        .u-header-cell {
            .fz(12px);
            color: @color;
        }
        .u-table-cell {
            .fz(12px);
            cursor: pointer;
        }
    }
    .m-pagination {
        .x;
        .pt(20px);
        overflow-x: auto;
    }
}
</style>
