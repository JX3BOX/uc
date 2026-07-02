import { axios, $, $cms } from "./axios";
import { __cms } from "@/utils/config";
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
async function loginByEmail(data) {
    const encryptedPassword = await encryptPassword(data.pass);
    const params = {
        app: 'jx3box',
    };

    if (encryptedPassword.encrypted) {
        params.encrypt = encryptedPassword.version;
    }

    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).post("api/cms/user/account/email/login", {
        email: data.email,
        password: encryptedPassword.value,
    }, {
        params
    });
    // 必须以携带模式请求
}

// 邮箱注册激活
async function verifyEmail(data) {
    const encryptedPassword = await encryptPassword(data.password);
    const params = {};

    if (encryptedPassword.encrypted) {
        params.encrypt = encryptedPassword.version;
    }

    return $.put("api/cms/user/account/email/active", {
        email: data.email,
        password: encryptedPassword.value,
        invitation: data.invitation,
        code: data.code,
    },{
        params
    });
}

export { checkEmail, registerByEmail, loginByEmail, verifyEmail };
