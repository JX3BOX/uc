<template>
    <div class="m-search-bar">
        <div class="filter-group" aria-label="商品筛选">
            <label class="filter-item" v-for="item in filters" :key="item.key">
                <span class="filter-label">{{ item.label }}</span>
                <el-select
                    :model-value="query[item.key]"
                    :placeholder="item.placeholder"
                    popper-class="mall-filter-select-popper"
                    @change="handleChange($event, item.key)"
                >
                    <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value">
                    </el-option>
                </el-select>
            </label>
        </div>
        <div class="search-input">
            <el-input
                v-model="query.title"
                placeholder=""
                aria-label="搜索"
                clearable
                @clear="clearTitle"
                @keyup.enter="submitSearch"
            >
                <template #append>
                    <el-button aria-label="搜索商品" @click="submitSearch">
                        <el-icon><Search /></el-icon>
                    </el-button>
                </template>
            </el-input>
            <span v-if="!query.title" class="search-placeholder">搜索</span>
        </div>
        <div class="filter-actions">
            <el-checkbox
                v-if="showOnlyUnowned"
                class="u-unowned-check"
                :model-value="query.only_unowned"
                @change="handleChange($event, 'only_unowned')"
            >
                只看未拥有
            </el-checkbox>
            <button class="reset-button" type="button" :disabled="!hasActiveFilter" @click="resetFilters">
                <RefreshLeft class="reset-icon" />
                <span>重置</span>
            </button>
        </div>
    </div>
</template>

<script>
import { RefreshLeft, Search } from "@element-plus/icons-vue";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "SearchBox",
    components: {
        RefreshLeft,
        Search,
    },
    inject: ["query", "changeQuery", "canUseOnlyUnowned"],
    data() {
        return {
            levelOptions: [
                {
                    value: 0,
                    label: "全部",
                },
                {
                    value: 1,
                    label: "lv.1",
                },
                {
                    value: 2,
                    label: "lv.2",
                },
                {
                    value: 3,
                    label: "lv.3",
                },
                {
                    value: 4,
                    label: "lv.4",
                },
                {
                    value: 5,
                    label: "lv.5",
                },
                {
                    value: 6,
                    label: "lv.6",
                },
            ],
            memberOptions: [
                {
                    value: -1,
                    label: "全部",
                },
                {
                    value: 1,
                    label: "仅会员",
                },
                {
                    value: 0,
                    label: "非会员",
                },
            ],
        };
    },
    computed: {
        filters() {
            return [
                {
                    key: "level",
                    label: "等级",
                    placeholder: "全部",
                    options: this.levelOptions,
                },
                {
                    key: "vip_limit",
                    label: "限定",
                    placeholder: "全部",
                    options: this.memberOptions,
                },
            ];
        },
        hasActiveFilter() {
            return Boolean(
                this.query.title ||
                    (this.query.level !== null && this.query.level !== "" && this.query.level != 0) ||
                    (this.query.vip_limit !== null && this.query.vip_limit !== "" && this.query.vip_limit != -1) ||
                    (this.showOnlyUnowned && this.query.only_unowned)
            );
        },
        isLoggedIn() {
            return User.isLogin();
        },
        showOnlyUnowned() {
            return this.canUseOnlyUnowned();
        },
    },
    mounted() {
        if ((!this.isLoggedIn || !this.showOnlyUnowned) && this.query.only_unowned) {
            this.changeQuery("only_unowned", false);
        }
    },
    methods: {
        handleChange(value, key) {
            if (key === "only_unowned" && !this.isLoggedIn) {
                return User.toLogin();
            }
            if (key === "only_unowned" && !this.showOnlyUnowned) return;
            if (key == "title") value = value.trim();
            this.changeQuery(key, value);
        },
        submitSearch() {
            this.handleChange(this.query.title || "", "title");
        },
        clearTitle() {
            this.changeQuery("title", "");
        },
        resetFilters() {
            if (!this.hasActiveFilter) return;
            this.changeQuery(["level", "vip_limit", "title", "only_unowned"], [0, -1, "", false]);
        },
    },
};
</script>

