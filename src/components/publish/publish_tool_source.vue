<template>
    <div class="m-publish-macro m-publish-tool-source">
        <el-divider content-position="left">{{ $t("publish.resource.title") }}</el-divider>

        <div class="m-macro-box m-tool-source-box">
            <div class="m-tool-source-header">
                <el-button class="m-macro-addbutton" icon="CirclePlus" type="primary" @click="addSource"
                    >{{ $t("publish.resource.add") }}</el-button
                >
            </div>

            <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeSource">
                <el-tab-pane v-for="(item, i) in data.data" :key="i" :name="i + 1 + ''">
                    <template #label>
                        <span class="u-tab-box">
                            <i class="el-icon-tickets u-tab-icon"></i>
                            <span class="u-tab-name" :title="item.name">{{ $t("publish.common.slotName", { index: i + 1, name: item.name }) }}</span>
                        </span>
                    </template>
                    <div class="m-source-name m-macro-item">
                        <h5 class="u-title">{{ $t("publish.common.name") }}</h5>
                        <el-input v-model="item.name" size="large" :placeholder="$t('publish.resource.namePlaceholder')"></el-input>
                    </div>
                    <div class="m-source-mode m-macro-item">
                        <h5 class="u-title">{{ $t("publish.resource.mode") }}</h5>
                        <el-radio-group v-model="item.mode" size="large">
                            <el-radio value="0" border>{{ $t("publish.resource.remote") }}</el-radio>
                            <el-radio value="1" border>{{ $t("publish.resource.local") }}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="m-source-file m-macro-item" v-if="item.mode == 1">
                        <h5 class="u-title">{{ $t("publish.common.file") }}</h5>
                        <div class="m-raw-file">
                            <!-- <div class="u-warning">
                                <i class="el-icon-warning-outline"></i>
                                当前文件将作为
                                <b> {{ item.name || i + 1 + "号位" }} </b>的文件上传。
                            </div> -->
                            <input
                                class="u-data-input"
                                type="file"
                                :id="'tool_' + i"
                                @change="(e) => uploadSource(e, i)"
                            />
                            <el-button type="primary" icon="Promotion" @click="selectSource(i)">{{ $t("publish.upload.file") }}</el-button>
                            <span class="u-data-remark">{{ files[i] && files[i].name }}</span>
                            <div class="u-file" v-if="item.file">
                                <span class="u-file__label">{{ $t("publish.resource.currentDownload") }}:</span>
                                <span class="u-file__value"
                                    ><i class="el-icon-document"></i>{{ item.name || $t("publish.common.slot", { index: i + 1 }) }}</span
                                >
                                <a :href="item.file" target="_blank"
                                    ><i class="el-icon-download u-file__download"></i
                                ></a>
                            </div>
                        </div>
                    </div>
                    <div class="m-source-file m-macro-item" v-if="item.mode == 0">
                        <h5 class="u-title">{{ $t("publish.common.file") }}</h5>
                        <el-input v-model="item.file" size="large" :placeholder="$t('publish.resource.urlPlaceholder')"></el-input>
                    </div>
                    <div class="m-source-remark m-macro-item">
                        <h5 class="u-title">{{ $t("publish.common.note") }}</h5>
                        <el-input
                            v-model="item.remark"
                            :placeholder="$t('publish.resource.notePlaceholder')"
                            :rows="3"
                            type="textarea"
                        ></el-input>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import lodash from "lodash";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import { upload } from "@/service/publish/cms";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
const default_meta = {
    data: [
        {
            name: "",
            mode: "0",
            file: "",
            remark: "",
        },
    ],
};
export default {
    name: "publish-tool-source",
    props: {
        modelValue: {
            type: Object,
            default: undefined,
        },
        value: {
            type: Object,
            default: () => {},
        },
    },
    emits: ["update", "update:modelValue"],
    data() {
        return {
            data: this.modelValue !== undefined ? this.modelValue : this.value,
            activeIndex: "1",

            files: [],
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler: function (val) {
                if (val !== undefined) {
                    if (!val || isEmptyMeta(val)) {
                        this.data = lodash.cloneDeep(default_meta);
                    } else {
                        this.data = val;

                        if (val?.down) {
                            this.data.data.map((item) => {
                                item.mode = "1";
                                item.file = val.down || "";
                            });
                        }
                    }
                }
            },
        },
        value: {
            immediate: true,
            deep: true,
            handler: function (val) {
                if (this.modelValue !== undefined) return;
                if (!val || isEmptyMeta(val)) {
                    this.data = lodash.cloneDeep(default_meta);
                } else {
                    this.data = val;

                    if (val?.down) {
                        this.data.data.map((item) => {
                            item.mode = "1";
                            item.file = val.down || "";
                        });
                    }
                }
            },
        },
        data: {
            deep: true,
            handler(val) {
                this.$emit("update:modelValue", val);
                this.$emit("update", val);
            },
        },
    },
    methods: {
        addSource() {
            if (this.data.data.length > 7) {
                this.$alert(this.$t("publish.message.limitReached"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }
            let index = this.data.data.length + 1 + "";
            this.data.data.push({
                name: "",
                mode: "0",
                file: "",
                remark: "",
            });
            this.activeIndex = index;
        },
        removeSource(name) {
            if (this.data.data.length < 2) {
                this.$alert(this.$t("publish.resource.keepOne"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            this.$alert(this.$t("publish.resource.confirmDelete"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.data.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = "1";
                    }
                },
            });
        },
        uploadSource(e, i) {
            let file = e.target.files[0];
            if (!file) return;
            this.files[i] = file;
            const formData = new FormData();
            formData.append("file", file);
            upload(formData).then((res) => {
                this.data.data[i].file = res.data.data[0];
                this.$message({
                    message: this.$t("publish.message.uploadSucceeded"),
                    type: "success",
                });
            });
        },
        selectSource(i) {
            document.getElementById("tool_" + i).click();
        },
        onDownload(item) {
            const url = item?.file;
            if (!url) return;
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = resolveImagePath(url);
            link.setAttribute("download", item.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
};
</script>

<style lang="less" scoped>
::v-deep(.el-tabs__item) {
    display: inline-flex;
    align-items: center;
}
.tabs-sort {
    .u-tab-box {
        display: inline-flex;
        align-items: center;
        .u-tab-name {
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: move;
        }
        .u-tab-icon {
            margin-right: 5px;
        }
    }
    .m-raw-file {
        .u-fileurl {
            .mt(10px);

            transition: 0.2s ease-in-out;
            &.isUploaded {
                border: 1px solid #49c10f;
                .r(4px);
            }
        }
        .u-data-input {
            .pointer;
            .none;
        }
        .u-data-remark {
            .fz(14px);
            .ml(5px);
        }
        .u-warning {
            .fz(12px);
            .mb(10px);
            b {
                color: #c00;
            }
            background-color: #fdf6ec;
            color: #f79401;
            padding: 10px;
            border-radius: 5px;
        }
        .u-file {
            line-height: 40px;
            font-size: 13px;
            .u-file__label {
                font-size: 13px;
            }
            .u-file__download {
                .pointer;
                &:hover {
                    color: @primary;
                }
            }
            i {
                margin: 0 4px 0 2px;
            }
        }
    }
}
</style>
