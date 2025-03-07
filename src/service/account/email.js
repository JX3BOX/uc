import { axios, $, $cms } from "./axios";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import { encryptPassword } from "@/utils/pwd_encrypt";

function checkEmail(email) {
    return $.get("api/cms/user/account/email/valid", {
        params: {
            email: email,
        },
    });
}

// 邮箱注册
function registerByEmail(data) {
    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).post("api/cms/user/account/email/register", {
        email: data.email
    }, { params: { app: 'jx3box' } });
}

// 邮箱密码登录
function loginByEmail(data) {
    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).post("api/cms/user/account/email/login", {
        email: data.email,
        password: encryptPassword(data.pass),
    }, { 
        params: { 
            app: 'jx3box' ,
            encrypt : 1
        } 
    });
    // 必须以携带模式请求
}

// 邮箱注册激活
function verifyEmail(data) {
    return $.put("api/cms/user/account/email/active", {
        email: data.email,
        password: encryptPassword(data.password),
        invitation: data.invitation,
        code: data.code,
    },{
        params: { encrypt : 1 }
    });
}

export { checkEmail, registerByEmail, loginByEmail, verifyEmail };
