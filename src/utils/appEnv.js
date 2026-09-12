import { isApp } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { refreshTokenIfNeeded } from "@jx3box/jx3box-ui/src/utils/auth-token-refresh";

let initialized = false;

function getUrlParam(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    return r ? decodeURIComponent(r[2]) : null;
}

/**
 * 落地 App webview 通过 URL 传入的环境标识与登录凭证。
 *
 * 用于未挂载 CommonHeader 的页面（如 /vip/lottery 的 App 视图 index-app.vue），
 * 逻辑与 CommonHeader 的 checkIsWebView() / init() 对齐：
 * - __env  写入 localStorage，供 isApp() 在后续跳转（URL 不再带参）时继续命中
 * - __token 写入 localStorage，避免凭证仅存活于 sessionStorage
 * - 已登录时按 force 换发长期 token，URL 显式传参才强制
 *
 * 全局只执行一次，重复调用无副作用。
 */
export function initAppEnv() {
    if (initialized) return;
    initialized = true;

    const env = getUrlParam("__env");
    if (env) {
        localStorage.setItem("__env", env);
    }

    if (isApp()) {
        document.documentElement.classList.add("v-miniprogram");
    }

    const token = getUrlParam("__token");
    if (token) {
        localStorage.setItem("__token", token);
    }

    if (User.isLogin()) {
        refreshTokenIfNeeded({ force: !!token }).catch(() => {});
    }
}
