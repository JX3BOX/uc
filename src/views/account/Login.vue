<template>
    <div class="m-card" >
        <el-card class="box-card">
            <CardHeader />
            <Msg />
            <template v-if="!isLogin || isAlternate">
                <main v-if="success == null" class="m-main">
                    <el-form ref="loginForm" :model="form" :rules="loginRules" class="m-form" @submit.prevent>
                        <!-- 账号 -->
                        <el-form-item class="u-email" prop="account">
                            <el-input
                                class="u-text u-email"
                                v-model="form.account"
                                :placeholder="$t('account.common.accountPlaceholder')"
                                minlength="3"
                                maxlength="50"
                                type="text"
                                name="username"
                                autocomplete="username"
                                size="large"
                            >

                                <template #prepend>
                                    <i class="el-icon-user"></i>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 密码 -->
                        <el-form-item class="u-pass" prop="pass">
                            <el-input
                                class="u-text"
                                :placeholder="$t('account.common.passwordPlaceholder')"
                                v-model="form.pass"
                                show-password
                                name="password"
                                autocomplete="current-password"
                                @keyup.enter="submit"
                                size="large"
                            >
                                <template #prepend>
                                    <i class="el-icon-lock"></i>
                                </template>
                            </el-input>
                        </el-form-item>

                        <el-alert v-if="lockSeconds > 0" class="u-lock-notice" :title="$t('account.login.lockedCountdown', { time: lockTimeText })" type="warning" show-icon :closable="false" role="status" />

                        <!-- 提交 -->
                        <el-button class="u-submit u-button" type="primary" @click="submit" :loading="submitting" :disabled="lockSeconds > 0" size="large">{{ $t("account.common.login") }}</el-button>
                    </el-form>

                    <Union mode="login" :includes="['qq', 'wechat', 'weibo']" />

                    <footer class="m-footer">
                        <p class="u-login">
                            {{ $t("account.login.noAccount") }}
                            <a :href="register_url">{{ $t("account.login.registerNow") }} &raquo;</a>
                        </p>
                        <p class="u-resetpwd">
                            <a :href="reset_url">{{ $t("account.common.forgotPassword") }}</a>
                        </p>
                    </footer>
                </main>

                <main v-if="success == true" class="m-main">
                    <el-alert :title="$t('account.login.successTitle')" type="success" :description="$t('account.login.successDescription')" show-icon :closable="false">
                    </el-alert>
                    <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="redirect">{{ redirect_button }}</a>
                </main>

                <main v-if="success == false" class="m-main">
                    <el-alert :title="$t('account.login.failureTitle')" type="error" :description="errors" show-icon :closable="false">
                    </el-alert>
                    <el-button class="u-button u-submit" type="primary" @click="reset" size="large">{{ $t("account.common.back") }}</el-button>
                </main>
            </template>
            <template v-else>
                <div class="m-login-in">
                    <el-alert class="u-current-info" type="warning" show-icon :closable="false" center>
                        <template #title>
                            <span
                                >{{ $t("account.login.loggedInAs") }} <b>{{ username }}</b></span
                            >
                        </template>
                    </el-alert>
                    <el-button class="u-logout" type="danger" @click="logout" size="large" icon="SwitchButton">{{ $t("account.common.logout") }}</el-button>
                </div>
            </template>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import Union from "@/components/account/Union.vue";
