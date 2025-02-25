import { $cms } from "@jx3box/jx3box-common/js/https";

function getUserConf() {
    return $cms().get(`/api/cms/user/conf`);
}

// 批量获取用户信息
function getUserInfoByIds(ids) {
    return $cms().get(`/api/cms/user/list/info`, {
        params: {
            list: ids
        }
    });
}

function getUserInfo() {
    return $cms().get(`/api/cms/user/my/info`);
}


export { getUserConf, getUserInfoByIds,getUserInfo };