<style lang="less">
.m-search-bar {
    width: 100%;
    min-height: 56px;
    margin-bottom: 18px;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.035)),
        rgba(4, 8, 14, 0.78);
    box-shadow: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    box-sizing: border-box;

    .filter-group {
        flex: none;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .filter-item {
        width: 104px;
        height: 36px;
        padding: 0 7px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        gap: 6px;
        box-sizing: border-box;
    }

    .filter-label {
        flex: none;
        color: rgba(255, 255, 255, 0.48);
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
    }

    .el-select {
        flex: 1;
        min-width: 0;
    }

    .el-select__wrapper,
    .el-input__wrapper {
        min-height: 34px;
        background-color: transparent;
        box-shadow: none !important;
        padding: 0;
    }

    .el-select__placeholder,
    .el-select__selected-item,
    .el-input__inner {
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        font-weight: 600;
    }

    .el-select__placeholder.is-transparent {
        color: rgba(255, 255, 255, 0.52);
    }

    .el-select__caret,
    .el-input__icon {
        color: rgba(255, 255, 255, 0.56);
    }

    .search-input {
        width: auto;
        min-width: 180px;
        flex: 1 1 220px;
        position: relative;

        .el-input-group {
            height: 36px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.055);
            box-sizing: border-box;
            overflow: hidden;
            transition:
                border-color 0.16s ease,
                background 0.16s ease;

            &:focus-within {
                border-color: rgba(255, 174, 56, 0.42);
                background: rgba(255, 255, 255, 0.08);
            }
        }
    }

    .search-placeholder {
        position: absolute;
        left: 12px;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.42);
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        pointer-events: none;
    }

    .el-input__wrapper {
        height: 34px;
        padding-left: 12px;
        border-radius: 0;
        background: transparent;
        box-shadow: none !important;
        display: flex;
        align-items: center;

        &.is-focus {
            background: transparent;
            box-shadow: none !important;
        }
    }

    .search-input {
        .el-input__inner {
            height: 34px;
            color: rgba(255, 255, 255, 0.88);
            font-size: 12px;
            font-weight: 600;
            line-height: 34px;

            &::placeholder {
                color: rgba(255, 255, 255, 0.42);
                font-size: 11px;
                font-weight: 600;
                line-height: 34px;
            }
        }

        .el-input__icon {
            color: rgba(255, 255, 255, 0.42);
            font-size: 14px;
        }
    }

    .el-input-group__append {
        width: 40px;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: rgba(255, 255, 255, 0.035);
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        box-shadow: none;

        &:hover,
        &:focus-within {
            background: rgba(255, 255, 255, 0.035);
            color: rgba(255, 224, 164, 1);

            .el-icon {
                color: rgba(255, 224, 164, 1);
            }
        }

        .el-button {
            width: 40px;
            min-width: 40px;
            max-width: 40px;
            height: 34px;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: inherit;
            box-sizing: border-box;

            .el-icon {
                color: rgba(255, 255, 255, 0.5);
                transition: color 0.16s ease;
            }

            &:hover,
            &:focus {
                background: transparent;
                color: inherit;

                .el-icon {
                    color: rgba(255, 224, 164, 1);
                }
            }
        }
    }

    .filter-actions {
        margin-left: auto;
        flex: none;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .u-unowned-check {
        flex: none;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 700;
        height: 36px;
        margin-right: 0;
        padding: 0 9px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.045);

        .el-checkbox__label {
            color: rgba(255, 255, 255, 0.85);
            font-size: 12px;
            font-weight: 600;
        }

        .el-checkbox__inner {
            width: 16px;
            height: 16px;
            border-color: rgba(255, 255, 255, 0.48);
            background: rgba(255, 255, 255, 0.92);
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
            border-color: rgba(255, 163, 43, 1);
            background: rgba(255, 163, 43, 1);
        }

        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: rgba(255, 218, 128, 1);
        }

        .el-checkbox__input.is-disabled + .el-checkbox__label {
            color: rgba(255, 255, 255, 0.34);
        }

        .el-checkbox__input.is-disabled .el-checkbox__inner {
            border-color: rgba(255, 255, 255, 0.16);
            background: rgba(255, 255, 255, 0.16);
        }

        &:has(.el-checkbox__input.is-disabled) {
            cursor: not-allowed;
            opacity: 0.62;
        }
    }

    .reset-button {
        min-width: 48px;
        flex: none;
        height: 36px;
        padding: 0 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.055);
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        .reset-icon {
            width: 13px;
            height: 13px;
            flex: none;
        }

        &:not(:disabled):hover {
            border-color: rgba(255, 188, 70, 0.44);
            color: rgba(255, 222, 156, 1);
            background: rgba(255, 188, 70, 0.12);
        }

        &:disabled {
            opacity: 0.38;
            cursor: not-allowed;
        }
    }
}

