import { getBlindBox, getMyHistory } from "@/service/vip/lottery";

// 61011 同时表示库存耗尽或用户已集齐，按本期奖品 ID 核对中奖记录。
export async function getNoPrizeNotice(id) {
    const fallback = "vip.lottery.noAvailablePrizes";
    try {
        const detail = await getBlindBox(id, { mute: true });
        const prizes = detail.data?.data?.prize || [];
        if (!prizes.length || prizes.some((prize) => Number(prize.can_get_repeat) !== 0 || !prize.id)) return fallback;
        const remaining = new Set(prizes.map((prize) => String(prize.id)));
        for (let index = 1; ; index++) {
            const response = await getMyHistory({ lucky_draw_id: id, status: 2, index, pageSize: 100 }, { mute: true });
            const data = response.data?.data || {};
            const list = data.list || [];
            for (const record of list) {
                for (const prize of record.prizes || []) remaining.delete(String(prize.lucky_draw_prize_id));
            }
            if (!remaining.size) return "vip.lottery.allPrizesCollected";
            if (!list.length || index >= Number(data.page?.pageTotal) || index * (Number(data.page?.pageSize) || 100) >= Number(data.page?.total)) return fallback;
        }
    } catch {
        return fallback;
    }
}
