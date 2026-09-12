import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/views/vip/lottery/index-app.vue', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\s*$/gm, '').replace('export default', 'globalThis.component =');
function setup(overrides = {}) {
    const context = { bindWechat: {}, ScratchSurface: {}, normalizeMallImage: x => x,
        User: { isLogin: () => true }, __cdn: '', ...overrides };
    vm.runInNewContext(script, context);
    const component = context.component;
    const state = { ...component.data(), $route: { query: {} },
        $message: { success() {}, warning() {}, error() {} }, ...overrides.state };
    for (const [key, method] of Object.entries(component.methods)) state[key] = method.bind(state);
    for (const [key, getter] of Object.entries(component.computed))
        Object.defineProperty(state, key, { get: getter.bind(state) });
    return { state, component };
}

test('兑换只预留本页面次数，重新进入为零，九连抽按积分启用', () => {
    const { state } = setup({ state: { points: 90, draw: [[1, 10], [9, 90]] } });
    assert.equal(state.remainingCount, 0);
    assert.equal(state.canDrawNine, true);
    state.exchange(9);
    assert.equal(state.remainingCount, 9);
    assert.equal(state.points, 90);
    assert.equal(state.exchangeableCount, 0);
    assert.equal(state.canDrawNine, true);
    state.points = 89;
    assert.equal(state.canDrawNine, false);
    assert.equal(setup().state.remainingCount, 0);
});

test('不足九张补相同谢谢惠顾，首页编号全部固定', () => {
    const { state } = setup();
    state.batchPrizes = [{ name: '奖品', img: 'prize.jpg' }];
    assert.equal(state.batchPagePrizes.length, 9);
    assert.ok(state.batchPagePrizes.slice(1).every(p => p.name === '谢谢惠顾' && p.img.endsWith('miss.jpg')));
    state.buildCards();
    assert.equal(state.cardList.length, 4);
    assert.ok(state.cardList.every(p => p.no === '9999999999'));
});

test('全部刮完按九次拆分，末组按剩余次数请求', () => {
    for (const [total, expected] of [[0, []], [1, [1]], [9, [9]], [18, [9, 9]], [20, [9, 9, 2]]]) {
        const { state } = setup({ state: { remainingCount: total } });
        let rounds = [];
        state.openBatchScratch = value => { rounds = Array.from(value); };
        state.scratchAll();
        assert.deepEqual(rounds, expected);
    }
});

test('首组九张返回即可刮，下一组 batch=9 请求后台进行', async () => {
    let releaseSecond;
    const batches = [];
    const { state } = setup({ goodLucky: async (id, batch) => {
        batches.push(batch);
        if (batches.length === 2) await new Promise(resolve => { releaseSecond = resolve; });
        return { data: { data: { id: batches.length } } };
    }, state: { remainingCount: 18, points: 180, draw: [[1, 10], [9, 90]],
        batchPrizes: new Array(18).fill(null), batchRounds: [9, 9] } });
    state.fetchPrize = async () => new Array(9).fill(state.thanksPrize());
    const running = state.runBatchRounds([9, 9]);
    for (let i = 0; i < 6; i++) await Promise.resolve();
    assert.deepEqual(batches, [9, 9]);
    assert.equal(state.batchPageHasResult, true);
    assert.equal(state.batchReady, true);
    assert.equal(state.batchPrizes[9], null);
    assert.equal(state.remainingCount, 9);
    state.batchPage = 1;
    assert.equal(state.batchReady, false);
    releaseSecond();
    await running;
    assert.equal(state.batchReady, true);
    assert.equal(state.remainingCount, 0);
    assert.equal(state.points, 0);
});

test('后续提交失败保留已返回奖品和未提交次数', async () => {
    let requests = 0;
    const { state } = setup({ goodLucky: async () => {
        if (++requests === 2) throw new Error('network');
        return { data: { data: { id: 1 } } };
    }, state: { remainingCount: 2, points: 20, draw: [[1, 10]], batchPrizes: [null, null], batchRounds: [1, 1], showBatchScratch: true } });
    state.fetchPrize = async () => [{ name: '实际奖品', img: 'prize.jpg' }];
    await state.runBatchRounds([1, 1]);
    assert.equal(state.remainingCount, 1);
    assert.equal(state.points, 10);
    assert.equal(state.showBatchScratch, true);
    assert.equal(state.batchPrizes.length, 2);
    assert.equal(state.batchPrizes[1], null);
    assert.ok(state.drawError);
    assert.equal(state.batchPrizes[0].name, '实际奖品');
});


test('真实待返回卡片显示加载，只有超出次数的空位补谢谢惠顾', () => {
    const { state } = setup({ state: { batchPrizes: [null] } });
    assert.equal(state.batchPagePrizes[0], null);
    assert.ok(state.batchPagePrizes.slice(1).every(p => p.name === '谢谢惠顾'));
    state.batchRevealed = true;
    state.showBatchScratch = true;
    state.claimBatch();
    assert.equal(state.showBatchScratch, true);
});

test('单卡先刮完仍不能领取，结果返回不重置刮开状态', async () => {
    let resolvePrize;
    const { state } = setup({ goodLucky: async () => ({ data: { data: { id: 123 } } }),
        state: { remainingCount: 1, points: 10, draw: [[1, 10]], user: { wechat_mp_openid: 'test' } } });
    state.fetchPrize = () => new Promise(resolve => { resolvePrize = resolve; });
    const running = state.openSingleScratch(null, null);
    assert.equal(state.showSingleScratch, true);
    state.scratchFinished = true;
    state.claimSingle();
    assert.equal(state.showSingleScratch, true);
    await Promise.resolve();
    resolvePrize([{ name: '实际奖品', img: 'prize.jpg' }]);
    await running;
    assert.equal(state.scratchFinished, true);
    assert.equal(state.currentPrize.name, '实际奖品');
    state.claimSingle();
    assert.equal(state.showSingleScratch, false);
});

test('批次查询失败重试原记录，不重新提交或重复扣除，保留刮痕状态', async () => {
    let submissions = 0;
    const queried = [];
    const { state } = setup({ goodLucky: async () => {
        submissions++;
        return { data: { data: { id: 321 } } };
    }, state: { remainingCount: 9, points: 90, draw: [[9, 90]],
        batchPrizes: new Array(9).fill(null), batchRounds: [9], batchRevealed: true } });
    state.fetchPrize = async id => { queried.push(id); throw new Error('timeout'); };
    await state.runBatchRounds([9]);
    assert.equal(state.pendingRecord.id, 321);
    assert.ok(state.drawError);
    state.fetchPrize = async id => { queried.push(id); return [state.thanksPrize()]; };
    await state.retryDrawResult();
    assert.deepEqual(queried, [321, 321]);
    assert.equal(submissions, 1);
    assert.equal(state.remainingCount, 0);
    assert.equal(state.points, 0);
    assert.equal(state.batchRevealed, true);
    assert.equal(state.batchReady, true);
    assert.equal(state.drawError, '');
});
