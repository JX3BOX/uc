import {  $cms } from "@jx3box/jx3box-common/js/api.js";

// 获取我的清单
function getMyPlans(params) {
    return $cms()
        .get(`/api/cms/app/item-plan/mine`, { params })
        .then((res) => {
            return res.data.data;
        });
}
function getPlanByID(id) {
    return $cms()
        .get(`/api/cms/app/item-plan/${id}`)
        .then((res) => {
            return res.data.data;
        });
}
// 新增清单
function addMyPlans(params) {
    return $cms().post(`/api/cms/app/item-plan`, params);
}
// 修改我的清单
function postMyPlans(id, params) {
    return $cms().put(`/api/cms/app/item-plan/${id}`, params);
}
// 删除我的清单
function delMyPlans(id) {
    return $cms().delete(`/api/cms/app/item-plan/${id}`);
}

export {
    getMyPlans,
    delMyPlans,
    addMyPlans,
    postMyPlans,
    getPlanByID,
};
