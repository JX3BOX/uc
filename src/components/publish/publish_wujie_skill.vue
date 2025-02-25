<!-- 无界技能弹窗 -->
<template>
    <el-dialog
        :visible="modelValue"
        @close="onClose"
        title="添加技能"
        append-to-body
        custom-class="m-publish-wujie-skill"
    >
        <pvp-martial :subtype="subtype" :platform="platform" @selectSkill="selectSkill"></pvp-martial>
        <el-divider content-position="left">已选技能</el-divider>
        <div class="m-selected-skills">
            <ul class="m-skills-list" ref="selectedSkill">
                <li v-for="(skill, index) in selectedSkills" :key="skill.SkillID + '' + index" class="m-skill">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                    <i class="u-remove-icon" title="移除" @click="removeSelected(index)"
                        ><i class="el-icon-close"></i
                    ></i>
                </li>
            </ul>
        </div>

        <template #footer>
            <el-button @click="onClose">取 消</el-button>
            <el-button type="primary" @click="onConfirm">确 定</el-button>
        </template>
    </el-dialog>
</template>

<script>
import PvpMartial from "@/components/publish/pvp_martial.vue";
import { getMobileForceSkillList } from "@/service/publish/node";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import Sortable from "sortablejs";
import { cloneDeep, uniqBy } from "lodash";

export default {
    name: "publish_wujie_skill",
    components: {
        PvpMartial,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        subtype: {
            type: String,
            default: "通用",
        },
        platform: {
            type: String,
            default: "wujie",
        },
    },
    model: {
        prop: "modelValue",
        event: "change",
    },
    data() {
        return {
            wujie_data: {
                common: [],
                mount: [],
            },

            selectedSkills: [],
            max: 13,
        };
    },
    watch: {
        modelValue(val) {
            if (val) {
                this.$nextTick(() => {
                    this.initSortable();
                });
            }
        },
    },
    methods: {
        iconLink,
        onClose() {
            this.$emit("change", false);
            this.selectedSkills = [];
        },
        onConfirm() {
            const skills = this.selectedSkills?.map((item) => {
                return {
                    SkillID: item.SkillID,
                    Name: item.Name,
                    IconID: item.IconID,
                    Level: item.Level,
                };
            });
            this.$emit("selected", skills);
            this.onClose();
        },

        selectSkill(skill) {
            if (this.selectedSkills?.length >= this.max) {
                this.$message.warning(`最多只能选择${this.max}个技能`);
                return;
            }
            this.selectedSkills.push(skill);
        },
        removeSelected(index) {
            this.selectedSkills.splice(index, 1);
        },
        initSortable() {
            const el = this.$refs.selectedSkill;

            console.log(el);

            if (!el) return;
            const _this = this;
            const sortSkills = Sortable.create(el, {
                animation: 200,
                forceFallback: true,
                onEnd({ newIndex, oldIndex }) {
                    const newSkills = cloneDeep(_this.selectedSkills);
                    const [removed] = newSkills.splice(oldIndex, 1);
                    newSkills.splice(newIndex, 0, removed);
                    _this.selectedSkills = newSkills;
                },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/wujie_skill.less";
</style>
