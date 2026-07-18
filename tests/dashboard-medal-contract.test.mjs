import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const medalView = readFileSync(new URL("../src/views/dashboard/medal.vue", import.meta.url), "utf8");

test("medal config is loaded for both authenticated and localhost guest views", () => {
    assert.match(medalView, /Promise\.all\(\[/);
    assert.match(medalView, /getMedals\(params\)/);
    assert.match(medalView, /Promise\.resolve\(\{ data: \{ data: \[\] \} \}\)/);
});

test("medal ownership uses an exact set lookup", () => {
    assert.match(medalView, /new Set\(this\.userMedals\.map\(\(item\) => item\.medal\)\)/);
    assert.match(medalView, /medals\.filter\(\(item\) => !ownedMedals\.has\(item\.name\)\)/);
});

test("wear updates are guarded against duplicate submissions", () => {
    assert.match(medalView, /if \(this\.updatingMedalId !== null\) return/);
    assert.match(medalView, /:loading="updatingMedalId === item\.id"/);
    assert.match(medalView, /operationFailedRetry/);
});
