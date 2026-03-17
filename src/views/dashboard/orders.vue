<template>
    <uc icon="el-icon-shopping-bag-1" title="订单中心" :tabList="tabList">
        <div class="m-dashboard m-dashboard-work m-dashboard-orders">
            <div class="m-dashboard-orders-cont">
                <!-- 表单 -->
                <div class="m-order-list" v-if="list && list.length">
                    <table>
                        <thead>
                            <th>产品</th>
                            <th>订单编号</th>
                            <th>金额</th>
                            <th>支付方式</th>
                            <th>交易号</th>
                            <th>交易状态</th>
                            <th>订单创建时间</th>
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
                    <div class="m-order-pages">
                        <el-pagination
                            background
                            layout="total, prev, pager, next,jumper"
                            :page-size="per"
                            :total="total"
                            v-model:current-page="page"
                        ></el-pagination>
                    </div>
                </div>
                <div class="m-order-null" v-else>
                    <el-alert title="还有任何订单记录" type="info" show-icon></el-alert>
                </div>
            </div>
        </div>
    </uc>
</template>
<script>
import { getOrderList } from "@/service/dashboard/order.js";
import { products, pay_status, pay_types } from "@/assets/data/dashboard/pay_order.json";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { mallTab } from "@/assets/data/dashboard/tabs.json";
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
</style>
