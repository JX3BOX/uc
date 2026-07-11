<template>
    <div class="p-feedback">
        <!-- tool -->
        <div class="m-feedback-tool">
            <div class="m-feedback-tool__item">
                <el-select
                    v-model="select"
                    class="u-select"
                    :placeholder="$t('dashboard.feedback.handlerPlaceholder')"
                    filterable
                    style="width: 200px"
                    clearable
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
                <el-date-picker
                    v-model="time"
                    type="month"
                    :placeholder="$t('dashboard.feedback.selectMonth')"
                    format="YYYY-MM"
                >
                </el-date-picker>
            </div>
            <el-checkbox v-if="showUserFilters" class="u-only-check" v-model="onlyMe">
                {{ $t("dashboard.feedback.assignedToMe") }}
            </el-checkbox>
            <el-checkbox v-if="showUserFilters" class="u-only-check" v-model="isSupport">
                {{ $t("dashboard.feedback.coordinatedByMe") }}
            </el-checkbox>
        </div>
        <!-- list -->
        <div class="m-feedback-list" v-loading="loading">
            <el-table
                :data="data"
                highlight-current-row
                @row-click="viewFeedback"
                row-class-name="u-row"
                @filter-change="filterChange"
                stripe
                size="large"
            >
                <el-table-column
                    :label="$t('dashboard.common.status')"
                    prop="status"
                    column-key="status"
                    :filters="filterOptions.status"
                    :filter-multiple="false"
                >
                    <template #default="{ row }">
                        <el-tag :type="statusTypes[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
                        <!-- <span class="u-status" :style="{ backgroundColor: statusColors[row.status] }">{{
                            statusMap[row.status]
                        }}</span> -->
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('dashboard.common.client')"
                    prop="client"
                    column-key="client"
                    :filters="filterOptions.client"
                    :filter-multiple="false"
                >
                    <template #default="{ row }">
                        <span class="u-client" :class="'i-client-' + row.client">{{ formatClient(row.client) }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="!isEditor" :label="$t('dashboard.feedback.source')" prop="type">
                    <template #default="{ row }">
                        {{ types[row.type] }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('dashboard.common.type')" prop="subtype">
                    <template #default="{ row }">
                        {{ subtypes[row.subtype] }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('dashboard.common.remark')" prop="remark"></el-table-column>
                <el-table-column v-if="isEditor" :label="$t('dashboard.common.submitter')" prop="user">
                    <template #default="{ row }">
                        <div class="m-assign">
                            <a class="u-assign" :href="authorLink(row.user.id)" target="_blank">
                                <img class="u-assign-avatar" :src="showAvatar(row.user.avatar)" />
                                <span class="u-assign-name">{{ row.user.display_name }}</span>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('dashboard.feedback.assignedTo')">
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
                <el-table-column :label="$t('dashboard.feedback.coordinate')">
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
                <el-table-column :label="$t('dashboard.common.submittedAt')" prop="created_at">
                    <template #default="{ row }">
                        {{ formatTime(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('dashboard.common.actions')" width="120">
                    <template #default="{ row }">
                        <el-tooltip :content="row.content" placement="top" popper-class="m-content-popover">
                            <el-button type="primary" link size="small">{{ $t("dashboard.common.view") }}</el-button>
                        </el-tooltip>
                        <el-button link type="primary" @click.stop="onRemarkClick(row)" size="small">{{
                            $t("dashboard.common.remark")
                        }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="m-credit-pages m-packet-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                v-model:current-page="page"
                @current-change="currentChange"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMiscfeedback, getTeammates, updateFeedback } from "@/service/dashboard/feedback";
import feedbackData from "@/assets/data/dashboard/feedback.json";
const { statusColors, statusTypes } = feedbackData;
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
        showUserFilters: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            data: [],
            loading: false,
            page: 1,
            per: 10,
            total: 0,
            filters: {
                status: this.status,
                client: "",
            },

            statusColors,
            statusTypes,

            isEditor: false,
            onlyMe: this.showUserFilters,
            isSupport: this.showUserFilters,

            time: "",
            select: "",
            assigns: [],
        };
    },

    computed: {
        types() {
            return this.localizeMap(feedbackData.types, "feedbackTypes");
        },
        subtypes() {
            return this.localizeMap(feedbackData.subtypes, "feedbackSubtypes");
        },
        statusMap() {
            return this.localizeMap(feedbackData.statusMap, "feedbackStatuses");
        },
        filterOptions() {
            return {
                status: feedbackData.filterOptions.status.map((item) => ({
                    ...item,
                    text: this.statusMap[item.value],
                })),
                client: feedbackData.filterOptions.client.map((item) => ({
                    ...item,
                    text: this.formatClient(item.value),
                })),
            };
        },
        user() {
            return User.getInfo();
        },
        params() {
            const _params = {
                ...this.filters,
            };
            if (this.showUserFilters) {
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
                assign: this.params.assign || "",
                coordination: this.params.coordination || "",
                time: this.time,
                onlyMe: this.onlyMe,
                isSupport: this.isSupport,
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
        localizeMap(source, name) {
            return Object.keys(source).reduce((result, key) => {
                const path = `dashboard.dataLabels.${name}.${key}`;
                result[key] = this.$te(path) ? this.$t(path) : source[key];
                return result;
            }, {});
        },
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
            const path = `dashboard.dataLabels.clients.${client}`;
            return this.$te(path) ? this.$t(path) : __clients[client] || client;
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
                // { user_id: 0, teammate_info: { display_name: "全部" } },
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
            this.$prompt(this.$t("dashboard.common.remarkPlaceholder"), this.$t("dashboard.common.remark"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                inputValue: row.remark,
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        if (!instance.inputValue) {
                            this.$message.error(this.$t("dashboard.common.remarkPlaceholder"));
                            done();
                        } else {
                            updateFeedback(row.id, {
                                client: row.client || "",
                                type: row.type || "",
                                subtype: row.subtype || "",
                                repository: row.repository || "",
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
            }).catch(() => {});
        },
    },
    mounted() {
        this.loadTeam();
        this.isEditor = User.isEditor();
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
    .el-table {
        font-size: 12px;
    }

    .u-row * {
        .pointer !important;
    }

    .u-status {
        color: #fff;
        padding: 2px 5px;
        .r(2px);
    }
    // .u-client {
    //     padding: 2px 5px;
    //     .r(2px);
    // }

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
