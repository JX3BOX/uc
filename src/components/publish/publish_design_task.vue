<template>
    <div class="m-publish-design-task" v-if="text">
        <el-divider content-position="left">头条记录</el-divider>
        <el-alert class="m-publish-task" :closable="false">
            {{ text }}
        </el-alert>
    </div>
</template>

<script>
import { getDesignTask } from "@/service/publish/cms";
import dayjs from "dayjs";
export default {
    name: "PublishDesignTask",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data: function () {
        return {
            tasks: [],
        };
    },
    computed: {
        task() {
            const pending = this.tasks.find(item => item.flow == 0);
            const recent = this.tasks.find(item => item.flow == 3);

            return pending || recent || null
        },
        text() {
            if (!this.task) return ""
            const { published_at, flow, push_at } = this.task;
            if (flow == 3) {
                if (!published_at) {
                    return `近期于${dayjs(push_at).format('YYYY/MM/DD')}上过头条`
                }
                return `近期于${dayjs(published_at).format('YYYY/MM/DD')}上过头条`
            } else {
                if (!published_at) {
                    return `近期将于<时间待定>上头条`
                }
                return `近期将于${dayjs(published_at).format('YYYY/MM/DD')}上头条`
            }
        }
    },
    methods: {
        loadData() {
            if (!this.data?.ID) return;
            getDesignTask({
                source_type: this.data?.post_type,
                ids: this.data?.ID,
            }).then((res) => {
                this.tasks = res.data.data?.sort((a, b) => b.id - a.id)
            });
        },
    },
    created: function () {
        this.loadData()
    },
};
</script>

<style lang="less"></style>
