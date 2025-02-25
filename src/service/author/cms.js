import { $cms, $team } from "@jx3box/jx3box-common/js/https";
import axios from "axios";
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";

function getPosts(params) {
    return $cms().get(`/api/cms/posts`, {
        params,
    });
}

function getUserInfo(uid) {
    return $cms().get(`/api/cms/user/${uid}/info`, {
        params: {
            nocache: 1,
        },
    });
}

function getSuperAuthor(uid) {
    return $cms().get("/api/cms/user/is_super_author/" + uid);
}

function getIdentity(uid) {
    return $cms().get(`/api/cms/user/${uid}/identity`);
}

function getUserPz(params) {
    return $cms().get(`/api/cms/app/pz`, {
        params: params,
    });
}

// 获取用户的骚话
function getUserJokes(params) {
    return $cms().get(`/api/cms/post/jokes`, {
        params,
    });
}

// 获取用户的趣图
function getUserEmotions(params) {
    return $cms().get(`/api/cms/post/emotions`, {
        params,
    });
}
//获取装扮
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}

function getDecorationJson() {
    let url = __cdn + `design/decoration/index.json?${Math.random()}`;
    return axios.get(url);
}

function getDBM(params) {
    return $cms().get(`/api/cms/dbm/pkg`, {
        params,
    });
}

function getCertification(id) {
    return $team().get(`/api/team/team-certification-record/item/${id}`);
}

export {
    getPosts,
    getUserInfo,
    getSuperAuthor,
    getIdentity,
    getUserPz,
    getUserJokes,
    getUserEmotions,
    getDecoration,
    getDecorationJson,
    getDBM,
    getCertification,
};
