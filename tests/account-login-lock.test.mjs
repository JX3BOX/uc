import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import vm from "node:vm";

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
function setup(query = async () => ({ data: { data: { locked: false } } })) {
    const storage = new Map();
    const timers = new Map();
    const context = vm.createContext({
        Date, Number, Object, String, JSON,
        sessionStorage: { getItem: (k) => storage.get(k), setItem: (k, v) => storage.set(k, v) },
        window: { setInterval: (fn) => { timers.set(1, fn); return 1; }, clearInterval: () => timers.delete(1), setTimeout: (fn) => { timers.set(2, fn); return 2; }, clearTimeout: () => timers.delete(2) },
        document: { visibilityState: "visible" },
        getLoginLockStatus: query,
        isValidAccountLogin: (value) => value.includes("@"),
        User: { isLogin: () => false, getInfo: () => ({}) },
        __Root: "", CardHeader: {}, Union: {}, Msg: {},
    });
    vm.runInContext(read("src/utils/account/login-lock.js").replaceAll("export function", "function"), context);
    const script = read("src/views/account/Login.vue").split("<script>")[1].split("</script>")[0].replace(/^import .*;\n/gm, "").replace("export default", "globalThis.component =");
    vm.runInContext(script, context);
    const c = context.component;
    const instance = { $t: (key) => key, ...c.data.call({ $t: (key) => key }) };
    for (const [name, method] of Object.entries(c.methods)) instance[name] = method.bind(instance);
    for (const [name, get] of Object.entries(c.computed)) Object.defineProperty(instance, name, { get: get.bind(instance) });
    instance.form.account = "a@example.com";
    instance.lockPageActive = true;
    return { instance, context, timers };
}
const lockError = (seconds) => ({ response: { data: { code: 20035, data: { retry_after: seconds }, msg: "locked" } } });

test("lock error keeps form visible, blocks submission and persists deadline", async () => {
    const { instance: v, context } = setup();
    v.handleLoginError(lockError(90), v.form.account);
    assert.equal(v.success, null);
    assert.equal(v.lockSeconds, 90);
    assert.equal(v.lockTimeText, "00:01:30");
    await v.submit(); // Must return before accessing form validation or sending a request.
    assert.ok(vm.runInContext('readLoginLocks()["a@example.com"]', context));
    v.form.account = "b@example.com";
    assert.equal(v.lockSeconds, 0);
    v.form.account = "a@example.com";
    assert.equal(v.lockSeconds, 90);
    v.lockNow += 90000;
    assert.equal(v.lockSeconds, 0);
});

test("backend early unlock restores login", async () => {
    const { instance: v } = setup();
    v.handleLoginError(lockError(90), v.form.account);
    await v.syncLoginLock();
    assert.equal(v.lockSeconds, 0);
});

test("network failure and malformed status preserve a known lock", async () => {
    for (const query of [async () => { throw Error("offline"); }, async () => ({ data: {} })]) {
        const { instance: v } = setup(query);
        v.handleLoginError(lockError(90), v.form.account);
        await v.syncLoginLock();
        assert.equal(v.lockSeconds, 90);
    }
});

test("stale query cannot overwrite another account or a newer login failure", async () => {
    let resolve;
    const { instance: v } = setup(() => new Promise((r) => { resolve = r; }));
    const pending = v.syncLoginLock();
    v.handleLoginError(lockError(90), v.form.account);
    resolve({ data: { data: { locked: false } } });
    await pending;
    assert.equal(v.lockSeconds, 90);
    const other = v.syncLoginLock();
    v.form.account = "b@example.com";
    resolve({ data: { data: { locked: true, retry_after: 100 } } });
    await other;
    assert.equal(v.lockSeconds, 0);
});

test("reentry syncs status and stopping cancels timers and in-flight updates", async () => {
    let resolve;
    const { instance: v, timers } = setup(() => new Promise((r) => { resolve = r; }));
    v.startLockClock();
    assert.equal(timers.size, 1);
    v.scheduleLockSync();
    assert.equal(timers.size, 2);
    v.stopLockClock();
    assert.equal(timers.size, 0);
    resolve({ data: { data: { locked: true, retry_after: 90 } } });
    await Promise.resolve();
    assert.equal(v.lockSeconds, 0);
});

test("legacy errors do not invent a countdown", () => {
    const { instance: v } = setup();
    v.handleLoginError(lockError(undefined), v.form.account);
    assert.equal(v.lockSeconds, 0);
    assert.equal(v.success, false);
    assert.equal(v.errors, "locked");
});
