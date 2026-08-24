<template>
    <div class="m-reading-history">
        <el-button type="primary" @click="view" icon="Document">{{ $t("publish.history.reading") }}</el-button>

        <el-drawer
            :title="$t('publish.history.reading')"
            v-model="show"
            :z-index="2100"
            size="min(420px, 100%)"
            class="m-history-drawer"
            append-to-body
        >
            <template #header>
                <h3 class="u-history-title">{{ $t("publish.history.reading") }}</h3>
            </template>
            <main class="m-history-container" v-loading="loading">
                <div class="m-history-list">
                    <ul class="u-list" v-if="data && data.length">
                        <li class="m-history-item" v-for="(item, i) in data" :key="i">
                            <span class="u-name">
                                <i class="u-icon el-icon-tickets"></i>
                                <a
                                    :href="authorLink(item.user_info.id)"
                                    class="u-creator"
                                    v-if="item.user_info"
                                    :title="$t('publish.history.creator')"
                                >
                                    <img class="u-avatar" :src="showAvatar(item.user_info.avatar)" />
                                    {{ item.user_info.display_name }}
                                </a>
                                <em class="u-time">{{ $t("publish.history.visitedAt", { time: item.created_at }) }}</em>
                            </span>
                        </li>

                        <el-pagination
                            class="u-pagination"
                            background
                            hide-on-single-page
                            layout="prev,pager,next,->,total"
                            :total="total"
                            :page-size="per"
                            v-model:current-page="page"
                        ></el-pagination>
                    </ul>

                    <el-alert class="u-null" v-else :title="$t('publish.history.noReading')" type="info" show-icon></el-alert>
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
            total: 0,
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
            };

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
.m-history-drawer {
    box-sizing: border-box;

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
        min-height: 40px;
        align-items: center;
        padding: 8px 10px;
        box-sizing: border-box;
        .fz(12px, 28px);
        border-bottom: 1px dashed #eee;

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
            display: flex;
            align-items: center;
            width: 100%;
            min-width: 0;
            i {
                flex: none;
                .fz(16px);
                color: #888;
                .y(-2px);
                .mr(5px);
            }
        }

        .u-creator {
            display: inline-flex;
            align-items: center;
            min-width: 0;
            margin-left: 5px;
            margin-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
    .m-history-drawer.el-drawer {
        overflow-y: auto;
    }
}

@media screen and (max-width: @phone) {
    .m-history-drawer {
        .el-drawer__header {
            margin-bottom: 12px;
        }

        .m-history-container {
            padding: 0;
        }

        .m-history-item {
            padding: 10px 4px;

            .u-name {
                flex-wrap: wrap;
                line-height: 24px;
            }

            .u-time {
                display: block;
                width: 100%;
                margin-left: 29px;
                line-height: 20px;
            }
        }

        .u-null {
            width: 100%;
            box-sizing: border-box;
        }

        .u-pagination {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 4px;

            .el-pagination__total {
                display: none;
            }
        }
    }
}
</style>
