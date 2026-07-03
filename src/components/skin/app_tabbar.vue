<template>
    <div class="m-skin-scene-preview m-app-tabbar-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone" :style="phoneStyle">
                <div class="m-phone-content">
                    <div class="u-search"></div>
                    <div class="u-grid">
                        <i v-for="index in 8" :key="index"></i>
                    </div>
                    <div class="u-card" v-for="index in 3" :key="index">
                        <b></b>
                        <span></span>
                    </div>
                </div>
                <div v-if="tabbarBackground" class="m-tabbar-bg" :style="tabbarBgStyle"></div>
                <div class="m-tabbar" :class="{ 'has-tabbar-skin': tabbarBackground }" :style="tabbarStyle">
                    <button
                        v-for="item in skinnedTabs"
                        :key="item.key"
                        type="button"
                        class="u-tab"
                        :class="{ active: activeTab === item.key }"
                        :style="item.buttonStyle"
                        @click="activeTab = item.key"
                    >
                        <span class="u-tab-icon" :style="tabIconStyle(item)">
                            <img v-if="tabIcon(item)" :src="tabIcon(item)" alt="" />
                            <i v-else></i>
                        </span>
                        <span class="u-tab-label">{{ item.label }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App底部导航</b>
            <span>sidebar / app_tabbar</span>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";

const normalizeSkinUrl = function (url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};

const getImage = function (config) {
    return normalizeSkinUrl(config?.image);
};

const TABBAR_INACTIVE_TEXT_LIGHTEN = 0.45;
const TABBAR_POSITION_MAP = {
    lt: "left top",
    mt: "center top",
    ct: "center top",
    rt: "right top",
    lm: "left center",
    cm: "center center",
    mm: "center center",
    o: "center center",
    rm: "right center",
    lb: "left bottom",
    mb: "center bottom",
    cb: "center bottom",
    rb: "right bottom",
};
const APP_PREVIEW_WIDTH = 375;
const APP_DESIGN_WIDTH = 414;
const APP_DESIGN_ROOT_FONT_SIZE = 16;

const getAppPreviewRootFontSize = function (width = APP_PREVIEW_WIDTH) {
    return (width / APP_DESIGN_WIDTH) * APP_DESIGN_ROOT_FONT_SIZE;
};

const getAppPreviewIconSize = function (width = APP_PREVIEW_WIDTH) {
    const root = getAppPreviewRootFontSize(width);
    return Math.min(Math.max(3.1 * root, width * 0.135), 3.9 * root);
};

const convertAppPreviewLength = function (value) {
    if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
    const raw = String(value || "").trim();
    if (!raw) return "";
    const remMatch = raw.match(/^(-?(?:\d+|\d*\.\d+))rem$/i);
    if (remMatch) {
        return `calc(${Number(remMatch[1])} * var(--app-preview-rem))`;
    }
    return raw === "0" || /^-?(?:\d+|\d*\.\d+)(?:px|r?em|%|vh|vw|vmin|vmax)$/i.test(raw) ? raw : "";
};

const lightenHexColor = function (color = "", ratio = TABBAR_INACTIVE_TEXT_LIGHTEN) {
    const raw = String(color || "").trim();
    const match = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return raw;
    const hex = match[1].length === 3 ? match[1].replace(/(.)/g, "$1$1") : match[1];
    const amount = Math.max(0, Math.min(1, ratio));
    const channels = [0, 2, 4].map((start) => {
        const value = parseInt(hex.slice(start, start + 2), 16);
        return Math.round(value + (255 - value) * amount)
            .toString(16)
            .padStart(2, "0");
    });
    return `#${channels.join("")}`;
};

export default {
    name: "AppTabbarSkinScene",
    props: {
        theme: {
            type: String,
            default: "all",
        },
        skinConfig: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            activeTab: "home",
            tabs: [
                { key: "home", label: "首页", normal: "home", active: "homeActive" },
                { key: "nav", label: "导航", normal: "nav", active: "navActive" },
                { key: "forum", label: "论坛", normal: "forum", active: "forumActive" },
                { key: "dashboard", label: "我的", normal: "dashboard", active: "dashboardActive" },
            ],
        };
    },
    computed: {
        phoneStyle() {
            const root = getAppPreviewRootFontSize();
            return {
                "--app-preview-rem": `${root}px`,
                "--app-tabbar-height": `calc(5.6 * var(--app-preview-rem))`,
                "--app-tabbar-icon-size": `${getAppPreviewIconSize()}px`,
                "--app-tabbar-label-size": `calc(0.8 * var(--app-preview-rem))`,
                "--app-tabbar-padding-top": `calc(0.28 * var(--app-preview-rem))`,
            };
        },
        tabbarBackground() {
            return getImage(this.skinConfig?.bg);
        },
        tabbarTextColor() {
            return this.resolveDecorationColor(this.skinConfig?.bg, "textcolor");
        },
        tabbarActiveTextColor() {
            return (
                this.resolveDecorationColor(this.skinConfig?.bg, "activecolor") ||
                this.resolveDecorationColor(this.skinConfig?.bg, "activeColor") ||
                this.tabbarTextColor
            );
        },
        tabbarInactiveTextColor() {
            return this.tabbarTextColor || lightenHexColor(this.tabbarActiveTextColor);
        },
        tabbarBgStyle() {
            if (!this.tabbarBackground) return {};
            return {
                background: this.buildBackgroundValue(
                    this.tabbarBackground,
                    this.resolveDecorationBackgroundPosition(this.skinConfig?.bg)
                ),
                ...this.buildDecorationOffsetStyle(this.skinConfig?.bg?.extend),
            };
        },
        tabbarStyle() {
            if (!this.tabbarBackground && !this.tabbarActiveTextColor) return {};
            const style = {};
            if (this.tabbarBackground) {
                style.background = "transparent";
            }
            if (this.tabbarActiveTextColor) {
                style["--tabbar-color"] = this.tabbarInactiveTextColor;
                style["--tabbar-color-selected"] = this.tabbarActiveTextColor;
            }
            return style;
        },
        skinnedTabs() {
            return this.tabs.map((item) => {
                const normalConfig = this.skinConfig?.[item.normal] || null;
                const activeConfig = this.skinConfig?.[item.active] || null;
                const ownTextColor =
                    this.resolveDecorationColor(normalConfig, "textcolor") ||
                    this.resolveDecorationColor(activeConfig, "textcolor");
                const textColor = ownTextColor || this.tabbarTextColor;
                const activeTextColor =
                    this.resolveDecorationColor(activeConfig, "activecolor") ||
                    this.resolveDecorationColor(normalConfig, "activecolor") ||
                    this.resolveDecorationColor(activeConfig, "textcolor") ||
                    ownTextColor ||
                    this.tabbarActiveTextColor ||
                    textColor;
                return {
                    ...item,
                    normalConfig,
                    activeConfig,
                    textColor,
                    activeTextColor,
                    buttonStyle: this.buildTabbarButtonStyle(textColor, activeTextColor),
                };
            });
        },
    },
    methods: {
        tabIcon(item) {
            return getImage(this.activeTab === item.key ? item.activeConfig : item.normalConfig);
        },
        tabIconStyle(item) {
            const base = this.buildDecorationOffsetStyle(item.normalConfig?.extend);
            if (this.activeTab !== item.key) {
                return base;
            }
            return {
                ...base,
                ...this.buildDecorationOffsetStyle(item.activeConfig?.extend),
            };
        },
        resolveDecorationColor(item = {}, key = "") {
            const normalizedKey = String(key || "").trim();
            const lowerKey = normalizedKey.toLowerCase();
            const candidateKeys =
                lowerKey === "textcolor"
                    ? ["textcolor", "textColor"]
                    : lowerKey === "activecolor"
                    ? ["activecolor", "activeColor"]
                    : [normalizedKey, normalizedKey.replace(/[A-Z]/g, (match) => match.toLowerCase())];
            const value = candidateKeys.find((candidateKey) => item?.[candidateKey]);
            return String(item?.[value] || "").trim();
        },
        buildTabbarButtonStyle(textColor = "", activeTextColor = "") {
            const active = String(activeTextColor || "").trim();
            if (!active) return {};
            return {
                "--tabbar-color": String(textColor || "").trim() || lightenHexColor(active),
                "--tabbar-color-selected": active,
            };
        },
        buildBackgroundValue(image = "", position = "center bottom") {
            return `url("${image}") ${position} / 100% auto no-repeat`;
        },
        resolveDecorationBackgroundPosition(decoration = {}) {
            const extend = decoration?.extend && typeof decoration.extend === "object" ? decoration.extend : {};
            const raw = String(extend.backgroundPosition || extend.position || decoration?.position || "").trim();
            if (!raw) return "center bottom";
            const key = raw.toLowerCase();
            if (TABBAR_POSITION_MAP[key]) return TABBAR_POSITION_MAP[key];
            const cssPositionPattern =
                /^(?:(?:left|center|right)(?:\s+(?:top|center|bottom))?|(?:top|center|bottom)(?:\s+(?:left|center|right))?)$/i;
            return cssPositionPattern.test(raw) ? raw : "center bottom";
        },
        buildDecorationOffsetStyle(extend = {}) {
            if (!extend || typeof extend !== "object" || Array.isArray(extend)) return {};
            return ["top", "right", "bottom", "left"].reduce((style, key) => {
                const value = this.resolveDecorationLength(extend[key]);
                if (value) style[key] = value;
                return style;
            }, {});
        },
        resolveDecorationLength(value) {
            return convertAppPreviewLength(value);
        },
    },
};
</script>

