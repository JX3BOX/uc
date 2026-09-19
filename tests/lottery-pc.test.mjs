import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/views/vip/lottery/index.vue', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\s*$/gm, '').replace('export default', 'globalThis.component =');
function setup(extra = {}) {
    const context = { Present: {}, History: {}, bindWechat: {}, normalizeMallImage: x => x, throttle: fn => fn, ...extra };
    vm.runInNewContext(script, context);
    const state = { ...context.component.data(), $route: { query: {} } };
    for (const [key, method] of Object.entries(context.component.methods)) state[key] = method.bind(state);
    for (const [key, getter] of Object.entries(context.component.computed)) Object.defineProperty(state, key, { get: getter.bind(state) });
    return state;
}

test('未开始或结束时，所有抽奖入口均不提交', () => {
    for (const dates of [{ activityStart: '2999-01-01' }, { activityEnd: '2000-01-01' }]) {
        let count = 0;
        const state = setup({ goodLucky: () => { count++; } });
        Object.assign(state, { activityState: 'ready', ...dates });
        state.change(1);
        state.openBox('all');
        state.hasLucky();
        assert.equal(count, 0);
        assert.equal(state.activityReady, false);
    }
});

test('详情失败只切换页面状态，不弹窗且清空旧奖池', async () => {
    const state = setup({ getBlindBox: async (id, options) => {
        assert.equal(options.mute, true);
        throw { data: { code: 61000 } };
    } });
    state.draw = [[1, 1], [10, 10]];
    state.$alert = () => assert.fail('不应弹窗');
    await state.load();
    assert.equal(state.activityState, 'pending');
    assert.equal(state.draw.length, 0);
    assert.equal(state.activityReady, false);
});

test('奖品速览库存处理零总量、异常值和超额抽出，不产生 NaN 进度', () => {
    const state = setup();
    state.previewList = [
        { prize_count: 10, be_won_count: 3 },
        { prize_count: 0, be_won_count: 0 },
        { prize_count: 5, be_won_count: 8 },
        { prize_count: 'invalid', be_won_count: null },
        { prize_count: '20', be_won_count: '5' },
        { unlimited: true },
    ];
    const expected = [[7, 70], [0, 0], [0, 0], [0, 0], [15, 75], [0, 0]];
    state.previewCards.forEach((item, index) => {
        assert.equal(item.remaining, expected[index][0]);
        assert.equal(item.percentage, expected[index][1]);
    });
    assert.equal(state.previewCards[5].unlimited, true);
});

test('单抽和十连按次数匹配价格，不按配置下标取价', () => {
    const state = setup();
    state.draw = Array.from({ length: 10 }, (_, i) => [i + 1, Math.min(i + 1, 8)]);
    assert.equal(state.singleDrawCost, 1);
    assert.equal(state.tenDrawCost, 8);
    state.draw.reverse();
    assert.equal(state.singleDrawCost, 1);
    assert.equal(state.tenDrawCost, 8);
    state.draw = [['10', '8'], ['1', '1']];
    assert.equal(state.singleDrawCost, 1);
    assert.equal(state.tenDrawCost, 8);
    state.draw = [[1, 1], [2, 2]];
    assert.equal(state.tenDrawCost, null);
});

test('十连余额不足时不提交，余额足够时仍提交 batch=10', () => {
    let submitted = [];
    const state = setup({ goodLucky: (id, batch) => {
        submitted.push(batch);
        return Promise.resolve({ data: { data: {} } });
    } });
    state.draw = [[1, 1], [2, 2], [10, 8]];
    Object.assign(state, { event_status: true, activityState: 'ready', allActive: true, points: 2 });
    state.hasLucky();
    assert.equal(submitted.length, 0);
    state.points = 8;
    state.myPoints = () => {};
    state.hasLucky();
    assert.deepEqual(submitted, [10]);
});
