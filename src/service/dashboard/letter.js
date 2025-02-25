import { $next,$cms } from "@jx3box/jx3box-common/js/https";

export function getConfig(params) {
    return $cms({ mute: true }).get("/api/cms/config",{
        params
    });
}

/**
 * 新建最新联系人
 * @param {number} uid
 * @returns
 */
export function createRecentContact(uid) {
    return $next().post(`/api/letter/recently/contacts/${uid}`);
}

// 获取最近联系人
export function getRecentContacts() {
    return $next().get(`/api/letter/recently/contacts`);
}

/**
 * 删除最近联系人
 * @param {number} uid
 * @returns
 */
export function deleteRecentContact(uid) {
    return $next().delete(`/api/letter/recently/contacts/${uid}`);
}

/**
 * 发送私信
 * @param {number} send_uid 发送方uid
 * @param {number} receive_uid 接收方uid
 * @param {string} data.content 消息内容
 * @param {string} data.content_type 消息类型 0 文本 1 图片
 */
export function sendLetter(send_uid, receive_uid, data) {
    return $next().post(`/api/letter/${send_uid}/to/${receive_uid}`, data);
}

/**
 * 获取与某人的聊天记录 - 某条消息之后的消息
 * @param {number} send_uid 发送方uid
 * @param {number} receive_uid 接收方uid
 * @param {number} query.begin 上次消息的id
 * @param {number} query.limit 拉取消息的数量
 */
export function getLetterList(send_uid, receive_uid, query) {
    return $next().get(`/api/letter/${send_uid}/to/${receive_uid}/newest`, {
        params: query,
    });
}

// 获取与某人的聊天记录 - 某条消息之前的消息
export function getLetterListBefore(send_uid, receive_uid, query) {
    return $next().get(`/api/letter/${send_uid}/to/${receive_uid}/before`, {
        params: query,
    });
}

// 获取未读私信数量
export function getUnreadLetterCount() {
    return $next().get(`/api/letter/unread/count`);
}
