<template>
    <div class="m-history-content">
        <div class="m-toolbar">
            <el-radio-group v-model="status" size="mini" fill="#000">
                <el-radio-button label="0">全部记录</el-radio-button>
                <el-radio-button label="2">中奖</el-radio-button>
                <el-radio-button label="3">未中奖</el-radio-button>
            </el-radio-group>
        </div>
        <el-table class="m-table-box" :data="list" align="left" v-loading="loading">
            <el-table-column prop="created_at" width="160px" label="抽奖时间"></el-table-column>
            <el-table-column
                prop="chance_count"
                :width="status == '2' ? '90px' : ''"
                label="抽奖次数"
            ></el-table-column>
            <el-table-column prop="win_count" width="90px" label="中奖数量" v-if="status == '2'"></el-table-column>
            <el-table-column label="状态" v-if="status !== '2'">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 2 ? 'success' : 'info'" size="small">
                        {{ scope.row.status == 2 ? "中奖" : "未中奖" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="status !== '3'">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.status == 2" @click="look(scope.row.id)">
                        查看详情
                    </el-button>
                    <el-button size="mini" v-if="scope.row.address" @click="editAddress"> 填写地址 </el-button>
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
            :current-page.sync="index"
            @current-change="change"
        ></el-pagination>
    </div>
</template>

<script>
import { __Root } from "@/utils/config";
import { getMyHistory } from "@/service/vip/lottery";
import { some } from "lodash";
export default {
    name: "History",
    props: ["id", "show"],
    data: function () {
        return {
            list: [],
            index: 0,
            pageSize: 7,
            total: 0,
            loading: false,
            status: "2",
        };
    },
    watch: {
        show: {
            immediate: true,
            handler: function (_id) {
                _id && this.load(this.id);
            },
        },
        status() {
            this.index = 1;
            this.load();
        },
    },
    methods: {
        load(luckyDrawId) {
            this.loading = true;
            const params = { luckyDrawId, pageSize: this.pageSize, index: this.index, status: this.status };
            getMyHistory(params)
                .then((res) => {
                    let list = res.data.data.list || [];
                    if (this.status == "2") {
                        list = list.map((item) => {
                            item.address = some(item.prizes, (e) => e.goods.category == "entity");
                            return item;
                        });
                    }
                    this.list = list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        look(id) {
            this.$emit("update", id);
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
