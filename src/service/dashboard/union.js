import { $cms } from "@jx3box/jx3box-common/js/https";

export function bindApp(app, params) {
    return $cms().get(`/api/cms/user/union/${app}/bind`, { params });
}

export function unbindApp(app, params) {
    return $cms().delete(`/api/cms/user/union/${app}/unbind`, { params });
}

