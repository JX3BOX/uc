import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../src/views/author/Index.vue", import.meta.url), "utf8");
const profile = fs.readFileSync(
    new URL("../src/components/author/newComponents/Me.vue", import.meta.url),
    "utf8"
);
assert(page.includes('rows.find((item) => item?.type === "honor")'), "author page should read honor from user skin");
assert(page.includes('?.honor || null'), "author page should read the honor payload nested in the skin record");
assert(profile.includes('<Honor :honor="honor" />'), "profile should pass skin honor data to the renderer");
assert(
    profile.includes('import Honor from "@jx3box/jx3box-ui/src/author/AuthorHonor.vue"'),
    "profile should reuse the shared honor component"
);

console.log("author honor skin contract passed");
