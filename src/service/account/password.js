import { axios, $, $cms } from "./axios";
import { __server, __cms } from "@/utils/config";
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

async function resetPassword(data) {
    const encryptedPassword = await encryptPassword(data.password);
    const params = {};

    if (encryptedPassword.encrypted) {
        params.encrypt = encryptedPassword.version;
    }

    return $cms({
        headers: {
            "user-device-fingerprint": User.getDeviceFingerprint(),
        },
    }).put("api/cms/user/account/email/reset-password", {
        email: data.email,
        code: data.code,
        password: encryptedPassword.value,
    },{
        params
    });
}

export { sendCode, checkCode, resetPassword };
