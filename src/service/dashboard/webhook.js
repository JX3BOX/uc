import { $cms } from "@jx3box/jx3box-common/js/api";

function getUserWebhooks() {
    return $cms().get("/api/cms/user/my/webhook");
}

function saveUserWebhook(type, data) {
    return $cms().put(`/api/cms/user/my/webhook/${encodeURIComponent(type)}`, data);
}

function removeUserWebhook(type) {
    return $cms().delete(`/api/cms/user/my/webhook/${encodeURIComponent(type)}`);
}

export { getUserWebhooks, saveUserWebhook, removeUserWebhook };
