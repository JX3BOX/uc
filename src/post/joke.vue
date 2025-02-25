<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="剑三骚话"></publish-header>

        <Emotion class="m-publish-joke-emotion" @selected="handleEmotionSelect"></Emotion>

        <el-form label-position="left" label-width="80px">
            <el-form-item label="门派">
                <el-select v-model="data.type" placeholder="请选择门派">
                    <el-option v-for="s in schools" :key="s.value" :value="s.key" :label="s.value">
                        <span style="float: left;">{{ s.value }}</span>
                        <span style="float: right;">
                            <img :src="s.path" width="32" :alt="s.key" />
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="内容">
                <el-input
                    v-model="data.content"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入内容"
                    id="textarea"
                    :maxlength="128"
                    :minlength="1"
                    show-word-limit
                ></el-input>
            </el-form-item>

            <!-- <el-form-item label="标签">
                <div style="display: flex;margin-top:5px;">
                    <el-tag
                        v-for="tag in post.tags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                    >{{ tag }}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                </div>
            </el-form-item>-->

            <div class="m-publish-buttons">
                <el-button type="primary" @click="publish" :disabled="processing">发 &nbsp;&nbsp; 布</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import { getLink } from "@jx3box/jx3box-common/js/utils";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion.vue";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import schools from "@jx3box/jx3box-data/data/xf/schoolid.json";
import emotion from "@jx3box/jx3box-emotion/data/default.json";

// 本地模块
import publish_header from "@/components/publish/publish_header.vue";

// 数据逻辑
import { postJoke, updateJoke, getJoke } from "@/service/publish/pvx.js";

export default {
    name: "joke",
    components: {
        "publish-header": publish_header,
        Emotion,
    },
    data: () => ({
        // 加载状态
        loading: false,
        // 发布状态
        processing: false,

        inputVisible: false,
        inputValue: "",
        contentLength: 0,

        // 内容
        data: {
            type: "0",
            content: "",
        },

        // 门派
        schools: [],
    }),
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        publishAction: function () {
            return this.id ? updateJoke : postJoke;
        },
    },
    methods: {
        handleEmotionSelect(obj) {
            this.insertVariable(obj.key);
        },
        // handleClose(tag) {
        //     this.post.tags = this.post.tags.filter(t => t !== tag)
        // },
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.post.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        /**
         * add emotion to textarea
         * @parma {string} value emotion key
         */
        async insertVariable(value) {
            const myField = document.querySelector("#textarea");
            if (myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;

                this.data.content =
                    myField.value.substring(0, startPos) +
                    value +
                    myField.value.substring(endPos, myField.value.length);

                await this.$nextTick();

                myField.focus();
                myField.setSelectionRange(
                    endPos + value.length,
                    endPos + value.length
                );
            } else {
                this.data.content = value;
            }
        },
        formatSchool() {
            const arr = [];
            for (const [key, value] of Object.entries(schools)) {
                const obj = {
                    key,
                    value: String(value),
                    path: __imgPath + `image/school/${key}.png`,
                };
                arr.push(obj);
            }
            this.schools = arr;
        },
        // 加载
        init: function () {
            // 加载文章
            if (this.id) {
                this.loading = true;
                return getJoke(this.id)
                    .then((res) => {
                        this.data = res?.data?.data;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        // 发布
        publish: function () {
            if (!this.check()) return;

            this.processing = true;
            this.publishAction(this.data)
                .then((res) => {
                    let id = this.id || res?.data?.data?.id;
                    this.$message({
                        message: "发布成功,请等待审核",
                        type: "success",
                    });
                    // 跳转
                    setTimeout(() => {
                        location.href = getLink("joke", id);
                    }, 500);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 检查内容合法性
        // 纯数字 纯英文 纯汉字 纯符号长度均为128 表情个数限制在10个
        check: function () {
            // 表情 key
            const emotionKeys = Object.keys(emotion);

            let str = this.data.content.trim();

            const regex_1 = /(#[\u4e00-\u9fa5]{1})/g;
            const regex_2 = /(#[\u4e00-\u9fa5]{2})/g;
            const regex_3 = /(#[\u4e00-\u9fa5]{3})/g;

            if (!str.length) {
                this.$notify({
                    title: "错误",
                    message: "内容不能为空",
                    type: "error",
                });
                return false;
            }

            /**
             * 依次判定表情字符为1，2，3个的情况
             */
            const emotion_1 = str.match(regex_1)
                ? str
                      .match(regex_1)
                      .filter((emotion) => emotionKeys.includes(emotion))
                : [];

            emotion_1.forEach((emotion) => str.replace(emotion, ""));

            const emotion_2 = str.match(regex_2)
                ? str
                      .match(regex_2)
                      .filter((emotion) => emotionKeys.includes(emotion))
                : [];

            emotion_2.forEach((emotion) => str.replace(emotion, ""));

            const emotion_3 = str.match(regex_3)
                ? str
                      .match(regex_3)
                      .filter((emotion) => emotionKeys.includes(emotion))
                : [];

            emotion_3.forEach((emotion) => str.replace(emotion, ""));

            const emotionLength =
                emotion_1.length + emotion_2.length + emotion_3.length;

            this.contentLength = emotionLength;

            if (emotionLength > 10) {
                this.$notify({
                    title: "错误",
                    message: "表情个数不能超过10个",
                    type: "error",
                });
                return false;
            }

            // 纯数字 128 纯文字 64
            const textLength = str.match(/[^\x00-\xff]/g)?.length || 0;

            if (textLength * 2 + (str.length - textLength) > 128) {
                this.$notify({
                    title: "错误",
                    message: "内容长度不能超过128个字符",
                    type: "error",
                });
                return false;
            }
            return true;
        },
    },
    created() {
        this.init();
        this.formatSchool();
    },
    watch: {
        "$route.params.id": function (val) {
            val && this.init();
        },
    },
};
</script>

<style lang="less" scoped>
.m-publish-joke-emotion {
    max-height: 168px;
    overflow: auto;
}
.el-tag {
    margin-right: 10px;
}
.button-new-tag {
    // margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
