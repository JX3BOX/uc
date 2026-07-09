import { $, $cms } from "./axios";
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
            params: {
                app: "jx3box",
            },
        }
    );
}

async function sendPhoneCode(phone) {
    return $.post(
        "api/cms/user/account/phone/forgot-password",
        {
            phone,
        },
        {
            headers: await getDeviceFingerprintHeader(),
            params: {
                app: "jx3box",
            },
        }
    );
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
    }, {
        params,
    });
}

async function resetPhonePassword(data) {
    const encryptedPassword = await encryptPassword(data.password);
    const params = {};

    if (encryptedPassword.encrypted) {
        params.encrypt = encryptedPassword.version;
    }

    return $cms({
        headers: await getDeviceFingerprintHeader(),
    }).put("api/cms/user/account/phone/reset-password", {
        phone: data.phone,
        code: data.code,
        password: encryptedPassword.value,
    }, {
        params,
    });
}

export { sendCode, sendPhoneCode, resetPassword, resetPhonePassword };
