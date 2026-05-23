<template>
    <div class="m-add-feedback">
        <div class="type-box">
            <el-form inline class="m-type-form">
                <el-form-item label="来源">
                    <el-select v-model="form.type" placeholder="请选择问题来源" style="width:200px">
                        <el-option v-for="(value, key) in types" :key="key" :value="key" :label="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="form.subtype" placeholder="请选择问题类别" style="width:200px">
                        <el-option v-for="(value, key) in subtypes" :key="key" :value="key" :label="value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="m-content">
            <el-input
                v-model="form.content"
                type="textarea"
                :rows="10"
                placeholder="输入反馈内容"
                @paste="handlePaste"
            ></el-input>
        </div>
        <div class="m-feedback-actions">
            <div class="m-feedback-attachment">
                <div class="u-attachment-tip">支持图片和视频，单个文件最大 30MB，最多上传 {{ max }} 个附件</div>
                <el-upload
                    ref="upload"
                    class="u-upload avatar-uploader"
                    :action="url"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="remove"
                    :auto-upload="false"
                    :on-change="change"
                    :on-exceed="exceed"
                    :limit="max"
                    title="上传图片或视频"
                    with-credentials
                    accept="image/jpg, image/jpeg, image/gif, image/png, image/bmp, video/mp4, video/quicktime, video/webm, video/ogg, video/x-m4v"
                    multiple
                >
                    <template #file="{ file }">
                        <div class="u-upload-item" @click.stop="handlePictureCardPreview(file)">
                            <img v-if="!isVideoFile(file)" class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <div v-else class="u-upload-video">
                                <video class="u-upload-video__player" :src="file.url" muted preload="metadata"></video>
                                <i class="el-icon-video-play u-upload-video__icon"></i>
                            </div>
                        </div>
                    </template>
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" class="m-media-preview">
                    <video
                        v-if="dialogFileType === 'video'"
                        class="u-preview-video"
                        :src="dialogImageUrl"
                        controls
                        :autoplay="false"
                    ></video>
                    <img v-else width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </div>
            <div class="m-feedback-visible">
                <span class="u-label">是否公开：</span>
                <el-checkbox class="u-checkbox" :true-value="1" :false-value="0" v-model="form.public"></el-checkbox>
                <!-- <el-tooltip v-show="!canSubmit" content="必须先填写类型，子类和内容">
                    <i class="el-icon-question"></i>
                </el-tooltip> -->
            </div>
            <div class="m-feedback-btn">
                <el-button
                    class="u-submit"
                    icon="Promotion"
                    type="primary"
                    :disabled="!canSubmit"
                    @click="submit"
                    :loading="loading"
                    size="large"
                    >提交</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import feedbackData from "@/assets/data/dashboard/feedback.json";
const { types, subtypes } = feedbackData;
import { __cms } from "@/utils/config";
const API_Root = __cms;
const API = API_Root + "api/cms/upload";

import { feedback } from "@/service/dashboard/feedback";

