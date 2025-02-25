<template>
    <div class="m-dashboard-keycode m-credit">
        <h2 class="u-title">
            <span>
                <i class="el-icon-bank-card"></i>
                我的卡密
            </span>
            <span class="u-only">
                <el-switch v-model="onlyNew" active-text="仅查看未使用"></el-switch>
            </span>
        </h2>
        <el-alert class="m-boxcoin-tip" title="请务必妥善保管，并注意过期时间。" type="warning" show-icon>
            <!-- <a href="https://charge.xoyo.com/pay?item=jx3&way=kcard" target="_blank">金山一卡通充值页面</a> -->
            <div class="m-boxcoin-tip__content" v-html="bread"></div>
        </el-alert>
        <div class="m-keycode-tab">
            <el-tabs type="border-card" v-model="tab" @tab-click="tabClick">
                <el-tab-pane label="激活码(直发)" name="sn">
                    <template #label>
                        <span class="u-tab--title">激活码</span>
                        (<span class="u-tab--desc">直发</span>)
                    </template>
                    <el-table
                        class="m-table"
                        v-if="codeList.length"
                        :data="codeList"
                        show-header
                        cell-class-name="u-table-cell"
                        header-cell-class-name="u-header-cell"
                        v-loading="loading"
                    >
                        <el-table-column prop="type" label="类型" width="120px">
                            <template slot-scope="scope">{{
                                snOptions.types[scope.row.type] || scope.row.type || "其他"
                            }}</template>
                        </el-table-column>
                        <el-table-column prop="subtype" label="渠道" width="100px">
                            <template slot-scope="scope">{{
                                snOptions.subtypes[scope.row.subtype] || "其他"
                            }}</template>
                        </el-table-column>
                        <el-table-column prop="describe" label="描述" width="160px"></el-table-column>
                        <el-table-column label="激活码" width="280">
                            <template slot-scope="scope">
                                <div class="u-code">
                                    <span class="u-txt">{{ scope.row.code || "****************" }}</span>
                                    <el-button
                                        v-if="!scope.row.code"
                                        type="primary"
                                        icon="el-icon-view"
                                        @click="getSn(scope.$index, scope.row)"
                                        size="mini"
                                        plain
                                        >点击查看</el-button
                                    >
                                    <el-button
                                        class="u-btn"
                                        v-else
                                        type="txt"
                                        size="mini"
                                        icon="el-icon-document-copy"
                                        v-clipboard:copy="'' + scope.row.code"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                        >复制</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="过期时间" width="200">
                            <template slot-scope="scope">
                                <div class="u-time" v-if="scope.row.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.expire_at, 'tag')">{{
                                        compareTime(scope.row.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="发放时间" width="200" prop="grant_at"></el-table-column>
                        <el-table-column prop="remark" label="备注" width="200"> </el-table-column>
                        <el-table-column prop="used_by_self" label="是否使用">
                            <template slot-scope="scope">
                                <span class="u-used" :class="{ 'is-used': scope.row.used_by_self }">{{
                                    scope.row.used_by_self ? "是" : "否"
                                }}</span>

                                <el-button
                                    v-show="!scope.row.used_by_self"
                                    type="text"
                                    size="mini"
                                    @click="onSnUsedClick(scope.row)"
                                    >（标记使用）</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="activate_url" label="激活地址">
                            <template #default="scope">
                                <a :href="scope.row.activate_url" target="_blank">{{
                                    (scope.row.activate_url && "前往激活") || ""
                                }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到任何记录"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination"
                        @current-change="currentChange"
                        class="m-credit-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
                <el-tab-pane label="激活码(积分兑换|抽奖)" name="virtual">
                    <template #label>
                        <span class="u-tab--title">激活码</span>
                        (<span class="u-tab--desc">积分兑换|抽奖</span>)
                    </template>
                    <el-table
                        class="m-table"
                        v-if="virtualList.length"
                        :data="virtualList"
                        show-header
                        v-loading="loading"
                    >
                        <el-table-column label="名称" width="120px">
                            <template slot-scope="scope">{{ scope.row.goods.title || "-" }}</template>
                        </el-table-column>
                        <el-table-column label="激活码" width="330">
                            <template slot-scope="scope">
                                <div class="u-code">
                                    <span class="u-txt">{{ scope.row.code || "****************" }}</span>
                                    <el-button
                                        v-if="!scope.row.code"
                                        type="primary"
                                        icon="el-icon-view"
                                        @click="getVirtualCode(scope.$index, scope.row)"
                                        size="mini"
                                        plain
                                        >点击查看</el-button
                                    >
                                    <el-button
                                        class="u-btn"
                                        v-else
                                        type="txt"
                                        size="mini"
                                        icon="el-icon-document-copy"
                                        v-clipboard:copy="'' + scope.row.code"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                        >复制</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="过期时间" width="200">
                            <template slot-scope="scope">
                                <div class="u-time" v-if="scope.row.goods.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.goods.expire_at, 'tag')">{{
                                        compareTime(scope.row.goods.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.goods.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" min-width="200">
                            <template slot-scope="scope">
                                {{ scope.row.goods.mark || scope.row.goods.subtitle }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="used_by_self" label="是否使用">
                            <template slot-scope="scope">
                                <span class="u-used" :class="{ 'is-used': scope.row.owner.used_by_self }">{{
                                    scope.row.owner.used_by_self ? "是" : "否"
                                }}</span>

                                <el-button
                                    v-show="!scope.row.owner.used_by_self"
                                    type="text"
                                    size="mini"
                                    @click="onVirtualUsedClick(scope.row)"
                                    >（标记使用）</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="activate_url" label="激活地址">
                            <template #default="scope">
                                <a :href="scope.row.activate_url" target="_blank">{{
                                    (scope.row.activate_url && "跳转激活") || "-"
                                }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到任何记录"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination"
                        @current-change="currentChange"
                        class="m-credit-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        :current-page.sync="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
                <el-tab-pane label="一卡通" name="keycode">
                    <el-table
                        class="m-table"
                        v-if="keycodeList.length"
                        :data="keycodeList"
                        show-header
                        v-loading="loading"
                    >
                        <el-table-column prop="type" label="类型" width="120">
                            <template slot-scope="scope">{{ keycodeOptions.types[scope.row.type] || "其他" }}</template>
                        </el-table-column>
                        <el-table-column prop="subtype" label="渠道" width="120">
                            <template slot-scope="scope">{{
                                keycodeOptions.subtypes[scope.row.subtype] || "其他"
                            }}</template>
                        </el-table-column>
                        <el-table-column label="面额" width="120">
                            <template slot-scope="scope">{{ scope.row.count }}</template>
                        </el-table-column>
                        <el-table-column label="卡密" width="360">
                            <template slot-scope="scope">
                                <div class="u-card">
                                    <div class="u-count">
                                        <div class="u-line">
                                            <span>卡号：{{ scope.row.key || "****************" }}</span>
                                            <el-button
                                                class="u-btn"
                                                v-if="scope.row.key"
                                                type="txt"
                                                size="mini"
                                                icon="el-icon-document-copy"
                                                v-clipboard:copy="'' + scope.row.key"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"
                                                >复制卡号</el-button
                                            >
                                        </div>
                                        <div class="u-line">
                                            <span>卡密：{{ scope.row.code || "****************" }} </span>
                                            <el-button
                                                v-if="!scope.row.code"
                                                type="primary"
                                                icon="el-icon-view"
                                                @click="getKeycode(scope.$index, scope.row)"
                                                size="mini"
                                                plain
                                                >点击查看</el-button
                                            >
                                            <el-button
                                                class="u-btn"
                                                v-if="scope.row.code"
                                                type="txt"
                                                size="mini"
                                                icon="el-icon-document-copy"
                                                v-clipboard:copy="'' + scope.row.code"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"
                                                >复制卡密</el-button
                                            >
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="过期时间" width="200">
                            <template slot-scope="scope">
                                <div class="u-time" v-if="scope.row.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.expire_at, 'tag')">{{
                                        compareTime(scope.row.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="发放时间" width="200" prop="grant_at"></el-table-column>
                        <el-table-column prop="remark" label="备注" width="200"> </el-table-column>
                        <el-table-column prop="used_by_self" label="是否使用">
                            <template slot-scope="scope">
                                <span class="u-used" :class="{ 'is-used': scope.row.used_by_self }">{{
                                    scope.row.used_by_self ? "是" : "否"
                                }}</span>

                                <el-button
                                    v-show="!scope.row.used_by_self"
                                    type="text"
                                    size="mini"
                                    @click="onKeyCodeUsedClick(scope.row)"
                                    >（标记使用）</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到任何记录"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination"
                        @current-change="currentChange"
                        class="m-credit-pages"
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
import {
    getKeycodeList,
    getSnList,
    activationKeycode,
    activationSn,
    markSn,
    markKeycode,
    getVirtualCode,
    markVirtualCode,
} from "@/service/dashboard/card.js";
import { getVirtual } from "@/service/dashboard/goods";
import keycodeOptions from "@/assets/data/dashboard/card_keycode.json";
import snOptions from "@/assets/data/dashboard/card_sn.json";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import { cloneDeep } from "lodash";

// import _ from "lodash";
export default {
    name: "card",
    data: function () {
        return {
            loading: false,
            per: 10,
            page: 1,
            total: 0,

            tab: "sn",
            list: [],

            keycodeOptions,
            snOptions,
            showPagination: true,
            onlyNew: false,
            virtualList: [],

            codeList: [],
            keycodeList: [],

            bread: "",
        };
    },

    computed: {
        params() {
            return {
                tab: this.tab,
                pageIndex: this.page,
                pageSize: this.per,
            };
        },
        loadName() {
            return "load" + this.tab.slice(0, 1).toUpperCase() + this.tab.slice(1);
        },
        filteredList() {
            return this.onlyNew ? this.list.filter((i) => !i.used_by_self) : this.list;
        },
    },
    watch: {
        onlyNew() {
            if (this.tab == "sn") {
                this.page = 1;
                this.loadSn();
            } else if (this.tab == "keycode") {
                this.page = 1;
                this.loadKeycode();
            }
        },
    },
    methods: {
        // 获取一卡通列表
        loadKeycode() {
            this.loading = true;
            this.$router.push({
                name: "card",
                query: {
                    tab: "keycode",
                    page: this.page,
                },
            });
            this.showPagination = false;
            const params = {
                ...this.params,
                used_by_self: this.onlyNew ? 0 : undefined,
            };
            getKeycodeList(params)
                .then((res) => {
                    let list = res.data.data.list || [];
                    this.keycodeList = list.map((item) => {
                        item.code = "";
                        return item;
                    });
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        // 获取激活码列表
        loadSn() {
            this.loading = true;
            this.$router.push({
                name: "card",
                query: {
                    tab: "sn",
                    page: this.page,
                },
            });
            this.showPagination = false;
            const params = {
                ...this.params,
                used_by_self: this.onlyNew ? 0 : undefined,
            };
            getSnList(params)
                .then((res) => {
                    let list = res.data.data.list || [];
                    this.codeList = list.map((item) => {
                        item.sn = "";
                        item.code = "";
                        return item;
                    });
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        // 获取激活码列表
        loadVirtual() {
            this.loading = true;
            this.$router.push({
                name: "card",
                query: {
                    tab: "virtual",
                    page: this.page,
                },
            });
            this.showPagination = false;
            getVirtual({ sub_category: "codesn", virtual_type: 1 })
                .then((res) => {
                    let list = res.data.data.list || [];
                    this.virtualList = list.map((item) => {
                        item.goods.goods_secret = "";
                        return item;
                    });
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                    this.showPagination = true;
                });
        },
        //  获取单个卡密
        getKeycode(index, row) {
            this.$prompt("请输入密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "password",
            }).then(({ value }) => {
                activationKeycode(row.id, { password: value }).then((res) => {
                    let { code, key } = res.data.data;
                    row.code = code;
                    row.key = key;
                    this.$set(this.list, index, row);
                });
            });
        },
        //  获取单个激活码
        getSn(index, row) {
            this.$prompt("请输入密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "password",
            }).then(({ value }) => {
                activationSn(row.id, { password: value }).then((res) => {
                    row.code = res.data.data.sn;
                    this.$set(this.list, index, row);
                });
            });
        },
        // 获取虚拟卡密
        getVirtualCode(index, row) {
            this.$prompt("请输入密码", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "password",
            }).then(({ value }) => {
                getVirtualCode(row.goods.id, { password: value }).then((res) => {
                    let { good_number } = res.data.data;

                    const list = cloneDeep(this.virtualList);
                    this.virtualList = list.map((item, i) => {
                        if (i === index) {
                            item.code = good_number;
                        }
                        return item;
                    });
                });
            });
        },
        // 判断过期时间
        compareTime(date, type) {
            const key = new Date(date).getTime() > Date.now() ? 0 : 1;
            const _tag = {
                0: "green",
                1: "gray",
            };
            const _status = {
                0: "未过期",
                1: "已过期",
            };

            return type == "tag" ? _tag[key] : _status[key];
        },

        // 标记使用
        onKeyCodeUsedClick(row) {
            this.$confirm("确认标记为已使用吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    markKeycode(row.id, "used").then((res) => {
                        this.$message({
                            type: "success",
                            message: "标记成功!",
                        });
                        this.loadKeycode();
                    });
                })
                .catch(() => {});
        },
        onSnUsedClick(row) {
            this.$confirm("确认标记为已使用吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    markSn(row.id, "used").then((res) => {
                        this.$message({
                            type: "success",
                            message: "标记成功!",
                        });
                        this.loadSn();
                    });
                })
                .catch(() => {});
        },
        onVirtualUsedClick(row) {
            this.$confirm("确认标记为已使用吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    markVirtualCode(row.goods.id, 1).then((res) => {
                        this.$message({
                            type: "success",
                            message: "标记成功!",
                        });
                        this.loadVirtual();
                    });
                })
                .catch(() => {});
        },

        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
        currentChange(val) {
            this.page = val;
            this[this.loadName]();
        },
        tabClick(tab) {
            this.page = 1;
            this.tab = tab.name;
            this[this.loadName]();
        },
    },
    mounted() {
        if (this.$route.query.tab) this.tab = this.$route.query.tab;
        this.page = Number(this.$route.query.page || 1);
        this.loadName && this[this.loadName]();

        getBreadcrumb("dashboard_card_tips").then((res) => {
            this.bread = res;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/keycode.less";
</style>
