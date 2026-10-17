const STORAGE_KEY = "account-login-locks";

// 保存服务端提供的截止时间，刷新页面后仍可显示；读取失败不影响登录。
export function readLoginLocks() {
    try {
        const entries = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
        return Object.fromEntries(
            Object.entries(entries).filter(([, deadline]) => Number.isFinite(deadline) && deadline > Date.now())
        );
    } catch {
        return {};
    }
}

export function saveLoginLocks(locks) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(locks));
    } catch {
        // 存储不可用时保留当前页面内的倒计时。
    }
}

export function loginLockDeadline(error, now = Date.now()) {
    const response = error?.response?.data;
    const seconds = Number(response?.data?.retry_after);
    if (![13000, 20035].includes(Number(response?.code)) || !Number.isFinite(seconds) || seconds <= 0) return 0;
    return now + Math.ceil(seconds) * 1000;
}

export function formatLoginLockTime(seconds) {
    const total = Math.max(0, Math.ceil(seconds));
    return [Math.floor(total / 3600), Math.floor(total / 60) % 60, total % 60]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
}
