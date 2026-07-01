<template>
    <div class="m-credit m-boxcoin">
        <h2 class="u-title"><i class="el-icon-coin"></i> 我的盒币</h2>
        <div class="m-credit-total m-packet-total">
            余额 :
            <b :class="{ hasLeft: hasLeft }">{{ money }}</b>
            <span class="u-types">
                <span class="u-type u-type-std"
                    >重制：<b>{{ total_std }}</b></span
                >
                <span class="u-type u-type-origin"
                    >缘起：<b>{{ total_origin }}</b></span
                >
                <span class="u-type u-type-all"
                    >双端：<b>{{ total_all }}</b></span
                >
            </span>
            <!-- <a class="el-button u-btn el-button--primary el-button--small" href="/vip/boxcoin" target="_blank">充值</a> -->
            <el-button class="u-btn" type="primary" size="small" @click="togglePullBox" :disabled="!money">兑换</el-button>
            <el-button
                class="u-btn"
                type="success"
                size="small"
                @click="openExchangeDialog"
                :disabled="!hasExchangeBoxcoin"
                :loading="exchangeLockStatus"
                >转换</el-button
            >
        </div>
        <el-dialog v-model="showExchangeBox" title="盒币转换积分" width="520px" :close-on-click-modal="!exchangeLockStatus">
            <el-alert
                class="m-boxcoin-tip"
                title="盒币可按 10:1 转换为积分，即每 10 盒币可兑换 1 积分。转换后积分可用于积分商城、抽奖等场景。"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>
            <el-form label-position="left" label-width="90px" class="m-boxcoin-form" :model="exchangeForm">
                <el-form-item label="盒币类型">
                    <el-select v-model="exchangeForm.boxcoin_type" placeholder="请选择盒币类型" :disabled="exchangeLockStatus">
                        <el-option
                            v-for="item in exchangeTypes"
                            :key="item.value"
                            :label="`${item.label}（可用 ${getExchangeTypeBalance(item.value)}）`"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="盒币数量">
                    <el-input-number
                        v-model="exchangeForm.boxcoin_count"
                        :min="10"
                        :step="10"
                        step-strictly
                        controls-position="right"
                        :disabled="exchangeLockStatus"
                        placeholder="请输入要转换的盒币数量"
                    ></el-input-number>
                    <div class="u-exchange-tip">请输入 10 的整数倍，当前类型可用 {{ exchangeAvailableBoxcoin }} 盒币</div>
                </el-form-item>
                <el-form-item label="预计获得">
                    <b class="u-exchange-point">{{ exchangePointCount }}</b>
                    <span> 积分</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showExchangeBox = false" :disabled="exchangeLockStatus">取消</el-button>
                    <el-button type="primary" @click="openExchangeConfirm" :loading="exchangeLockStatus">确认转换</el-button>
                </span>
            </template>
        </el-dialog>
        <div class="m-credit-pull" v-if="showPullBox">
            <el-alert class="m-boxcoin-ac" type="error" show-icon :closable="false" v-if="breadcrumb">
                <slot name="title"><div v-html="breadcrumb"></div></slot>
            </el-alert>
            <el-alert class="m-boxcoin-tip" title="1盒币可兑换1通宝，不可折现" type="warning" show-icon>
                <slot name="description"><div class="u-tips" v-html="tips"></div> </slot>
            </el-alert>
            <el-form label-position="left" label-width="80px" class="m-boxcoin-form">
                <el-form-item label="游戏大区">
                    <el-select v-model="pull.zone" placeholder="请选择所在大区">
                        <el-option v-for="zone in zones" :key="zone" :label="zone" :value="zone"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="游戏账号">
                    <el-input v-model="pull.account" placeholder="请务必填写正确的账号"></el-input>
                </el-form-item>
                <el-form-item label="游戏账号">
                    <el-input v-model="pull.accounts" placeholder="请重新再次输入游戏账号"></el-input>
                </el-form-item>
                <el-form-item label="兑换数目">
                    <el-radio-group v-model="pull.cash">
                        <el-radio :value="1500" border :disabled="!canSelect(1500)" v-if="client == 'std'"
                            >1500通宝</el-radio
                        >
                        <el-radio :value="2000" border :disabled="!canSelect(2000)" v-if="isAdmin">2000通宝</el-radio>
                        <el-radio :value="3000" border :disabled="!canSelect(3000)">3000通宝</el-radio>
                        <el-radio :value="5000" border :disabled="!canSelect(5000)">5000通宝</el-radio>
                        <el-radio :value="10000" border :disabled="!canSelect(10000)">10000通宝</el-radio>
                        <el-radio :value="50000" border :disabled="!canSelect(50000)">50000通宝</el-radio>
                        <el-radio :value="100000" border :disabled="!canSelect(100000)">100000通宝</el-radio>
                        <el-radio :value="200000" border :disabled="!canSelect(200000)">200000通宝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱地址">
                    <el-input v-model="pull.email" placeholder="请务必填写正确的邮箱"></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-button type="primary" @click="openConfirmBox" :disabled="!ready || lockStatus"
                        >提交申请</el-button
                    >
                    <span class="u-tip" v-if="!isAllowDate">
                        <i class="el-icon-warning-outline"></i> 每月{{ start_date }}-{{
                            end_date
                        }}日结算期间不能进行兑换申请
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="m-credit-table m-packet-table" v-loading="loading">
            <el-tabs v-model="tab" @tab-change="changeType" type="border-card">
                <el-tab-pane label="盒币记录" name="in" lazy>
                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-boxcoin-in-list m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>类型</th>
                                    <th>数量</th>
                                    <th>源于作品</th>
                                    <th>备注</th>
                                    <th>时间</th>
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
                                        <i class="el-icon-link"></i> 点击查看
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
                        title="没有找到相关条目"
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
                <el-tab-pane label="兑换记录" name="out" lazy>
                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-boxcoin-out-list m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>数量</th>
                                    <th>大区</th>
                                    <th>账号</th>
                                    <th>邮箱</th>
                                    <th>处理状态</th>
                                    <th>备注</th>
                                    <th>申请时间</th>
                                </tr>
                            </thead>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>
                                    <b>{{ item.cash }}通宝</b>
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
                        title="没有找到相关条目"
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
            exchangeTypes: [
                {
                    label: "双端",
                    value: "all",
                },
                {
                    label: "重制",
                    value: "std",
                },
                {
                    label: "缘起",
                    value: "origin",
                },
            ],

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

            tips: `每个月6~31日开放兑换，1~5日关闭兑换渠道进行汇总。（即1月6日的兑换，和1月31日的兑换，同样在2月1~5日进行汇总）<br />
                    重制（正式服）汇总后，通常21个工作日内发放奖励，即前一月的兑换，通常在后一个月的月底发放，如遇特殊原因可能会在某些月份锁定兑换。<br />
                    重制（正式服）会直充到账号上，不会有官方短信/邮件提醒，在个人充值记录中也不可查到。<br />
                    缘起（怀旧服）汇总后，通常赛季末一次性发放，其中赛季末未兑换部分将被清空重置。<br />
                    缘起（怀旧服）通过一卡通发放，可在个人中心›我的卡密中查看，如使用的第三方登录还没有设置过密码的用户，需要在个人中心›资料设置›修改密码中设置一个密码。<br />

                    发放后，将会有魔盒公告，请关注首页侧边栏站内动态。`,
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
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
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
            return item?.label || type;
        },
        checkExchangeForm: function () {
            const count = Number(this.exchangeForm.boxcoin_count);
            if (!this.exchangeForm.boxcoin_type) {
                this.$message.warning("请选择盒币类型");
                return false;
            }
            if (!Number.isInteger(count) || count <= 0) {
                this.$message.warning("请输入正确的盒币数量");
                return false;
            }
            if (count % 10 !== 0) {
                this.$message.warning("盒币数量必须是 10 的整数倍");
                return false;
            }
            if (count > this.exchangeAvailableBoxcoin) {
                this.$message.warning("转换数量不能超过当前类型可用盒币");
                return false;
            }
            return true;
        },
        openExchangeConfirm: function () {
            if (this.exchangeLockStatus || !this.checkExchangeForm()) return;

            const count = Number(this.exchangeForm.boxcoin_count);
            const point = this.exchangePointCount;
            this.$confirm(
                `<div class="m-boxcoin-msg">盒币类型：<b>${this.getExchangeTypeLabel(
                    this.exchangeForm.boxcoin_type
                )}</b> <br/> 消耗盒币：<b>${count}盒币</b> <br/> 预计获得：<b>${point}积分</b></div>`,
                "确认转换",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    dangerouslyUseHTMLString: true,
                }
            ).then(() => {
                this.exchangeLockStatus = true;
                exchangeBoxcoinToPoint({
                    boxcoin_count: count,
                    boxcoin_type: this.exchangeForm.boxcoin_type,
                })
                    .then(() => {
                        this.$message({
                            type: "success",
                            message: "转换成功",
                        });
                        this.showExchangeBox = false;
                        this.resetExchangeForm();
                        this.loadAsset();
                        this.loadOverview();
                        this.loadData();
                    })
                    .catch((err) => {
                        const message = err?.response?.data?.msg || err?.message || "转换失败，请稍后再试";
                        this.$message.error(message);
                    })
                    .finally(() => {
                        this.exchangeLockStatus = false;
                    });
            }).catch(() => {});
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
            if (/[\u4e00-\u9fa5]/.test(this.pull.account)) return this.$alert("请填写剑三登录账号，而不是角色名");
            if (this.pull.account !== this.pull.accounts) return this.$alert(`请确认账号是否填写正确`);

            this.$alert(
                `<div class="m-boxcoin-msg">大区：<b>${this.pull.zone}</b> <br/> 账号：<b>${this.pull.account}</b> <br/> 邮箱：<b>${this.pull.email}</b> <br/> 兑换：<b>${this.pull.cash}通宝</b></div>`,
                "确认信息",
                {
                    confirmButtonText: "确定",
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
                                        message: `申请成功,请耐心等待结算`,
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
            return (val && types[val]) || "未知";
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
            if (status == 0) return "待处理";
            if (status == 2) return "异常";
            if (status == 1) {
                if (received_in_game == 1) return "已完成";
                return "审批中";
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
