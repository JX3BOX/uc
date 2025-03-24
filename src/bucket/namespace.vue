<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">剑三铭牌</h2>
            <a
                :href="publishLink"
                class="u-publish el-button el-button--primary el-button--small"
            >
                <i class="el-icon-document"></i> 创建铭牌
            </a>
        </div>

        <div class="m-namespace-box" v-loading="loading">
            <el-row
                class="m-namespace-list"
                :gutter="20"
                v-if="list && list.length"
            >
                <el-col :span="6" v-for="(item, i) in list" :key="i">
                    <div class="u-namespace-item">
                        <div class="u-item">
                            <div class="u-box">
                                <div class="u-title">
                                    <span
                                        class="el-icon-postcard u-icon"
                                    ></span>
                                    <a
                                        class="u-name"
                                        target="_blank"
                                        :href="item.link"
                                        >{{ item.key || "未知" }}</a
                                    >
                                </div>
                                <div class="u-desc">
                                    <span class="u-status u-desc-subitem">
                                        状态:
                                        <b :class="`status${item.status}`">{{
                                            statusmap[item.status]
                                        }}</b>
                                    </span>
                                    <time class="u-time u-desc-subitem"
                                        >创建于 :
                                        {{ item.created | dateFormat }}</time
                                    >
                                </div>
                            </div>
                            <el-button-group class="u-action">
                                <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="
                                        edit(
                                            item.ID,
                                            item.source_type,
                                            item.source_id
                                        )
                                    "
                                    title="编辑"
                                ></el-button>
                            </el-button-group>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            ></el-alert>
            <div class="m-namespace-pages">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                    :hide-on-single-page="true"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getNamespace } from "@/service/publish/namespace";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
const statusmap = {
    0: "待审核",
    1: "正常启用",
    2: "未通过审核",
};
export default {
    name: "bucket_namespace",
    props: ["data"],
    data: function () {
        return {
            loading: false,
            list: [],
            statusmap,
            per: 16,
            total: 1,
            page: 1,
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
        publishLink: function () {
            return "/publish/#/" + "namespace";
        },
    },
    methods: {
        edit: function (id, type, teamid) {
            if (type == "team") {
                location.href = "/team/org/edit/" + teamid + "?tab=other";
                return;
            }
            location.href = "/publish/#/namespace/" + id;
        },
        loadData: function () {
            this.loading = true;
            getNamespace(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function () {
        this.loadData();
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    components: {},
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
@import "~@/assets/css/publish/namespace.less";
.m-namespace-list {
    .mt(20px);
    .u-desc {
        .status0 {
            color: #fba524;
        }
        .status1 {
            color: #49c10f;
        }
        .status2 {
            color: #c00;
        }
    }
}
</style>
