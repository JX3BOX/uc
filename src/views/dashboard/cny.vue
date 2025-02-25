<template>
    <div class="m-credit m-boxcoin m-cny">
        <h2 class="u-title"><i class="el-icon-wallet"></i> 我的金箔</h2>

        <div class="m-credit-total m-packet-total">
            余额 :
            <b :class="{ hasLeft: hasLeft }">{{ money }}</b>
            <!-- <a class="el-button u-btn el-button--primary el-button--mini" href="/vip/cny" target="_blank">充值</a> -->
            <!-- <el-button class="u-btn" type="primary" @click="togglePullBox" size="mini" :disabled="!money"
                >提现</el-button
            > -->
        </div>

        <div class="m-credit-pull" v-if="showPullBox">
            <el-alert class="m-boxcoin-ac" type="error" show-icon :closable="false" v-if="breadcrumb" size="mini">
                <slot name="title"><div v-html="breadcrumb"></div></slot>
            </el-alert>
            <el-alert
                class="m-boxcoin-tip"
                title="100金箔可兑换1元人民币，最小兑换起步100金箔"
                type="warning"
                show-icon
            >
                <!-- <slot name="description"
                    >每个月6~31日开放提现，1~5日关闭提现渠道进行汇总。（即1月6日的兑换，和1月31日的兑换，同样在2月1~5日进行汇总）<br />
                    每笔提现收取2%手续费，最低收取0.02元。收取规则：不满1元部分按1元计算，计算手续费时向上取整。<br />
                    比如提现15.5元，16.2向取整，分别按16，17元收取0.32元和0.34元。<br />
                    汇总后，通常7个工作日内转账至收款账号。</slot
                > -->
            </el-alert>
            <el-form label-position="left" label-width="80px" class="m-boxcoin-form" :model="pull">
                <el-form-item label="类型">
                    <el-select v-model="pull.pay_type" placeholder="请选择">
                        <el-option v-for="(label, key) in paytypes" :key="key" :label="label" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="pull.account" placeholder="请务必填写正确的收款账号"></el-input>
                </el-form-item>
                <el-form-item label="确认账号">
                    <el-input v-model="pull.account_sure" placeholder="请务必填写正确的收款账号"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="pull.username" placeholder="请务必填写正确的收款人"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input-number
                        v-model.number="pull.money"
                        :max="money"
                        :min="100"
                        :step="100"
                        placeholder="请务必填写正确的金额"
                    >
                        <!-- <template slot="prepend"></template> -->
                        <template slot="append">金箔（分）</template>
                    </el-input-number>
                    <div class="u-tip" v-if="pull.money">
                        手续费{{ formatMoney(fee) }}元，实际到账{{ formatMoney(real) }}元
                    </div>
                </el-form-item>
                <el-form-item label>
                    <el-button type="primary" @click="openConfirmBox" :disabled="!ready || lockStatus"
                        >提交申请</el-button
                    >
                    <span class="u-tip" v-if="!isAllowDate">
                        <i class="el-icon-warning-outline"></i> 每月{{ start_date }}-{{
                            end_date
                        }}日结算期间不能进行提现申请
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="m-credit-table m-packet-table" v-loading="loading">
            <el-tabs type="border-card" v-model="tab">
                <el-tab-pane label="变动记录" name="list">
                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-boxcoin-in-list m-packet-in-list">
                            <!-- "id": 48,
                            "use_case": "cashout_fail_return_money", // 见下方枚举类型
                            "action_type": 2, // 见下方枚举类型
                            "money": 1020, // 变动金额
                            "access_user_id": 6314, // 接收者id，如果该id为0，表示接收者为系统
                            "pay_user_id": 0, // 支付者id， 如果该id为0，表示支付者为系统
                            "link_rechargeId": 0, // 关联的微信或支付充值记录id
                            "link_article_id": "", // 关联的付费文章id
                            "link_article_type": "",// 关联的付费文章类型
                            "link_attachment_id": 0, // 关联的付费附件id
                            "link_point_product_id": 0, //关联的积分商城商品id
                            "link_cashout_id": 26, // 关联的提现记录的id
                            "description": "", // 描述
                            "remark": "提现失败，返回金额", // 备注
                            "has_be_read": 0, //是否已被消息队列读取，无实际意义
                            "created_at": "2022-08-07 00:33:33",
                            "process_success": false //相关业务是否执行成功 -->

                            <tr>
                                <th>类型</th>
                                <th>来源</th>
                                <th>去向</th>
                                <th>数量</th>
                                <th>备注</th>
                                <th>时间</th>
                            </tr>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>
                                    {{ item.description || formatType(item.action_type) || "未知" }}
                                </td>
                                <td>
                                    <a class="u-user" :href="authorLink(item.pay_user.id)" v-if="item.pay_user">
                                        <img class="u-avatar" :src="showAvatar(item.pay_user.avatar)" alt="" />
                                        {{ item.pay_user.display_name }}
                                    </a>
                                    <span v-else>系统</span>
                                </td>
                                <td>
                                    <a class="u-user" :href="authorLink(item.access_user.id)" v-if="!!item.access_user">
                                        <img class="u-avatar" :src="showAvatar(item.access_user.avatar)" alt="" />
                                        {{ item.access_user.display_name }}
                                    </a>
                                    <span v-else>系统</span>
                                </td>
                                <td class="u-count" :class="{ isNegative: !isIncome(item) }">
                                    <span>{{ isIncome(item) ? "+" : "-" }}</span>
                                    <b>{{ item.money }}</b>
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
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { showTime } from "@jx3box/jx3box-common/js/moment";
import types from "@/assets/data/dashboard/cny_types.json";
import paytypes from "@/assets/data/dashboard/paytypes.json";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
import { cashOut, getBalance, getHistory } from "@/service/dashboard/cny";
import { getBoxcoinConfig } from "@/service/dashboard/boxcoin";
import { getConfig } from "@/service/dashboard/config";

