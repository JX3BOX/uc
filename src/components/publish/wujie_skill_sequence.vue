<template>
    <div class="m-publish-macro m-publish-wujie-skill">
        <el-divider content-position="left">{{ $t("publish.sequence.title") }}</el-divider>
        <div class="m-macro-box">
            <div class="m-macro-header">
                <el-button class="m-macro-addbutton" icon="CirclePlus" type="primary" @click="addMacro"
                    >{{ $t("publish.sequence.add") }}</el-button
                >
                <!-- <a
                    class="m-macro-help el-button el-button--success is-plain "
                    href="/tool/14671/"
                    target="_blank"
                >
                    <i class="el-icon-info"></i> 点击查看发布帮助
                </a> -->
            </div>

            <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeMacro">
                <el-tab-pane v-for="(item, i) in macros.data" :key="i" :name="i + 1 + ''">
                    <template #label
                        ><span class="u-tab-box">
                            <img class="u-tabicon" :src="icon(item)" />
                            <span class="u-tab-name" :title="item.name">{{ $t("publish.common.slotName", { index: i + 1, name: item.name }) }}</span>
                        </span></template
                    >
                    <div class="m-macro-cloud m-macro-item">
                        <h5 class="u-title">
                            {{ $t("publish.sequence.iconName") }}
                            <a class="u-icon-links" href="/app/icons" target="_blank">
                                <i class="el-icon-question"></i>
                                {{ $t("publish.common.iconLibrary") }}
                            </a>
                        </h5>
                        <div class="u-group">
                            <div class="u-subblock m-macro-icon">
                                <el-input
                                    v-model="item.icon"
                                    :placeholder="$t('publish.common.iconId')"
                                    :minlength="1"
                                    :maxlength="10"
                                    :min="1"
                                >
                                    <template #prepend>
                                        <img class="u-icon" :src="icon(item)" />
                                    </template>
                                </el-input>
                            </div>
                            <div class="u-subblock m-macro-name">
                                <el-input
                                    v-model="item.name"
                                    :placeholder="$t('publish.sequence.uniqueNamePlaceholder')"
                                    :minlength="1"
                                    :maxlength="maxlength"
                                    show-word-limit
                                    @change="checkDataName(item)"
                                >
                                    <template #prepend>
                                        <b class="u-feed">{{ nickname }}#{{ item.name }}</b>
                                    </template>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <!-- TODO: 无界端奇穴方案 -->
                    <!-- <div class="m-macro-talent m-macro-item">
                        <h5 class="u-title">奇穴方案</h5>
                        <div class="m-macro-talent-simulator">
                            <div class="qx-container"></div>
                        </div>
                        <el-input
                            v-model="item.talent"
                            placeholder="奇穴方案编码"
                            @change="checkTalent(item)"
                        >
                            <template #prepend>
                                <a class="u-get" target="_blank" href="/app/talent">
                                    <i class="el-icon-warning"></i>
                                    获取编码
                                </a>
                            </template>
                        </el-input>
                    </div> -->
                    <div class="m-macro-macro">
                        <div class="m-macro-header">
                            <el-button class="m-macro-addbutton" icon="CirclePlus" type="primary" @click="addSkill"
                                >{{ $t("publish.skill.add") }}</el-button
                            >
                        </div>

                        <div class="m-selected-skills" :class="{ 'is-empty': !item.sq || !item.sq.length }">
                            <draggable v-model="item.sq" class="m-skills-list" v-show="item.sq && item.sq.length">
                                <li v-for="(skill, index) in item.sq" :key="skill.SkillID + '' + index" class="m-skill">
                                    <div class="u-skill" v-if="skill && skill.IconID">
                                        <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                                    </div>
                                    <i class="u-remove-icon" :title="$t('publish.common.remove')" @click="removeSelected(index)"
                                        ><i class="el-icon-close"></i
                                    ></i>
                                </li>
                            </draggable>
                            <el-alert
                                show-icon
                                type="warning"
                                :closable="false"
                                v-if="!item.sq || !item.sq.length"
                                :title="$t('publish.skill.noneSelected')"
                            ></el-alert>
                        </div>
                    </div>
                    <el-form-item :label="$t('publish.common.other')" class="m-macro-misc">
                        <el-row>
                            <el-col :span="8" class="u-speed">
                                <el-input v-model="item.speed" :placeholder="$t('publish.gear.hastePlaceholder')">
                                    <template #prepend
                                        >{{ $t("publish.gear.hasteThreshold") }}
                                        <slot name="pre-prepend"></slot>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="8"></el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item :label="$t('publish.common.instructions')" class="m-macro-desc">
                        <el-input
                            v-model="item.desc"
                            type="textarea"
                            :placeholder="$t('publish.sequence.instructionsPlaceholder')"
                        ></el-input>
                    </el-form-item>
                    <div class="m-macro-op">
                        <el-button
                            class="u-macro-remove-fix"
                            @click="removeMacro(i + 1)"
                            type="danger"
                            plain
                            icon="Delete"
                            >{{ $t("publish.sequence.remove") }}</el-button
                        >
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <slot></slot>

        <publish-wujie-skill
            v-model="showSkillDialog"
            :subtype="subtype"
            platform="wujie"
            @selected="onSelected"
        ></publish-wujie-skill>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { sterilizer } from "sterilizer/index.js";
