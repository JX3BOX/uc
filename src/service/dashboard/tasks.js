import { $cms, $pay } from "@jx3box/jx3box-common/js/api";

function getTasks(params) {
    return $pay().get(`/api/personal/task`, {
        params,
    });
}
function getCheckTasks(id) {
    return $pay().get(`/api/personal/task/${id}/check-status`);
}

export { getTasks, getCheckTasks };

const activityTaskPath = "/api/cms/event/activity-task";

export async function getActivityTasks() {
    const { data } = await $cms().get(activityTaskPath);
    if (data?.code !== 0 || !Array.isArray(data.data)) {
        throw new Error(data?.msg || "Invalid activity task list response");
    }
    return data.data;
}

export async function claimActivityTask(key) {
    const { data } = await $cms().post(`${activityTaskPath}/${encodeURIComponent(key)}/claim`);
    if (data?.code !== 0 || !data.data?.created_at) {
        throw new Error(data?.msg || "Invalid activity task claim response");
    }
}
