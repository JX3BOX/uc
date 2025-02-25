<template>
    <div class="m-dashboard m-dashboard-filter">
        <h2 class="u-title"><i class="el-icon-odometer"></i> 敏感词测试</h2>
        <div class="m-content" v-loading="loading">
            <el-input type="textarea" :rows="6" placeholder="请输入敏感词 / 粘贴段落" v-model="textarea"> </el-input>
            <el-button type="primary" @click="filter">提交</el-button>
            <template v-if="content">
                <el-card shadow="never">
                    <el-divider content-position="left"><i class="el-icon-chat-line-round"></i> 显示内容</el-divider
                    ><span v-html="content"></span>
                </el-card>
                <el-card shadow="never" v-if="reason && reason.length">
                    <el-divider content-position="left"><i class="el-icon-warning-outline"></i> 被屏蔽原因</el-divider>
                    <div class="m-item">
                        <span v-for="(item, i) in reason" :key="i">
                            <strong>{{ i + 1 }} . </strong><span v-html="item"></span>
                        </span>
                    </div>
                </el-card>
                <span v-else>
                    <el-tag type="success">可正常发布 <i class="el-icon-success"></i></el-tag>
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import { filterSeaSun } from "@/service/dashboard/cooperation";
export default {
    name: "filter",
    props: [],
    data: function () {
        return {
            loading: false,
            textarea: "",
            content: "",
            reason: [],
        };
    },
    methods: {
        filter() {
            if (!this.textarea) return;
            this.loading = true;
            filterSeaSun({ text: this.textarea })
                .then((res) => {
                    this.content = res.data.data.content || "";
                    this.reason = res.data.data.reason.split(",").filter(Boolean) || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style scoped lang="less">
.m-dashboard-filter .m-content {
    .flex;
    flex-direction: column;
    gap: 20px;
    .m-item {
        .flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
