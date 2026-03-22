<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">捏脸数据</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> 发布数据
            </a>
        </div>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model.lazy="search" size="large">
            <template #prepend>
                <span>关键词</span>
            </template>
            <template #append>
                <el-button icon="Search"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <a class="u-title" target="_blank" :href="postLink(item.id)">
                        <i class="u-icon">
                            <img src="@/assets/img/publish/works/repo.svg" v-if="item.status == 1" />
                            <img
                                v-else
                                src="@/assets/img/publish/works/draft.svg"
                                title="已下架"
                            />
                        </i>
                        {{ item.title || "未命名" }}</a
                    >
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            <span class="u-time">{{ item.created_at }}</span>
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            <span class="u-time">{{ item.updated_at }}</span>
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button icon="Edit" @click="edit(item.id)" title="编辑"></el-button>
                        <el-button
                            v-if="item.status == 1"
                            icon="Download"
                            @click="handleOffline(item.id)"
                            title="下架"
                        ></el-button>
                        <el-button v-else icon="Upload" @click="handleOnline(item.id)" title="上架"></el-button>
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
                v-model:current-page="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getFaceList, faceOnline, faceOffline, delFace } from "@/service/publish/face.js";
export default {
    name: "face",
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
                pageIndex: this.page,
                pageSize: this.per,
                title: this.search,
            };
        },
        publishLink: function () {
            return "/publish/#/face";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (val) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            const _params = {
                ...this.params,
            };
            getFaceList(_params)
                .then((res) => {
                    this.data = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (id) {
            location.href = "/publish/#/face/" + id;
        },
        postLink: function (id) {
            return "/face/" + id;
        },
        handleOnline: function (id) {
            faceOnline(id).then((res) => {
                this.$message.success("上架成功");
                this.loadPosts();
            });
        },
        handleOffline: function (id) {
            this.$confirm("此操作将下架该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                faceOffline(id).then((res) => {
                    this.$message.success("下架成功");
                    this.loadPosts();
                });
            });
        },
        del(id) {
            this.$confirm("此操作将彻底删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delFace(id).then((res) => {
                    this.$message.success("删除成功");
                    this.loadPosts();
                });
            });
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
</style>
