import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/views/vip/lottery/ScratchSurface.vue', import.meta.url), 'utf8');
const context = { window: { removeEventListener() {} } };
vm.runInNewContext(source.match(/<script>([\s\S]*?)<\/script>/)[1].replace('export default', 'globalThis.component ='), context);
function setup(canvas) {
    const state = { $refs: { canvas }, finished: new Set(), regions: [{ x: 0, y: 0, width: 20, height: 20 }],
        drawing: true, last: { x: 1, y: 1 }, $emit: () => assert.fail('关闭后不应领取奖品') };
    for (const [key, method] of Object.entries(context.component.methods)) state[key] = method.bind(state);
    return state;
}

test('画布已移除时，残留的触摸和鼠标事件不会抛错', () => {
    for (const method of ['start', 'move', 'end']) {
        const state = setup(null);
        assert.doesNotThrow(() => state[method]({ type: 'touchstart', touches: [{ clientX: 10, clientY: 10 }] }));
        assert.equal(state.drawing, false);
    }
});

test('卸载清除刮卡状态，过渡动画期间不再读取画布或绘制', () => {
    const state = setup({ getBoundingClientRect: () => assert.fail('卸载后不应访问画布') });
    state.coverImage = { onload() {} };
    context.component.beforeUnmount.call(state);
    assert.equal(state.drawing, false);
    assert.equal(state.last, null);
    assert.equal(state.coverImage.onload, null);
    for (const method of ['start', 'move', 'end', 'paint', 'resize']) state[method]({});
});

test('隐藏的零尺寸画布不会启动刮卡', () => {
    const state = setup({ getBoundingClientRect: () => ({ width: 0, height: 0 }) });
    state.start({ type: 'touchstart' });
    assert.equal(state.drawing, false);
});
