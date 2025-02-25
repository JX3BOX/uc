<template>
    <div class="m-jx3data-box">
        <el-button
            class="m-jx3dat-addbutton"
            icon="el-icon-circle-plus-outline"
            type="primary"
            @click="addLanren"
        >添加数据</el-button>
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="delLanren">
            <el-tab-pane
                v-for="(item, i) in lanrenDat.data"
                :key="i"
                :name="i + 1 + ''"
            >
                <span slot="label" class="m-jx3dat-tab-label">
                    <i class="el-icon-box"></i>
                    {{ item.lanren_type }}
                </span>
                <!-- 数据类型 -->
                <div class="m-jx3dat-item">
                    <h5 class="u-title">数据类型</h5>
                    <el-select v-model="item.key" @change="(val) => handleTypeChange(val, item)" i>
                        <el-option v-for="(type, key) in lanren_types" :key="key" :value="key" :label="type" />
                    </el-select>
                </div>
                <!-- 数据标题 -->
                <div class="m-jx3dat-item">
                    <h5 class="u-title">数据标题</h5>
                    <el-input
                        v-model="item.desc"
                        placeholder="数据描述"
                        :maxlength="50"
                        show-word-limit
                    ></el-input>
                </div>

                <div class="m-jx3dat-item m-jx3data-jx3dat">
                    <h5 class="u-title">数据文件</h5>
                    <div class="u-warning">
                        <i class="el-icon-warning-outline"></i>
                        当前数据文件将作为
                        <b>{{ item.lanren_type }}</b> 的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                    </div>
                    <input
                        class="u-data-input"
                        type="file"
                        :id="'lanren_' + i"
                        @change="uploadLanren(item, i)"
                    />
                    <el-button
                        type="primary"
                        icon="el-icon-s-promotion"
                        plain
                        size="small"
                        @click="selectLanren(i)"
                    >上传数据文件</el-button>
                    <span class="u-data-remark">{{item.origin_name}}</span>
                    <!-- <el-button
                        size="small"
                        type="primary"
                        plain
                        @click="uploadLaren(item, i)"
                        icon="el-icon-s-promotion"
                        >开始上传</el-button
                    >-->
                    <el-input
                        class="u-fileurl"
                        :class="{ isUploaded: item.isUploaded }"
                        @change="aniLanren(item)"
                        placeholder="数据地址"
                        :disabled="true"
                        :value="item.file"
                        v-if="item.file"
                    >
                        <template slot="prepend">
                            <span class="u-status">当前文件地址</span>
                        </template>
                        <template slot="append">
                            <span
                                class="u-copy"
                                v-clipboard:copy="item.file"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError"
                            >
                                <i class="el-icon-document-copy"></i>
                                <span>点击复制</span>
                            </span>
                        </template>
                    </el-input>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { uploadLanrenFile } from "@/service/publish/jx3dat.js";
// import { lanren_types } from "@jx3box/jx3box-common/data/lanren_types";
import cloneDeep from 'lodash/cloneDeep'
const now = Date.now()

const default_meta = {
    data: [
        {
            lanren_type: '副本数据',
            key: 'dungeon',
            desc: "",
            status: true,
            file: "",
            version: "", //已失效，由redis托管 -- 20210430小版本patch
            _version: now, //真实文件版本号 必须保证 _vesion 不为空
            // 源文件名
            origin_name: "",
            upload_status: false,
            pop: false,
        }
    ],
};

export default {
    name: "publish_lanren",
    props: ["data", "user", "type"],
    model: {
        prop: "data",
        event: "update-lanren",
    },
    data: () => ({
        activeTab: "1",
        lanrenDat: {},
        tabs: [],
        lanren_types:[]
    }),
    watch: {
        data: {
            immediate: true,
            handler(newval) {
                if (!newval || newval.data.length === 1) {
                    const [current] = newval.data
                    if (current.name === '默认版') {
                        this.lanrenDat = cloneDeep(default_meta);
                    }
                } else {
                    const [current] = newval.data
                    // 判断传进来的数据是否为lanren数据，懒人数据是有key的
                    if (current.key) {
                        this.lanrenDat = newval;
                        this.lanrenDat.data.forEach((item) => {
                            item.pop = false;
                            if(item._version === undefined){
                                item._version = item.version
                            }
                        });
                    } else {
                        this.lanrenDat = cloneDeep(default_meta);
                    }
                }
            },
        },
        lanrenDat: {
            deep: true,
            handler(val) {
                val.data.forEach(v => {
                    v._version = v._version || now
                })
                this.$emit('update-lanren', val)
            }
        },
    },
    methods: {
        selectLanren: function (i) {
            let fileInput = document.getElementById("lanren_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadLanren: function (item, i) {
            let fileInput = document.getElementById("lanren_" + i);
            let file = fileInput.files[0];
            if (!file) {
                this.$alert("请先选择文件", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }
            item.origin_name = file.name;

            let formdata = new FormData();
            formdata.append("jx3dat", file, "data.jx3dat");
            formdata.append("subtype", this.activeTab);
            uploadLanrenFile(formdata).then((res) => {
                if (res) {
                    item.file = res.data.download_url;
                    this.$message({
                        message: "数据上传成功",
                        type: "success",
                    });
                    item._version = Date.now();
                    item.upload_status = true;
                }
            });
        },
        addLanren: function() {
            this.lanrenDat.data.push({
                lanren_type: "副本数据",
                key: "dungeon",
                desc: "",
                status: true,
                file: "",
            })
        },
        delLanren: function(name) {
            if (name === '1') {
                this.$alert("✘ 必须有一个数据", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }
            if (this.lanrenDat.data.length < 2) {
                this.$alert("✘ 必须保留默认数据", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个数据吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.lanrenDat.data.splice(i, 1);
                        // 调整focus位置
                        this.activeTab = i + "";
                    }
                },
            });
        },
        /**
         * 数据类型变化
         * @param {string} val 数据类型
         * @param {object} item 该条目
         */
        handleTypeChange: function(val, item) {
            this.$set(item, 'lanren_type', lanren_types[val])
        },
        aniLanren: function (item) {
            item.isUploaded = true;
            setTimeout(() => {
                item.isUploaded = false;
            }, 2000);
        },
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: "复制成功",
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "复制失败",
            });
        },
    },
};
</script>

<style lang="less" scoped>
.m-jx3data-box {
    .m-lanren-header {
        margin-bottom: 10px;
    }
    .u-type-wrapper {
        margin-left: 20px;
    }
}
</style>
