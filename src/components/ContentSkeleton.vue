<template>
    <div
        class="c-content-skeleton"
        :class="[`is-${variant}`, { 'is-compact': compact }]"
        role="status"
        aria-live="polite"
        :aria-label="ariaLabel"
    >
        <template v-if="variant === 'dashboard'">
            <div class="m-skeleton-profile">
                <span class="u-skeleton-block u-skeleton-avatar"></span>
                <div class="u-skeleton-profile-content">
                    <span class="u-skeleton-block u-skeleton-heading"></span>
                    <span class="u-skeleton-block u-skeleton-line is-short"></span>
                    <span class="u-skeleton-block u-skeleton-line"></span>
                </div>
            </div>
            <div class="m-skeleton-cards" :style="columnStyle">
                <div v-for="index in 4" :key="`dashboard-card-${index}`" class="u-skeleton-card">
                    <span class="u-skeleton-block u-skeleton-line is-short"></span>
                    <span class="u-skeleton-block u-skeleton-value"></span>
                    <span class="u-skeleton-block u-skeleton-button"></span>
                </div>
            </div>
            <div class="m-skeleton-list">
                <div v-for="index in normalizedRows" :key="`dashboard-row-${index}`" class="u-skeleton-row">
                    <span class="u-skeleton-block u-skeleton-icon"></span>
                    <div class="u-skeleton-body">
                        <span class="u-skeleton-block u-skeleton-line" :style="lineWidth(index)"></span>
                        <span class="u-skeleton-block u-skeleton-line is-meta"></span>
                    </div>
                </div>
            </div>
        </template>

        <template v-else-if="variant === 'cards'">
            <div class="m-skeleton-cards" :style="columnStyle">
                <div v-for="index in normalizedRows" :key="`card-${index}`" class="u-skeleton-card">
                    <span class="u-skeleton-block u-skeleton-cover"></span>
                    <span class="u-skeleton-block u-skeleton-line" :style="lineWidth(index)"></span>
                    <span class="u-skeleton-block u-skeleton-line is-meta"></span>
                </div>
            </div>
        </template>

        <template v-else-if="variant === 'table'">
            <div class="m-skeleton-table" :style="columnStyle">
                <div class="u-skeleton-table-row is-header">
                    <span v-for="index in normalizedColumns" :key="`header-${index}`" class="u-skeleton-block"></span>
                </div>
                <div v-for="row in normalizedRows" :key="`table-row-${row}`" class="u-skeleton-table-row">
                    <span
                        v-for="column in normalizedColumns"
                        :key="`cell-${row}-${column}`"
                        class="u-skeleton-block"
                        :style="cellWidth(row, column)"
                    ></span>
                </div>
            </div>
        </template>

        <template v-else-if="variant === 'form'">
            <div class="m-skeleton-form">
                <div v-for="index in normalizedRows" :key="`form-row-${index}`" class="u-skeleton-form-row">
                    <span class="u-skeleton-block u-skeleton-label"></span>
                    <span class="u-skeleton-block u-skeleton-input" :class="{ 'is-large': index === normalizedRows }"></span>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="m-skeleton-list">
                <div v-for="index in normalizedRows" :key="`list-row-${index}`" class="u-skeleton-row">
                    <span class="u-skeleton-block u-skeleton-icon"></span>
                    <div class="u-skeleton-body">
                        <span class="u-skeleton-block u-skeleton-line" :style="lineWidth(index)"></span>
                        <span class="u-skeleton-block u-skeleton-line is-meta"></span>
                    </div>
                    <div class="u-skeleton-actions">
                        <span class="u-skeleton-block"></span>
                        <span class="u-skeleton-block"></span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "ContentSkeleton",
    props: {
        variant: {
            type: String,
            default: "list",
            validator: (value) => ["list", "table", "cards", "form", "dashboard"].includes(value),
        },
        rows: {
            type: Number,
            default: 5,
        },
        columns: {
            type: Number,
            default: 4,
        },
        compact: {
            type: Boolean,
            default: false,
        },
        ariaLabel: {
            type: String,
            default: "Loading content",
        },
    },
    computed: {
        normalizedRows() {
            return Math.min(Math.max(Math.round(this.rows) || 1, 1), 12);
        },
        normalizedColumns() {
            return Math.min(Math.max(Math.round(this.columns) || 1, 1), 6);
        },
        columnStyle() {
            return { "--skeleton-columns": this.normalizedColumns };
        },
    },
    methods: {
        lineWidth(index) {
            const widths = [72, 84, 64, 78, 58];
            return { width: `${widths[(index - 1) % widths.length]}%` };
        },
        cellWidth(row, column) {
            const widths = [64, 78, 52, 70, 58];
            return { width: `${widths[(row + column) % widths.length]}%` };
        },
    },
};
</script>

