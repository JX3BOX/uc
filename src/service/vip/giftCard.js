import { $pay } from "@jx3box/jx3box-common/js/api";

// 该接口的 40005 响应带有可展示的业务数据，不能交给通用业务拦截器丢弃。
const request = () => $pay({ interceptor: false, mute: true });

export function redeemGiftCard(code) {
    return request().post("/api/my/third-party-code/redeem", { code }, { timeout: 45000 });
}

export function getGiftCardHistory(params) {
    return request().get("/api/my/third-party-code/history", { params });
}
