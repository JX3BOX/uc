<template>
    <div class="m-publish-box m-publish-box-emotion" v-loading="loading">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.emotes')"></publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 编辑 -->
            <div class="m-publish-emotion m-publish-emotion-edit" v-if="id">
                <el-form-item :label="$t('publish.common.image')">
                    <div class="u-pic" v-if="data && data.url">
                        <img class="u-img" :src="showThumbnail(data.url)" />
                        <i class="u-mask"></i>
                        <i class="u-preview" @click="previewHandle(data)">
                            <i class="el-icon-zoom-in"></i>
                        </i>
                    </div>
                    <div class="m-emotion-upload" v-show="!data.url">
                        <div v-if="data && data.url" class="u-emotion">
                            <img :src="data.url" />
                            <i class="u-emotion-mask"></i>
                            <i class="u-emotion-delete el-icon-delete" :title="$t('publish.common.remove')" @click="handleRemove"></i>
                        </div>
                        <div v-else class="u-upload el-upload el-upload--picture-card" @click="select">
                            <i class="el-icon-plus"></i>
                        </div>
                        <input class="u-upload-input" type="file" @change="upload" ref="uploadInput" />
                    </div>
                    <el-button v-if="data && data.url" class="u-remove-btn" icon="Delete" @click="removePic"
                        >{{ $t("publish.common.remove") }}</el-button
                    >
                </el-form-item>
                <el-form-item :label="$t('publish.common.description')">
                    <el-input v-model="data.desc" :maxlength="120" show-word-limit :placeholder="$t('publish.emotion.imageDescription')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('publish.common.category')">
                    <el-select v-model="data.type" :placeholder="$t('publish.emotion.schoolOptional')">
                        <el-option v-for="(item, i) in schoolmap" :key="i" :value="i" :label="item">
                            <div style="display: flex; align-items: center">
                                <img
                                    class="u-icon"
                                    style="margin-right: 20px"
                                    width="24"
                                    height="24"
                                    :src="showSchoolIcon(i)"
                                    :alt="item"
                                />
                                {{ item }}
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('publish.form.original')">
                    <el-switch v-model.number="data.original" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.form.originalAuthor')">
                    <el-input v-model="data.author" :placeholder="$t('publish.common.optional')"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <div class="m-publish-buttons">
                    <el-button type="primary" @click="update" :disabled="processing">{{ $t("publish.common.update") }}</el-button>
                </div>
            </div>

            <!-- 新建 -->
            <div class="m-publish-emotion m-publish-emotion-create" v-else>
                <!-- 上传 -->
                <div class="m-publish-emotion-bulk">
                    <h1 class="u-title">{{ $t("publish.emotion.upload") }}</h1>
                    <UploadEmotion
                        @insert="updateFileList"
                        :text="$t('publish.emotion.batchUpload')"
                        :onlyImage="true"
                        :desc="$t('publish.emotion.batchHint')"
                        :accept="supportTypes"
                        style="margin-top: 0"
                    />
                    <div class="u-tip"><i class="el-icon-info"></i> {{ $t("publish.emotion.formatHint") }}</div>
                </div>

                <!-- 列表 -->
                <div class="m-publish-emotion-list" v-if="list && list.length">
                    <div class="u-list">
                        <div class="u-item" v-for="(item, i) in list" :key="i">
                            <div class="u-div">
                                <i class="u-order">{{ i + 1 }}</i>
                                <div class="u-op">
                                    <el-button class="u-delete" icon="Delete" @click="deleteHandle(i)" type="info"
                                        >{{ $t("publish.common.delete") }}</el-button
                                    >
                                </div>
                            </div>
                            <div class="u-pic">
                                <img class="u-img" :src="showThumbnail(item.url)" />
                                <i class="u-mask"></i>
                                <i class="u-preview" @click="previewHandle(item)">
                                    <i class="el-icon-zoom-in"></i>
                                </i>
                            </div>
                            <div class="u-desc">
                                <el-input v-model="item.desc" :maxlength="120" show-word-limit :placeholder="$t('publish.emotion.imageDescription')">
                                    <template #prepend>{{ $t("publish.common.description") }}</template>
                                </el-input>
                            </div>
                            <div class="u-extend">
                                <el-switch
                                    v-model.number="item.original"
                                    :inactive-text="$t('publish.form.original')"
                                    :active-value="1"
                                    :inactive-value="0"
                                ></el-switch>
                                <el-input
                                    class="u-author"
                                    v-model="item.author"
                                    :placeholder="$t('publish.common.optional')"
                                    v-if="!item.original"
                                >
                                    <template #prepend>{{ $t("publish.form.originalAuthor") }}</template>
                                </el-input>
                                <el-select
                                    v-model="item.type"
                                    style="margin-left: 10px"
                                    :placeholder="$t('publish.emotion.schoolOptional')"
                                >
                                    <el-option v-for="(school, i) in schoolmap" :key="i" :value="i" :label="school">
                                        <div style="display: flex; align-items: center">
                                            <img
                                                class="u-icon"
                                                style="margin-right: 20px"
                                                width="24"
                                                height="24"
                                                :src="showSchoolIcon(i)"
                                                :alt="item"
                                            />
                                            {{ school }}
                                        </div>
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <!-- 按钮 -->
                    <div class="m-publish-buttons">
                        <el-button type="primary" @click="publish" :disabled="processing || !list.length">{{ $t("publish.common.publish") }}</el-button>
                    </div>
                </div>
            </div>
        </el-form>
        <!-- 预览 -->
        <el-dialog class="m-publish-emotion-preview" v-model="dialogVisible" :title="$t('publish.common.preview')">
            <img :src="dialogImageUrl" />
        </el-dialog>
    </div>
