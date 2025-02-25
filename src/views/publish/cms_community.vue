<template>
    <div class="m-dashboard-work m-dashboard-cms p-cms-community" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">论坛</h2>
            <a :href="publishLink" class="u-publish el-button el-button--primary el-button--small">
                <i class="el-icon-document"></i> 发布作品
            </a>
        </div>

        <el-tabs v-model="activeTab">
            <el-tab-pane label="主题" name="topic"></el-tab-pane>
            <el-tab-pane label="回帖" name="reply"></el-tab-pane>
        </el-tabs>

        <el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
            <span slot="prepend">关键词</span>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <div class="m-dashboard-work-filter" v-if="activeTab == 'topic'">
            <!-- <clientBy class="u-client" @filter="filter" :showWujie="showWujie" /> -->
            <!-- <orderBy class="u-order" @filter="filter" /> -->
        </div>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <i class="u-icon">
                        <img src="@/assets/img/publish/works/repo.svg" />
                    </i>
                    <a class="u-title" target="_blank" :href="postLink(item)">
                        <span v-if="activeTab == 'topic'">{{ item.title || item.content || "无标题" }}</span>
                        <span class="u-title_content" v-else v-html="getContent(item)"></span>
                        <!-- <div class="u-tags">
                            <el-tag type="danger" size="mini" v-if="item.is_top == 1">置顶</el-tag>
                            <el-tag type="danger" size="mini" v-if="item.is_star == 1">加精</el-tag>
                            <el-tag type="danger" size="mini" v-if="item.is_hight == 1">高亮</el-tag>
                        </div> -->
                    </a>
                    <div class="u-desc">
                        <span class="u-desc-subitem">
                            <i class="el-icon-view"></i>
                            {{ (item.is_self_visit || item.visible) | visibleFormat }}
                        </span>
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
                        <time class="u-desc-subitem">
                            <i class="el-icon-receiving"></i>
                            状态 :
                            {{ getStatusCn(item.status) }}
                        </time>
                    </div>

                    <el-button-group class="u-action">
                        <el-button size="mini" icon="el-icon-edit" title="编辑" @click="edit(item)"></el-button>
                        <el-button size="mini" icon="el-icon-delete" title="删除" @click="del(item)"></el-button>
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
import { getMyList, del, getMyReplyList, deleteMyReply } from "@/service/publish/community.js";
import dateFormat from "@/utils/dateFormat";
import statusMap from "@/assets/data/publish/status.json";
import { pick } from "lodash";
import { __postType, __visibleMap } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "work",
    props: [],
    data: function () {
        return {
            loading: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            content: "",
            // order: "update",
            client: "",
            search: "",
            statusMap,

            activeTab: "topic",
        };
    },
    computed: {
        type: function () {
            return this.$route.params.type;
        },
        params: function () {
            return {
                type: this.type,
                title: this.search || undefined,
                // order: this.order,
                pageSize: this.per,
                index: this.page,
                // client: this.client,
            };
        },
        publishLink: function () {
            return "./#/community";
        },
        showWujie: function () {
            return ["bps", "pvp", "bbs"].includes(this.type);
        },
    },
    watch: {
        type: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.page = 1;
            },
        },
        params: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.loadPosts();
            },
        },
        activeTab: {
            handler: function () {
                this.page = 1;
                this.loadPosts();
            },
        },
    },
    methods: {
        getStatusCn: function (status) {
            switch (status) {
                case 1:
                    return "正常";
                case 2:
                    return "待审核";
                case 3:
                    return "审核未通过";

                default:
                    return "未知状态";
            }
        },
        loadPosts: function () {
            this.loading = true;
            this.data = [];
            if (this.activeTab == "topic") {
                getMyList(this.params)
                    .then((res) => {
                        this.data = res.data.data.list;
                        this.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                const params = pick(this.params, ["pageSize", "index"]);
                this.search && (params.content = this.search);
                getMyReplyList(params)
                    .then((res) => {
                        this.data = res.data.data.list;
                        this.total = res.data.data.page.total;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        edit: function (item) {
            const routeName = this.activeTab == "topic" ? "community" : "community_reply";

            const path = this.$router.resolve({
                name: routeName,
                params: {
                    id: item.id,
                },
            });

            window.open(path.href, "_blank");
        },
        del: function (item) {
            this.$alert("确定要删除吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        const fn = this.activeTab == "topic" ? del : deleteMyReply;
                        fn(item.id).then(() => {
                            this.$message({
                                type: "success",
                                message: `删除成功`,
                            });

                            this.page = 1;
                            this.loadPosts();
                        });
                    }
                },
            });
        },
        draft: function (id, i) {
            push(id, {
                publish_status: "draft",
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: `操作成功`,
                });
                this.data[i].post_status = "draft";
            });
        },
        publish: function (id, i) {
            push(id, {
                publish_status: "publish",
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: `操作成功`,
                });
                this.data[i].post_status = "publish";
            });
        },
        postLink: function (item) {
            return this.activeTab == "topic" ? `/community/${item.id}` : `/community/${item.topic_id}`;
        },
        filter: function (o) {
            this.page = 1;
            this[o.type] = o.val;
        },
        isSimpleType: function (val) {
            return simpleTypes.includes(val);
        },
        getContent(item) {
            const val = item.content;
            if (val) {
                return `#${item.floor} 回复：${item?.topic?.title}` + val.slice(0, 12) + "...";
            }
            return "";
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        visibleFormat: function (val) {
            return __visibleMap[~~val];
        },
        statusFormat: function (val) {
            return statusMap[val];
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";

.p-cms-community {
    .u-title {
        display: flex;
        align-items: center;
        gap: 12px;
        .u-tags {
            display: flex;
            gap: 4px;
        }

        p {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    .u-title_content {
        .flex;

        p {
            margin-left: 5px;
        }
    }
}
</style>
