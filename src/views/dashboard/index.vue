<template>
    <div class="m-dashboard m-dashboard-index">
        <div class="m-basicinfo">
            <Avatar class="u-avatar" :uid="uid" :url="info.user_avatar" size="l" :frame="info.user_avatar_frame" />
            <div class="u-info">
                <h1 class="u-name">
                    <span class="u-name-txt">{{ info.display_name }}</span>
                    <!-- <el-tooltip class="item" effect="dark" content="修改昵称" placement="top">
                        <a class="u-edit-name" href="/vip/rename?from=dashboard_index">
                            <i class="el-icon-edit-outline"></i>
                        </a>
                    </el-tooltip> -->
                    <div class="u-name-meta">
                        <span
                            class="u-superauth"
                            :class="{ 'is-vip': !(isVIP || isPRO) }"
                            v-if="isSuperAuthor"
                            title="签约作者"
                        >
                            <img :src="super_author_icon" alt="superAuthor" />
                        </span>
                        <span class="u-vip">
                            <template v-if="isVIP || isPRO">
                                <a
                                    class="i-icon-vip"
                                    :class="{ on: isVIP || isPRO }"
                                    href="/vip/premium?from=dashboard_index"
                                    target="_blank"
                                    >{{ vipType }}</a
                                >
                                <span class="u-expire">（{{ `有效期至:${expire_date}` }}）</span>
                            </template>
                            <a class="u-upgrade" href="/vip/premium?from=dashboard_index" target="_blank" v-else
                                >升级账号类型</a
                            >
                        </span>
                    </div>
                </h1>
                <div class="u-identity">
                    <span class="u-uid">
                        <em>UID</em>
                        <b>{{ uid }}</b>
                    </span>
                    <span class="u-group">
                        <em>Verify</em>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="~~info.verify_email ? '邮箱已验证' : '邮箱未验证'"
                            placement="top"
                        >
                            <a href="/dashboard/email" :class="info.verify_email && 'done'"
                                ><i class="el-icon-message"></i
                            ></a>
                        </el-tooltip>
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="~~info.user_phone ? '手机已绑定' : '手机未绑定'"
                            placement="top"
                        >
                            <a href="/dashboard/phone" :class="info.user_phone && 'done'">
                                <i class="el-icon-mobile-phone"></i>
                            </a>
                        </el-tooltip>
                    </span>
                    <span class="u-group">
                        <em>Group</em>
                        <b>{{ showGroupName(group) }}</b>
                        <el-tooltip v-if="~~group < 16" placement="top" content="未认证的用户将无法使用发布中心">
                            <span class="u-auth">
                                <i class="u-unauth el-icon-warning"></i>
                                <a href="/dashboard/auth" target="_blank">前往认证</a>
                            </span>
                        </el-tooltip>
                    </span>
                </div>
                <div class="u-identity m-level">
                    <span class="u-level">
                        <em>Level</em>
                        <b>Lv.{{ level }}</b>
                    </span>
                    <a href="/notice/28917" target="_blank" class="u-progress">
                        <el-progress
                            class="u-level-progress"
                            :percentage="levelProgress"
                            color="#ffb502"
                            text-inside
                            :stroke-width="16"
                            :format="formatProgress"
                            :show-text="true"
                        ></el-progress>
                    </a>
                </div>
                <div class="u-medals" v-if="medals && medals.length">
                    <medal :medals="medals" :showIcon="showMedalIcon"></medal>
                </div>
            </div>
        </div>
        <div class="m-credit">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="u-coin">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="1盒币可用于兑换1通宝，通过评审团/用户打赏获取"
                            placement="top"
                        >
                            <div class="u-credit-name"><i class="el-icon-coin"></i> 盒币</div>
                        </el-tooltip>
                        <div class="u-credit-value">
                            <b>{{ asset.box_coin }}</b>
                        </div>
                        <div class="u-credit-op">
                            <!-- <a class="el-button el-button--primary el-button--mini" href="/vip/boxcoin" target="_blank"
                                >充值</a
                            > -->
                            <router-link class="el-button el-button--primary el-button--mini" to="/boxcoin"
                                >兑换</router-link
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="u-dot">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="积分可用于兑换限量纪念品、激活码等，通过发布作品或参与站内活动获取"
                            placement="top"
                        >
                            <div class="u-credit-name"><i class="el-icon-sugar"></i> 积分</div>
                        </el-tooltip>
                        <div class="u-credit-value">
                            <b>{{ asset.points }}</b>
                        </div>
                        <div class="u-credit-op">
                            <router-link class="el-button el-button--primary el-button--mini" to="/points"
                                >记录</router-link
                            >
                            <a class="el-button el-button--primary el-button--mini" href="/vip/mall" target="_blank"
                                >兑换</a
                            >
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="u-packet">
                        <div class="u-credit-name"><i class="el-icon-bank-card"></i> 卡密</div>
                        <div class="u-credit-value" v-if="asset.ext_info">
                            <b>{{ Number(asset.ext_info.keycode || 0) + Number(asset.ext_info.sn || 0) }}</b>
                        </div>
                        <div class="u-credit-op">
                            <router-link class="el-button el-button--primary el-button--mini" to="/card"
                                >查看</router-link
                            >
                        </div>
                    </div>
                    <!-- <div class="u-packet">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="红包可用于积分商城抵扣现金，通过特殊活动获取"
                            placement="top"
                        >
                            <div class="u-credit-name"><i class="el-icon-present"></i> 红包</div>
                        </el-tooltip>
                        <div class="u-credit-value">
                            <b>{{ formatCredit(asset.red_packet)  }}</b>
                        </div>
                        <div class="u-credit-op">
                            <router-link class="el-button el-button--primary el-button--mini" to="/packet"
                                >记录</router-link
                            >
                            <a class="el-button el-button--primary el-button--mini" href="/vip/mall" target="_blank"
                                >兑换</a
                            >
                        </div>
                    </div> -->
                </el-col>
                <el-col :span="6">
                    <div class="u-cny">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="余额与人民币(单位分)为1:1，只能通过充值或玩家赠送获取"
                            placement="top"
                        >
                            <div class="u-credit-name"><i class="el-icon-wallet"></i> 金箔</div>
                        </el-tooltip>
                        <div class="u-credit-value">
                            <b>{{ asset.cny }}</b>
                        </div>
                        <div class="u-credit-op">
                            <!-- <a class="el-button el-button--primary el-button--mini" href="/vip/cny" target="_blank"
                                >充值</a
                            > -->
                            <router-link class="el-button el-button--primary el-button--mini" to="/cny"
                                >记录</router-link
                            >
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="m-index-asset-logs">
            <h2 class="u-title">
                <i class="el-icon-bell"></i> 资产动态
                <div class="u-dates">
                    <i class="el-icon-date"></i>
                    <el-radio-group v-model="date">
                        <el-radio v-for="(item, i) in dates" :key="i" :label="item.value">{{ item.label }}</el-radio>
                    </el-radio-group>
                </div>
            </h2>
            <ul class="u-list" v-if="asset_logs && asset_logs.length">
                <li class="u-item" v-for="(item, i) in asset_logs" :key="i">
                    <i :class="showAssetIcon(item.type)"></i>

                    <span class="u-type">{{ showAssetType(item.type) }}</span>
                    <span class="u-div">／</span>
                    <!-- 积分 -->
                    <span class="u-boxcoin" v-if="item.type == 'points'">
                        <span class="u-boxcoin-type">{{ item.data.remark }}</span>
                        <b :class="showBoxcoinCls(item.data)">
                            <span>{{ showBoxcoinOp(item.data) }}</span>
                            {{ countBoxCoin(item.data) }}
                        </b>
                        <a
                            class="u-link"
                            :href="getPostLink(item.data.post_type, item.data.article_id)"
                            v-if="item.data.post_type && item.data.article_id"
                            ><i class="el-icon-link"></i>查看详情</a
                        >
                    </span>
                    <!-- 盒币 -->
                    <span class="u-boxcoin" v-if="item.type == 'boxcoin'">
                        <span class="u-boxcoin-type">{{ showBoxcoinType(item.data) }}</span>
                        <b :class="showBoxcoinCls(item.data)">
                            <span>{{ showBoxcoinOp(item.data) }}</span
                            >{{ countBoxCoin(item.data) }}
                        </b>
                        ,
                        <span class="u-boxcoin-remark">{{ item.data.remark || "-" }}</span>
                        <a
                            class="u-link"
                            :href="getPostLink(item.data.post_type, item.data.post_id)"
                            v-if="item.data.post_type && item.data.post_id"
                            ><i class="el-icon-link"></i>查看详情</a
                        >
                    </span>

                    <!-- 订单 -->
                    <span class="u-order" v-if="item.type == 'order'">
                        产品：{{ showProduct(item.data.product_id) }}， 金额：¥
                        <b>{{ showPrice(item.data.total_fee) }}</b>
                        ， 状态：{{ showPayStatus(item.data.pay_status) }}
                    </span>

                    <!-- 红包 -->
                    <span class="u-redpack" v-if="item.type == 'redpack'">
                        金额：¥
                        <b>{{ showPrice(item.data.money) }}</b>
                        ， 补充信息：{{ item.data.describe || "-" }}
                    </span>

                    <!-- 金箔 -->
                    <span class="u-boxcoin" v-if="item.type == 'cny'">
                        <span class="u-boxcoin-type">{{ showCNYType(item.data) }}</span>
                        <b :class="showCNYCls(item.data)">
                            <span>{{ showCNYOp(item.data) }}</span
                            >{{ item.data.money }}
                        </b>
                        ,
                        <span class="u-boxcoin-remark">{{ item.data.remark || "-" }}</span>
                        <a
                            class="u-link"
                            :href="getPostLink(item.data.link_article_type, item.data.link_article_id)"
                            v-if="item.data.link_article_type && item.data.link_article_id"
                            ><i class="el-icon-link"></i>查看详情</a
                        >
                    </span>

                    <time class="u-time">{{ showTime(item.created_at) }}</time>
                </li>
            </ul>
            <div class="u-null" v-else><i class="el-icon-warning-outline"></i> 当前时间范围内无记录</div>
        </div>
    </div>
