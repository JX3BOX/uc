<template>
    <div class="m-card-history">
        <div class="m-card-history-toolbar">
            <el-select v-model="grantStatus" :aria-label="$t('vip.premium.giftCardFilter')" @change="changeStatus">
                <el-option :label="$t('vip.premium.giftCardAll')" value="all" />
                <el-option v-for="status in statuses" :key="status" :label="grantText(status)" :value="status" />
            </el-select>
            <div class="u-actions">
                <el-button :disabled="loading" @click="loadHistory">{{ $t('vip.premium.giftCardRefresh') }}</el-button>
                <el-button type="primary" @click="dialogVisible = true">{{ $t('vip.premium.giftCardOpen') }}</el-button>
            </div>
        </div>
        <ContentSkeleton v-if="loading" variant="table" :rows="per" :columns="6" />
        <el-alert v-else-if="loadError" :title="loadError" type="error" :closable="false" show-icon />
        <el-table v-else-if="list.length" class="m-table" :data="list" row-key="id" show-header>
            <el-table-column :label="$t('vip.premium.giftCardCodeLabel')" min-width="280">
                <template #default="{ row }">
                    <div class="u-code">
                        <span class="u-history-code">{{ row.code }}</span>
                        <el-button link icon="DocumentCopy" size="small" @click="copyCode(row.code)">{{ $t('dashboard.common.copy') }}</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.cards.benefitName')" min-width="150">
                <template #default="{ row }">{{ $t(row.label === 'jx3box_pro_30' ? 'vip.premium.giftCardPro' : 'vip.premium.giftCardOther') }}</template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.cards.redeemedAt')" min-width="170">
                <template #default="{ row }">{{ formatTime(row.redeemed_at) }}</template>
            </el-table-column>
            <el-table-column :label="$t('vip.premium.giftCardFilter')" min-width="150">
                <template #default="{ row }"><el-tag :type="statusType(row.grant_status)" effect="plain">{{ grantText(row.grant_status) }}</el-tag></template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.cards.grantDetails')" min-width="220">
                <template #default="{ row }">{{ row.grant_status === 4 ? formatTime(row.granted_at) : row.message || '—' }}</template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.common.actions')" width="130">
                <template #default="{ row }">
                    <el-button v-if="canApply(row)" type="primary" plain size="small" :loading="applyingCode === row.code" :disabled="submission.submitting || blockedSeconds > 0 || cooldownSeconds(row.code) > 0" @click="applyGrant(row)">
                        {{ $t('vip.premium.giftCardApply') }}
                    </el-button>
                    <span v-else>—</span>
                </template>
            </el-table-column>
        </el-table>
        <el-alert v-else class="m-credit-null m-packet-null" :title="$t('vip.premium.giftCardEmpty')" type="info" center show-icon :closable="false" />
        <el-pagination
            v-if="!loading && !loadError && total > per"
            class="m-credit-pages"
            background
            :pager-count="5"
            :page-size="per"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="changePage"
        />
        <GiftCardDialog v-model="dialogVisible" @redeemed="refreshAsset" />
    </div>
</template>

<script>
import dayjs from "dayjs";
import User from "@jx3box/jx3box-common/js/user";
import { getGiftCardSubmissionState, handleGiftCardLimit } from "@/utils/giftCardSubmission";
import { getGiftCardHistory, redeemGiftCard } from "@/service/vip/giftCard";
import GiftCardDialog from "@/views/vip/premium/components/GiftCardDialog.vue";

