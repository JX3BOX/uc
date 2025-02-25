<template>
    <div class="m-points" v-loading="loading">
        <h2><i class="el-icon-sugar"></i> 我的银铛</h2>
        <div class="m-balance">
            <span class="u-label">余额 : </span>
            <b :class="money > 0 ? 'u-have' : ''" class="u-num">{{ money }}</b>
            <a class="el-button u-btn el-button--primary el-button--mini" href="/vip/mall" target="_blank">兑换</a>
        </div>
        <el-tabs class="m-tabs" type="border-card" v-model="tab_value" @tab-click="changeTab">
            <!-- 积分记录 -->
            <el-tab-pane label="积分记录" name="point">
                <el-table class="m-table" :data="list" show-header cell-class-name="u-table-cell" header-cell-class-name="u-header-cell">
                    <el-table-column label="类型">
                        <template slot-scope="scope">{{ formatType(scope.row.action_type) }}</template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <div class="u-count" :class="{ isNegative: Number(scope.row.count) < 0 }" slot-scope="scope">
                            <span>{{ Number(scope.row.count) > 0 ? "+" : "" }}</span> <b>{{ scope.row.count }}</b>
                        </div>
                    </el-table-column>
                    <el-table-column prop="count" label="源于作品">
                        <a class="u-link" :href="getPostLink(scope.row)" target="_blank" v-if="getPostLink(scope.row)" slot-scope="scope"><i class="el-icon-link"></i> 点击查看 </a>
                        <span v-else> - </span>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template slot-scope="scope">{{ formatRemark(scope.row.remark) }}</template>
                    </el-table-column>
                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <span>{{ showTime(scope.row.created_at) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="m-packet-pages" background :page-size="per" :hide-on-single-page="true" :current-page.sync="page" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="经验记录" name="ex">
                <el-table class="m-table" :data="list" show-header cell-class-name="u-table-cell" header-cell-class-name="u-header-cell">
                    <el-table-column label="类型">
                        <template slot-scope="scope">{{ formatType(scope.row.action_type) }}</template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <div class="u-count" :class="{ isNegative: Number(scope.row.count) < 0 }" slot-scope="scope">
                            <span>{{ Number(scope.row.count) > 0 ? "+" : "" }}</span> <b>{{ scope.row.count }}</b>
                        </div>
                    </el-table-column>
                    <el-table-column prop="count" label="源于作品">
                        <a class="u-link" :href="getPostLink(scope.row)" target="_blank" v-if="getPostLink(scope.row)" slot-scope="scope"><i class="el-icon-link"></i> 点击查看 </a>
                        <span v-else> - </span>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template slot-scope="scope">{{ formatRemark(scope.row.remark) }}</template>
                    </el-table-column>
                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <span>{{ showTime(scope.row.created_at) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="m-packet-pages" background :page-size="per" :hide-on-single-page="true" :current-page.sync="page" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { getPointsHistory, getExperienceHistory } from "@/service/dashboard/points.js";
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import types from "@/assets/data/dashboard/points_types.json";
export default {
    name: "points",
    components: {},
    data: function () {
        return {
            money: 0,
            loading: false,
            list: [],
            tab_value: "point",

            page: 1,
            per: 10,
            total: 0,
            types,
        };
    },
    computed: {
        params() {
            let _params = {
                pageIndex: this.page,
                pageSize: this.per,
            };
            return _params;
        },
    },
    methods: {
        loadAsset() {
            User.getAsset().then((data) => {
                this.money = data?.points || 0;
            });
        },
        loadData() {
            this.loading = true;
            this.$router.push({
                name: 'points',
                query: {
                    tab: this.tab_value,
                    page: this.page,
                }
            })
            const fn = this.tab_value === "point" ? getPointsHistory : getExperienceHistory;
            fn(this.params)
                .then((res) => {
                    this.list = res.list;
                    this.total = res.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getPostLink(item) {
            return getLink(item.post_type, item.article_id);
        },
        formatType: function (val) {
            return (val && this.types[val]) || "未知";
        },
        formatRemark: function (str) {
            if (str) {
                if (str.length > 18) {
                    return str.slice(0,18) + "...";
                } else {
                    return str;
                }
            } else {
                return "-";
            }
        },
        changeTab() {
            this.page = 1;
            this.loadData()
        },
        showTime,
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    created: function () {
        this.tab_value = this.$route.query.tab || "point";
        this.page = Number(this.$route.query.page || 1);
        this.loadData();
        this.loadAsset();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/packet.less";
@import "~@/assets/css/dashboard/points.less";
</style>
