import { $pay, $cms } from "@jx3box/jx3box-common/js/https";
import { __cdn } from "@/utils/config";
import axios from "axios";
function getItem(id) {
    return $pay().get(`/api/mall/items/${id}`);
}

function getItemList(params) {
    return $pay().get(`/api/mall/items`, { params });
}

function getAddress() {
    return $pay().get(`/api/mall/ship-address`);
}

function toPayOrder(id, count, addressId, remark) {
    return $pay().post(`/api/mall/order/item/${id}/count/${count}/to/${addressId}`, { remark });
}

function toPay(id) {
    return $pay().post(`/api/mall/my/orders/${id}/pay`);
}

function updateAddress(id) {
    return $pay().put(`/api/mall/ship-address/default/${id}`);
}

function getMyAddress() {
    return $pay().get(`/api/mall/ship-address/default`);
}
//获取用户购买成功过的商品
function buyHistory(id) {
    return $pay().get(`/api/mall/items/${id}/buy-history`);
}

// 获取商品评价
function getGoodsRate(params) {
    return $pay().get(`/api/mall/goods-rate`, { params });
}
// 删除评论
function delGoodsRate(id) {
    return $pay().delete(`/api/mall/goods-rate/${id}`);
}
// 盒子娘回复
function goodsRate(id, data) {
    return $pay().post(`/api/mall/goods-rate/${id}/reply`, data);
}
function giveAway(id, userId, count, data) {
    return $pay().post(`/api/mall/order/virtural-item/${id}/count/${count}/as_gift/to/${userId}`, data);
}
//是否已经拥护该商品,未登录返回false, 登录则会去数据库检查
function checkOwnedStatus(id) {
    return $pay().get(`/api/mall/items/${id}/check-owned-status`);
}
// 获取魔卡皮肤json
function getSkinJson() {
    let url = __cdn + `design/decoration/community_skin.json`;
    return axios.get(url);
}

// 批量购物车
function batchMakeOrder(data) {
    return $pay().post(`/api/mall/order/batch/make`, data);
}

function batchPayOrder(data) {
    return $pay().post(`/api/mall/order/batch/pay`, data);
}

// 用户装扮
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}

export {
    getSkinJson,
    getItem,
    getItemList,
    getAddress,
    toPay,
    updateAddress,
    getMyAddress,
    toPayOrder,
    buyHistory,
    getGoodsRate,
    goodsRate,
    delGoodsRate,
    giveAway,
    checkOwnedStatus,
    batchMakeOrder,
    batchPayOrder,
    getDecoration,
};
