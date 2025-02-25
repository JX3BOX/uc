<template>
    <div class="m-publish-jx3dat">
        <el-divider content-position="left">数据</el-divider>
        <slot></slot>

        <!-- 团控数据类型字段 -->
        <template v-if="data_type == 1">
            <div class="m-jx3data-box">
                <div class="m-jx3dat-header">
                    <el-button
                        class="m-jx3dat-addbutton"
                        icon="el-icon-circle-plus-outline"
                        type="primary"
                        @click="addDBM"
                    >添加数据</el-button>
                    <a
                        class="m-jx3dat-help el-button el-button--success is-plain el-button--small"
                        href="/tool/13912"
                        target="_blank"
                    >
                        <i class="el-icon-info"></i> 点击查看发布帮助
                    </a>
                </div>

                <el-tabs v-model="activeIndex" type="card" closable @tab-remove="delDBM">
                    <el-tab-pane v-for="(item, i) in jx3dats.data" :key="i" :name="i + 1 + ''">
                        <span slot="label" class="m-jx3dat-tab-label">
                            <i class="el-icon-box"></i>
                            {{ item.name }}
                        </span>
                        <div class="m-jx3dat-item">
                            <h5 class="u-title">订阅名</h5>
                            <div class="u-group">
                                <div class="u-subblock">
                                    <el-input
                                        v-model="item.name"
                                        :minlength="1"
                                        :maxlength="10"
                                        show-word-limit
                                        @change="checkDataName(item)"
                                        :disabled="i == 0"
                                        :placeholder="i == 0 ? '默认版': '版本名称'"
                                    >
                                        <template slot="prepend">
                                            <b
                                                class="u-feed"
                                            >{{ user.name}}{{item.name =="默认版"? "": "#" +item.name}}</b>
                                        </template>
                                    </el-input>
                                </div>
                                <div class="u-subblock u-status-wrapper">
                                    <el-switch
                                        v-model="item.status"
                                        active-color="#49C10F"
                                        inactive-color="#ff4949"
                                    ></el-switch>

                                    <el-tooltip
                                        effect="dark"
                                        content="设置不公开后,仍然可以通过订阅名下载,仅不做展示"
                                        placement="top"
                                    >
                                        <span class="u-status">{{item.status? "公开": "私有"}}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
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
                                <b>{{ item.name }}</b>的文件上传，上传完后如若重新修改版本名称则需要重新上传对应文件
                            </div>
                            <input
                                class="u-data-input"
                                type="file"
                                :id="'jx3dat_' + i"
                                @change="uploadDBM(item, i)"
                            />
                            <el-button
                                type="primary"
                                icon="el-icon-s-promotion"
                                plain
                                size="small"
                                @click="selectDBM(i)"
                            >上传数据文件</el-button>
                            <span class="u-data-remark">{{item.origin_name}}</span>
                            <!-- <el-button
                                size="small"
                                type="primary"
                                plain
                                @click="uploadDBM(item, i)"
                                icon="el-icon-s-promotion"
                                >开始上传</el-button
                            >-->
                            <el-input
                                class="u-fileurl"
                                :class="{ isUploaded: item.isUploaded }"
                                @change="aniDBM(item)"
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
                        <!-- <div class="m-jx3dat-item">
                            <h5 class="u-title">弹窗提醒</h5>
                            <el-switch v-model="item.pop" active-color="#49C10F"></el-switch>
                            <span class="u-poptip">（默认不弹窗，小版本可由用户在下载面板自行选择是否更新）</span>
                        </div> -->
                        <!-- <div class="m-jx3data-item">
                            <h5 class="u-title">云数据ID</h5>
                            <el-input
                                placeholder="云数据ID"
                                :disabled="true"
                            >
                            </el-input>
                        </div>-->
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="m-jx3data-more">
                <div class="u-more" @click="toggleMoreFeed">
                    <i :class="moreFeedsVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                    <span>其它订阅号</span>
                </div>
                <template v-if="moreFeedsVisible">
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.github" placeholder="(非必填)">
                                <template slot="prepend">Github订阅号</template>
                                <template slot="append">@github</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.gitee" placeholder="(非必填)">
                                <template slot="prepend">Gitee订阅号</template>
                                <template slot="append">@gitee</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.aliyun" placeholder="(非必填)">
                                <template slot="prepend">Aliyun订阅号</template>
                                <template slot="append">@aliyun</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </template>
            </div>
        </template>

        <template v-else-if="data_type == 'lanren'">
            <publish-lanren :user="user" v-model="jx3dats" />
        </template>

        <!-- 其它类型上传字段 -->
        <el-form-item v-else label="数据" class="m-jx3dat-other">
            <input class="u-data-input" type="file" id="otherdata" @change="uploadDat" />
            <el-button
                type="primary"
                icon="el-icon-s-promotion"
                plain
                size="medium"
                @click="selectDat"
            >上传数据文件</el-button>
            <span class="u-data-remark">{{jx3dats.origin_name}}</span>
            <el-input
                v-if="jx3dats.down"
                class="u-fileurl"
                placeholder="数据地址"
                :disabled="true"
                :value="jx3dats.down"
            >
                <template slot="prepend">
                    <span class="u-status">当前文件地址</span>
                </template>
                <template slot="append">
                    <span
                        class="u-copy"
                        v-clipboard:copy="jx3dats.down || ''"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    >
                        <i class="el-icon-document-copy"></i>
                        <span>点击复制</span>
                    </span>
                </template>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
