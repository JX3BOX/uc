<template>
    <div class="m-publish-macro">
        <el-divider content-position="left">宏</el-divider>
        <div class="m-macro-box">
            <div class="m-macro-header">
                <el-button class="m-macro-addbutton" icon="CirclePlus" type="primary" @click="addMacro"
                    >添加宏</el-button
                >
                <a class="m-macro-docs el-button el-button--primary is-plain" target="_blank" href="/tool/265/">
                    <i class="el-icon-s-management"></i>
                    宏命令完整参考手册
                </a>
                <a class="m-macro-help el-button el-button--success is-plain" href="/tool/14671/" target="_blank">
                    <i class="el-icon-info"></i> 点击查看发布帮助
                </a>
            </div>

            <el-tabs class="tabs-sort" v-model="activeIndex" type="card" closable @tab-remove="removeMacro">
                <el-tab-pane v-for="(item, i) in macros.data" :key="i" :name="i + 1 + ''">
                    <template #label>
                        <span class="u-tab-box">
                            <img class="u-tabicon" :src="icon(item)" />
                            <span class="u-tab-name" :title="item.name">{{ i + 1 + "号位-" + item.name }}</span>
                        </span>
                    </template>
                    <div class="m-macro-cloud m-macro-item">
                        <h5 class="u-title">
                            云端宏图标/名称
                            <a class="u-icon-links" href="/app/icons" target="_blank">
                                <i class="el-icon-question"></i>
                                图标大全
                            </a>
                        </h5>
                        <div class="u-group">
                            <publish-mark :value="item.mark" @change="onMarkChange"></publish-mark>
                            <div class="u-subblock m-macro-icon">
                                <el-input
                                    v-model="item.icon"
                                    placeholder="图标ID"
                                    :minlength="1"
                                    :maxlength="10"
                                    :max="1000000"
                                    :min="0"
                                    size="large"
                                >
                                    <template #prepend>
                                        <img class="u-icon" :src="icon(item)" />
                                    </template>
                                </el-input>
                            </div>
                            <div class="u-subblock m-macro-name">
                                <el-input
                                    v-model="item.name"
                                    size="large"
                                    placeholder="每个宏名称请使用自己名下唯一命名"
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
                    <div class="m-macro-talent m-macro-item" v-if="client != 'origin'">
                        <h5 class="u-title">奇穴方案</h5>
                        <div class="m-macro-talent-simulator">
                            <div class="qx-container"></div>
                        </div>
                        <el-input
                            v-model="item.talent"
                            size="large"
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
                    </div>
                    <div class="m-macro-talent m-macro-item" v-if="client === 'origin'">
                        <h5 class="u-title">镇派方案</h5>
                        <div class="m-macro-talent-simulator">
                            <div class="qx-container"></div>
                        </div>
                        <el-input
                            v-model="item.talent"
                            size="large"
                            placeholder="镇派方案编码"
                            @change="checkTalent(item)"
                        >
                            <template #prepend>
                                <a class="u-get" target="_blank" href="/macro/talent2">
                                    <i class="el-icon-warning"></i>
                                    获取编码
                                </a>
                            </template>
                        </el-input>
                    </div>
                    <div class="m-macro-macro">
                        <h5 class="u-title">
                            宏内容
                            <a class="u-icon-links" href="/macro/macroeditor" target="_blank">
                                <i class="el-icon-question"></i>
                                智能中文宏编辑器
                            </a>
                        </h5>
                        <el-input
                            v-model="item.macro"
                            placeholder="注释请写在说明中,勿写在宏内部"
                            :minlength="1"
                            :maxlength="macroMaxLength"
                            show-word-limit
                            type="textarea"
                            :rows="12"
                        ></el-input>
                    </div>
                    <el-form-item label="其它" class="m-macro-misc">
                        <el-input v-model="item.speed" size="large" placeholder="填写推荐的急速阈值">
                            <template #prepend>
                                急速阈值
                                <slot name="pre-prepend"></slot>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="说明" class="m-macro-desc">
                        <el-input
                            size="large"
                            v-model="item.desc"
                            type="textarea"
                            placeholder="重要说明（会出现在宏第一行）"
                        ></el-input>
                    </el-form-item>
                    <div class="m-macro-op">
                        <el-button
                            class="u-macro-remove-fix"
                            @click="removeMacro(i + 1)"
                            type="danger"
                            plain
                            icon="Delete"
                            >移除本宏</el-button
                        >
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import lodash from "lodash";
import { sterilizer } from "sterilizer/index.js";
import { __iconPath } from "@/utils/config";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import cloneDeep from "lodash/cloneDeep";
import publish_mark from "./publish_mark.vue";

import Sortable from "sortablejs";
// META空模板
const default_meta = {
    data: [
        {
            name: "",
            icon: 13,
            talent: "",
            macro: "",
            speed: "",
            equip: "",
            equip_type: "jx3box",
            desc: "",
            mark: "",
        },
    ],
};
export default {
    name: "publishMacro",
    props: {
        modelValue: {
            type: Object,
            default: function () {
                return {};
            },
        },
        client: {
            type: String,
            default: "std",
        }
    },
    components: {
        "publish-mark": publish_mark,
    },
    data: function () {
        return {
            macros: lodash.cloneDeep(default_meta),
            activeIndex: "1",
            nickname: User.getInfo().name,
            equip_types: {
                jx3box: "魔盒清单",
                // tuilan: "推栏",
                // j3pz: "胖叔配装器",
            },
        };
    },
    emits: ["update:modelValue"],
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.macros = lodash.cloneDeep(default_meta);
                } else {
                    this.macros = newval;
                }
            },
        },
        macros: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
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
        // 添加宏
        addMacro: function () {
            if (this.macros.data.length > 7) {
                this.$alert("已经达到添加上限", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            let index = this.macros.data.length + 1 + "";
            this.macros.data.push({
                name: "",
                icon: 13,
                talent: "",
                macro: "",
                speed: "",
                equip: "",
                equip_type: "",
                desc: "",
                mark: "",
            });
            this.activeIndex = index;
        },
        // 删除宏
        removeMacro: function (name) {
            if (this.macros.data.length < 2) {
                this.$alert("必须保留1个宏", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }

            this.$alert("确定删除这个宏吗，删除后无法找回", "消息", {
                confirmButtonText: "确定",
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
            data.name = name;
        },
        checkTalent: function (data) {
            try {
                JSON.parse(data.talent);
            } catch (e) {
                this.$notify.error({
                    title: "错误",
                    message: "奇穴编码格式错误",
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

        // 标记
        onMarkChange: function (val) {
            this.macros.data[this.activeIndex - 1].mark = val;
        },
    },
    created: function () {},
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
