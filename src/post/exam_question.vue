<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.questions')" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <!-- <h1 class="m-publish-exam-header">贡献题目</h1> -->
        <el-form label-position="left" label-width="80px" class="m-publish-exam">
            <publish-client v-model="primary.client"></publish-client>
            <el-form-item :label="$t('publish.common.status')" class="m-publish-exam-common">
                <el-radio-group v-model="primary.is_public">
                    <el-radio :value="PUBLIC_VALUE">{{ $t("publish.visibility.public") }}</el-radio>
                    <el-radio :value="PRIVATE_VALUE">{{ $t("publish.visibility.privateShort") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.question')" class="m-publish-exam-title">
                <el-input
                    v-model="primary.title"
                    :maxlength="500"
                    :minlength="2"
                    show-word-limit
                    required
                    :rows="3"
                    type="textarea"
                    :placeholder="$t('publish.exam.questionPlaceholder')"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.questionType')" class="m-publish-exam-type">
                <el-radio-group v-model="primary.type">
                    <el-radio value="radio" border>{{ $t("publish.exam.singleChoice") }}</el-radio>
                    <el-radio value="checkbox" border>{{ $t("publish.exam.multipleChoice") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.optionsLabel')" class="m-publish-exam-options">
                <el-input :placeholder="$t('publish.exam.optionPlaceholder', { index: 1 })" v-model="primary.options[0]">
                    <template #prepend>A</template>
                </el-input>
                <el-input :placeholder="$t('publish.exam.optionPlaceholder', { index: 2 })" v-model="primary.options[1]">
                    <template #prepend>B</template>
                </el-input>
                <el-input :placeholder="$t('publish.exam.optionPlaceholder', { index: 3 })" v-model="primary.options[2]">
                    <template #prepend>C</template>
                </el-input>
                <el-input :placeholder="$t('publish.exam.optionPlaceholder', { index: 4 })" v-model="primary.options[3]">
                    <template #prepend>D</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.answer')" class="m-publish-exam-answer">
                <el-radio-group v-model="answer_radio" v-if="primary.type == 'radio'">
                    <el-radio :value="0">A</el-radio>
                    <el-radio :value="1">B</el-radio>
                    <el-radio :value="2">C</el-radio>
                    <el-radio :value="3">D</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="answer_checkbox" v-else>
                    <el-checkbox :value="0">A</el-checkbox>
                    <el-checkbox :value="1">B</el-checkbox>
                    <el-checkbox :value="2">C</el-checkbox>
                    <el-checkbox :value="3">D</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.difficulty')" class="m-publish-exam-level">
                <el-rate
                    v-model="primary.hardStar"
                    show-score
                    text-color="#ff9900"
                    :score-template="$t('publish.exam.starTemplate', { value: '{value}' })"
                ></el-rate>
            </el-form-item>

            <exam_tags class="m-publish-exam-tags" v-model="primary.tags" />

            <el-form-item :label="$t('publish.exam.explanation')" class="m-publish-exam-content">
                <Tinymce v-model="primary.whyami" :attachmentEnable="true" :resourceEnable="true" :height="400" />
                <el-button class="u-publish" icon="Promotion" type="primary" @click="publish" :disabled="processing"
                    >{{ $t("publish.exam.submitQuestion") }}</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish/publish_header.vue";
import publish_client from "@/components/publish/publish_client.vue";
import exam_tags from "@/components/publish/exam_tags.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import User from "@jx3box/jx3box-common/js/user";
import { getQuestion, createQuestion, updateQuestion } from "@/service/publish/exam";
import { getLink } from "@jx3box/jx3box-common/js/utils";
const DEFAULT_CLIENT = "std";
const PUBLIC_VALUE = 1;
const PRIVATE_VALUE = 0;

function getDefaultPrimary() {
    return {
        client: DEFAULT_CLIENT,
        is_public: PUBLIC_VALUE,
        title: "",
        type: "radio",
        options: ["", "", "", ""],
        answer: [],
        hardStar: 0,
        tags: [],
        whyami: "",
        pool: "common",
    };
}

function getFormPublic(isPublic) {
    return Number(isPublic) === PRIVATE_VALUE ? PRIVATE_VALUE : PUBLIC_VALUE;
}

function getSubmitData(primary) {
    const data = { ...primary };
    data.client = data.client || DEFAULT_CLIENT;
    data.is_public = getFormPublic(data.is_public);
    delete data.status;
    return data;
}

export default {
    name: "exam_question",
    props: [],
    data: function () {
        return {
            primary: getDefaultPrimary(),
            PUBLIC_VALUE,
            PRIVATE_VALUE,
            processing: false,
            loading: false,

            // 缓存答案
            answer_radio: "",
            answer_checkbox: [],
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
    },
    watch: {
        answer_radio: function (val) {
            this.primary.answer = [val];
        },
        answer_checkbox: function (val) {
            this.primary.answer = val;
        },
        "primary.answer": function (val) {
            if (this.primary.type == "radio") {
                this.answer_radio = val[0];
            } else {
                this.answer_checkbox = val;
            }
        },
    },
    methods: {
        publish: function () {
            this.processing = true;
            const data = getSubmitData(this.primary);
            const request = this.id ? updateQuestion(this.id, data) : createQuestion(data);
            request
                .then((res) => {
                    this.success(res);
                })
                .catch(() => {})
                .finally(() => {
                    this.processing = false;
                });
        },
        success: function (res) {
            this.$message({
                message: res.data.msg || this.$t("publish.message.submitSucceeded"),
                type: "success",
            });
            setTimeout(() => {
                location.href = getLink("question", this.id || res.data.data.id);
            }, 500);
        },
        loadData: function () {
            this.loading = true;
            getQuestion(this.id)
                .then((res) => {
                    let data = res.data;
                    this.primary = {
                        ...getDefaultPrimary(),
                        ...data,
                        client: data.client || DEFAULT_CLIENT,
                        is_public: getFormPublic(data.is_public),
                    };
                    this.primary.options = data.options ? JSON.parse(data.options) : ["", "", "", ""];
                    this.primary.tags = data.tags ? JSON.parse(data.tags) : [];
                    this.primary.answer = data.answerList || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    created: function () {
        if (this.id) {
            this.loadData();
        }
    },
    components: {
        "publish-header": header,
        Tinymce,
        exam_tags,
        "publish-client": publish_client,
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/exam.less";
</style>