.mall-filter-select-popper {
    &.el-popper.is-light {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        background: rgba(28, 30, 36, 0.98);
        box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    &.el-popper.is-light .el-popper__arrow::before {
        border-color: rgba(255, 255, 255, 0.12);
        background: rgba(28, 30, 36, 0.98);
    }

    .el-select-dropdown {
        border: 0;
        border-radius: 8px;
        background: transparent;
        padding: 4px;
    }

    .el-select-dropdown__item {
        height: 32px;
        padding: 0 12px;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
        font-weight: 600;
        line-height: 32px;

        &.is-hovering,
        &:hover {
            color: rgba(255, 230, 180, 1);
            background: rgba(255, 174, 56, 0.1);
        }

        &.is-selected {
            color: rgba(255, 208, 51, 1);
            background: rgba(255, 174, 56, 0.14);
        }
    }
}

@media screen and (max-width: 750px) {
    .m-search-bar {
        min-height: 0;
        margin-bottom: 0.75rem;
        padding: 0.625rem;
        border-radius: 0.625rem;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.625rem;

        .filter-group {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .filter-item {
            width: 100%;
            height: 2.25rem;
            padding: 0 0.625rem;
            border-radius: 0.5rem;
            gap: 0.375rem;
        }

        .filter-label {
            font-size: 0.6875rem;
        }

        .el-select__placeholder,
        .el-select__selected-item,
        .el-input__inner {
            font-size: 0.75rem;
        }

        .search-input {
            width: 100%;

            .el-input-group {
                height: 2.25rem;
            }

            .el-input__inner {
                height: calc(2.25rem - 2px);
                font-size: 0.75rem;
                line-height: calc(2.25rem - 2px);

                &::placeholder {
                    font-size: 0.6875rem;
                    line-height: calc(2.25rem - 2px);
                }
            }

            .el-input__icon {
                font-size: 0.875rem;
            }
        }

        .el-input__wrapper {
            height: calc(2.25rem - 2px);
            padding-left: 0.75rem;
        }

        .search-placeholder {
            left: 0.75rem;
            font-size: 0.6875rem;
        }

        .el-input-group__append,
        .el-input-group__append .el-button {
            width: 2.5rem;
            min-width: 2.5rem;
            max-width: 2.5rem;
            height: calc(2.25rem - 2px);
        }

        .filter-actions {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
            gap: 0.5rem;
        }

        .u-unowned-check {
            height: 2.25rem;
            padding: 0 0.625rem;
            border-radius: 0.5rem;

            .el-checkbox__label {
                font-size: 0.75rem;
            }
        }

        .reset-button {
            height: 2.25rem;
            padding: 0 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
        }
    }
}

@media screen and (min-width: 751px) and (max-width: 1550px) {
    .m-search-bar {
        align-items: stretch;
        flex-wrap: wrap;
        gap: 8px;

        .filter-group {
            width: 100%;
            gap: 8px;
        }

        .filter-item {
            width: calc((100% - 8px) / 2);
            padding: 0 7px;
        }

        .filter-label {
            font-size: 11px;
        }

        .search-input {
            width: 100%;
            order: 2;
        }

        .filter-actions {
            width: 100%;
            margin-left: 0;
            order: 3;
            justify-content: space-between;
            gap: 8px;
        }

        .u-unowned-check {
            flex: 1;
        }

        .reset-button {
            flex: none;
        }
    }
}
</style>
