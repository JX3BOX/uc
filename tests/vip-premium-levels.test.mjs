import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import dayjs from "dayjs";

const source = fs
    .readFileSync(new URL("../src/views/vip/premium/index.vue", import.meta.url), "utf8")
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;$/gm, "")
    .replace("export default", "globalThis.component =");
const levels = JSON.parse(
    fs.readFileSync(new URL("../node_modules/@jx3box/jx3box-common/data/jx3box.json", import.meta.url), "utf8")
).__userLevel;

function setup({ experience = 0, loggedIn = true, getAsset } = {}) {
    const requests = [];
    const orders = [];
    const confirmations = [];
    const context = {
        dayjs,
        User: {
            isLogin: () => loggedIn,
            getAsset: getAsset || (async () => ({ experience, points: 1000, pro_expire_date: "" })),
            getLevel: (exp) =>
                Number(Object.keys(levels).find((level) => exp >= levels[level][0] && exp < levels[level][1])),
            _isPRO: () => false,
            toLogin: () => requests.push("login"),
        },
        Privilege: {},
        Premium: {},
        simple_header: {},
        showDate: (date) => date,
        getItem: async (id) => {
            requests.push(id);
            return {
                data: { data: { id, price_points: { 160: 200, 387: 100, 388: 60 }[id], stock: 100, on_selling: 1 } },
            };
        },
        alertMallRequirement: () => assert.fail("unexpected requirements failure"),
        handleMallExchangeError: (_, error) => {
            throw error;
        },
        setTimeout,
    };
    vm.runInNewContext(source, context);
    const component = context.component;
    const page = component.data();
    Object.assign(page, {
        $t: (key, params) => ({ key, ...params }),
        $store: { commit() {}, dispatch: async (_, order) => orders.push(order) },
        $confirm: async (message) => confirmations.push(message),
        $notify: { success() {} },
    });
    for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page);
    for (const [key, getter] of Object.entries(component.computed))
        Object.defineProperty(page, key, { get: getter.bind(page) });
    page.refreshAssetAfterExchange = async () => {};
    return { page, requests, orders, confirmations, component };
}

test("level boundaries select the right product and confirm its actual price", async () => {
    for (const [experience, id, points] of [
        [0, 160, 200],
        [600, 160, 200],
        [899, 160, 200],
        [900, 387, 100],
        [1800, 387, 100],
        [3599, 387, 100],
        [3600, 388, 60],
        [14400, 388, 60],
        [50000, 388, 60],
    ]) {
        const { page, requests, orders, confirmations } = setup({ experience });
        await page.initializeExchange();
        assert.equal(page.premiumItemId, id);
        assert.deepEqual(requests, [id]);
        assert.equal(page.requiredPoints, points);
        await page.exchangePremium();
        assert.equal(orders[0].id, id);
        assert.equal(confirmations[0].points, points);
        assert.equal(page.isSubmitting, false);
    }
});

test("waits for assets before loading a product or allowing an exchange", async () => {
    let resolveAsset;
    const { page, requests, orders } = setup({
        getAsset: () =>
            new Promise((resolve) => {
                resolveAsset = resolve;
            }),
    });
    const pending = page.initializeExchange();
    await page.exchangePremium();
    assert.deepEqual(requests, []);
    assert.deepEqual(orders, []);
    resolveAsset({ experience: 3600, points: 1000 });
    await pending;
    assert.deepEqual(requests, [388]);
});

test("asset failure cannot fall back to an original-price purchase and can retry", async () => {
    let attempts = 0;
    const { page, requests, orders } = setup({
        getAsset: async () => {
            if (++attempts === 1) throw new Error("Asset unavailable");
            return { experience: 900, points: 1000 };
        },
    });
    await page.initializeExchange();
    assert.equal(page.loadError, "Asset unavailable");
    assert.equal(page.assetLoaded, false);
    assert.deepEqual(requests, []);
    await page.exchangePremium();
    assert.deepEqual(requests, [387]);
    assert.deepEqual(orders, []);
});

test("logged-out visitors see the base product and are sent to login", async () => {
    const { page, requests, orders } = setup({ loggedIn: false, getAsset: () => assert.fail("must not load assets") });
    await page.initializeExchange();
    await page.exchangePremium();
    assert.deepEqual(requests, [160, "login"]);
    assert.deepEqual(orders, []);
});

test("successful renewal immediately adds 30 days before asset synchronization finishes", async () => {
    const previous = "2045-12-04T00:00:00.000Z";
    const { page } = setup({ getAsset: async () => ({ experience: 3600, points: 1000, pro_expire_date: previous }) });
    await page.initializeExchange();
    let resolveRefresh;
    let startRefresh;
    const started = new Promise((resolve) => { startRefresh = resolve; });
    page.refreshAssetAfterExchange = () => {
        startRefresh();
        return new Promise((resolve) => { resolveRefresh = resolve; });
    };
    const exchange = page.exchangePremium();
    await started;
    assert.equal(page.asset.pro_expire_date, "2046-01-03T00:00:00.000Z");
    resolveRefresh();
    await exchange;
});

test("stale assets do not roll back renewals; server catches up without doubling days", async () => {
    let serverDate = "2045-12-04T00:00:00.000Z";
    const { page, component } = setup({ getAsset: async () => ({ experience: 3600, points: 1000, pro_expire_date: serverDate }) });
    await page.initializeExchange();
    page.refreshAssetAfterExchange = component.methods.refreshAssetAfterExchange.bind(page);
    page.wait = async () => {};
    await page.exchangePremium();
    assert.equal(page.asset.pro_expire_date, "2046-01-03T00:00:00.000Z");
    await page.exchangePremium();
    assert.equal(page.asset.pro_expire_date, "2046-02-02T00:00:00.000Z");
    serverDate = "2046-01-03T00:00:00.000Z";
    await page.loadAsset();
    assert.equal(page.asset.pro_expire_date, "2046-02-02T00:00:00.000Z");
    serverDate = "2046-02-02T00:00:00.000Z";
    await page.loadAsset();
    assert.equal(page.asset.pro_expire_date, serverDate);
    assert.equal(page.pendingExpireDate, "");
});

test("new or expired membership starts its 30 days from now", () => {
    for (const previous of ["", "2000-01-01T00:00:00.000Z"]) {
        const { page } = setup();
        const before = dayjs().add(30, "day").valueOf();
        page.extendPremiumAfterExchange(previous);
        const after = dayjs().add(30, "day").valueOf();
        const actual = dayjs(page.asset.pro_expire_date).valueOf();
        assert.ok(actual >= before && actual <= after);
    }
});

test("asset refresh errors preserve successful renewal and do not report purchase failure", async () => {
    let fail = false;
    const { page, component } = setup({ getAsset: async () => {
        if (fail) throw new Error("Network unavailable");
        return { experience: 3600, points: 1000, pro_expire_date: "2045-12-04T00:00:00.000Z" };
    } });
    await page.initializeExchange();
    fail = true;
    page.refreshAssetAfterExchange = component.methods.refreshAssetAfterExchange.bind(page);
    page.wait = async () => {};
    await page.exchangePremium();
    assert.equal(page.asset.pro_expire_date, "2046-01-03T00:00:00.000Z");
    assert.equal(page.isSubmitting, false);
});

test("failed purchase does not extend expiry", async () => {
    const { page } = setup();
    await page.initializeExchange();
    page.$store.dispatch = async () => { throw new Error("Payment failed"); };
    await assert.rejects(page.exchangePremium(), /Payment failed/);
    assert.equal(page.asset.pro_expire_date, "");
    assert.equal(page.pendingExpireDate, "");
});
