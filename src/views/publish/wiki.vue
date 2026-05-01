<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ typeLabel }}百科</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary"
                ><i class="el-icon-document"></i> 发布作品</a
            >
        </div>

        <el-input
            class="m-dashboard-work-search u-source-search"
            placeholder="请输入搜索内容"
            v-model="achievement_post.keyword"
            @change="search_post"
            size="large"
        >
            <template #prepend>
                <span>关键词</span>
            </template>
            <template #append>
                <el-button icon="Search" @click="search_post"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="achievement_post.data && achievement_post.data.length">
                <li class="u-wiki" v-for="(post, key) in achievement_post.data" :key="key">
                    <span class="u-tab" v-text="getTypeLabel(post.type)"></span>
                    <div class="u-header">
                        <a class="u-title" target="_blank" :href="getLink(post)">
                            {{ post.title || "无标题" }}
                        </a>
                        <el-tag type="warning" size="small" v-if="post.checked == 0">等待审核</el-tag>
                        <el-tag type="success" size="small" v-if="post.checked == 1">审核通过</el-tag>
                        <el-tag type="danger" size="small" v-if="post.checked == 2">审核驳回</el-tag>
                        <el-tag type="warning" size="small" v-if="post.checked == 3">等待验证</el-tag>
                    </div>
                    <div class="u-desc">
                        <span
                            v-if="post.checked == 2 && post.check_remark"
                            class="u-check_remark"
                            v-html="`驳回理由：${post.check_remark}`"
                        ></span>
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            发布 :
                            {{ dateFormat(new Date(post.created * 1000)) }}
                        </time>
                        <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            更新 :
                            {{ dateFormat(new Date(post.updated * 1000)) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button
                            icon="Edit"
                            :disabled="post.checked == 1 || post.checked == 3"
                            title="编辑"
                            @click="post_edit(post)"
                        ></el-button>
                        <el-button icon="Delete" title="删除" @click="post_del(post)"></el-button>
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
                :total="achievement_post.total"
                hide-on-single-page
                layout="total, prev, pager, next, jumper"
                :current-page="post_page"
                :page-size="length"
                @current-change="post_page_change"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getTypeLabel, getLink } from "@jx3box/jx3box-common/js/utils";
import { __wikiType } from "@/utils/config";
import dateFormat from "@/utils/dateFormat";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
const wikiTypes = {
    ...__wikiType,
    skill: "技能",
};
export default {
    name: "wiki",
    props: [],
    data: function () {
        return {
            loading: false,

            active_name: this.$route.query.type ? this.$route.query.type : "wiki_post",
            achievement_post: {
                data: null,
                total: 0,
                keyword: null,
            },
            post_page: 1,
            length: 10,
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        typeLabel: function () {
            return wikiTypes[this.type];
        },
        publishLink: function () {
            return "/publish/#/" + this.type;
        },
    },
    methods: {
        getTypeLabel: function (val) {
            return val ? wikiTypes[val] : "未知";
        },
        post_page_change(i = 1) {
            this.post_page = i;
            this.loading = true;
            wiki.mine({
                type: this.type,
                _search: this.achievement_post.keyword,
                page: i,
                per: this.length,
            })
                .then((res) => {
                    this.achievement_post.data = res.data.data.list || [];
                    this.achievement_post.total = res.data.data.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        search_post() {
            this.post_page_change(1);
        },
        post_edit(post) {
            this.$router.push({
                path: `/${this.type}/${post.source_id}?post_id=${post.id}`,
            });
        },
        post_del(post) {
            this.$confirm(`确认删除吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        wiki.remove(post.id).then(() => {
                            this.$message.success("删除成功");
                            this.post_page_change();
                            done();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        getLink: function (post) {
            return getLink(post?.type, post?.source_id) + "/" + post?.id;
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (this.$route.params.type) {
                    switch (this.$route.query.type) {
                        case "wiki_post":
                            this.achievement_post.keyword = this.$route.params.type;
                            break;
                        case "wiki_comment":
                            this.achievement_comment.keyword = this.$route.params.type;
                            break;
                    }

                    // 置空输入框ID
                    this.$nextTick(() => {
                        let input_doms = document.querySelectorAll(".u-source-search input");
                        for (let i = 0; i < input_doms.length; i++) input_doms[i].value = "";
                    });
                } else {
                    this.achievement_post.keyword = "";
                    this.achievement_comment.keyword = "";
                }

                // 列表获取
                this.post_page_change();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/wiki.less";
</style>
