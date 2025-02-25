import { $cms } from "@jx3box/jx3box-common/js/https";

function getFreeVip(event) {
    return $cms({ popType: "alert" }).put(`/api/cms/event/vip/${event}`);
}

function getFreeNamespace(event) {
    return $cms({ popType: "alert" }).get(`/api/cms/event/namespace/${event}`);
}

export { getFreeVip, getFreeNamespace };
