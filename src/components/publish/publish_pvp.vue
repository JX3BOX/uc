<template>
    <div class="m-publish-pvp m-publish-macro">
        <el-divider content-position="left">技巧分享</el-divider>

        <div class="m-macro-box">
            <div class="m-macro-talent m-macro-item">
                <h5 class="u-title">技巧概述 *</h5>
                <el-input
                    v-model="pvpData.content"
                    placeholder="请在此处输入技巧概述，最多200个字。"
                    type="textarea"
                    show-word-limit
                    maxlength="200"
                    :rows="5"
                    required
                >
                </el-input>
            </div>
            <el-checkbox class="u-talent" v-model="pvpData.has_talent" :true-label="1" :false-label="0"
                >设置奇穴</el-checkbox
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
                    <h5 class="u-title">镇派方案</h5>
                    <div class="m-macro-talent-simulator">
                        <div class="qx-container"></div>
                    </div>
                    <el-input v-model="pvpData.talent" placeholder="镇派方案编码" @change="checkTalent(pvpData.talent)">
                        <template slot="prepend">
                            <a class="u-get" target="_blank" href="/macro/talent2">
                                <i class="el-icon-warning"></i>
                                获取编码
                            </a>
                        </template>
                    </el-input>
                </div>

                <div class="m-macro-talent m-macro-item" v-show="subtype !== '通用'">
                    <h5 class="u-title">{{ client === "std" ? "奇穴" : "镇派" }}讲解</h5>
                    <el-input
                        v-model="pvpData.talent_desc"
                        placeholder="输入内容（选填）"
                        type="textarea"
                        show-word-limit
                        maxlength="400"
                        :rows="4"
                    >
                    </el-input>
                </div>
            </template>
        </div>
        <el-checkbox class="u-talent" v-model="pvpData.has_sq" :true-label="1" :false-label="0">设置连招</el-checkbox>
        <template v-if="pvpData.has_sq">
            <div class="m-macro-box">
                <div class="m-macro-header">
                    <el-button
                        class="m-macro-addbutton"
                        icon="el-icon-circle-plus-outline"
                        type="primary"
                        @click="addCombo"
                        >添加连招</el-button
                    >
                </div>

                <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeCombo">
                    <el-tab-pane
                        v-for="(item, i) in pvpData.data"
                        :key="i"
                        :name="i + 1 + ''"
                        :class="`tab-content${i + 1}`"
                    >
                        <span slot="label" class="u-tab-box">
                            <span class="u-tab-name" :title="item.name">{{
                                "连招" + zhNum[i] + " - " + item.name
                            }}</span>
                        </span>
                        <el-form-item label="连招名称" class="m-macro-desc">
                            <el-input
                                v-model="item.name"
                                placeholder="请输入连招名称"
                                :minlength="1"
                                :maxlength="maxlength"
                                show-word-limit
                                @change="checkDataName(item)"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="技能连招">
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
                                        <i class="u-remove-icon" title="移除" @click="removeSkill(index)"
                                            ><i class="el-icon-close"></i
                                        ></i>
                                    </span>
                                </template>
                            </div>
                            <el-button type="primary" size="medium" @click="addSkill" icon="el-icon-plus"
                                >新增技能</el-button
                            >
                        </el-form-item>
                        <el-form-item label="连招说明" class="m-macro-desc">
                            <el-input
                                v-model="item.desc"
                                type="textarea"
                                maxlength="200"
                                :rows="3"
                                show-word-limit
                                placeholder="连招简要说明（选填）"
                            ></el-input>
                        </el-form-item>
                        <div class="m-macro-op">
                            <el-button
                                class="u-macro-remove-fix"
                                @click="removeCombo(i + 1)"
                                type="danger"
                                plain
                                icon="el-icon-delete"
                                size="small"
                                >移除本连招</el-button
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
    props: ["data", "client", "subtype", "isWujie"],
    components: {
        SkillDialog,
        "publish-qixue": publish_qixue,
    },
    data: function () {
        return {
            maxlength: 20,
            pvpData: this.data,
            activeIndex: "1",
            nickname: User.getInfo().name,

            zhNum: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
            showSkillDialog: false,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.pvpData = cloneDeep(default_meta);
                } else {
                    this.pvpData = newval;
                }
            },
        },
        pvpData: {
            deep: true,
            handler: function (newval) {
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
    },
    methods: {
        // 添加连招
        addCombo: function () {
            if (this.pvpData.data.length > 7) {
                this.$alert("已经达到添加上限", "消息", {
                    confirmButtonText: "确定",
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
        },
        // 删除宏
        removeCombo: function (name) {
            if (this.pvpData.data.length < 2) {
                this.$alert("必须保留1个连招", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个连招吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.pvpData.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = "1";
                    }
                },
            });
        },
        // 检查版本名
        check: function () {
            this.pvpData.data.forEach((item, i) => {
                if (!item.name) {
                    item.name = "未标题-" + i;
                }
            });
        },
        checkDataName: function (data) {
            let name = sterilizer(data.name).removeSpace().kill().toString();
            if (!name) {
                this.$notify.error({
                    title: "错误",
                    message: "宏名称不允许包含特殊字符,不能为空",
                });
                return;
            }
            this.$set(data, "name", name);
        },
        checkTalent: function (data) {
            try {
                JSON.parse(data);
            } catch (e) {
                this.$notify.error({
                    title: "错误",
                    message: "奇穴编码格式错误",
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
        // 初始化技能排序
        initSkillSort() {
            const el = document.querySelector(`.tabs-sort .tab-content${this.activeIndex} .u-skills`);
            if (!el) return;
            const _this = this;
            const sortSkills = Sortable.create(el, {
                animation: 200,
                onEnd({ newIndex, oldIndex }) {
                    const data = cloneDeep(_this.pvpData.data[_this.activeIndex - 1].sq);
                    const currRow = cloneDeep(data.splice(oldIndex, 1)[0]);
                    data.splice(newIndex, 0, currRow);
                    _this.pvpData.data[_this.activeIndex - 1].sq = [];
                    _this.$nextTick(function () {
                        _this.$set(_this.pvpData.data[_this.activeIndex - 1], "sq", data);
                    });
                },
            });
        },
        onContextmenu(event, skill) {
            // console.log(skill)
            this.$contextmenu({
                items: [
                    {
                        label: !skill?.WithoutGcd ? "设置为无GCD技能" : "设置为有GCD技能",
                        onClick: () => {
                            this.$set(skill, "WithoutGcd", !skill.WithoutGcd);
                        },
                        icon: !skill?.WithoutGcd ? "el-icon-check" : "el-icon-close",
                    },
                ],
                event,
                customClass: "custom-class",
                zIndex: 3,
                minWidth: 230,
            });
            return false;
        },
    },
    mounted: function () {
        let el = document.querySelector(".tabs-sort .el-tabs__nav");
        const _this = this;
        let sortTabs = Sortable.create(el, {
            animation: 200,
            filter: ".el-icon-close",
            onEnd({ newIndex, oldIndex }) {
                const data = cloneDeep(_this.pvpData.data);
                const currRow = cloneDeep(data.splice(oldIndex, 1)[0]);
                data.splice(newIndex, 0, currRow);
                _this.pvpData.data = [];
                _this.$nextTick(function () {
                    _this.$set(_this.pvpData, "data", data);
                });
            },
        });
    },
};
</script>

<style lang="less">
.m-publish-pvp .m-macro-box {
    .u-skill .u-skill-icon {
        .size(48px);
    }
}
</style>