import { loginByAccount, getLoginLockStatus } from "@/service/account/email.js";
import { __Root, __Links } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import Msg from "@/components/account/Msg.vue";
import { isValidAccountLogin, isValidPassword } from "@/utils/account/validators.js";
import { ensureDeviceFingerprint } from "@/utils/account/fingerprint.js";
import { readLoginLocks, saveLoginLocks, loginLockDeadline, formatLoginLockTime } from "@/utils/account/login-lock";
export default {
    name: "Login",
    data: function () {
        return {
            success: null,

            redirect: "",
            redirect_button: "",
            errors: this.$t("account.common.unknownError"),

            form: {
                account: "",
                pass: "",
            },
            submitting: false,

            homepage: __Root,

            loginLocks: readLoginLocks(),
            lockNow: Date.now(),
            lockTimer: null,
            lockSyncTimer: null,
            lockSyncVersion: 0,
            lastLockSyncAt: 0,
            lockPageActive: false,

            isLogin: User.isLogin(),
            username: User.getInfo().name,

            isAlternate: false,
        };
    },
    watch: {
        "form.account"() {
            this.lockNow = Date.now();
            this.scheduleLockSync();
        },
    },
    computed: {
        lockSeconds() {
            return Math.max(0, Math.ceil(((this.loginLocks[this.getLoginAccount()] || 0) - this.lockNow) / 1000));
        },
        lockTimeText() {
            return formatLoginLockTime(this.lockSeconds);
        },
        loginRules: function () {
            return {
                account: [{ validator: this.validateAccount, trigger: "blur" }],
                pass: [{ validator: this.validateLoginPassword, trigger: "blur" }],
            };
        },
        register_url: function () {
            return __Links.account.register + "?redirect=" + this.redirect;
        },
        reset_url: function () {
            return "/account/password_reset";
        },
    },
    methods: {
        getLoginAccount() {
            return this.form.account;
        },
        // 使用实际截止时间计算，避免应用进入后台后计时漂移。
        startLockClock() {
            this.stopLockClock();
            this.lockPageActive = true;
            this.lockNow = Date.now();
            this.syncLoginLock();
            this.lockTimer = window.setInterval(() => {
                this.lockNow = Date.now();
                if (
                    document.visibilityState !== "hidden" &&
                    this.loginLocks[this.getLoginAccount()] &&
                    this.lockNow - this.lastLockSyncAt >= 10000
                )
                    this.syncLoginLock();
            }, 1000);
        },
        stopLockClock() {
            this.lockPageActive = false;
            this.lockSyncVersion++;
            if (this.lockTimer !== null) window.clearInterval(this.lockTimer);
            if (this.lockSyncTimer !== null) window.clearTimeout(this.lockSyncTimer);
            this.lockTimer = null;
            this.lockSyncTimer = null;
        },
        onLockPageFocus() {
            if (this.lockPageActive && document.visibilityState !== "hidden") this.syncLoginLock();
        },
        scheduleLockSync() {
            this.lockSyncVersion++;
            if (this.lockSyncTimer !== null) window.clearTimeout(this.lockSyncTimer);
            if (!this.lockPageActive) return;
            this.lockSyncTimer = window.setTimeout(() => {
                this.lockSyncTimer = null;
                this.syncLoginLock();
            }, 350);
        },
        async syncLoginLock() {
            if (!this.lockPageActive || !isValidAccountLogin(this.getLoginAccount())) return;
            const account = this.getLoginAccount();
            const version = ++this.lockSyncVersion;
            this.lastLockSyncAt = Date.now();
            try {
                const response = await getLoginLockStatus({
                    account,
                    login_type: "account",
                });
                if (!this.lockPageActive || version !== this.lockSyncVersion || account !== this.getLoginAccount())
                    return;
                const state = response?.data?.data;
                const seconds = Number(state?.retry_after);
                // 只接受明确的服务端状态；网络异常或旧服务端不清除已知锁定。
                if (state?.locked !== false && !(state?.locked === true && Number.isFinite(seconds) && seconds > 0))
                    return;
                const locks = { ...this.loginLocks };
                if (state.locked) locks[account] = Date.now() + Math.ceil(seconds) * 1000;
                else delete locks[account];
                this.loginLocks = locks;
                saveLoginLocks(locks);
                this.lockNow = Date.now();
            } catch {
                // 查询失败保留现有倒计时，实际登录仍由后端校验。
            }
        },
        handleLoginError(error, account) {
            this.lockSyncVersion++;
            const deadline = loginLockDeadline(error);
            if (deadline) {
                this.loginLocks = { ...this.loginLocks, [account]: deadline };
                saveLoginLocks(this.loginLocks);
                this.lockNow = Date.now();
                this.success = null;
            } else {
                this.success = false;
                this.errors = error?.response?.data?.msg || this.$t("account.common.invalidRequestOrNetwork");
            }
        },
        validateAccount: function (rule, value, callback) {
            callback(isValidAccountLogin(value) ? undefined : new Error(this.$t("account.validation.account")));
        },
        validateLoginPassword: function (rule, value, callback) {
            callback(isValidPassword(value) ? undefined : new Error(this.$t("account.validation.password")));
        },
        submit: async function () {
            if (this.lockSeconds > 0 || this.submitting) return;

            try {
                await this.$refs.loginForm.validate();
            } catch (e) {
                return;
            }

            if (this.lockSeconds > 0 || this.submitting) return;
            const account = this.getLoginAccount();
            this.submitting = true;
            try {
                await loginByAccount({
                    account: this.form.account,
                    pass: this.form.pass,
                    // device_id: this.device_id,
                })
                    .then((res) => {
                        if (!res.data.code) {
                            this.success = true;
                            let data = res.data.data;
                            const _data = {
                                token: data.token,
                                uid: data?.user?.ID,
                                group: data?.user?.user_group || 1,
                                name: data?.user?.display_name,
                                status: data?.user?.user_status,
                                bind_wx: data?.user?.wechat_unionid ? 1 : 0,
                                avatar: data?.user?.user_avatar || "",
                            };
                            User.update(_data)
                                .then(() => {
                                    if (this.isAlternate) {
                                        localStorage.setItem(
                                            `jx3box-alternate-${_data.uid}`,
                                            JSON.stringify({
                                                ..._data,
                                                created_at: Number(localStorage.getItem("created_at")),
                                            })
                                        );
                                    }

                                    // 跳转至来源页
                                    this.skip();
                                })
                                .catch((err) => {
                                    alert(this.$t("account.login.browserUnsupported"));
                                });
                        } else {
                            this.handleLoginError({ response: res }, account);
                        }
                    })
                    .catch((err) => {
                        this.handleLoginError(err, account);
                    })
                    .finally(() => {
                        this.submitting = false;
                    });
            } catch (e) {
                this.submitting = false;
            }
        },
        reset: function () {
            this.success = null;
            this.form.account = "";
            this.form.pass = "";
            this.$refs.loginForm?.clearValidate();
        },
        checkDirect: function () {
            let search = new URLSearchParams(document.location.search);
            let redirect = search.get("redirect");
            if (redirect) {
                this.redirect = redirect;
                this.redirect_button = this.$t("account.login.redirecting");
            } else {
                this.redirect = this.homepage;
                this.redirect_button = this.$t("account.common.backHome");
            }
            let alternate = search.get("alternate");

            if (~~alternate) {
                this.isAlternate = true;

                sessionStorage.setItem("alternate", 1);
            }
        },
        checkDeviceID: function () {
            ensureDeviceFingerprint();
        },
        skip: function () {
            if (this.redirect) {
                setTimeout(() => {
                    location.href = decodeURIComponent(this.redirect);
                }, 1200);
            }
        },
        logout: function () {
            User.destroy().then(() => {
                location.reload();
            });
        },
    },
    mounted: function () {
        this.checkDirect();
        document.addEventListener("visibilitychange", this.onLockPageFocus);
        window.addEventListener("focus", this.onLockPageFocus);
        this.startLockClock();
    },
    activated() {
        this.startLockClock();
    },
    deactivated() {
        this.stopLockClock();
    },
    beforeUnmount() {
        document.removeEventListener("visibilitychange", this.onLockPageFocus);
        window.removeEventListener("focus", this.onLockPageFocus);
        this.stopLockClock();
    },
    created: function () {
        this.checkDeviceID();
    },
    components: {
        CardHeader,
        Union,
        Msg,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";

.m-main .u-lock-notice {
    margin-bottom: 0;

    & + .u-submit {
        margin-top: 12px;
    }
}
</style>
