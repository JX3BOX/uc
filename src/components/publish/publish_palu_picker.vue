<template>
    <div class="m-publish-palu-picker" :data-testid="testId">
        <el-divider content-position="left">
            <span>{{ $t("publish.community.magicCard") }}</span>
            <el-tooltip effect="dark" :content="hintText" placement="top">
                <i class="el-icon-question u-title-help"></i>
            </el-tooltip>
        </el-divider>

        <div class="m-publish-palu-picker__panel" v-loading="loading">
            <header class="u-header">
                <div class="u-heading">
                    <span class="u-heading-icon"><i class="el-icon-magic-stick"></i></span>
                    <div>
                        <strong>{{ $t("publish.community.cardSelectHint") }}</strong>
                        <p>{{ hintText }}</p>
                    </div>
                </div>
                <span class="u-owned-summary">
                    {{
                        $t("publish.community.ownedSummary", {
                            types: ownedCardTypes,
                            count: ownedCardAmount,
                        })
                    }}
                </span>
            </header>

            <div v-if="loadFailed" class="u-load-failed">
                <span><i class="el-icon-warning-outline"></i>{{ $t("publish.palu.loadFailed") }}</span>
                <el-button size="small" plain @click="$emit('retry')">{{ $t("publish.palu.retry") }}</el-button>
            </div>

            <template v-else>
                <div v-if="displayCards.length" class="u-card-grid">
                    <button
                        v-for="item in displayCards"
                        :key="item.value"
                        type="button"
                        class="u-card"
                        :class="{
                            'is-selected': isSelected(item),
                            'is-current': isCurrent(item),
                        }"
                        :disabled="disabled"
                        @click="selectCard(item)"
                    >
                        <el-image :src="item.url" fit="fill" lazy />
                        <span v-if="isSelected(item)" class="u-card-status">
                            <i class="el-icon-check"></i>
                            <template v-if="isCurrent(item)">{{ $t("publish.community.decorated") }}</template>
                            <template v-else>{{ $t("publish.common.selected") }}</template>
                        </span>
                        <span v-else-if="isCurrent(item)" class="u-card-status is-original">
                            {{ $t("publish.community.currentDecoration") }}
                        </span>
                        <span
                            v-if="isCurrent(item) && item.amount <= 0 && !isSelected(item)"
                            class="u-card-amount is-restore"
                        >
                            {{ $t("publish.community.restoreDecoration") }}
                        </span>
                        <span v-else class="u-card-amount">
                            {{ $t("publish.community.remaining", { count: item.amount }) }}
                        </span>
                    </button>
                </div>

                <div v-else class="u-empty">
                    <i class="el-icon-box"></i>
                    <span>{{ $t("publish.community.noAvailableCards") }}</span>
                </div>

                <footer class="u-footer">
                    <div class="u-selection" :class="selectionStatusClass">
                        <i :class="selectionStatusIcon"></i>
                        <span>{{ selectionStatusText }}</span>
                    </div>
                    <div class="u-footer-actions">
                        <button
                            v-if="normalizedSelectedValue"
                            type="button"
                            class="u-remove"
                            :disabled="disabled"
                            @click="clearSelection"
                        >
                            <i class="el-icon-close"></i>{{ $t("publish.community.removeDecoration") }}
                        </button>
                        <a
                            class="u-redeem"
                            href="/vip/mall/list?category=virtual&sub_category=palu"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="el-icon-shopping-cart-full"></i>{{ $t("publish.community.getMoreCards") }}
                        </a>
                    </div>
                </footer>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "PublishPaluPicker",
    props: {
        modelValue: {
            type: [String, Number],
            default: "",
        },
        currentValue: {
            type: [String, Number],
            default: "",
        },
        cards: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        loadFailed: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        hint: {
            type: String,
            default: "",
        },
        consumeHint: {
            type: String,
            default: "",
        },
        removeHint: {
            type: String,
            default: "",
        },
        testId: {
            type: String,
            default: "publish-palu-picker",
        },
    },
    emits: ["update:modelValue", "retry"],
    computed: {
        normalizedSelectedValue() {
            return this.normalizeValue(this.modelValue);
        },
        normalizedCurrentValue() {
            return this.normalizeValue(this.currentValue);
        },
        hintText() {
            return this.hint || this.$t("publish.palu.settingsHint");
        },
        consumeHintText() {
            return this.consumeHint || this.$t("publish.palu.consumeOnSave");
        },
        removeHintText() {
            return this.removeHint || this.$t("publish.palu.removeOnSave");
        },
        displayCards() {
            return this.cards.filter((item) => Number(item.amount) > 0 || this.isCurrent(item));
        },
        ownedCardTypes() {
            return this.cards.filter((item) => Number(item.amount) > 0).length;
        },
        ownedCardAmount() {
            return this.cards.reduce((total, item) => total + Math.max(Number(item.amount) || 0, 0), 0);
        },
        hasChanged() {
            return this.normalizedSelectedValue !== this.normalizedCurrentValue;
        },
        selectionStatusText() {
            if (!this.hasChanged && this.normalizedCurrentValue) {
                return this.$t("publish.community.currentApplied");
            }
            if (!this.hasChanged) return this.$t("publish.community.noCurrentDecoration");
            if (!this.normalizedSelectedValue) return this.removeHintText;
            return this.consumeHintText;
        },
        selectionStatusClass() {
            if (!this.hasChanged) return this.normalizedCurrentValue ? "is-current" : "";
            return this.normalizedSelectedValue ? "is-consume" : "is-remove";
        },
        selectionStatusIcon() {
            if (!this.hasChanged) return this.normalizedCurrentValue ? "el-icon-circle-check" : "el-icon-info";
            return this.normalizedSelectedValue ? "el-icon-warning-outline" : "el-icon-remove-outline";
        },
    },
    methods: {
        normalizeValue(value) {
            return String(value || "").trim();
        },
        isCurrent(item) {
            return this.normalizeValue(item?.value) === this.normalizedCurrentValue;
        },
        isSelected(item) {
            return this.normalizeValue(item?.value) === this.normalizedSelectedValue;
        },
        selectCard(item) {
            if (this.disabled) return;

            if (Number(item.amount) <= 0 && !this.isCurrent(item)) {
                this.$message.warning(this.$t("publish.community.cardUsedUp"));
                return;
            }

            this.$emit("update:modelValue", this.isSelected(item) ? "" : item.value);
        },
        clearSelection() {
            if (!this.disabled) this.$emit("update:modelValue", "");
        },
    },
};
</script>

