import { $pay } from "@jx3box/jx3box-common/js/https";

function getMyPacket() {
    return $pay().get("/api/vip/i");
}

function getMyPacketList(params) {
    return $pay().get("/api/red-packet/log/my", {
        params: params,
    });
}

function getMyPacketHistory(params) {
    return $pay().get("/api/cash-out/history", {
        params: params,
    });
}

function getAllPacket(params) {
    return $pay().get("/api/red-packet/list", {
        params: params,
    });
}

function getAllHistory(params) {
    return $pay().get("/api/cash-out/manage/list", {
        params: params,
    });
}

function pullMyPacket(data) {
    return $pay().post("/api/cash-out/red-packet", data);
}

function checkPacket(id, data, params) {
    return $pay().put(`/api/cash-out/manage/${id}/status`, data, {
        params: params,
    });
}

function pushPacket(data) {
    return $pay().post("/api/red-packet/giving", "", {
        params: data,
    });
}

function recyclePacket(params) {
    return $pay().delete("/api/red-packet/recycle", {
        params,
    });
}

export {
    getMyPacket,
    getMyPacketList,
    getMyPacketHistory,
    getAllPacket,
    pullMyPacket,
    getAllHistory,
    checkPacket,
    pushPacket,
    recyclePacket,
};
