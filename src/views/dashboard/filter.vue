<template>
    <div class="m-dashboard m-dashboard-filter">
        <h2 class="u-title"><i class="el-icon-odometer"></i> {{ $t("dashboard.filter.title") }}</h2>
        <div class="m-content" v-loading="loading">
            <el-input type="textarea" :rows="6" :placeholder="$t('dashboard.filter.placeholder')" v-model="textarea"> </el-input>
            <el-button type="primary" @click="filter" size="large">{{ $t("dashboard.common.submit") }}</el-button>
            <template v-if="content">
                <el-card shadow="never">
                    <el-divider content-position="left"><i class="el-icon-chat-line-round"></i> {{ $t("dashboard.filter.content") }}</el-divider
                    ><span v-html="content"></span>
                </el-card>
                <el-card shadow="never" v-if="isSuperAuthor && reason.length">
                    <el-divider content-position="left"><i class="el-icon-warning-outline"></i> {{ $t("dashboard.filter.blockReason") }}</el-divider>
                    <div class="m-item">
                        <span v-for="(item, i) in reason" :key="i">
                            <strong>{{ i + 1 }} . </strong><span v-html="item"></span>
                        </span>
                    </div>
                </el-card>
                <span v-if="resultType === 0">
                    <el-tag type="success">{{ $t("dashboard.filter.publishable") }} <i class="el-icon-success"></i></el-tag>
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { filterSeaSun, getSuperAuthorState } from "@/service/dashboard/cooperation";
export default {
    name: "filter",
    props: [],
    data: function () {
        return {
            loading: false,
            textarea: "",
            content: "",
            reason: [],
            resultType: null,
            isSuperAuthor: false,
        };
    },
    mounted: function () {
        const uid = User.getInfo().uid;
        if (!uid) return;
        getSuperAuthorState(uid)
            .then((res) => {
                this.isSuperAuthor = !!res.data.data;
            })
            .catch(() => {
                this.isSuperAuthor = false;
            });
    },
    methods: {
        filter() {
            if (!this.textarea) return;
            this.loading = true;
            filterSeaSun({ text: this.textarea })
                .then((res) => {
                    this.content = res.data.data.content || "";
                    this.resultType = res.data.data.resultType;
                    this.reason = (res.data.data.reason || "").split(",").filter(Boolean);
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