export default {
    name: "AddFeedback",
    props: {
        max: {
            type: Number,
            default: 6,
        },
    },
    data() {
        return {
            types,
            subtypes,

            form: {
                type: "",
                subtype: "",
                content: "",
                public: 0,
            },
            url: API,
            imgs: [],
            uploadedMap: {},
            loading: false,
            dialogImageUrl: "",
            dialogFileType: "image",
            dialogVisible: false,
        };
    },
    computed: {
        canSubmit() {
            return this.form.type && this.form.subtype && this.form.content;
        },
        client() {
            return this.$store.state.client;
        },
        refer() {
            return this.$route.query?.refer ? decodeURIComponent(this.$route.query?.refer) : "";
        },
    },
    methods: {
        isVideoFile(file) {
            const type = file?.raw?.type || file?.type || "";
            if (type.startsWith("video/")) return true;
            return this.isVideoUrl(file?.url || file?.response?.data?.[0] || "");
        },
        isVideoUrl(url) {
            return /\.(mp4|mov|m4v|webm|ogg)(\?.*)?$/i.test(url || "");
        },
        validateFile(file) {
            const raw = file?.raw || file;
            const type = raw?.type || "";
            const size = raw?.size || 0;
            const isImage = type.startsWith("image/");
            const isVideo = type.startsWith("video/");

            if (!isImage && !isVideo) {
                this.$message.warning("仅支持上传图片或视频文件");
                return false;
            }

            if (size > 30 * 1024 * 1024) {
                this.$message.warning("单个附件大小不能超过 30MB");
                return false;
            }

            return true;
        },
        change(file) {
            if (!this.validateFile(file)) {
                this.$refs.upload?.handleRemove(file);
                return;
            }
            if (file.status === "success" || this.uploadedMap[file.uid]) return;
            const fdata = new FormData();
            fdata.append("file", file.raw);
            axios
                .post(API, fdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    auth: {
                        username: (localStorage && localStorage.getItem("token")) || "",
                        password: "cms common request",
                    },
                })
                .then((res) => {
                    if (res.data.code) {
                        this.$message.error(`[${res.data.code}]${res.data.msg}`);
                        return;
                    }
                    const imageUrl = res.data.data?.[0];
                    if (!imageUrl) {
                        this.$message.error("上传返回数据异常");
                        return;
                    }
                    this.uploadedMap[file.uid] = imageUrl;
                    this.imgs = [...this.imgs, imageUrl];
                    file.url = imageUrl;
                    file.name = file.name || imageUrl.split("/").pop();
                    file.status = "success";
                })
                .catch((err) => {
                    if (err?.response?.data?.code) {
                        this.$message.error(
                            `[${err.response.data.code}]${err.response.data.msg || err.response.data.message}`
                        );
                    } else {
                        this.$message.error("网络请求异常");
                    }
                });
        },
        // 附件上限
        exceed: function () {
            this.$message.warning(`上传的附件个数最多为${this.max}个`);
        },
        handlePictureCardPreview: function (file) {
            this.dialogImageUrl = file.url;
            this.dialogFileType = this.isVideoFile(file) ? "video" : "image";
            this.dialogVisible = true;
        },
        // 移除附件
        remove: function (file) {
            const imageUrl = this.uploadedMap[file?.uid] || file?.response?.data?.[0] || file?.url;
            this.imgs = this.imgs.filter((img) => img !== imageUrl);
            if (file?.uid) this.$delete(this.uploadedMap, file.uid);
        },
        async submit() {
            this.loading = true;
            const data = {
                ...this.form,
                images: this.imgs,
                client: this.client,
            };
            data.content = data.content.replace(/\n/g, "<br/>");
            feedback(data)
                .then((res) => {
                    this.$message.success("提交成功");
                    this.$refs.upload.clearFiles();
                    this.resetForm();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        resetForm() {
            this.form = this.$options.data().form;
            this.imgs = [];
            this.uploadedMap = {};
        },
        addFile(file) {
            if (!this.validateFile(file)) return false;
            if ((this.$refs.upload?.uploadFiles?.length || 0) >= this.max) {
                this.exceed();
                return false;
            }
            this.$refs.upload.handleStart(file);
            return false;
        },
        handlePaste(event) {
            const clipboardItems = event.clipboardData.items;
            for (let i = 0; i < clipboardItems.length; i++) {
                const item = clipboardItems[i];
                if (item.type.indexOf("image") !== -1) {
                    // 阻止默认粘贴图片的名字
                    event.preventDefault();
                    const blob = item.getAsFile();
                    const file = new File([blob], new Date().getTime() + "-" + blob.name, { type: blob.type });
                    this.addFile(file);
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.m-add-feedback {
    .type-box {
        .el-form-item {
            margin-bottom: 0;
        }
    }

    .m-content {
        margin-top: 20px;
    }
    .m-feedback-actions {
        // display: flex;
        align-items: flex-end;
        justify-content: space-between;
        // .clearfix;
        .mt(20px);
        // .mb(10px);
        .u-upload {
            .el-upload-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .el-upload--picture-card,
            .el-upload-list__item {
                height: 72px;
                width: 72px;
                line-height: 72px;
            }
            .el-icon-plus {
                .fz(16px);
            }
        }
        .u-attachment-tip {
            color: #909399;
            .fz(12px, 1.6);
            .mb(8px);
        }
        .u-upload-item {
            width: 100%;
            height: 100%;
            cursor: pointer;
            overflow: hidden;
        }
        .u-upload-video {
            position: relative;
            width: 100%;
            height: 100%;
            background: #111;
            &__player {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            &__icon {
                position: absolute;
                top: 50%;
                left: 50%;
                color: #fff;
                .fz(20px);
                transform: translate(-50%, -50%);
                text-shadow: 0 2px 8px rgb(0 0 0 / 35%);
            }
        }
    }
    .m-public {
        .mb(10px);
        .fr;

        .u-label {
            margin-right: 5px;
        }

        .u-checkbox {
            margin-right: 10px;
        }

        .u-submit {
            margin-left: 10px;
        }
    }
}
.m-feedback-visible{
    .fz(13px);
    .flex(y);
    justify-content: flex-end;
}
.m-feedback-visible,
.m-feedback-btn {
    .x(right);
    .mt(10px);
}
.m-feedback-btn .el-button {
    padding-left: 40px;
    padding-right: 40px;
}
.m-media-preview {
    .u-preview-video {
        width: 100%;
        max-height: 70vh;
        background: #000;
    }
}

@media screen and (max-width: @phone) {
    .m-add-feedback {
        .type-box {
            .el-form-item {
                margin-bottom: 10px;
            }
        }
        .m-feedback-actions {
            .u-upload {
                .el-upload--picture-card,
                .el-upload-list__item {
                    height: 64px;
                    width: 64px;
                    line-height: 64px;
                }
            }
        }
    }
}
</style>
