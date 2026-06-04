const SUPPORTED_SKIN_CATEGORIES = ["calendar", "sidebar", "atcard", "homebg", "comment"];

const SKIN_CATEGORY_KEYWORDS = [
    {
        category: "calendar",
        keywords: ["首页日历", "日历"],
    },
    {
        category: "sidebar",
        keywords: ["侧边栏主题", "侧栏风格", "侧边栏"],
    },
    {
        category: "atcard",
        keywords: ["个人名片", "被圈卡片", "圈人卡"],
    },
    {
        category: "homebg",
        keywords: ["主页风格", "个人主页"],
    },
    {
        category: "comment",
        keywords: ["评论皮肤"],
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

export { resolveMallSkinCategory };