<style lang="less" scoped>
.m-skin-scene-preview {
    width: 100%;
    color: #1f2937;
}

.m-scene-stage {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 540px;
    padding: 30px;
    overflow: auto;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    background: #f8fafc;
}

.m-scene-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.5;

    b {
        color: #111827;
        font-size: 14px;
    }
}

.m-phone {
    position: relative;
    width: 375px !important;
    height: 667px !important;
    overflow: hidden;
    border: 7px solid #111827;
    border-radius: 34px;
    background: #fff;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
    font-size: var(--app-preview-rem);
}

.m-phone-content {
    box-sizing: border-box;
    height: 100%;
    padding: 28px 18px 84px;
    background: linear-gradient(180deg, #eef4ff, #fff 38%);
}

.u-search {
    width: 150px;
    height: 24px;
    margin: 0 auto 22px;
    border-radius: 999px;
    background: #e5e7eb;
}

.u-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    i {
        display: block;
        height: 38px;
        border-radius: 12px;
        background: #eef2f7;
    }
}

.u-card {
    margin-top: 18px;
    padding: 14px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);

    b,
    span {
        display: block;
        border-radius: 999px;
        background: #e5e7eb;
    }

    b {
        width: 45%;
        height: 14px;
        margin-bottom: 12px;
    }

    span {
        width: 82%;
        height: 12px;
    }
}

