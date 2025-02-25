import { $node } from "@jx3box/jx3box-common/js/https.js";

function get_list(params) {
    return $node()({
        method: "GET",
        url: `/quests`,
        params: params,
    });
}

export { get_list };
