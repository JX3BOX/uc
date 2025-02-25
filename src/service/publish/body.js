import { $next } from "@jx3box/jx3box-common/js/https";

// 获取自己的捏脸列表 
export function getBodyList(params) {
    return $next().get("/api/pvxbody/my-list", { params });
}
// 获取单个体型
export function getBody(id) {
    return $next().get(`/api/pvxbody/${id}`);
}

// 上传体型
export function uploadBodyFile(data) {
    return $next().post("/api/pvxbody/file-upload", data);
}

// 添加体型
export function addBody(data) {
    return $next().post("/api/pvxbody", data);
}

// 更新体型
export function updateBody(id, data) {
    return $next().put(`/api/pvxbody/${id}`, data);
}

// 上架 
export function bodyOnline(id) {
    return $next().put(`/api/pvxbody/${id}/online`);
}

// 下架 
export function bodyOffline(id) {
    return $next().put(`/api/pvxbody/${id}/offline`);
}

//  作品关联的附件 
export function getAttachmentOfPost(postId) {
    return $next().get(`/api/charge_attachment/pvxbody/${postId}/edit`);
}