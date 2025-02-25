<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">帖子评论</h2>
        </div>

        <el-input class="m-dashboard-work-search u-source-search" placeholder="请输入搜索内容" v-model="search">
            <template slot="prepend">关键词</template>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i class="u-icon el-icon-chat-line-square">
                    </i>
                    <a class="u-title" target="_blank" :href="postLink(item.topic_id)">{{ item.content || "未知" }}</a>
                    <!-- <span class="u-desc">{{item.content || '未知'}}</span> -->
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ showTime(item.created_at) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                            <el-button size="mini" icon="el-icon-delete" @click="del(item.id, i)"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                class="m-dashboard-box-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { getMyCommentList as getMyComments, deleteMyComment as deleteComment } from "@/service/publish/community";
export default {
    name: "comments",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            search: "",
        };
    },
    computed: {
        params: function () {
            return {
                per: this.per,
                page: this.page,
                search: this.search,
            };
        },
    },
    methods: {
        showTime,
        loadData: function () {
            this.loading = true;
            getMyComments(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (id) {
            return `/community/${id}`;
        },
        del: function (id, i) {
            this.$alert("确定删除吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteComment(id).then((res) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
    },
    watch: {
        params: {
            deep: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
