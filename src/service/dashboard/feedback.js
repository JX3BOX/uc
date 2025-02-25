import { $pay, $next, $cms } from "@jx3box/jx3box-common/js/https";

/**
 * 用户注销
 */
function leave(password) {
    return $pay().post(`/api/im-sure-leave-jx3box`, {
        password,
    });
}

/**
 * 提交反馈
 * @param {*} data
 */
function feedback(data) {
    return $next().post(`/api/next2/miscfeedback`, data);
}

/**
 * 获取反馈列表
 * @param {*} params 参数
 */
function getMiscfeedback(params) {
    return $next().get(`/api/next2/miscfeedback/manager/list`, {
        params,
    });
}

/**
 * 获取我的反馈列表
 * @param {*} params 筛选参数
 * @param {*} params.pageIndex 分页参数
 * @param {*} params.pageSize 分页参数
 */
function getFeedbackList(params) {
    return $next().get(`/api/next2/miscfeedback/my/list`, {
        params,
    });
}

/**
 * 获取单个反馈
 * @param {*} id 反馈id
 */
function getFeedback(id) {
    return $next().get(`/api/next2/miscfeedback/item/${id}`);
}

function getFeedbackLog(id) {
    return $next().get(`/api/next2/miscfeedback/item/${id}/history`);
}

/**
 * 更新反馈
 * @param {*} id 反馈id
 * @param {*} data 更新数据
 */
function updateFeedback(id, data) {
    return $next().put(`/api/next2/miscfeedback/manager/item/${id}/edit`, data);
}
/**
 * 获取反馈assign名单
 */
function getTeammates() {
    return $cms()
        .get(`/api/cms/account/teammate`)
        .then((res) => {
            return res.data.data;
        });
}

// 指派
function assignMiscFeedback(id, data) {
    return $next().put(`/api/next2/miscfeedback/manager/item/${id}/dispatch`, data);
}

// 切换工单状态
function switchMiscFeedback(id, data) {
    return $next().put(`/api/next2/miscfeedback/manager/item/${id}/status`, data);
}

// 转交工单
function transferMiscFeedback(id, data) {
    return $next().put(`/api/next2/miscfeedback/manager/item/${id}/transfer`, data);
}

// 协同
function coordinationMiscFeedback(id, data) {
    return $next().put(`/api/next2/miscfeedback/manager/item/${id}/coordination`, data);
}

export {
    leave,
    feedback,
    getFeedbackList,
    getFeedback,
    getMiscfeedback,
    getFeedbackLog,
    updateFeedback,
    getTeammates,
    assignMiscFeedback,
    switchMiscFeedback,
    transferMiscFeedback,
    coordinationMiscFeedback,
};
