import { $team} from '@jx3box/jx3box-common/js/https';

function getRoles(params) {
    return $team().get("/api/team/my-game-roles", {
        params: params,
    });
}

function unbindRole(id) {
    return $team().get("/api/team/role-unbind/" + id);
}

function getToken() {
    return $team().get("/api/team/role-bind-token");
}

function noteRole(role_id, note) {
    return $team().put(`/api/team/role-update-note/${role_id}`, {
        note: note,
    });
}

function createRole(data) {
    return $team().post("/api/team/custom-role", data);
}

function updateRole(role_id, data) {
    return $team().put(`/api/team/custom-role/${role_id}`, data);
}

function getRole(role_id) {
    return $team().get(`/api/team/custom-role/${role_id}`);
}

function deleteRole(role_id) {
    return $team().delete(`/api/team/custom-role/${role_id}`);
}

function starRole(role_id){
    return $team().put(`/api/team/role-priority/${role_id}/top`)
}
function unstarRole(role_id){
    return $team().put(`/api/team/role-priority/${role_id}/untop`)
}

function getRoleBelongTeams(role_id) {
    return $team().get(`/api/team/relation/role/${role_id}/teams`);
}

export {
    getRoles,
    unbindRole,
    getToken,
    noteRole,
    createRole,
    updateRole,
    getRole,
    deleteRole,
    starRole,
    unstarRole,
    getRoleBelongTeams,
};
