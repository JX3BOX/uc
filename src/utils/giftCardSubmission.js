import { reactive } from "vue";
import User from "@jx3box/jx3box-common/js/user";

let accountId;
let state;

// 同一页面的输入、结果重试和历史申请共享提交限制；切换账号时重置。
export function getGiftCardSubmissionState() {
    const uid = User.getInfo()?.uid;
    if (!state || accountId !== uid) {
        accountId = uid;
        state = reactive({ submitting: false, lastSubmitted: {}, blockedUntil: 0 });
    }
    return state;
}

export function handleGiftCardLimit(state, message, code) {
    if (message === "请勿在2秒内重复提交同一核销码") {
        state.lastSubmitted = { ...state.lastSubmitted, [code.toUpperCase()]: Date.now() };
    }
    if (message === "核销码连续校验失败5次，请60秒后重试" && state.blockedUntil <= Date.now()) {
        state.blockedUntil = Date.now() + 60000;
    }
}
