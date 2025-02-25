<template>
    <div class="m-reading-history">
        <el-button type="primary" @click="view" size="small" icon="el-icon-document">阅读记录</el-button>

        <el-drawer title="阅读记录" :visible.sync="show" z-index="2100" class="m-history-drawer" append-to-body>
            <h3 class="u-history-title" slot="title">阅读记录</h3>
            <main class="m-history-container" v-loading="loading">
                <div class="m-history-list">
                    <ul class="u-list" v-if="data && data.length">
                        <li class="m-history-item" v-for="(item, i) in data" :key="i">
                            <span class="u-name">
                                <i class="u-icon el-icon-tickets"></i>
                                <a :href="authorLink(item.user_info.id)" class="u-creator" v-if="item.user_info" title="创建人">
                                    <img class="u-avatar" :src="showAvatar(item.user_info.avatar)" />
                                    {{ item.user_info.display_name }}
                                </a>
                                <em class="u-time">{{ item.created_at  }} 访问了此帖</em>
                            </span>
                        </li>

                        <el-pagination
                            class="u-pagination"
                            background
                            hide-on-single-page
                            layout="prev,pager,next,->,total"
                            :total="total"
                            :page-size="per"
                            :current-page.sync="page"
                        ></el-pagination>
                    </ul>

                    <el-alert class="u-null" v-else title="当前没有任何阅读记录" type="info" show-icon></el-alert>
                </div>
            </main>
        </el-drawer>
    </div>
</template>

<script>
import { getReadingHistory } from "@/service/publish/community";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "publish_reading_history",
    props: {
        postId: {
            type: [String, Number],
            default: 0,
        },
        category: {
            type: String,
            default: "posts",
        },
        subcategory: {
            type: String,
            default: "default",
        },
    },
    data() {
        return {
            show: false,

            page: 1,
            per: 10,

            data: [],
            loading: false,
        };
    },
    computed: {
        params() {
            return {
                index: this.page,
                pageSize: this.per,
            };
        },
    },
    methods: {
        view() {
            if (!this.postId) return;
            this.show = true;
            this.loadList();
        },
        showAvatar,
        authorLink,
        loadList() {
            this.loading = true;

            const data = {
                id: this.postId,
                category: this.category,
                subcategory: this.subcategory,
            }

            getReadingHistory(data, this.params)
                .then((res) => {
                    this.data = res.data.data.list || [];
                    this.total = res.data.data.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
.m-reading-history {
    // .pa;
    // .rt(0);
}
.m-history-drawer {
    .size(100%);
    .pf;
    .rt(0);

    .el-drawer {
        min-width: 420px;
    }

    .u-history-title {
        margin: 0;
    }
    .m-history-container {
        padding: 0 10px;

        .u-actions {
            display: flex;
            align-items: center;
            .ml(15px);
            min-height: 28px;
        }
        .u-empty {
            .ml(10px);
        }
        .u-null {
            .mt(10px);
        }
    }

    .m-history-list {
        .u-list {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .u-pagination {
            .mt(20px);
            text-align: center;
        }
    }

    .m-history-item {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        padding: 5px;
        .fz(12px, 28px);
        border-bottom: 1px dashed #eee;
        white-space: nowrap;

        .u-checkbox {
            .mr(5px);
        }

        .u-edit {
            cursor: pointer;
            color: @color-link !important;
            .ml(5px);
        }

        .u-time {
            color: #999;
            .ml(5px);
            font-style: normal;
        }
        .u-remark span {
            color: #fba524;
        }

        .u-name {
            .ml(10px);
            i {
                .fz(16px);
                color: #888;
                .y(-2px);
                .mr(5px);
            }
        }

        .u-creator {
            margin-left: 5px;
            margin-right: 5px;
        }

        .u-avatar {
            .size(24px);
            .y;
            .mr(5px);
            .r(100%);
        }
    }
}
@media screen and (max-width: @ipad) {
    .m-history-drawer {
        .el-drawer {
            .w(100%) !important;
            overflow-y: auto;
            min-width: 0;
        }
    }
}
@media screen and (max-width: @ip5) {
    .m-history-drawer .m-history-list .m-history-item {
        .h(auto);
        flex-wrap: wrap;
    }
}
</style>