import User from "@jx3box/jx3box-common/js/user";
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils.js";

export default {
    name: "Cny",
    props: [],
    data: function () {
        return {
            // 手续费
            pay_fee: 0,
            cny_enable: 0,

            // 💠 余额
            money: 0,

            // 🌸 提现
            pull: {
                username: "",
                account: "",
                account_sure: "",
                pay_type: "alipay",
                money: 100, //转换为分
            },
            showPullBox: false,
            lockStatus: false,
            formStatus: false,
            breadcrumb: "",

            // Options
            dates: [],
            paytypes,

            // 🌟 列表
            list: [],
            page: 1,
            per: 10,
            total: 1,
            tab: "list",
            loading: false,
        };
    },
    computed: {
        // 💠 余额
        hasLeft: function () {
            return this.money > 100;
        },
        fee: function () {
            return Math.ceil(this.pull.money / 100) * this.pay_fee;
            //return Math.max(Math.ceil(this.pull.money / 100) * 2, 2);
        },
        real: function () {
            return this.pull.money - this.fee;
        },

        // 🌸 提现
        // 日期
        start_date: function () {
            return this.dates[0];
        },
        end_date: function () {
            return this.dates[this.dates.length - 1];
        },
        isAllowDate: function () {
            let d = new Date().getDate();
            return !this.dates.includes(d);
        },
        canCash: function () {
            return this.hasLeft && this.isAllowDate && this.pull.money <= this.money;
        },
        ready: function () {
            return this.canCash && this.formStatus;
        },

        // 🌟 列表
        params: function () {
            let params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            return params;
        },
        uid: function () {
            return User.getInfo().uid;
        },
    },
    methods: {
        // 初始化
        init: function () {
            getBoxcoinConfig().then((res) => {
                this.dates = JSON.parse(res.data.data.val);
            });
            this.loadAsset();
            this.loadAc();
            this.loadData();
            this.loadFee();
        },

        // 获取手续费
        loadFee: function () {
            getConfig("cny_enable").then((enable) => {
                this.cny_enable = Number(enable);
            });
            getConfig("pay_fee").then((fee) => {
                this.pay_fee = Number(fee);
            });
        },

        // 💠 余额
        loadAsset: function () {
            getBalance().then((data) => {
                this.money = data;
            });
        },

        // 🌸 提现
        togglePullBox: function () {
            this.showPullBox = !this.showPullBox;
        },
        loadAc: function () {
            getBreadcrumb("dashboard-cny").then((data) => {
                this.breadcrumb = data;
            });
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
            const { account_sure, account } = this.pull;
            if (account_sure !== account) return this.$message.error("填写的账户不一致");
            delete this.pull.account_sure;
            this.$alert(
                `<div class="m-packet-msg">
                收款账号<b>${this.pull.account}</b><br/>
                收款人<b>${this.pull.username}</b><br/>
                </div>`,
                "确认信息",
                {
                    confirmButtonText: "确定",
                    dangerouslyUseHTMLString: true,
                    callback: (action) => {
                        if (action == "confirm") {
                            this.lockStatus = true;
                            this.loading = true;
                            cashOut(this.pull)
                                .then((res) => {
                                    this.$message({
                                        type: "success",
                                        message: `申请成功,请耐心等待结算`,
                                    });
                                    this.showPullBox = false;
                                    this.money = this.money - this.pull.money;
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

        // 🌟 列 你表
        loadData: function () {
            this.loading = true;
            getHistory(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 判断是否为收入
        isIncome: function (item) {
            const { access_user_id, action_type, pay_user_id } = item;
            if (action_type > 0) {
                // 收入
                return true;
            } else {
                return access_user_id == User.getInfo().uid;
            }
        },
        authorLink,
        showAvatar,

        // filters
        formatMoney: function (val) {
            return val ? (val / 100).toFixed(2) : 0;
        },
        formatDate: function (val) {
            return showTime(val);
        },
        formatType: function (val) {
            return (val && types[val]) || "未知";
        },
        formatRemark: function (str) {
            if (str) {
                if (str.length > 12) {
                    return str.slice(12) + "...";
                } else {
                    return str;
                }
            }
            return "-";
        },
    },
    created: function () {
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
