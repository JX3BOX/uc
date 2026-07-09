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
