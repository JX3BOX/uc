import { $cms } from "@jx3box/jx3box-common/js/https.js";
import axios from "axios";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}
function getDecorationJson() {
    let url = __cdn + "design/decoration/index.json";
    return axios.get(url);
}
export { getDecoration, getDecorationJson };
