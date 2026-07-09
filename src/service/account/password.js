import { axios, $, $cms } from "./axios";
import { __server, __cms } from "@/utils/config";
import { encryptPassword } from "@/utils/pwd_encrypt";
import { getDeviceFingerprintHeader } from "@/utils/account/fingerprint";

async function sendCode(email) {
    return $.post(
        "api/cms/user/account/email/forgot-password",
        {
            email: email,
        },
        {
            headers: await getDeviceFingerprintHeader(),
        }
    );
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
        headers: await getDeviceFingerprintHeader(),
    }).put("api/cms/user/account/email/reset-password", {
        email: data.email,
        code: data.code,
        password: encryptedPassword.value,
    },{
        params
    });
}

export { sendCode, checkCode, resetPassword };
