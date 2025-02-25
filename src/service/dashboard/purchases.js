import { $pay} from "@jx3box/jx3box-common/js/https";

/**
 * 获取我购买的作品列表
 * @param {Object} params
 * @returns
 */
export function getPurchases(params) {
    return $pay().get("/api/buy-licence/history", {
        params,
    });
}
