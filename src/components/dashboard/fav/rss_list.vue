<template>
    <div class="m-dashboard-box" v-loading="loading">
        <div class="m-dashboard-msg-header">
            <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search" @keyup.enter.native="loadData" clearable @clear="loadData">
                <template slot="prepend">关键词</template>
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <ul class="m-dashboard-box-list" v-if="data.length">
            <li v-for="(item, i) in data" :key="i">
                <i class="u-icon">
                    <img svg-inline src="@/assets/img/dashboard/works/repo.svg" />
                </i>
                <a class="u-title" target="_blank" :href="getLink(item)">{{
                    item.overview.title || "无标题"
                }}</a>
                <div class="u-desc">
                    <span class="u-category"><i class="el-icon-folder"></i> {{ getTypeLabel(item) }} </span>
                    <span><i class="el-icon-date"></i> {{ dateFormat(item.created_at) }} </span>
                </div>
                <el-button-group class="u-action">
                    <el-button size="mini" icon="el-icon-delete" title="删除记录" @click="del(item.id)"></el-button>
                </el-button-group>
            </li>

        </ul>
        <el-alert v-else class="m-dashboard-box-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
        <el-pagination
            class="m-dashboard-box-pages"
            background
            :hide-on-single-page="true"
            :page-size="pageSize"
            :current-page.sync="index"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentChange"
        />
    </div>
</template>

<script>
import { getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/moment";
import { getRssList, deleteRss } from "@/service/dashboard/fav";

const categoryMap = {
    2: "作者", // author
    3: "论坛", // community
}

const categories = {
    2: "author",
    3: "community",
}

export default {
    name: "RssList",
    data() {
        return {
            search: "",
            data: [],
            loading: false,
            total: 0,

            index: 1,
            pageSize: 10,
        };
    },
    methods: {
        dateFormat,
        getTypeLabel(item) {
            let type = item.rss_category;
            if (categoryMap[type]) {
                return categoryMap[type];
            }
            type = item.post_type
            return getTypeLabel(type);
        },
        getLink(item) {
            let type = item.rss_category;
            if (categories[type]) {
                return `/${categories[type]}/${~~item.post_id || ~~item.author_id}`;
            }
            type = item.post_type
            return getLink(type, item.post_id);
        },
        del(id) {
            this.$confirm("确定要删除该订阅吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRss(id).then(() => {
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
        currentChange(val) {
            this.index = val;
            this.loadData();
        },
        loadData() {
            const params = {
                index: this.index,
                pageSize: this.pageSize,
                q: this.search,
                category: -2
            }
            this.loading = true;
            getRssList(params)
                .then(({ data }) => {
                    this.data = data.data.list || [];
                    this.total = data.data.page?.total;
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

