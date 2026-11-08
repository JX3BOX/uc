<template>
    <div class="m-credit m-tasks">
        <h2 class="u-title"><i class="el-icon-coffee-cup"></i> {{ $t("dashboard.tasks.title") }}</h2>

        <div v-if="loaded && activityLoaded && !loadError && !activityLoadError && taskCount" class="m-tasks-progress">
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

            <div
                v-for="groupItem in groupedTasks"
                :key="groupItem.key"
                class="u-item u-group"
                :class="groupItem.info.open ? 'open' : 'close'"
            >
                <div class="u-parent u-item">
                    <img class="u-img" :src="groupItem.info.img" :alt="groupItem.info.name" @error="useDefaultIcon" />
                    <div class="u-box">
                        <div class="u-group-label">
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
                            <span class="u-group-progress">
                                {{
                                    $t("dashboard.tasks.groupProgress", {
                                        finished: groupItem.tasks.filter((item) => item.hasFinish).length,
                                        total: groupItem.tasks.length,
                                    })
                                }}
                            </span>
                        </div>
                        <el-button
                            :type="groupItem.info.open ? 'primary' : ''"
                            :aria-expanded="groupItem.info.open"
                            @click="toggleGroup(groupItem.key)"
                        >
                            {{ groupItem.info.open ? $t("dashboard.tasks.collapse") : $t("dashboard.tasks.expand") }}
                            <i :class="groupItem.info.open ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i>
                        </el-button>
                    </div>
                </div>
                <template v-if="groupItem.info.open">
                    <el-alert
                        v-if="groupItem.key === activityGroupKey && activityLoadError"
                        class="m-tasks-error"
                        type="error"
                        :closable="false"
                        show-icon
                        :title="$t('dashboard.tasks.activity.loadFailed')"
                    >
                        <el-button size="small" :loading="activityLoading" @click="loadActivityTasks">
                            {{ $t("dashboard.tasks.retry") }}
                        </el-button>
                    </el-alert>
                    <taskItem
                        v-for="item in groupItem.tasks"
                        :key="item.task.id"
                        :data="item"
                        :claiming="isClaiming(groupItem.key, item)"
                        :claim-disabled="isClaimDisabled(groupItem.key, item)"
                        :claim-label="
                            groupItem.key === activityGroupKey && item.hasFinish
                                ? $t('dashboard.tasks.activity.claimed')
                                : ''
                        "
                        @claim="groupItem.key === activityGroupKey ? claimActivityReward($event) : claimReward($event)"
                    />
                </template>
            </div>

            <el-empty
                v-if="loaded && !loading && !loadError && !taskCount && !activityLoading && !activityLoadError"
                :description="$t('dashboard.tasks.empty')"
            />
        </div>
    </div>
</template>

<script>
import { claimActivityTask, getActivityTasks, getCheckTasks, getTasks } from "@/service/dashboard/tasks.js";
import { __cdn, __imgPath, __Root } from "@/utils/config";
import taskItem from "@/components/dashboard/task/item.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";

