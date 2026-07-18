import { $cms } from "@jx3box/jx3box-common/js/api.js";
import axios from "axios";
import { __imgPath, __dataPath, __cdn } from "@/utils/config";

function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}
function medalCheck(params) {
    return $cms().get("/api/cms/user/medal/check", {
        params,
    });
}

function setDecoration(data) {
    return $cms().post(`/api/cms/user/decoration`, data);
}

function setEmotion(keys) {
    return $cms().post("/api/cms/user/emotion", { keys });
}

function getDecorationJson() {
    let url = __cdn + `design/skin/index.json`;
    return axios.get(url);
}

function getEmotion() {
    return axios.get(`${__dataPath}emotion/output/catalog.json`);
}

function getUserDecoration(params) {
    return $cms().get("/api/cms/user/decoration/check", {
        params,
    });
}

function receive(user_id, val) {
    return $cms().post(`/api/cms/user/decoration/check-suit/${user_id}/${val}/for/avatar`);
}

function updateAvatarFrame(data) {
    return $cms().put("/api/cms/user/my/avatar-frame", data);
}

function getHonor(params) {
    return $cms().get("/api/cms/config/honor", { params });
}

function getUserHonors() {
    return $cms()
        .get("/api/cms/user/honor", {
            params: {
                _no_page: 1,
            },
        })
        .then((res) => {
            const data = res?.data?.data || {};
            return Array.isArray(data?.list) ? data.list : Array.isArray(data) ? data : [];
        });
}
function setHonor(honor_id) {
    return $cms().put(`/api/cms/user/honor/use/${honor_id}`);
}
function cancelHonor() {
    return $cms().delete(`/api/cms/user/honor/use`);
}

// 获取用户勋章
function getUserMedals() {
    return $cms({ mute: true }).get("/api/cms/user/medal");
}
// 用户领取勋章
function medalReceive(data) {
    return $cms().post("/api/cms/user/medal/receive", data);
}

// 获取所有勋章
function getMedals(params) {
    return $cms().get("/api/cms/config/medal", { params });
}

// 用户佩戴或者取消佩戴勋章
function setMedal(medal_id, is_wear) {
    return $cms().put(`/api/cms/user/medal/${medal_id}/wear/${is_wear}`);
}

// 发放活动装扮
function decorationReceive(data) {
    return $cms().post("/api/cms/user/decoration/receive", data);
}

export {
    getDecoration,
    setDecoration,
    setEmotion,
    getDecorationJson,
    getUserDecoration,
    getEmotion,
    receive,
    updateAvatarFrame,
    getHonor,
    getUserHonors,
    setHonor,
    cancelHonor,
    getUserMedals,
    getMedals,
    setMedal,
    medalCheck,
    medalReceive,
    decorationReceive,
};
