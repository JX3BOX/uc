<template>
    <div class="m-credit m-packet">
        <h2 class="u-title"><i class="el-icon-present"></i> {{ $t("dashboard.packet.title") }}</h2>
        <div class="m-credit-total m-packet-total">
            {{ $t("dashboard.common.balance") }} :
            <b :class="{ hasLeft: hasLeft }">{{ formatMoney(money) }}</b>
            <!-- <el-button
                class="u-btn"
                type="primary"
                @click="togglePullBox"
                
                :disabled="!money"
                >提现</el-button
            > -->
        </div>
        <div class="m-credit-pull m-packet-pull" v-if="showPullBox">
            <el-form label-position="left" label-width="80px">
                <el-form-item :label="$t('dashboard.common.type')">
                    <el-select v-model="pull.pay_type" :placeholder="$t('dashboard.common.selectPlaceholder')">
                        <el-option
                            v-for="(label, key) in pay_types"
                            :key="key"
                            :label="paymentTypeLabel(key, label)"
                            :value="key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('dashboard.common.account')">
                    <el-input
                        v-model="pull.account"
                        :placeholder="$t('dashboard.common.paymentAccountPlaceholder')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('dashboard.common.name')">
                    <el-input v-model="pull.username" :placeholder="$t('dashboard.common.payeePlaceholder')"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="openConfirmBox" :disabled="!money || lockStatus">{{
                        $t("dashboard.common.submitApplication")
                    }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="m-credit-table m-packet-table">
            <ContentSkeleton v-if="loading" variant="table" :rows="6" :columns="5" />
            <el-tabs v-else v-model="activeName" @tab-change="changeType" type="border-card">
                <el-tab-pane :label="$t('dashboard.packet.history')" name="my_packet_list">
                    <div class="m-packet-table" v-if="my_packet_list && my_packet_list.length">
                        <table class="m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>{{ $t("dashboard.packet.amount") }}</th>
                                    <th>{{ $t("dashboard.packet.type") }}</th>
                                    <th>{{ $t("dashboard.packet.status") }}</th>
                                    <th>{{ $t("dashboard.common.remark") }}</th>
                                    <th>{{ $t("dashboard.packet.receivedAt") }}</th>
                                </tr>
                            </thead>
                            <tr v-for="(item, i) in my_packet_list" :key="i">
                                <td>
                                    <b>{{ formatMoney(item.money) }}</b>
                                </td>
                                <td>{{ formatType(item.action_type) }}</td>
                                <td>
                                    {{
                                        item.is_success
                                            ? $t("dashboard.common.processed")
                                            : $t("dashboard.common.unprocessed")
                                    }}
                                </td>
                                <td>{{ item.description || item.remark || "-" }}</td>
                                <td>{{ formatDate(item.created_at) }}</td>
                            </tr>
                        </table>
                    </div>

                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        :title="$t('dashboard.common.noItems')"
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
                        v-model:current-page="page"
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
                                    <b>{{ formatMoney(item.money) }}</b>
                                </td>
                                <td>{{ formatPaytype(item.pay_type) }}</td>
                                <td>
                                    {{ encryptAccount(item.accept_account) }}
                                </td>
                                <td
                                    :class="{
                                        isFinished: item.status == 1,
                                        isProcessing: !item.status,
                                        isPending: item.status > 1,
                                    }"
                                >
                                    {{ formatHistoryStatus(item.status) }}
                                </td>
                                <td>
                                    {{
                                        item.status == 1
                                            ? item.transaction_id
                                            : item.why
                                    }}
                                </td>
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
                        v-model:current-page="page"
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
                `<div class="m-packet-msg">${this.$t("dashboard.packet.confirmPayee")} <br/> ${this.$t(
                    "dashboard.common.paymentAccount"
                )}<b>${this.pull.account}</b> <br/> ${this.$t("dashboard.common.payee")}<b>${
                    this.pull.username
                }</b></div>`,
                this.$t("dashboard.common.confirmInformation"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    dangerouslyUseHTMLString: true,
                    callback: (action) => {
                        if (action == "confirm") {
                            this.lockStatus = true;
                            this.loading = true;
                            pullMyPacket(this.pulldata)
                                .then((res) => {
                                    this.$message({
                                        type: "success",
                                        message: this.$t("dashboard.packet.applicationSuccess"),
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
                        message: this.$t("dashboard.common.operationSuccess"),
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
                        message: this.$t("dashboard.packet.grantSuccess"),
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
                    message: this.$t("dashboard.packet.recoveredCount", { count: res.data.data.successCount }),
                    type: "success",
                });
                item.status = -1;
            });
        },
        formatType(val) {
            return this.$t(`dashboard.packet.actionTypes.${val}`);
        },
        formatDate: function (val) {
            return showTime(val);
        },
        formatStatus: function (val) {
            return val ? this.$t("dashboard.packet.withdrawn") : this.$t("dashboard.packet.notWithdrawn");
        },
        formatHistoryStatus: function (val) {
            const key = `dashboard.dataLabels.packetPayStatuses.${val}`;
            return val && this.$te(key) ? this.$t(key) : val ? paystatus[val] : this.$t("dashboard.packet.underReview");
        },
        formatPaytype: function (val) {
            return val ? this.paymentTypeLabel(val, paytypes[val]) : val;
        },
        paymentTypeLabel(key, fallback) {
            const path = `dashboard.common.paymentTypes.${key}`;
            return this.$te(path) ? this.$t(path) : fallback;
        },
        encryptAccount: function (val) {
            return val.slice(0, 3) + "******";
        },
        formatMoney: function (val) {
            return val ? (val / 100).toFixed(2) : 0;
        },
        formatPayStatus: function (val) {
            val += "";
            const key = `dashboard.dataLabels.packetPayStatuses.${val}`;
            return val && this.$te(key) ? this.$t(key) : paystatus[val];
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
