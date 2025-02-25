<template>
    <el-dialog class="w-dialog m-feedback-assign" :visible.sync="show" :title="title" @close="close">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item v-if="type !== 'coordination'" label="指派至" prop="assign">
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
                            {{ `${item.teammate_info.display_name} ( ${item.user_id} ) - ${group[item.group]}` }}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else label="协同给" prop="coordination">
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
                            {{ `${item.teammate_info.display_name} ( ${item.user_id} ) - ${group[item.group]}` }}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="type !== 'coordination'" label="项目" prop="repository">
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
                assign: [{ required: true, message: "请选择指派人", trigger: ["blur", "change"] }],
                coordination: [{ required: true, message: "请选择协同人", trigger: ["blur", "change"] }],
            },
        };
    },
    computed: {
        title() {
            let title = "指派";
            if (this.type === "transfer") {
                title = "转交";
            }
            if (this.type === "coordination") {
                title = "协同";
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
                            this.$message.success("提交成功");
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
