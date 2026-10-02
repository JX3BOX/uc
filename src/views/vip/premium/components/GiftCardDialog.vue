<template>
    <el-dialog v-model="visible" :title="$t('vip.premium.giftCardTitle')" width="460px" align-center class="m-gift-card-dialog">
        <template #header="{ titleId, titleClass }">
            <div class="m-gift-card-heading">
                <el-icon class="u-gift-icon" aria-hidden="true"><Present /></el-icon>
                <div>
                    <h2 :id="titleId" :class="titleClass">{{ $t('vip.premium.giftCardTitle') }}</h2>
                    <p class="u-hint">{{ $t('vip.premium.giftCardHint') }}</p>
                </div>
            </div>
        </template>
        <div class="m-gift-card-account">
            <el-icon class="u-account-icon" aria-hidden="true"><UserIcon /></el-icon>
            <div>
                <span>{{ $t('vip.premium.giftCardRecipient') }}</span>
                <b>{{ accountName }}</b>
            </div>
        </div>
        <form class="m-gift-card-form" @submit.prevent="submitCode(inputCode)">
            <label for="premium-gift-code">{{ $t('vip.premium.giftCardCodeLabel') }}</label>
            <el-input
                id="premium-gift-code"
                v-model="inputCode"
                :placeholder="$t('vip.premium.giftCardPlaceholder')"
                :class="{ 'is-invalid': !!formError }"
                :aria-invalid="!!formError"
                :aria-describedby="formError ? 'premium-gift-code-error' : undefined"
                clearable
                :disabled="submitting"
            />
            <p v-if="formError" id="premium-gift-code-error" class="u-error" role="alert">{{ formError }}</p>
            <p v-if="blockedSeconds" class="u-warning">{{ $t('vip.premium.giftCardWait', { seconds: blockedSeconds }) }}</p>
            <el-button type="primary" native-type="submit" :loading="submitting" :disabled="blockedSeconds > 0">
                {{ $t('vip.premium.giftCardRedeem') }}
            </el-button>
        </form>

        <div v-if="result" class="m-gift-card-result" :class="{ 'is-success': isGranted(result.data) }" role="status">
            <b>{{ resultTitle(result.data) }}</b>
            <p v-if="isGranted(result.data)">{{ successHint }}</p>
            <p v-else-if="result.message">{{ result.message }}</p>
            <p class="u-code">{{ result.code }}</p>
            <el-button
                v-if="result.data?.retryable && !isGranted(result.data) && !(result.data?.redemption_status === 3 && result.data?.grant_status === 2)"
                size="small"
                :loading="submitting"
                :disabled="blockedSeconds > 0 || cooldownSeconds(result.code) > 0"
                @click="submitCode(result.code)"
            >
                {{ result.data.redemption_status === 3 ? $t('vip.premium.giftCardApply') : $t('vip.premium.giftCardRetry') }}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { Present, User as UserIcon } from "@element-plus/icons-vue";
import User from "@jx3box/jx3box-common/js/user";
import { getGiftCardSubmissionState, handleGiftCardLimit } from "@/utils/giftCardSubmission";
import { redeemGiftCard } from "@/service/vip/giftCard";

const TWO_SECONDS = 2000;

