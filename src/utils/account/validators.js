const { validator } = require("sterilizer");

const EMAIL_TIP = "邮箱地址格式不正确，长度限3-50个字符";
const PASSWORD_TIP = "密码有效长度为6-50个字符";
const CODE_TIP = "验证码格式不正确";

function isValidEmail(value) {
    return validator(value, {
        isEmail: true,
        len: [3, 50],
    });
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
    CODE_TIP,
    EMAIL_TIP,
    PASSWORD_TIP,
    isValidCode,
    isValidEmail,
    isValidPassword,
    validateAgreement,
    validateCode,
    validateEmail,
    validatePassword,
};
