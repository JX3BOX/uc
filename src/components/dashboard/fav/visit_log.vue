<template>
    <div class="m-dashboard-box" v-loading="loading">
        <div class="m-dashboard-msg-header">
            <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="currentSearch" clearable @clear="loadData">
                <template slot="prepend">关键词</template>
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <ul class="m-dashboard-box-list" v-if="data.length">
            <li v-for="(item, i) in filterData" :key="i">
                <i class="u-icon">
                    <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                </i>
                <a class="u-title" target="_blank" :href="getLink(item.source_type, item.content_meta && item.content_meta.content_id || item.source_id)">{{
                    item.content_meta && item.content_meta.title || item.title || "无标题"
                }}</a>
                <div class="u-desc">
                    <span class="u-category"><i class="el-icon-folder"></i> {{ getTypeLabel(item.source_type) }} </span>
                    <span><i class="el-icon-date"></i> {{ dateFormat(item.created_at) }} </span>
                </div>
                <el-button-group class="u-action">
                    <el-button size="mini" icon="el-icon-delete" title="删除记录" @click="del(item.id)"></el-button>
                </el-button-group>
            </li>
        </ul>
        <el-alert v-else class="m-dashboard-box-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
    </div>
</template>

<script>
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/moment";
import { deleteVisitHistory, getVisitHistory } from "@/service/dashboard/fav";

export default {
    name: "VisitLog",
    props: {
        type: {
            type: String,
        },
        search: {
            type: String,
        },
    },
    data() {
        return {
            currentSearch: this.search,
            data: [],
            loading: false,
            total: 0,
        };
    },
    emits: ["change-search"],
    watch: {
        currentSearch(val) {
            this.$emit("change-search", val);
        },
    },
    computed: {
        filterData() {
            return this.data
                .filter((i) => i.title.indexOf(this.currentSearch || "") > -1)
                .filter((i) => {
                    if (!this.type || this.type === "all") {
                        return true;
                    }
                    return this.type === i.source_type;
                });
        },
    },
    methods: {
        dateFormat,
        getTypeLabel(type) {
            type = type?.replace(/dbm_/g, "");
            type = type.includes("community") ? "community" : type;
            return getTypeLabel(type);
        },
        getLink,
        del(id) {
            this.$confirm("确定要删除该历史记录吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteVisitHistory(id).then(() => {
                            this.$message({
                                type: "success",
                                message: `操作成功`,
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        loadData() {
            this.loading = true;
            getVisitHistory()
                .then(({ data }) => {
                    this.data = data.data || [];
                    this.total = this.data.length || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less"></style>
