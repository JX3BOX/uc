/*
 * @Author: iRuxu
 * @Date: 2022-06-08 14:23:24
 * @LastEditTime: 2022-07-19 14:34:21
 * @Description:
 */
import { $pay, $cms } from "@jx3box/jx3box-common/js/https";

function getBoxcoinCashHistory(params) {
    return $pay().get(`/api/my/boxcoin/cashout/history`, {
        params,
    });
}

function getBoxcoinGotHistory(params) {
    return $pay().get(`/api/my/boxcoin/bill`, {
        params,
    });
}

function cashBoxcoin(data, params) {
    return $pay().post(`/api/my/boxcoin/cashout`, data,{
        params
    });
}

function getBoxcoinConfig() {
    return $cms().get(`/api/cms/config`, {
        params: {
            key: "boxcoin_cashout_forbid_date",
        },
    });
}

function getBoxcoinOverview() {
    return $pay().get(`/api/my/boxcoin/overview`);
}

export { getBoxcoinCashHistory, getBoxcoinGotHistory, cashBoxcoin, getBoxcoinConfig, getBoxcoinOverview };
