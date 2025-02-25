import { $cms } from "@jx3box/jx3box-common/js/https";

function getMyPzList(params) {
    return $cms().get(`/api/cms/app/pz/my`, {
        params,
    });
}

export { getMyPzList };
