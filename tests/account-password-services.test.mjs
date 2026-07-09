import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const emailService = read("src/service/account/email.js");
const passwordService = read("src/service/account/password.js");
const profileService = read("src/service/dashboard/profile.js");

assert.match(
    emailService,
    /async function loginByEmail\(data\)[\s\S]*encryptPassword\(data\.pass\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*password: encryptedPassword\.value/,
    "email login should encrypt password and pass encrypt version"
);

assert.match(
    emailService,
    /async function verifyEmail\(data\)[\s\S]*encryptPassword\(data\.password\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*api\/cms\/user\/account\/email\/active[\s\S]*password: encryptedPassword\.value/,
    "email registration activation should encrypt password and pass encrypt version"
);

assert.match(
    passwordService,
    /async function resetPassword\(data\)[\s\S]*encryptPassword\(data\.password\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*api\/cms\/user\/account\/email\/reset-password[\s\S]*password: encryptedPassword\.value/,
    "email reset password should encrypt password and pass encrypt version"
);

assert.match(
    profileService,
    /async function updatePassword\(data = \{\}\)[\s\S]*encryptPassword\(data\.password \|\| ""\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*\/api\/cms\/user\/my\/password[\s\S]*password: encryptedPassword\.value/,
    "dashboard password update should encrypt password and pass encrypt version"
);

assert.match(
    profileService,
    /function getPasswordStatus\(\)[\s\S]*\/api\/cms\/user\/my\/password\/status/,
    "dashboard password page should request password status without exposing user_pass"
);

assert.match(
    read("src/views/dashboard/pwd.vue"),
    /v-if="showPasswordNotice"[\s\S]*title="请设置密码"[\s\S]*您还没有设置密码，将无法使用密码登录或查看卡密等功能。[\s\S]*getPasswordStatus\(\)[\s\S]*has_password/,
    "dashboard password notice should only show when the backend reports no password"
);

assert.match(
    read("src/views/dashboard/pwd.vue"),
    /process\.env\.NODE_ENV !== "development"[\s\S]*pwd_mock_no_password[\s\S]*mockValue === "1"[\s\S]*mockValue === "0"/,
    "dashboard password notice mock should only be available in development"
);

assert.match(
    read("src/assets/css/dashboard/profile/pwd.less"),
    /\.u-pic[\s\S]*\.mb\(32px\)[\s\S]*\.u-ac[\s\S]*margin:0 auto 20px auto !important/,
    "dashboard password form should keep normal spacing with or without the notice"
);
