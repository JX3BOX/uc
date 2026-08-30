import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const listSources = ["certification", "holidayCard", "birthdayCard"].map((name) =>
    fs.readFileSync(path.resolve(__dirname, `../src/views/dashboard/${name}.vue`), "utf8")
);

test("collectible lists keep stable item keys and safe new-tab links", () => {
    for (const source of listSources) {
        assert.match(source, /:key="item\.id \|\| index"/);
        assert.match(source, /rel="noopener noreferrer"/);
    }
});

test("collectible lists expose retry actions and tolerate malformed list data", () => {
    for (const source of listSources) {
        assert.match(source, /v-if="loadError"/);
        assert.match(source, /dashboard\.common\.retry/);
        assert.match(source, /Array\.isArray\(data\.list\)/);
    }
});
