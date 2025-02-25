<template>
    <div class="m-publish-macro m-publish-tool-source">
        <el-divider content-position="left">资源</el-divider>

        <div class="m-macro-box m-tool-source-box">
            <div class="m-tool-source-header">
                <el-button
                    class="m-macro-addbutton"
                    icon="el-icon-circle-plus-outline"
                    type="primary"
                    @click="addSource"
                    >添加资源</el-button
                >
            </div>

            <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeSource">
                <el-tab-pane v-for="(item, i) in data.data" :key="i" :name="i + 1 + ''">
                    <span slot="label" class="u-tab-box">
                        <i class="el-icon-tickets u-tab-icon"></i>
                        <span class="u-tab-name" :title="item.name">{{ i + 1 + "号位-" + item.name }}</span>
                    </span>
                    <div class="m-source-name m-macro-item">
                        <h5 class="u-title">名称</h5>
                        <el-input v-model="item.name" placeholder="输入资源名称"></el-input>
                    </div>
                    <div class="m-source-mode m-macro-item">
                        <h5 class="u-title">模式</h5>
                        <el-radio-group v-model="item.mode" size="large">
                            <el-radio label="0" border>远程</el-radio>
                            <el-radio label="1" border>本地</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="m-source-file m-macro-item" v-if="item.mode == 1">
                        <h5 class="u-title">文件</h5>
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
                            <el-button type="primary" icon="el-icon-s-promotion" @click="selectSource(i)"
                                >上传文件</el-button
                            >
                            <span class="u-data-remark">{{ files[i] && files[i].name }}</span>
                            <div class="u-file" v-if="item.file">
                                <span class="u-file__label">当前文件下载：</span>
                                <span class="u-file__value"
                                    ><i class="el-icon-document"></i>{{ item.name || i + 1 + "号位" }}</span
                                >
                                <a :href="item.file" target="_blank"
                                    ><i class="el-icon-download u-file__download"></i
                                ></a>
                            </div>
                        </div>
                    </div>
                    <div class="m-source-file m-macro-item" v-if="item.mode == 0">
                        <h5 class="u-title">文件</h5>
                        <el-input v-model="item.file" placeholder="输入文件地址（例如网盘地址）"></el-input>
                    </div>
                    <div class="m-source-remark m-macro-item">
                        <h5 class="u-title">备注</h5>
                        <el-input
                            v-model="item.remark"
                            placeholder="输入备注（例如网盘密码）"
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
        value: {
            type: Object,
            default: () => {},
        },
    },
    model: {
        prop: "value",
        event: "update",
    },
    data() {
        return {
            data: this.value,
            activeIndex: "1",

            files: [],
        };
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler: function (val) {
                if (!val || isEmptyMeta(val)) {
                    this.data = lodash.cloneDeep(default_meta);
                } else {
                    this.data = val;

                    if (val?.down) {
                        this.data.data.map(item => {
                            item.mode = '1';
                            item.file = val.down || '';
                        })
                    }
                }
            },
        },
        data: {
            deep: true,
            handler(val) {
                this.$emit("update", val);
            },
        },
    },
    methods: {
        addSource() {
            if (this.data.data.length > 7) {
                this.$alert("已经达到添加上限", "消息", {
                    confirmButtonText: "确定",
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
                this.$alert("必须保留1个资源", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个资源吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
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
                    message: "上传成功",
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
/deep/.el-tabs__item {
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
