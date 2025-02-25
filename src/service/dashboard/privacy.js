import { $cms, $next } from "@jx3box/jx3box-common/js/https";

function getKithList() {
    return $cms().get("/api/cms/user/kith/my");
}
function searchUserById(id) {
    return $cms().get(`/api/cms/user/${id}/info`);
}
function addKith(id) {
    return $cms().post(`/api/cms/user/kith/${id}`);
}

function removeKith(id) {
    return $cms().delete(`/api/cms/user/kith/${id}`);
}

function sortKith(data) {
    return $cms().put("/api/cms/user/kith", data);
}
function editKith(id, data) {
    return $cms().put(`/api/cms/user/kith/${id}`, data);
}

/**
 * 获取黑名单列表
 * @param {*} params 查询参数
 * @param {*} params.pageIndex 分页参数
 * @param {*} params.pageSize 分页参数
 * @param {*} params.user_id 用户id
 * @param {*} params.display_name 用户昵称
 * @returns
 */
function getBlackList(params) {
    return $next().get("/api/my-userlist/deny", {
        params
    });
}

/**
 * 获取我的关注列表
 * @param {*} param 参数
 * @param {*} param.pageIndex 页码
 * @param {*} param.pageSize 每页数量
 * @param {*} param.user_id 用户id
 * @param {*} param.display_name 用户昵称
 */
 function getMyFollowList(params) {
    return $next().get(`/api/my-userlist/follow`, {
        params
    })
}

/**
 * 获取我的粉丝列表
 * @param {*} param 参数
 * @param {*} param.pageIndex 页码
 * @param {*} param.pageSize 每页数量
 * @param {*} param.user_id 用户id
 * @param {*} param.display_name 用户昵称
 */
function getMyFansList(params) {
    return $next().get(`/api/my-userlist/follow-me`, {
        params
    })
}

/**
 * 关注用户
 * @param {*} userId 用户id
 */
 function follow(userId) {
    return $next().post(`/api/my-userlist/follow/${userId}`)
}

/**
 * 取消关注用户
 * @param {*} userId 用户id
 */
function unfollow(userId) {
    return $next().delete(`/api/my-userlist/follow/${userId}`)
}

/**
 * 拉黑用户
 * @param {*} userId 用户id
 */
function deny(userId) {
    return $next().post(`/api/my-userlist/deny/${userId}`)
}

/**
 * 取消拉黑用户
 * @param {*} userId 用户id
 */
function undeny(userId) {
    return $next().delete(`/api/my-userlist/deny/${userId}`)
}

/**
 * 移除粉丝
 * @param {*} userId 用户id
 */
function removeFans(userId) {
    return $next().delete(`/api/my-userlist/follow-me/${userId}`)
}


export {
    getKithList,
    editKith,
    removeKith,
    addKith,
    searchUserById,
    sortKith,

    getBlackList,
    getMyFollowList,
    getMyFansList,
    follow,
    unfollow,
    deny,
    undeny,
    removeFans
};
