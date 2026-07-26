<template>
    <div class="m-dashboard m-dashboard-work m-dashboard-other">
        <div class="m-dashboard-work-header m-namespace-header">
            <div class="u-heading">
                <span class="el-icon-postcard u-heading-icon"></span>
                <h2 class="u-title">{{ $t("publish.types.namespace") }}</h2>
            </div>
            <a :href="publishLink" class="u-publish el-button el-button--primary">
                <i class="el-icon-document"></i> {{ $t("publish.namespace.create") }}
            </a>
        </div>

        <div class="m-namespace-box">
            <ContentSkeleton v-if="loading" variant="cards" :rows="8" :columns="4" compact />
            <PublishListError v-else-if="loadError" @retry="loadData" />
            <el-row v-else-if="list && list.length" class="m-namespace-list" :gutter="20">
                <el-col :span="6" :xs="24" v-for="(item, i) in list" :key="i">
                    <div class="u-namespace-item">
                        <div class="u-item">
                            <div class="u-box">
                                <div class="u-title">
                                    <span class="el-icon-postcard u-icon"></span>
                                    <a class="u-name" target="_blank" :href="item.link">{{ item.key || $t("publish.common.unknown") }}</a>
                                </div>
                                <div class="u-desc">
                                    <span class="u-status u-desc-subitem">
                                        {{ $t("publish.common.status") }}:
                                        <el-tag :type="item.status == 1 ? 'success' : item.status == 2 ? 'warning' : 'info'" size="small">{{ statusmap[item.status] }}</el-tag>
                                    </span>
                                    <time class="u-time u-desc-subitem">{{ $t("publish.common.createdAt") }}: {{ dateFormat(item.created) }}</time>
                                </div>
                            </div>
                            <el-button-group class="u-action">
                                <el-button
                                    icon="Edit"
                                    @click="edit(item.ID, item.source_type, item.source_id)"
                                    :title="$t('publish.common.edit')"
                                    circle
                                    plain
                                ></el-button>
                            </el-button-group>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                :title="$t('publish.common.noResults')"
                type="info"
                center
                show-icon
            ></el-alert>
            <div v-if="!loading && !loadError" class="m-namespace-pages">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :page-size="per"
                    :total="total"
                    v-model:current-page="page"
                    :hide-on-single-page="true"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getNamespace } from "@/service/publish/namespace";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "bucket_namespace",
    props: ["data"],
    data: function () {
        return {
            loading: true,
            loadError: false,
            list: [],
            per: 16,
            total: 1,
            page: 1,
        };
    },
    computed: {
        statusmap: function () {
            return {
                0: this.$t("publish.status.pendingReview"),
                1: this.$t("publish.status.active"),
                2: this.$t("publish.status.rejected"),
            };
        },
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
            this.loadError = false;
            getNamespace(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .catch(() => {
                    this.loadError = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
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
    margin-top: 24px;

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

.m-namespace-header {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 88px;
    box-sizing: border-box;
    padding: 20px 22px;
    border: 1px solid #e4e8f5;
    border-radius: 12px;
    background: linear-gradient(115deg, #fafbff 0%, #f3f5ff 100%);
    box-shadow: 0 6px 20px rgba(48, 58, 112, 0.05);

    &::after {
        content: "";
        position: absolute;
        right: -42px;
        top: -70px;
        width: 190px;
        height: 190px;
        border-radius: 50%;
        background: rgba(79, 70, 229, 0.07);
    }

    .u-heading {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 13px;
    }

    .u-heading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 11px;
        background: linear-gradient(145deg, #6558ed, #4e4dda);
        box-shadow: 0 7px 16px rgba(78, 77, 218, 0.22);
        color: #fff;
        font-size: 21px;
    }

    .u-title {
        margin: 0;
        padding: 0;
        border: 0;
        color: #24283a;
        font-size: 22px;
        line-height: 1.4;
    }

    .u-publish {
        position: relative;
        z-index: 1;
        top: auto;
        right: auto;
        bottom: auto;
        left: auto;
        flex: none;
        border: 0;
        border-radius: 8px;
        box-shadow: 0 6px 14px rgba(78, 77, 218, 0.2);
    }
}

.m-namespace-box {
    .u-namespace-item {
        margin-bottom: 20px;
    }

    .u-item {
        position: relative;
        box-sizing: border-box;
        min-height: 132px;
        padding: 18px 16px 15px;
        border: 1px solid #e6e8ef;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 3px 12px rgba(35, 40, 65, 0.04);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

        &:hover {
            border-color: rgba(78, 77, 218, 0.28);
            box-shadow: 0 9px 24px rgba(45, 48, 90, 0.09);
            transform: translateY(-2px);
        }
    }

    .u-box {
        min-width: 0;
        width: 100%;
    }

    .u-title {
        display: flex;
        align-items: center;
        min-width: 0;
        padding-right: 38px;
        line-height: 1.5;
    }

    .u-icon {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        top: 0;
        width: 30px;
        height: 30px;
        margin-right: 9px;
        border-radius: 8px;
        background: #f0efff;
        color: #5652d9;
        font-size: 16px;
    }

    .u-name {
        overflow: hidden;
        color: #262a3a;
        font-size: 15px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.2s ease;

        &:hover {
            color: @v4primary;
        }
    }

    .u-desc {
        gap: 7px;
        margin-top: 14px;
        color: #9298a8;
        font-size: 12px;
        line-height: 1.6;
    }

    .u-status {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .el-tag {
        height: 22px;
        border: 0;
        border-radius: 5px;
        line-height: 22px;
    }

    .u-action {
        position: absolute;
        top: 14px;
        right: 14px;

        .el-button {
            width: 30px;
            height: 30px;
            padding: 0;
            border-color: #e6e8ef;
            color: #747b8d;

            &:hover,
            &:focus {
                border-color: #c9c7f5;
                background: #f2f1ff;
                color: @v4primary;
            }
        }
    }
}

.m-namespace-pages {
    padding-top: 24px;
}

@media screen and (max-width: @phone) {
    .m-namespace-header {
        min-height: 76px;
        padding: 16px;
        gap: 12px;

        .u-heading-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
        }

        .u-title {
            font-size: 19px;
        }
    }
}
</style>
