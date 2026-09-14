import { $pay } from "@jx3box/jx3box-common/js/api";

function getPointsHistory(params) {
    return $pay()
        .get(`/api/my/points/history/v2`, {
            params,
        })
        .then((res) => {
            return res.data.data;
        });
}
function getExperienceHistory(params) {
    return $pay()
        .get(`/api/my/experience/history/v2`, {
            params,
        })
        .then((res) => {
            return res.data.data;
        });
}
function getActionGroups() {
    return $pay().get("/api/point-experience/action-groups").then((res) => res.data.data);
}
function getActionTypes() {
    return $pay().get("/api/point-experience/action-types").then((res) => res.data.data);
}
export { getPointsHistory, getExperienceHistory, getActionGroups, getActionTypes };
