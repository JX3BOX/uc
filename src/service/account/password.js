import { axios, $, $cms } from "./axios";
import { __server, __cms } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import { encryptPassword } from "@/utils/pwd_encrypt";

function sendCode(email) {
    return $.post("api/cms/user/account/email/forgot-password", {
        email: email,
    });
}
// 废弃
function checkCode(data) {
    return axios.post(__server + "account/password/reset/check", {
        email: data.email,
        code: data.code
    });
}

function resetPassword(data) {
    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).put("api/cms/user/account/email/reset-password", {
        email: data.email,
        code: data.code,
        password: encryptPassword(data.password),
    },{
        params: { encrypt : 1 }
    });
}

export { sendCode, checkCode, resetPassword };
