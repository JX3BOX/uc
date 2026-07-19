<template>
    <div class="m-credit m-tasks">
        <h2 class="u-title"><i class="el-icon-coffee-cup"></i> {{ $t("dashboard.tasks.title") }}</h2>

        <div v-if="loaded && !loadError && taskCount" class="m-tasks-progress">
            <div class="u-progress-label">
                <span>{{ $t("dashboard.tasks.progress", { finished: finishedCount, total: taskCount }) }}</span>
                <b>{{ progressPercentage }}%</b>
            </div>
            <el-progress :percentage="progressPercentage" :stroke-width="8" :show-text="false" />
        </div>

        <div class="m-tasks-list">
            <ContentSkeleton v-if="loading" variant="list" :rows="6" />

            <el-alert
                v-else-if="loadError"
                class="m-tasks-error"
                type="error"
                :closable="false"
                show-icon
                :title="$t('dashboard.tasks.loadFailed')"
                :description="$t('dashboard.tasks.loadFailedDesc')"
            >
                <template #default>
                    <el-button type="danger" plain size="small" icon="Refresh" @click="retryTasks">
                        {{ $t("dashboard.tasks.retry") }}
                    </el-button>
                </template>
            </el-alert>

            <template v-else>
                <taskItem
                    v-for="item in list"
                    :key="item.task.id"
                    :data="item"
                    :claiming="claimingTaskId === item.task.id"
                    :claim-disabled="claimingTaskId !== null"
                    @claim="claimReward"
                />

                <div
                    v-for="groupItem in groupedTasks"
                    :key="groupItem.key"
                    class="u-item u-group"
                    :class="groupItem.info.open ? 'open' : 'close'"
                >
                    <div class="u-parent u-item">
                        <img class="u-img" :src="groupItem.info.img" :alt="groupItem.info.name" @error="useDefaultIcon" />
                        <div class="u-box">
                            <a
                                v-if="groupItem.info.url"
                                class="u-title"
                                :href="groupItem.info.url"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {{ groupItem.info.name }}
                            </a>
                            <span v-else class="u-title">{{ groupItem.info.name }}</span>
                            <el-button :type="groupItem.info.open ? 'primary' : ''" @click="toggleGroup(groupItem.key)">
                                {{ groupItem.info.open ? $t("dashboard.tasks.collapse") : $t("dashboard.tasks.expand") }}
                                <i :class="groupItem.info.open ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i>
                            </el-button>
                        </div>
                    </div>
                    <taskItem
                        v-for="item in groupItem.tasks"
                        :key="item.task.id"
                        :data="item"
                        :claiming="claimingTaskId === item.task.id"
                        :claim-disabled="claimingTaskId !== null"
                        @claim="claimReward"
                    />
                </div>

                <el-empty v-if="!taskCount" :description="$t('dashboard.tasks.empty')" />
            </template>
        </div>
    </div>
</template>

<script>
import { getCheckTasks, getTasks } from "@/service/dashboard/tasks.js";
import { __imgPath } from "@/utils/config";
import taskItem from "@/components/dashboard/task/item.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";

export default {
    name: "tasks",
    components: {
        taskItem,
    },
    data() {
        return {
            loading: true,
            loaded: false,
            loadError: false,
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
            return Object.keys(this.group).map((key) => ({
                key,
                tasks: this.group[key] || [],
                info: this.getGroupInfo(key),
            }));
        },
        allTasks() {
            return [...this.list, ...this.groupedTasks.flatMap((item) => item.tasks)];
        },
        taskCount() {
            return this.allTasks.length;
        },
        finishedCount() {
            return this.allTasks.filter((item) => item.hasFinish).length;
        },
        progressPercentage() {
            return this.taskCount ? Math.round((this.finishedCount / this.taskCount) * 100) : 0;
        },
    },
    methods: {
        loadTasks(showSkeleton = !this.loaded) {
            if (showSkeleton) this.loading = true;
            this.loadError = false;

            return getTasks({ is_limit_everyday: 0, os_visible: 1 })
                .then((res) => {
                    const list = res?.data?.data?.list;
                    if (!Array.isArray(list)) throw new Error("Invalid task list response");

                    const tasks = list.filter((item) => item?.task?.id);
                    this.list = tasks.filter((item) => !item.task.task_group);
                    this.group = tasks
                        .filter((item) => item.task.task_group)
                        .sort((a, b) => this.getTaskOrder(a) - this.getTaskOrder(b))
                        .reduce((result, item) => {
                            const key = item.task.task_group;
                            if (!result[key]) result[key] = [];
                            result[key].push(item);
                            return result;
                        }, {});
                    this.syncGroupInfo();
                })
                .catch(() => {
                    if (!this.loaded || !this.taskCount) {
                        this.list = [];
                        this.group = {};
                        this.loadError = true;
                    } else {
                        this.$notify({
                            title: this.$t("dashboard.common.tip"),
                            message: this.$t("dashboard.tasks.loadFailed"),
                            type: "warning",
                        });
                    }
                })
                .finally(() => {
                    this.loaded = true;
                    this.loading = false;
                });
        },
        retryTasks() {
            this.loadTasks(true);
        },
        loadGroupInfo() {
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
                const parsed = typeof data === "string" ? JSON.parse(data) : data;
                return Object.keys(parsed || {}).reduce((result, key) => {
                    result[key] = {
                        name: parsed[key]?.name || key,
                        img: parsed[key]?.img || this.defaultGroupIcon,
                        url: parsed[key]?.url || "",
                        open: !!parsed[key]?.open,
                    };
                    return result;
                }, {});
            } catch (error) {
                return {};
            }
        },
        getTaskOrder(item) {
            const order = Number.parseInt(item?.task?.action_type?.split("_").pop(), 10);
            return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
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
                if (!next[key]) next[key] = this.getGroupInfo(key);
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
        useDefaultIcon(event) {
            if (event.target.src === this.defaultGroupIcon) return;
            event.target.src = this.defaultGroupIcon;
        },
        claimReward(id) {
            if (!id || this.claimingTaskId !== null) return;
            this.claimingTaskId = id;
            getCheckTasks(id)
                .then((res) => {
                    if (res?.data?.data?.hasFinish) {
                        this.$notify({
                            title: this.$t("dashboard.common.success"),
                            message: this.$t("dashboard.tasks.completedReward"),
                            type: "success",
                        });
                    } else {
                        this.$notify({
                            title: this.$t("dashboard.common.tip"),
                            message: this.$t("dashboard.tasks.notCompleted"),
                            type: "warning",
                        });
                    }
                    this.loadTasks(false);
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
    mounted() {
        this.loadTasks(true);
        this.loadGroupInfo();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/tasks.less";
</style>
