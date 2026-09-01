import { $cms, $team } from "@jx3box/jx3box-common/js/api";
import axios from "axios";
import { __imgPath, __cdn } from "@/utils/config";

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

function searchUser(search) {
    return $cms().get(`/api/cms/user/search`, {
        params: {
            search,
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
    let url = __cdn + `design/decoration/index.json`;
    return axios.get(url);
}

function getUserSkin(params = {}) {
    return $cms().get(`/api/cms/user/skin`, {
        params,
    });
}

function getDBM(params) {
    return $cms().get(`/api/cms/dbm/pkg`, {
        params,
    });
}

const TEAM_AUTH_PASSWORD = "next common request";

function createCertificationResponseError(response) {
    const error = new Error(response?.data?.msg || "Certificate request failed");
    error.response = response;
    return error;
}

function assertCertificationResponse(response) {
    const rawCode = response?.data?.code;
    const code = rawCode === undefined || rawCode === null || rawCode === "" ? NaN : Number(rawCode);
    if (Number.isFinite(code) && code !== 0 && code !== 200) {
        throw createCertificationResponseError(response);
    }
    return response;
}

async function getCertification(id, token = "") {
    const config = token
        ? {
              auth: {
                  username: token,
                  password: TEAM_AUTH_PASSWORD,
              },
          }
        : {};
    const response = await $team({ interceptor: false }).get(`/api/team/team-certification-record/item/${id}`, config);
    return assertCertificationResponse(response);
}

export {
    getPosts,
    getUserInfo,
    searchUser,
    getSuperAuthor,
    getIdentity,
    getUserPz,
    getUserJokes,
    getUserEmotions,
    getDecoration,
    getDecorationJson,
    getUserSkin,
    getDBM,
    getCertification,
};
