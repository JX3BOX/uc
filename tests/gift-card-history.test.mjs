import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import dayjs from "dayjs";
import { reactive } from "vue";

const source = fs.readFileSync(new URL("../src/views/dashboard/components/GiftCardHistory.vue", import.meta.url), "utf8");
const submissionSource = fs.readFileSync(new URL("../src/utils/giftCardSubmission.js", import.meta.url), "utf8").replace(/^import .*;$/gm, "").replace(/export function/g, "function");
const sharedContext = { reactive, User: { getInfo: () => ({ uid: 8719 }) } };
vm.runInNewContext(submissionSource, sharedContext);
const newSubmission = () => reactive({ submitting: false, lastSubmitted: {}, blockedUntil: 0 });
function createHistory(getHistory, redeem = async () => ({ data: { code: 0, data: { redemption_status: 3, grant_status: 4 } } }), query = {}, submission = newSubmission()) {
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm, "").replace("export default", "component =");
    const context = { component: null, GiftCardDialog: {}, dayjs, User: { getAsset: async () => ({ pro_expire_date: "2026-11-04" }) }, getGiftCardSubmissionState: () => submission, handleGiftCardLimit: sharedContext.handleGiftCardLimit, getGiftCardHistory: getHistory, redeemGiftCard: redeem };
    vm.runInNewContext(script, context);
    const notices = [];
    const message = (notice) => notices.push(notice);
    message.error = message.info = message.success = message;
    const instance = {
        $route: { query }, $router: { replace: () => {} }, $t: (key) => key, $message: message,
        $store: { commit: () => {} },
    };
    Object.assign(instance, context.component.data.call(instance));
    for (const [key, method] of Object.entries(context.component.methods)) instance[key] = method.bind(instance);
    for (const [key, getter] of Object.entries(context.component.computed || {})) Object.defineProperty(instance, key, { get: () => getter.call(instance) });
    return { instance, notices, user: context.User };
}
const pageResponse = (list = [], total = list.length, pageTotal = 1) => ({ data: { code: 0, data: { list, page: { total, pageTotal } } } });

test("history omits the all filter and preserves exact status zero with the documented paging keys", async () => {
    const requests = [];
    const { instance } = createHistory(async (params) => { requests.push({ ...params }); return pageResponse(); });
    await instance.loadHistory();
    assert.deepEqual(requests[0], { pageIndex: 1, pageSize: 15 });
    instance.grantStatus = 0;
    await instance.loadHistory();
    assert.deepEqual(requests[1], { pageIndex: 1, pageSize: 15, grant_status: 0 });
    assert.equal(instance.loading, false);
});

test("switching from another tab starts history on page one without inheriting its page or filter", () => {
    const { instance } = createHistory(async () => pageResponse(), undefined, { tab: "sn", page: "5", grant_status: "3" });
    assert.equal(instance.page, 1);
    assert.equal(instance.grantStatus, "all");
});

test("out of range history recovers to page one", async () => {
    const requests = [];
    const { instance } = createHistory(async (params) => { requests.push(params.pageIndex); return pageResponse(); }, undefined, { tab: "history", page: "99" });
    await instance.loadHistory();
    assert.deepEqual(requests, [99, 1]);
    assert.equal(instance.page, 1);
    assert.equal(instance.loading, false);
});

test("a slow previous filter response cannot overwrite the current result", async () => {
    let resolveOld;
    let calls = 0;
    const { instance } = createHistory(() => ++calls === 1 ? new Promise(resolve => { resolveOld = resolve; }) : Promise.resolve(pageResponse([{ id: 2 }])));
    const oldRequest = instance.loadHistory();
    instance.grantStatus = 4;
    await instance.loadHistory();
    resolveOld(pageResponse([{ id: 1 }]));
    await oldRequest;
    assert.equal(instance.list[0].id, 2);
    assert.equal(instance.loading, false);
});

test("business failures are displayed as errors instead of a successful empty history", async () => {
    const { instance } = createHistory(async () => ({ data: { code: 401, msg: "Login required" } }));
    await instance.loadHistory();
    assert.equal(instance.loadError, "Login required");
    assert.equal(instance.loading, false);
});

