<template>
    <el-dialog class="w-dialog m-feedback-assign" :visible.sync="show" :title="title" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
import { switchMiscFeedback } from "@/service/dashboard/feedback";
import { cloneDeep, throttle, pick } from "lodash";
export default {
    name: "FeedbackStatus",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        staged: {
            type: Object,
            required: true,
        },
        isClose: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["close", "update"],
    data() {
        return {
            loading: false,
            show: false,
            rules: {},
            form: { status: "", remark: "", repository: "" },
        };
    },
    computed: {
        id() {
            return this.staged.id;
        },
        title() {
            let str = "";
            if (this.staged.status === 1) {
                str = "开始处理";
            }
            if (this.staged.status === 2) {
                str = "处理完成";
            }
            if (this.staged.status === 10 || this.staged.status === 11) {
                str = "结束工单";
            }
            if (this.staged.status === 2 && this.isClose) {
                str = "关闭工单";
            }
            return str;
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
        this.form.repository = this.staged.repository;
        if (this.staged.status === 1) {
            this.form.status = 2;
        }
        if (this.staged.status === 2) {
            this.form.status = 10;
        }
        if (this.staged.status === 10 || this.staged.status === 11) {
            this.form.status = 12;
        }
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
                    if (this.isClose) {
                        data.status = 11;
                    }
                    switchMiscFeedback(this.id, data)
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
