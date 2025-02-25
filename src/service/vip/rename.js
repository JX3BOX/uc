import { $pay, $cms } from "@jx3box/jx3box-common/js/https";

function checkNickname(name) {
    return $pay({mute:true}).get("/api/vip/i/rename/check", {
        params: {
            name: name,
        },
    });
}

function doRename(name) {
    return $pay().put("/api/vip/i/rename", "", {
        params: {
            name: name,
        },
    });
}

export { checkNickname, doRename };
