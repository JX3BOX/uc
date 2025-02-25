import { $cms } from "@jx3box/jx3box-common/js/https";

export function getConfig(key) {
    return $cms().get("/api/cms/config",{
        params:{
            key:key
        }
    }).then((res) => {
        return res?.data?.data.val
    })
}
