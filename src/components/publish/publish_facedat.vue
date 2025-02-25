<template>
    <div class="m-publish-facedat">

        <el-divider content-position="left">① 数据</el-divider>
        <el-form-item label="数据">
            <input class="u-data-input" type="file" id="face_file" @change="processFile" accept=".jx3dat, .dat, .ini"/>
            <el-button type="primary" @click="selectData" icon="el-icon-upload2">上传脸型数据</el-button>
            <span class="u-data-ready" v-show="facedat.file">
                <i class="el-icon-success"></i>
                已上传
            </span>
        </el-form-item>

        <el-form-item label="分析结果">
            <el-input v-model="facedat.data" type="textarea" :rows="6" disabled></el-input>
        </el-form-item>

        <el-divider content-position="left">② 美图</el-divider>
        <el-form-item label="图册">
            <UploadAlbum v-model="facedat.pics"></UploadAlbum>
        </el-form-item>

        <el-divider content-position="left">③ 其它</el-divider>
        <el-form-item label="作者">
            <el-input v-model="facedat.author" placeholder="请注明原作者"></el-input>
        </el-form-item>

        <slot></slot>
    </div>
</template>

<script>
import lodash from "lodash";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import { load as parseFace } from "@jx3box/jx3box-facedat/src/DataRouter.js";
import { uploadFacedata } from "@/service/publish/share.js";
import {bodyMap} from '@jx3box/jx3box-facedat/assets/data/index.json'
// META空模板
const default_meta = {
    author: "", //原作者
    pics: [], //图片
    file: "", //文件
    data: "", //解析数据
};
export default {
    name: "publishFacedat",
    props: ["data", "client"],
    components: { UploadAlbum },
    data: function () {
        return {
            facedat: this.data,
            object : ''
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.facedat = lodash.cloneDeep(default_meta);
                } else {
                    this.facedat = newval;
                }
            },
        },
        facedat: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        "facedat.author": function (val) {
            this.$emit("updateMeta", { key: "meta_1", val: val });
        },
        "facedat.data" : function (val){
            let body_type = this.object.nRoleType
            this.$emit("updateMeta", { key: "post_subtype", val: bodyMap[body_type] });
        }
    },
    computed: {},
    methods: {
        // 数据
        selectData: function (i) {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadData(file) {
            // 上传源文件
            let formdata = new FormData();
            formdata.append("file", file);
            uploadFacedata(formdata).then((res) => {
                this.facedat.file = res.data.data[0];
                this.$message({
                    message: "上传成功",
                    type: "success",
                });
            });
        },
        processFile: function (e) {
            let file = e.target.files[0];
            if(file && file.size > 16384) {
                this.$message({
                    message: "文件过大，限 16KB 以内",
                    type: "error",
                });
                return;
            }
            // 解析并上传数据
            this.parseAndUpload(file);
        },
        // 解析数据
        parseAndUpload: function (file) {
            if (!FileReader) return;
            if (!file) return;
            const vm = this;

            // 读入 File 转 ArrayBuffer 进行读取
            let fr = new FileReader();
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");
                try {
                    vm.object = parseFace(e.target.result)?.data;
                    vm.json = JSON.stringify(vm.object);
                }
                catch(ex) {
                    console.log(ex);
                    vm.$notify.error({
                        title: "错误",
                        message: "无法读取数据",
                    });
                    vm.$emit("fail", {
                        file: vm.file,
                    });
                    return;
                }

                // 解析成功开始上传
                if (vm.object && vm.json) {
                    setTimeout(() => vm.$notify({
                            title: "成功",
                            message: "数据读取成功，开始上传",
                            type: "success",
                        }), 0);
                    vm.uploadData(file);
                    vm.done = true;
                    vm.$emit("success", {
                        file: vm.file,
                        json: vm.json,
                        object: vm.object,
                    });
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
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

