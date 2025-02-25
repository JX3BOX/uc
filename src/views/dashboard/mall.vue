<template>
    <uc icon="el-icon-shopping-bag-1" title="订单中心" :tabList="tabList">
        <div class="m-dashboard m-dashboard-work m-dashboard-orders">
            <div class="m-dashboard-orders-cont">
                <!-- 表单 -->
                <div class="m-mall-list" v-if="list && list.length">
                    <table>
                        <thead>
                            <th>兑换时间</th>
                            <th>兑换商品</th>
                            <th>订单号</th>
                            <th>数量</th>
                            <th>订单状态</th>
                            <th>付款状态</th>
                            <th>是否为赠送</th>
                            <th>操作</th>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>{{ item.order.created_at }}</td>
                                <td>
                                    <span class="u-title" @click="showDetail(item)"
                                        ><i class="el-icon-link"></i>{{ item.goods.title }}</span
                                    >
                                </td>
                                <td>{{ item.order.order_no }}</td>
                                <td>{{ item.order.goods_num }}</td>
                                <td>{{ orderStatus[item.order.order_status] }}</td>
                                <td>{{ payStatus[item.order.pay_status] }}</td>
                                <td>{{ item.order.is_vitural_gift_order ? "是" : "否" }}</td>
                                <td>
                                    <div class="u-op">
                                        <!-- 未支付 -->
                                        <el-tooltip effect="dark" content="点击支付" placement="top" v-if="showPay(item.order)">
                                            <el-button
                                                link
                                                size="mini"
                                                type="success"
                                                plain
                                                icon="el-icon-wallet"
                                                @click="toPay(item)"
                                                circle
                                            ></el-button>
                                        </el-tooltip>

                                        <!-- 已发货操作： 确认收货&申请退货 -->
                                        <template v-if="item.order.order_status == 3">
                                            <el-tooltip effect="dark" content="确认收货" placement="top">
                                                <el-button
                                                    link
                                                    size="mini"
                                                    plain
                                                    icon="el-icon-circle-check"
                                                    @click="isReceipt(item.order.id)"
                                                    circle
                                                ></el-button>
                                            </el-tooltip>
                                        </template>

                                        <!-- 未发货允许操作： 取消订单 -->
                                        <el-tooltip effect="dark" content="取消订单" placement="top" v-if="item.order.order_status == 0">
                                            <el-popconfirm
                                                confirm-button-text="确定"
                                                cancel-button-text="取消"
                                                icon="el-icon-info"
                                                title="确定取消吗？"
                                                @confirm="cancel(item.order.id)"
                                            >
                                                <el-button
                                                    size="mini"
                                                    slot="reference"
                                                    type="info"
                                                    plain
                                                    icon="el-icon-circle-close"
                                                    circle
                                                ></el-button>
                                            </el-popconfirm>
                                        </el-tooltip>

                                        <!-- 已收货操作： 评价 -->
                                        <template v-if="item.order.order_status == 4">
                                            <el-tooltip effect="dark" content="评价商品" placement="top">
                                                <el-button
                                                    icon="el-icon-chat-dot-square"
                                                    @click="handleShow('comment', item.order.id)"
                                                    size="mini"
                                                    plain
                                                    circle
                                                ></el-button>
                                            </el-tooltip>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 分页 -->
                    <div class="m-mall-pages">
                        <el-pagination
                            background
                            layout="total, prev, pager, next,jumper"
                            :page-size="pageSize"
                            :total="total"
                            :current-page.sync="pageIndex"
                        ></el-pagination>
                    </div>
                </div>
                <div class="m-mall-null" v-else>
                    <el-alert title="还有任何订单记录" type="info" show-icon></el-alert>
                </div>
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <GoodComment :order_id="order_id" :type="type" @close="handleClose" />
        </el-dialog>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import GoodComment from "@/components/dashboard/form/comment.vue";
import { getOrder, closeOrder, toPay, toConfirm } from "@/service/dashboard/goods";
import { payStatus, orderStatus } from "@/assets/data/dashboard/mall.json";
import { mallTab } from "@/assets/data/dashboard/tabs.json";
export default {
    name: "mall",
    components: {
        uc,
        GoodComment,
    },
    data: function () {
        return {
            list: [],

            total: 0,
            pageIndex: 1,
            pageSize: 10,

            payStatus,
            orderStatus,

            order_id: "",

            tabList: mallTab,
            dialogVisible: false,
            type: "",
        };
    },
    computed: {
        params() {
            const _params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            return _params;
        },
        params_pageIndex() {
            return this.$route.params.pageIndex;
        },
        title() {
            const data = {
                comment: "商品评价",
                append: "追加评价",
            };
            return data[this.type] || "";
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                this.load();
            },
        },
        params_pageIndex: {
            immediate: true,
            handler: function (val) {
                if (val) this.pageIndex = val;
            },
        },
    },
    methods: {
        load() {
            getOrder(this.params).then((res) => {
                this.list = res.data.data.list;
                this.total = res.data.data.page.total;
            });
        },
        // 显示支付按钮
        showPay({ order_status, pay_status }) {
            if (order_status == 1 || order_status == 2 || order_status == 7) return false;
            return pay_status == 0 ? true : false;
        },
        // 查看详情
        showDetail({ order }) {
            this.$router.push({
                name: "order-detail",
                params: {
                    id: order.id,
                    pageIndex: this.pageIndex,
                },
            });
        },
        // 关闭订单
        cancel(id) {
            closeOrder(id).then(() => {
                this.$message({
                    message: "关闭订单成功",
                    type: "success",
                });
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.order_status = 1;
                    return item;
                });
            });
        },
        // 付款
        toPay(row) {
            const id = row.order.id;
            toPay(id).then(() => {
                this.$message({
                    message: "付款成功",
                    type: "success",
                });
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.pay_status = 1;
                    return item;
                });
            });
        },
        // 确认收货
        isReceipt(id) {
            toConfirm(id).then(() => {
                this.$message({
                    message: "收货成功",
                    type: "success",
                });
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.order_status = 4;
                    return item;
                });
            });
        },
        handleShow(type, id) {
            this.type = type;
            this.order_id = id;
            this.dialogVisible = true;
        },
        handleClose(id) {
            this.dialogVisible = false;
            this.order_id = "";
            this.type = "";
            if (id) {
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.order_status = 5;
                    return item;
                });
            }
        },
    },
    mounted() {
        this.load();
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/dashboard/record.less";
</style>
