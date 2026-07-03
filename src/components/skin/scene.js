import { __cdn } from "@/utils/config";

export const SKIN_TYPE_OPTIONS = [
    { type: "calendar", text: "岁时绘", subtype: "pc_calendar", sort: 1, isHave: 0, using: 0, statue: 1 },
    { type: "sidebar", text: "游踪饰", subtype: "pc_sidebar", sort: 2, isHave: 0, using: 0, statue: 1 },
    { type: "comment", text: "清谈境", subtype: "pc_comment", sort: 3, isHave: 0, using: 0, statue: 1 },
    { type: "homebg", text: "栖云居", subtype: "pc_homebg", sort: 4, isHave: 0, using: 0, statue: 1 },
    { type: "atcard", text: "照影笺", subtype: "pc_authorcard", sort: 5, isHave: 0, using: 0, statue: 1 },
];

export const SKIN_TYPE_SCENES = {
    sidebar: ["pc_sidebar", "app_tabbar"],
    calendar: ["pc_calendar", "app_kv"],
    comment: ["pc_comment", "app_forum"],
    homebg: ["pc_home", "app_authorbg", "app_dashboardbg"],
    atcard: ["pc_authorcard", "app_authorcard"],
};

export const APP_TABBAR_SCENE_SUBTYPES = [
    "app_tabbar_icon_dashboard",
    "app_tabbar_icon_dashboard_active",
    "app_tabbar_icon_forum",
    "app_tabbar_icon_forum_active",
    "app_tabbar_icon_nav",
    "app_tabbar_icon_nav_active",
    "app_tabbar_icon_home",
    "app_tabbar_icon_home_active",
    "app_tabbar_bg",
];

export const SKIN_SCENE_SOURCE_SUBTYPES = {
    app_tabbar: APP_TABBAR_SCENE_SUBTYPES,
    pc_home: ["pc_homebg", "pc_homebanner"],
};

export const SKIN_SCENE_LABELS = {
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
    app_authorbg: "[App]个人主页",
    app_dashboardbg: "[App]个人中心",
    pc_home: "[PC]个人主页",
    pc_homebanner: "[PC]个人主页横幅",
    pc_homebg: "[PC]个人主页背景",
    app_authorcard: "[App]个人名片",
    pc_authorcard: "[PC]个人名片",
};

export const SKIN_THEME_OPTIONS = [
    { value: "all", label: "通用", icon: "el-icon-s-grid" },
    { value: "light", label: "亮色", icon: "el-icon-sunny" },
    { value: "dark", label: "暗色", icon: "el-icon-moon" },
];

export const HIDDEN_SKIN_KEYS = ["0_TESTSAMPLE"];

export function normalizeSkinUrl(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
}

export function normalizeSkinAvatar(url) {
    const raw = String(url || "").trim();
    const matched = raw.match(/^\[[^\]]+\]\(([^)]+)\)$/);
    return matched ? matched[1] : raw;
}

function pickSkinAuthorValue(author, keys) {
    return keys.map((key) => author?.[key]).find((value) => value !== undefined && value !== null && value !== "");
}

export function getSkinTypeOption(type) {
    return SKIN_TYPE_OPTIONS.find((item) => item.type === type);
}

export function getSkinConfig(source, key, type) {
    const configs = source?.[key]?.decorations?.[type];
    const subtype = getSkinTypeOption(type)?.subtype;
    if (!Array.isArray(configs)) return null;
    return configs.find((item) => item?.subtype === subtype && item?.image) || null;
}

export function getSkinPreview(source, key, type) {
    return normalizeSkinUrl(getSkinConfig(source, key, type)?.image);
}

export function isVisibleSkin(source, key) {
    return !HIDDEN_SKIN_KEYS.includes(key) && source?.[key]?.status !== 0;
}

export function hasSkinType(source, key, type) {
    return !!getSkinConfig(source, key, type)?.image;
}

export function getSkinTypeConfigs(source, key, type) {
    const configs = source?.[key]?.decorations?.[type];
    return Array.isArray(configs) ? configs : [];
}

export function getSceneSourceSubtypes(subtype) {
    return SKIN_SCENE_SOURCE_SUBTYPES[subtype] || [subtype];
}

export function isSkinSceneAvailable(source, key, type, subtype) {
    if (!key) return true;
    const configs = getSkinTypeConfigs(source, key, type);
    const sourceSubtypes = getSceneSourceSubtypes(subtype);
    return configs.some((item) => sourceSubtypes.includes(item?.subtype) && item?.image);
}

