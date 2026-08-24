import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.resolve(__dirname, "../src/components/card/holiday/DefaultTemplate.vue"), "utf8");

test("default holiday cards scale the complete canvas inside mobile viewports", () => {
    assert.match(source, /class="m-default-template-stage"/);
    assert.match(source, /--holiday-card-mobile-scale/);
    assert.match(
        source,
        /Math\.min\(1, availableWidth \/ this\.baseCardWidth, availableHeight \/ this\.baseCardHeight\)/
    );
    assert.match(source, /transform: scale\(var\(--holiday-card-mobile-scale, 0\.8\)\)/);
    assert.match(source, /margin: 0 !important/);
    assert.doesNotMatch(source, /zoom:\s*0\.8/);
});

test("default holiday cards update their scale after viewport or orientation changes", () => {
    assert.match(source, /window\.addEventListener\("resize", this\.updateViewport/);
    assert.match(source, /window\.removeEventListener\("resize", this\.updateViewport\)/);
    assert.match(source, /this\.viewportWidth = window\.innerWidth/);
    assert.match(source, /this\.viewportHeight = window\.innerHeight/);
});
