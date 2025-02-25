import { $pay } from "@jx3box/jx3box-common/js/https";

function getOrderList(params) {
    return $pay().get("/api/order/list", {
        params,
    });
}

export { getOrderList };
