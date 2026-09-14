import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/views/vip/lottery/index.vue', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\s*$/gm, '').replace('export default', 'globalThis.component =');
function setup(extra = {}) {
    const context = { History: {}, bindWechat: {}, normalizeMallImage: x => x, throttle: fn => fn, ...extra };
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
