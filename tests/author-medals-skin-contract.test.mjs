import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const authorView = readFileSync("src/views/author/Index.vue", "utf8");
const me = readFileSync("src/components/author/newComponents/Me.vue", "utf8");
const primary = readFileSync("src/components/author/newComponents/Primary.vue", "utf8");
const medals = readFileSync("src/components/author/newComponents/AuthorMedals.vue", "utf8");

test("个人主页从 user skin 聚合数据向勋章组件传递当前勋章", () => {
    assert.match(authorView, /getUserSkin\(\{\s*user_id: this\.uid,?\s*\}\)/);
    assert.match(authorView, /item\?\.type === "medals"/);
    assert.match(authorView, /<Me[^>]+:medals="medals"/);
    assert.match(me, /<Primary[^>]+:medals="medals"/);
    assert.match(primary, /<AuthorMedals[^>]+:medals="medals"/);
    assert.doesNotMatch(primary, /<AuthorMedals[^>]+:uid=/);
    assert.match(primary, /import AuthorMedals from "\.\/AuthorMedals\.vue"/);
    assert.doesNotMatch(medals, /getUserMedals/);
});
