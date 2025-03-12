import { $cms } from "@jx3box/jx3box-common/js/https";

function contractAuthorApply(data) {
    return $cms().post('/api/cms/contract-author/log', data)
}

function getContractAuthorLogs() {
    return $cms().get('/api/cms/contract-author/log/mine')
}

function getLastContractAuthorLog() {
    return $cms().get('/api/cms/contract-author/log/last')
}

function getSuperAuthorState(userId) {
    return $cms().get('/api/cms/user/is_super_author/' + userId)
}

function filterSeaSun(data) {
    return $cms().post('/api/cms/system/seasun/filter', data)
}
export {
    contractAuthorApply,
    getSuperAuthorState,
    getContractAuthorLogs,
    filterSeaSun,
    getLastContractAuthorLog
}