export default {
    name: "GiftCardDialog",
    components: { Present, UserIcon },
    props: { modelValue: Boolean },
    emits: ["update:modelValue", "redeemed"],
    data() {
        return {
            inputCode: "",
            formError: "",
            result: null,
            submission: getGiftCardSubmissionState(),
            now: Date.now(),
            timer: null,
        };
    },
    computed: {
        submitting: {
            get() { return this.submission.submitting; },
            set(value) { this.submission.submitting = value; },
        },
        lastSubmitted: {
            get() { return this.submission.lastSubmitted; },
            set(value) { this.submission.lastSubmitted = value; },
        },
        blockedUntil() {
            return this.submission.blockedUntil;
        },
        visible: {
            get() { return this.modelValue; },
            set(value) { this.$emit("update:modelValue", value); },
        },
        accountName() {
            const info = User.getInfo() || {};
            return info.name ? `${info.name} (UID ${info.uid || "—"})` : `UID ${info.uid || "—"}`;
        },
        successHint() {
            const days = this.result?.days;
            return days > 0
                ? this.$t("vip.premium.giftCardSuccessDaysHint", { days })
                : this.$t("vip.premium.giftCardSuccessHint");
        },
        blockedSeconds() {
            return Math.max(0, Math.ceil((this.blockedUntil - this.now) / 1000));
        },
    },
    methods: {
        cooldownSeconds(code) {
            return Math.max(0, Math.ceil(((this.lastSubmitted[code?.toUpperCase()] || 0) + TWO_SECONDS - this.now) / 1000));
        },
        isGranted(data) {
            return data?.redemption_status === 3 && data?.grant_status === 4;
        },
        grantText(status) {
            const key = { 0: "giftCardNotGranted", 1: "giftCardWaiting", 2: "giftCardGranting", 3: "giftCardPending", 4: "giftCardGranted" }[status];
            return key ? this.$t(`vip.premium.${key}`) : this.$t("vip.premium.giftCardUnknown");
        },
        resultTitle(data) {
            if (this.isGranted(data)) return this.$t("vip.premium.giftCardSuccess");
            if (data?.redemption_status === 3) return this.grantText(data.grant_status);
            if (data?.redemption_status === 2) return this.$t("vip.premium.giftCardFailed");
            return this.$t("vip.premium.giftCardUnconfirmed");
        },
        showResult(payload, code) {
            const data = payload.data;
            this.result = { code: data.code || code, data, message: data.message || payload.msg || "" };
            if (this.isGranted(data)) {
                this.inputCode = "";
                this.$emit("redeemed");
            }
        },
        async readMemberAsset() {
            try {
                return await User.getAsset();
            } catch {
                return null;
            }
        },
        async updateGrantedDays(previousAsset, result) {
            if (!previousAsset || !this.isGranted(result?.data)) return;
            const asset = await this.readMemberAsset();
            if (!asset || this.result !== result) return;
            const previousDays = Number(previousAsset.pro_total_day);
            const currentDays = Number(asset.pro_total_day);
            const days = currentDays - previousDays;
            if (Number.isInteger(days) && days > 0) result.days = days;
        },
        async submitCode(rawCode) {
            if (this.submitting) return;
            if (!User.isLogin()) return User.toLogin();
            const code = String(rawCode || "").trim();
            const length = Array.from(code).length;
            if (!length || length > 64) {
                this.formError = this.$t(length ? "vip.premium.giftCardTooLong" : "vip.premium.giftCardRequired");
                return;
            }
            this.now = Date.now();
            if (this.blockedSeconds || this.cooldownSeconds(code)) return;
            this.formError = "";
            this.submitting = true;
            const normalizedCode = code.toUpperCase();
            this.lastSubmitted = { ...this.lastSubmitted, [normalizedCode]: Date.now() };
            const previousAsset = await this.readMemberAsset();
            try {
                const response = await redeemGiftCard(code);
                const payload = response.data || {};
                if (payload.code === 407) {
                    this.handleLimit(payload.msg, normalizedCode);
                    return;
                }
                if ((payload.code === 0 || payload.code === 40005) && payload.data) {
                    this.showResult(payload, code);
                    await this.updateGrantedDays(previousAsset, this.result);
                    return;
                }
                this.result = null;
                this.formError = payload.msg || this.$t("vip.premium.giftCardRequestError");
                if (payload.code === 401) User.toLogin();
            } catch (error) {
                const payload = error?.response?.data;
                if (payload?.code === 407) this.handleLimit(payload.msg, normalizedCode);
                else if (payload?.code === 40005 && payload.data) {
                    this.showResult(payload, code);
                    await this.updateGrantedDays(previousAsset, this.result);
                } else {
                    this.result = null;
                    this.formError = payload?.msg || this.$t("vip.premium.giftCardUncertain");
                    if (payload?.code === 401) User.toLogin();
                    else if (!payload || payload.code === 50001 || payload.code === 50002) {
                        this.result = { code, data: { redemption_status: 1, retryable: true }, message: this.$t("vip.premium.giftCardUncertain") };
                    }
                }
            } finally {
                this.submitting = false;
            }
        },
        handleLimit(message, code) {
            this.formError = message || this.$t("vip.premium.giftCardRequestError");
            handleGiftCardLimit(this.submission, message, code);
        },
    },
    mounted() {
        this.timer = window.setInterval(() => { this.now = Date.now(); }, 500);
    },
    beforeUnmount() {
        window.clearInterval(this.timer);
    },
};
</script>

