<template>
    <div class="m-publish-pvp m-publish-macro">
        <el-divider content-position="left">{{ $t("publish.pvp.title") }}</el-divider>

        <div class="m-macro-box">
            <div class="m-macro-talent m-macro-item">
                <h5 class="u-title">{{ $t("publish.pvp.summary") }} *</h5>
                <el-input
                    v-model="pvpData.content"
                    :placeholder="$t('publish.pvp.summaryPlaceholder')"
                    type="textarea"
                    show-word-limit
                    maxlength="200"
                    :rows="5"
                    required
                >
                </el-input>
            </div>
            <el-checkbox class="u-talent" v-model="pvpData.has_talent" :true-value="1" :false-value="0"
                >{{ $t("publish.pvp.configureTalent") }}</el-checkbox
            >
            <template v-if="pvpData.has_talent">
                <div class="m-macro-talent m-macro-item" v-if="client != 'origin'">
                    <!-- <el-input v-model="pvpData.talent" placeholder="奇穴方案编码" @change="checkTalent(pvpData.talent)">
                        <template slot="prepend">
                            <a class="u-get" target="_blank" href="/macro/talent">
                                <i class="el-icon-warning"></i>
                                获取编码
                            </a>
                        </template>
                    </el-input> -->
                    <publish-qixue v-model="pvpData.talent" :subtype="subtype" :is-wujie="isWujie"></publish-qixue>
                </div>
                <div class="m-macro-talent m-macro-item" v-if="client === 'origin' && subtype !== '通用'">
                    <h5 class="u-title">{{ $t("publish.skill.legacyBuild") }}</h5>
                    <div class="m-macro-talent-simulator">
                        <div class="qx-container"></div>
                    </div>
                    <el-input v-model="pvpData.talent" :placeholder="$t('publish.skill.legacyCode')" @change="checkTalent(pvpData.talent)">
                        <template #prepend>
                            <a class="u-get" target="_blank" href="/macro/talent2">
                                <i class="el-icon-warning"></i>
                                {{ $t("publish.skill.getCode") }}
                            </a>
                        </template>
                    </el-input>
                </div>

                <div class="m-macro-talent m-macro-item" v-show="subtype !== '通用'">
                    <h5 class="u-title">{{ $t("publish.pvp.buildExplanation", { type: client === "std" ? $t("publish.skill.talents") : $t("publish.skill.legacy") }) }}</h5>
                    <el-input
                        v-model="pvpData.talent_desc"
                        :placeholder="$t('publish.common.optionalContentPlaceholder')"
                        type="textarea"
                        show-word-limit
                        maxlength="400"
                        :rows="4"
                    >
                    </el-input>
                </div>
            </template>
        </div>
        <el-checkbox class="u-talent" v-model="pvpData.has_sq" :true-value="1" :false-value="0">{{ $t("publish.pvp.configureCombos") }}</el-checkbox>
        <template v-if="pvpData.has_sq">
            <div class="m-macro-box">
                <div class="m-macro-header">
                    <el-button class="m-macro-addbutton" icon="CirclePlus" type="primary" @click="addCombo"
                        >{{ $t("publish.pvp.addCombo") }}</el-button
                    >
                </div>

                <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeCombo">
                    <el-tab-pane
                        v-for="(item, i) in pvpData.data"
                        :key="i"
                        :name="i + 1 + ''"
                        :class="`tab-content${i + 1}`"
                    >
                        <template #label
                            ><span class="u-tab-box">
                                <span class="u-tab-name" :title="item.name">{{
                                    $t("publish.pvp.comboTab", { index: i + 1, name: item.name })
                                }}</span>
                            </span></template
                        >
                        <el-form-item :label="$t('publish.pvp.comboName')" class="m-macro-desc">
                            <el-input
                                v-model="item.name"
                                :placeholder="$t('publish.pvp.comboNamePlaceholder')"
                                :minlength="1"
                                :maxlength="maxlength"
                                show-word-limit
                                @change="checkDataName(item)"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('publish.pvp.skillCombo')">
                            <div class="u-skills">
                                <template v-if="item.sq">
                                    <span
                                        v-for="(skill, index) in item.sq"
                                        :key="skill.SkillID + '' + index"
                                        class="u-skill"
                                        @contextmenu.prevent="(event) => onContextmenu(event, skill)"
                                    >
                                        <img
                                            class="u-skill-icon"
                                            :src="iconLink(skill.IconID)"
                                            :alt="skill.IconID"
                                            :title="skill.Name"
                                        />
                                        <i class="u-gcd-icon" v-show="skill.WithoutGcd">
                                            <i class="el-icon-time"></i>
                                        </i>
                                        <i class="u-remove-icon" :title="$t('publish.common.remove')" @click="removeSkill(index)"
                                            ><i class="el-icon-close"></i
                                        ></i>
                                    </span>
                                </template>
                            </div>
                            <el-button type="primary" class="u-add-skill" size="medium" @click="addSkill" icon="Plus"
                                >{{ $t("publish.skill.add") }}</el-button
                            >
                        </el-form-item>
                        <el-form-item :label="$t('publish.pvp.comboDescription')" class="m-macro-desc">
                            <el-input
                                v-model="item.desc"
                                type="textarea"
                                maxlength="200"
                                :rows="3"
                                show-word-limit
                                :placeholder="$t('publish.pvp.comboDescriptionPlaceholder')"
                            ></el-input>
                        </el-form-item>
                        <div class="m-macro-op">
                            <el-button
                                class="u-macro-remove-fix"
                                @click="removeCombo(i + 1)"
                                type="danger"
                                plain
                                icon="Delete"
                                >{{ $t("publish.pvp.removeCombo") }}</el-button
                            >
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </template>
        <slot></slot>

        <skillDialog
            v-model="showSkillDialog"
            @submit="onSubmit"
            :platform="isWujie ? 'wujie' : 'std'"
            :subtype="subtype"
        ></skillDialog>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { sterilizer } from "sterilizer/index.js";
