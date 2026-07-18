import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.resolve(__dirname, "../src/views/dashboard/palu.vue"), "utf8");
const router = fs.readFileSync(path.resolve(__dirname, "../src/pages/dashboard/router.js"), "utf8");
const tabs = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../src/assets/data/dashboard/tabs.json"), "utf8"));

test("magic card dashboard exposes the palu tab and route", () => {
    assert.ok(tabs.themeTab.some((item) => item.name === "palu"));
    assert.match(router, /name: "palu",\s*path: "\/palu"/);
});

test("magic card dashboard merges the full mall catalog with owned quantities", () => {
    assert.match(source, /getItemList\(\{ category: "virtual", sub_category: "palu", _no_page: 1 \}\)/);
    assert.match(source, /getDecoration\(\{ type: "palu" \}\)/);
    assert.match(source, /Promise\.allSettled/, "the public catalog should still render when the owned-card request is unavailable");
    assert.match(source, /current\.amount \+= Math\.max\(0, Number\(item\.amount\) \|\| 0\)/);
    assert.match(source, /ownedMap\.forEach/);
});

test("unowned magic cards link to their mall detail", () => {
    assert.match(source, /v-if="!item\.amount"/);
    assert.match(
        source,
        /`\/vip\/mall\/\$\{item\.id\}\?category=virtual&sub_category=palu&search=\$\{encodeURIComponent\(title\)\}`/
    );
});

test("magic cards can be searched by title or value", () => {
    assert.match(source, /v-model="keyword"/);
    assert.match(source, /item\.title} \$\{item\.val}/);
    assert.match(source, /v-for="item in filteredCards"/);
});

test("all magic card images use lazy loading", () => {
    assert.match(source, /<el-image[^>]*:src="item\.image"[^>]*\slazy>/);
    assert.doesNotMatch(source, /<img[^>]*:src="item\.image"/);
});
