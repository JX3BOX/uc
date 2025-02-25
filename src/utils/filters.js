import { bodyMap } from "@jx3box/jx3box-facedat/assets/data/index.json";
function showBodyType(val) {
    return bodyMap[val]?.label || "未知";
}

import school_id_map from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
function showSchoolIcon(val) {
    let id = val || 0;
    return __imgPath + "image/school/" + id + ".png";
}

function showSchoolName(val) {
    let id = val || 0;
    return (id && school_id_map[id]) || "未知";
}

import { showTime } from "@jx3box/jx3box-common/js/moment.js";
import { getThumbnail, authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";

export {
    showBodyType,
    showSchoolIcon,
    showSchoolName,
    showTime,
    getThumbnail,
    authorLink,
    showAvatar
};
