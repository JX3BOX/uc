<template>
    <uc icon="el-icon-shopping-bag-1" :title="$t('dashboard.orders.title')" :tabList="tabList">
        <div class="m-dashboard m-dashboard-work m-dashboard-orders">
            <div class="m-dashboard-orders-cont">
                <!-- 表单 -->
                <div class="m-order-list" v-if="list && list.length">
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
                    <!-- 分页 -->
                    <el-pagination
                        class="m-order-pages"
                        background
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
            getOrderList(this.params).then((res) => {
                this.list = res.data.data.list;
                this.total = res.data.data.page.total;
            });
        },
        showProduct: function (val) {
            return products[val];
        },
        showPayStatus: function (val) {
            return pay_status[val];
        },
        showPayType: function (val) {
            return pay_types[val];
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
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;

        table {
            min-width: 860px;
        }

        th,
        td {
            white-space: nowrap;
        }
    }
}
</style>
