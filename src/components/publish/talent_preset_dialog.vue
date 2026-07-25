<template>
    <el-dialog
        v-model="visible"
        class="m-talent-preset-dialog"
        :title="$t('publish.skill.presetDialogTitle')"
        width="760px"
        append-to-body
        :close-on-click-modal="false"
        @open="loadPresets"
    >
        <template #header>
            <div class="m-talent-preset-title">
                <span>{{ $t("publish.skill.presetDialogTitle") }}</span>
                <el-tag v-if="total" type="info" effect="plain" round>
                    {{ $t("publish.skill.presetCount", { count: total }) }}
                </el-tag>
            </div>
        </template>

        <div class="m-talent-preset-list">
            <el-table v-loading="loading" :data="presets" height="440">
                <el-table-column prop="name" :label="$t('publish.common.name')" min-width="250">
                    <template #default="{ row }">
                        <span class="u-preset-name" :title="row.name">{{ row.name || "-" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="xf" :label="$t('publish.skill.presetSchool')" min-width="140">
                    <template #default="{ row }">
                        <el-tag type="info" effect="plain" size="small">
                            {{ row.xf || row.code?.xf || "-" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="version" :label="$t('publish.skill.presetVersion')" min-width="140">
                    <template #default="{ row }">
                        <span class="u-preset-version">{{ formatVersion(row.version) }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" align="right">
                    <template #default="{ row }">
                        <el-button type="primary" plain size="small" icon="Check" @click="selectPreset(row)">
                            {{ $t("publish.skill.selectPreset") }}
                        </el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty :description="$t('publish.skill.noPresets')" :image-size="72"></el-empty>
                </template>
            </el-table>
        </div>

        <el-pagination
            v-if="total > per"
            class="m-talent-preset-pagination"
            background
            layout="prev, pager, next"
            :current-page="page"
            :page-size="per"
            :total="total"
            @current-change="changePage"
        ></el-pagination>
    </el-dialog>
</template>

<script>
import { getTalentPresets } from "@/service/publish/talent";

export default {
    name: "TalentPresetDialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        client: {
            type: String,
            default: "std",
        },
    },
    emits: ["update:modelValue", "select"],
    data() {
        return {
            loading: false,
            presets: [],
            page: 1,
            per: 10,
            total: 0,
        };
    },
    computed: {
        visible: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
        presetType() {
            return this.client === "origin" ? "talent2" : "talent";
        },
    },
    methods: {
        loadPresets() {
            this.loading = true;
            getTalentPresets({
                client: this.client === "origin" ? "origin" : "std",
                type: this.presetType,
                page: this.page,
                per: this.per,
            })
                .then((res) => {
                    const data = res?.data?.data || {};
                    this.presets = data.list || [];
                    this.page = Number(data.page) || 1;
                    this.per = Number(data.per) || 10;
                    this.total = Number(data.total) || 0;
                })
                .catch(() => {
                    this.presets = [];
                    this.total = 0;
                    this.$message.error(this.$t("publish.common.loadFailed"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage(page) {
            this.page = page;
            this.loadPresets();
        },
        formatVersion(version) {
            return String(version || "-").replace(/^v/i, "");
        },
        selectPreset(item) {
            if (this.client === "origin" && String(item.version || "").includes("v")) {
                this.$message.error(this.$t("publish.skill.unsupportedPresetVersion"));
                return;
            }
            const code = typeof item.code === "string" ? item.code : JSON.stringify(item.code || {});
            this.$emit("select", code);
            this.visible = false;
        },
    },
};
</script>

<style lang="less">
.m-talent-preset-dialog {
    --el-dialog-padding-primary: 24px;

    border-radius: 10px;
    overflow: hidden;

    .el-dialog__header {
        padding-bottom: 18px;
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__title {
        color: #303133;
        font-size: 20px;
        font-weight: 600;
    }
    .el-dialog__body {
        padding-top: 20px;
    }
    .m-talent-preset-title {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #303133;
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;

        .el-tag {
            font-size: 12px;
            font-weight: 400;
        }
    }
    .m-talent-preset-list {
        border: 1px solid #ebeef5;
        border-radius: 8px;
        overflow: hidden;

        .el-table {
            --el-table-header-bg-color: #f7f8fa;
            --el-table-row-hover-bg-color: #f7f6ff;
            --el-table-border-color: #ebeef5;
        }
        .el-table__header th {
            height: 44px;
            color: #909399;
            font-size: 13px;
            font-weight: 500;
        }
        .el-table__row td {
            height: 54px;
        }
        .el-table__cell {
            padding: 0;
        }
        .el-tag {
            max-width: 120px;
            border-color: #dedcfb;
            color: #6663a9;
            background-color: #f8f7ff;
        }
    }
    .u-preset-name {
        display: block;
        overflow: hidden;
        color: #303133;
        font-size: 14px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .u-preset-version {
        color: #606266;
        font-size: 13px;
        font-variant-numeric: tabular-nums;
    }
    .m-talent-preset-pagination {
        justify-content: center;
        margin-top: 18px;
    }

    @media screen and (max-width: 768px) {
        width: calc(100% - 32px) !important;
    }
}
</style>
