<template>
    <div class="m-credit m-tasks">
        <h2 class="u-title"><i class="el-icon-coffee-cup"></i> {{ $t("dashboard.tasks.title") }}</h2>
        <div class="m-tasks-list">
            <ContentSkeleton v-if="loading" variant="list" :rows="6" />
            <template v-else>
                <taskItem
                    v-for="(item, index) in list"
                    :key="index"
                    :data="item"
                    :claiming="claimingTaskId === item.task.id"
                    :claim-disabled="claimingTaskId !== null"
                    @claim="claimReward"
                />
                <!-- 任务组 -->
                <template v-if="groupedTasks.length">
                    <div
                        class="u-item u-group"
                        v-for="groupItem in groupedTasks"
                        :key="groupItem.key"
                        :class="groupItem.info.open ? 'open' : 'close'"
                    >
                        <div class="u-parent u-item">
                            <img class="u-img" :src="groupItem.info.img" :alt="groupItem.info.name" />
                            <div class="u-box">
                                <a
                                    v-if="groupItem.info.url"
                                    class="u-title"
                                    :href="groupItem.info.url"
                                    target="_blank"
                                    >{{ groupItem.info.name }}</a
                                >
                                <span v-else class="u-title">{{ groupItem.info.name }}</span>
                                <el-button
                                    :type="groupItem.info.open ? 'primary' : ''"
                                    @click="toggleGroup(groupItem.key)"
                                    >{{ groupItem.info.open ? $t("dashboard.tasks.collapse") : $t("dashboard.tasks.expand")
                                    }}<i :class="groupItem.info.open ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i
                                ></el-button>
                            </div>
                        </div>
                        <taskItem
                            v-for="item in groupItem.tasks"
                            :key="item?.task?.id || item?.id"
                            :data="item"
                            :claiming="claimingTaskId === item.task.id"
                            :claim-disabled="claimingTaskId !== null"
                            @claim="claimReward"
                        />
                    </div>
                </template>
                <el-empty v-if="!list.length && !groupedTasks.length" :description="$t('dashboard.tasks.empty')"></el-empty>
            </template>
        </div>
    </div>
</template>
<script>
import { getTasks, getCheckTasks } from "@/service/dashboard/tasks.js";
import { __imgPath } from "@/utils/config";
import taskItem from "@/components/dashboard/task/item.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
export default {
    name: "tasks",
    components: {
        taskItem,
    },
    data: function () {
        return {
            loading: true,
            list: [],
            group: {},
            groupInfo: {},
            claimingTaskId: null,
        };
    },
    computed: {
        defaultGroupIcon() {
            return __imgPath + "image/common/jx3box_black.svg";
        },
        groupedTasks() {
            return Object.keys(this.group).map((key) => {
                return {
                    key,
                    tasks: this.group[key] || [],
                    info: this.getGroupInfo(key),
                };
            });
        },
    },
    methods: {
        // 加载任务列表
        loadTasks() {
            this.loading = true;
            getTasks({ is_limit_everyday: 0, os_visible: 1 })
                .then((res) => {
                    const list = res?.data?.data?.list || [];
                    const tasks = Array.isArray(list) ? list.filter((item) => item?.task) : [];

                    this.list = tasks.filter((item) => {
                        return !item.task.task_group && item.task.action_type != "task_account_bind_github";
                    });

                    this.group = tasks
                        .filter((item) => item.task.task_group)
                        .sort((a, b) => {
                            return this.getTaskOrder(a) - this.getTaskOrder(b);
                        })
                        .reduce((acc, cur) => {
                            if (cur.task.task_group) {
                                if (!acc[cur.task.task_group]) {
                                    acc[cur.task.task_group] = [];
                                }
                                acc[cur.task.task_group].push(cur);
                            }
                            return acc;
                        }, {});
                    this.syncGroupInfo();
                })
                .catch(() => {
                    this.list = [];
                    this.group = {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadAc() {
            getBreadcrumb("task_group_info")
                .then((data) => {
                    this.groupInfo = this.normalizeGroupInfo(data);
                    this.syncGroupInfo();
                })
                .catch(() => {
                    this.groupInfo = {};
                    this.syncGroupInfo();
                });
        },
        normalizeGroupInfo(data) {
            if (!data) return {};

            try {
                const parsed = typeof data === "string" ? JSON.parse(data.replace(/ /g, "")) : data;
                return Object.keys(parsed || {}).reduce((acc, key) => {
                    acc[key] = {
                        name: parsed[key]?.name || key,
                        img: parsed[key]?.img || this.defaultGroupIcon,
                        url: parsed[key]?.url || "",
                        open: !!parsed[key]?.open,
                    };
                    return acc;
                }, {});
            } catch (e) {
                return {};
            }
        },
        getTaskOrder(item) {
            const order = parseInt(item?.task?.action_type?.split("_").pop(), 10);
            return Number.isFinite(order) ? order : 0;
        },
        getGroupInfo(key) {
            return (
                this.groupInfo[key] || {
                    name: key,
                    img: this.defaultGroupIcon,
                    url: "",
                    open: false,
                }
            );
        },
        syncGroupInfo() {
            const next = { ...this.groupInfo };
            Object.keys(this.group).forEach((key) => {
                if (!next[key]) {
                    next[key] = this.getGroupInfo(key);
                }
            });
            this.groupInfo = next;
        },
        toggleGroup(key) {
            const info = this.getGroupInfo(key);
            this.groupInfo = {
                ...this.groupInfo,
                [key]: {
                    ...info,
                    open: !info.open,
                },
            };
        },
        // 检查任务条件并领取奖励
        claimReward(id) {
            if (this.claimingTaskId !== null) return;
            this.claimingTaskId = id;
            getCheckTasks(id)
                .then((res) => {
                    if (res?.data?.data?.hasFinish) {
                        this.$notify({
                            title: this.$t("dashboard.common.success"),
                            message: this.$t("dashboard.tasks.completedReward"),
                            type: "success",
                        });
                        this.loadTasks();
                    } else {
                        this.$notify({
                            title: this.$t("dashboard.common.tip"),
                            message: this.$t("dashboard.tasks.notCompleted"),
                            type: "warning",
                        });
                    }
                })
                .catch(() => {
                    this.$notify({
                        title: this.$t("dashboard.common.tip"),
                        message: this.$t("dashboard.tasks.checkFailed"),
                        type: "warning",
                    });
                })
                .finally(() => {
                    this.claimingTaskId = null;
                });
        },
    },
    mounted: function () {
        this.loadTasks();
        this.loadAc();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/tasks.less";
</style>
