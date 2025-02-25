import { $cms } from "@jx3box/jx3box-common/js/https.js";

const addRevision = (postId, data) => {
    return $cms().post(`/api/cms/post/${postId}/revision`, data);
};

const getRevision = (postId, revisionId) => {
    return $cms().get(`/api/cms/post/${postId}/revision/${revisionId}`);
};

const getRevisions = (postId, params) => {
    return $cms().get(`/api/cms/post/${postId}/revisions`, {
        params,
    });
};

const putRevision = (postId, revisionId, data) => {
    return $cms().put(`/api/cms/post/${postId}/revision/${revisionId}`, data);
};

const removeRevision = (postId, revisionId) => {
    return $cms().delete(`/api/cms/post/${postId}/revision/${revisionId}`);
};

const removeRevisions = (postId, ids) => {
    return $cms().delete(`/api/cms/post/${postId}/revisions?list=${ids}`);
};

export { addRevision, getRevision, getRevisions, putRevision, removeRevisions, removeRevision };
