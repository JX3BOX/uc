<template>
    <div class="m-history-content">
        <el-table class="m-table-box" :data="list" align="left" v-loading="loading">
            <el-table-column prop="created_at" width="160px" :label="$t('vip.lottery.drawTime')"></el-table-column>
            <el-table-column
                prop="chance_count"
                width="90px"
                :label="$t('vip.lottery.drawCount')"
            ></el-table-column>
            <el-table-column prop="win_count" width="90px" :label="$t('vip.lottery.winCount')" v-if="status == '2'"></el-table-column>
            <el-table-column width="90px" :label="$t('vip.common.status')" v-if="status !== '2'">
                <template #default="scope">
                    <el-tag :type="scope.row.status == 2 ? 'success' : 'info'">
                        {{ scope.row.status == 2 ? $t("vip.lottery.won") : $t("vip.lottery.notWon") }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="240px" :label="$t('vip.lottery.prize')" v-if="status !== '3'">
                <template #default="scope">
                    <div class="m-history-prizes" v-if="scope.row.prizes?.length">
                        <el-tooltip v-for="prize in scope.row.groupedPrizes" :key="prize.groupKey" :content="prizeTooltip(prize)" placement="top">
                            <span class="u-history-prize" tabindex="0" :aria-label="prizeTooltip(prize)">
                                <img v-if="prizeImage(prize)" :src="prizeImage(prize)" :alt="prizeName(prize)" loading="lazy" />
                                <i v-else class="el-icon-present"><Present /></i>
                                <b v-if="prize.count > 1" class="u-history-prize-count">{{ prize.count }}</b>
                            </span>
                        </el-tooltip>
                        <el-button class="u-history-address" v-if="scope.row.address" @click="editAddress">{{ $t("vip.lottery.fillAddressShort") }}</el-button>
                    </div>
                    <span v-else class="u-history-empty">—</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="m-archive-pages"
            background
            layout="prev, pager, next"
            :hide-on-single-page="true"
            :page-size="pageSize"
            :total="total"
            v-model:current-page="index"
            @current-change="change"
        ></el-pagination>
    </div>
</template>

<script>
import { __Root, __cdn } from "@/utils/config";
import { getMyHistory } from "@/service/vip/lottery";
import { normalizeMallImage } from "@/utils/mallImage";
import { Present } from "@element-plus/icons-vue";
export default {
    name: "History",
    components: { Present },
    props: ["id", "show"],
    data: function () {
        return {
            list: [],
            index: 1,
            pageSize: 7,
            total: 0,
            loading: false,
            status: "0",
        };
    },
    watch: {
        show: {
            immediate: true,
            handler: function (show) {
                if (!show) return;
                this.index = 1;
                if (this.status !== "0") {
                    this.status = "0";
                } else {
                    this.load(this.id);
                }
            },
        },
        status() {
            this.index = 1;
            this.load();
        },
    },
    methods: {
        groupPrizes(prizes = []) {
            const groups = new Map();
            prizes.forEach((prize, index) => {
                const goodsId = prize.mall_good_id || prize.goods?.id;
                const key = prize.prize_type === "vip_asset"
                    ? `asset:${prize.vip_asset_type}:${prize.vip_asset_once_give}`
                    : goodsId
                        ? `goods:${goodsId}`
                        : prize.lucky_draw_prize_id
                            ? `prize:${prize.lucky_draw_prize_id}`
                            : `record:${index}`;
                const existing = groups.get(key);
                if (existing) existing.count++;
                else groups.set(key, { ...prize, groupKey: key, count: 1 });
            });
            return [...groups.values()];
        },
        prizeTooltip(prize) {
            return this.prizeName(prize) + (prize.count > 1 ? ` × ${prize.count}` : "");
        },
        prizeName(prize) {
            if (prize.prize_type === "vip_asset") {
                const labels = {
                    point: "vip.common.points",
                    boxcoin: "vip.lottery.boxcoinRemastered",
                    boxcoin_origin: "vip.lottery.boxcoinOrigin",
                };
                return `${prize.vip_asset_once_give} ${this.$t(labels[prize.vip_asset_type] || "vip.lottery.prize")}`;
            }
            return prize.goods?.title || this.$t("vip.lottery.prize");
        },
        prizeImage(prize) {
            if (prize.prize_type === "vip_asset") {
                return prize.vip_asset_type === "point"
                    ? `${__cdn}design/event/redeem/bell.png`
                    : `${__cdn}design/event/lottery/boxcoin.png`;
            }
            return normalizeMallImage(prize.goods?.goods_images?.[0]);
        },
        load(luckyDrawId = this.id) {
            this.loading = true;
            const params = { luckyDrawId, pageSize: this.pageSize, index: this.index, status: this.status };
            getMyHistory(params)
                .then((res) => {
                    this.list = (res.data.data.list || []).map((item) => ({
                        ...item,
                        groupedPrizes: this.groupPrizes(item.prizes || []),
                        address: (item.prizes || []).some((prize) => prize.goods?.category === "entity"),
                    }));
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        change(i) {
            this.index = i;
            this.load(this.id);
        },
        editAddress() {
            const link = __Root + "dashboard/address";
            window.open(link, "_blank");
        },
    },
};
</script>

<style lang="less">
.m-history-content {
    padding: 0px 40px;
    .m-history-prizes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 100%;
        text-align: center;
    }
    .u-history-prize {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        color: #65527d;
        line-height: 1.5;
        img {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            object-fit: contain;
            border-radius: 6px;
            background: #f5f3f8;
        }
        svg { width: 22px; height: 22px; }
        &:focus-visible { outline: 2px solid #82709e; outline-offset: 2px; border-radius: 6px; }
        .u-history-prize-count {
            position: absolute;
            right: -4px;
            bottom: 0;
            min-width: 14px;
            padding: 0 3px;
            box-sizing: border-box;
            border-radius: 6px;
            background: #82709e;
            color: #fff;
            font-size: 10px;
            line-height: 15px;
            text-align: center;
            box-shadow: 0 0 0 1px #fff;
        }
    }
    .u-history-address { align-self: flex-start; }
    .u-history-empty { color: #aaa4b3; }
    thead {
        th {
            &:last-child {
                .cell {
                    text-align: center;
                }
            }
            .cell {
                text-align: center;
            }
            &:first-child {
                .cell {
                    text-align: left;
                }
            }
        }
    }
    tbody {
        td {
            &:last-child {
                .cell {
                    text-align: right;
                }
            }
            .cell {
                text-align: center;
            }
            &:first-child {
                .cell {
                    text-align: left;
                }
            }
        }
    }
    .cell,
    .m-archive-pages {
        .flex;
        justify-content: center;
        align-items: center;
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev {
        background: url("@{kv_blindbox}arr.png") center center no-repeat;
        background-size: 24px auto;
        .el-icon {
            .none;
        }
    }
    .el-pagination.is-background .btn-next {
        transform: rotate(180deg);
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #000;
    }
    .el-loading-mask {
        .z(2);
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #fff;
    }
    .el-radio-button__inner:hover {
        color: #3d454d;
    }
    .m-archive-pages {
        .mt(20px);
    }
}
</style>
