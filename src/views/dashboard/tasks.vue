<template>
    <div class="m-credit m-tasks">
        <h2 class="u-title"><i class="el-icon-coffee-cup"></i> 任务中心</h2>
        <div class="m-tasks-list" v-loading="loading">
            <taskItem v-for="(item, index) in list" :key="index" :data="item" @update="checkFinish" />
            <!-- 任务组 -->
            <template v-if="Object.keys(group).length">
                <div
                    class="u-item u-group"
                    v-for="(task, key) in group"
                    :key="key"
                    :class="groupInfo[key].open ? 'open' : 'close'"
                >
                    <div class="u-parent u-item">
                        <img class="u-img" :src="groupInfo[key].img" :alt="groupInfo[key].name" />
                        <div class="u-box">
                            <a class="u-title" :href="groupInfo[key].url" target="_blank">{{ groupInfo[key].name }}</a>
                            <el-button
                                size="small"
                                :type="groupInfo[key].open ? 'primary' : ''"
                                @click="groupInfo[key].open = !groupInfo[key].open"
                                >{{ groupInfo[key].open ? "折叠" : "展开"
                                }}<i :class="groupInfo[key].open ? 'el-icon-caret-top' : 'el-icon-caret-right'"></i
                            ></el-button>
                        </div>
                    </div>
                    <taskItem v-for="(item, index) in task" :key="index" :data="item" @update="checkFinish" />
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { getTasks, getCheckTasks } from "@/service/dashboard/tasks.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import taskItem from "@/components/dashboard/task/item.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
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
    methods: {
        // 加载任务列表
        loadTasks() {
            this.loading = true;
            getTasks({ is_limit_everyday: 0, os_visible: 1 })
                .then((res) => {
                    const list = res.data.data.list;
                    this.list = list.filter((item) => {
                        return item.task.task_group == "" && item?.task.action_type != "task_account_bind_github";
                    });
                    this.group = list
                        .sort((a, b) => {
                            const numA = parseInt(a.task.action_type.split("_").pop(), 10);
                            const numB = parseInt(b.task.action_type.split("_").pop(), 10);
                            return numA - numB;
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
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadAc() {
            getBreadcrumb("task_group_info").then((data) => {
                data = data.replace(/ /g, "");
                this.groupInfo = JSON.parse(data);
            });
        },
        // 点击完成
        checkFinish(id) {
            getCheckTasks(id).then((res) => {
                if (res.data.data.hasFinish) {
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
