<template>
    <el-dialog class="w-dialog m-feedback-assign" v-model="show" :title="$t('dashboard.common.edit')" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('dashboard.common.client')" prop="client">
                <el-select v-model="form.client" :placeholder="$t('dashboard.common.clientPlaceholder')" style="width: 100%">
                    <el-option v-for="item in clients" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dashboard.common.type')" prop="type">
                <el-select v-model="form.type" :placeholder="$t('dashboard.common.typePlaceholder')" style="width: 100%">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dashboard.feedback.subtype')" prop="subtype">
                <el-select v-model="form.subtype" :placeholder="$t('dashboard.feedback.subtypePlaceholder')" style="width: 100%">
                    <el-option v-for="item in subtypeList" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
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
                client: [{ required: true, message: this.$t("dashboard.common.clientPlaceholder"), trigger: ["blur", "change"] }],
                type: [{ required: true, message: this.$t("dashboard.common.typePlaceholder"), trigger: ["blur", "change"] }],
                subtype: [{ required: true, message: this.$t("dashboard.feedback.subtypePlaceholder"), trigger: ["blur", "change"] }],
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
