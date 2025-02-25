import { $next } from "@jx3box/jx3box-common/js/https";

function getNextStat() {
    return $next().get(`/api/my-resource/stat`);
}

function getMyComments(params) {
    return $next().get(`/api/my-comment/list/page/${params.page || 1}`, {
        params: {
            pageSize: params.per,
            key: params.search,
        },
    });
}

function deleteComment(id) {
    return $next().delete(`/api/my-comment/${id}`);
}

function setCommentConfig(category, articleId, action) {
    return $next({ mute: true }).put(`/api/next2/comment/${category}/article/${articleId}/meta/white-list/${action}`);
}

function getCommentConfig(category, articleId) {
    return $next().get(`/api/next2/comment/${category}/article/${articleId}/meta`);
}

function setCommentVisible(category, articleId, action) {
    return $next({ mute: true }).put(`/api/next2/comment/${category}/article/${articleId}/meta/visible/${action}`);
}

export { getNextStat, getMyComments, deleteComment, setCommentConfig, getCommentConfig, setCommentVisible };
