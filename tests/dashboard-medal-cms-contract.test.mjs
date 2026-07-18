import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const service = readFileSync("src/service/dashboard/decoration.js", "utf8");

test("勋章配置、拥有列表和穿戴操作统一走 CMS", () => {
    assert.match(service, /\/api\/cms\/config\/medal/);
    assert.match(service, /\/api\/cms\/user\/medal/);
    assert.match(service, /\/api\/cms\/user\/medal\/\$\{medal_id\}\/wear\/\$\{is_wear\}/);
    assert.doesNotMatch(service, /next2\/user\/.*medals/);
});
