import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const service = read("src/service/dashboard/webhook.js");
const noticePage = read("src/views/dashboard/notice/index.vue");
const editor = read("src/views/dashboard/notice/third_party.vue");

function readLocale(locale) {
    const source = read(`src/locale/${locale}/dashboard.js`).replace(/^export default\s+/, "module.exports = ");
    const context = { module: { exports: {} } };
    vm.runInNewContext(source, context);
    return context.module.exports;
}

test("webhook service uses the self-service CMS endpoints", () => {
    assert.match(service, /\.get\("\/api\/cms\/user\/my\/webhook"\)/);
    assert.match(service, /\.put\(`\/api\/cms\/user\/my\/webhook\/\$\{encodeURIComponent\(type\)\}`/);
    assert.match(service, /\.delete\(`\/api\/cms\/user\/my\/webhook\/\$\{encodeURIComponent\(type\)\}`/);
});

test("notice page keeps all providers in a distinct load-error state", () => {
    for (const type of ["wecom", "feishu", "dingtalk"]) {
        assert.match(noticePage, new RegExp(`type: "${type}", webhook: null, loading: true, loadError: false`));
    }
    assert.match(noticePage, /item\.props\.loadError = true/);
    assert.match(editor, /if \(this\.loadError\) return this\.\$t\("dashboard\.notice\.webhook\.loadFailed"\)/);
    assert.match(editor, /if \(this\.loadError\) \{\s*this\.\$emit\("refresh"\)/);
});

test("editor only renders masked credentials and preserves omitted fields", () => {
    assert.match(editor, /webhook\?\.webhook_masked/);
    assert.match(editor, /webhook\?\.secret_masked/);
    assert.doesNotMatch(editor, /\{\{\s*webhook\?*\.(?:webhook|secret)\s*\}\}/);
    assert.match(editor, /if \(this\.form\.webhook\) payload\.webhook = this\.form\.webhook/);
    assert.match(editor, /if \(this\.form\.secret\) payload\.secret = this\.form\.secret/);
    assert.match(editor, /this\.type === "feishu" && this\.form\.clearSecret[\s\S]*payload\.secret = ""/);
});

test("editor can copy the complete masked Webhook value", () => {
    assert.match(editor, /import \{ copyText \} from "@\/utils\/index"/);
    assert.match(editor, /icon="DocumentCopy"/);
    assert.match(editor, /copyText\(this\.maskedWebhook\)/);
    assert.match(editor, /dashboard\.common\.copySuccess/);
});

test("notice row shows four stars and the Webhook token suffix", () => {
    assert.ok(editor.includes("{{ webhookSummary }}"));
    assert.ok(editor.includes('replace(/^\\*+/, "").slice(-4)'));
    assert.ok(editor.includes('return suffix ? `****${suffix}` : "****";'));
});

test("DingTalk requires a secret when none is stored", () => {
    assert.match(editor, /required: this\.type === "dingtalk" && !this\.hasSecret/);
    assert.match(editor, /type="password"/);
});

test("webhook translations keep the same contract in every locale", () => {
    const locales = ["zh-CN", "zh-TW", "en-US", "vi"];
    const keys = locales.map((locale) => Object.keys(readLocale(locale).notice.webhook).sort());
    keys.slice(1).forEach((localeKeys) => assert.deepEqual(localeKeys, keys[0]));
});
