import { $pay } from "@jx3box/jx3box-common/js/api";

function getOrderList(params) {
    return $pay().get("/api/order/list", {
        params,
    });
}

export { getOrderList };
