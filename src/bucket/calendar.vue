<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">日历记录</h2>
            <a
                :href="publishLink"
                class="u-publish el-button el-button--primary el-button--small"
            >
                <i class="el-icon-document"></i> 贡献纪事
            </a>
        </div>

        <el-input
            class="m-dashboard-work-search"
            placeholder="请输入搜索内容"
            v-model.lazy="search"
        >
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i
                        class="u-item-icon el-icon-chat-dot-round"
                        v-if="item.status == 1"
                    ></i>
                    <i
                        class="u-item-icon el-icon-lock"
                        v-else
                        :title="item.status == 0 ? '待审核' : '审核未通过'"
                    ></i>
                    <a
                        class="u-title"
                        target="_blank"
                        :href="postLink(item.id)"
                        >{{ item.desc || "未命名" }}</a
                    >
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ item.created_at | dateFormat }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ item.updated_at | dateFormat }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button
                            size="mini"
                            icon="el-icon-edit"
                            @click="edit(item.id)"
                            title="编辑"
                        ></el-button>
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
import { getMyCalendar } from "@/service/publish/calendar.js";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "calendar",
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
                page: this.page,
                per: this.per,
                search: this.search,
            };
        },
        publishLink: function () {
            return '/calendar';
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getMyCalendar(this.params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (id) {
            location.href = "/calendar/view/" + id
        },
        postLink: function (id) {
            return "/calendar/view/" + id
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
