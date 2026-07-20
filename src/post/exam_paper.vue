<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.papers')" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <!-- <h1 class="m-publish-exam-header">制作试卷</h1> -->
        <el-form label-position="left" label-width="80px" class="m-publish-exam">
            <!-- 客户端 -->
            <publish-client v-model="primary.client"></publish-client>
            <el-form-item :label="$t('publish.common.status')" class="m-publish-exam-common">
                <el-radio-group v-model="primary.is_public">
                    <el-radio :value="PUBLIC_VALUE">{{ $t("publish.visibility.public") }}</el-radio>
                    <el-radio :value="PRIVATE_VALUE">{{ $t("publish.visibility.privateShort") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('publish.common.title')" class="m-publish-exam-title">
                <el-input
                    v-model="primary.title"
                    :maxlength="120"
                    :minlength="2"
                    show-word-limit
                    required
                    :placeholder="$t('publish.exam.paperTitlePlaceholder')"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.common.description')" class="m-publish-exam-desc">
                <el-input
                    v-model="primary.desc"
                    :maxlength="200"
                    :minlength="2"
                    show-word-limit
                    required
                    :rows="3"
                    type="textarea"
                    :placeholder="$t('publish.exam.paperDescriptionPlaceholder')"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.question')" class="m-publish-exam-common">
                <div>{{ $t("publish.exam.paperQuestionsHint") }}</div>
                <el-input v-model="list" show-word-limit required :placeholder="$t('publish.exam.questionIdsPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.externalLink')" class="m-publish-exam-common">
                <div>{{ $t("publish.exam.externalLinkHint") }}</div>
                <el-input v-model="primary.iframe" show-word-limit required :placeholder="$t('publish.exam.externalLinkPlaceholder')">
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.difficulty')" class="m-publish-exam-level">
                <el-rate
                    v-model="primary.hardStar"
                    show-score
                    text-color="#ff9900"
                    :score-template="$t('publish.exam.starTemplate', { value: '{value}' })"
                ></el-rate>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.style')" class="m-publish-exam-style">
                <el-select v-model="primary.style" :placeholder="$t('publish.exam.stylePlaceholder')">
                    <el-option
                        v-for="item in styles"
                        :key="item.value"
                        :label="$t(`publish.exam.styles.${item.value}`)"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <exam_tags class="m-publish-exam-tags" v-model="primary.tags" />
            <!-- <el-form-item label="称谓" class="m-publish-exam-common" v-if="isSuper">
                <el-select v-model="primary.medalAward" :placeholder="$t('publish.exam.titleReward')">
                    <el-option :label="$t('publish.common.none')" value></el-option>
                    <el-option v-for="item in awards" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('publish.exam.badge')" class="m-publish-exam-common" v-if="isSuper">
                <el-select v-model="primary.corner" :placeholder="$t('publish.exam.badgePlaceholder')">
                    <el-option :label="$t('publish.common.none')" value></el-option>
                    <el-option v-for="item in marks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label class="m-publish-exam-content">
                <!-- <tinymce :content="primary.whyami" :height="400" />
                <upload class="u-editor-upload" />-->
                <el-button class="u-publish" icon="Promotion" type="primary" @click="publish" :disabled="processing"
                    >{{ $t("publish.exam.publishPaper") }}</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish/publish_header.vue";
import publish_client from "@/components/publish/publish_client.vue";
import exam_tags from "@/components/publish/exam_tags.vue";
import User from "@jx3box/jx3box-common/js/user";
import { getPaper, createPaper, updatePaper } from "@/service/publish/exam";
import examData from "@/assets/data/publish/exam.json";
import { getLink } from "@jx3box/jx3box-common/js/utils";
const { awards, marks, styles } = examData;
const DEFAULT_CLIENT = "std";
const PUBLIC_VALUE = 1;
const PRIVATE_VALUE = 0;

function getDefaultPrimary() {
    return {
        client: DEFAULT_CLIENT,
        is_public: PUBLIC_VALUE,
        title: "",
        desc: "",
        questionList: [],
        hardStar: 0,
        tags: [],
        corner: "",
        medalAward: "",
        style: "default",
        iframe: "",
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
    name: "exam_paper",
    props: [],
    data: function () {
        return {
            primary: getDefaultPrimary(),
            list: "",
            isSuper: User.isEditor(),
            awards,
            marks,
            styles,
            PUBLIC_VALUE,
            PRIVATE_VALUE,
            processing: false,
            loading: false,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
    },
    watch: {},
    methods: {
        publish: function () {
            const data = getSubmitData(this.primary);
            data.questionList = this.checkList();
            if (!data.questionList) return;
            data.title = data.title.trim();
            data.desc = data.desc.trim();
            if (data.title.length < 2 || data.desc.length < 2) {
                this.$message.warning(this.$t("publish.validation.completeRequired"));
                return;
            }
            this.processing = true;
            const request = this.id ? updatePaper(this.id, data) : createPaper(data);
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
                location.href = getLink("paper", this.id || res.data.data.id);
            }, 500);
        },
        loadData: function () {
            this.loading = true;
            getPaper(this.id, this)
                .then((res) => {
                    let data = res.data;
                    this.primary = {
                        ...getDefaultPrimary(),
                        ...data,
                        client: data.client || DEFAULT_CLIENT,
                        is_public: getFormPublic(data.is_public),
                    };
                    this.primary.tags = data.tags ? JSON.parse(data.tags) : [];
                    this.primary.questionList = data.questionList ? JSON.parse(data.questionList) : [];
                    this.list = this.primary.questionList.toString();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        checkList: function () {
            const list = this.list
                .split(",")
                .map((val) => val.trim())
                .filter(Boolean);
            const isValid =
                list.length >= 10 && list.length <= 100 && list.every((val) => /^\d+$/.test(val) && Number(val) > 0);
            if (!isValid) {
                this.$alert(this.$t("publish.exam.paperCountValidation"), this.$t("publish.common.reminder"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return false;
            } else {
                return list.map(Number);
            }
        },
    },
    created: function () {
        if (this.id) {
            this.loadData();
        }
    },
    components: {
        "publish-header": header,
        // upload,
        // tinymce,
        exam_tags,
        "publish-client": publish_client,
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/exam.less";
</style>
