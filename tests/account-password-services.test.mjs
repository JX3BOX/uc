import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const accountAxios = read("src/service/account/axios.js");
const emailService = read("src/service/account/email.js");
const loginView = read("src/views/account/Login.vue");
const passwordResetView = read("src/views/account/PasswordReset.vue");
const passwordService = read("src/service/account/password.js");
const profileService = read("src/service/dashboard/profile.js");

assert.match(
    accountAxios,
    /import \{ \$cms as commonCms \} from "@jx3box\/jx3box-common\/js\/api\.js";[\s\S]*function \$cms\(options\)[\s\S]*commonCms\(\{[\s\S]*interceptor: false/,
    "account $cms should reuse the common requester while preserving account page code handling"
);

assert.match(
    emailService,
    /async function loginByEmail\(data\)[\s\S]*encryptPassword\(data\.pass\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*api\/cms\/user\/account\/email\/login[\s\S]*email: data\.email[\s\S]*password: encryptedPassword\.value/,
    "email login should encrypt password and keep email-only endpoint"
);

assert.match(
    emailService,
    /async function loginByAccount\(data\)[\s\S]*encryptPassword\(data\.pass\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*api\/cms\/user\/account\/login[\s\S]*account: data\.account[\s\S]*password: encryptedPassword\.value/,
    "account login should use account endpoint and pass account with encrypt version"
);

assert.match(
    loginView,
    /loginByAccount\(\{[\s\S]*account: this\.form\.account[\s\S]*pass: this\.form\.pass/,
    "login page should use account endpoint for both email and phone input"
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
    passwordService,
    /async function resetPhonePassword\(data\)[\s\S]*encryptPassword\(data\.password\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*api\/cms\/user\/account\/phone\/reset-password[\s\S]*phone: data\.phone[\s\S]*password: encryptedPassword\.value/,
    "phone reset password should encrypt password and pass encrypt version"
);

assert.match(
    passwordService,
    /async function sendCode\(email\)[\s\S]*api\/cms\/user\/account\/email\/forgot-password[\s\S]*headers: await getDeviceFingerprintHeader\(\)[\s\S]*params: \{[\s\S]*app: "jx3box"/,
    "forgot password code request should include fingerprint headers and jx3box app"
);

assert.match(
    passwordService,
    /async function sendPhoneCode\(phone\)[\s\S]*api\/cms\/user\/account\/phone\/forgot-password[\s\S]*headers: await getDeviceFingerprintHeader\(\)[\s\S]*params: \{[\s\S]*app: "jx3box"/,
    "phone forgot password code request should include fingerprint headers and jx3box app"
);

assert.doesNotMatch(
    passwordService,
    /checkCode|account\/password\/reset\/check|__server|__cms/,
    "password reset service should not keep the deprecated reset check endpoint"
);

assert.match(
    passwordResetView,
    /<el-form ref="accountForm"[\s\S]*@submit\.prevent="start"[\s\S]*native-type="submit"[\s\S]*<el-form ref="resetForm"[\s\S]*@submit\.prevent="done"[\s\S]*native-type="submit"/,
    "password reset forms should support native submit for keyboard submission"
);

assert.match(
    passwordResetView,
    /validateRecoverableAccount[\s\S]*this\.accountValid === false[\s\S]*new Error\("账号不存在"\)[\s\S]*this\.\$refs\.accountForm\?\.validateField\("account"\)\.catch\(\(\) => \{\}\)/,
    "nonexistent reset account should be displayed as a field validation error without an unhandled rejection"
);

assert.doesNotMatch(
    passwordResetView,
    /ElMessage\.error\("账号不存在"\)/,
    "nonexistent reset email should not use a global message"
);

assert.match(
    passwordResetView,
    /sendPhoneCode\(account\)[\s\S]*res\.data\.code === 20047[\s\S]*this\.accountValid = false/,
    "phone reset should send phone code and map missing accounts to field validation"
);

assert.match(
    passwordResetView,
    /const action = mode === "phone" \? resetPhonePassword : resetPassword[\s\S]*payload\.phone = this\.form\.account[\s\S]*payload\.email = this\.form\.account/,
    "password reset submit should switch between phone and email reset endpoints"
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