<style scoped lang="less">
.c-content-skeleton {
    width: 100%;
    box-sizing: border-box;
    color: transparent;
}

.u-skeleton-block {
    display: block;
    border-radius: 4px;
    background: linear-gradient(
        90deg,
        rgba(148, 163, 184, 0.12) 20%,
        rgba(148, 163, 184, 0.28) 38%,
        rgba(148, 163, 184, 0.12) 56%
    );
    background-size: 400% 100%;
    animation: content-skeleton-shimmer 1.35s ease infinite;
}

.m-skeleton-list {
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 4px;
}

.u-skeleton-row {
    display: flex;
    min-height: 72px;
    padding: 14px 12px;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);

    > * + * {
        margin-left: 12px;
    }

    &:last-child {
        border-bottom: 0;
    }
}

.u-skeleton-icon {
    flex: 0 0 26px;
    width: 26px;
    height: 26px;
    border-radius: 6px;
}

.u-skeleton-body,
.u-skeleton-profile-content {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;

    > * + * {
        margin-top: 10px;
    }
}

.u-skeleton-line {
    width: 74%;
    height: 14px;

    &.is-meta {
        width: 42%;
        height: 10px;
    }

    &.is-short {
        width: 46%;
    }
}

.u-skeleton-actions {
    display: flex;
    flex: 0 0 auto;

    > * + * {
        margin-left: 6px;
    }

    .u-skeleton-block {
        width: 34px;
        height: 28px;
    }
}

.m-skeleton-cards {
    display: grid;
    grid-template-columns: repeat(var(--skeleton-columns, 3), minmax(0, 1fr));
    gap: 16px;
}

.u-skeleton-card {
    display: flex;
    min-height: 132px;
    padding: 16px;
    flex-direction: column;
    box-sizing: border-box;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 6px;

    > * + * {
        margin-top: 12px;
    }
}

.u-skeleton-cover {
    width: 100%;
    height: 96px;
}

.u-skeleton-value {
    width: 54%;
    height: 30px;
}

.u-skeleton-button {
    width: 64px;
    height: 26px;
    margin-top: auto;
}

.m-skeleton-table {
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 4px;
}

.u-skeleton-table-row {
    display: grid;
    grid-template-columns: repeat(var(--skeleton-columns, 4), minmax(0, 1fr));
    min-height: 52px;
    padding: 12px 16px;
    align-items: center;
    gap: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);

    &:last-child {
        border-bottom: 0;
    }

    &.is-header {
        min-height: 44px;
        background: rgba(148, 163, 184, 0.06);
    }

    .u-skeleton-block {
        width: 68%;
        height: 12px;
    }
}

.m-skeleton-form {
    display: flex;
    max-width: 760px;
    flex-direction: column;

    > * + * {
        margin-top: 20px;
    }
}

.u-skeleton-form-row {
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr);
    align-items: start;
    gap: 18px;
}

.u-skeleton-label {
    width: 72px;
    height: 14px;
    margin-top: 13px;
}

.u-skeleton-input {
    width: 100%;
    height: 40px;

    &.is-large {
        height: 96px;
    }
}

.m-skeleton-profile {
    display: flex;
    padding: 20px;
    align-items: center;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 6px;

    > * + * {
        margin-left: 20px;
    }
}

.u-skeleton-avatar {
    flex: 0 0 96px;
    width: 96px;
    height: 96px;
    border-radius: 50%;
}

.u-skeleton-heading {
    width: 38%;
    height: 24px;
}

.is-dashboard {
    display: flex;
    flex-direction: column;

    > * + * {
        margin-top: 20px;
    }

    .m-skeleton-cards {
        --skeleton-columns: 4;
    }
}

.is-compact {
    .u-skeleton-row {
        min-height: 56px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .u-skeleton-card {
        min-height: 96px;
        padding: 12px;
    }
}

@keyframes content-skeleton-shimmer {
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: 0 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .u-skeleton-block {
        animation: none;
    }
}

@media screen and (max-width: 720px) {
    .m-skeleton-cards,
    .is-dashboard .m-skeleton-cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .u-skeleton-actions {
        display: none;
    }

    .u-skeleton-form-row {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .u-skeleton-label {
        margin-top: 0;
    }
}

@media screen and (max-width: 420px) {
    .m-skeleton-cards,
    .is-dashboard .m-skeleton-cards {
        grid-template-columns: 1fr;
    }

    .m-skeleton-profile {
        align-items: flex-start;
    }

    .u-skeleton-avatar {
        flex-basis: 72px;
        width: 72px;
        height: 72px;
    }
}
</style>