.m-tabbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: flex-start;
    height: var(--app-tabbar-height);
    padding: var(--app-tabbar-padding-top) 6px 0;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.94);
    z-index: 2;

    &.has-tabbar-skin {
        background: transparent;
    }
}

.m-tabbar-bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    height: var(--app-tabbar-height);
    pointer-events: none;
}

.u-tab {
    appearance: none;
    position: relative;
    display: block;
    height: var(--app-tabbar-height);
    min-height: var(--app-tabbar-height);
    min-width: 0;
    padding: 0 4px;
    border: 0;
    background: transparent;
    color: var(--tabbar-color, #94a3b8);
    font-size: var(--app-tabbar-label-size);
    line-height: 1.15;
    cursor: pointer;

    &.active {
        color: var(--tabbar-color-selected, #635bff);
    }
}

.u-tab-icon {
    position: relative;
    display: block;
    width: var(--app-tabbar-icon-size);
    height: var(--app-tabbar-icon-size);
    margin: calc(-0.08 * var(--app-preview-rem)) auto 0;
    pointer-events: none;

    img,
    i {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    i {
        border-radius: 9px;
        background: #dbe3ef;
    }
}

.u-tab-label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    z-index: 3;
    display: block;
    padding: 0 4px;
    overflow: hidden;
    font-size: var(--app-tabbar-label-size);
    line-height: 1.15;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
}
</style>