import { __iconPath } from "@/utils/config";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import { cloneDeep, pick } from "lodash";
import SkillDialog from "@/components/publish/skill_dialog.vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import Sortable from "sortablejs";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import publish_qixue from "./publish_qixue.vue";
// META空模板
const default_meta = {
    talent: "",
    talent_desc: "",
    content: "",
    combo: [
        {
            name: "",
            sq: [],
            desc: "",
        },
    ],
    has_talent: 0,
    has_sq: 0,
};
export default {
    name: "publishPvp",
    props: {
        modelValue: {
            type: Object,
            default: undefined,
        },
        data: {
            type: Object,
            default: () => cloneDeep(default_meta),
        },
        client: {
            type: String,
            default: "std",
        },
        subtype: {
            type: String,
            default: "",
        },
        isWujie: {
            type: Number,
            default: 0,
        },
    },
    components: {
        SkillDialog,
        "publish-qixue": publish_qixue,
    },
    data: function () {
        return {
            maxlength: 20,
            pvpData: this.modelValue !== undefined ? this.modelValue : this.data,
            activeIndex: "1",
            nickname: User.getInfo().name,

            showSkillDialog: false,
            tabsSortable: null,
            skillSortable: null,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (newval !== undefined) {
                    if (!newval || isEmptyMeta(newval)) {
                        this.pvpData = cloneDeep(default_meta);
                    } else {
                        this.pvpData = newval;
                    }
                }
            },
        },
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (this.modelValue === undefined) {
                    if (!newval || isEmptyMeta(newval)) {
                        this.pvpData = cloneDeep(default_meta);
                    } else {
                        this.pvpData = newval;
                    }
                }
            },
        },
        pvpData: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        activeIndex: {
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    this.initSkillSort();
                });
            },
        },
        "pvpData.has_sq": {
            immediate: true,
            handler(val) {
                this.$nextTick(() => {
                    if (!val) {
                        this.destroySortables();
                        return;
                    }
                    this.initTabsSort();
                    this.initSkillSort();
                });
            },
        },
    },
    methods: {
        // 添加连招
        addCombo: function () {
            if (this.pvpData.data.length > 7) {
                this.$alert(this.$t("publish.message.limitReached"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            let index = this.pvpData.data.length + 1 + "";
            this.pvpData.data.push({
                name: "",
                sq: [],
                desc: "",
            });
            this.activeIndex = index;
            this.$nextTick(() => {
                this.initTabsSort();
                this.initSkillSort();
            });
        },
        // 删除宏
        removeCombo: function (name) {
            if (this.pvpData.data.length < 2) {
                this.$alert(this.$t("publish.pvp.keepOneCombo"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            this.$alert(this.$t("publish.pvp.confirmDeleteCombo"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.pvpData.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = "1";
                        this.$nextTick(() => {
                            this.initTabsSort();
                            this.initSkillSort();
                        });
                    }
                },
            });
        },
        // 检查版本名
        check: function () {
            this.pvpData.data.forEach((item, i) => {
                if (!item.name) {
                    item.name = this.$t("publish.common.generatedUntitled", { index: i });
                }
            });
        },
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            if (!name) {
                this.$notify.error({
                    title: this.$t("publish.common.error"),
                    message: this.$t("publish.pvp.invalidComboName"),
                });
                return;
            }
            data.name = name;
        },
        checkTalent: function (data) {
            try {
                JSON.parse(data);
            } catch (e) {
                this.$notify.error({
                    title: this.$t("publish.common.error"),
                    message: this.$t("publish.skill.invalidTalentCode"),
                });
            }
        },
        // 新增技能
        addSkill() {
            this.showSkillDialog = true;
        },
        // 移除技能
        removeSkill(index) {
            this.pvpData.data[this.activeIndex - 1].sq.splice(index, 1);
        },
        onSubmit(skill) {
            this.showSkillDialog = false;
            const _skill = skill.map((item) => pick(item, ["SkillID", "Name", "IconID"]));
            const sq = this.pvpData.data[this.activeIndex - 1].sq?.push(..._skill) || _skill;
        },
        iconLink,
        destroySortables() {
            this.tabsSortable?.destroy();
            this.skillSortable?.destroy();
            this.tabsSortable = null;
            this.skillSortable = null;
        },
        // 初始化技能排序
        initSkillSort() {
            const el = document.querySelector(`.tabs-sort .tab-content${this.activeIndex} .u-skills`);
            if (!el) return;
            this.skillSortable?.destroy();
            const _this = this;
            this.skillSortable = Sortable.create(el, {
                animation: 200,
                onEnd({ newIndex, oldIndex }) {
                    const data = cloneDeep(_this.pvpData.data[_this.activeIndex - 1].sq);
                    const currRow = cloneDeep(data.splice(oldIndex, 1)[0]);
                    data.splice(newIndex, 0, currRow);
                    _this.pvpData.data[_this.activeIndex - 1].sq = [];
                    _this.$nextTick(function () {
                        _this.pvpData.data[_this.activeIndex - 1].sq = data;
                    });
                },
            });
        },
        initTabsSort() {
            const el = document.querySelector(".tabs-sort .el-tabs__nav");
            if (!el) return;
            this.tabsSortable?.destroy();
            const _this = this;
            this.tabsSortable = Sortable.create(el, {
                animation: 200,
                filter: ".el-icon-close",
                onEnd({ newIndex, oldIndex }) {
                    const data = cloneDeep(_this.pvpData.data);
                    const currRow = cloneDeep(data.splice(oldIndex, 1)[0]);
                    data.splice(newIndex, 0, currRow);
                    _this.pvpData.data = [];
                    _this.$nextTick(function () {
                        _this.pvpData.data = data;
                        _this.$nextTick(() => {
                            _this.initTabsSort();
                            _this.initSkillSort();
                        });
                    });
                },
            });
        },
        onContextmenu(event, skill) {
            event.preventDefault();
            ContextMenu.showContextMenu({
                x: event.x ?? event.clientX,
                y: event.y ?? event.clientY,
                items: [
                    {
                        label: !skill?.WithoutGcd
                            ? this.$t("publish.skill.setNoGcd")
                            : this.$t("publish.skill.setGcd"),
                        onClick: () => {
                            skill.WithoutGcd = !skill.WithoutGcd;
                        },
                    },
                ],
                customClass: "custom-class",
                zIndex: 3,
                minWidth: 230,
            });
            return false;
        },
    },
    mounted: function () {
        this.$nextTick(() => {
            this.initTabsSort();
            this.initSkillSort();
        });
    },
    beforeUnmount() {
        this.destroySortables();
    },
};
</script>

<style lang="less">
.m-publish-pvp .m-macro-box {
    .u-skill .u-skill-icon {
        .size(48px);
    }
    .u-add-skill {
        margin-left: 10px;
    }
}
</style>
