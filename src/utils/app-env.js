import { isApp } from "@jx3box/jx3box-common/js/utils";

export function isAppWebview(route) {
    // 保留路由依赖，使 Vue Router 页面内跳转时能够重新计算环境状态。
    void route?.fullPath;
    return isApp();
}
