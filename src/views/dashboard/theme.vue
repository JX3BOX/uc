<template>
    <uc class="m-dashboard-theme m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--small is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-theme-box">
            <!-- 左右两侧 -->
            <div class="m-theme-left">
                <div class="u-top">
                    <div class="u-scene-preview" v-if="activeScenePreview">
                        <div class="u-scene-tabs" v-if="currentSceneTabs.length > 1">
                            <button
                                v-for="scene in currentSceneTabs"
                                :key="scene.subtype"
                                type="button"
                                :class="{
                                    active: activeScenePreview && activeScenePreview.subtype === scene.subtype,
                                    disabled: scene.disabled,
                                }"
                                :disabled="scene.disabled"
                                :title="scene.disabled ? '当前皮肤未包含该部位' : scene.label"
                                @click="selectSceneSubtype(scene.subtype)"
                            >
                                {{ scene.label }}
                            </button>
                        </div>
                        <div class="u-scene-card">
                            <button
                                type="button"
                                class="u-scene-fullscreen"
                                title="全屏预览"
                                aria-label="全屏预览"
                                @click="openScenePreviewDialog"
                            >
                                <el-icon><FullScreen /></el-icon>
                            </button>
                            <component
                                :is="activeScenePreview.component"
                                :key="activeScenePreview.subtype"
                                :theme="activeSceneTheme"
                                :skin-config="activeSceneConfig"
                                :authors="activeSkinAuthors"
                                class="u-scene-item"
                            />
                            <div class="u-scene-modes" v-if="showSceneModes">
                                <span
                                    v-for="mode in activeSceneModes"
                                    :key="mode.value"
                                    :class="[`is-${mode.value}`, { active: activeSceneTheme === mode.value }]"
                                    :title="mode.label"
                                    @click="selectSceneTheme(mode.value)"
                                >
                                    <i :class="mode.icon"></i>
                                    <em>{{ mode.label }}</em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="u-no-preview" v-else>
                        暂 无<br />
                        预 览
                    </div>
                </div>
                <div class="u-bottom">
                    <div
                        class="u-type-box"
                        :class="{ active: activePreviewType === item.type }"
                        v-for="(item, index) in themeType"
                        :key="index"
                        @click="selectPreviewType(item.type)"
                    >
                        <button
                            v-if="getActiveSkinByType(item.type)"
                            type="button"
                            class="u-clear-type"
                            title="清除当前装扮"
                            @click.stop="clearPreviewType(item.type)"
                        >
                            <i class="el-icon-close"></i>
                        </button>
                        <img :src="getActiveImg(item)" class="u-img" fit="contain" v-if="isStatus(item)" />
                        <div class="u-no-select" v-else-if="!item.statue">
                            敬 请<br />
                            期 待
                        </div>
                        <div class="u-no-select" v-else>
                            暂 无<br />
                            设 置
                        </div>
                        <div class="u-title">{{ item.name }}</div>
                    </div>
                </div>
                <div class="u-btn">
                    <el-button type="primary" @click="decorationSubmit" size="large" :loading="submitting">确认</el-button>
                    <el-button @click="reset" size="large" :disabled="submitting">重置</el-button>
                </div>
            </div>
            <div class="m-theme-right">
                <!-- 主题渲染列表 -->
                <div class="u-skin-search">
                    <el-input v-model="skinSearchKeyword" size="large" clearable placeholder="搜索皮肤名称">
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </div>
                <div class="u-load-error" v-if="decorationJsonLoadError">
                    <div>皮肤列表加载失败，请稍后重试。</div>
                    <el-button type="primary" plain size="small" :loading="decorationJsonLoading" @click="loadDecoration">
                        重试加载
                    </el-button>
                </div>
                <div class="u-theme" v-else-if="filteredDecoration.length">
                    <div class="u-decoration-list" v-for="(item, i) in filteredDecoration" :key="i + item.val">
                        <div class="u-title">
                            <span class="u-name"><i class="el-icon-collection-tag"></i> {{ item.name }}</span>
                            <a
                                class="u-buy"
                                :href="getSkinMallUrl(item.name)"
                                target="_blank"
                                rel="noopener noreferrer"
                                ><i class="el-icon-shopping-cart-2"></i> 前往获取</a
                            >
                        </div>
                        <div class="u-decoration-item">
                            <div v-for="(item2, i2) in item.list" :key="'c' + i2" :title="item2.name" class="u-picbox">
                                <div
                                    class="u-pic"
                                    :class="item2.isHave ? (item2.using ? 'select' : '') : 'noHave'"
                                    @click="setStatus(i, i2, item2)"
                                >
                                    <el-image
                                        :src="showDecoration(item2)"
                                        fit="cover"
                                        lazy
                                        loading="lazy"
                                        scroll-container=".m-theme-right"
                                    />
                                </div>
                                <div class="u-decoration-name">{{ item2.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="u-search-empty" v-else>暂无匹配皮肤</div>
            </div>
        </div>
        <el-dialog
            v-model="scenePreviewDialogVisible"
            class="m-theme-preview-dialog"
            fullscreen
            append-to-body
            destroy-on-close
            :show-close="false"
        >
            <template #header>
                <div class="u-preview-dialog-header">
                    <div class="u-preview-dialog-title">
                        <b>{{ activeScenePreview?.label || "全屏预览" }}</b>
                        <span>{{ activePreviewType }} / {{ activeSceneSubtypeForPreview }}</span>
                    </div>
                    <div class="u-preview-scene-tabs" v-if="currentSceneTabs.length > 1">
                        <button
                            v-for="scene in currentSceneTabs"
                            :key="`dialog-${scene.subtype}`"
                            type="button"
                            :class="{
                                active: activeScenePreview && activeScenePreview.subtype === scene.subtype,
                                disabled: scene.disabled,
                            }"
                            :disabled="scene.disabled"
                            :title="scene.disabled ? '当前皮肤未包含该部位' : scene.label"
                            @click="selectSceneSubtype(scene.subtype)"
                        >
                            {{ scene.label }}
                        </button>
                    </div>
                    <div class="u-preview-dialog-actions">
                        <div class="u-preview-scene-modes" v-if="activeSceneModes.length > 1">
                            <span
                                v-for="mode in activeSceneModes"
                                :key="`dialog-${mode.value}`"
                                :class="[`is-${mode.value}`, { active: activeSceneTheme === mode.value }]"
                                :title="mode.label"
                                @click="selectSceneTheme(mode.value)"
                            >
                                <i :class="mode.icon"></i>
                                <em>{{ mode.label }}</em>
                            </span>
                        </div>
                        <button
                            type="button"
                            class="u-preview-dialog-close"
                            title="关闭预览"
                            aria-label="关闭预览"
                            @click="closeScenePreviewDialog"
                        >
                            <el-icon><Close /></el-icon>
                        </button>
                    </div>
                </div>
            </template>
            <div class="u-preview-dialog-body" v-if="activeScenePreview">
                <component
                    :is="activeScenePreview.component"
                    :key="`fullscreen-${activeScenePreview.subtype}`"
                    :theme="activeSceneTheme"
                    :skin-config="activeSceneConfig"
                    :authors="activeSkinAuthors"
                    class="u-scene-item u-scene-item--fullscreen"
                />
            </div>
        </el-dialog>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getDecoration, setDecoration, getDecorationJson } from "@/service/dashboard/decoration";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@/utils/config";
