import { $pay, $cms } from "@jx3box/jx3box-common/js/https";

function getFreePro() {
    return $pay().get("/api/gift/developer/apply/vip");
}

function checkIsTeammate(user_id) {
    return $cms().get(`/api/cms/manage/account/teammate/${user_id}`)
}

export { getFreePro, checkIsTeammate };