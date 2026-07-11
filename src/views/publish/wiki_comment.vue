<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-wiki" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">{{ $t("publish.types.wikiComments") }}</h2>
        </div>

        <el-input
            class="m-dashboard-work-search u-source-search"
            :placeholder="$t('publish.common.searchPlaceholder')"
            v-model="achievement_comment.keyword"
            @change="search_comment"
            size="large"
        >
            <template #prepend>
                <span>{{ $t("publish.common.keyword") }}</span>
            </template>
            <template #append>
                <el-button icon="Search" @click="search_comment"></el-button>
            </template>
        </el-input>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="achievement_comment.data && achievement_comment.data.length">
                <li class="u-wiki" v-for="(comment, key) in achievement_comment.data" :key="key">
                    <span class="u-tab" v-text="getTypeLabel(comment.type)"></span>
                    <div class="u-header">
                        <a class="u-title" target="_blank" :href="'cj/view/' + comment.source_id">{{
                            comment.title || $t("publish.common.untitled")
                        }}</a>
                        <el-tag type="warning" size="small" v-if="comment.checked == 0">{{ $t("publish.status.pendingReview") }}</el-tag>
                        <el-tag type="success" size="small" v-if="comment.checked == 1">{{ $t("publish.status.approved") }}</el-tag>
                        <el-tag type="danger" size="small" v-if="comment.checked == 2">{{ $t("publish.status.rejected") }}</el-tag>
                    </div>
                    <div class="u-desc">
                        <span class="u-content">
                            <!-- <i class="el-icon-s-comment"></i> -->
                            {{ comment.content }}
                        </span>
                        <time class="u-desc-subitem">
                            <i class="el-icon-finished"></i>
                            {{ $t("publish.common.publishedAt") }} :
                            <span class="u-time">{{ dateFormat(new Date(comment.created * 1000)) }}</span>
                        </time>
                        <!-- <time class="u-desc-subitem">
                            <i class="el-icon-refresh"></i>
                            {{ $t("publish.common.updatedAt") }} :
                            {{ dateFormat(new Date(comment.updated * 1000)) }}
                        </time> -->
                    </div>

                    <el-button-group class="u-action">
                        <el-tooltip class="item" effect="dark" :content="$t('publish.common.delete')" placement="top-start">
                            <el-button icon="Delete" :title="$t('publish.common.delete')" @click="comment_del(comment)"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                :title="$t('publish.common.noResults')"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                class="m-dashboard-box-pages"
                background
                :total="achievement_comment.total"
                hide-on-single-page
                layout="total, prev, pager, next, jumper"
                :current-page="comment_page"
                :page-size="length"
                @current-change="comment_page_change"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __wikiType } from "@/utils/config";
import dateFormat from "@/utils/dateFormat";
import { get_comments, remove_comment } from "@/service/publish/wiki";
export default {
    name: "wiki",
    props: [],
    data: function () {
        return {
            loading: false,

            active_name: this.$route.query.type ? this.$route.query.type : "wiki_post",
            achievement_comment: {
                data: null,
                total: 0,
                keyword: null,
            },
            comment_page: 1,
            length: 10,
        };
    },
    methods: {
        getTypeLabel: function (val) {
            return val ? __wikiType[val] : this.$t("publish.common.unknown");
        },
        comment_page_change(i = 1) {
            this.comment_page = i;
            this.loading = true;
            const params = {
                page: i,
                per: this.length,
            };
            if (this.achievement_comment.keyword) {
                params.keyword = this.achievement_comment.keyword;
            }
            get_comments(params)
                .then(
                    (res) => {
                        this.achievement_comment.data = res.data.data.list;
                        this.achievement_comment.total = res.data.data.total;
                    },
                    () => {
                        this.achievement_comment.data = false;
                    }
                )
                .finally(() => {
                    this.loading = false;
                });
        },
        search_comment() {
            this.comment_page_change(1);
        },
        post_edit(type, post) {
            switch (type) {
                case "achievement":
                    this.$message(this.$t("publish.message.comingSoon"));
                    break;
            }
        },
        comment_del(comment) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.confirmation"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    remove_comment(comment.id).then((data) => {
                        data = data.data;
                        this.$notify({
                            title: this.$t("publish.message.deleteSucceeded"),
                            type: "success",
                        });
                        this.comment_page_change(this.post_page);
                    });
                },
            });
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (this.$route.query.keyword) {
                    this.achievement_comment.keyword = this.$route.query.keyword;

                    // 置空输入框ID
                    this.$nextTick(() => {
                        let input_doms = document.querySelectorAll(".u-source-search input");
                        for (let i = 0; i < input_doms.length; i++) input_doms[i].value = "";
                    });
                } else {
                    this.achievement_comment.keyword = "";
                }

                // 列表获取
                this.comment_page_change();
            },
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/wiki.less";
</style>
