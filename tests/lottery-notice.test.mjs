import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('../src/utils/lotteryNotice.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/gm, '').replace('export async function', 'async function');
function setup(prizes, history) {
    const context = { getBlindBox: async () => ({ data: { data: { prize: prizes } } }), getMyHistory: history };
    vm.runInNewContext(source, context);
    return context.getNoPrizeNotice;
}
const prizes = [{ id: 1, can_get_repeat: 0 }, { id: 2, can_get_repeat: 0 }];
test('集齐需核对本期所有奖品，跨页记录和字符串 ID 均可识别', async () => {
    const notice = setup(prizes, async params => {
        assert.equal(params.lucky_draw_id, 42);
        return { data: { data: { list: [{ prizes: [{ lucky_draw_prize_id: String(params.index) }] }], page: { total: 101 } } } };
    });
    assert.equal(await notice(42), 'vip.lottery.allPrizesCollected');
});
test('奖池耗尽但尚未集齐，不能显示全部获取', async () => {
    const notice = setup(prizes, async () => ({ data: { data: { list: [{ prizes: [{ lucky_draw_prize_id: 1 }] }], page: { total: 1 } } } }));
    assert.equal(await notice(42), 'vip.lottery.noAvailablePrizes');
});
test('可重复奖品、空奖池和查询失败均使用暂无奖品提示', async () => {
    for (const pool of [[], [{ id: 1, can_get_repeat: 1 }], prizes]) {
        assert.equal(await setup(pool, async () => { throw new Error('network'); })(42), 'vip.lottery.noAvailablePrizes');
    }
});
