import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/views/dashboard/theme.vue", import.meta.url), "utf8");

assert.match(
    source,
    /const skin = this\.decorationJson\?\.\[this\.activePreviewSkinKey\]/,
    "theme preview authors should read the active skin bundle"
);
assert.match(
    source,
    /const skinAuthors = getSkinSceneAuthors\(skin\)/,
    "theme preview authors should prefer top-level skin authors_info"
);
assert.match(
    source,
    /getSkinSceneAuthorsFromConfigs\(configs, this\.activeSceneSubtypeForPreview, this\.activeSceneTheme\)/,
    "theme preview authors should retain compatibility with old part-level author data"
);

console.log("dashboard theme skin contract tests passed");
