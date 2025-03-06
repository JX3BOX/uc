import { $pay, $cms } from "@jx3box/jx3box-common/js/https";

function getFreePro() {
    return $pay().get("/api/gift/developer/apply/vip");
}

function checkIsTeammate() {
    return $cms().get(`/api/cms/account/teammate/check`)
}

export { getFreePro, checkIsTeammate };
