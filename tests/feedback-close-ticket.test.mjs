import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const service = fs.readFileSync(path.join(root, "src/service/dashboard/feedback.js"), "utf8");
const page = fs.readFileSync(path.join(root, "src/components/dashboard/feedback/single.vue"), "utf8");

assert.match(
    service,
    /function closeMyFeedback\(id,\s*data\)\s*{[\s\S]*miscfeedback\/my\/item\/\$\{id\}\/close[\s\S]*}/,
    "service should expose closeMyFeedback using the user close endpoint"
);

assert.match(
    service,
    /function urgeMyFeedback\(id\)\s*{[\s\S]*\$next\(\)\.post\(`\/api\/next2\/miscfeedback\/item\/\$\{id\}\/urgent`\)[\s\S]*}/,
    "service should expose urgeMyFeedback using the urgent endpoint"
);

assert.match(
    page,
    /<el-button[\s\S]*class="u-action-btn is-cancel"[\s\S]*icon="CircleClose"[\s\S]*取消工单[\s\S]*<\/el-button>[\s\S]*<el-dropdown/,
    "feedback detail should render cancel ticket button with icon before the deal dropdown"
);

assert.match(
    page,
    /isTicketOwner\(\)[\s\S]*const user = User\.getInfo\(\)[\s\S]*const ownerId = Number\(this\.data\?\.user_id \|\| this\.data\?\.user\?\.id\)[\s\S]*User\.isLogin\(\) && Number\(user\?\.uid\) === ownerId[\s\S]*isTicketFinalStatus\(\)[\s\S]*\[10,\s*11,\s*12\]\.includes\(Number\(this\.data\?\.status\)\)[\s\S]*canCancelTicket\(\)[\s\S]*this\.isTicketOwner && !this\.isTicketFinalStatus/,
    "cancel ticket button should only be available to the ticket owner before processed, closed, or settled statuses"
);

assert.match(
    page,
    /closeMyFeedback\(this\.id,\s*{\s*remark\s*}\)/,
    "cancel ticket should call closeMyFeedback with only remark in the payload"
);

assert.match(
    page,
    /<el-button[\s\S]*class="u-action-btn is-urgent"[\s\S]*icon="Bell"[\s\S]*催单[\s\S]*<\/el-button>[\s\S]*<el-dropdown/,
    "feedback detail should render urge ticket button with icon before the deal dropdown"
);

assert.match(
    fs.readFileSync(path.join(root, "src/assets/css/dashboard/feedback_single.less"), "utf8"),
    /\.m-actions[\s\S]*gap:\s*12px[\s\S]*>\s*\*[\s\S]*margin-left:\s*0 !important[\s\S]*\.u-action-btn[\s\S]*height:\s*32px/,
    "feedback action buttons should have one consistent gap and stable button sizing"
);

assert.match(
    page,
    /hasUrgedTicket\(\)[\s\S]*Boolean\(this\.data\?\.is_urgent\)[\s\S]*canUrgeTicket\(\)[\s\S]*this\.isTicketOwner[\s\S]*!\[0,\s*10,\s*11,\s*12\]\.includes\(Number\(this\.data\?\.status\)\)[\s\S]*!this\.hasUrgedTicket/,
    "urge ticket button should only be available to the ticket owner after assignment and before final statuses once"
);

assert.match(
    page,
    /urgeMyFeedback\(this\.id\)/,
    "urge ticket should call urgeMyFeedback"
);
