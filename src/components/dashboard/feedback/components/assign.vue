<template>
    <el-dialog class="w-dialog m-feedback-assign" v-model="show" :title="title" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item v-if="type !== 'coordination'" :label="$t('dashboard.feedback.assignTo')" prop="assign">
                <el-select
                    v-model="form.assign"
                    multiple
                    class="u-select"
                    filterable
                    :filter-method="dataFilter"
                    style="width: 100%"
                >
                    <el-option
                        :label="item.teammate_info.display_name"
                        :value="item.user_id"
                        v-for="item in showTeams"
                        :key="item.id"
                    >
                        <div class="m-assign-user">
                            <img class="u-assign-avatar" :src="item.teammate_info.user_avatar" />
                            {{ `${item.teammate_info.display_name} ( ${item.user_id} ) - ${groupLabel(item.group)}` }}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else :label="$t('dashboard.feedback.coordinateWith')" prop="coordination">
                <el-select
                    v-model="form.coordination"
                    multiple
                    class="u-select"
                    filterable
                    :filter-method="dataFilter"
                    style="width: 100%"
                >
                    <el-option
                        :label="item.teammate_info.display_name"
                        :value="item.user_id"
                        v-for="item in showTeams"
                        :key="item.id"
                    >
                        <div class="m-assign-user">
                            <img class="u-assign-avatar" :src="item.teammate_info.user_avatar" />
                            {{ `${item.teammate_info.display_name} ( ${item.user_id} ) - ${groupLabel(item.group)}` }}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="type !== 'coordination'" :label="$t('dashboard.feedback.project')" prop="repository">
                <el-input
                    v-model="form.repository"
                    :placeholder="$t('dashboard.feedback.repositoryPlaceholder')"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('dashboard.common.remark')" prop="remark">
                <el-input
                    v-model="form.remark"
                    :placeholder="$t('dashboard.common.remarkPlaceholder')"
                    clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <div class="m-confirm">
                    <el-button @click="close">{{ $t("dashboard.common.cancel") }}</el-button>
                    <el-button type="primary" :loading="loading" :disabled="loading" @click="submit">
                        {{ $t("dashboard.common.submit") }}
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { assignMiscFeedback, transferMiscFeedback, coordinationMiscFeedback } from "@/service/dashboard/feedback";
import { cloneDeep, throttle } from "lodash";
const { group } = require("@/assets/data/dashboard/feedback.json");
export default {
    name: "FeedbackAssign",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        staged: {
            type: Object,
            required: true,
        },
        teams: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: "assign",
        },
    },
    emits: ["close", "update"],
    data() {
        return {
            loading: false,
            show: false,
            showTeams: [],
            form: {
                coordination: [],
                assign: [],
                remark: "",
                repository: "",
            },
            group,
            rules: {
                assign: [
                    {
                        required: true,
                        message: this.$t("dashboard.feedback.assigneeRequired"),
                        trigger: ["blur", "change"],
                    },
                ],
                coordination: [
                    {
                        required: true,
                        message: this.$t("dashboard.feedback.coordinatorRequired"),
                        trigger: ["blur", "change"],
                    },
                ],
            },
        };
    },
    computed: {
        title() {
            let title = this.$t("dashboard.feedback.assign");
            if (this.type === "transfer") {
                title = this.$t("dashboard.feedback.transfer");
            }
            if (this.type === "coordination") {
                title = this.$t("dashboard.feedback.coordinate");
            }
            return title;
        },
        id() {
            return this.staged.id;
        },
    },
    watch: {
        visible: {
            immediate: true,
            handler(bol) {
                this.show = bol;
                if (bol) {
                    this.showTeams = cloneDeep(this.teams);
                    if (this.type === "coordination") {
                        this.form.coordination = this.staged.coordination || [];
                    } else {
                        this.form.repository = this.staged.repository;
                        if (this.type === "transfer") {
                            this.form.assign = this.staged.assign;
                            this.form.remark = this.staged.remark;
                        }
                    }
                }
            },
        },
    },
    methods: {
        groupLabel(key) {
            const path = `dashboard.dataLabels.feedbackGroups.${key}`;
            return this.$te(path) ? this.$t(path) : group[key] || key;
        },
        close() {
            this.show = false;
            this.$emit("close", false);
            this.$refs.form?.resetFields();
        },
        dataFilter(query) {
            if (query) {
                this.showTeams = this.teams.filter((item) => {
                    const id = item.user_id + "";
                    return item.teammate_info.display_name.includes(query) || id.includes(query);
                });
            } else {
                this.showTeams = cloneDeep(this.teams);
            }
        },
        submit: throttle(function () {
            this.$refs.form.validate((valid, fields) => {
                if (valid) {
                    if (this.loading) return;
                    const data = cloneDeep(this.form);
                    this.loading = true;
                    let fn = assignMiscFeedback;
                    if (this.type === "transfer") {
                        fn = transferMiscFeedback;
                    }
                    if (this.type === "coordination") {
                        fn = coordinationMiscFeedback;
                        delete data.assign;
                        delete data.repository;
                    } else {
                        delete data.coordination;
                    }
                    fn(this.id, data)
                        .then(() => {
                            this.$message.success(this.$t("dashboard.common.submitSuccess"));
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