<style lang="less" scoped>
.m-publish-palu-picker {
    .u-title-help {
        margin-left: 5px;
        color: #a8abb2;
        cursor: help;
        font-size: 13px;
    }

    &__panel {
        overflow: hidden;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        background-color: #fafbfc;
    }

    .u-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 14px 16px;
        border-bottom: 1px solid #ebeef5;
        background: linear-gradient(135deg, fade(@v4primary, 7%) 0%, #ffffff 68%);
    }

    .u-heading {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;

        strong {
            display: block;
            color: #303133;
            font-size: 14px;
            line-height: 20px;
        }

        p {
            margin: 2px 0 0;
            color: #909399;
            font-size: 12px;
            line-height: 18px;
        }
    }

    .u-heading-icon {
        display: inline-flex;
        flex: 0 0 34px;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background-color: fade(@v4primary, 11%);
        color: @v4primary;
        font-size: 17px;
    }

    .u-owned-summary {
        flex-shrink: 0;
        padding: 4px 9px;
        border-radius: 12px;
        background-color: #f0f2f5;
        color: #606266;
        font-size: 12px;
        white-space: nowrap;
    }

    .u-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 10px;
        padding: 14px 16px;
    }

    .u-card {
        position: relative;
        display: block;
        width: 100%;
        height: 62px;
        overflow: hidden;
        padding: 0;
        border: 2px solid #dcdfe6;
        border-radius: 7px;
        box-sizing: border-box;
        background-color: #ffffff;
        box-shadow: 0 2px 7px rgba(31, 35, 41, 0.07);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

        .el-image {
            width: 100%;
            height: 100%;
        }

        &:hover:not(:disabled) {
            border-color: fade(@v4primary, 65%);
            box-shadow: 0 4px 12px fade(@v4primary, 13%);
            transform: translateY(-1px);
        }

        &:focus-visible {
            outline: 2px solid fade(@v4primary, 35%);
            outline-offset: 2px;
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.72;
        }

        &.is-selected {
            border-color: @v4primary;
            box-shadow: 0 4px 13px fade(@v4primary, 18%);
        }
    }

    .u-card-status,
    .u-card-amount {
        position: absolute;
        z-index: 2;
        font-size: 12px;
        line-height: 20px;
    }

    .u-card-status {
        top: 4px;
        left: 4px;
        padding: 0 8px;
        border-radius: 4px;
        background-color: @v4primary;
        color: #ffffff;

        &.is-original {
            background-color: rgba(48, 49, 51, 0.75);
        }
    }

    .u-card-amount {
        right: 5px;
        bottom: 5px;
        padding: 0 8px;
        border: 1px solid rgba(255, 255, 255, 0.55);
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.88);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        color: #303133;
        font-weight: 600;
        backdrop-filter: blur(4px);

        &.is-restore {
            border-color: @v4primary;
            background-color: @v4primary;
            color: #ffffff;
        }
    }

    .u-empty,
    .u-load-failed {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 76px;
        margin: 14px 16px;
        border: 1px dashed #dcdfe6;
        border-radius: 7px;
        background-color: #ffffff;
        color: #909399;
        font-size: 12px;
    }

    .u-load-failed {
        justify-content: space-between;
        min-height: auto;
        padding: 10px 12px;
        border-color: #f5dab1;
        background-color: #fdf6ec;
        color: #b88230;

        span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
    }

    .u-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 16px;
        border-top: 1px solid #ebeef5;
        background-color: #ffffff;
    }

    .u-selection {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #909399;
        font-size: 12px;

        &.is-current {
            color: #529b2e;
        }

        &.is-consume {
            color: #b88230;
        }

        &.is-remove {
            color: #f56c6c;
        }
    }

    .u-footer-actions {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-shrink: 0;
    }

    .u-remove,
    .u-redeem {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 0;
        border: 0;
        background: none;
        color: #909399;
        cursor: pointer;
        font-size: 12px;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .u-remove:hover:not(:disabled) {
        color: #f56c6c;
    }

    .u-remove:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .u-redeem {
        color: @v4primary;

        &:hover {
            color: darken(@v4primary, 10%);
        }
    }
}

@media screen and (max-width: 768px) {
    .m-publish-palu-picker {
        .u-header,
        .u-footer {
            align-items: flex-start;
            flex-direction: column;
        }

        .u-owned-summary {
            margin-left: 44px;
        }

        .u-card-grid {
            grid-template-columns: 1fr;
        }

        .u-footer-actions {
            width: 100%;
            justify-content: space-between;
        }
    }
}
</style>
