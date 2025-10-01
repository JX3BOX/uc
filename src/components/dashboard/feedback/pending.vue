<template>
    <div class="p-feedback">
        <!-- tool -->
        <div class="m-feedback-tool">
            <div class="m-feedback-tool__item">
                <el-select
                    v-model="select"
                    class="u-select"
                    slot="prepend"
                    size="small"
                    placeholder="请选择处理人"
                    filterable
                >
                    <el-option
                        :label="item.teammate_info.display_name"
                        v-for="(item, i) in assigns"
                        :key="i"
                        :value="item.user_id"
                    >
                        <div class="m-teammate">
                            <div class="m-user">
                                <img class="u-avatar" :src="showAvatar(item.teammate_info.user_avatar)" />
                                <span class="u-name">{{ item.teammate_info.display_name }}</span>
                                <span class="u-user-id">(ID: {{ item.user_id }})</span>
                            </div>
                            <div class="m-duty">
                                <span class="u-duty" v-if="item.duty">{{ formateDuty(item.duty) }} | </span>
                                <span class="u-remark">{{ item.remark }}</span>
                            </div>
                        </div>
                    </el-option>
                </el-select>
            </div>
            <div class="m-feedback-tool__item">
                <el-date-picker v-model="time" type="month" placeholder="选择月份" size="small" format="yyyy年MM月">
                </el-date-picker>
            </div>
            <el-checkbox class="u-only-check" v-model="onlyMe"> 指派给我的 </el-checkbox>
            <el-checkbox class="u-only-check" v-model="isSupport"> 我参与协同的 </el-checkbox>
        </div>
        <!-- list -->
        <div class="m-feedback-list" v-loading="loading">
            <el-table
                :data="data"
                highlight-current-row
                size="small"
                @row-click="viewFeedback"
                row-class-name="u-row"
                @filter-change="filterChange"
                stripe
            >
                <el-table-column
                    label="状态"
                    prop="status"
                    column-key="status"
                    :filters="filterOptions.status"
                    :filter-multiple="false"
                >
                    <template #default="{ row }">
                        <span class="u-status" :style="{ backgroundColor: statusColors[row.status] }">{{
                            statusMap[row.status]
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="客户端"
                    prop="client"
                    column-key="client"
                    :filters="filterOptions.client"
                    :filter-multiple="false"
                >
                    <template #default="{ row }">
                        <span class="u-client" :class="'i-client-' + row.client">{{ formatClient(row.client) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="来源" prop="type" v-show="!isEditor">
                    <template #default="{ row }">
                        {{ types[row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="subtype">
                    <template #default="{ row }">
                        {{ subtypes[row.subtype] }}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column label="提交人" prop="user" v-show="isEditor">
                    <template #default="{ row }">
                        <div class="m-assign">
                            <a class="u-assign" :href="authorLink(row.user.id)" target="_blank">
                                <img class="u-assign-avatar" :src="showAvatar(row.user.avatar)" />
                                <span class="u-assign-name">{{ row.user.display_name }}</span>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="指派给">
                    <template #default="{ row }">
                        <div class="m-assign" v-if="row.assign_user && row.assign_user.length">
                            <a
                                class="u-assign"
                                :href="authorLink(assign.id)"
                                target="_blank"
                                v-for="assign in row.assign_user"
                                :key="assign.id"
                            >
                                <img class="u-assign-avatar" :src="showAvatar(assign.avatar)" />
                                <span class="u-assign-name">{{ assign.display_name }}</span>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="协同">
                    <template #default="{ row }">
                        <div class="m-assign" v-if="row.coordination_user && row.coordination_user.length">
                            <a
                                class="u-assign"
                                :href="authorLink(coordination.id)"
                                target="_blank"
                                v-for="coordination in row.coordination_user"
                                :key="coordination.id"
                            >
                                <img class="u-assign-avatar" :src="showAvatar(coordination.avatar)" />
                                <span class="u-assign-name">{{ coordination.display_name }}</span>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" prop="created_at">
                    <template #default="{ row }">
                        {{ formatTime(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="{ row }">
                        <el-tooltip :content="row.content" placement="top" popper-class="m-content-popover">
                            <el-button type="text" size="small">查看</el-button>
                        </el-tooltip>
                        <el-button type="text" size="small" @click.stop="onRemarkClick(row)">备注</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="m-credit-pages m-packet-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                @current-change="currentChange"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMiscfeedback, getTeammates, updateFeedback } from "@/service/dashboard/feedback";
import { types, subtypes, statusMap, statusColors, filterOptions } from "@/assets/data/dashboard/feedback.json";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import moment from "moment";
import { concat, isEqual } from "lodash";
import { __clients } from "@/utils/config";
export default {
    name: "pendingList",
    props: {
        status: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            data: [],
            loading: false,
            page: 1,
            per: 10,
            total: 0,
            filterOptions,
            filters: {
                status: this.status,
                client: "",
            },

            types,
            subtypes,
            statusMap,
            statusColors,

            isEditor: false,
            onlyMe: true,
            isSupport: true,

            time: "",
            select: "",
            assigns: [],
        };
    },
    mounted() {
        this.loadTeam();
        this.isEditor = User.isEditor();
    },
    computed: {
        user() {
            return User.getInfo();
        },
        params() {
            const _params = {
                ...this.filters,
            };
            if (this.onlyMe) {
                _params.assign = this.user.uid;
            } else {
                _params.assign = this.select;
            }
            if (this.isSupport) {
                _params.coordination = this.user.uid;
            } else {
                _params.coordination = "";
            }
            if (this.time) {
                // time 是月份
                _params.start = moment(this.time).startOf("month").format("YYYYMMDDHHmmss");
                _params.end = moment(this.time).endOf("month").format("YYYYMMDDHHmmss");
            }
            return _params;
        },
        // 重置参数
        reset_params() {
            return {
                ...this.filters,
                assign: this.params.assign,
                time: this.time,
                onlyMe: this.onlyMe,
            };
        },
        page_params() {
            return {
                pageIndex: this.page,
                pageSize: this.per,
            };
        },
    },
    watch: {
        select(val) {
            if (val) this.onlyMe = false;
        },
        onlyMe(val) {
            if (val) this.select = "";
        },
        reset_params: {
            deep: true,
            handler: function (val, oldVal) {
                if (!isEqual(val, oldVal)) {
                    this.page = 1;
                    console.log("reset", this.page_params);
                }
            },
        },
        params: {
            deep: true,
            handler: function () {
                this.getData();
            },
        },
    },
    methods: {
        showAvatar,
        authorLink,
        initQuery() {
            const query = this.$route.query;
            this.page = Number(query.page) || 1;
        },
        async getData() {
            try {
                this.loading = true;
                const params = {
                    ...this.page_params,
                    ...this.params,
                };
                let res = await getMiscfeedback(params);
                this.data = res.data.data.list || [];
                this.total = res.data.data.page.total;
            } catch (e) {
                console.log(e);
            } finally {
                this.loading = false;
            }
        },
        formatTime(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        formatClient(client = "std") {
            return __clients[client] || client;
        },
        handleView(row) {
            window.open(`/dashboard/feedback/${row.id}`, "_blank");
        },
        currentChange(val) {
            const query = {
                ...this.$route.query,
                page: val,
            };
            this.$router.replace({
                query,
            });
            this.getData();
        },
        viewFeedback: function (row) {
            const path = this.$router.resolve({
                name: "feedback_single",
                params: { id: row.id },
            });

            window.open(path.href, "_blank");
        },
        filterChange(filters) {
            Object.entries(filters).forEach(([key, value]) => {
                this.filters[key] = value.length ? value[0] : "";
            });
        },
        async loadTeam() {
            const list = await getTeammates().then((res) => {
                return res.filter((item) => item.status);
            });
            this.assigns = concat(
                { user_id: 0, teammate_info: { display_name: "全部" } },
                list.filter((item) => item.group && ["mp", "developer", "designer"].includes(item.group))
            );
        },
        formateDuty(val) {
            return (
                (val &&
                    val.reduce((prev, curr) => {
                        return prev + " | " + curr;
                    })) ||
                ""
            );
        },
        onRemarkClick(row) {
            this.$prompt("请输入备注", "备注", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: row.remark,
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        if (!instance.inputValue) {
                            this.$message.error("请输入备注");
                            done();
                        } else {
                            updateFeedback(row.id, {
                                remark: instance.inputValue,
                            }).then(() => {
                                done();
                                this.getData();
                            });
                        }
                    } else {
                        done();
                    }
                },
            });
        },
    },
    mounted() {
        this.initQuery();
        this.getData();
    },
};
</script>

<style lang="less">
.m-feedback-list {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .u-row * {
        .pointer !important;
    }

    .u-status {
        color: #fff;
        padding: 2px 5px;
        .r(2px);
    }
    .u-client {
        padding: 2px 5px;
        .r(2px);
    }

    .m-assign {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .u-assign {
            display: flex;
            align-items: center;
            .u-assign-avatar {
                .size(24px);
                .r(100%);
                .mr(5px);
            }
        }
    }
}
.m-content-popover {
    max-width: 300px !important;
    line-height: 1.8;
}
.m-feedback-tool {
    .flex;
    .fz(14px);
    .pb(10px);
    align-items: center;
    gap: 20px;
    label {
        flex-shrink: 0;
    }
    .u-select {
        min-width: 100px;
    }
    .u-date {
        min-width: 240px;
    }
}
.m-teammate {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .m-user {
        display: flex;
        align-items: center;
        .u-avatar {
            .size(24px);
            .r(100%);
            .mr(5px);
        }

        .u-user-id {
            margin-left: 5px;
            color: #999;
        }
    }
}
@media screen and (max-width: @phone) {
    .m-feedback-tool {
        overflow: auto;
    }
}
</style>
<style lang="less">
@media screen and (max-width: @phone) {
    .el-date-range-picker.m-feedback-date {
        left: 0;
        overflow: auto;
        width: 100%;
    }
}
</style>
