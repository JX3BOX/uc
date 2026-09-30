<template>
    <el-dialog v-model="visible" :title="$t('vip.premium.giftCardTitle')" width="620px" class="m-gift-card-dialog" @open="loadHistory">
        <p class="u-account">{{ $t('vip.premium.giftCardAccount', { name: accountName }) }}</p>
        <p class="u-hint">{{ $t('vip.premium.giftCardHint') }}</p>
        <form class="m-gift-card-form" @submit.prevent="submitCode(inputCode)">
            <el-input v-model="inputCode" :placeholder="$t('vip.premium.giftCardPlaceholder')" clearable :disabled="submitting" />
            <el-button type="primary" native-type="submit" :loading="submitting" :disabled="blockedSeconds > 0">
                {{ $t('vip.premium.giftCardRedeem') }}
            </el-button>
        </form>
        <p v-if="formError" class="u-error" role="alert">{{ formError }}</p>
        <p v-if="blockedSeconds" class="u-warning">{{ $t('vip.premium.giftCardWait', { seconds: blockedSeconds }) }}</p>

        <div v-if="result" class="m-gift-card-result" :class="{ 'is-success': isGranted(result.data) }" role="status">
            <b>{{ resultTitle(result.data) }}</b>
            <p v-if="result.message">{{ result.message }}</p>
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

        <section class="m-gift-card-history">
            <div class="u-heading">
                <b>{{ $t('vip.premium.giftCardHistory') }}</b>
                <el-button text :loading="historyLoading" @click="loadHistory">{{ $t('vip.premium.giftCardRefresh') }}</el-button>
            </div>
            <el-select v-model="grantFilter" :placeholder="$t('vip.premium.giftCardFilter')" @change="changeFilter">
                <el-option :label="$t('vip.premium.giftCardAll')" value="all" />
                <el-option v-for="status in [0, 1, 2, 3, 4]" :key="status" :label="grantText(status)" :value="status" />
            </el-select>
            <p v-if="historyError" class="u-error" role="alert">{{ historyError }}</p>
            <div v-else-if="!historyLoading && !history.length" class="u-empty">{{ $t('vip.premium.giftCardEmpty') }}</div>
            <div v-for="item in history" :key="item.id" class="u-history-row">
                <div class="u-history-main">
                    <b>{{ item.label === 'jx3box_pro_30' ? $t('vip.premium.giftCardPro') : $t('vip.premium.giftCardOther') }}</b>
                    <span>{{ grantText(item.grant_status) }}</span>
                </div>
                <div class="u-history-meta">
                    <span>{{ item.code }}</span>
                    <el-button text size="small" @click="copyCode(item.code)">{{ $t('vip.premium.giftCardCopy') }}</el-button>
                </div>
                <p>{{ $t('vip.premium.giftCardRedeemedAt') }}{{ formatTime(item.redeemed_at) }} · {{ $t('vip.premium.giftCardGrantedAt') }}{{ formatTime(item.granted_at) }}</p>
                <p v-if="item.grant_status !== 4 && item.message">{{ item.message }}</p>
                <el-button
                    v-if="item.grant_status !== 2 && item.grant_status !== 4 && item.retryable"
                    size="small"
                    :loading="submitting"
                    :disabled="blockedSeconds > 0 || cooldownSeconds(item.code) > 0"
                    @click="submitCode(item.code)"
                >{{ $t('vip.premium.giftCardApply') }}</el-button>
            </div>
            <el-pagination
                v-if="historyTotal > 15"
                v-model:current-page="historyPage"
                small
                layout="prev, pager, next"
                :page-size="15"
                :total="historyTotal"
                @current-change="loadHistory"
            />
        </section>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getGiftCardHistory, redeemGiftCard } from "@/service/vip/giftCard";

const TWO_SECONDS = 2000;