<style lang="less">
.el-dialog.m-gift-card-dialog {
    --el-color-primary: @v4primary;
    --el-color-primary-light-3: lighten(@v4primary, 10%);
    --el-color-primary-dark-2: darken(@v4primary, 8%);
    max-width: calc(100vw - 32px);
    padding: 0;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 16px 48px #24292e26;

    .el-dialog__header {
        margin: 0;
        padding: 24px 58px 22px 24px;
        border-bottom: 1px solid #e5e7eb;
    }
    .m-gift-card-heading {
        display: flex;
        align-items: center;
        gap: 12px;
        h2 {
            margin: 0;
            color: #24292e;
            font-size: 18px;
            font-weight: 700;
            line-height: 26px;
        }
    }
    .u-gift-icon {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        border-radius: 10px;
        color: @v4primary;
        background: fade(@v4primary, 8%);
        svg { width: 22px; height: 22px; }
    }
    .u-hint {
        margin: 4px 0 0;
        color: #6b7280;
        font-size: 13px;
        line-height: 20px;
    }
    .el-dialog__headerbtn {
        top: 24px;
        right: 20px;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        &:hover { background: #f8fafc; }
    }
    .el-dialog__body {
        padding: 24px;
        color: #24292e;
        font-size: 14px;
        line-height: 1.6;
        overflow-wrap: anywhere;
    }
    .m-gift-card-account {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 8px;
        background: #f8fafc;
        .u-account-icon {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            color: #6b7280;
            svg { width: 20px; height: 20px; }
        }
        > div { min-width: 0; }
        span { display: block; color: #6b7280; font-size: 12px; line-height: 18px; }
        b { display: block; margin-top: 2px; font-size: 14px; line-height: 22px; font-weight: 500; }
    }
    .m-gift-card-form {
        margin-top: 22px;
        label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; }
        .el-input { width: 100%; height: 44px; }
        .el-input__wrapper {
            padding: 1px 14px;
            border-radius: 6px;
            box-shadow: 0 0 0 1px #e5e7eb inset;
            &:hover { box-shadow: 0 0 0 1px #c0c4cc inset; }
            &.is-focus { box-shadow: 0 0 0 1px @v4primary inset; }
        }
        .el-input.is-invalid .el-input__wrapper { box-shadow: 0 0 0 1px #c45656 inset; }
        .el-input__inner { font-size: 14px; }
        .el-button {
            width: 100%;
            height: 40px;
            margin: 20px 0 0;
            padding: 0 20px;
            border-radius: 6px;
            font-weight: 700;
            --el-button-bg-color: @v4primary;
            --el-button-border-color: @v4primary;
            --el-button-hover-bg-color: darken(@v4primary, 6%);
            --el-button-hover-border-color: darken(@v4primary, 6%);
            --el-button-active-bg-color: darken(@v4primary, 10%);
            --el-button-active-border-color: darken(@v4primary, 10%);
        }
    }
    .u-error, .u-warning { margin: 8px 0 0; font-size: 13px; line-height: 20px; }
    .u-error { color: #c45656; }
    .u-warning { color: #b88230; }
    .m-gift-card-result {
        padding: 16px;
        margin: 20px 0 0;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #f8fafc;
        b { font-size: 14px; }
        p { margin: 6px 0 0; font-size: 13px; }
        &.is-success {
            border-color: fade(@v4primary, 24%);
            background: fade(@v4primary, 5%);
            b { color: @v4primary; }
        }
        .el-button { margin-top: 12px; border-radius: 6px; }
    }
    .u-code { word-break: break-all; color: #6b7280; }
    @media (max-width: 600px) {
        .el-dialog__header { padding: 20px 52px 20px 20px; }
        .el-dialog__headerbtn { top: 20px; right: 12px; }
        .el-dialog__body { padding: 20px; }
    }
}
</style>
