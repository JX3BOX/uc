import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.resolve(__dirname, "../src/views/dashboard/frame.vue"), "utf8");
const profileServiceSource = fs.readFileSync(path.resolve(__dirname, "../src/service/dashboard/profile.js"), "utf8");

assert.match(
    source,
    /await updateAvatarFrame\(\{ user_avatar_frame: this\.frame \}\)/,
    "avatar frame page should save through the dedicated avatar-frame endpoint"
);

assert.match(
    profileServiceSource,
    /\.get\("\/api\/cms\/config\/avatar"\)/,
    "avatar frame catalog should load from the CMS public config endpoint"
);

assert.doesNotMatch(
    profileServiceSource,
    /avatar\/index\.json/,
    "avatar frame catalog should no longer load from the legacy CDN json"
);

assert.match(
    profileServiceSource,
    /res\.data = res\.data\?\.data \|\| \{\}/,
    "avatar frame service should preserve the legacy name-keyed response consumed by the page"
);

assert.doesNotMatch(
    source,
    /setDecoration/,
    "avatar frame page must not update decoration using states from the client"
);

assert.match(source, /:loading="submitting"/, "avatar frame submit should prevent duplicate requests");

assert.match(
    source,
    /getDecoration\(\{ type: "avatar" \}\)/,
    "avatar frame page should only request the user's avatar decorations"
);

assert.match(
    source,
    /\(this\.decoration\?\.\[key\] \|\| \[\]\)\.filter/,
    "avatar-only responses should not crash the legacy decoration collection check"
);

assert.match(source, /dashboard\.theme\.reset/, "avatar frame page should label the restore action as reset");

assert.match(
    source,
    /reset\(\) \{\s*this\.frame = this\.framebak;\s*this\.dataProcessing\(\);\s*\}/,
    "reset should restore the last loaded or saved avatar frame without submitting a clear request"
);

assert.match(
    source,
    /this\.frameList\.forEach\(\(frame\) => \{\s*frame\.using = 0;\s*\}\);\s*item\.using = 1;/,
    "selecting an avatar frame should keep exactly one local active item"
);

console.log("dashboard frame contract tests passed");
