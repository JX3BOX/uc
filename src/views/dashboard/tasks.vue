<template>
    <div class="m-credit m-tasks">
        <h2 class="u-title"><i class="el-icon-coffee-cup"></i> 任务中心</h2>
        <div class="m-tasks-list" v-loading="loading">
            <taskItem v-for="(item, index) in list" :key="index" :data="item" @update="checkFinish" />
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
                                >{{ groupItem.info.open ? "折叠" : "展开"
                                }}<i :class="groupItem.info.open ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i
                            ></el-button>
                        </div>
                    </div>
                    <taskItem
                        v-for="item in groupItem.tasks"
                        :key="item?.task?.id || item?.id"
                        :data="item"
                        @update="checkFinish"
                    />
                </div>
            </template>
            <el-empty v-if="!loading && !list.length && !groupedTasks.length" description="暂无任务"></el-empty>
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
            loading: false,
            list: [],
            group: {},
            groupInfo: {},
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
        // 点击完成
        checkFinish(id) {
            getCheckTasks(id)
                .then((res) => {
                    if (res?.data?.data?.hasFinish) {
                        this.$notify({
                            title: "成功",
                            message: "完成任务，获得奖励",
                            type: "success",
                        });
                        location.reload();
                    } else {
                        this.$notify({
                            title: "提示",
                            message: "您没有完成任务",
                            type: "warning",
                        });
                    }
                })
                .catch(() => {
                    this.$notify({
                        title: "提示",
                        message: "任务状态检查失败，请稍后再试",
                        type: "warning",
                    });
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