import { cloneDeep, flatten } from "lodash";
import tabsData from "@/assets/data/dashboard/tabs.json";
import { SKIN_SCENE_COMPONENTS } from "@/components/skin";
import {
    SKIN_SCENE_LABELS,
    SKIN_TYPE_OPTIONS,
    SKIN_TYPE_SCENES,
    getFirstAvailableSkinSceneSubtype,
    getPreferredSkinSceneTheme,
    getSkinPreview,
    getSkinSceneAuthors,
    getSkinSceneAuthorsFromConfigs,
    getSkinSceneConfig,
    getSkinSceneModes,
    getSkinTypeConfigs,
    hasSkinType,
    isSkinSceneAvailable,
    isVisibleSkin,
} from "@/components/skin/scene";
const { themeTab } = tabsData;

export default {
    name: "theme",
    props: [],
    data: function () {
        return {
            tabList: themeTab,
            uid: User.getInfo().uid,
            themeType: SKIN_TYPE_OPTIONS.map((item) => ({ name: item.text, type: item.type, statue: item.statue })),
            previewUrl: "",
            activePreviewType: "calendar",
            activeSceneSubtype: "pc_calendar",
            activeSceneTheme: "all",
            decoration: [],
            decorationJson: [], //远程json
            skinSearchKeyword: "",
            scenePreviewDialogVisible: false,
            decorationJsonLoading: false,
            decorationJsonLoadError: false,
            submitting: false,
            originalActivateName: null,
            back: {},
        };
    },
    computed: {
        filteredDecoration() {
            const keyword = this.skinSearchKeyword.trim().toLowerCase();
            if (!keyword) return this.decoration;
            return this.decoration.filter((item) =>
                String(item.name || "")
                    .toLowerCase()
                    .includes(keyword)
            );
        },
        currentSceneTabs() {
            return (SKIN_TYPE_SCENES[this.activePreviewType] || [])
                .map((subtype) => ({
                    subtype,
                    label: SKIN_SCENE_LABELS[subtype] || subtype,
                    component: SKIN_SCENE_COMPONENTS[subtype],
                    disabled: !this.isSceneAvailable(subtype, this.activePreviewType),
                }))
                .filter((item) => item.component);
        },
        activeSceneSubtypeForPreview() {
            const selected = this.currentSceneTabs.find(
                (item) => item.subtype === this.activeSceneSubtype && !item.disabled
            );
            const fallback = this.currentSceneTabs.find((item) => !item.disabled);
            return (selected || fallback)?.subtype || "";
        },
        activeScenePreview() {
            return this.currentSceneTabs.find((item) => item.subtype === this.activeSceneSubtypeForPreview) || null;
        },
        activePreviewSkinKey() {
            const list = flatten(this.decoration.map((item) => item.list));
            return list.find((item) => item.type === this.activePreviewType && item.using == 1)?.val || "";
        },
        activeSkinAuthors() {
            const authors = getSkinSceneAuthors(this.activeSceneConfig);
            if (authors.length) return authors;
            const configs =
                this.decorationJson?.[this.activePreviewSkinKey]?.decorations?.[this.activePreviewType] || [];
            return getSkinSceneAuthorsFromConfigs(configs, this.activeSceneSubtypeForPreview, this.activeSceneTheme);
        },
        activeSceneModes() {
            const sceneSubtype = this.activeSceneSubtypeForPreview;
            if (!sceneSubtype) return [];
            const configs =
                this.decorationJson?.[this.activePreviewSkinKey]?.decorations?.[this.activePreviewType] || [];
            return getSkinSceneModes(configs, sceneSubtype);
        },
        activeSceneConfig() {
            const sceneSubtype = this.activeSceneSubtypeForPreview;
            if (!sceneSubtype) return null;
            const configs =
                this.decorationJson?.[this.activePreviewSkinKey]?.decorations?.[this.activePreviewType] || [];
            return getSkinSceneConfig(configs, sceneSubtype, this.activeSceneTheme);
        },
        showSceneModes() {
            const sceneSubtype = this.activeSceneSubtypeForPreview;
            return !!sceneSubtype && !sceneSubtype.startsWith("pc_") && this.activeSceneModes.length;
        },
    },
    watch: {
        activePreviewSkinKey() {
            this.syncSceneSubtype();
        },
        activeSceneModes: {
            immediate: true,
            handler(modes) {
                if (!modes.length) return;
                if (!modes.some((item) => item.value === this.activeSceneTheme)) {
                    this.activeSceneTheme = modes[0].value;
                }
            },
        },
    },
    methods: {
        reset() {
            let back = cloneDeep(this.back);
            this.previewUrl = "";
            this.decoration = back.decoration;
            this.originalActivateName = back.originalActivateName;
        },
        loadDecoration() {
            this.decorationJsonLoading = true;
            this.decorationJsonLoadError = false;

            getDecorationJson()
                .then((res) => {
                    sessionStorage.setItem("decoration_json", JSON.stringify(res.data));
                    this.decorationJson = res.data;
                    this.applyDecorationList([]);
                    return getDecoration()
                        .then((res) => {
                            let typeArr = SKIN_TYPE_OPTIONS.map((item) => item.type);
                            let arr = res.data.data.filter((item) => item.type != "" && typeArr.indexOf(item.type) != -1);
                            this.applyDecorationList(arr);
                        })
                        .catch(() => {});
                })
                .catch(() => {
                    this.decorationJsonLoadError = true;
                    this.$message.error("皮肤列表加载失败，请稍后重试");
                })
                .finally(() => {
                    this.decorationJsonLoading = false;
                });
        },
        applyDecorationList(arr) {
            this.decoration = this.formattingData(arr, "val");
            this.back.decoration = cloneDeep(this.decoration);
            this.back.originalActivateName = cloneDeep(this.originalActivateName);
            this.syncSceneSubtype();
        },
        getActiveSkinKeyByType(type = this.activePreviewType) {
            return this.getActiveSkinByType(type)?.val || "";
        },
        getActiveSkinByType(type = this.activePreviewType) {
            const list = flatten(this.decoration.map((item) => item.list));
            return list.find((item) => item.type === type && item.using == 1) || null;
        },
        getSkinTypeConfigs(type = this.activePreviewType) {
            const skinKey = this.getActiveSkinKeyByType(type);
            return getSkinTypeConfigs(this.decorationJson, skinKey, type);
        },
        isSceneAvailable(subtype, type = this.activePreviewType) {
            const skinKey = this.getActiveSkinKeyByType(type);
            return isSkinSceneAvailable(this.decorationJson, skinKey, type, subtype);
        },
        getFirstAvailableSceneSubtype(type = this.activePreviewType) {
            const skinKey = this.getActiveSkinKeyByType(type);
            return getFirstAvailableSkinSceneSubtype(this.decorationJson, skinKey, type);
        },
        //数据分组，设置已激活name
        formattingData(arr, group_key) {
            let options = SKIN_TYPE_OPTIONS;
            const userSkinMap = {};

            arr.forEach((item, i) => {
                let sortFind = options.find((e) => e.type == item.type);
                if (sortFind) {
                    item.sort = sortFind.sort;
                    userSkinMap[`${item[group_key]}__${item.type}`] = item;
                    if (item.using) {
                        this.originalActivateName = item[group_key];
                    }
                }
            });

            let decorationJson = cloneDeep(this.decorationJson);
            const keys = Object.keys(decorationJson).filter((key) => isVisibleSkin(decorationJson, key));

            return keys
                .map((key) => {
                    const sourceItem = decorationJson[key] || {};
                    const title = sourceItem.title || sourceItem.desc || key;
                    return {
                        val: key,
                        name: title,
                        list: options
                            .filter((option) => hasSkinType(decorationJson, key, option.type))
                            .map((option) => {
                                const userSkin = userSkinMap[`${key}__${option.type}`];
                                return {
                                    ...option,
                                    val: key,
                                    name: title,
                                    text: option.text,
                                    isHave: userSkin ? 1 : 0,
                                    using: userSkin?.using || 0,
                                    image: getSkinPreview(decorationJson, key, option.type),
                                };
                            }),
                    };
                })
                .filter((item) => item.list.length);
        },
        // 数据排序，新的装扮在前
        sortData(arr, source = {}) {
            // 根据source的顺序排序
            let res = [];
            const userHad = arr.filter((item) => item.list.some((e) => e.isHave));
            const userNo = arr.filter((item) => !item.list.some((e) => e.isHave));

            return userHad.reverse().concat(userNo.reverse());
        },
        //设置选中/取消
        setStatus(i, i2, item) {
            if (!item.isHave) {
                return;
            }
            this.selectPreviewType(item.type);
            let type = item.type;
            let val = item.val;
            // 消除激活的同部位
            this.decoration.forEach(({ list }, index) => {
                list.forEach((item, i) => {
                    if (item.val != val && item.type == type && item.using == 1) {
                        this.decoration[index].list[i].using = 0;
                    }
                });
            });

            item.using == 1 ? (item.using = 0) : (item.using = 1);
        },
        isStatus(item) {
            // 循环所有主题的卡片，判断是否有已激活的
            let type = item.type;
            var isSelect = false;
            const _decorations = flatten(this.decoration.map((item) => item.list));
            _decorations.forEach((item) => {
                if (item.type == type && item.using == 1) {
                    isSelect = true;
                }
            });
            if (isSelect) return true;
            else return false;
        },
        preview(item) {
            this.selectPreviewType(item.type);
        },
        selectPreviewType(type) {
            this.activePreviewType = type;
            this.activeSceneSubtype = this.getFirstAvailableSceneSubtype(type);
            this.syncSceneTheme();
        },
        selectSceneSubtype(subtype) {
            if (!this.isSceneAvailable(subtype)) return;
            this.activeSceneSubtype = subtype;
            this.syncSceneTheme();
        },
        selectSceneTheme(theme) {
            this.activeSceneTheme = theme;
        },
        openScenePreviewDialog() {
            this.scenePreviewDialogVisible = true;
        },
        closeScenePreviewDialog() {
            this.scenePreviewDialogVisible = false;
        },
        syncSceneTheme() {
            this.$nextTick(() => {
                const nextTheme = getPreferredSkinSceneTheme(this.activeSceneModes, this.activeSceneTheme);
                if (nextTheme !== this.activeSceneTheme) {
                    this.activeSceneTheme = nextTheme;
                }
            });
        },
        syncSceneSubtype() {
            this.$nextTick(() => {
                if (this.isSceneAvailable(this.activeSceneSubtype)) return;
                this.activeSceneSubtype = this.getFirstAvailableSceneSubtype(this.activePreviewType);
            });
        },
        clearPreviewType(type) {
            flatten(this.decoration.map((item) => item.list)).forEach((item) => {
                if (item.type === type) {
                    item.using = 0;
                }
            });
            if (this.activePreviewType === type) {
                this.syncSceneSubtype();
            }
        },
        getActiveImg(item) {
            let type = item.type;
            const val = this.getActiveSkinByType(type)?.val;
            let defaultImg = "https://cdn.jx3box.com/static/dashboard/img/no.5fe91973.svg";
            if (val)
                return (
                    getSkinPreview(this.decorationJson, val, type) ||
                    __cdn + `design/decoration/images/${val}/${type}_preview.png`
                );
            else return defaultImg;
        },
        decorationSubmit() {
            if (this.submitting) return;
            this.submitting = true;
            let activateType = [];
            let decorationName = "";
            //激活主题
            const _decorations = flatten(this.decoration.map((item) => item.list));
            const params = _decorations
                .filter((item) => item.isHave && item.using == 1)
                .map((item) => {
                    activateType.push(item.type);
                    return {
                        val: item.val,
                        using: 1,
                        type: item.type,
                    };
                });
            setDecoration(params)
                .then(() => {
                    //开始设置主题缓存,设置执行持久缓存，同时设置session,其他库优先获取session,无则获取local,还没数据则请求库所在主题位置接口
                    let decoration_res = {
                        name: decorationName, //主题名称
                        type: activateType, //主题激活部位，
                    };
                    if (!decorationName) {
                        decoration_res.name = false;
                    }
                    localStorage.setItem("decoration_all", JSON.stringify(decoration_res));
                    //removeItem 个人相关部位
                    sessionStorage.removeItem("decoration_me" + this.uid);
                    sessionStorage.removeItem("decoration_sidebar" + this.uid);
                    sessionStorage.removeItem("decoration_calendar");
                    sessionStorage.removeItem("decoration_atcard" + this.uid);
                    this.back.decoration = cloneDeep(this.decoration);
                    this.back.originalActivateName = cloneDeep(this.originalActivateName);
                    this.$message({
                        message: "主题更新成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.$message({
                        message: err?.response?.data?.msg || err?.message || "主题更新失败，请稍后重试",
                        type: "error",
                    });
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        getSkinMallUrl(name = "") {
            return `/vip/mall?category=virtual&sub_category=skin&search=${encodeURIComponent(name)}`;
        },
        showDecoration: function (item) {
            return item.image || __cdn + `design/decoration/images/${item.val}/${item.type}_preview.png`;
        },
    },
    mounted: function () {
        this.loadDecoration();
    },
    components: {
        uc,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/theme.less";
</style>