</template>

<script>
// 公共模块
import { getLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import schoolmap from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { __imgPath, __cdn } from "@/utils/config";

// 本地模块
import publish_header from "@/components/publish/publish_header.vue";
import UploadImages from "@jx3box/jx3box-editor/src/Upload.vue";
import UploadEmotion from "@/components/publish/upload_emotion.vue";

// 数据逻辑
import { postEmotions, getEmotion, updateEmotion, uploadEmotion } from "@/service/publish/pvx.js";

export default {
    name: "emotion",
    components: {
        // UploadImages,
        "publish-header": publish_header,
        UploadEmotion,
    },
    data: function () {
        return {
            // 加载状态
            loading: false,
            // 发布状态
            processing: false,

            schoolmap,

            // 图片类型
            supportTypes: "image/png, image/jpeg, image/gif, image/bmp, image/webp",

            // 图片列表
            list: [],
            data: {},

            // 预览
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
        fileInput: function () {
            return this.$refs.uploadInput;
        },
    },
    methods: {
        // 加载
        init: function () {
            this.loading = true;
            getEmotion(this.id)
                .then((res) => {
                    this.data = res?.data?.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 批量上传成功
        updateFileList: function (data) {
            let upload_list = data.list;
            let img_list = [];
            upload_list.forEach((item) => {
                if (item.is_img) {
                    img_list.push({
                        desc: item.name,
                        url: item.url,
                        original: 0,
                        author: "",
                        type: "",
                    });
                }
            });
            this.list = this.list.concat(img_list);
        },
        // 预览
        previewHandle: function (item) {
            this.dialogImageUrl = item.url;
            this.dialogVisible = true;
        },
        // 删除
        deleteHandle: function (i) {
            this.list.splice(i, 1);
        },
        // 发布
        publish: function () {
            if (!this.list.length) {
                this.$message({
                    message: this.$t("publish.validation.imageRequired"),
                    type: "warning",
                });
                return;
            }
            this.processing = true;
            postEmotions(this.list)
                .then((res) => {
                    this.$message({
                        message: this.$t("publish.message.submittedForReview"),
                        type: "success",
                    });
                    this.list = [];
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 更新
        update: function () {
            if (!this.data?.url) {
                this.$message({
                    message: this.$t("publish.validation.imageRequired"),
                    type: "warning",
                });
                return;
            }
            this.processing = true;
            updateEmotion(this.id, this.data)
                .then((res) => {
                    this.$message({
                        message: this.$t("publish.message.updatedForReview"),
                        type: "success",
                    });
                    // 跳转
                    setTimeout(() => {
                        location.href = getLink("emotion", this.id);
                    }, 500);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 单页 移除
        removePic: function () {
            this.data.url = "";
        },
        select: function () {
            this.fileInput.dispatchEvent(new MouseEvent("click"));
        },
        upload: function () {
            let formdata = new FormData();
            formdata.append("file", this.fileInput.files[0]);
            uploadEmotion(formdata).then((res) => {
                this.data.url = __cdn + res.data.data[0];
                this.$message({
                    message: this.$t("publish.message.uploadSucceeded"),
                    type: "success",
                });

                this.fileInput.files = [];
            });
        },
        handleRemove() {
            this.data.url = "";
        },
        showThumbnail: function (val) {
            return getThumbnail(val, 146);
        },
        showSchoolIcon: function (val) {
            return __imgPath + "image/school/" + val + ".png";
        },
    },
    watch: {
        "$route.params.id": {
            immediate: true,
            handler: function (val) {
                val && this.init();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/emotion.less";
</style>
