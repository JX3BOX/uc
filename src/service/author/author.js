import { $next, $team } from "./axios";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import axios from "axios";

function getDouyu(ids) {
    return $next().get("/team/douyu", {
        params: {
            tv_id: ids,
        },
    });
}

function getUserMedals(uid) {
    return $next().get("/api/user/" + uid + "/medals");
}

function getFrames() {
    return axios.get(__imgPath + `data/user_avatar_frame.json?${Date.now()}}`);
}

function getUserPublicTeams(uid) {
    return $team({ mute: true })
        .get(`/api/team/relation/public`, {
            params: {
                uid: uid,
            },
        })
        .then((res) => {
            return res.data.data;
        });
}
/**
 * 判断是否拉黑用户
 */

function hadDenyUser(display_name) {
    return $next().get(`/api/my-userlist/deny`, {
        params: {
            display_name,
        },
    });
}

/**
 * 拉黑用户
 * @param {*} userId 用户id
 */
function deny(userId) {
    return $next().post(`/api/my-userlist/deny/${userId}`);
}

/**
 * 取消拉黑用户
 * @param {*} userId 用户id
 */
function undeny(userId) {
    return $next().delete(`/api/my-userlist/deny/${userId}`);
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
        params,
    });
}

/**
 *  指定玩家的公开战斗数据
 * pageIndex  user_id
 */
function getBattleList(params) {
    return $team({ mute: true }).get(`/api/team/battle/public-list`, {
        params,
    });
}

/**
 * 获取公开的讨论主题帖列表
 *
 */
function getTopicList(params) {
    return $next().get(`/api/next2/community/discussion/topic/list`, {
        params,
    });
}
/**
 * 获取公开的所有回帖
 *
 */
// https://next2.jx3box.com/api/next2/community/discussion/reply/list?user_id=8
function getTopicReplyList(params) {
    return $next().get(`/api/next2/community/discussion/reply/list`, {
        params,
    });
}

export {
    getDouyu,
    getUserMedals,
    getFrames,
    getUserPublicTeams,
    deny,
    undeny,
    getBlackList,
    getBattleList,
    getTopicList,
    getTopicReplyList,
    hadDenyUser,
};
