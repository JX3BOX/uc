<template>
    <div class="m-publish-design-task" v-if="text">
        <el-divider content-position="left">{{ $t("publish.headline.records") }}</el-divider>
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
                    return this.$t("publish.headline.publishedOn", { date: dayjs(push_at).format("YYYY/MM/DD") });
                }
                return this.$t("publish.headline.publishedOn", { date: dayjs(published_at).format("YYYY/MM/DD") });
            } else {
                if (!published_at) {
                    return this.$t("publish.headline.scheduledPending");
                }
                return this.$t("publish.headline.scheduledOn", { date: dayjs(published_at).format("YYYY/MM/DD") });
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
