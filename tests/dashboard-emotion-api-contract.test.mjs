import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/views/dashboard/emotion.vue", "utf8");
const service = readFileSync("src/service/dashboard/decoration.js", "utf8");

test("emotion activation submits only selected keys to its dedicated endpoint", () => {
    assert.match(service, /post\("\/api\/cms\/user\/emotion", \{ keys \}\)/);
    assert.match(page, /setEmotion\(this\.selectedKeys\)/);
    assert.doesNotMatch(page, /this\.ownedEmotionKeys\.map/);
    assert.doesNotMatch(page, /setDecoration\(data\)/);
});

test("emotion card preview and activation selection are separate actions", () => {
    assert.match(page, /@click="previewEmotionPack\(emotion\)"/);
    assert.match(page, /@click\.stop="toggleEmotionSelected\(emotion\)"/);
    assert.match(page, /class="u-emotion-action"/);
    assert.match(page, /is-cancel.*is-activate/);
    assert.match(page, /class="u-emotion-action is-purchase"/);
    assert.match(page, /previewEmotionPack\(emotion\) \{/);
    assert.doesNotMatch(page, /toggleEmotionSelected\(emotion\)[\s\S]*?this\.previewKey = key/);
});
