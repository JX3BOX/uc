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
                                :class="{ active: activeSceneSubtype === scene.subtype }"
                                @click="selectSceneSubtype(scene.subtype)"
                            >
                                {{ scene.label }}
                            </button>
                        </div>
                        <div class="u-scene-card">
                            <component
                                :is="activeScenePreview.component"
                                :key="activeScenePreview.subtype"
                                :theme="activeSceneTheme"
                                :skin-config="activeSceneConfig"
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
                        <img
                            :src="getActiveImg(item)"
                            class="u-img"
                            fit="contain"
                            v-if="isStatus(item)"
                        />
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
                    <el-button type="primary" @click="decorationSubmit" size="large">确认</el-button>
                    <el-button @click="reset" size="large">重置</el-button>
                </div>
            </div>
            <div class="m-theme-right">
                <!-- 主题渲染列表 -->
                <div class="u-theme">
                    <div class="u-decoration-list" v-for="(item, i) in decoration" :key="i + item.val">
                        <div class="u-title">
                            <span class="u-name"><i class="el-icon-collection-tag"></i> {{ item.name }}</span>
                            <a
                                class="u-buy"
                                :href="`/vip/mall?category=virtual&sub_category=skin&search=${item.name}`"
                                target="_blank"
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
                                    <el-image :src="showDecoration(item2)" fit="cover" />
                                </div>
                                <div class="u-decoration-name">{{ item2.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getDecoration, setDecoration, getDecorationJson } from "@/service/dashboard/decoration";
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath, __cdn } from "@/utils/config";
import { cloneDeep, flatten } from "lodash";
import tabsData from "@/assets/data/dashboard/tabs.json";
import { SKIN_SCENE_COMPONENTS } from "@/components/skin";
const { themeTab } = tabsData;

const normalizeSkinUrl = function (url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};

const SKIN_TYPE_OPTIONS = [
    { type: "calendar", text: "岁时绘", subtype: "pc_calendar", sort: 1, isHave: 0, using: 0, statue: 1 },
    { type: "sidebar", text: "游踪饰", subtype: "pc_sidebar", sort: 2, isHave: 0, using: 0, statue: 1 },
    { type: "comment", text: "清谈境", subtype: "pc_comment", sort: 3, isHave: 0, using: 0, statue: 1 },
    { type: "homebg", text: "栖云居", subtype: "pc_homebg", sort: 4, isHave: 0, using: 0, statue: 1 },
    { type: "atcard", text: "照影笺", subtype: "pc_authorcard", sort: 5, isHave: 0, using: 0, statue: 1 },
];

const SKIN_TYPE_SCENES = {
    sidebar: [
        "pc_sidebar",
        "app_tabbar",
    ],
    calendar: ["pc_calendar", "app_kv"],
    comment: ["pc_comment", "app_forum"],
    homebg: ["pc_home", "app_authorbg", "app_dashboardbg"],
    atcard: ["pc_authorcard", "app_authorcard"],
};

const SKIN_SCENE_LABELS = {
    app_kv: "[App]首屏KV",
    pc_calendar: "[PC]首页日历",
    app_tabbar_icon_dashboard: "[App]我的图标",
    app_tabbar_icon_dashboard_active: "[App]我的图标(激活)",
    app_tabbar_icon_forum: "[App]论坛图标",
    app_tabbar_icon_forum_active: "[App]论坛图标(激活)",
    app_tabbar_icon_nav: "[App]导航图标",
    app_tabbar_icon_nav_active: "[App]导航图标(激活)",
    app_tabbar_icon_home: "[App]首页图标",
    app_tabbar_icon_home_active: "[App]首页图标(激活)",
    app_tabbar_bg: "[App]底栏背景",
    app_tabbar: "[App]底部导航",
    pc_sidebar: "[PC]侧栏背景",
    app_forum: "[App]论坛KV",
    pc_comment: "[PC]评论背景",
    app_authorbg: "[App]作者主页",
    app_dashboardbg: "[App]个人中心",
    pc_home: "[PC]个人主页",
    pc_homebanner: "[PC]个人主页横幅",
    pc_homebg: "[PC]个人主页背景",
    app_authorcard: "[App]用户卡片",
    pc_authorcard: "[PC]用户卡片",
};

const SKIN_THEME_OPTIONS = [
    { value: "all", label: "通用", icon: "el-icon-s-grid" },
    { value: "light", label: "亮色", icon: "el-icon-sunny" },
    { value: "dark", label: "暗色", icon: "el-icon-moon" },
];

const getSkinTypeOption = function (type) {
    return SKIN_TYPE_OPTIONS.find((item) => item.type === type);
};

const getSkinConfig = function (source, key, type) {
    const configs = source?.[key]?.decorations?.[type];
    const subtype = getSkinTypeOption(type)?.subtype;
    if (!Array.isArray(configs)) return null;
    return configs.find((item) => item?.subtype === subtype && item?.image) || null;
};

const getSkinPreview = function (source, key, type) {
    return normalizeSkinUrl(getSkinConfig(source, key, type)?.image);
};

const HIDDEN_SKIN_KEYS = ["0_TESTSAMPLE"];

const isVisibleSkin = function (source, key) {
    return !HIDDEN_SKIN_KEYS.includes(key) && source?.[key]?.status !== 0;
};

