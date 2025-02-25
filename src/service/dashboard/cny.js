import { $pay } from "@jx3box/jx3box-common/js/https";

// 申请提现
export const cashOut = function (data){
    return $pay().post('/api/cny/cashout/apply',data)
}

// 余额查询
export const getBalance = function (){
    return $pay().get("/api/vip/i").then((res) => {
        return res.data.data.cny || 0
    })
}

// 历史记录
export function getHistory(params){
    return $pay().get(`/api/my/cny/history`,{
        params,
    })
}

