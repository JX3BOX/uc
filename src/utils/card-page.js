export const CARD_CLOSE_MESSAGE = "closeHolidayCard";

export function isCardOwnedBy(data, uid) {
    const ownerId = data?.user_id ?? data?.uid ?? data?.user?.id ?? data?.user?.uid;
    if (ownerId === undefined || ownerId === null || ownerId === "") return true;
    return String(ownerId) === String(uid);
}

export function leaveCardPage(router, uid) {
    if (typeof window === "undefined") return;

    if (window.parent && window.parent !== window) {
        window.parent.postMessage(CARD_CLOSE_MESSAGE, "*");
        return;
    }

    if (window.history.length > 1 && typeof router?.back === "function") {
        router.back();
        return;
    }

    if (uid) {
        window.location.assign(`/author/${encodeURIComponent(uid)}`);
    }
}