import { __iconPath } from "@/utils/config";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import { cloneDeep } from "lodash";
import publish_wujie_skill from "@/components/publish/publish_wujie_skill.vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

import Sortable from "sortablejs";
import draggable from "vuedraggable";
// META空模板
const default_meta = {
    data: [
        {
            name: "",
            icon: 13,
            talent: "",
            sq: [],
            speed: "",
            desc: "",
        },
    ],
};
export default {
    name: "wujie_skill_sequence",
    props: {
        modelValue: {
            type: Object,
            default: undefined,
        },
        data: {
            type: Object,
            default: () => cloneDeep(default_meta),
        },
        subtype: {
            type: String,
            default: "",
        },
    },
    components: {
        "publish-wujie-skill": publish_wujie_skill,
        draggable,
    },
    data: function () {
        return {
            macros: this.modelValue !== undefined ? this.modelValue : this.data,
            activeIndex: "1",
            nickname: User.getInfo().name,

            showSkillDialog: false,
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
                        this.macros = cloneDeep(default_meta);
                    } else {
                        this.macros = newval;
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
                        this.macros = cloneDeep(default_meta);
                    } else {
                        this.macros = newval;
                    }
                }
            },
        },
        macros: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
    },
    computed: {
        maxlength: function () {
            return 20 - this.nickname?.length - 1;
        },
        macroMaxLength: function () {
            return this.client === "origin" ? 255 : 128;
        },
    },
    methods: {
        iconLink,
        // 添加武学序列
        addMacro: function () {
            if (this.macros.data.length > 7) {
                this.$alert(this.$t("publish.message.limitReached"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            let index = this.macros.data.length + 1 + "";
            this.macros.data.push({
                name: "",
                icon: 13,
                talent: "",
                sq: [],
                speed: "",
                desc: "",
            });
            this.activeIndex = index;
        },
        // 删除序列
        removeMacro: function (name) {
            if (this.macros.data.length < 2) {
                this.$alert(this.$t("publish.sequence.keepOne"), this.$t("publish.common.message"), {
                    confirmButtonText: this.$t("publish.common.confirm"),
                });
                return;
            }

            this.$alert(this.$t("publish.sequence.confirmDelete"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        // 删除
                        let i = ~~name - 1;
                        this.macros.data.splice(i, 1);
                        // 调整focus位置
                        this.activeIndex = "1";
                    }
                },
            });
        },

        // 检查版本名
        check: function () {
            this.macros.data.forEach((item, i) => {
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
                    message: this.$t("publish.sequence.invalidName"),
                });
                return;
            }
            data.name = name;
        },
        checkTalent: function (data) {
            try {
                JSON.parse(data.talent);
            } catch (e) {
                this.$notify.error({
                    title: this.$t("publish.common.error"),
                    message: this.$t("publish.skill.invalidTalentCode"),
                });
            }
        },

        // 图标
        icon: function (item) {
            let id = isNaN(item.icon) ? 13 : ~~item.icon;
            // id = Math.max(0, Math.min(id, 30000));
            item.icon = id;
            return __iconPath + "icon/" + id + ".png";
        },

        // 新增技能
        addSkill() {
            this.showSkillDialog = true;
        },
        onSelected(data) {
            this.macros.data[this.activeIndex - 1].sq = cloneDeep(data);
        },
    },
    mounted: function () {
        let el = document.querySelector(".tabs-sort .el-tabs__nav");
        const _this = this;
        let sortTabs = Sortable.create(el, {
            animation: 200,
            filter: ".el-icon-close",
            onEnd({ newIndex, oldIndex }) {
                const data = cloneDeep(_this.macros.data);
                const currRow = cloneDeep(data.splice(oldIndex, 1)[0]);
                data.splice(newIndex, 0, currRow);
                console.log(data);
                _this.macros.data = [];
                _this.$nextTick(function () {
                    _this.macros.data = data;
                });
            },
        });
    },
};
</script>

<style lang="less" scoped>
::v-deep(.el-tabs__item) {
    display: inline-flex;
    align-items: center;
}
.tabs-sort {
    .u-tab-box {
        display: inline-flex;
        align-items: center;
        .u-tab-name {
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: move;
        }
    }
}
</style>

<style lang="less">
@import "~@/assets/css/publish/wujie_skill.less";
</style>
