import { $cms } from "@jx3box/jx3box-common/js/api.js";


// 获取topic bucket
function get_topic_bucket(params) {
    return $cms().get("/api/cms/topic/bucket", {
        params,
    });
}

export { get_topic_bucket };
