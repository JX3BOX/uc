import { $cms } from "@jx3box/jx3box-common/js/https";
// 获取用户meta
export function getUserMeta(params) {
    return $cms().get(`/api/cms/user/my/meta`, { params }).then((res) => {
        return res.data.data;
    });
}

// 设置用户meta
export function setUserMeta(key, data) {
    return $cms().post(`/api/cms/user/my/meta?key=${key}`, data);
}

// 获取config
export function getConfig(params) {
    return $cms().get(`/api/cms/config`, { params }).then((res) => {
        return res.data.data;
    });
}

// 获取公告
export async function getBreadcrumb(key) {
    const res = await $cms()
        .get(`/api/cms/breadcrumb/${key}`);
    return res?.data?.data?.html || "";
}