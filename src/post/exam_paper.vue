<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="剑三试卷" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <!-- <h1 class="m-publish-exam-header">制作试卷</h1> -->
        <el-form label-position="left" label-width="80px" class="m-publish-exam">
            <!-- 客户端 -->
            <publish-client v-model="primary.client"></publish-client>
            <el-form-item label="标题" class="m-publish-exam-title">
                <el-input
                    v-model="primary.title"
                    :maxlength="120"
                    :minlength="2"
                    show-word-limit
                    required
                    placeholder="请填写试卷标题"
                ></el-input>
            </el-form-item>
            <el-form-item label="描述" class="m-publish-exam-desc">
                <el-input
                    v-model="primary.desc"
                    :maxlength="200"
                    :minlength="2"
                    show-word-limit
                    required
                    :rows="3"
                    type="textarea"
                    placeholder="请填写试卷描述"
                ></el-input>
            </el-form-item>
            <el-form-item label="题目" class="m-publish-exam-common">
                <div>请设置10道题（每道题10分，满分100分），用半角逗号隔开，例如1,2,3</div>
                <el-input v-model="list" show-word-limit required placeholder="请填写题目ID序列"></el-input>
            </el-form-item>
            <el-form-item label="外链" class="m-publish-exam-common">
                <div>如果为外链地址，则设置的题目将不会生效</div>
                <el-input v-model="primary.iframe" show-word-limit required placeholder="请填写外链问卷地址">
                </el-input>
            </el-form-item>
            <el-form-item label="难度" class="m-publish-exam-level">
                <el-rate
                    v-model="primary.hardStar"
                    show-score
                    text-color="#ff9900"
                    score-template="{value} 星"
                ></el-rate>
            </el-form-item>
            <el-form-item label="风格" class="m-publish-exam-style">
                <el-select v-model="primary.style" placeholder="请选择封面风格">
                    <el-option
                        v-for="item in styles"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <exam_tags class="m-publish-exam-tags" v-model="primary.tags" />
            <!-- <el-form-item label="称谓" class="m-publish-exam-common" v-if="isSuper">
                <el-select v-model="primary.medalAward" placeholder="试卷称谓奖励">
                    <el-option label="无" value></el-option>
                    <el-option v-for="item in awards" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角标" class="m-publish-exam-common" v-if="isSuper">
                <el-select v-model="primary.corner" placeholder="试卷角标">
                    <el-option label="无" value></el-option>
                    <el-option v-for="item in marks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label class="m-publish-exam-content">
                <!-- <tinymce :content="primary.whyami" :height="400" />
                <upload class="u-editor-upload" />-->
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="publish"
                    :disabled="processing"
                    >发布试卷</el-button
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
import { awards, marks, styles } from "@/assets/data/publish/exam.json";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "exam_paper",
    props: [],
    data: function () {
        return {
            primary: {
                client: "std",
                title: "",
                desc: "",
                questionList: [],
                hardStar: 0,
                tags: [],
                corner: "",
                medalAward: "",
                style: "default",
                iframe: "",
            },
            list: "",
            isSuper: User.isEditor(),
            awards,
            marks,
            styles,
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
            this.processing = true;
            this.primary.questionList = this.checkList();
            if (!this.primary.questionList) return;
            if (this.id) {
                updatePaper(this.id, this.primary, this)
                    .then((res) => {
                        this.success(res);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                createPaper(this.primary, this)
                    .then((res) => {
                        this.success(res);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            }
        },
        success: function (res) {
            this.$message({
                message: res.data.msg || "提交成功",
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
                    this.primary = data;
                    this.primary.tags = JSON.parse(data.tags);
                    this.primary.questionList = JSON.parse(data.questionList);
                    this.list = this.primary.questionList.toString();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        checkList: function () {
            let list = this.list.split(",");
            if (list.length > 10 || !list.length) {
                this.$alert("请设置10道题，每道题10分，满分100分", "提醒", {
                    confirmButtonText: "确定",
                    callback: () => {
                        this.processing = false;
                    },
                });
                return false;
            } else {
                return list.map((val) => {
                    return ~~val;
                });
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
