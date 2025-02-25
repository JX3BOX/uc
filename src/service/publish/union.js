import { $cms } from "@jx3box/jx3box-common/js/https";

function getUnionPosts(params) {
    return $cms().get(`/api/cms/posts/user/my/union`, {
        params,
    });
}

function quitUnionPost(post_id) {
    return $cms().delete(`/api/cms/post/${post_id}/authors/quit`);
}

function getUnionAuthors(post_id) {
    return $cms().get(`/api/cms/post/${post_id}/authors`);
}

function addUnionAuthor(post_id, author_id) {
    return $cms().post(`/api/cms/post/${post_id}/author/${author_id}`, {
        label: "撰稿",
        r_edit: 1,
    });
}

function updateUnionAuthor(post_id, author_id, data) {
    return $cms().put(`/api/cms/post/${post_id}/author/${author_id}`, data);
}

function removeUnionAuthor(post_id, author_id) {
    return $cms().delete(`/api/cms/post/${post_id}/author/${author_id}`);
}

export { getUnionPosts, quitUnionPost, addUnionAuthor, getUnionAuthors, updateUnionAuthor, removeUnionAuthor };
