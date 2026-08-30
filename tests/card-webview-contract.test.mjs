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

const helperSource = readSource("src/utils/card-page.js");
const helperModule = await import(`data:text/javascript,${encodeURIComponent(helperSource)}`);

test("card ownership accepts scoped API data and rejects a conflicting owner", () => {
    assert.equal(helperModule.isCardOwnedBy({ id: 1 }, 8), true);
    assert.equal(helperModule.isCardOwnedBy({ user_id: 8 }, "8"), true);
    assert.equal(helperModule.isCardOwnedBy({ user: { uid: 9 } }, 8), false);
});

test("embedded cards notify the host without changing iframe history", () => {
    const messages = [];
    const parent = {
        postMessage(message, targetOrigin) {
            messages.push([message, targetOrigin]);
        },
    };
    const backCalls = [];
    globalThis.window = {
        parent,
        history: { length: 3 },
        location: { assign: () => assert.fail("embedded card must not navigate itself") },
    };

    helperModule.leaveCardPage({ back: () => backCalls.push(true) }, 8);

    assert.deepEqual(messages, [["closeHolidayCard", "*"]]);
    assert.deepEqual(backCalls, []);
});

test("standalone cards preserve normal browser back and author fallback", () => {
    const backCalls = [];
    const assigns = [];
    const standaloneWindow = {
        history: { length: 2 },
        location: { assign: (url) => assigns.push(url) },
    };
    standaloneWindow.parent = standaloneWindow;
    globalThis.window = standaloneWindow;

    helperModule.leaveCardPage({ back: () => backCalls.push(true) }, 8);
    assert.equal(backCalls.length, 1);
    assert.deepEqual(assigns, []);

    standaloneWindow.history.length = 1;
    helperModule.leaveCardPage({ back: () => backCalls.push(true) }, 8);
    assert.deepEqual(assigns, ["/author/8"]);
});

test("card pages do not use cross-origin local profile data for ownership", () => {
    const sources = [
        "src/views/card/HolidayCard.vue",
        "src/components/card/birthday/default.vue",
        "src/components/card/birthday/default2025.vue",
        "src/components/card/birthday/default2026.vue",
    ].map(readSource);

    for (const source of sources) {
        assert.doesNotMatch(source, /User\.getInfo\(\)/);
    }
    assert.match(sources[0], /v-if="ready"/);
    assert.match(sources[0], /errorMessage/);
});

test("all collectible card videos allow inline playback on iOS WebView", () => {
    const sources = [
        "src/components/card/birthday/default.vue",
        "src/components/card/birthday/default2025.vue",
        "src/components/card/birthday/default2026.vue",
        "src/components/card/holiday/CardAnniversary.vue",
    ].map(readSource);

    for (const source of sources) {
        const videoCount = (source.match(/<video\b/g) || []).length;
        const inlineCount = (source.match(/\bplaysinline\b/g) || []).length;
        assert.ok(videoCount > 0);
        assert.ok(inlineCount >= videoCount);
    }
});