import { uploadHub, uploadData } from "@/service/publish/jx3dat.js";
import User from "@jx3box/jx3box-common/js/user";
import lodash from "lodash";
import { sterilizer } from "sterilizer/index.js";
import isEmptyMeta from "@/utils/isEmptyMeta.js";

// 引入 lanren 组件
import publish_lanren from './publish_laren';
// META空模板
const default_meta = {
    data: [
        {
            name: "默认版",
            desc: "",
            status: true,
            file: "",
            version: "", //已失效，由redis托管 -- 20210430小版本patch
            _version: "", //真实文件版本号
            // 源文件名
            origin_name: "",
            upload_status: false,
            pop: false,
        },
    ],
    github: "",
    gitee: "",
    aliyun: "",

    // 非团控数据
    down: "",
    origin_name: "",
};
export default {
    name: "publish_jx3dat",
    props: ["data", "type"],
    components: {
        'publish-lanren': publish_lanren
    },
    data: function () {
        return {
            jx3dats: this.data,

            user: User.getInfo(),
            activeIndex: "1",
            moreFeedsVisible: false,

            tempname: "",
            isVIP: false,
            // 用于重置数据
            reload: true
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            // deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.jx3dats = lodash.cloneDeep(default_meta);
                } else {
                    this.jx3dats = newval;
                    this.jx3dats.data.forEach((item) => {
                        item.pop = false;
                        if(item._version === undefined){
                            item._version = item.version
                        }
                    });
                }
            },
        },
        jx3dats: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        // 重置tab面板
        // data_type(nVal) {
        //     if (nVal !== 'lanren') {
        //         this.jx3dats = lodash.cloneDeep(default_meta);
        //     }
        // }
    },
    computed: {
        data_type: function () {
            return this.type;
        },
        totalVersions: function () {
            return (
                this.jx3dats &&
                this.jx3dats.data &&
                this.jx3dats.data.length + 1
            );
        },
    },
    methods: {
        // 上传DBM
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            this.$set(data, "name", name);
        },
        selectDBM: function (i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDBM: function (item, i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            let file = fileInput.files[0];
            if (!file) {
                this.$alert("请先选择文件", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }
            item.origin_name = file.name;

            let formdata = new FormData();
            formdata.append("jx3dat", file);
            formdata.append("version", item.name);
            uploadHub(formdata).then((res) => {
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
        addDBM: function () {
            // 目前设置最多3个版本
            if (this.jx3dats.data.length >= 3 && !this.isVIP) {
                this.$alert(
                    '默认只能设置3个版本，<a href="/vip/premium?from=jx3dat_feed" target="_blank">开通高级版账号</a>无限制',
                    "消息",
                    {
                        dangerouslyUseHTMLString: true,
                    }
                );
                return;
            }

            this.jx3dats.data.push({
                name: "版本" + this.totalVersions,
                desc: "",
                status: true,
                file: "",
            });

            let index = this.jx3dats.data.length + 1 + "";
            this.activeMacroIndex = index;
        },
        delDBM: function (name) {
            // this.jx3dats.data.splice(i, 1);

            if (name == 1) {
                this.$alert("✘ 必须保留默认数据", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            if (this.jx3dats.data.length < 2) {
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
                        this.jx3dats.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = i + "";
                    }
                },
            });
        },

        // 上传其他数据
        selectDat: function () {
            let fileInput = document.getElementById("otherdata");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDat: function (e) {
            let fileInput = document.getElementById("otherdata");
            let file = fileInput.files[0];
            if (!file) {
                this.$alert("请先选择文件", "提醒", {
                    confirmButtonText: "确定",
                });
                return;
            }

            // 显示原文件名
            this.jx3dats.origin_name = file.name;

            let formdata = new FormData();
            formdata.append("jx3dat", file);
            uploadData(formdata, this).then((res) => {
                this.jx3dats.down = res.data.data[0];

                this.$message({
                    message: "上传成功",
                    type: "success",
                });

                this.tempname = file.name;
            });
        },
        aniDBM: function (item) {
            item.isUploaded = true;
            setTimeout(() => {
                item.isUploaded = false;
            }, 2000);
        },
        toggleMoreFeed: function () {
            this.moreFeedsVisible = !this.moreFeedsVisible;
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
    filters: {},
    created: function () {
        User.isVIP().then((data) => {
            this.isVIP = data;
        });
    },
    // mounted: function () {
    //     if (!this.data || isEmptyMeta(this.data)) {
    //         this.jx3dats = lodash.cloneDeep(default_meta);
    //     } else {
    //         this.jx3dats = this.data;
    //         this.jx3dats.data.forEach((item) => {
    //             item.pop = false;
    //         });
    //     }
    // },
};
</script>
