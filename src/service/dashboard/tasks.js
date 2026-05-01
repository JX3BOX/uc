import { $pay } from "@jx3box/jx3box-common/js/api";

function getTasks(params) {
    return $pay().get(`/api/personal/task`, {
        params,
    });
}
function getCheckTasks(id) {
    return $pay().get(`/api/personal/task/${id}/check-status`);
}

export { getTasks, getCheckTasks };
