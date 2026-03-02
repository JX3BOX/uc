<template>
    <div class="m-add-feedback">
        <div class="type-box">
            <el-form inline>
                <el-form-item label="来源">
                    <el-select v-model="form.type" placeholder="请选择问题来源" size="small">
                        <el-option v-for="(value, key) in types" :key="key" :value="key" :label="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="form.subtype" placeholder="请选择问题类别" size="small">
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
                @paste.native="handlePaste"
            ></el-input>
        </div>
        <div class="m-feedback-actions">
            <div class="m-feedback-attachment">
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
                    title="上传图片"
                    with-credentials
                    accept="image/jpg, image/jpeg, image/gif, image/png, image/bmp"
                    size="small"
                    multiple
                >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </div>
            <div class="m-feedback-visible">
                <span class="u-label">是否公开：</span>
                <el-checkbox class="u-checkbox" :true-label="1" :false-label="0" v-model="form.public"></el-checkbox>
                <!-- <el-tooltip v-show="!canSubmit" content="必须先填写类型，子类和内容">
                    <i class="el-icon-question"></i>
                </el-tooltip> -->
            </div>
            <div class="m-feedback-btn">
                <el-button
                    class="u-submit"
                    icon="el-icon-s-promotion"
                    type="primary"
                    :disabled="!canSubmit"
                    @click="submit"
                    :loading="loading"
                    >提交</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { types, subtypes } from "@/assets/data/dashboard/feedback.json";
import { __cms } from "@/utils/config";
const API_Root = __cms
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
        change(file) {
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
                    this.$set(this.uploadedMap, file.uid, imageUrl);
                    this.imgs = [...this.imgs, imageUrl];
                    file.url = imageUrl;
                    file.status = "success";
                })
                .catch((err) => {
                    if (err?.response?.data?.code) {
                        this.$message.error(`[${err.response.data.code}]${err.response.data.msg || err.response.data.message}`);
                    } else {
                        this.$message.error("网络请求异常");
                    }
                });
        },
        // 图片上限
        exceed: function () {
            this.$message.warning(`上传的图片个数最多为${this.max}个`);
        },
        handlePictureCardPreview: function (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 移除图片
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
                    this.form = this.$options.data().form;
                    this.imgs = [];
                    this.uploadedMap = {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        addFile(file) {
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
            .el-upload--picture-card,
            .el-upload-list__item {
                height: 40px;
                width: 40px;
                line-height: 40px;
            }
            .el-icon-plus {
                .fz(16px);
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
.m-feedback-visible,
.m-feedback-btn {
    .x(right);
    .mt(10px);
}
.m-feedback-btn .el-button {
    padding-left: 40px;
    padding-right: 40px;
}
</style>
