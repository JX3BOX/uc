import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(path.join(root, "src/views/vip/rename.vue"), "utf8");
const style = fs.readFileSync(path.join(root, "src/assets/css/vip/rename.less"), "utf8");

assert.match(
    page,
    /submit:\s*function\s*\(\)\s*{[\s\S]*doRename\(this\.new_name\)[\s\S]*User\.destroy\(\)[\s\S]*this\.done\s*=\s*true/,
    "rename submit should call doRename with the typed nickname and enter success state after clearing the user session"
);

assert.match(
    page,
    /checkPermission:\s*function\s*\(minRenameCount\s*=\s*0\)\s*{[\s\S]*const count\s*=\s*Math\.max\(~~data\.rename_card_count,\s*minRenameCount\)[\s\S]*rename_card_count:\s*count[\s\S]*this\.count\s*=\s*count/,
    "asset refresh should keep at least the locally expected rename-card count so a stale asset response cannot hide a successful exchange"
);

assert.match(
    page,
    /this\.isBuying\s*=\s*true;\s*const nextCount\s*=\s*this\.count\s*\+\s*1;[\s\S]*dispatch\("mallNew\/buyGoods"[\s\S]*id:\s*this\.renameCardId[\s\S]*count:\s*1[\s\S]*remark:\s*"改名次数积分兑换"[\s\S]*this\.checkPermission\(nextCount\)/,
    "successful exchange should buy one rename card and refresh the page count with the current count plus one as the minimum"
);

assert.match(
    page,
    /this\.\$confirm\(`确认消耗\$\{Number\(this\.renameCard\.price_points\) \|\| 0\}积分兑换一次改名卡吗？`,\s*"确认兑换"/,
    "exchange confirmation should show the current point cost before buying a rename card"
);

assert.match(
    page,
    /<el-input[\s\S]*v-model="new_name"[\s\S]*show-word-limit[\s\S]*:maxlength="20"[\s\S]*:minlength="2"[\s\S]*@input="checkName"[\s\S]*:disabled="!count"/,
    "nickname input should keep length limits, availability checking, and no-count disabling"
);

assert.match(
    style,
    /\.m-rename-page\.m-vip-container\s*{[\s\S]*\.mt\(@header-height\);/,
    "rename page should not reserve breadcrumb height when no breadcrumb is rendered"
);
