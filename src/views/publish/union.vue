<template>
    <div class="m-dashboard-work m-dashboard-cms m-dashboard-union" v-loading="loading">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">
                联合创作
                <span class="u-subtype">
                    <i class="el-icon-arrow-right"></i>
                    <span>{{subtype}}</span>
                </span>
            </h2>
        </div>

        <div class="m-dashboard-box">
            <ul class="m-dashboard-box-list" v-if="data && data.length">
                <li v-for="(item, i) in data" :key="i">
                    <template v-if="item.union_post_raw">
                        <i class="u-icon">
                            <img
                                v-if="item.union_post_raw.post_status == 'publish'"
                                svg-inline
                                src="@/assets/img/publish/works/repo.svg"
                            />
                            <img v-else svg-inline src="@/assets/img/publish/works/draft.svg" />
                        </i>
                        <a
                            class="u-title"
                            target="_blank"
                            :href="postLink(item.union_post_raw.post_type, item.union_post_raw.ID)"
                        >{{ item.union_post_raw.post_title || "无标题" }}</a>
                        <div class="u-desc">
                            <span class="u-desc-subitem">
                                <i class="el-icon-view"></i>
                                {{ item.union_post_raw.visible | visibleFormat }}
                            </span>
                            <time class="u-desc-subitem">
                                <i class="el-icon-finished"></i>
                                发布 :
                                {{ item.union_post_raw.post_date | dateFormat }}
                            </time>
                            <time class="u-desc-subitem">
                                <i class="el-icon-refresh"></i>
                                更新 :
                                {{ item.union_post_raw.post_modified | dateFormat }}
                            </time>
                        </div>

                        <el-button-group class="u-action">
                            <el-button
                                size="mini"
                                icon="el-icon-edit"
                                title="编辑"
                                @click="edit(item.union_post_raw.post_type, item.union_post_raw.ID)"
                            ></el-button>
                            <el-button
                                v-if="isActive"
                                size="mini"
                                icon="el-icon-delete"
                                title="删除"
                                @click="del(item.union_post_raw.ID,i)"
                            ></el-button>
                            <el-popconfirm
                                v-else
                                title="确认退出该作品的联合创作者身份吗？"
                                @confirm="quit(item.union_post_raw.ID,i)"
                            >
                                <el-button
                                    slot="reference"
                                    class="u-quit"
                                    size="mini"
                                    icon="el-icon-download"
                                    title="退出联合身份"
                                ></el-button>
                            </el-popconfirm>
                        </el-button-group>
                    </template>
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
import { del } from "@/service/publish/cms.js";
import { getUnionPosts, quitUnionPost } from "@/service/publish/union.js";
import { editLink, getLink } from "@jx3box/jx3box-common/js/utils.js";
import {
    __postType,
    __visibleMap,
} from "@jx3box/jx3box-common/data/jx3box.json";
import dateFormat from "@/utils/dateFormat";
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
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
                is_active : ~~this.isActive,
            };
        },
        subtype: function () {
            return this.$route.name == "union_active" ? "邀请创作" : "受邀创作";
        },
        isActive: function () {
            return this.$route.name == "union_active";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.loadPosts();
            },
        },
    },
    methods: {
        loadPosts: function () {
            this.loading = true;
            getUnionPosts(this.params)
                .then((res) => {
                    this.data = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
        quit: function (id, i) {
            quitUnionPost(id).then((res) => {
                this.$notify({
                    title: "退出成功",
                    message: "成功退出该作品联合创作",
                    type: "success",
                });
                this.data.splice(i, 1);
            });
        },
        del: function (id, i) {
            this.$alert("确定要删除吗？", "确认信息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        del(id).then((res) => {
                            this.$notify({
                                title: "删除成功",
                                message: "成功删除作品",
                                type: "success",
                            });
                            this.data.splice(i, 1);
                        });
                    }
                },
            });
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        visibleFormat: function (val) {
            return __visibleMap[~~val];
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";
.m-dashboard-union {
    .u-quit {
        i {
            transform: rotate(-90deg);
        }
    }
    .u-subtype {
        .fz(12px);
        color: #999;
        .ml(10px);
        font-weight: normal;
        span {
            color: #fba524;
        }
    }
}
</style>
