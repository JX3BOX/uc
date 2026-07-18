<template>
    <div class="m-credit m-boxcoin">
        <h2 class="u-title"><i class="el-icon-coin"></i> {{ $t("dashboard.boxcoin.title") }}</h2>
        <div class="m-credit-total m-packet-total">
            {{ $t("dashboard.common.balance") }} :
            <b :class="{ hasLeft: hasLeft }">{{ money }}</b>
            <span class="u-types">
                <span class="u-type u-type-std"
                    >{{ $t("dashboard.boxcoin.standard") }}：<b>{{ total_std }}</b></span
                >
                <span class="u-type u-type-origin"
                    >{{ $t("dashboard.boxcoin.origin") }}：<b>{{ total_origin }}</b></span
                >
                <span class="u-type u-type-all"
                    >{{ $t("dashboard.boxcoin.bothClients") }}：<b>{{ total_all }}</b></span
                >
            </span>
            <!-- <a class="el-button u-btn el-button--primary el-button--small" href="/vip/boxcoin" target="_blank">充值</a> -->
            <el-button class="u-btn" type="primary" size="small" @click="togglePullBox" :disabled="!money">{{
                $t("dashboard.common.exchange")
            }}</el-button>
            <el-button
                class="u-btn"
                type="warning"
                size="small"
                @click="openExchangeDialog"
                :disabled="!hasExchangeBoxcoin"
                :loading="exchangeLockStatus"
                >{{ $t("dashboard.common.convert") }}</el-button
            >
        </div>
        <el-dialog
            v-model="showExchangeBox"
            :title="$t('dashboard.boxcoin.convertTitle')"
            width="520px"
            :close-on-click-modal="!exchangeLockStatus"
        >
            <el-alert
                class="m-boxcoin-tip"
                :title="$t('dashboard.boxcoin.convertTip')"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>
            <el-form label-position="left" label-width="90px" class="m-boxcoin-form" :model="exchangeForm">
                <el-form-item :label="$t('dashboard.boxcoin.type')">
                    <el-select
                        v-model="exchangeForm.boxcoin_type"
                        :placeholder="$t('dashboard.boxcoin.typePlaceholder')"
                        :disabled="exchangeLockStatus"
                    >
                        <el-option
                            v-for="item in exchangeTypes"
                            :key="item.value"
                            :label="
                                $t('dashboard.boxcoin.availableType', {
                                    type: exchangeTypeLabel(item),
                                    amount: getExchangeTypeBalance(item.value),
                                })
                            "
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('dashboard.boxcoin.amount')">
                    <el-input-number
                        v-model="exchangeForm.boxcoin_count"
                        :min="10"
                        :step="10"
                        step-strictly
                        controls-position="right"
                        :disabled="exchangeLockStatus"
                        :placeholder="$t('dashboard.boxcoin.amountPlaceholder')"
                    ></el-input-number>
                    <div class="u-exchange-tip">
                        {{ $t("dashboard.boxcoin.multipleTip", { amount: exchangeAvailableBoxcoin }) }}
                    </div>
                </el-form-item>
                <el-form-item :label="$t('dashboard.boxcoin.estimatedGain')">
                    <b class="u-exchange-point">{{ exchangePointCount }}</b>
                    <span> {{ $t("dashboard.common.points") }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showExchangeBox = false" :disabled="exchangeLockStatus">{{
                        $t("dashboard.common.cancel")
                    }}</el-button>
                    <el-button type="primary" @click="openExchangeConfirm" :loading="exchangeLockStatus">{{
                        $t("dashboard.boxcoin.confirmConvert")
                    }}</el-button>
                </span>
            </template>
        </el-dialog>
        <div class="m-credit-pull" v-if="showPullBox">
            <el-alert class="m-boxcoin-ac" type="error" show-icon :closable="false" v-if="breadcrumb">
                <slot name="title"><div v-html="breadcrumb"></div></slot>
            </el-alert>
            <el-alert class="m-boxcoin-tip" :title="$t('dashboard.boxcoin.exchangeTip')" type="warning" show-icon>
                <slot name="description"><div class="u-tips" v-html="tips"></div> </slot>
            </el-alert>
            <el-form label-position="left" label-width="80px" class="m-boxcoin-form">
                <el-form-item :label="$t('dashboard.boxcoin.gameZone')">
                    <el-select v-model="pull.zone" :placeholder="$t('dashboard.boxcoin.zonePlaceholder')">
                        <el-option v-for="zone in zones" :key="zone" :label="zone" :value="zone"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('dashboard.boxcoin.gameAccount')">
                    <el-input
                        v-model="pull.account"
                        :placeholder="$t('dashboard.boxcoin.accountPlaceholder')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('dashboard.boxcoin.gameAccount')">
                    <el-input
                        v-model="pull.accounts"
                        :placeholder="$t('dashboard.boxcoin.accountConfirmPlaceholder')"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="$t('dashboard.boxcoin.exchangeAmount')">
                    <el-radio-group v-model="pull.cash">
                        <el-radio :value="1500" border :disabled="!canSelect(1500)" v-if="client == 'std'">{{
                            $t("dashboard.boxcoin.tokens", { amount: 1500 })
                        }}</el-radio>
                        <el-radio :value="2000" border :disabled="!canSelect(2000)" v-if="isAdmin">{{
                            $t("dashboard.boxcoin.tokens", { amount: 2000 })
                        }}</el-radio>
                        <el-radio :value="3000" border :disabled="!canSelect(3000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 3000 })
                        }}</el-radio>
                        <el-radio :value="5000" border :disabled="!canSelect(5000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 5000 })
                        }}</el-radio>
                        <el-radio :value="10000" border :disabled="!canSelect(10000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 10000 })
                        }}</el-radio>
                        <el-radio :value="50000" border :disabled="!canSelect(50000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 50000 })
                        }}</el-radio>
                        <el-radio :value="100000" border :disabled="!canSelect(100000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 100000 })
                        }}</el-radio>
                        <el-radio :value="200000" border :disabled="!canSelect(200000)">{{
                            $t("dashboard.boxcoin.tokens", { amount: 200000 })
                        }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('dashboard.email.address')">
                    <el-input v-model="pull.email" :placeholder="$t('dashboard.email.correctPlaceholder')"></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-button type="primary" @click="openConfirmBox" :disabled="!ready || lockStatus">{{
                        $t("dashboard.common.submitApplication")
                    }}</el-button>
                    <span class="u-tip" v-if="!isAllowDate">
                        <i class="el-icon-warning-outline"></i>
                        {{ $t("dashboard.boxcoin.settlementUnavailable", { start: start_date, end: end_date }) }}
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="m-credit-table m-packet-table">
            <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="tab === 'out' ? 6 : 5" />
            <el-tabs v-else v-model="tab" @tab-change="changeType" type="border-card">
                <el-tab-pane :label="$t('dashboard.boxcoin.history')" name="in" lazy>
                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-boxcoin-in-list m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>{{ $t("dashboard.common.type") }}</th>
                                    <th>{{ $t("dashboard.common.quantity") }}</th>
                                    <th>{{ $t("dashboard.common.sourceWork") }}</th>
                                    <th>{{ $t("dashboard.common.remark") }}</th>
                                    <th>{{ $t("dashboard.common.time") }}</th>
                                </tr>
                            </thead>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>{{ item.action_desc || formatType(item.action_type) }}</td>
                                <td class="u-count" :class="showBoxcoinCls(item)">
                                    <span>{{ showBoxcoinOp(item) }}</span>
                                    <b>{{ countBoxCoin(item) }}</b>
                                </td>
                                <td>
                                    <a :href="getPostLink(item)" target="_blank" v-if="getPostLink(item)">
                                        <i class="el-icon-link"></i> {{ $t("dashboard.common.clickToView") }}
                                    </a>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span :title="item.remark">{{ formatRemark(item.remark) }}</span>
                                </td>
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
                    ></el-alert>
                    <el-pagination
                        class="m-credit-pages m-packet-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        v-model:current-page="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
                <el-tab-pane :label="$t('dashboard.boxcoin.exchangeHistory')" name="out" lazy>
                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-boxcoin-out-list m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>{{ $t("dashboard.common.quantity") }}</th>
                                    <th>{{ $t("dashboard.common.zone") }}</th>
                                    <th>{{ $t("dashboard.common.account") }}</th>
                                    <th>{{ $t("dashboard.common.email") }}</th>
                                    <th>{{ $t("dashboard.common.processingStatus") }}</th>
                                    <th>{{ $t("dashboard.common.remark") }}</th>
                                    <th>{{ $t("dashboard.common.applicationTime") }}</th>
                                </tr>
                            </thead>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>
                                    <b>{{ $t("dashboard.boxcoin.tokens", { amount: item.cash }) }}</b>
                                </td>
                                <td>{{ item.zone }}</td>
                                <td>{{ item.account }}</td>
                                <td>{{ item.email }}</td>
                                <td :class="statusClass(item)">
                                    <el-tag :type="tagColor(item)" size="small">
                                        {{ formatHistoryStatus(item) }}
                                    </el-tag>
                                </td>
                                <td>{{ item.remark }}</td>
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
                    ></el-alert>
                    <el-pagination
                        class="m-credit-pages m-packet-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        v-model:current-page="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import types from "@/assets/data/dashboard/boxcoin_types.json";
import zones from "@jx3box/jx3box-data/data/server/server_zones.json";
import {
    getBoxcoinCashHistory,
    getBoxcoinGotHistory,
    cashBoxcoin,
    getBoxcoinConfig,
    getBoxcoinOverview,
    exchangeBoxcoinToPoint,
} from "@/service/dashboard/boxcoin.js";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
import { omit } from "lodash";
export default {
    name: "Boxcoin",
    props: [],
    data: function () {
        return {
            // 提现表单
            pull: {
                zone: "",
                account: "",
                accounts: "",
                cash: "",
                email: "",
            },
            showPullBox: false,
            lockStatus: false,
            formStatus: false,

            // 盒币转换积分
            showExchangeBox: false,
            exchangeLockStatus: false,
            exchangeForm: {
                boxcoin_type: "all",
                boxcoin_count: 10,
            },
            exchangeTypes: [{ value: "all" }, { value: "std" }, { value: "origin" }],

            // 记录列表
            loading: false,
            tab: "in",
            list: [],
            page: 1,
            per: 10,
            total: 1,

            // Options
            types,
            dates: [],

            // 杂项
            breadcrumb: "",

            // 概览
            overview: {
                all: 0,
                std: 0,
                origin: 0,
            },
            totalCoin: 0,
            uid: User.getInfo().uid,

            tips: this.$t("dashboard.boxcoin.defaultTips"),
        };
    },
    computed: {
        params: function () {
            let params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            return params;
        },
        client: function () {
            return this.$store.state.client;
        },
        isAdmin: function () {
            return User.isAdmin();
        },

        // 额度
        total_std: function () {
            return this.toPositiveNumber(this.overview.std);
        },
        total_origin: function () {
            return this.toPositiveNumber(this.overview.origin);
        },
        total_all: function () {
            return this.toPositiveNumber(this.overview.all);
        },
        money: {
            get() {
                if (this.client == "std") {
                    // 显示正式服余额（可能为负数） 和 真实余额较小的
                    return Math.min(this.totalCoin, Math.max(this.total_std, 0) + Math.max(this.total_all, 0));
                } else {
                    // 显示怀旧服余额+双端余额（可能为负数） 和 真实余额较小的
                    return Math.min(this.totalCoin, Math.max(this.total_origin, 0) + Math.max(this.total_all, 0));
                }
            },
            set(val) {
                return val;
            },
        },
        hasLeft: function () {
            return this.money > 0;
        },
        min: function () {
            return this.client == "std" ? 1500 : 3000;
        },

        // 日期
        isAllowDate: function () {
            let d = new Date().getDate();
            return !this.dates.includes(d);
        },
        start_date: function () {
            return this.dates[0];
        },
        end_date: function () {
            return this.dates[this.dates.length - 1];
        },

        // 区服
        zones: function () {
            return this.client == "origin" ? ["缘起大区"] : ["电信区", "双线区", "无界区"];
        },

        // 限制
        canCash: function () {
            return this.hasLeft && this.isAllowDate && this.money >= this.min;
        },
        ready: function () {
            return this.canCash && this.formStatus;
        },
        exchangeAvailableBoxcoin: function () {
            return this.getExchangeTypeBalance(this.exchangeForm.boxcoin_type);
        },
        exchangePointCount: function () {
            const count = Number(this.exchangeForm.boxcoin_count) || 0;
            return Math.floor(count / 10);
        },
        hasExchangeBoxcoin: function () {
            return this.total_all + this.total_std + this.total_origin > 0 && this.totalCoin > 0;
        },
    },
    methods: {
        // 初始化
        init: function () {
            getBoxcoinConfig().then((res) => {
                this.dates = JSON.parse(res.data.data.val);
            });
            this.loadAsset();
            this.loadData();
            this.loadAc();
            this.loadOverview();
        },

        // 加载列表数据
        loadData: function () {
            this.loading = true;
            let fn = {
                in: getBoxcoinGotHistory,
                out: getBoxcoinCashHistory,
            };
            this.$router.push({
                query: {
                    tab: this.tab,
                    page: this.page,
                },
            });
            fn[this.tab](this.params)
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
        loadOverview: function () {
            getBoxcoinOverview().then((res) => {
                this.overview = res.data.data;
            });
        },
        changeType: function () {
            this.page = 1;
            this.loadData();
        },
        getPostLink(item) {
            return getLink(item.post_type_sub || item.post_type, item.article_id);
        },

        // 提现操作
        loadAsset: function () {
            User.getAsset().then((data) => {
                this.totalCoin = data?.box_coin || 0;
            });
        },
        togglePullBox: function () {
            this.showPullBox = !this.showPullBox;
        },
        openExchangeDialog: function () {
            this.resetExchangeForm();
            this.showExchangeBox = true;
        },
        resetExchangeForm: function () {
            this.exchangeForm = {
                boxcoin_type: "all",
                boxcoin_count: 10,
            };
        },
        getExchangeTypeBalance: function (type) {
            const map = {
                all: this.total_all,
                std: this.total_std,
                origin: this.total_origin,
            };
            return map[type] || 0;
        },
        getExchangeTypeLabel: function (type) {
            const item = this.exchangeTypes.find((item) => item.value === type);
            return item ? this.exchangeTypeLabel(item) : type;
        },
        exchangeTypeLabel(item) {
            return this.$t(`dashboard.boxcoin.clientTypes.${item.value}`);
        },
        checkExchangeForm: function () {
            const count = Number(this.exchangeForm.boxcoin_count);
            if (!this.exchangeForm.boxcoin_type) {
                this.$message.warning(this.$t("dashboard.boxcoin.typePlaceholder"));
                return false;
            }
            if (!Number.isInteger(count) || count <= 0) {
                this.$message.warning(this.$t("dashboard.boxcoin.invalidAmount"));
                return false;
            }
            if (count % 10 !== 0) {
                this.$message.warning(this.$t("dashboard.boxcoin.multipleRequired"));
                return false;
            }
            if (count > this.exchangeAvailableBoxcoin) {
                this.$message.warning(this.$t("dashboard.boxcoin.amountExceedsAvailable"));
                return false;
            }
            return true;
        },
        openExchangeConfirm: function () {
            if (this.exchangeLockStatus || !this.checkExchangeForm()) return;

            const count = Number(this.exchangeForm.boxcoin_count);
            const point = this.exchangePointCount;
            this.$confirm(
                `<div class="m-boxcoin-msg">${this.$t("dashboard.boxcoin.type")}：<b>${this.getExchangeTypeLabel(
                    this.exchangeForm.boxcoin_type
                )}</b> <br/> ${this.$t("dashboard.boxcoin.consumed")}：<b>${count}${this.$t(
                    "dashboard.common.boxcoin"
                )}</b> <br/> ${this.$t("dashboard.boxcoin.estimatedGain")}：<b>${point}${this.$t(
                    "dashboard.common.points"
                )}</b></div>`,
                this.$t("dashboard.boxcoin.confirmConvert"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    dangerouslyUseHTMLString: true,
                }
            )
                .then(() => {
                    this.exchangeLockStatus = true;
                    exchangeBoxcoinToPoint({
                        boxcoin_count: count,
                        boxcoin_type: this.exchangeForm.boxcoin_type,
                    })
                        .then(() => {
                            this.$message({
                                type: "success",
                                message: this.$t("dashboard.boxcoin.convertSuccess"),
                            });
                            this.showExchangeBox = false;
                            this.resetExchangeForm();
                            this.loadAsset();
                            this.loadOverview();
                            this.loadData();
                        })
                        .catch((err) => {
                            const message =
                                err?.response?.data?.msg || err?.message || this.$t("dashboard.boxcoin.convertFailed");
                            this.$message.error(message);
                        })
                        .finally(() => {
                            this.exchangeLockStatus = false;
                        });
                })
                .catch(() => {});
        },
        canSelect: function (val) {
            return ~~this.money >= ~~val;
        },
        checkForm: function () {
            for (let key in this.pull) {
                if (!this.pull[key]) {
                    this.formStatus = false;
                    return;
                }
            }
            this.formStatus = true;
        },
        openConfirmBox: function () {
            if (/[\u4e00-\u9fa5]/.test(this.pull.account))
                return this.$alert(this.$t("dashboard.boxcoin.accountNotRole"));
            if (this.pull.account !== this.pull.accounts)
                return this.$alert(this.$t("dashboard.boxcoin.accountMismatch"));

            this.$alert(
                `<div class="m-boxcoin-msg">${this.$t("dashboard.common.zone")}：<b>${
                    this.pull.zone
                }</b> <br/> ${this.$t("dashboard.common.account")}：<b>${this.pull.account}</b> <br/> ${this.$t(
                    "dashboard.common.email"
                )}：<b>${this.pull.email}</b> <br/> ${this.$t("dashboard.common.exchange")}：<b>${this.$t(
                    "dashboard.boxcoin.tokens",
                    { amount: this.pull.cash }
                )}</b></div>`,
                this.$t("dashboard.common.confirmInformation"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    dangerouslyUseHTMLString: true,
                    callback: (action) => {
                        if (action == "confirm") {
                            this.lockStatus = true;
                            this.loading = true;
                            const pull = omit(this.pull, ["accounts"]);
                            cashBoxcoin(Object.assign(pull, { client: this.client }), {
                                client: this.client,
                            })
                                .then((res) => {
                                    this.$message({
                                        type: "success",
                                        message: this.$t("dashboard.boxcoin.applicationSuccess"),
                                    });
                                    this.showPullBox = false;
                                    this.money = this.money - this.pull.cash;
                                })
                                .then(() => {
                                    // 重载数据
                                    this.loadData();
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
        // 杂项
        loadAc: function () {
            getBreadcrumb("dashboard-boxcoin").then((data) => {
                this.breadcrumb = data;
            });
            getBreadcrumb("boxcoin-tips").then((data) => {
                this.tips = data;
            });
        },
        // filters
        formatDate: function (val) {
            return showTime(val);
        },
        formatType: function (val) {
            const key = `dashboard.dataLabels.boxcoinTypes.${val}`;
            return val && this.$te(key) ? this.$t(key) : types[val] || this.$t("dashboard.common.unknown");
        },
        formatRemark: function (str) {
            if (str) {
                if (str.length > 12) {
                    return str.slice(0, 12) + "...";
                } else {
                    return str;
                }
            }
            return "-";
        },
        formatHistoryStatus: function (item) {
            const { status, received_in_game } = item;
            if (status == 0) return this.$t("dashboard.common.pending");
            if (status == 2) return this.$t("dashboard.common.abnormal");
            if (status == 1) {
                if (received_in_game == 1) return this.$t("dashboard.common.completed");
                return this.$t("dashboard.common.underApproval");
            }
        },
        statusClass(item) {
            const { status, received_in_game } = item;

            if (status == 0) return "isProcessing";
            if (status == 2) return "isPending";
            if (status == 1) {
                if (received_in_game == 1) return "isFinished";
                return "isProcessing";
            }
        },
        tagColor(item) {
            const { status, received_in_game } = item;
            if (status == 0) return "warning";
            if (status == 2) return "danger";
            if (status == 1) {
                if (received_in_game == 1) return "success";
                return "warning";
            }
        },
        toPositiveNumber: function (val) {
            return val > 0 ? val : 0;
        },
        countBoxCoin: function (item) {
            let i = 1;
            if (item.user_id == this.uid) {
                i = item.action_type > 0 ? 1 : -1;
            } else if (item.operate_user_id == this.uid) {
                i = item.action_type > 0 ? -1 : 1;
            }
            return Math.abs(item.count + ~~item.ext_take_off_count + ~~item.ext2_take_off_count) * i;
        },
        showBoxcoinOp(item) {
            let value = this.countBoxCoin(item);
            // if (item.action_type == 9) {
            //     return item.operate_user_id == this.uid ? "-" : "+";
            // }
            // else if (item.action_type == "-2") {
            //     return "-";
            // }
            return value >= 0 ? "+" : "";
        },
        showBoxcoinCls(item) {
            let value = this.countBoxCoin(item);
            if (item.action_type == 9) {
                return item.operate_user_id == this.uid && "isNegative";
            } else if (item.action_type == "-2") {
                return "isNegative";
            }
            return value < 0 && "isNegative";
        },
    },
    created: function () {
        this.tab = this.$route.query.tab || "in";
        this.page = Number(this.$route.query.page || 1);
        this.init();
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.loadData();
            },
        },
        pull: {
            deep: true,
            handler: function () {
                this.checkForm();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/packet.less";
@import "~@/assets/css/dashboard/boxcoin.less";
</style>
