<template>
    <div class="m-mall-nav">
        <a :href="lotteryLink" class="u-lottery-link" target="_blank" v-if="showLottery">
            <el-image :src="lottery" lazy fit="cover"> </el-image>
        </a>
        <div class="m-mall-profile">
            <el-divider>当前资产</el-divider>
            <div class="u-credit u-level">
                <el-tooltip class="item" effect="dark" content="经验仅可通过日常签到与社区互动获取" placement="top">
                    <div class="u-credit-name"><i class="el-icon-user"></i> 等级</div>
                </el-tooltip>
                <div class="u-credit-value">
                    <!--  :style="levelStyle" -->
                    <b>Lv.{{ level }}</b>
                </div>
            </div>
            <div class="u-credit" :class="`u-${item.value}`" v-for="item in assets" :key="item.value">
                <el-tooltip class="item" effect="dark" :content="item.tip" placement="top">
                    <div class="u-credit-name">
                        <i :class="item.icon"></i> {{ item.label }}<em>（{{ item.sub_label }}）</em>
                    </div>
                </el-tooltip>
                <div class="u-credit-value">
                    <b>{{ asset[item.value] }}</b>
                </div>
            </div>
        </div>
        <div class="m-mall-types">
            <div class="u-item" v-for="(item, i) in types" :key="i">
                <!-- 分组名 -->
                <router-link
                    :to="{ name: 'mall_list', query: { category: item.key, sub_category: '' } }"
                    class="u-title"
                    :class="category == item.key ? 'active' : ''"
                    @click.native="itemLinkClick(item.key)"
                    v-if="item.key != 'system'"
                >
                    <i class="u-icon" :class="item.icon"></i> {{ item.name }}
                </router-link>
                <span v-else class="u-title" :class="category == item.key ? 'active' : ''" style="cursor: default"
                    ><i class="u-icon" :class="item.icon"></i> {{ item.name }}</span
                >

                <!-- 子列表 -->
                <div class="u-children-list" v-if="item.key != 'system'">
                    <router-link
                        :to="{ name: 'mall_list', query: { category: item.key, sub_category: child.key } }"
                        class="u-child"
                        v-for="(child, key) in item.sub_category"
                        :key="key"
                        :class="sub_category == child.key ? 'active' : ''"
                        @click.native="childLinkClick(item.key, child.key)"
                    >
                        <img
                            svg-inline
                            :src="
                                require(`@/assets/img/vip/mall/icon_0${
                                    query.sub_category !== child.key ? '1' : '2'
                                }.svg`)
                            "
                        />
                        {{ child.name }}
                    </router-link>
                </div>
                <div class="u-children-list" v-else>
                    <a
                        :href="child.link"
                        :target="child.target"
                        class="u-child"
                        v-for="(child, key) in item.sub_category"
                        :key="key"
                        :class="sub_category == child.key ? 'active' : sub_category == child.key ? 'active' : ''"
                    >
                        <img
                            svg-inline
                            :src="
                                require(`@/assets/img/vip/mall/icon_0${
                                    query.sub_category !== child.key ? '1' : '2'
                                }.svg`)
                            "
                        />
                        {{ child.name }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import types from "@/assets/data/vip/goods_types.json";
import User from "@jx3box/jx3box-common/js/user";
import { getConfig } from "@/service/vip/cms";
import { __userLevelColor, __Root, __cdn } from "@/utils/config";
export default {
    name: "GoodsNav",
    data: function () {
        return {
            types,
            // routerName: null,
            asset: {
                experience: 0, //经验
                cny: 0, //金箔
                box_coin: 0, //盒币
                points: 0, //积分
                red_packet: 0, //红包
            },
            isLogin: User.isLogin(),
            category: "",
            sub_category: "",

            assets: [
                {
                    label: "盒币",
                    sub_label: "= 通宝",
                    value: "box_coin",
                    tip: "1盒币可用于兑换1通宝，通过评审团/用户打赏获取",
                    icon: "el-icon-coin",
                },
                {
                    label: "积分",
                    value: "points",
                    sub_label: "= 银铛",
                    tip: "积分可用于兑换限量纪念品，主要通过日常签到与社区互动获取",
                    icon: "el-icon-sugar",
                },
                // {
                //     label: "金箔",
                //     value: "cny",
                //     sub_label: "= RMB 分",
                //     tip: "余额与人民币(单位分)为1:1，只能通过充值或玩家赠送获取",
                //     icon: "el-icon-wallet",
                // },
            ],
            showLottery: false,
        };
    },
    computed: {
        levelStyle() {
            return {
                background: __userLevelColor[this.level],
                color: "#fff",
                padding: "0 8px",
                borderRadius: "2px",
            };
        },
        level() {
            return User.getLevel(this.asset.experience);
        },
        lotteryLink() {
            return __Root + "vip/lottery";
        },
        lottery() {
            return __cdn + "design/event/lottery/lottery.png";
        },
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(val) {
                this.category = val.query?.category || "";
                this.sub_category = val.query?.sub_category || "";
            },
        },
    },
    methods: {
        loadAsset: function () {
            User.getAsset().then((data) => {
                this.asset = data;
            });
        },
        itemLinkClick: function (key) {
            this.category = key;
        },
        childLinkClick: function (key, child) {
            this.category = key;
            this.sub_category = child;
        },
        loadConfig: function () {
            getConfig({ key: "mall_lottery_pic" }).then((res) => {
                this.showLottery = res?.val == "0" ? false : true;
            });
        },
    },
    mounted() {
        User.isLogin() && this.loadAsset();
        this.loadConfig();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_nav.less";
.u-lottery-link {
    .size(100%,120px);
    .r(10px);
    .mb(10px);
    .clip;
}
</style>
