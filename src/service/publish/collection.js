import { $cms } from "@jx3box/jx3box-common/js/https.js";

function get_my_collections(params) {
    return $cms()({
        method: "GET",
        url: `/api/cms/post/collection/mine`,
        params: params,
    });
}


function createCollection(data){
    return $cms().post(`/api/cms/post/collection`, data);
}

function updateCollection(id, data){
    return $cms().put(`/api/cms/post/collection/${id}`, data);
}

function remove_collection(collection_id) {
    return $cms().delete(`/api/cms/post/collection/${collection_id}`);
}

function appendToCollection(data) {
    return $cms().post(`/api/cms/post/${data.post_type}-${data.post_id}/append-to-collection/${data.post_collection}`, {
        title: data.post_title,
    });
}

function getCollectionRaw(collection_id) {
    return $cms()({
        method: "GET",
        url: `/api/cms/post/collection/${collection_id}/raw`,
    });
}

export { get_my_collections, remove_collection, appendToCollection, createCollection, updateCollection, getCollectionRaw };
