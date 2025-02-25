import { $cms } from "@jx3box/jx3box-common/js/https";

function getFreePro() {
    return $cms({ popType: "notify" }).put("/api/cms/admin/get-free-pro");
}

function getFreeNamespace(id) {
    return $cms().put(`/api/cms/admin/send-kol-namespace/${id}`);
}

function sendFreePro(id) {
    return $cms().put(`/api/cms/admin/send-free-pro/${id}`);
}

export { getFreePro, getFreeNamespace, sendFreePro };
