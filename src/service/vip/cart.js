import { $pay } from "@jx3box/jx3box-common/js/https";

// 获取购物车内容
export function getCart() {
    return $pay().get(`/api/mall/my/shopping-car`);
}

export function addGoodsToCart(goods_id, amount) {
    return $pay().post(`/api/mall/my/shopping-car/add/goods/${goods_id}/amount/${amount}`);
}

// 清空购物车
export function deleteCart() {
    return $pay().delete(`/api/mall/my/shopping-car/clear`);
}

export function deleteCartGoods(shopping_item_id) {
    return $pay().delete(`/api/mall/my/shopping-car/item/${shopping_item_id}`);
}

export function updateGoodsNum(shopping_item_id, amount) {
    return $pay().put(`/api/mall/my/shopping-car/item/${shopping_item_id}/amount/${amount}`);
}

// 批量购物车
export function batchMakeOrder(data) {
    return $pay().post(`/api/mall/order/batch/make`, data);
}

export function batchPayOrder(data) {
    return $pay().post(`/api/mall/order/batch/pay`, data);
}
