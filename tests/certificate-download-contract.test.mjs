import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
    return fs.readFileSync(path.resolve(projectRoot, relativePath), "utf8");
}

test("certificate keeps browser printing and delegates app image saving to the trusted host", () => {
    const source = readSource("src/views/author/certificate.vue");

    assert.match(source, /if \(!this\.isAppEnv\)[\s\S]*window\.print\(\)/);
    assert.match(source, /this\.\$route\.query\?\.__env/);
    assert.match(source, /jx3box:webview-save-image/);
    assert.match(source, /dataUrl: this\.treasureImg/);
    assert.match(source, /getHarmonyPhotoBridge/);
    assert.match(source, /capacitor:\\\/\\\/localhost/);
    assert.match(source, /event\.source !== window\.parent/);
    assert.match(source, /event\.origin !== parentOrigin/);
});

test("certificate render exports the high-density source canvas without recapturing the scaled page", () => {
    const source = readSource("src/utils/author/certificate.js");

    assert.match(source, /pixelRatio = Math\.min\(3, Math\.max\(1, configuredPixelRatio\)\)/);
    assert.match(source, /canvas\.toDataURL\("image\/png"\)/);
    assert.doesNotMatch(source, /html2canvas|dom-to-image/);
});
