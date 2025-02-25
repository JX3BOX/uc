import { $cms } from "@jx3box/jx3box-common/js/https.js";

function get_comments(params) {
    return $cms().get("/api/cms/wiki/comment/mine", { params });
}

function remove_comment(comment_id) {
    return $cms().delete(`/api/cms/wiki/comment/${comment_id}`);
}

export { get_comments, remove_comment };
