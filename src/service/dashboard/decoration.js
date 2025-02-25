import { $cms, $next } from "@jx3box/jx3box-common/js/https.js";
import axios from "axios";
import { __imgPath, __dataPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";

function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}

function setDecoration(data) {
    return $cms().post(`/api/cms/user/decoration`, data);
}

function getDecorationJson() {
    let url = __cdn + `design/decoration/index.json?${Date.now()}`;
    return axios.get(url);
}

function getEmotion() {
    return axios.get(`${__dataPath}emotion/output/catalog.json?${Date.now()}`);
}

function receive(user_id, val) {
    return $cms().post(`/api/cms/user/decoration/check-suit/${user_id}/${val}/for/avatar`);
}

function updateAvatarFrame(data) {
    return $cms().put("/api/cms/user/my/avatar-frame", data);
}

function getHonor() {
    // return axios.get(`${__imgPath}decoration/honor.json?${Date.now()}`);
    return $cms().get("/api/cms/user/config/honor");
}

function getUserHonors(uid) {
    return $next({ mute: true })
        .get("/api/next2/user/" + uid + "/honors")
        .then((res) => {
            return res.data.data;
        });
}
function setHonor(honor_id) {
    return $cms().put(`/api/cms/user/honor/use/${honor_id}`);
}
function cancelHonor() {
    return $cms().delete(`/api/cms/user/honor/use`);
}

// 获取用户勋章
function getUserMedals(uid) {
    return $next({ mute: true }).get("/api/next2/user/" + uid + "/medals");
}

// 获取所有勋章
function getMedals(params) {
    return $cms().get("/api/cms/config/medal", {params});
}
export {
    getDecoration,
    setDecoration,
    getDecorationJson,
    getEmotion,
    receive,
    updateAvatarFrame,
    getHonor,
    getUserHonors,
    setHonor,
    cancelHonor,
    getUserMedals,
    getMedals,
};
