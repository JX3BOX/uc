import { $next } from "@jx3box/jx3box-common/js/https";

// 获取提交记录
export function getCommitHistories(content_meta_id, params) {
    return $next().get(`/api/next2/userdata/commit-history/content-meta/${content_meta_id}/commit/history`, {
        params,
    });
}

// 通过hash获取提交记录
export function getCommitByHash(content_meta_id, hash) {
    return $next().get(`/api/next2/userdata/commit-history/content-meta/${content_meta_id}/commit/by-hash/${hash}`);
}

// 通过id获取提交记录
export function getCommitById(content_meta_id, id) {
    return $next().get(`/api/next2/userdata/commit-history/content-meta/${content_meta_id}/commit/by-id/${id}`);
}

// 提交
export function commitHistory(id, data) {
    // { domain: "https://dev.next2.jx3box.com" }
    return $next().post(`/api/next2/userdata/commit-history/content-meta/${id}/commit`, data);
}