export function getFirstAvailableSkinSceneSubtype(source, key, type) {
    if (!key) return (SKIN_TYPE_SCENES[type] || [])[0] || "";
    return (SKIN_TYPE_SCENES[type] || []).find((subtype) => isSkinSceneAvailable(source, key, type, subtype)) || "";
}

export function getSkinSceneTabs(source, key, type, components = {}) {
    return (SKIN_TYPE_SCENES[type] || [])
        .map((subtype) => ({
            subtype,
            label: SKIN_SCENE_LABELS[subtype] || subtype,
            component: components[subtype],
        }))
        .filter((item) => item.component && isSkinSceneAvailable(source, key, type, item.subtype));
}

export function getSkinSceneModes(configs, sceneSubtype) {
    if (!sceneSubtype) return [];
    const subtypes = sceneSubtype === "app_tabbar" ? APP_TABBAR_SCENE_SUBTYPES : [sceneSubtype];
    const modeSet = new Set(
        configs.filter((item) => subtypes.includes(item?.subtype) && item?.theme).map((item) => item.theme)
    );
    return SKIN_THEME_OPTIONS.filter((item) => modeSet.has(item.value));
}

export function getPreferredSkinSceneTheme(modes, currentTheme = "all") {
    if (!modes.length) return "all";
    return modes.some((item) => item.value === currentTheme) ? currentTheme : modes[0].value;
}

export function normalizeSkinAuthors(authors) {
    if (!Array.isArray(authors)) return [];
    const seen = new Set();
    return authors
        .map((author) => {
            const source = author?.author_info || author?.user_info || author?.creator_info || author?.user || author;
            return {
                id: pickSkinAuthorValue(source, ["id", "ID", "user_id", "uid"]) || "",
                display_name: String(
                    pickSkinAuthorValue(source, ["display_name", "name", "nickname", "nick_name", "user_nickname"]) ||
                        ""
                ).trim(),
                avatar: normalizeSkinAvatar(
                    pickSkinAuthorValue(source, ["avatar", "user_avatar", "avatar_url", "user_avatar_url"])
                ),
            };
        })
        .filter((author) => author.display_name)
        .filter((author) => {
            const key = author.id ? `id:${author.id}` : `name:${author.display_name}|avatar:${author.avatar}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

export function getSkinSceneAuthors(sceneConfig) {
    const authors = [];
    const visit = (value) => {
        if (!value) return;
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }
        if (typeof value !== "object") return;

        if (value.id || value.user_id || value.uid) {
            authors.push(value);
        }
        if (Array.isArray(value.authors_info)) {
            authors.push(...value.authors_info);
        }
        if (Array.isArray(value.authors)) {
            authors.push(...value.authors);
        }
        ["author_info", "user_info", "creator_info", "user"].forEach((key) => {
            if (value[key] && typeof value[key] === "object") {
                authors.push(value[key]);
            }
        });
        if (value.author && typeof value.author === "object") {
            visit(value.author);
        }

        Object.keys(value).forEach((key) => {
            if (
                ["authors_info", "authors", "author_info", "user_info", "creator_info", "user", "author"].includes(key)
            ) {
                return;
            }
            visit(value[key]);
        });
    };

    visit(sceneConfig);
    return normalizeSkinAuthors(authors);
}

export function getSkinSceneAuthorsFromConfigs(configs, sceneSubtype, theme = "all") {
    if (!Array.isArray(configs) || !sceneSubtype) return [];
    const subtypes = getSceneSourceSubtypes(sceneSubtype);
    const matchedConfigs = subtypes
        .map(
            (subtype) =>
                configs.find((item) => item?.subtype === subtype && item?.theme === theme) ||
                configs.find((item) => item?.subtype === subtype && item?.theme === "all") ||
                configs.find((item) => item?.subtype === subtype) ||
                null
        )
        .filter(Boolean);

    return getSkinSceneAuthors(matchedConfigs);
}

export function getSkinSceneConfig(configs, sceneSubtype, theme = "all") {
    if (!sceneSubtype) return null;
    if (sceneSubtype === "pc_home") {
        return {
            page: configs.find((item) => item?.subtype === "pc_homebg") || null,
            banner: configs.find((item) => item?.subtype === "pc_homebanner") || null,
        };
    }
    if (sceneSubtype === "app_tabbar") {
        const getConfig = (subtype) =>
            configs.find((item) => item?.subtype === subtype && item?.theme === theme) ||
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
        configs.find((item) => item?.subtype === sceneSubtype && item?.theme === theme) ||
        configs.find((item) => item?.subtype === sceneSubtype && item?.theme === "all") ||
        configs.find((item) => item?.subtype === sceneSubtype) ||
        null
    );
}
