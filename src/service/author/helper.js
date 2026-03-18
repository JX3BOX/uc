import { $cms } from "@jx3box/jx3box-common/js/api.js";

function getCollections(params) {
    return $cms().get(`/api/cms/post/collection`, { params });
}

function getNamespaces(params) {
    return $cms().get(`/api/cms/namespace`, { params });
}

function getWikis(params) {
    return $cms().get(`/api/cms/wiki/post`, { params });
}

export {  getCollections, getNamespaces, getWikis };
