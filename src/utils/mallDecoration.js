const SUPPORTED_SKIN_CATEGORIES = ["calendar", "sidebar", "atcard", "homebg", "comment"];

const SKIN_CATEGORY_DISPLAY_NAMES = {
    homebg: "栖云居",
    atcard: "照影笺",
    calendar: "岁时绘",
    comment: "清谈境",
    sidebar: "游踪饰",
};

const SKIN_CATEGORY_KEYWORDS = [
    {
        category: "calendar",
        keywords: ["PC首页日历", "移动首屏KV", "首屏KV", "首页日历", "日历"],
    },
    {
        category: "sidebar",
        keywords: ["PC作品侧栏", "移动底部图标", "作品侧栏", "底部图标", "侧边栏主题", "侧栏风格", "侧边栏"],
    },
    {
        category: "atcard",
        keywords: ["PC个人名片", "移动个人名片", "个人名片", "被圈卡片", "圈人卡"],
    },
    {
        category: "homebg",
        keywords: ["PC主页风格", "移动主页风格", "移动个人中心主题", "个人中心主题", "主页风格", "个人主页"],
    },
    {
        category: "comment",
        keywords: ["PC评论风格", "移动论坛风格", "评论风格", "论坛风格", "评论皮肤"],
    },
];

function normalizeSkinCategory(category) {
    const value = String(category || "").trim();
    return SUPPORTED_SKIN_CATEGORIES.includes(value) ? value : "";
}

function resolveMallSkinCategory(good = {}) {
    const detail = good.virtual_stock_item_details || {};
    const category = normalizeSkinCategory(detail.category);

    if (category) {
        return category;
    }

    const text = [good.title, good.subtitle, detail.title, detail.subtitle, detail.goods_describe]
        .filter(Boolean)
        .join(" ");
    const matched = SKIN_CATEGORY_KEYWORDS.find((item) => item.keywords.some((keyword) => text.includes(keyword)));

    return matched?.category || "";
}

function getMallSkinDisplayName(good = {}) {
    const category = resolveMallSkinCategory(good);
    return SKIN_CATEGORY_DISPLAY_NAMES[category] || "";
}

export { getMallSkinDisplayName, resolveMallSkinCategory };
