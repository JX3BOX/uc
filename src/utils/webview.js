export function normalizeTrustedAppOrigin(value) {
    const source = String(value || "").trim();
    if (!source) return "";
    if (/^capacitor:\/\/localhost(?:[/?#]|$)/i.test(source)) return "capacitor://localhost";

    try {
        const origin = new URL(source).origin;
        return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin) ? origin : "";
    } catch (error) {
        return "";
    }
}

const CAPACITOR_PARENT_ORIGINS = ["https://localhost", "capacitor://localhost"];

export function resolveAppParentOrigins(options = {}) {
    const origins = [];
    const appendOrigin = (value) => {
        const trustedOrigin = normalizeTrustedAppOrigin(value);
        if (trustedOrigin && !origins.includes(trustedOrigin)) origins.push(trustedOrigin);
    };

    const ancestorOrigins = Array.from(options.ancestorOrigins || []);
    ancestorOrigins.forEach(appendOrigin);
    appendOrigin(options.referrer);

    if (options.includeCapacitorDefaults) {
        CAPACITOR_PARENT_ORIGINS.forEach(appendOrigin);
    }

    return origins;
}