const hasSkinType = function (source, key, type) {
    return !!getSkinConfig(source, key, type)?.image;
};

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
            originalActivateName: null,
            back: {},
        };
    },
    computed: {
        currentSceneTabs() {
            return (SKIN_TYPE_SCENES[this.activePreviewType] || [])
                .map((subtype) => ({
                    subtype,
                    label: SKIN_SCENE_LABELS[subtype] || subtype,
                    component: SKIN_SCENE_COMPONENTS[subtype],
                }))
                .filter((item) => item.component);
        },
        activeScenePreview() {
            return (
                this.currentSceneTabs.find((item) => item.subtype === this.activeSceneSubtype) ||
                this.currentSceneTabs[0] ||
                null
            );
        },
        activePreviewSkinKey() {
            const list = flatten(this.decoration.map((item) => item.list));
            return list.find((item) => item.type === this.activePreviewType && item.using == 1)?.val || "";
        },
        activeSceneModes() {
            const configs =
                this.decorationJson?.[this.activePreviewSkinKey]?.decorations?.[this.activePreviewType] || [];
            const subtypes =
                this.activeSceneSubtype === "app_tabbar"
                    ? [
                          "app_tabbar_icon_dashboard",
                          "app_tabbar_icon_dashboard_active",
                          "app_tabbar_icon_forum",
                          "app_tabbar_icon_forum_active",
                          "app_tabbar_icon_nav",
                          "app_tabbar_icon_nav_active",
                          "app_tabbar_icon_home",
                          "app_tabbar_icon_home_active",
                          "app_tabbar_bg",
                      ]
                    : [this.activeSceneSubtype];
            const modeSet = new Set(
                configs
                    .filter((item) => subtypes.includes(item?.subtype) && item?.theme)
                    .map((item) => item.theme)
            );

            return SKIN_THEME_OPTIONS.filter((item) => modeSet.has(item.value));
        },
        activeSceneConfig() {
            const configs =
                this.decorationJson?.[this.activePreviewSkinKey]?.decorations?.[this.activePreviewType] || [];
            if (this.activeSceneSubtype === "pc_home") {
                return {
                    page: configs.find((item) => item?.subtype === "pc_homebg") || null,
                    banner: configs.find((item) => item?.subtype === "pc_homebanner") || null,
                };
            }
            if (this.activeSceneSubtype === "app_tabbar") {
                const getConfig = (subtype) =>
                    configs.find((item) => item?.subtype === subtype && item?.theme === this.activeSceneTheme) ||
                    configs.find((item) => item?.subtype === subtype && item?.theme === "all") ||
                    configs.find((item) => item?.subtype === subtype) ||
                    null;
                return {
                    bg: getConfig("app_tabbar_bg"),
                    dashboard: getConfig("app_tabbar_icon_dashboard"),
                    dashboardActive: getConfig("app_tabbar_icon_dashboard_active"),
                    forum: getConfig("app_tabbar_icon_forum"),
                    forumActive: getConfig("app_tabbar_icon_forum_active"),
                    nav: getConfig("app_tabbar_icon_nav"),
                    navActive: getConfig("app_tabbar_icon_nav_active"),
                    home: getConfig("app_tabbar_icon_home"),
                    homeActive: getConfig("app_tabbar_icon_home_active"),
                };
            }
            return (
                configs.find(
                    (item) => item?.subtype === this.activeSceneSubtype && item?.theme === this.activeSceneTheme
                ) ||
                configs.find((item) => item?.subtype === this.activeSceneSubtype) ||
                null
            );
        },
        showSceneModes() {
            return !!this.activeSceneSubtype && !this.activeSceneSubtype.startsWith("pc_") && this.activeSceneModes.length;
        },
    },
    watch: {
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
            getDecorationJson().then((res) => {
                sessionStorage.setItem("decoration_json", JSON.stringify(res.data));
                this.decorationJson = res.data;
                this.applyDecorationList([]);
                getDecoration()
                    .then((res) => {
                        let typeArr = SKIN_TYPE_OPTIONS.map((item) => item.type);
                        let arr = res.data.data.filter((item) => item.type != "" && typeArr.indexOf(item.type) != -1);
                        this.applyDecorationList(arr);
                    })
                    .catch(() => {});
            });
        },
        applyDecorationList(arr) {
            this.decoration = this.formattingData(arr, "val");
            this.back.decoration = cloneDeep(this.decoration);
            this.back.originalActivateName = cloneDeep(this.originalActivateName);
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
            this.activeSceneSubtype = (SKIN_TYPE_SCENES[type] || [])[0] || "";
            this.syncSceneTheme();
        },
        selectSceneSubtype(subtype) {
            this.activeSceneSubtype = subtype;
            this.syncSceneTheme();
        },
        selectSceneTheme(theme) {
            this.activeSceneTheme = theme;
        },
        syncSceneTheme() {
            this.$nextTick(() => {
                if (
                    this.activeSceneModes.length &&
                    !this.activeSceneModes.some((item) => item.value === this.activeSceneTheme)
                ) {
                    this.activeSceneTheme = this.activeSceneModes[0].value;
                }
            });
        },
        getActiveImg(item) {
            let type = item.type;
            let val = undefined;
            const _decorations = flatten(this.decoration.map((item) => item.list));
            _decorations.forEach((item) => {
                if (item.type == type && item.using == 1) {
                    val = item.val;
                }
            });
            let defaultImg = "https://cdn.jx3box.com/static/dashboard/img/no.5fe91973.svg";
            if (val) return getSkinPreview(this.decorationJson, val, type) || __cdn + `design/decoration/images/${val}/${type}_preview.png`;
            else return defaultImg;
        },
        decorationSubmit() {
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
            setDecoration(params).then((data) => {
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
                this.$message({
                    message: "主题更新成功",
                    type: "success",
                });
            });
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
