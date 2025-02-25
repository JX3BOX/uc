import { $pay } from "@jx3box/jx3box-common/js/https";
// 获取地址列表
function getAddress(params) {
    return $pay().get(`/api/mall/ship-address`, params)
}
// 添加地址
function addAddress(data) {
    return $pay().post(`/api/mall/ship-address`, data)
}
// 更新地址
function updateAddress(id, data) {
    return $pay().put(`/api/mall/ship-address/${id}`, data)
}
// 删除地址
function delAddress(id) {
    return $pay().delete(`/api/mall/ship-address/${id}`)
}
// 设定默认地址
function defaultAddress(id) {
    return $pay().put(`/api/mall/ship-address/default/${id}`, )
}
// 获取我的订单
function getOrder(params) {
    return $pay().get(`/api/mall/my/orders`, { params })
}
// 更改订单的收货地址
function updateOrderAddress(orderId, addressId) {
    return $pay().put(`/api/mall/my/orders/${orderId}/bind-address/${addressId}`, )
}
// 修改订单备注
function updateOrderRemark(id, remark) {
    return $pay().put(`/api/mall/my/orders/${id}/remark`, { remark })
}
// 查看对应id的订单详情
function getOrderId(id) {
    return $pay().get(`/api/mall/my/orders/${id}`)
}
// 关闭订单
function closeOrder(id) {
    return $pay().put(`/api/mall/my/orders/${id}/cancel`, )
}
// 支付订单
function toPay(id) {
    return $pay().post(`/api/mall/my/orders/${id}/pay`);
}
// 确认收货
function toConfirm(id) {
    return $pay().post(`/api/mall/my/orders/${id}/received`);
}
// 获取虚拟商品
function getVirtual(params) { 
    return $pay().get(`/api/mall/my/virtual_goods`, { params });
}

// 商品评价
function goodsRate(data) {
    return $pay().post(`/api/mall/goods-rate`, data);
}
// 追评
function appendGoodsRate(id, data) {
    return $pay().post(`/api/mall/goods-rate/${id}/append-comments`,data);
}
// 删除评论
function delGoodsRate(id) {
    return $pay().delete(`/api/mall/goods-rate/${id}`);
}


export {
    getAddress,
    addAddress,
    updateAddress,
    delAddress,
    defaultAddress,
    getOrder,
    updateOrderAddress,
    updateOrderRemark,
    getOrderId,
    closeOrder,
    toPay,
    getVirtual,
    toConfirm,
    // 评价
    goodsRate,
    appendGoodsRate,
    delGoodsRate
};
