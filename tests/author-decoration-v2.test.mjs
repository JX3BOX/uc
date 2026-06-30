import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const service = fs.readFileSync(path.join(root, "src/service/author/cms.js"), "utf8");
const page = fs.readFileSync(path.join(root, "src/views/author/Index.vue"), "utf8");
const header = fs.readFileSync(path.join(root, "src/components/author/newComponents/Me.vue"), "utf8");

assert.match(
    service,
    /function getDecorationV2\(params\)\s*{[\s\S]*\/api\/cms\/user\/decoration\/v2[\s\S]*params[\s\S]*}/,
    "author service should expose the CMS decoration v2 endpoint"
);

assert.match(
    page,
    /getDecorationV2\(\{\s*type:\s*"homebg",\s*subtype:\s*"pc_homebanner",\s*using:\s*1\s*}\)/,
    "author page should request the active PC home banner decoration from v2"
);

assert.match(
    page,
    /getDecorationV2\(\{\s*type:\s*"homebg",\s*subtype:\s*"pc_homebg",\s*using:\s*1\s*}\)/,
    "author page should request the active PC home background decoration from v2"
);

assert.match(
    page,
    /resolveDecorationImage\(image\)[\s\S]*__cdn \+ url\.replace\(\s*\/\^\\\/\+\//,
    "author page should prefix relative decoration image paths with the CDN host"
);

assert.match(
    page,
    /banner:\s*this\.resolveDecorationImage\(decorationItem\?\.image\)/,
    "author page should pass the v2 decoration image through as the header banner"
);

assert.match(
    page,
    /themeBackground:\s*this\.resolveThemeBackgroundImage\(backgroundItem\?\.image\)/,
    "author page should pass the pc_homebg image through as the m-theme background"
);

assert.match(
    page,
    /resolveThemeBackgroundImage\(image\)[\s\S]*document\.body\.offsetWidth > 2560[\s\S]*x-oss-process=image\/resize,w_2560/,
    "author page should downsize the 4k m-theme background to 2560 width on screens wider than 2560"
);

assert.match(
    page,
    /bannerPosition:\s*this\.resolveDecorationPosition\(decorationItem\?\.postion \|\| decorationItem\?\.position\)/,
    "author page should pass the v2 decoration postion field through as the header banner position"
);

assert.match(
    header,
    /if \(decoration\.banner\) \{[\s\S]*this\.userDefinedStyle\.banner = decoration\.banner[\s\S]*return[\s\S]*}/,
    "author header should keep an explicit decoration banner instead of rebuilding the legacy image path"
);

assert.match(
    header,
    /if \(!decoration\.name\) return/,
    "author header should not rebuild a legacy banner path when only the m-theme background is active"
);

assert.match(
    header,
    /:style="\{[\s\S]*backgroundPosition:\s*userDefinedStyle\.bannerPosition[\s\S]*\}"/,
    "author header should bind the decoration banner position to background-position"
);