export default {
    name: "GiftCardHistory",
    components: { GiftCardDialog },
    data() {
        const query = this.$route.query.tab === "history" ? this.$route.query : {};
        const status = query.grant_status;
        const page = Number(query.page);
        return {
            list: [],
            page: Number.isInteger(page) && page > 0 && page <= 1000000 ? page : 1,
            per: 15,
            total: 0,
            statuses: [0, 1, 2, 3, 4],
            grantStatus: /^[0-4]$/.test(String(status)) ? Number(status) : "all",
            loading: true,
            loadError: "",
            applyingCode: "",
            submission: getGiftCardSubmissionState(),
            now: Date.now(),
            timer: null,
            dialogVisible: false,
            requestId: 0,
            disposed: false,
        };
    },
    computed: {
        blockedSeconds() {
            return Math.max(0, Math.ceil((this.submission.blockedUntil - this.now) / 1000));
        },
    },
    watch: {
        dialogVisible(visible, previous) {
            if (previous && !visible) this.loadHistory();
        },
    },
    mounted() {
        this.timer = window.setInterval(() => { this.now = Date.now(); }, 500);
        this.loadHistory();
    },
    beforeUnmount() {
        this.disposed = true;
        this.requestId++;
        window.clearInterval(this.timer);
    },
    methods: {
        formatTime(value) {
            const date = value ? dayjs(value) : null;
            return date?.isValid() ? date.format("YYYY-MM-DD HH:mm:ss") : "—";
        },
        grantText(status) {
            const key = ["giftCardNotGranted", "giftCardWaiting", "giftCardGranting", "giftCardPending", "giftCardGranted"][status];
            return this.$t(`vip.premium.${key || "giftCardUnknown"}`);
        },
        statusType(status) {
            return ({ 0: "info", 1: "info", 2: "primary", 3: "warning", 4: "success" })[status] || "info";
        },
        canApply(row) {
            return row.retryable === true && row.redemption_status === 3 && row.grant_status !== 2 && row.grant_status !== 4;
        },
        async loadHistory() {
            if (this.disposed) return;
            const requestId = ++this.requestId;
            this.loading = true;
            this.loadError = "";
            const params = { pageIndex: this.page, pageSize: this.per };
            const query = { tab: "history", page: this.page };
            if (this.grantStatus !== "all") {
                params.grant_status = this.grantStatus;
                query.grant_status = this.grantStatus;
            }
            this.$router.replace({ name: "card", query });
            try {
                const { data: payload } = await getGiftCardHistory(params);
                if (requestId !== this.requestId) return;
                if (payload.code !== 0 || !payload.data) throw new Error(payload.msg || this.$t("vip.premium.giftCardHistoryError"));
                const { list, page } = payload.data;
                const pageTotal = Math.max(1, Number(page.pageTotal) || Math.ceil(page.total / this.per));
                if (this.page > pageTotal) {
                    this.page = 1;
                    return this.loadHistory();
                }
                this.list = list || [];
                this.total = Number(page.total) || 0;
            } catch (error) {
                if (requestId === this.requestId) {
                    this.list = [];
                    this.total = 0;
                    this.loadError = error?.response?.data?.msg || error.message || this.$t("vip.premium.giftCardHistoryError");
                }
            } finally {
                if (requestId === this.requestId) this.loading = false;
            }
        },
        changeStatus() {
            this.page = 1;
            this.loadHistory();
        },
        changePage(page) {
            this.page = page;
            this.loadHistory();
        },
        async copyCode(code) {
            try {
                await navigator.clipboard.writeText(code);
                this.$message.success(this.$t("vip.premium.giftCardCopied"));
            } catch {
                this.$message.error(this.$t("dashboard.common.copyManually"));
            }
        },
        cooldownSeconds(code) {
            return Math.max(0, Math.ceil(((this.submission.lastSubmitted[code?.toUpperCase()] || 0) + 2000 - this.now) / 1000));
        },
        async refreshAsset() {
            try {
                await User.getAsset();
            } catch {
                // 到账已经确认，会员展示同步失败不影响结果和历史刷新。
            }
        },
        notifyResult(data) {
            const granted = data.redemption_status === 3 && data.grant_status === 4;
            const message = data.redemption_status === 3
                ? this.grantText(data.grant_status)
                : data.message || this.$t("vip.premium.giftCardUnconfirmed");
            this.$message({ type: granted ? "success" : "info", message });
            return granted;
        },
        async applyGrant(row) {
            this.now = Date.now();
            if (this.submission.submitting || this.blockedSeconds || this.cooldownSeconds(row.code) || !this.canApply(row)) return;
            this.submission.submitting = true;
            this.submission.lastSubmitted = { ...this.submission.lastSubmitted, [row.code.toUpperCase()]: this.now };
            this.applyingCode = row.code;
            try {
                const { data: payload } = await redeemGiftCard(row.code);
                if (this.disposed) return;
                if ((payload.code === 0 || payload.code === 40005) && payload.data) {
                    if (this.notifyResult(payload.data)) await this.refreshAsset();
                } else {
                    if (payload.code === 407) handleGiftCardLimit(this.submission, payload.msg, row.code);
                    this.$message.error(payload.msg || this.$t("vip.premium.giftCardRequestError"));
                }
            } catch (error) {
                if (this.disposed) return;
                const payload = error?.response?.data;
                if (payload?.code === 40005 && payload.data) {
                    if (this.notifyResult(payload.data)) await this.refreshAsset();
                } else {
                    if (payload?.code === 407) handleGiftCardLimit(this.submission, payload.msg, row.code);
                    this.$message.error(payload?.msg || this.$t("vip.premium.giftCardUncertain"));
                }
            } finally {
                this.applyingCode = "";
                this.submission.submitting = false;
                await this.loadHistory();
            }
        },
    },
};
</script>

<style lang="less">
.m-card-history {
    .m-card-history-toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
        .el-select { width: 180px; }
        .u-actions { display: flex; flex-shrink: 0; gap: 8px; }
        .u-actions .el-button { margin: 0; }
    }
    .u-history-code { font-family: Consolas, monospace; overflow-wrap: anywhere; user-select: text; }
    .m-table td { opacity: 1; }
    @media (max-width: @phone) {
        .m-card-history-toolbar {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 8px;
            margin-bottom: 12px;
            .el-select { width: 100%; min-width: 0; }
            .u-actions { display: contents; }
            .u-actions .el-button:last-child { grid-column: 1 / -1; width: 100%; }
        }
    }
}
</style>
