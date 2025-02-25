import { $cms, $_https } from "@jx3box/jx3box-common/js/https.js";

import axios from "axios";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

// 1.资料
// -------------------------------
function getProfile() {
    return $cms().get("/api/cms/user/my/profile");
}
function updateProfile(data) {
    return $cms().put("/api/cms/user/my/profile", data);
}

// 2.头像
// -------------------------------
function updateAvatar(data) {
    return $cms().put("/api/cms/user/my/avatar", data);
}
function uploadAvatar(data) {
    return $cms().post("/api/cms/upload/avatar", data);
}
function getFrames() {
    // let url = process.env.NODE_ENV == 'development'?'/temp/user_avatar_frame.json':(__imgPath + "avatar/index.json")
    let url = __imgPath + "avatar/index.json";
    return axios.get(url);
}
function getUserOverview(uid) {
    return $cms().get(`/api/cms/user/${uid}/info`, {
        params: {
            __no_cache: 1,
        },
    });
}

// 3.密码
// -------------------------------
// 发送验证码
function sendVerifyCode(data) {
    return $cms().post("/api/cms/user/account/email/forgot-password", data, {
        app: "jx3box",
    });
}
// 重设密码
function updatePassword(data) {
    return $cms().put("/api/cms/user/my/password", data);
}

// 4.邮箱
// -------------------------------
function checkEmailAvailable(email) {
    return $cms().get("/api/cms/user/account/email/valid", {
        params: {
            email
        }
    });
}

function sendBindEmail(data) {
    return $cms().post("/api/cms/user/account/email/bind", data);
}

function sendVerifyEmail(code) {
    return $cms().put("/api/cms/user/account/email/verify", {
        code,
    }, { app: 'jx3box' });
}

// 5.互联
function checkOAuth() {
    return $cms().get("/api/cms/account/oauth/status");
}

function unbindOAuth(type) {
    return $cms({
        popType: "alert",
    }).delete(`/api/cms/account/oauth/unbind/${type}`);
}

// 6.微信
// 获取微信二维码
function getWechatQrcode() {
    return $cms().get(`/api/cms/wechat/mp/bind`);
}

// 解除绑定
function unbindWechat() {
    return $cms().get(`/api/cms/wechat/mp/unbind`);
}

// 7.手机
// -------------------------------
function sendPhoneCode(data) {
    return $cms().post("/api/cms/account/oauth/phone/bind", data, {
        app: "jx3box",
    });
}

function verifyPhone(data) {
    return $cms().put("/api/cms/account/oauth/phone/verify", data, {
        app: "jx3box",
    });
}

function checkPhone(params) {
    return $cms().get("/api/cms/account/oauth/phone/check", {
        params,
    });
}

export {
    updateProfile,
    getProfile,
    updateAvatar,
    updatePassword,
    sendVerifyEmail,
    checkEmailAvailable,
    sendBindEmail,
    unbindOAuth,
    checkOAuth,
    uploadAvatar,
    getFrames,
    getUserOverview,
    getWechatQrcode,
    unbindWechat,
    sendVerifyCode,

    sendPhoneCode,
    verifyPhone,
    checkPhone,
};
