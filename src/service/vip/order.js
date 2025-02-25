import { $pay } from "@jx3box/jx3box-common/js/https";
import { $ipay } from '@/service/vip/api'

function checkOrder(id) {
    return $pay().get("/api/order", {
        params: {
            id: id,
        },
    });
}

function createOrder(params) {
    if (!params || !params.product_id) {
        return new Promise((resolve, reject) => {
            reject("[createOrder]创建订单参数不合法");
        });
    }
    return $ipay().get(`/pay/web/${params.pay_type}/buy`, {
        params: {
            productId: params.product_id,
            count: params.count || 1,
            return_url: params.return_url,
        },
    });
}

export { checkOrder, createOrder };
