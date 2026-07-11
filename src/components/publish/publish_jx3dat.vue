<template>
    <div class="m-publish-jx3dat">
        <el-divider content-position="left">{{ $t("publish.common.data") }}</el-divider>
        <slot></slot>

        <!-- 团控数据类型字段 -->
        <template v-if="data_type == 1">
            <div class="m-jx3data-box">
                <div class="m-jx3dat-header">
                    <el-button class="m-jx3dat-addbutton" icon="CirclePlus" type="primary" @click="addDBM"
                        >{{ $t("publish.data.add") }}</el-button
                    >
                    <a class="m-jx3dat-help el-button el-button--success is-plain" href="/tool/13912" target="_blank">
                        <i class="el-icon-info"></i> {{ $t("publish.common.viewPublishHelp") }}
                    </a>
                </div>

                <el-tabs v-model="activeIndex" type="card" closable @tab-remove="delDBM">
                    <el-tab-pane v-for="(item, i) in jx3dats.data" :key="i" :name="i + 1 + ''">
                        <template #label
                            ><span class="m-jx3dat-tab-label">
                                <i class="el-icon-box"></i>
                                {{ item.name }}
                            </span></template
                        >
                        <div class="m-jx3dat-item">
                            <h5 class="u-title">{{ $t("publish.data.subscriptionName") }}</h5>
                            <div class="u-group">
                                <div class="u-subblock">
                                    <el-input
                                        v-model="item.name"
                                        :minlength="1"
                                        :maxlength="10"
                                        show-word-limit
                                        @change="checkDataName(item)"
                                        :disabled="i == 0"
                                        :placeholder="i == 0 ? $t('publish.data.defaultVersion') : $t('publish.data.versionName')"
                                    >
                                        <template #prepend>
                                            <b class="u-feed"
                                                >{{ user.name }}{{ item.name == "默认版" ? "" : "#" + item.name }}</b
                                            >
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
                                        :content="$t('publish.data.privateDownloadHint')"
                                        placement="top"
                                    >
                                        <span class="u-status">{{ item.status ? $t("publish.visibility.public") : $t("publish.visibility.privateShort") }}</span>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="m-jx3dat-item">
                            <h5 class="u-title">{{ $t("publish.data.title") }}</h5>
                            <el-input
                                v-model="item.desc"
                                :placeholder="$t('publish.data.description')"
                                :maxlength="50"
                                show-word-limit
                            ></el-input>
                        </div>
                        <div class="m-jx3dat-item m-jx3data-jx3dat">
                            <h5 class="u-title">{{ $t("publish.data.file") }}</h5>
                            <div class="u-warning">
                                <i class="el-icon-warning-outline"></i>
                                {{ $t("publish.data.uploadAsPrefix") }}
                                <b>{{ item.name }}</b
                                >{{ $t("publish.data.uploadAsSuffix") }}
                            </div>
                            <input class="u-data-input" type="file" :id="'jx3dat_' + i" @change="uploadDBM(item, i)" />
                            <el-button type="primary" icon="Promotion" plain @click="selectDBM(i)"
                                >{{ $t("publish.data.uploadFile") }}</el-button
                            >
                            <span class="u-data-remark">{{ item.origin_name }}</span>
                            <el-input
                                class="u-fileurl"
                                :class="{ isUploaded: item.isUploaded }"
                                @change="aniDBM(item)"
                                :placeholder="$t('publish.data.url')"
                                :disabled="true"
                                :value="item.file"
                                v-if="item.file"
                            >
                                <template #prepend>
                                    <span class="u-status">{{ $t("publish.data.currentUrl") }}</span>
                                </template>
                                <template #append>
                                    <span
                                        class="u-copy"
                                        v-clipboard:copy="item.file"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    >
                                        <i class="el-icon-document-copy"></i>
                                        <span>{{ $t("publish.common.clickToCopy") }}</span>
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
                    <span>{{ $t("publish.data.otherSubscriptions") }}</span>
                </div>
                <template v-if="moreFeedsVisible">
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.github" :placeholder="$t('publish.common.optional')">
                                <template #prepend>{{ $t("publish.data.githubSubscription") }}</template>
                                <template #append>@github</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.gitee" :placeholder="$t('publish.common.optional')">
                                <template #prepend>{{ $t("publish.data.giteeSubscription") }}</template>
                                <template #append>@gitee</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row class="u-tr">
                        <el-col :span="24">
                            <el-input v-model="jx3dats.aliyun" :placeholder="$t('publish.common.optional')">
                                <template #prepend>{{ $t("publish.data.aliyunSubscription") }}</template>
                                <template #append>@aliyun</template>
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
        <el-form-item v-else :label="$t('publish.common.data')" class="m-jx3dat-other">
            <input class="u-data-input" type="file" id="otherdata" @change="uploadDat" />
            <el-button type="primary" icon="Promotion" plain size="medium" @click="selectDat">{{ $t("publish.data.uploadFile") }}</el-button>
            <span class="u-data-remark">{{ jx3dats.origin_name }}</span>
            <el-input
                v-if="jx3dats.down"
                class="u-fileurl"
                :placeholder="$t('publish.data.url')"
                :disabled="true"
                :value="jx3dats.down"
            >
                <template #prepend>
                    <span class="u-status">{{ $t("publish.data.currentUrl") }}</span>
                </template>
                <template #append>
                    <span
                        class="u-copy"
                        v-clipboard:copy="jx3dats.down || ''"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    >
                        <i class="el-icon-document-copy"></i>
                        <span>{{ $t("publish.common.clickToCopy") }}</span>
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
import publish_lanren from "./publish_laren";
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
    props: {
        modelValue: {
            type: Object,
            default: undefined,
        },
        data: {
            type: Object,
            default: () => lodash.cloneDeep(default_meta),
        },
        type: {
            type: String,
            default: "",
        },
    },
    components: {
        "publish-lanren": publish_lanren,
    },
    data: function () {
        return {
            jx3dats: this.modelValue !== undefined ? this.modelValue : this.data,

            user: User.getInfo(),
            activeIndex: "1",
            moreFeedsVisible: false,

            tempname: "",
            isVIP: false,
            // 用于重置数据
            reload: true,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: {
            immediate: true,
            // deep: true,
            handler: function (newval) {
                if (newval !== undefined) {
                    if (!newval || isEmptyMeta(newval)) {
                        this.jx3dats = lodash.cloneDeep(default_meta);
                    } else {
                        this.jx3dats = newval;
                        this.jx3dats.data.forEach((item) => {
                            item.pop = false;
                            if (item._version === undefined) {
                                item._version = item.version;
                            }
                        });
                    }
                }
            },
        },
        data: {
            immediate: true,
            // deep: true,
            handler: function (newval) {
                if (this.modelValue === undefined) {
                    if (!newval || isEmptyMeta(newval)) {
                        this.jx3dats = lodash.cloneDeep(default_meta);
                    } else {
                        this.jx3dats = newval;
                        this.jx3dats.data.forEach((item) => {
                            item.pop = false;
                            if (item._version === undefined) {
                                item._version = item.version;
                            }
                        });
                    }
                }
            },
        },
        jx3dats: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
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
            return this.jx3dats && this.jx3dats.data && this.jx3dats.data.length + 1;
        },
    },
    methods: {
        // 上传DBM
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            data.name = name;
        },
        selectDBM: function (i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadDBM: function (item, i) {
            let fileInput = document.getElementById("jx3dat_" + i);
            let file = fileInput.files[0];
            if (!file) {
                this.$alert(this.$t("publish.upload.selectFileFirst"), this.$t("publish.common.reminder"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
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
                        message: this.$t("publish.message.dataUploadSucceeded"),
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
                    this.$t("publish.data.versionLimitHtml"),
                    this.$t("publish.common.message"),
                    {
                        dangerouslyUseHTMLString: true,
                    }
                );
                return;
            }

            this.jx3dats.data.push({
                name: this.$t("publish.data.generatedVersion", { index: this.totalVersions }),
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
                this.$alert(this.$t("publish.data.keepDefault"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            if (this.jx3dats.data.length < 2) {
                this.$alert(this.$t("publish.data.keepDefault"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            this.$alert(this.$t("publish.data.confirmDelete"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
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
                this.$alert(this.$t("publish.upload.selectFileFirst"), this.$t("publish.common.reminder"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
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
                    message: this.$t("publish.message.uploadSucceeded"),
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
                title: this.$t("publish.message.copySucceeded"),
                message: this.$t("publish.message.copySucceeded"),
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: this.$t("publish.message.copyFailed"),
                message: this.$t("publish.message.copyFailed"),
            });
        },
    },
    created: function () {
        User.isVIP().then((data) => {
            this.isVIP = data;
        });
    },
};
</script>
