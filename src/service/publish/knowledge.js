import { $cms } from "@jx3box/jx3box-common/js/https.js";

function get_menus() {
    return $cms()({
        method: "GET",
        url: `/api/cms/helper/knowledge/types`,
    });
}

function get_list(params) {
    return $cms()({
        method: "GET",
        url: `/api/cms/helper/knowledge`,
        params: params,
    });
}

function create_knowledge(data) {
    return $cms().post(`/api/cms/helper/knowledge`, data);
}

export { get_menus, get_list, create_knowledge };