export default {
    name: "GiftCardDialog",
    props: { modelValue: Boolean },
    emits: ["update:modelValue"],
    data() {
        return {
            inputCode: "",
            formError: "",
            result: null,
            submitting: false,
            lastSubmitted: {},
            blockedUntil: 0,
            now: Date.now(),
            timer: null,
            history: [],
            historyPage: 1,
            historyTotal: 0,
            historyLoading: false,
            historyError: "",
            grantFilter: "all",
        };
    },
    computed: {
        visible: {
            get() { return this.modelValue; },
            set(value) { this.$emit("update:modelValue", value); },
        },
        accountName() {
            const info = User.getInfo() || {};
            return info.name ? `${info.name} (UID ${info.uid || "—"})` : `UID ${info.uid || "—"}`;
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
        formatTime(value) {
            return value ? new Date(value).toLocaleString() : "—";
        },
        async copyCode(code) {
            try {
                await navigator.clipboard.writeText(code);
                this.$message.success(this.$t("vip.premium.giftCardCopied"));
            } catch {
                this.$message.error(this.$t("vip.premium.giftCardCopyFailed"));
            }
        },
        changeFilter() {
            this.historyPage = 1;
            this.loadHistory();
        },
        async loadHistory() {
            if (!this.visible || !User.isLogin()) return;
            this.historyLoading = true;
            this.historyError = "";
            try {
                const params = { pageIndex: this.historyPage, pageSize: 15 };
                if (this.grantFilter !== "all") params.grant_status = this.grantFilter;
                const response = await getGiftCardHistory(params);
                if (response.data?.code !== 0) throw response;
                this.history = response.data.data?.list || [];
                this.historyTotal = response.data.data?.page?.total || 0;
            } catch (error) {
                this.historyError = error?.response?.data?.msg || error?.data?.msg || this.$t("vip.premium.giftCardHistoryError");
            } finally {
                this.historyLoading = false;
            }
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
            try {
                const response = await redeemGiftCard(code);
                const payload = response.data || {};
                if (payload.code === 407) {
                    this.handleLimit(payload.msg, normalizedCode);
                    return;
                }
                if ((payload.code === 0 || payload.code === 40005) && payload.data) {
                    const data = payload.data;
                    this.result = { code: data.code || code, data, message: data.message || payload.msg || "" };
                    if (data.redemption_status === 3 && !this.isGranted(data)) await this.loadHistory();
                    if (this.isGranted(data)) {
                        try {
                            await this.$alert(this.$t("vip.premium.giftCardSuccessHint"), this.$t("vip.premium.giftCardSuccess"), {
                                confirmButtonText: this.$t("vip.common.confirm"),
                                type: "success",
                            });
                        } finally {
                            window.location.reload();
                        }
                    }
                    return;
                }
                this.formError = payload.msg || this.$t("vip.premium.giftCardRequestError");
                if (payload.code === 401) User.toLogin();
            } catch (error) {
                const payload = error?.response?.data;
                if (payload?.code === 407) this.handleLimit(payload.msg, normalizedCode);
                else if (payload?.code === 40005 && payload.data) {
                    this.result = { code: payload.data.code || code, data: payload.data, message: payload.data.message || payload.msg || "" };
                } else {
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
            if (message === "请勿在2秒内重复提交同一核销码") {
                this.lastSubmitted = { ...this.lastSubmitted, [code]: Date.now() };
            }
            if (message === "核销码连续校验失败5次，请60秒后重试" && this.blockedUntil <= Date.now()) {
                this.blockedUntil = Date.now() + 60000;
            }
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
.m-gift-card-dialog {
    max-width: calc(100vw - 32px);
    .u-account, .u-hint { margin: 0 0 10px; color: #606266; line-height: 1.5; }
    .m-gift-card-form { display: flex; gap: 10px; margin: 18px 0 8px; }
    .m-gift-card-form .el-input { flex: 1; }
    .u-error { color: #c45656; }
    .u-warning { color: #b88230; }
    .m-gift-card-result { padding: 14px; margin: 20px 0; background: #f4f4f5; border-radius: 6px; }
    .m-gift-card-result.is-success { background: #f0f9eb; }
    .m-gift-card-result p { margin: 7px 0 0; }
    .u-code { word-break: break-all; color: #909399; }
    .m-gift-card-result .el-button { margin-top: 10px; }
    .m-gift-card-history { border-top: 1px solid #ebeef5; padding-top: 18px; margin-top: 20px; }
    .u-heading, .u-history-main, .u-history-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .u-heading { margin-bottom: 10px; }
    .u-history-row { padding: 14px 0; border-bottom: 1px solid #ebeef5; }
    .u-history-main span { color: #606266; }
    .u-history-meta span { overflow-wrap: anywhere; }
    .u-history-row p { color: #909399; font-size: 12px; margin: 5px 0; }
    .u-empty { padding: 24px 0; text-align: center; color: #909399; }
    .el-pagination { justify-content: center; margin-top: 14px; }
    @media (max-width: 600px) { .m-gift-card-form { flex-direction: column; } }
}
</style>
