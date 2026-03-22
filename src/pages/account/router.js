import { createRouter, createWebHistory } from "vue-router";

const Login = () => import("@/views/account/Login.vue");
const Register = () => import("@/views/account/Register.vue");
const EmailVerify = () => import("@/views/account/EmailVerify.vue");
const PasswordReset = () => import("@/views/account/PasswordReset.vue");
const LoginCallback = () => import("@/views/account/LoginCallback.vue");
const LoginCallbackWesite = () => import("@/views/account/LoginCallbackWesite.vue");
const RegisterCallback = () => import("@/views/account/RegisterCallback.vue");

const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        name: "account_login",
        path: "/login",
        component: Login,
        meta: {
            i18n: {
                title: "pages.account.login.title",
                keywords: "pages.account.login.keywords",
                description: "pages.account.login.description",
            },
        },
    },
    {
        name: "account_register",
        path: "/register",
        component: Register,
        meta: {
            i18n: {
                title: "pages.account.register.title",
                keywords: "pages.account.register.keywords",
                description: "pages.account.register.description",
            },
        },
    },
    {
        name: "account_email_verify",
        path: "/email_verify",
        component: EmailVerify,
        meta: {
            i18n: {
                title: "pages.account.email_verify.title",
                keywords: "pages.account.email_verify.keywords",
                description: "pages.account.email_verify.description",
            },
        },
    },
    {
        name: "account_password_reset",
        path: "/password_reset",
        component: PasswordReset,
        meta: {
            i18n: {
                title: "pages.account.password_reset.title",
                keywords: "pages.account.password_reset.keywords",
                description: "pages.account.password_reset.description",
            },
        },
    },
    {
        name: "account_login_callback",
        path: "/login_callback",
        component: LoginCallback,
        meta: {
            i18n: {
                title: "pages.account.login_callback.title",
                keywords: "pages.account.login_callback.keywords",
                description: "pages.account.login_callback.description",
            },
        },
    },
    {
        name: "account_login_callback_wesite",
        path: "/login_callback_wesite",
        component: LoginCallbackWesite,
        meta: {
            i18n: {
                title: "pages.account.login_callback_wesite.title",
                keywords: "pages.account.login_callback_wesite.keywords",
                description: "pages.account.login_callback_wesite.description",
            },
        },
    },
    {
        name: "account_register_callback",
        path: "/register_callback",
        component: RegisterCallback,
        meta: {
            i18n: {
                title: "pages.account.register_callback.title",
                keywords: "pages.account.register_callback.keywords",
                description: "pages.account.register_callback.description",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory("/account"),
    routes,
});

export default router;
