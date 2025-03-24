<template>
    <div class="m-revision">
        <el-button type="primary" @click="view" size="small" icon="el-icon-folder">历史版本</el-button>

        <el-drawer title="历史版本" :visible.sync="show" z-index="2100" class="m-revision-drawer" append-to-body>
            <h3 class="u-revision-title" slot="title">历史版本</h3>
            <main class="m-revision-container" v-loading="loading">
                <div class="m-revision-list">
                    <ul class="u-list" v-if="list.length">
                        <li v-for="(item, i) in list" class="u-item" :key="i" @click="use(item)">
                            <div class="u-version">
                                <span>{{ item.version }}</span> - <span>{{ item.created_at }}</span>
                            </div>
                            <el-button class="u-compare" size="small" type="text"
                                ><i class="el-icon-sort u-icon"></i>使用</el-button
                            >
                        </li>
                    </ul>
                    <el-alert class="u-null" v-else title="当前没有任何历史版本" type="info" show-icon></el-alert>
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="total"
                        :current-page.sync="index"
                        hide-on-single-page
                    >
                    </el-pagination>
                </div>
            </main>
        </el-drawer>
    </div>
</template>

<script>
import { getCommitHistories } from "@/service/publish/version";
export default {
    name: "publish_revision",
    props: ["post"],
    data() {
        return {
            show: false,
            index: 1,
            pageSize: 10,
            total: 0,
            list: [],

            loading: false,
        };
    },
    computed: {
        pageParams() {
            return {
                index: this.index,
                pageSize: this.pageSize,
            };
        },
        db() {
            return this.$store.state.db;
        },
        link_content_meta_id() {
            return this.post?.link_content_meta_id || 0;
        },
    },
    watch: {
        page() {
            this.load();
        },
    },
    methods: {
        view() {
            this.show = true;
            this.load();
        },
        load() {
            const link_content_meta_id = this.link_content_meta_id || ~~this.$route.query.content_meta_id;
            if (!link_content_meta_id) return;
            this.loading = true;
            getCommitHistories(link_content_meta_id, this.pageParams)
                .then((res) => {
                    const list = res.data?.data?.list || [];
                    if (list.length) {
                        this.list = list.map((item, i) => {
                            return {
                                ...item,
                                version: "v" + (list.length - i),
                            };
                        });
                        this.total = res.data?.data?.page?.total || 0;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        use(item) {
            this.show = false;
            const routeName = this.$route.name;
            this.$router.push(
                `/${routeName}/${this.postId}?mode=revision&version_id=${item.id}&content_meta_id=${item.link_content_meta_id}`
            );
        },
    },
};
</script>

<style lang="less">
.m-revision-drawer {
    .size(100%);
    .pf;
    .rt(0);

    .el-drawer {
        min-width: 420px;
    }

    .u-revision-title {
        margin: 0;
    }
    .m-revision-container {
        padding: 0 10px;

        .u-empty {
            .ml(10px);
        }
        .u-null {
            .mt(10px);
        }
    }

    .m-revision-list {
        .u-list {
            list-style: none;
            padding: 0;
            margin: 0;
            li {
                padding: 0 10px;
                .fz(13px, 36px);
                .flex;
                justify-content: space-between;
                align-items: center;
                transition: 0.15s ease-in-out;
                .nobreak;
                &:hover {
                    background-color: #e6f0fb;

                    .u-compare {
                        .db;
                        @media screen and (max-width: @phone) {
                            .none;
                        }
                    }
                }
                .pointer;
            }

            .u-compare {
                .none;

                .u-icon {
                    transform: rotate(90deg);
                    margin-right: 3px;
                }
            }
        }
        .u-pagination {
            .mt(20px);
            text-align: center;
        }
    }
}
@media screen and (max-width: @ipad) {
    .m-revision-drawer {
        .el-drawer {
            .w(100%) !important;
            overflow-y: auto;
            min-width: 0;
        }
    }
}
@media screen and (max-width: @ip5) {
    .m-revision-drawer .m-revision-list .m-revision-item {
        .h(auto);
        flex-wrap: wrap;
    }
}
</style>
