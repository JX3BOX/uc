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
    profileService,
    /async function updatePassword\(data = \{\}\)[\s\S]*encryptPassword\(data\.password \|\| ""\)[\s\S]*params\.encrypt = encryptedPassword\.version[\s\S]*\/api\/cms\/user\/my\/password[\s\S]*password: encryptedPassword\.value/,
    "dashboard password update should encrypt password and pass encrypt version"
);
