import { $node } from "@jx3box/jx3box-common/js/api.js";

// 成就搜索
function search_achievements(params) {
    return $node().get(`/achievement/search`, {
        params,
    });
}

export { search_achievements };
