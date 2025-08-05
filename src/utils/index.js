import { pickBy } from "lodash";

function removeEmpty(obj) {
    return pickBy(obj, (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && value !== null && Object.keys(value).length === 0) return false;
        return true; // 保留其它情况，包括 0, false 等
    });
}

export { removeEmpty };
