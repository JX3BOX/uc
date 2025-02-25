import { $next } from "@jx3box/jx3box-common/js/https";

function getMsgs(params) {
    return $next().get(`/api/next2/userdata/messages`, { params });
}

function readMsg(id) {
    return $next().put(`/api/next2/userdata/messages/read/${id}`);
}

function readAll() {
    return $next().put(`/api/next2/userdata/messages/read`);
}

function removeMsg(id) {
    return $next().delete(`/api/next2/userdata/messages/${id}`);
}

function getMessageUnread() {
    return $next({ mute: true }).get("/api/next2/userdata/messages/unread_total");
}

function getLetterUnread() {
    return $next({ mute: true }).get("/api/letter/unread/count");
}

function getCommentMsgDetail(id) {
    return $next().get(`/api/next2/comment/item/${id}`);
}

export { getMsgs, readMsg, readAll, removeMsg, getLetterUnread, getCommentMsgDetail, getMessageUnread };