test("grant applications submit the exact row code and refresh even for business code 40005", async () => {
    const codes = [];
    let refreshed = 0;
    const { instance } = createHistory(async () => { refreshed++; return pageResponse(); }, async code => {
        codes.push(code);
        return { data: { code: 40005, data: { redemption_status: 3, grant_status: 3 } } };
    });
    await instance.applyGrant({ code: "Exact-Code", retryable: true, redemption_status: 3, grant_status: 3 });
    assert.deepEqual(codes, ["Exact-Code"]);
    assert.equal(refreshed, 1);
    assert.equal(instance.applyingCode, "");
    await instance.applyGrant({ code: "Busy-Code", retryable: true, redemption_status: 3, grant_status: 2 });
    await instance.applyGrant({ code: "Granted-Code", retryable: true, redemption_status: 3, grant_status: 4 });
    assert.equal(codes.length, 1);
});


test("a pending grant cannot reload history or change routes after leaving the tab", async () => {
    let resolveGrant;
    let requests = 0;
    const { instance } = createHistory(async () => { requests++; return pageResponse(); }, () => new Promise(resolve => { resolveGrant = resolve; }));
    const applying = instance.applyGrant({ code: "Pending-Code", retryable: true, redemption_status: 3, grant_status: 3 });
    instance.disposed = true;
    instance.requestId++;
    resolveGrant({ data: { code: 0, data: { redemption_status: 3, grant_status: 4 } } });
    await applying;
    assert.equal(requests, 0);
});


function createDialog(respond, submission = newSubmission()) {
    const source = fs.readFileSync(new URL("../src/views/vip/premium/components/GiftCardDialog.vue", import.meta.url), "utf8");
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm, "").replace("export default", "component =");
    const events = [];
    const context = { component: null, Present: {}, UserIcon: {}, User: { isLogin: () => true }, getGiftCardSubmissionState: () => submission, handleGiftCardLimit: sharedContext.handleGiftCardLimit, redeemGiftCard: respond };
    vm.runInNewContext(script, context);
    const instance = { ...context.component.data(), $t: key => key, $emit: event => events.push(event) };
    for (const [key, method] of Object.entries(context.component.methods)) instance[key] = method.bind(instance);
    for (const [key, definition] of Object.entries(context.component.computed)) {
        const get = typeof definition === "function" ? definition : definition.get;
        Object.defineProperty(instance, key, { get: () => get.call(instance), set: definition.set ? value => definition.set.call(instance, value) : undefined });
    }
    return { instance, events };
}

test("dialog validates empty and overlong Unicode codes without sending requests", async () => {
    let sent = 0;
    const { instance } = createDialog(async () => { sent++; });
    await instance.submitCode("  ");
    assert.equal(instance.formError, "vip.premium.giftCardRequired");
    await instance.submitCode("😀".repeat(65));
    assert.equal(instance.formError, "vip.premium.giftCardTooLong");
    assert.equal(sent, 0);
});

test("a valid Unicode code keeps its internal characters and original case", async () => {
    const sent = [];
    const { instance } = createDialog(async code => { sent.push(code); return { data: { code: 0, data: { redemption_status: 1, retryable: true } } }; });
    const code = "a b" + "😀".repeat(61);
    await instance.submitCode("  " + code + "  ");
    assert.equal(sent[0], code);
    assert.equal(instance.result.code, code);
});

for (const branch of ["success", "business-failure", "pending", "waiting", "network-error", "rate-limit", "busy-limit"]) {
    test(`dialog handles ${branch} without false completion or losing the retry code`, async () => {
        const cases = {
            success: { code: 0, data: { redemption_status: 3, grant_status: 4, code: "NORMALIZED" } },
            "business-failure": { code: 40005, data: { redemption_status: 2, grant_status: 0, message: "Not available", retryable: false } },
            pending: { code: 0, data: { redemption_status: 1, grant_status: 0, retryable: true } },
            waiting: { code: 0, data: { redemption_status: 3, grant_status: 1, retryable: true } },
            "rate-limit": { code: 407, msg: "请勿在2秒内重复提交同一核销码" },
            "busy-limit": { code: 407, msg: "正在处理，请稍后重试" },
        };
        const { instance, events } = createDialog(async () => {
            if (branch === "network-error") throw new Error("network");
            return { data: cases[branch] };
        });
        const previous = { code: "PREVIOUS", data: { redemption_status: 1 } };
        instance.result = previous;
        instance.inputCode = "Original";
        await instance.submitCode("Original");
        assert.equal(instance.submitting, false);
        if (branch === "success") {
            assert.equal(instance.inputCode, "");
            assert.deepEqual(events, ["redeemed"]);
        } else {
            assert.deepEqual(events, []);
            assert.equal(instance.inputCode, "Original");
            if (branch.includes("limit")) assert.equal(instance.result, previous);
            else assert.equal(instance.result.code, "Original");
            if (branch === "business-failure") assert.equal(instance.result.data.message, "Not available");
            if (branch === "network-error") assert.equal(instance.result.data.retryable, true);
        }
    });
}

