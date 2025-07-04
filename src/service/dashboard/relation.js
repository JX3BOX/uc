import { $team } from "@jx3box/jx3box-common/js/https";

// 关系网类型
export function getRelationNetTypes() {
    return $team().get("/api/team/relation-net/types");
}

// 创建关系网
export function createRelationNet(data) {
    return $team().post("/api/team/relation-net/item", data);
}

// 关系网成员
export function getRelationNetMembersByType(type) {
    return $team().get(`/api/team/relation-net/members/by-type/${type}`);
}

// 邀请用户加入关系网
export function inviteUserJoin(id, user_id) {
    return $team().post(`/api/team/relation-net/item/${id}/invite/user/${user_id}`);
}

// 删除我发出的关系邀请
export function deleteInvite(id) {
    return $team().delete(`/api/team/relation-net/invite/send-list/item/${id}`);
}

// 获取我发出的关系邀请
export function getMyInvites() {
    return $team().get(`/api/team/relation-net/invite/send-list`);
}

// 获取待处理的关系邀请
export function getWaitInvites() {
    return $team().get(`/api/team/relation-net/invite/todo-list`);
}

// 用户接受/拒绝邀请
export function dealInvite(id, status) {
    return $team().put(`/api/team/relation-net/item/${id}/invite/deal-with/${status}`);
}
