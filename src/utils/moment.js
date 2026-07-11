import moment from "moment";
import "moment/locale/vi";
import "moment/locale/zh-cn";
import "moment/locale/zh-tw";

const MOMENT_LOCALE_MAP = {
    "zh-cn": "zh-cn",
    "zh-tw": "zh-tw",
    "en-us": "en",
    vi: "vi",
};

function getMomentLocale() {
    const locale = (localStorage.getItem("lang") || "zh-cn").toLowerCase();
    return MOMENT_LOCALE_MAP[locale] || "zh-cn";
}

function dateFormat(value) {
    return moment(value).locale(getMomentLocale()).fromNow();
}

export default dateFormat;