test("history and dialog share in-flight and normalized-code cooldown guards", async () => {
    const submission = newSubmission();
    let finish, requests = 0;
    const history = createHistory(async () => pageResponse(), () => new Promise(resolve => { finish = resolve; }), {}, submission).instance;
    const dialog = createDialog(async () => { requests++; return { data: { code: 0, data: { redemption_status: 3, grant_status: 4 } } }; }, submission).instance;
    const pending = history.applyGrant({ code: "Same-Code", redemption_status: 3, grant_status: 3, retryable: true });
    await dialog.submitCode("Other-Code");
    assert.equal(requests, 0);
    finish({ data: { code: 0, data: { redemption_status: 3, grant_status: 4 } } });
    await pending;
    await dialog.submitCode("same-code");
    assert.equal(requests, 0);
});

test("a history lockout disables different codes in the dialog, keeps GET history usable, and does not extend the countdown", async () => {
    const submission = newSubmission();
    let historyRequests = 0, postRequests = 0;
    const { instance: history } = createHistory(async () => { historyRequests++; return pageResponse(); }, async () => ({ data: { code: 407, msg: "核销码连续校验失败5次，请60秒后重试" } }), {}, submission);
    await history.applyGrant({ code: "Original", redemption_status: 3, grant_status: 3, retryable: true });
    const blockedUntil = submission.blockedUntil;
    sharedContext.handleGiftCardLimit(submission, "核销码连续校验失败5次，请60秒后重试", "Other");
    assert.equal(submission.blockedUntil, blockedUntil);
    const { instance: dialog } = createDialog(async () => { postRequests++; }, submission);
    await dialog.submitCode("Different");
    assert.equal(postRequests, 0);
    assert.equal(historyRequests, 1);
});

test("an unconfirmed response with grant status four is not treated as a successful history grant", () => {
    const { instance, notices } = createHistory(async () => pageResponse());
    assert.equal(instance.notifyResult({ redemption_status: 1, grant_status: 4 }), false);
    assert.equal(notices[0].type, "info");
});

test("switching accounts resets the shared guard and prevents one account's lockout affecting another", () => {
    const first = sharedContext.getGiftCardSubmissionState();
    first.blockedUntil = Date.now() + 60000;
    sharedContext.User.getInfo = () => ({ uid: 8720 });
    const second = sharedContext.getGiftCardSubmissionState();
    assert.notEqual(second, first);
    assert.equal(second.blockedUntil, 0);
});


test("confirmed history grants refresh the shared member cache without committing a mall-only mutation", async () => {
    const { instance, user } = createHistory(async () => pageResponse());
    let refreshed = 0, committed = 0;
    user.getAsset = async () => { refreshed++; return { pro_expire_date: "2026-11-04" }; };
    instance.$store.commit = () => { committed++; };
    await instance.applyGrant({ code: "Granted", redemption_status: 3, grant_status: 3, retryable: true });
    assert.equal(refreshed, 1);
    assert.equal(committed, 0);
});

test("rejected HTTP responses containing business code 40005 preserve failure details", async () => {
    const { instance, events } = createDialog(async () => { throw { response: { data: { code: 40005, data: { redemption_status: 2, grant_status: 0, retryable: true, message: "Failure detail" } } } }; });
    await instance.submitCode("Original");
    assert.equal(instance.result.data.message, "Failure detail");
    assert.equal(instance.result.code, "Original");
    assert.deepEqual(events, []);
});

test("retrying an unknown result submits its original code after the input has been edited", async () => {
    const sent = [];
    const { instance } = createDialog(async code => { sent.push(code); return { data: { code: 0, data: { redemption_status: 1, retryable: true } } }; });
    await instance.submitCode("Original");
    instance.inputCode = "New input";
    instance.submission.lastSubmitted = {};
    await instance.submitCode(instance.result.code);
    assert.deepEqual(sent, ["Original", "Original"]);
});
