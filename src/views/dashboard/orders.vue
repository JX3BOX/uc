<template>
    <uc icon="el-icon-shopping-bag-1" :title="$t('dashboard.orders.title')" :tabList="tabList">
        <div class="m-dashboard m-dashboard-work m-dashboard-orders">
            <div class="m-dashboard-orders-cont">
                <!-- 表单 -->
                <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
                <div class="m-order-list" v-else-if="list && list.length">
                    <div class="m-order-table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>{{ $t("dashboard.orders.product") }}</th>
                                <th>{{ $t("dashboard.orders.orderNumber") }}</th>
                                <th>{{ $t("dashboard.common.amount") }}</th>
                                <th>{{ $t("dashboard.orders.paymentMethod") }}</th>
                                <th>{{ $t("dashboard.orders.transactionNumber") }}</th>
                                <th>{{ $t("dashboard.orders.transactionStatus") }}</th>
                                <th>{{ $t("dashboard.orders.createdAt") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>{{ showProduct(item.product_id) }}</td>
                                <td>{{ item.id }}</td>
                                <td>¥{{ showPrice(item.total_fee) }}</td>
                                <td>{{ showPayType(item.pay_type) }}</td>
                                <td>{{ item.transaction_id }}</td>
                                <td>{{ showPayStatus(item.pay_status) }}</td>
                                <td>{{ showTime(item.created_time) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <!-- 分页 -->
                    <el-pagination
                        class="m-order-pages"
                        background
                        :pager-count="5"
                        layout="total, prev, pager, next,jumper"
                        :page-size="per"
                        :total="total"
                        v-model:current-page="page"
                    ></el-pagination>
                </div>
                <div class="m-order-null" v-else>
                    <el-alert :title="$t('dashboard.orders.empty')" type="info" show-icon></el-alert>
                </div>
            </div>
        </div>
    </uc>
</template>
<script>
import { getOrderList } from "@/service/dashboard/order.js";
import orderData from "@/assets/data/dashboard/pay_order.json";
const { products, pay_status, pay_types } = orderData;
import { showTime } from "@jx3box/jx3box-common/js/moment";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { mallTab } = tabsData;
import uc from "@/components/dashboard/uc.vue";
export default {
    name: "orders",
    components: {
        uc,
    },
    props: [],
    data: function () {
        return {
            list: [],
            per: 10,
            total: 1,
            page: 1,
            loading: false,

            tabList: mallTab,
        };
    },
    computed: {
        params: function () {
            return {
                pageIndex: this.page,
                pageSize: this.per,
            };
        },
    },
    methods: {
        loadData() {
            this.loading = true;
            getOrderList(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.page.total || 0;
                })
                .catch(() => {
                    this.list = [];
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showProduct: function (val) {
            const key = `dashboard.dataLabels.orderProducts.${val}`;
            return this.$te(key) ? this.$t(key) : products[val] || val;
        },
        showPayStatus: function (val) {
            const key = `dashboard.dataLabels.orderPayStatus.${val}`;
            return this.$te(key) ? this.$t(key) : pay_status[val] || val;
        },
        showPayType: function (val) {
            const key = `dashboard.dataLabels.orderPayTypes.${val}`;
            return this.$te(key) ? this.$t(key) : pay_types[val] || val;
        },
        showPrice: function (val) {
            return val ? (val / 100).toFixed(2) : "0.00";
        },
        showTime,
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    mounted: function () {},
};
</script>
<style scoped lang="less">
@import "~@/assets/css/dashboard/orders.less";

@media screen and (max-width: @phone) {
    .m-order-list {
        overflow: visible;

        .m-order-table-scroll {
            overflow-x: auto;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            -webkit-overflow-scrolling: touch;
        }

        table {
            min-width: 860px;
        }

        th,
        td {
            white-space: nowrap;
        }

        th:first-child,
        td:first-child {
            position: sticky;
            left: 0;
            z-index: 2;
            background: #fff;
        }

        th:first-child {
            z-index: 3;
            background: #f5f7fa;
        }

        .m-order-pages {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 100%;
            box-sizing: border-box;
            padding-top: 16px;
            overflow: visible;

            :deep(.el-pagination__total),
            :deep(.el-pagination__jump) {
                display: none;
            }

            :deep(.btn-prev),
            :deep(.btn-next),
            :deep(.el-pager li) {
                min-width: 32px;
                height: 36px;
                line-height: 36px;
                margin: 0;
            }

            :deep(.el-pager) {
                display: flex;
                gap: 0;
            }
        }
    }
}
</style>
