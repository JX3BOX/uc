<template>
    <div class="m-revision" v-if="ready">
        <el-button type="primary" @click="view" size="small" icon="el-icon-folder">历史版本</el-button>

        <el-drawer title="历史版本" :visible.sync="show" z-index="2100" class="m-revision-drawer" append-to-body>
            <h3 class="u-revision-title" slot="title">历史版本</h3>
            <main class="m-revision-container" v-loading="loading">
                <div class="u-actions">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAll">全选</el-checkbox>
                    <el-button class="u-empty" size="mini" plain icon="el-icon-delete" @click="delRevisions" :disabled="!checked || !checked.length">批量删除</el-button>
                </div>
                <div class="m-revision-list">
                    <ul class="u-list" v-if="data && data.length">
                        <li class="m-revision-item" v-for="(item, i) in data" :key="i">
                            <span class="u-name">
                                <el-checkbox class="u-checkbox" v-model="item.checked" @change="(val) => checkChange(val, item)"></el-checkbox>
                                <el-tooltip class="item" effect="dark" :content="item.remark" placement="top" :disabled="!item.remark">
                                    <span>
                                        <i class="u-icon el-icon-tickets"></i>
                                    <span class="u-remark">{{ item.remark ? formatRemark(item.remark) : item.post_title }}</span>
                                    </span>
                                </el-tooltip>
                                <em class="u-time">{{ item.updated_at | formatDate }}</em>
                                <span class="u-creator" v-if="item.user_info" title="创建人">{{ item.user_info.display_name }}</span>
                                <i class="u-edit el-icon-edit" @click="remark(item)" title="添加备注"></i>
                            </span>

                            <el-button-group>
                                <el-button size="mini" icon="el-icon-view" @click="use(item)" title="预览"></el-button>
                                <el-button size="mini" icon="el-icon-delete" @click="del(item)" title="删除"></el-button>
                            </el-button-group>
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

                    <el-alert class="u-null" v-else title="当前没有任何历史版本" type="info" show-icon></el-alert>
                </div>
            </main>
        </el-drawer>
    </div>
</template>

<script>
import { getRevisions, putRevision, removeRevision, removeRevisions } from "@/service/publish/revision";
import { showTime } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "publish_revision",
    props: {
        postId: {
            type: [String, Number],
            default: 0,
        },
        enable: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            show: false,
            data: [
                // {
                //     id: 1,
                //     version: 1,
                //     updated_at: "2021-12-19 16:29",
                //     remark: "",
                //     data: {},
                //     checked: false,
                // },
            ],

            per: 10,
            page: 1,
            total: 0,
            loading: false,

            checked: [],
            checkedAll: false,
            isIndeterminate: false,
        };
    },
    computed: {
        params() {
            return {
                page: this.page,
                per: this.per,
            };
        },
        isPostMode: function() {
            return !this.$route.query.mode || this.$route.query.mode == "default";
        },
        ready: function() {
            // 栏目启用 && 非新文 && 非草稿|历史版本模式
            return this.enable && this.postId && this.isPostMode;
        },
    },
    filters: {
        revisionName(val) {
            return `版本${val.version}`;
        },
        formatDate: function(gmt) {
            return showTime(new Date(gmt));
        },
    },
    methods: {
        formatRemark: function(str) {
            return str?.length > 10 ? str.slice(0, 10) + ".." : str;
        },
        view() {
            if (!this.postId) return;
            this.show = true;
            this.loadList();
        },
        loadList() {
            this.loading = true;
            getRevisions(this.postId, this.params)
                .then((res) => {
                    this.data = res.data.data.list.map((item) => {
                        this.$set(item, "checked", false);
                        return item;
                    });
                    this.page = res.data.data.page;
                    this.per = res.data.data.per;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        remark(item) {
            this.$prompt("请输入备注", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                inputValue: item.remark || "",
            }).then(({ value }) => {
                // item.remark = value
                putRevision(this.postId, item.id, { remark: value })
                    .then(() => {
                        this.$message.success("备注添加成功");
                        item.remark = value;
                        return true;
                    })
                    .catch(() => {
                        return false;
                    });
            });
        },
        checkChange(val, item) {
            if (val) {
                this.checked.push(item.id);
            } else {
                this.checked = this.checked.filter((c) => c !== item.id);
            }
            this.checkedAll = this.checked.length === this.data.length;
        },
        checkAll(val) {
            if (val) {
                this.checked = this.data.map((item) => item.id);
                this.data.map((item) => {
                    item.checked = true;
                    return item;
                });
            } else {
                this.checked = [];
                this.data.map((item) => {
                    item.checked = false;
                    return item;
                });
            }
            this.isIndeterminate = false;

            console.log(this.checked);
        },
        use(item) {
            const routeName = this.$route.name;
            this.$router.push(`/${routeName}/${item.post_id}/?mode=revision&id=${item.id}`);
        },
        del(item) {
            this.$confirm(`确认删除【版本-${item.version}】吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                removeRevision(this.postId, item.id).then(() => {
                    this.$notify({
                        type: "success",
                        title: "成功",
                        message: "历史版本删除成功",
                    });

                    this.loadList();
                });
            });
        },
        delRevisions() {
            this.$confirm(`确认删除选中的历史版本？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                const ids = this.checked.join(",");
                removeRevisions(this.postId, ids).then(() => {
                    this.$notify({
                        type: "success",
                        title: "成功",
                        message: "历史版本删除成功",
                    });

                    this.checkedAll = false;
                    this.checked = [];

                    if (this.page === 1) {
                        this.loadList();
                    } else {
                        this.page = 1;
                    }

                });
            });
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.loadList();
            },
        },
    },
};
</script>

<style lang="less">
.m-revision {
    // .pa;
    // .rt(0);
}
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

    .m-revision-list {
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

    .m-revision-item {
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
