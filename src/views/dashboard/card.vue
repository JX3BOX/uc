<template>
    <div class="m-dashboard-keycode m-credit">
        <h2 class="u-title">
            <span>
                <i class="el-icon-bank-card"></i>
                {{ $t("dashboard.cards.title") }}
            </span>
            <span class="u-only">
                <el-switch v-model="onlyNew" :active-text="$t('dashboard.cards.unusedOnly')"></el-switch>
            </span>
        </h2>
        <el-alert class="m-boxcoin-tip" :title="$t('dashboard.cards.keepSafeTip')" type="warning" show-icon>
            <!-- <a href="https://charge.xoyo.com/pay?item=jx3&way=kcard" target="_blank">金山一卡通充值页面</a> -->
            <div class="m-boxcoin-tip__content" v-html="bread"></div>
        </el-alert>
        <div class="m-keycode-tab">
            <el-tabs type="border-card" v-model="tab" @tab-change="tabClick">
                <el-tab-pane :label="$t('dashboard.cards.directCodes')" name="sn" lazy>
                    <template #label>
                        <span class="u-tab--title">{{ $t("dashboard.cards.activationCode") }}</span>
                        <span class="u-tab--desc">{{ $t("dashboard.cards.directIssue") }}</span>
                    </template>
                    <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
                    <el-table
                        class="m-table"
                        v-else-if="codeList.length"
                        :data="codeList"
                        show-header
                        cell-class-name="u-table-cell"
                        header-cell-class-name="u-header-cell"
                    >
                        <el-table-column prop="type" :label="$t('dashboard.common.type')" width="120px">
                            <template #default="scope">{{
                                cardTypeLabel(scope.row.type, snOptions.types[scope.row.type])
                            }}</template>
                        </el-table-column>
                        <el-table-column prop="subtype" :label="$t('dashboard.cards.channel')" width="100px">
                            <template #default="scope">{{
                                cardSubtypeLabel(scope.row.subtype, snOptions.subtypes[scope.row.subtype])
                            }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="describe"
                            :label="$t('dashboard.common.description')"
                            width="160px"
                        ></el-table-column>
                        <el-table-column :label="$t('dashboard.cards.activationCode')" width="280">
                            <template #default="scope">
                                <div class="u-code">
                                    <span class="u-txt">{{ scope.row.code || "****************" }}</span>
                                    <el-button
                                        v-if="!scope.row.code"
                                        type="primary"
                                        icon="View"
                                        @click="getSn(scope.$index, scope.row)"
                                        plain
                                        size="small"
                                        >{{ $t("dashboard.common.clickToView") }}</el-button
                                    >
                                    <el-button
                                        class="u-btn"
                                        v-else
                                        link
                                        icon="DocumentCopy"
                                        size="small"
                                        @click="copyToClipboard(scope.row.code)"
                                        >{{ $t("dashboard.common.copy") }}</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.common.expirationTime')" width="250">
                            <template #default="scope">
                                <div class="u-time" v-if="scope.row.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.expire_at, 'tag')">{{
                                        compareTime(scope.row.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('dashboard.cards.issuedAt')"
                            width="200"
                            prop="grant_at"
                        ></el-table-column>
                        <el-table-column prop="remark" :label="$t('dashboard.common.remark')" width="200">
                        </el-table-column>
                        <el-table-column prop="used_by_self" :label="$t('dashboard.cards.isUsed')">
                            <template #default="scope">
                                <el-icon
                                    class="u-used-icon"
                                    :class="{ 'is-used': scope.row.used_by_self }"
                                    @click="onSnUsedClick(scope.row)"
                                    size="20"
                                    :color="scope.row.used_by_self ? '#67C23A' : ''"
                                    ><CircleCheckFilled></CircleCheckFilled
                                ></el-icon>
                            </template>
                        </el-table-column>
                        <el-table-column prop="activate_url" :label="$t('dashboard.cards.activationUrl')">
                            <template #default="scope">
                                <a :href="scope.row.activate_url" target="_blank">{{
                                    (scope.row.activate_url && $t("dashboard.cards.goActivate")) || ""
                                }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        :title="$t('dashboard.common.noRecords')"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination && !loading"
                        @current-change="currentChange"
                        class="m-credit-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        v-model:current-page="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
                <el-tab-pane :label="$t('dashboard.cards.redeemedCodes')" name="virtual" lazy>
                    <template #label>
                        <span class="u-tab--title">{{ $t("dashboard.cards.activationCode") }}</span>
                        <span class="u-tab--desc">{{ $t("dashboard.cards.pointsOrLottery") }}</span>
                    </template>
                    <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
                    <el-table
                        class="m-table"
                        v-else-if="virtualList.length"
                        :data="virtualList"
                        show-header
                    >
                        <el-table-column :label="$t('dashboard.common.name')" width="120px">
                            <template #default="scope">{{ scope.row.goods.title || "-" }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.cards.activationCode')" width="330">
                            <template #default="scope">
                                <div class="u-code">
                                    <span class="u-txt">{{ scope.row.code || "****************" }}</span>
                                    <el-button
                                        v-if="!scope.row.code"
                                        type="primary"
                                        icon="View"
                                        @click="getVirtualCode(scope.$index, scope.row)"
                                        plain
                                        size="small"
                                        >{{ $t("dashboard.common.clickToView") }}</el-button
                                    >
                                    <el-button
                                        class="u-btn"
                                        v-else
                                        link
                                        icon="DocumentCopy"
                                        size="small"
                                        @click="copyToClipboard(scope.row.code)"
                                        >{{ $t("dashboard.common.copy") }}</el-button
                                    >
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.common.expirationTime')" width="250">
                            <template #default="scope">
                                <div class="u-time" v-if="scope.row.goods.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.goods.expire_at, 'tag')">{{
                                        compareTime(scope.row.goods.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.goods.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.common.remark')" min-width="200">
                            <template #default="scope">
                                {{ scope.row.goods.mark || scope.row.goods.subtitle }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="used_by_self" :label="$t('dashboard.cards.isUsed')">
                            <template #default="scope">
                                <el-icon
                                    class="u-used-icon"
                                    :class="{ 'is-used': scope.row.owner.used_by_self }"
                                    @click="onVirtualUsedClick(scope.row)"
                                    size="20"
                                    :color="scope.row.owner.used_by_self ? '#67C23A' : ''"
                                    ><CircleCheckFilled></CircleCheckFilled
                                ></el-icon>
                            </template>
                        </el-table-column>
                        <el-table-column prop="activate_url" :label="$t('dashboard.cards.activationUrl')">
                            <template #default="scope">
                                <a :href="scope.row.activate_url" target="_blank">{{
                                    (scope.row.activate_url && $t("dashboard.cards.goActivate")) || "-"
                                }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        :title="$t('dashboard.common.noRecords')"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination && !loading"
                        @current-change="currentChange"
                        class="m-credit-pages"
                        background
                        :page-size="per"
                        :hide-on-single-page="true"
                        v-model:current-page="page"
                        layout="total, prev, pager, next, jumper"
                        :total="total"
                    ></el-pagination>
                </el-tab-pane>
                <el-tab-pane :label="$t('dashboard.cards.prepaidCard')" name="keycode" lazy>
                    <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
                    <el-table
                        class="m-table"
                        v-else-if="keycodeList.length"
                        :data="keycodeList"
                        show-header
                    >
                        <el-table-column prop="type" :label="$t('dashboard.common.type')" width="120">
                            <template #default="scope">{{
                                cardTypeLabel(scope.row.type, keycodeOptions.types[scope.row.type])
                            }}</template>
                        </el-table-column>
                        <el-table-column prop="subtype" :label="$t('dashboard.cards.channel')" width="120">
                            <template #default="scope">{{
                                cardSubtypeLabel(scope.row.subtype, keycodeOptions.subtypes[scope.row.subtype])
                            }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.cards.denomination')" width="120">
                            <template #default="scope">{{ scope.row.count }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.cards.cardCode')" width="360">
                            <template #default="scope">
                                <div class="u-card">
                                    <div class="u-count">
                                        <div class="u-line">
                                            <span
                                                >{{ $t("dashboard.cards.cardNumber") }}：{{
                                                    scope.row.key || "****************"
                                                }}</span
                                            >
                                            <el-button
                                                class="u-btn"
                                                v-if="scope.row.key"
                                                link
                                                icon="DocumentCopy"
                                                size="small"
                                                @click="copyToClipboard(scope.row.key)"
                                                >{{ $t("dashboard.cards.copyCardNumber") }}</el-button
                                            >
                                        </div>
                                        <div class="u-line">
                                            <span
                                                >{{ $t("dashboard.cards.cardCode") }}：{{
                                                    scope.row.code || "****************"
                                                }}
                                            </span>
                                            <el-button
                                                v-if="!scope.row.code"
                                                type="primary"
                                                icon="View"
                                                @click="getKeycode(scope.$index, scope.row)"
                                                plain
                                                size="small"
                                                >{{ $t("dashboard.common.clickToView") }}</el-button
                                            >
                                            <el-button
                                                class="u-btn"
                                                v-if="scope.row.code"
                                                link
                                                icon="DocumentCopy"
                                                size="small"
                                                @click="copyToClipboard(scope.row.code)"
                                                >{{ $t("dashboard.cards.copyCardCode") }}</el-button
                                            >
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('dashboard.common.expirationTime')" width="250">
                            <template #default="scope">
                                <div class="u-time" v-if="scope.row.expire_at">
                                    <span class="u-tag" :class="compareTime(scope.row.expire_at, 'tag')">{{
                                        compareTime(scope.row.expire_at, "time")
                                    }}</span
                                    ><span>{{ scope.row.expire_at }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('dashboard.cards.issuedAt')"
                            width="200"
                            prop="grant_at"
                        ></el-table-column>
                        <el-table-column prop="remark" :label="$t('dashboard.common.remark')" width="200">
                        </el-table-column>
                        <el-table-column prop="used_by_self" :label="$t('dashboard.cards.isUsed')">
                            <template #default="scope">
                                <el-icon
                                    class="u-used-icon"
                                    :class="{ 'is-used': scope.row.used_by_self }"
                                    @click="onKeyCodeUsedClick(scope.row)"
                                    size="20"
                                    :color="scope.row.used_by_self ? '#67C23A' : ''"
                                    ><CircleCheckFilled></CircleCheckFilled
                                ></el-icon>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        :title="$t('dashboard.common.noRecords')"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                    <el-pagination
                        v-if="showPagination && !loading"
                        @current-change="currentChange"
                        class="m-credit-pages"
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
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system";
import { cloneDeep } from "lodash";

// import _ from "lodash";
export default {
    name: "card",
    data: function () {
        return {
            loading: true,
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
        cardTypeLabel(type, fallback) {
            const key = `dashboard.dataLabels.cardTypes.${type}`;
            return type && this.$te(key) ? this.$t(key) : fallback || type || this.$t("dashboard.common.other");
        },
        cardSubtypeLabel(type, fallback) {
            const key = `dashboard.dataLabels.cardSubtypes.${type}`;
            return type && this.$te(key) ? this.$t(key) : fallback || type || this.$t("dashboard.common.other");
        },
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
            this.$prompt(this.$t("dashboard.password.enterPassword"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                inputType: "password",
            })
                .then(({ value }) => {
                    activationKeycode(row.id, { password: value }).then((res) => {
                        let { code, key } = res.data.data;
                        row.code = code;
                        row.key = key;
                        this.list[index] = row;
                    });
                })
                .catch(() => {});
        },
        //  获取单个激活码
        getSn(index, row) {
            this.$prompt(this.$t("dashboard.password.enterPassword"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                inputType: "password",
            })
                .then(({ value }) => {
                    activationSn(row.id, { password: value }).then((res) => {
                        row.code = res.data.data.sn;
                        this.list[index] = row;
                    });
                })
                .catch(() => {});
        },
        // 获取虚拟卡密
        getVirtualCode(index, row) {
            this.$prompt(this.$t("dashboard.password.enterPassword"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                inputType: "password",
            })
                .then(({ value }) => {
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
                })
                .catch(() => {});
        },
        // 判断过期时间
        compareTime(date, type) {
            const key = new Date(date).getTime() > Date.now() ? 0 : 1;
            const _tag = {
                0: "green",
                1: "gray",
            };
            const _status = {
                0: this.$t("dashboard.cards.notExpired"),
                1: this.$t("dashboard.cards.expired"),
            };

            return type == "tag" ? _tag[key] : _status[key];
        },

        // 标记使用
        onKeyCodeUsedClick(row) {
            if (row.used_by_self) return;
            this.$confirm(this.$t("dashboard.cards.markUsedConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    markKeycode(row.id, "used").then((res) => {
                        this.$message({
                            type: "success",
                            message: this.$t("dashboard.cards.markSuccess"),
                        });
                        this.loadKeycode();
                    });
                })
                .catch(() => {});
        },
        onSnUsedClick(row) {
            if (row.used_by_self) return;
            this.$confirm(this.$t("dashboard.cards.markUsedConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    markSn(row.id, "used").then((res) => {
                        this.$message({
                            type: "success",
                            message: this.$t("dashboard.cards.markSuccess"),
                        });
                        this.loadSn();
                    });
                })
                .catch(() => {});
        },
        onVirtualUsedClick(row) {
            if (row.owner.used_by_self) return;
            this.$confirm(this.$t("dashboard.cards.markUsedConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    markVirtualCode(row.goods.id, 1).then((res) => {
                        this.$message({
                            type: "success",
                            message: this.$t("dashboard.cards.markSuccess"),
                        });
                        this.loadVirtual();
                    });
                })
                .catch(() => {});
        },

        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(String(text));
                this.$notify({
                    title: this.$t("dashboard.common.copySuccess"),
                    message: this.$t("dashboard.cards.copiedContent", { text }),
                    type: "success",
                });
            } catch (err) {
                this.$notify.error({
                    title: this.$t("dashboard.common.copyFailed"),
                    message: this.$t("dashboard.common.copyManually"),
                });
            }
        },
        currentChange(val) {
            this.page = val;
            this[this.loadName]();
        },
        tabClick(tab) {
            this.page = 1;
            this.tab = tab;
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
