import { $cms } from "@jx3box/jx3box-common/js/api";

function genInvitation() {
    return $cms().post(`/api/cms/user/invitation/register`, {});
}

function getMyInvitation() {
    return $cms().get(`/api/cms/user/invitation`);
}

export { genInvitation, getMyInvitation };
