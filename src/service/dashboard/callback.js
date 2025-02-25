import { $cms } from "@jx3box/jx3box-common/js/https";

function getPost(post_id) {
    return $cms().get(`/api/cms/post/${post_id}`);
}

function getUser(user_id) {
    return $cms().get(`/api/cms/user/${user_id}/info`);
}

// 联合创作者
function isExistPostInvitation(post_id) {
    return $cms().get(`/api/cms/post/${post_id}/author/my`);
}

function quitUnionPost(post_id) {
    return $cms().delete(`/api/cms/post/${post_id}/authors/quit`);
}

function acceptPostInvitation(post_id) {
    return $cms().put(`/api/cms/post/${post_id}/author/my`);
}

// 亲友
function isExistKithInvitation(user_id) {
    return $cms().get(`/api/cms/user/kith/${user_id}/invitation`);
}

function refuseKithInvitation(user_id) {
    return $cms().delete(`/api/cms/user/kith/${user_id}/invitation`);
}

function acceptKithInvitation(user_id) {
    return $cms().put(`/api/cms/user/kith/${user_id}/invitation`);
}

export { getPost, getUser, quitUnionPost, isExistPostInvitation, acceptPostInvitation, isExistKithInvitation, refuseKithInvitation, acceptKithInvitation };
