const { validator } = require("sterilizer");

const EMAIL_TIP = "邮箱地址格式不正确，长度限3-50个字符";
const ACCOUNT_LOGIN_TIP = "请输入正确的邮箱地址或手机号";
const PASSWORD_TIP = "密码有效长度为6-50个字符";
const CODE_TIP = "验证码格式不正确";

function isValidEmail(value) {
    return validator(value, {
        isEmail: true,
        len: [3, 50],
    });
}

function isValidLoginPhone(value) {
    const phone = String(value || "").trim().replace(/[\s-]/g, "");
    return /^1\d{10}$/.test(phone) || /^861\d{10}$/.test(phone) || /^\+\d{6,20}$/.test(phone);
}

function isValidAccountLogin(value) {
    return isValidEmail(value) || isValidLoginPhone(value);
}

function isValidPassword(value) {
    return validator(value, {
        len: [6, 50],
    });
}

function isValidCode(value) {
    return validator(value, {
        isAlphanumeric: true,
        len: 6,
    });
}

function validateEmail(rule, value, callback) {
    if (!value) {
        callback(new Error(EMAIL_TIP));
        return;
    }

    if (!isValidEmail(value)) {
        callback(new Error(EMAIL_TIP));
        return;
    }

    callback();
}

function validateAccountLogin(rule, value, callback) {
    if (!value) {
        callback(new Error(ACCOUNT_LOGIN_TIP));
        return;
    }

    if (!isValidAccountLogin(value)) {
        callback(new Error(ACCOUNT_LOGIN_TIP));
        return;
    }

    callback();
}

function validatePassword(rule, value, callback) {
    if (!value) {
        callback(new Error(PASSWORD_TIP));
        return;
    }

    if (!isValidPassword(value)) {
        callback(new Error(PASSWORD_TIP));
        return;
    }

    callback();
}

function validateCode(rule, value, callback) {
    if (!value) {
        callback(new Error(CODE_TIP));
        return;
    }

    if (!isValidCode(value)) {
        callback(new Error(CODE_TIP));
        return;
    }

    callback();
}

function validateAgreement(rule, value, callback) {
    if (!value) {
        callback(new Error("请先阅读并同意相关协议"));
        return;
    }

    callback();
}

export {
    ACCOUNT_LOGIN_TIP,
    CODE_TIP,
    EMAIL_TIP,
    PASSWORD_TIP,
    isValidAccountLogin,
    isValidCode,
    isValidEmail,
    isValidPassword,
    validateAccountLogin,
    validateAgreement,
    validateCode,
    validateEmail,
    validatePassword,
};
