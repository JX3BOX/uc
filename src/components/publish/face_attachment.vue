<template>
    <div class="m-paid_attachment">
        <input class="u-data-input" type="file" id="face_file" @change="processFile" accept=".jx3dat, .dat, .ini" />
        <el-button type="primary" @click="selectData" icon="el-icon-upload2">{{ `上传${name}数据` }}</el-button>
        <span class="u-data-ready" v-show="data.uuid">
            <i class="el-icon-success"></i>
            已上传
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
                face: "脸型",
                body: "体型",
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
                    message: "数据上传成功",
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
                    message: "文件过大，限 64KB 以内",
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
                            title: "错误",
                            message: "数据类型解析失败",
                        });
                    if (vm.type === "body" && result.type.startsWith("face")) {
                        return vm.$notify.error({
                            title: "错误",
                            message: "请导入体型数据",
                        });
                    }
                    if (vm.type === "face" && result.type === "body") {
                        return vm.$notify.error({
                            title: "错误",
                            message: "请导入脸型数据",
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
                        title: "错误",
                        message: "无法读取数据",
                    });
                    return;
                }

                // 解析成功开始上传
                if (object && json) {
                    setTimeout(
                        () =>
                            vm.$notify({
                                title: "成功",
                                message: "数据读取成功，开始上传",
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
                    title: "错误",
                    message: "文件读取异常",
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
