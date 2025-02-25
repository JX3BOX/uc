import { $helper } from './axios'
import { $cms } from "@jx3box/jx3box-common/js/https.js"

function getCollections(params) {
    return $cms().get(`/api/cms/post/collection`, { params });
}

function getNamespaces(params) {
    return $cms().get(`/api/cms/namespace`, { params });
}

function getWikis(params) {
    return $cms().get(`/api/cms/wiki/post`, { params });
}

function muteUser(uid, params) {
    return $helper().put(`/api/user/${uid}/mute`, params);
}

export { $helper, getCollections, getNamespaces, getWikis, muteUser };
