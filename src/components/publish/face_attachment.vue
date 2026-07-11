<template>
    <div class="m-paid_attachment">
        <input class="u-data-input" type="file" id="face_file" @change="processFile" accept=".jx3dat, .dat, .ini" />
        <el-button type="primary" @click="selectData" icon="Upload">{{ $t("publish.face.uploadData", { type: name }) }}</el-button>
        <span class="u-data-ready" v-show="data.uuid">
            <i class="el-icon-success"></i>
            {{ $t("publish.common.uploaded") }}
        </span>
    </div>
</template>

<script>
import { uploadFaceFile } from "@/service/publish/face.js";
import { uploadBodyFile } from "@/service/publish/body.js";
import { load } from "@jx3box/jx3box-facedat/src/DataRouter.js";
export default {
    name: "paid_attachment",
    props: {
        body: {
            type: Number,
            default: 2,
        },
        describe: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "face",
        },
    },
    data() {
        return {
            data: {
                id: "",
                uuid: "",
                object: "",
                json: "",
                name: "",
            },
        };
    },
    computed: {
        name() {
            const data = {
                face: this.$t("publish.face.faceShape"),
                body: this.$t("publish.face.bodyShape"),
            };
            return data[this.type];
        },
    },
    methods: {
        selectData() {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadFile(formdata) {
            const data = {
                face: uploadFaceFile,
                body: uploadBodyFile,
            };
            return data[this.type](formdata);
        },
        uploadData(file) {
            // 上传源文件
            let formdata = new FormData();
            formdata.append("jx3dat", file);
            formdata.append("body", this.body);
            formdata.append("describe", this.describe);
            formdata.append("data", this.data.json);
            this.uploadFile(formdata).then((res) => {
                this.data.uuid = res.data.data.uuid;
                this.data.id = res.data.data.id;
                this.data.name = res.data.data.name;
                this.$message({
                    message: this.$t("publish.message.dataUploadSucceeded"),
                    type: "success",
                });
                this.$emit("update:data", this.data);
            });
        },
        processFile(e) {
            let file = e.target.files[0];
            // 大于64kb
            if (file && file.size > 65536) {
                this.$message({
                    message: this.$t("publish.upload.fileTooLarge64K"),
                    type: "error",
                });
                return;
            }
            // 解析并上传数据

            this.parseAndUpload(file);
            e.target.value = "";
        },
        parseAndUpload(file) {
            if (!FileReader) return;
            if (!file) return;
            const vm = this;

            // 读入 File 转 ArrayBuffer 进行读取
            let fr = new FileReader();
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");
                let json = "";
                let object = "";
                try {
                    const result = load(e.target.result);
                    if (!result)
                        return vm.$notify.error({
                            title: this.$t("publish.common.error"),
                            message: this.$t("publish.face.parseTypeFailed"),
                        });
                    if (vm.type === "body" && result.type.startsWith("face")) {
                        return vm.$notify.error({
                            title: this.$t("publish.common.error"),
                            message: this.$t("publish.face.importBodyData"),
                        });
                    }
                    if (vm.type === "face" && result.type === "body") {
                        return vm.$notify.error({
                            title: this.$t("publish.common.error"),
                            message: this.$t("publish.face.importFaceData"),
                        });
                    }
                    object = result.data;
                    console.log(object);
                    if (object) {
                        json = JSON.stringify(object);
                    }
                } catch (ex) {
                    console.log(ex);
                    vm.$notify.error({
                        title: this.$t("publish.common.error"),
                        message: this.$t("publish.upload.cannotReadData"),
                    });
                    return;
                }

                // 解析成功开始上传
                if (object && json) {
                    setTimeout(
                        () =>
                            vm.$notify({
                                title: this.$t("publish.common.success"),
                                message: this.$t("publish.upload.readSucceeded"),
                                type: "success",
                            }),
                        0
                    );
                    vm.data.json = json;
                    vm.uploadData(file);
                    vm.data.object = object;
                }
            };
            fr.onerror = function (e) {
                vm.$notify.error({
                    title: this.$t("publish.common.error"),
                    message: this.$t("publish.upload.readFailed"),
                });
            };
            fr.readAsArrayBuffer(file);
        },
        clearData() {
            this.data = {
                id: "",
                uuid: "",
                object: null,
                json: "",
                name: "",
            };
            this.$emit("update:data", this.data);
        },
    },
};
</script>

<style lang="less" scoped>
.m-paid_attachment {
    .u-data-input {
        display: none;
    }

    .u-data-ready {
        margin-left: 10px;
        i {
            color: #67c23a;
        }
    }
}
</style>
