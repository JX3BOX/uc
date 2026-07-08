import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const premium = read("src/views/vip/premium/index.vue");
const rename = read("src/views/vip/rename.vue");
const namespace = read("src/views/vip/namespace.vue");
const mallExchangeError = read("src/utils/mallExchangeError.js");

assert.match(
    premium,
    /if \(!this\.premiumItem\.id\) \{[\s\S]*return this\.loadPremiumItem\(\)\.then\(\(\) => \{[\s\S]*兑换信息暂不可用，请稍后再试/,
    "premium exchange should retry loading the mall item and show a clear unavailable message when the item is missing"
);

assert.match(
    premium,
    /cny:\s*true[\s\S]*Number\(this\.asset\.cny\)[\s\S]*info\.cny = false/,
    "premium can-buy data should include cny so shared mall requirement messaging stays complete"
);

assert.match(
    rename,
    /const checkingName = this\.new_name;[\s\S]*const token = \+\+this\.checkToken;[\s\S]*if \(token !== this\.checkToken \|\| checkingName !== this\.new_name\) return;/,
    "rename nickname availability checks should ignore stale async responses"
);

assert.match(
    rename,
    /mounted:\s*function\s*\(\)\s*{[\s\S]*this\.isLogin && this\.checkPermission\(\);/,
    "rename page should not request login-only asset data while rendering the logged-out state"
);

assert.match(
    namespace,
    /if \(!this\.namespaceCard\.id\) \{[\s\S]*return this\.loadNamespaceCard\(\)\.then\(\(\) => \{[\s\S]*兑换信息暂不可用，请稍后再试/,
    "namespace exchange should show a clear unavailable message when the mall item is missing"
);

assert.match(
    namespace,
    /this\.\$notify\.success\(\{[\s\S]*铭牌数量已刷新[\s\S]*this\.done = true;/,
    "namespace exchange should enter the existing success result state after a successful purchase"
);

assert.match(
    mallExchangeError,
    /if \(canBuyInfo\.cny === false\) \{[\s\S]*金箔不足：需要/,
    "shared mall requirement messages should include cny insufficiency"
);
