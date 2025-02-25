<template>
    <el-dialog class="w-dialog m-feedback-assign" :visible.sync="show" title="编辑" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="客户端" prop="client">
                <el-select v-model="form.client" placeholder="请选择客户端" style="width: 100%">
                    <el-option v-for="item in clients" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="子类型" prop="subtype">
                <el-select v-model="form.subtype" placeholder="请选择子类型" style="width: 100%">
                    <el-option v-for="item in subtypeList" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目" prop="repository">
                <el-input v-model="form.repository" placeholder="请输入GitHub仓库" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <div class="m-confirm">
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" :loading="loading" :disabled="loading" @click="submit"> 提交 </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { updateFeedback } from "@/service/dashboard/feedback";
import { cloneDeep, throttle, pick } from "lodash";
const { filterOptions, types, subtypes } = require("@/assets/data/dashboard/feedback.json");
export default {
    name: "FeedbackEdit",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        staged: {
            type: Object,
            required: true,
        },
    },
    emits: ["close", "update"],
    data() {
        return {
            loading: false,
            show: false,
            form: { client: "", remark: "", repository: "", subtype: "", type: "" },
            clients: filterOptions.client,
            rules: {
                client: [{ required: true, message: "请选择客户端", trigger: ["blur", "change"] }],
                type: [{ required: true, message: "请选择类型", trigger: ["blur", "change"] }],
                subtype: [{ required: true, message: "请选择子类型", trigger: ["blur", "change"] }],
            },
        };
    },
    computed: {
        id() {
            return this.staged.id;
        },
        typeList() {
            return Object.entries(types).map(([key, value]) => {
                return {
                    text: value,
                    value: key,
                };
            });
        },
        subtypeList() {
            return Object.entries(subtypes).map(([key, value]) => {
                return {
                    text: value,
                    value: key,
                };
            });
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(bol) {
                this.show = bol;
            },
        },
    },
    mounted() {
        this.form = pick(this.staged, Object.keys(this.form));
    },
    methods: {
        close() {
            this.show = false;
            this.$emit("close", false);
            this.$refs.form?.resetFields();
        },
        submit: throttle(function () {
            this.$refs.form.validate((valid, fields) => {
                if (valid) {
                    if (this.loading) return;
                    const data = cloneDeep(this.form);
                    this.loading = true;
                    updateFeedback(this.id, data)
                        .then(() => {
                            this.$message.success("操作成功");
                            this.$emit("update");
                            this.close();
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                } else {
                    console.log("error submit!!!", fields);
                }
            });
        }, 500),
    },
};
</script>

<style lang="less">
.m-assign-user {
    .flex;
    align-items: center;
    gap: 10px;
    .u-assign-avatar {
        .size(18px);
        border-radius: 100%;
    }
}
</style>