const DAILY_GROUP = "jx3box_daily_task";
const SPECIAL_GROUP = "jx3box_special_task";
const INVITATION_GROUP = "task_invitation_user_register";
const BASIC_GROUP = Symbol("basic tasks");
const ACTIVITY_GROUP = Symbol("activity tasks");

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
            activityTasks: [],
            activityGroupKey: ACTIVITY_GROUP,
            activityLoading: false,
            activityLoaded: false,
            activityLoadError: false,
            claimingActivityKey: null,
        };
    },
    computed: {
        defaultGroupIcon() {
            return __imgPath + "image/common/jx3box_black.svg";
        },
        dailyGroupIcon() {
            return __cdn + "design/task/quest.svg";
        },
        specialGroupIcon() {
            return __cdn + "design/task/quest-pro.svg";
        },
        groupedTasks() {
            const order = [DAILY_GROUP, BASIC_GROUP, SPECIAL_GROUP, ACTIVITY_GROUP, INVITATION_GROUP];
            const tasksByGroup = new Map(Object.entries(this.group));
            tasksByGroup.set(BASIC_GROUP, this.list);
            tasksByGroup.set(ACTIVITY_GROUP, this.activityItems);
            return [...order, ...Object.keys(this.group).filter((key) => !order.includes(key))]
                .filter((key) => tasksByGroup.get(key)?.length || (key === ACTIVITY_GROUP && this.activityLoadError))
                .map((key) => ({
                    key,
                    tasks: tasksByGroup.get(key),
                    info: this.getGroupInfo(key),
                }));
        },
        activityItems() {
            return this.activityTasks.map((item) => {
                const progress = this.$t("dashboard.tasks.activity.progress", {
                    current: Math.min(item.progress, item.target),
                    target: item.target,
                });
                return {
                    task: {
                        id: item.key,
                        action_type_desc: item.name,
                        task_detail: [item.desc, progress].filter(Boolean).join(" · "),
                        task_icon: item.icon?.trim(),
                        task_url: `${__Root}knowledge`,
                    },
                    rewardTags: item.awards.map((award) => {
                        const type = this.$t(`dashboard.tasks.activity.awards.${award.type}`);
                        return `${type} ${award.name || (award.key ?? award.amount)}`;
                    }),
                    hasFinish: item.status === "claimed",
                    claimable: item.status === "claimable",
                };
            });
        },
        personalTasks() {
            return this.list.concat(Object.values(this.group).flat());
        },
        taskCount() {
            return this.personalTasks.length + this.activityTasks.length;
        },
        finishedCount() {
            const personalFinished = this.personalTasks.filter((item) => item.hasFinish).length;
            const activityClaimed = this.activityTasks.filter((item) => item.status === "claimed").length;
            return personalFinished + activityClaimed;
        },
        progressPercentage() {
            return this.taskCount ? Math.round((this.finishedCount / this.taskCount) * 100) : 0;
        },
    },
    methods: {
        isClaiming(key, item) {
            return (key === ACTIVITY_GROUP ? this.claimingActivityKey : this.claimingTaskId) === item.task.id;
        },
        isClaimDisabled(key, item) {
            return key === ACTIVITY_GROUP
                ? !item.claimable || this.claimingActivityKey !== null || this.activityLoading
                : this.claimingTaskId !== null;
        },
        async loadActivityTasks() {
            if (this.activityLoading) return;
            this.activityLoading = true;
            this.activityLoadError = false;
            try {
                this.activityTasks = await getActivityTasks();
                this.activityLoaded = true;
            } catch {
                this.activityLoadError = true;
            } finally {
                this.activityLoading = false;
            }
        },
        refreshActivityOnFocus() {
            if (this.claimingActivityKey === null) this.loadActivityTasks();
        },
        async claimActivityReward(key) {
            if (this.claimingActivityKey !== null || this.activityLoading) return;
            if (!this.activityTasks.some((task) => task.key === key && task.status === "claimable")) return;

            this.claimingActivityKey = key;
            try {
                await claimActivityTask(key);
                this.activityTasks = this.activityTasks.map((task) =>
                    task.key === key ? { ...task, status: "claimed" } : task
                );
                this.$notify({
                    title: this.$t("dashboard.common.success"),
                    message: this.$t("dashboard.tasks.completedReward"),
                    type: "success",
                });
                await this.loadActivityTasks();
            } catch (error) {
                const message = error?.response?.data?.msg || this.$t("dashboard.tasks.activity.claimFailed");
                this.$notify({
                    title: this.$t("dashboard.common.tip"),
                    message,
                    type: "warning",
                });
                await this.loadActivityTasks();
            } finally {
                this.claimingActivityKey = null;
            }
        },
        loadTasks(showSkeleton = !this.loaded) {
            if (showSkeleton) this.loading = true;
            this.loadError = false;

            return getTasks({ os_visible: 1 })
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
                    if (!this.loaded || !this.personalTasks.length) {
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
            const info = this.groupInfo[key] || {
                name: String(key),
                img: this.defaultGroupIcon,
                url: "",
                open: false,
            };
            if (key === BASIC_GROUP) {
                return { ...info, name: this.$t("dashboard.tasks.basicTasks"), img: this.specialGroupIcon };
            }
            if (key === ACTIVITY_GROUP) {
                return {
                    ...info,
                    name: this.$t("dashboard.tasks.activity.title"),
                    img: this.groupInfo[INVITATION_GROUP]?.img || this.specialGroupIcon,
                };
            }
            if (key === DAILY_GROUP) {
                return {
                    ...info,
                    name: this.$t("dashboard.tasks.groups.daily"),
                    img: this.dailyGroupIcon,
                };
            }
            if (key === SPECIAL_GROUP) {
                return {
                    ...info,
                    name: this.$t("dashboard.tasks.groups.special"),
                    img: this.specialGroupIcon,
                };
            }
            return info;
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
        this.loadActivityTasks();
        window.addEventListener("focus", this.refreshActivityOnFocus);
    },
    beforeUnmount() {
        window.removeEventListener("focus", this.refreshActivityOnFocus);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/tasks.less";
</style>
