<template>
    <div class="m-dashboard-work m-dashboard-cms" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">捏脸数据</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布数据
            </a>
        </div>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model.lazy="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <div class="u-header">
                        <i
                            class="u-item-icon u-success-icon el-icon-success"
                            v-if="item.status == 1"
                            title="上架中"
                        ></i>
                        <i class="u-item-icon u-remove-icon el-icon-remove" v-else title="已下架"></i>
                        <a class="u-title" target="_blank" :href="postLink(item.id)">{{ item.title || "未命名" }}</a>
                    </div>
                    <div class="u-desc">
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ item.created_at }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ item.updated_at }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <!-- <el-button size="mini" icon="el-icon-delete" @click="del(item.id)" :disabled="item.price_type != 0" title="删除"></el-button> -->
                        <el-button size="mini" icon="el-icon-edit" @click="edit(item.id)" title="编辑"></el-button>
                        <el-button
                            v-if="item.status == 1"
                            size="mini"
                            icon="el-icon-download"
                            @click="handleOffline(item.id)"
                            title="下架"
                        ></el-button>
                        <el-button
                            v-else
                            size="mini"
                            icon="el-icon-upload2"
                            @click="handleOnline(item.id)"
                            title="上架"
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
            return "./#/face";
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
            location.href = "./#/face/" + id;
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
