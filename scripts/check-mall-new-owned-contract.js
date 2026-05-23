const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(file) {
    return fs.readFileSync(path.join(root, file), "utf8");
}

function assertIncludes(file, pattern, message) {
    const source = read(file);
    if (!pattern.test(source)) {
        throw new Error(`${file}: ${message}`);
    }
}

assertIncludes(
    "src/views/vip/mallNew/Index.vue",
    /_query\.no_buy\s*=\s*onlyUnowned\s*\?\s*1\s*:\s*["']{2}/,
    "未拥有筛选必须请求 no_buy=1"
);
assertIncludes(
    "src/views/vip/mallNew/Index.vue",
    /const\s+raw\s*=\s*item\.ext_info\?\.has_buy/,
    "拥有状态只能读取 ext_info.has_buy"
);
assertIncludes(
    "src/views/vip/mallNew/Index.vue",
    /if\s*\(item\.has_owned\)\s*\{[\s\S]*?obj\.canBuy\s*=\s*false;[\s\S]*?obj\.owned\s*=\s*false;/,
    "已拥有商品必须置为不可兑换"
);
assertIncludes(
    "src/views/vip/mallNew/components/SearchBox.vue",
    /query\.only_unowned/,
    "列表筛选区必须提供只看未拥有开关"
);
assertIncludes(
    "src/views/vip/mallNew/components/GoodDetail.vue",
    /v-if="good\.has_owned">已拥有/,
    "详情页已拥有商品按钮必须显示已拥有"
);
assertIncludes(
    "src/views/vip/mallNew/components/GoodDetail.vue",
    /:disabled="good\.has_owned\s*\|\|\s*!good\.canBuy\.canBuy"/,
    "详情页已拥有商品按钮必须禁用"
);
assertIncludes(
    "src/views/vip/mallNew/components/GoodItem.vue",
    /<span\s+v-if="good\.has_owned"\s+class="u-owned-tag">已拥有<\/span>/,
    "列表图右上角必须展示已拥有标签"
);
assertIncludes(
    "src/views/vip/mallNew/components/GoodDetail.vue",
    /<span\s+v-if="good\.has_owned"\s+class="u-owned-tag">已拥有<\/span>/,
    "详情图右上角必须展示已拥有标签"
);

console.log("mallNew owned contract ok");
