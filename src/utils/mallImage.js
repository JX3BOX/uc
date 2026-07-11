import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __cdn } from "@/utils/config";

export function normalizeMallImage(url) {
    const value = String(url || "").trim();
    if (!value) return "";
    if (/^(?:data:|blob:)/i.test(value)) return value;
    if (value.startsWith("//")) return resolveImagePath(`https:${value}`);
    if (/^https?:\/\//i.test(value)) return resolveImagePath(value);
    return resolveImagePath(`${__cdn}${value.replace(/^\/+/, "")}`);
}
