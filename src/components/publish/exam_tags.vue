<template>
    <el-form-item :label="$t('publish.common.tags')">
        <div class="m-publish-exam-tags-list">
            <el-checkbox-group v-model="list">
                <div class="u-group">
                    <label class="el-checkbox"><span class="el-checkbox__label u-group-label">{{ $t("publish.exam.direction") }}</span></label>
                    <el-checkbox :value="game" v-for="game in options.game" :key="game">{{ optionLabel(game) }}</el-checkbox>
                </div>
                <div class="u-group">
                    <label class="el-checkbox"><span class="el-checkbox__label u-group-label">{{ $t("publish.exam.school") }}</span></label>
                    <el-checkbox :value="item" v-for="item in school" :key="item">{{ item }}</el-checkbox>
                </div>
                <div class="u-group">
                    <label class="el-checkbox"><span class="el-checkbox__label u-group-label">{{ $t("publish.exam.gameplay") }}</span></label>
                    <el-checkbox :value="play" v-for="play in options.play" :key="play">{{ optionLabel(play) }}</el-checkbox>
                </div>
                <div class="u-group">
                    <label class="el-checkbox"><span class="el-checkbox__label u-group-label">{{ $t("publish.exam.subject") }}</span></label>
                    <el-checkbox :value="subject" v-for="subject in options.subject" :key="subject">{{
                        optionLabel(subject)
                    }}</el-checkbox>
                </div>
                <div class="u-group">
                    <label class="el-checkbox"><span class="el-checkbox__label u-group-label">{{ $t("publish.exam.field") }}</span></label>
                    <el-checkbox :value="domain" v-for="domain in options.domain" :key="domain">{{
                        optionLabel(domain)
                    }}</el-checkbox>
                </div>
            </el-checkbox-group>
        </div>

        <!-- <div class="m-publish-exam-tags-custom">
        <el-tag
            :key="tag"
            v-for="tag in custom"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
        >
            {{ tag }}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
            :placeholder="$t('publish.form.tagsPlaceholder')"
        >
        </el-input>
        <el-button v-else class="button-new-tag"  @click="showInput"
            >+ {{ $t("publish.exam.addCustom") }}</el-button
        >
    </div> -->
    </el-form-item>
</template>

<script>
import examData from "@/assets/data/publish/exam.json";
const { tags} = examData;
import school from "@jx3box/jx3box-data/data/xf/forceid.json";
export default {
    name: "exam_tags",
    props: {
        modelValue: {
            type: Array,
            default: undefined,
        },
        tags: {
            type: Array,
            default: () => [],
        },
    },
    data: function () {
        return {
            options: tags,
            school,
            inputVisible: false,
            inputValue: "",
            list: this.modelValue !== undefined ? this.modelValue : this.tags,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.list = newval;
            }
        },
        tags: function (newval) {
            if (this.modelValue === undefined) {
                this.list = newval;
            }
        },
        list: function (newval) {
            this.$emit("update:modelValue", newval);
            this.$emit("update", newval);
        },
    },
    methods: {
        optionLabel(value) {
            const key = {
                副本: "dungeons",
                宠物: "pets",
                家园: "housing",
                奇遇: "adventures",
                成就: "achievements",
                阵营: "factions",
                野外: "openWorld",
                竞技场: "arena",
                切磋: "duels",
                吃鸡: "battleRoyale",
                语文: "language",
                数学: "mathematics",
                外语: "foreignLanguage",
                信息: "informationTechnology",
                物理: "physics",
                化学: "chemistry",
                生物: "biology",
                政治: "politics",
                历史: "history",
                地理: "geography",
                美术: "art",
                音乐: "music",
                体育: "physicalEducation",
                劳动: "labor",
                理综: "scienceComprehensive",
                文综: "humanitiesComprehensive",
                美容: "beauty",
                金融: "finance",
                医学: "medicine",
                法学: "law",
            }[value];
            return key ? this.$t(`publish.exam.options.${key}`) : value;
        },
        // TAG
        handleClose(tag) {
            this.custom.splice(this.custom.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.custom.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style scoped lang="less">
.u-group-label {
    .bold;
    background-color: #ebeef5;
    padding: 2px 10px;
    .r(2px);
}
</style>
