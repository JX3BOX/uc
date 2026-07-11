<template>
    <el-dialog class="w-dialog m-feedback-assign" v-model="show" :title="title" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('dashboard.feedback.project')" prop="repository">
                <el-input v-model="form.repository" :placeholder="$t('dashboard.feedback.repositoryPlaceholder')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('dashboard.common.remark')" prop="remark">
                <el-input v-model="form.remark" :placeholder="$t('dashboard.common.remarkPlaceholder')" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <div class="m-confirm">
                    <el-button @click="close">{{ $t("dashboard.common.cancel") }}</el-button>
                    <el-button type="primary" :loading="loading" :disabled="loading" @click="submit"> {{ $t("dashboard.common.submit") }} </el-button>
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
                str = this.$t("dashboard.feedback.startProcessing");
            }
            if (this.staged.status === 2) {
                str = this.$t("dashboard.feedback.processingComplete");
            }
            if (this.staged.status === 10 || this.staged.status === 11) {
                str = this.$t("dashboard.feedback.endTicket");
            }
            if (this.staged.status === 2 && this.isClose) {
                str = this.$t("dashboard.feedback.closeTicket");
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
                            this.$message.success(this.$t("dashboard.common.operationSuccess"));
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
