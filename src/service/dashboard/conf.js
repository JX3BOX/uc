import { $cms } from "@jx3box/jx3box-common/js/api";

function getUserConf() {
    return $cms().get("/api/cms/user/conf");
}

function setUserConf(data) {
    return $cms().put(`/api/cms/user/conf`, data);
}

export { getUserConf, setUserConf };