</template>

<script>
import { __userGroup, __imgPath, __userLevelColor, __userLevel, __cdn } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getUserMedals, getMyAssetLogs, getMyInfo } from "@/service/dashboard/index.js";
import { showDate } from "@jx3box/jx3box-common/js/moment";
import asset_types from "@/assets/data/dashboard/asset_log_types.json";
import boxcoin_types from "@/assets/data/dashboard/boxcoin_types.json";
import cny_types from "@/assets/data/dashboard/cny_types.json";
import { products, pay_status, pay_types } from "@/assets/data/dashboard/pay_order.json";
import moment from "moment";
import avatar from "./avatar.vue";
import medal from "@jx3box/jx3box-common-ui/src/medal/medal.vue";
export default {
    components: { avatar, medal },
    name: "index",
    props: [],
    data: function () {
        return {
            uid: User.getInfo().uid,
            group: User.getInfo().group,
            info: {
                uid: 8,
                name: "匿名",
                user_avatar: "https://img.jx3box.com/image/common/avatar.png",
                user_avatar_frame: "default",
                bio: "-",
                sign: 0,
            },
            asset: {
                expire_date: "2022-03-07T00:00:00+08:00",
                total_day: 395,
                was_vip: 0,

                pro_expire_date: "2022-03-07T00:00:00+08:00",
                pro_total_day: 366,
                was_pro: 0,

                box_coin: 0, //盒币
                red_packet: 0, //红包
                points: 0, //积分
                gift: 0, //礼品、商城订单
                cny: 0, //金箔
            },
            medals: [],
            asset_logs: [],
            asset_types,
            boxcoin_types,
            products,
            pay_status,
            pay_types,

            date: moment().subtract(7, "days").format("YYYYMMDD"),
        };
    },
    computed: {
        isVIP: function () {
            return User._isVIP(this.asset) || false;
        },
        isPRO: function () {
            return User._isPRO(this.asset) || false;
        },
        vipType: function () {
            return this.isPRO ? "PRO" : "PRE";
        },
        expire_date: function () {
            if (this.isPRO) {
                return showDate(this.asset.pro_expire_date);
            } else if (this.isVIP) {
                return showDate(this.asset.expire_date);
            } else {
                return "";
            }
        },
        super_author_icon: function () {
            return __imgPath + "image/user/" + "superauthor.svg";
        },
        dates: function () {
            return [
                {
                    label: "今天",
                    value: moment().format("YYYYMMDD"),
                },
                {
                    label: "7天",
                    value: moment().subtract(7, "days").format("YYYYMMDD"),
                },
                {
                    label: "30天",
                    value: moment().subtract(30, "days").format("YYYYMMDD"),
                },
            ];
        },
        isSuperAuthor: function () {
            return !!this.info?.sign;
        },
        level: function () {
            return User.getLevel(this.info?.experience || 0);
        },
        levelProgress: function () {
            const [min, max] = __userLevel[this.level];
            // 小数点后两位
            const val = this.level == this.maxLevel ? 100 : ((this.info?.experience / max) * 100).toFixed(0);
            return isNaN(val) ? 0 : Number(val);
        },
        currentLevelMaxExp: function () {
            const [min, max] = __userLevel[this.level];
            return max;
        },
        maxLevel: function () {
            const keys = Object.keys(__userLevel)?.map(Number);

            return Math.max(...keys);
        },
    },
    methods: {
        formatProgress: function () {
            return `${this.info?.experience || 0} / ${this.currentLevelMaxExp}`;
        },
        loadUserInfo: function () {
            getMyInfo().then((res) => {
                if (res.data.data) {
                    this.info = res.data.data;
                }
            });
        },
        loadAsset: function () {
            User.getAsset().then((data) => {
                this.asset = data;
            });
        },
        loadMedals: function () {
            if (!this.uid) return;
            getUserMedals(this.uid).then((res) => {
                this.medals = res.data.data || [];
            });
        },
        loadFrames: function () {
            getFrames().then((res) => {
                if (res.data) {
                    this.frames = res.data || [];
                }
            });
        },
        loadAssetLogs: function () {
            getMyAssetLogs(this.date).then((res) => {
                this.asset_logs = res.data.data.list || [];
            });
        },
        init: function () {
            this.loadUserInfo();
            this.loadAsset();
            this.loadMedals();
            this.loadAssetLogs();
        },
        getPostLink: function (post_type, post_id) {
            return post_type == "mall_order" ? `/vip/mall/${post_id}` : getLink(post_type, post_id);
        },
        showMedalIcon: function (val) {
            return __cdn + "design/medals/user/" + val + ".gif";
        },
        showBoxcoinType: function (item) {
            if (item.action_type == 9) {
                return item.operate_user_id == this.uid ? "作品付费" : "作品收入";
            }
            return boxcoin_types[item.action_type] || item.action_type;
        },
        countBoxCoin: function (item) {
            if (!item.ext_take_off_count) return item.count;
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
        showCNYType: function (item) {
            if (item.action_type == "-2") {
                return item.pay_user_id == this.uid ? "金箔消费" : "金箔收入";
            }
            return cny_types[item.action_type] || item.description || item.action_type;
        },
        showCNYOp(item) {
            if (item.action_type == "-2") {
                return item.pay_user_id == this.uid ? "-" : "+";
            }
            if (item.action_type == "-3") {
                return item.pay_user_id == this.uid ? "-" : "+";
            }
            return item.money >= 0 ? "+" : "";
        },
        showCNYCls(item) {
            if (item.action_type == "-2") {
                return item.pay_user_id == this.uid && "isNegative";
            }
            return item.money < 0 && "isNegative";
        },

        // groupicon: function (groupid) {
        //     return __imgPath + "image/group/" + groupid + ".svg";
        // },
        showGroupName: function (val) {
            return val ? __userGroup[val] : "游客";
        },
        formatCredit: function (val) {
            return val ? (val / 100).toFixed(2) : "0.00";
        },
        // showAvatar: function (val) {
        //     return (val && getThumbnail(val, 120, true)) || getThumbnail(default_avatar, 120, true);
        // },
        showAssetType: function (val) {
            return asset_types[val]?.["label"] || val;
        },
        showAssetIcon: function (val) {
            return asset_types[val]?.["icon"] || "el-icon-box";
        },

        showProduct: function (val) {
            return products[val];
        },
        showPayStatus: function (val) {
            return pay_status[val];
        },
        // showPayType: function (val) {
        //     return pay_types[val];
        // },
        showPrice: function (val) {
            return val ? (val / 100).toFixed(2) : "0.00";
        },
        showTime(val) {
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
        },
    },
    mounted: function () {
        this.init();
    },
    watch: {
        date: function () {
            this.loadAssetLogs();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/index.less";
</style>
