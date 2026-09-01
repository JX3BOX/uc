export function normalizeUrlAuthToken(value) {
    const token = Array.isArray(value) ? value[0] : value;
    return String(token || "").trim();
}

export function getUrlAuthToken(search) {
    const source =
        search === undefined ? (typeof window !== "undefined" ? window.location.search : "") : String(search || "");

    return normalizeUrlAuthToken(new URLSearchParams(source).get("__token"));
}

export function syncUrlAuthToken(options = {}) {
    const token = normalizeUrlAuthToken(options.token) || getUrlAuthToken(options.search);
    if (!token) return "";

    const targetStorage = options.storage || (typeof sessionStorage !== "undefined" ? sessionStorage : null);
    if (!targetStorage || typeof targetStorage.setItem !== "function") return "";

    try {
        targetStorage.setItem("__token", token);
        return token;
    } catch (error) {
        return "";
    }
}
