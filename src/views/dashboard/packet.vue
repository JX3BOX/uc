<template>
    <div class="m-credit m-packet">
        <h2 class="u-title"><i class="el-icon-present"></i> 我的红包</h2>
        <div class="m-credit-total m-packet-total">
            余额 :
            <b :class="{ hasLeft: hasLeft }">{{ formatMoney(money) }}</b>
            <!-- <el-button
                class="u-btn"
                type="primary"
                @click="togglePullBox"
                size="mini"
                :disabled="!money"
                >提现</el-button
            > -->
        </div>
        <div class="m-credit-pull m-packet-pull" v-if="showPullBox">
            <el-form label-position="left" label-width="80px">
                <el-form-item label="类型">
                    <el-select v-model="pull.pay_type" placeholder="请选择">
                        <el-option v-for="(label, key) in pay_types" :key="key" :label="label" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="pull.account" placeholder="请务必填写正确的收款账号"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="pull.username" placeholder="请务必填写正确的收款人"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="openConfirmBox" :disabled="!money || lockStatus"
                        >提交申请</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="m-credit-table m-packet-table" v-loading="loading">
            <el-tabs v-model="activeName" @tab-click="changeType" type="border-card">
                <el-tab-pane label="红包记录" name="my_packet_list">
                    <div class="m-packet-table" v-if="my_packet_list && my_packet_list.length">
                        <table class="m-packet-in-list">
                            <tr>
                                <th>红包金额</th>
                                <th>红包类型</th>
                                <th>红包状态</th>
                                <th>备注</th>
                                <th>收入时间</th>
                            </tr>
                            <tr v-for="(item, i) in my_packet_list" :key="i">
                                <td>
                                    <b>{{ formatMoney(item.money) }}</b>
                                </td>
                                <td>{{ formatType(item.action_type) }}</td>
                                <td>{{ item.is_success ? "已处理" : "未处理" }}</td>
                                <td>{{ item.description || item.remark || '-' }}</td>
                                <td>{{ formatDate(item.created_at) }}</td>
                            </tr>
                        </table>
                    </div>

                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到相关条目"
                        type="info"
                        center
                        show-icon
                    >
                    </el-alert>
                    <el-pagination
                        class="m-credit-pages m-packet-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </el-tab-pane>
                <!-- <el-tab-pane label="提现记录" name="my_packet_history">
                    <div
                        class="m-packet-table"
                        v-if="my_packet_history && my_packet_history.length"
                    >
                        <table class="m-packet-in-list">
                            <tr>
                                <th>提现金额</th>
                                <th>支付类型</th>
                                <th>提现账号</th>
                                <th>状态</th>
                                <th>备注</th>
                                <th>申请时间</th>
                            </tr>
                            <tr v-for="(item, i) in my_packet_history" :key="i">
                                <td>
                                    <b>{{ item.money | formatMoney }}</b>
                                </td>
                                <td>{{ item.pay_type | formatPaytype }}</td>
                                <td>
                                    {{ item.accept_account | encryptAccount }}
                                </td>
                                <td
                                    :class="{
                                        isFinished: item.status == 1,
                                        isProcessing: !item.status,
                                        isPending: item.status > 1,
                                    }"
                                >
                                    {{ item.status | formatHistoryStatus }}
                                </td>
                                <td>
                                    {{
                                        item.status == 1
                                            ? item.transaction_id
                                            : item.why
                                    }}
                                </td>
                                <td>{{ item.created_at | formatDate }}</td>
                            </tr>
                        </table>
                    </div>

                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到相关条目"
                        type="info"
                        center
                        show-icon
                    >
                    </el-alert>
                    <el-pagination
                        class="m-credit-pages m-packet-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </el-tab-pane> -->
            </el-tabs>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import {
    getMyPacket,
    getMyPacketList,
    getMyPacketHistory,
    getAllPacket,
    pullMyPacket,
    getAllHistory,
    checkPacket,
    pushPacket,
    recyclePacket,
} from "@/service/dashboard/packet.js";
import paytypes from "@/assets/data/dashboard/paytypes.json";
import paystatus from "@/assets/data/dashboard/paystatus.json";
import optypes from "@/assets/data/dashboard/optypes.json";
import _ from "lodash";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Packet",
    props: [],
    data: function () {
        return {
            // 公共
            loading: false,
            activeName: "my_packet_list",
            isSuperAdmin: User.getInfo().group >= 512,
            money: 0,

            // 记录列表
            my_packet_list: [],
            my_packet_history: [],
            all_packet: [],
            all_history: [],
            page: 1,
            per: 10,
            total: 1,

            // 查询参数
            query: {
                user_id: "",
                category: "",
                batch_no: "",
                status: "",
            },

            // 提现表单
            pay_types: paytypes,
            pull: {
                pay_type: "alipay",
                account: "",
                username: "",
            },
            showPullBox: false,
            lockStatus: false,

            // 管理操作
            paystatus,
            showPushBox: false,
            push: {
                status: "1",
                why: "",
                transaction_id: "",
            },
            checkId: "",
            checkItem: "",
            optypes,

            // 红包发放
            showGiftBox: false,
            gift: {
                category: "",
                batchNo: "",
                money: "",
                ids: "",
                describe: "",
            },
        };
    },
    computed: {
        hasLeft: function () {
            return this.money > 0;
        },
        params: function () {
            let params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            let options = ["user_id", "category", "batch_no", "status"];
            options.forEach((val) => {
                if (this.query[val] !== undefined && this.query[val] !== "") {
                    params[val] = this.query[val];
                }
            });
            return params;
        },
        pulldata: function () {
            return {
                username: this.pull.username,
                account: this.pull.account,
                pay_type: this.pull.pay_type,
            };
        },
        pushdata: function () {
            return {
                status: ~~this.push.status,
                why: this.push.why,
                transaction_id: this.push.transaction_id,
            };
        },
        giftdata: function () {
            let gift = _.cloneDeep(this.gift);
            gift.money = parseFloat(gift.money) * 100;
            return gift;
        },
    },
    methods: {
        togglePullBox: function () {
            this.showPullBox = !this.showPullBox;
        },
        loadData: function () {
            this.loading = true;
            const fns = {
                my_packet_list: getMyPacketList,
                my_packet_history: getMyPacketHistory,
                all_packet: getAllPacket,
                all_history: getAllHistory,
            };
            this.$router.push({
                name: "packet",
                query: {
                    tab: this.activeName,
                    page: this.page,
                },
            });
            fns[this.activeName](this.params)
                .then((res) => {
                    this[this.activeName] = res.data.data.list || [];
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeType: function () {
            this.page = 1;
            this.$route.query.tab = this.activeName;
            this.loadData();
        },
        openConfirmBox: function () {
            this.$alert(
                `<div class="m-packet-msg">请确认收款账号和收款人 <br/> 收款账号<b>${this.pull.account}</b> <br/> 收款人<b>${this.pull.username}</b></div>`,
                "确认信息",
                {
                    confirmButtonText: "确定",
                    dangerouslyUseHTMLString: true,
                    callback: (action) => {
                        if (action == "confirm") {
                            this.lockStatus = true;
                            this.loading = true;
                            pullMyPacket(this.pulldata)
                                .then((res) => {
                                    this.$message({
                                        type: "success",
                                        message: `申请成功,请耐心等待审核结果`,
                                    });
                                    this.showPullBox = false;
                                    this.money = 0;
                                })
                                .finally(() => {
                                    this.lockStatus = false;
                                    this.loading = false;
                                });
                        }
                    },
                }
            );
        },
        check: function (item) {
            this.showPushBox = true;
            this.checkItem = item;
            this.checkId = item.id;
        },
        submit: function (val) {
            this.lockStatus = true;
            this.loading = true;
            checkPacket(this.checkId, this.pushdata, this.params)
                .then((res) => {
                    this.showPushBox = false;
                    this.$message({
                        type: "success",
                        message: `操作成功`,
                    });
                    this.checkItem.status = this.push.status;
                })
                .finally(() => {
                    this.lockStatus = false;
                    this.loading = false;
                });
        },
        toggleGiftBox: function () {
            this.showGiftBox = !this.showGiftBox;
        },
        present: function () {
            this.lockStatus = true;
            this.loading = true;
            pushPacket(this.giftdata)
                .then((res) => {
                    this.showGiftBox = false;
                    this.$message({
                        type: "success",
                        message: `发放成功`,
                    });
                })
                .finally(() => {
                    this.lockStatus = false;
                    this.loading = false;
                });
        },
        recycle: function (item) {
            recyclePacket({
                ids: item.id,
                reason: User.getInfo().uid, //由哪个管理操作
            }).then((res) => {
                this.$message({
                    message: `收回数量` + res.data.data.successCount,
                    type: "success",
                });
                item.status = -1;
            });
        },
        formatType(val) {
            const data = {
                1: "领取红包",
                2: "提现失败返回余额",
                "-1": "回收红包",
                "-2": "提现",
                "-3": "红包过期",
                "-4": "红包消费",
            };
            return data[val];
        },
        formatDate: function (val) {
            return showTime(val);
        },
        formatStatus: function (val) {
            return val ? "已提现" : "未提现";
        },
        formatHistoryStatus: function (val) {
            return val ? paystatus[val] : "审核中";
        },
        formatPaytype: function (val) {
            return val ? paytypes[val] : val;
        },
        encryptAccount: function (val) {
            return val.slice(0, 3) + "******";
        },
        formatMoney: function (val) {
            return val ? (val / 100).toFixed(2) : 0;
        },
        formatPayStatus: function (val) {
            val += "";
            return val && paystatus[val];
        },
        authorLink,
    },
    created: function () {
        this.activeName = this.$route.query.tab || "my_packet_list";
        this.page = Number(this.$route.query.page || 1);
        getMyPacket().then((res) => {
            this.money = res.data.data.red_packet;
        });

        this.loadData();
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.loadData();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/packet.less";
</style>
