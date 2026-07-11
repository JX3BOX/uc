<template>
    <aside class="m-mall-nav" :class="{ 'is-collapsed': !isShowNav }">
        <nav class="mall-sidebar" :aria-label="$t('vip.mall.categoriesLabel')">
            <button class="sidebar-toggle" type="button" :title="toggleText" @click="$emit('changeNav')">
                <component :is="toggleIcon" />
                <span>{{ toggleText }}</span>
            </button>

            <a :href="lotteryLink" class="lottery-card" target="_blank" v-if="isShowNav">
                <el-image :src="lottery" fit="cover"></el-image>
            </a>

            <div class="category-list">
                <section class="category-group" v-for="item in navTypes" :key="item.key || 'all'">
                    <button
                        class="category-title"
                        type="button"
                        :class="{ active: isCategoryActive(item) }"
                        :title="item.name"
                        @click="itemLinkClick(item.key)"
                    >
                        <component :is="item.iconComponent" class="category-icon" />
                        <span class="category-name">{{ item.name }}</span>
                    </button>

                    <div class="subcategory-list" v-if="isShowNav && item.sub_category?.length">
                        <button
                            class="subcategory-item"
                            type="button"
                            v-for="child in item.sub_category"
                            :key="child.key"
                            :class="{ active: query.sub_category == child.key }"
                            @click="childLinkClick(item.key, child.key)"
                        >
                            <span class="subcategory-dot"></span>
                            <span>{{ child.name }}</span>
                        </button>
                    </div>
                </section>
            </div>
        </nav>
        <button
            v-if="isShowNav"
            class="mobile-sidebar-backdrop"
            type="button"
            :aria-label="$t('vip.mall.closeCategories')"
            @click="$emit('changeNav')"
        ></button>

        <section class="mall-list-panel">
            <button class="mobile-filter-button" type="button" @click="$emit('changeNav')">
                <Expand />
                <span>{{ $t("vip.mall.categories") }}</span>
            </button>
            <SearchBox></SearchBox>
            <div class="goods-list" :class="{ 'is-loading': loading }" aria-live="polite" :aria-busy="loading ? 'true' : 'false'">
                <template v-if="loading">
                    <div class="good-item-skeleton" v-for="item in skeletonCount" :key="item">
                        <div class="skeleton-image"></div>
                        <div class="skeleton-content">
                            <div class="skeleton-line title"></div>
                            <div class="skeleton-line tag"></div>
                            <div class="skeleton-footer">
                                <div class="skeleton-line button"></div>
                                <div class="skeleton-cart"></div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else-if="list && list.length">
                    <GoodItem
                        v-for="item in list"
                        :key="item.id"
                        :good="item"
                        @exchanged="$emit('exchanged', $event)"
                    ></GoodItem>
                </template>
                <template v-else>
                    <div class="u-null">
                        <div class="u-null-visual" aria-hidden="true">
                            <span class="u-null-bag"></span>
                            <span class="u-null-ticket"></span>
                            <span class="u-null-dot is-left"></span>
                            <span class="u-null-dot is-right"></span>
                        </div>
                        <div class="u-null-title">{{ $t("vip.mall.noMatchingProducts") }}</div>
                        <div class="u-null-desc">{{ $t("vip.mall.changeCategoryHint") }}</div>
                    </div>
                </template>
            </div>
            <div class="pagination" v-if="query.total > query.pageSize">
                <span class="pagination-total">{{ $t("vip.mall.totalItems", { total: query.total }) }}</span>
                <el-pagination
                    class="desktop-pagination"
                    layout="prev, pager, next"
                    :pager-count="5"
                    :total="query.total"
                    v-model:page-size="query.pageSize"
                    v-model:current-page="query.pageIndex"
                    @current-change="handleCurrentChange"
                    hide-on-single-page
                >
                </el-pagination>
                <div class="mobile-pagination-actions">
                    <button class="mobile-page-btn" type="button" :disabled="!canPrevPage" @click="goPrevPage">
                        <ArrowLeft />
                        <span>{{ $t("vip.mall.previousPage") }}</span>
                    </button>
                    <span class="mobile-page-current">{{ query.pageIndex }} / {{ pageCount }}</span>
                    <button class="mobile-page-btn" type="button" :disabled="!canNextPage" @click="goNextPage">
                        <span>{{ $t("vip.mall.nextPage") }}</span>
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </section>
    </aside>
</template>

<script>
import { ArrowLeft, ArrowRight, Box, Expand, Fold, GoodsFilled, Grid, Ticket } from "@element-plus/icons-vue";
import { __Root, __cdn } from "@/utils/config";
import types from "@/assets/data/vip/goods_types.json";
import SearchBox from "./SearchBox.vue";
import GoodItem from "./GoodItem.vue";

const CATEGORY_ICONS = {
    "": "Grid",
    entity: "GoodsFilled",
    virtual: "Ticket",
};

export default {
    name: "MallNav",
    emits: ["changeNav", "exchanged"],
    components: {
        ArrowLeft,
        ArrowRight,
        Box,
        Expand,
        Fold,
        SearchBox,
        GoodItem,
        GoodsFilled,
        Grid,
        Ticket,
    },
    inject: ["query", "changeQuery"],
    props: {
        list: {
            type: Array,
            required: true,
        },
        isShowNav: {
            type: Boolean,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        navTypes() {
            return types
                .filter((item) => item.key !== "system")
                .map((item) => ({
                    ...item,
                    name: this.categoryName(item.key, item.name),
                    sub_category: (item.sub_category || []).map((child) => ({
                        ...child,
                        name: this.categoryName(`${item.key}.${child.key}`, child.name),
                    })),
                    iconComponent: CATEGORY_ICONS[item.key] || "Box",
                }));
        },
        lotteryLink() {
            return __Root + "vip/lottery";
        },
        lottery() {
            return __cdn + "design/event/lottery/lottery.png";
        },
        toggleText() {
            return this.isShowNav ? this.$t("vip.mall.collapseCategories") : this.$t("vip.mall.expandCategories");
        },
        toggleIcon() {
            return this.isShowNav ? "Fold" : "Expand";
        },
        skeletonCount() {
            return this.query.pageSize || 6;
        },
        pageCount() {
            return Math.max(1, Math.ceil((this.query.total || 0) / (this.query.pageSize || 1)));
        },
        canPrevPage() {
            return this.query.pageIndex > 1;
        },
        canNextPage() {
            return this.query.pageIndex < this.pageCount;
        },
    },
    methods: {
        categoryName(key, fallback) {
            const path = `vip.mall.categoryNames.${(key || "all").replace(/\./g, "_")}`;
            const translated = this.$t(path);
            return translated === path ? fallback : translated;
        },
        isCategoryActive(item) {
            return this.query.category == item.key && !this.query.sub_category;
        },
        itemLinkClick(key) {
            this.changeQuery(["category", "sub_category"], [key, ""], false, true);
            this.closeMobileNav();
        },
        childLinkClick(key, child) {
            this.changeQuery(["category", "sub_category"], [key, child], false, true);
            this.closeMobileNav();
        },
        handleCurrentChange(page) {
            this.changeQuery("pageIndex", page, true);
        },
        goPrevPage() {
            if (!this.canPrevPage) return;
            this.handleCurrentChange(this.query.pageIndex - 1);
        },
        goNextPage() {
            if (!this.canNextPage) return;
            this.handleCurrentChange(this.query.pageIndex + 1);
        },
        closeMobileNav() {
            if (this.isShowNav && window.matchMedia?.("(max-width: 750px)").matches) {
                this.$emit("changeNav");
            }
        },
    },
};
</script>

<style lang="less" scoped>
.m-mall-nav {
    --sidebar-width: 184px;
    --sidebar-collapsed-width: 64px;
    --list-width: 700px;
    width: calc(var(--sidebar-width) + var(--list-width));
    display: flex;
    position: relative;
    flex: none;
    transition: width 0.2s ease;

    &.is-collapsed {
        --sidebar-width: var(--sidebar-collapsed-width);

        .category-name,
        .sidebar-toggle span {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }

        .category-title,
        .sidebar-toggle {
            width: 36px;
            margin-left: auto;
            margin-right: auto;
            justify-content: center;
            gap: 0;
            padding-left: 0;
            padding-right: 0;
        }

        .category-list {
            padding-left: 0;
            padding-right: 0;
        }
    }
}

.mall-sidebar {
    width: var(--sidebar-width);
    min-height: calc(100vh - 96px);
    flex: none;
    box-sizing: border-box;
    overflow: hidden auto;
    scrollbar-width: none;
    background:
        linear-gradient(180deg, rgba(105, 54, 5, 0.72) 0%, rgba(0, 0, 0, 0.92) 42%, rgba(0, 0, 0, 1) 100%),
        rgba(0, 0, 0, 0.96);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    transition: width 0.2s ease;

    &::-webkit-scrollbar {
        display: none;
    }
}

.sidebar-toggle {
    width: calc(100% - 20px);
    height: 32px;
    margin: 12px 10px 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.72);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;

    svg {
        width: 16px;
        height: 16px;
        flex: none;
    }

    &:hover {
        color: #fff;
        background: rgba(255, 195, 0, 0.12);
        border-color: rgba(255, 195, 0, 0.28);
    }
}

.lottery-card {
    display: block;
    width: calc(100% - 20px);
    height: 76px;
    margin: 0 10px 10px;
    overflow: hidden;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
}

.category-list {
    padding: 4px 8px 20px;
}

.category-group + .category-group {
    margin-top: 10px;
}

.category-title,
.subcategory-item {
    border: 0;
    font-family: inherit;
}

.category-title {
    width: 100%;
    height: 36px;
    border-radius: 8px;
    background: transparent;
    color: rgba(255, 255, 255, 0.72);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    transition:
        background 0.16s ease,
        color 0.16s ease;

    &:hover,
    &.active {
        color: rgba(255, 208, 51, 1);
        background: rgba(255, 195, 0, 0.1);
    }
}

.category-icon {
    width: 18px;
    height: 18px;
    flex: none;
}

.category-name {
    transition:
        opacity 0.16s ease,
        width 0.16s ease;
}

.subcategory-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 4px 0 0 28px;
    padding-left: 10px;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.subcategory-item {
    min-height: 30px;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.58);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    transition:
        background 0.16s ease,
        color 0.16s ease;

    &:hover,
    &.active {
        color: rgba(255, 208, 51, 1);
        background: rgba(255, 255, 255, 0.06);
    }

    &.active .subcategory-dot {
        background: rgba(255, 208, 51, 1);
    }
}

.subcategory-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex: none;
    background: rgba(255, 255, 255, 0.32);
}

.mall-list-panel {
    width: var(--list-width);
    padding: 12px;
    box-sizing: border-box;
    flex: none;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.46));
}

.mobile-filter-button {
    display: none;
}

.mobile-sidebar-backdrop {
    display: none;
}

.goods-list {
    width: 100%;
    min-height: 664px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 120px;
    gap: 16px;
    align-content: start;

    .u-null {
        width: 100%;
        height: 100%;
        min-height: 360px;
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 48px 24px 72px;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        background: radial-gradient(circle at 50% 36%, rgba(255, 171, 45, 0.1), rgba(255, 171, 45, 0) 36%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
}

.u-null-visual {
    position: relative;
    width: 148px;
    height: 112px;
    margin-bottom: 2px;

    &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 4px;
        width: 112px;
        height: 18px;
        transform: translateX(-50%);
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(255, 171, 45, 0.22), rgba(255, 171, 45, 0));
        filter: blur(1px);
    }
}

.u-null-bag {
    position: absolute;
    left: 50%;
    bottom: 16px;
    width: 76px;
    height: 72px;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 186, 76, 0.34);
    border-radius: 18px 18px 22px 22px;
    background: linear-gradient(180deg, rgba(255, 186, 76, 0.2), rgba(255, 171, 45, 0.06));
    box-shadow: 0 24px 68px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.1);

    &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: -18px;
        width: 36px;
        height: 28px;
        transform: translateX(-50%);
        border: 3px solid rgba(255, 205, 112, 0.44);
        border-bottom: 0;
        border-radius: 20px 20px 0 0;
    }

    &::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 24px;
        width: 28px;
        height: 7px;
        transform: translateX(-50%);
        border-radius: 999px;
        background: rgba(255, 213, 121, 0.26);
    }
}

.u-null-ticket {
    position: absolute;
    right: 20px;
    bottom: 42px;
    width: 46px;
    height: 30px;
    transform: rotate(-12deg);
    border: 1px solid rgba(255, 215, 130, 0.36);
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(255, 213, 121, 0.2), rgba(255, 171, 45, 0.06));
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 8px;
        height: 8px;
        transform: translateY(-50%);
        border-radius: 50%;
        background: #090e17;
    }

    &::before {
        left: -5px;
    }

    &::after {
        right: -5px;
    }
}

.u-null-dot {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ffd768;
    box-shadow: 0 0 22px rgba(255, 215, 104, 0.76);

    &.is-left {
        left: 20px;
        top: 34px;
    }

    &.is-right {
        right: 28px;
        top: 18px;
        width: 5px;
        height: 5px;
    }
}

.u-null-title {
    .fz(16px);
    .bold;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.88);
}

.u-null-desc {
    .fz(13px);
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.44);
}

@media screen and (max-width: 767px) {
    .goods-list {
        .u-null {
            min-height: 58vw;
            gap: 2.6667vw;
            padding: 8vw 5.3333vw 12vw;
            border-radius: 3.2vw;
        }
    }

    .u-null-visual {
        width: 36vw;
        height: 27.2vw;
        margin-bottom: 0.5333vw;

        &::after {
            bottom: 1.0667vw;
            width: 27.2vw;
            height: 4.2667vw;
        }
    }

    .u-null-bag {
        bottom: 4vw;
        width: 18.6667vw;
        height: 17.6vw;
        border-radius: 4.2667vw 4.2667vw 5.3333vw 5.3333vw;

        &::before {
            top: -4.5333vw;
            width: 8.8vw;
            height: 6.9333vw;
            border-width: 0.8vw;
            border-bottom: 0;
            border-radius: 5.3333vw 5.3333vw 0 0;
        }

        &::after {
            top: 5.8667vw;
            width: 6.9333vw;
            height: 1.8667vw;
        }
    }

    .u-null-ticket {
        right: 4.8vw;
        bottom: 10.1333vw;
        width: 11.2vw;
        height: 7.2vw;
        border-radius: 2.1333vw;

        &::before,
        &::after {
            width: 1.8667vw;
            height: 1.8667vw;
        }

        &::before {
            left: -1.2vw;
        }

        &::after {
            right: -1.2vw;
        }
    }

    .u-null-dot {
        width: 1.6vw;
        height: 1.6vw;

        &.is-left {
            left: 4.8vw;
            top: 8.2667vw;
        }

        &.is-right {
            right: 6.6667vw;
            top: 4.2667vw;
            width: 1.0667vw;
            height: 1.0667vw;
        }
    }

    .u-null-title {
        .fz(14px);
    }

    .u-null-desc {
        .fz(12px);
    }
}

.good-item-skeleton {
    width: 100%;
    height: 120px;
    border-radius: 12px;
    background: rgba(36, 41, 46, 0.86);
    display: flex;
    overflow: hidden;
}

.skeleton-image,
.skeleton-line,
.skeleton-cart {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: mall-skeleton 1.2s infinite;
    }
}

.skeleton-image {
    width: 120px;
    height: 120px;
    flex: none;
}

.skeleton-content {
    min-width: 0;
    height: 120px;
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.skeleton-line {
    height: 16px;
    border-radius: 4px;

    &.title {
        width: 78%;
        height: 18px;
    }

    &.tag {
        width: 42px;
        height: 18px;
        margin-top: 8px;
    }

    &.button {
        height: 28px;
        flex: 1;
        border-radius: 8px;
    }
}

.skeleton-footer {
    margin-top: auto;
    display: flex;
    gap: 8px;
}

.skeleton-cart {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex: none;
}

@keyframes mall-skeleton {
    100% {
        transform: translateX(100%);
    }
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    max-width: 100%;
    margin-top: 28px;
    padding: 4px 0 12px;
    box-sizing: border-box;
    overflow: hidden;

    .pagination-total {
        display: none;
        flex: none;
        height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.84);
        font-size: 14px;
        font-weight: 700;
        line-height: 30px;
        white-space: nowrap;
    }

    :deep(.el-pagination) {
        --el-pagination-button-width: 32px;
        --el-pagination-button-height: 32px;
        --el-pagination-button-disabled-color: rgba(255, 255, 255, 0.24);
        --el-pagination-hover-color: #76c7ff;
        flex: none;
        max-width: 100%;
        min-width: 0;
        height: 32px;
        padding: 0 8px;
        border-radius: 999px;
        background: rgba(8, 14, 26, 0.38);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        font-weight: 700;
        line-height: 32px;

        .el-pager {
            display: flex;
            align-items: center;
            gap: 4px;
            min-width: 0;
        }

        button,
        .el-pager li {
            background-color: transparent;
            color: rgba(255, 255, 255, 0.78);
        }

        button,
        .el-pager li {
            width: 32px;
            min-width: 32px;
            height: 32px;
            margin: 0;
            padding: 0;
            border-radius: 999px;
            font-size: 14px;
            line-height: 32px;
            transition:
                background 0.18s ease,
                color 0.18s ease,
                transform 0.18s ease;

            &:hover {
                background: rgba(118, 199, 255, 0.1);
                color: #76c7ff;
            }
        }

        button:disabled {
            background: transparent;
            color: rgba(255, 255, 255, 0.24);
            cursor: not-allowed;
        }

        .el-pager li.is-active,
        .el-pager li.active {
            background: linear-gradient(180deg, rgba(91, 154, 255, 1), rgba(64, 128, 255, 1));
            color: #fff;
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                0 4px 12px rgba(64, 128, 255, 0.22);
        }

        .el-pager li.is-active:hover,
        .el-pager li.active:hover {
            color: #fff;
        }

        .el-pager li.more {
            color: rgba(255, 255, 255, 0.58);
            background: transparent;
            box-shadow: none;
        }
    }
}

.mobile-pagination-actions {
    display: none;
}

@media screen and (max-width: 1550px) {
    .m-mall-nav {
        --list-width: 700px;
        --sidebar-width: 180px;
        --sidebar-collapsed-width: 56px;
        width: 100%;
    }

    .mall-list-panel {
        width: auto;
        min-width: 0;
        flex: 1;
        padding: 12px;
    }

    .category-title {
        font-size: 14px;
    }

    .subcategory-item {
        font-size: 14px;
    }

    .goods-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media screen and (max-width: 750px) {
    .m-mall-nav {
        --mobile-sticky-top: 60px;
        --list-width: 100%;
        width: 100%;
        display: block;
    }

    .mall-sidebar {
        width: 100vw;
        max-width: 100vw;
        height: calc(100vh - var(--mobile-sticky-top));
        min-height: 0;
        position: fixed;
        left: 0;
        top: var(--mobile-sticky-top);
        z-index: 121;
        transform: translateX(0);
        transition: transform 0.2s ease;
        box-shadow: 1rem 0 2rem rgba(0, 0, 0, 0.32);
    }

    .mobile-sidebar-backdrop {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        top: var(--mobile-sticky-top);
        bottom: 0;
        z-index: 120;
        border: 0;
        padding: 0;
        background: rgba(0, 0, 0, 0.46);
        cursor: default;
    }

    .m-mall-nav.is-collapsed {
        .mall-sidebar {
            transform: translateX(-100%);
        }
    }

    .m-mall-nav:not(.is-collapsed) {
        .category-name,
        .sidebar-toggle span {
            opacity: 1;
            width: auto;
            overflow: visible;
        }
    }

    .sidebar-toggle {
        height: 2.25rem;
        justify-content: flex-start;
        padding: 0 0.75rem;
        gap: 0.5rem;
        margin: 0.75rem 0.625rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;

        span {
            opacity: 1;
            width: auto;
        }

        svg {
            width: 1rem;
            height: 1rem;
        }
    }

    .category-list {
        padding: 0.25rem 0.5rem 1.25rem;
    }

    .category-group + .category-group {
        margin-top: 0.625rem;
    }

    .category-title {
        height: 2.25rem;
        border-radius: 0.5rem;
        justify-content: flex-start;
        padding: 0 0.75rem;
        gap: 0.625rem;
        font-size: 0.875rem;

        .category-name {
            opacity: 1;
            width: auto;
        }
    }

    .category-icon {
        width: 1.125rem;
        height: 1.125rem;
    }

    .subcategory-list {
        gap: 0.125rem;
        margin: 0.25rem 0 0 1.75rem;
        padding-left: 0.625rem;
    }

    .subcategory-item {
        min-height: 1.875rem;
        border-radius: 0.375rem;
        gap: 0.5rem;
        padding: 0 0.5rem;
        font-size: 0.875rem;
    }

    .subcategory-dot {
        width: 0.3125rem;
        height: 0.3125rem;
    }

    .mall-list-panel {
        width: 100%;
        padding: 0;
        background: transparent;
    }

    .mobile-filter-button {
        width: 100%;
        height: 2.25rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.86);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.625rem;
        font-size: 0.875rem;
        font-weight: 700;

        svg {
            width: 1rem;
            height: 1rem;
        }
    }

    .goods-list {
        height: auto;
        min-height: 26.25rem;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-auto-rows: 7.25rem;
        gap: 0.75rem;
    }

    .good-item-skeleton {
        width: 100%;
        height: 7.25rem;
        border-radius: 0.75rem;
    }

    .skeleton-image {
        width: 7.25rem;
        height: 7.25rem;
    }

    .skeleton-content {
        height: 7.25rem;
        padding: 0.5rem;
    }

    .skeleton-line {
        &.title {
            height: 1rem;
        }

        &.tag {
            width: 2.625rem;
            height: 1rem;
            margin-top: 0.5rem;
        }

        &.button {
            height: 1.75rem;
        }
    }

    .skeleton-cart {
        width: 1.75rem;
        height: 1.75rem;
    }

    .pagination {
        margin-top: 0.875rem;
        gap: 0.625rem;
        flex-wrap: wrap;
        padding-bottom: 4.5rem;

        .pagination-total {
            display: block;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            height: 1.75rem;
            padding: 0 0.625rem;
            font-size: 0.75rem;
            line-height: 1.625rem;
        }

        .desktop-pagination {
            display: none;
        }

        .mobile-pagination-actions {
            width: 100%;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
            align-items: center;
            gap: 0.5rem;
        }
    }

    .mobile-page-btn {
        height: 2.25rem;
        min-width: 0;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0.625rem;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.88);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        font-family: inherit;
        transition:
            background 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease;

        svg {
            width: 0.875rem;
            height: 0.875rem;
            flex: none;
        }

        &:not(:disabled):hover {
            border-color: rgba(118, 199, 255, 0.32);
            background: rgba(118, 199, 255, 0.1);
            color: #76c7ff;
        }

        &:disabled {
            color: rgba(255, 255, 255, 0.26);
            cursor: not-allowed;
        }
    }

    .mobile-page-current {
        height: 2.25rem;
        min-width: 3.625rem;
        padding: 0 0.625rem;
        border-radius: 999px;
        background: rgba(8, 14, 26, 0.42);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.64);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        white-space: nowrap;
    }
}

@media screen and (max-width: 380px) {
    .pagination {
        .mobile-pagination-actions {
            grid-template-columns: 1fr 1fr;
        }

        .mobile-page-current {
            grid-column: 1 / -1;
            grid-row: 1;
            justify-self: center;
            height: 1.625rem;
            min-width: 3.25rem;
            box-sizing: border-box;
        }

        .mobile-page-btn {
            grid-row: 2;
        }
    }
}
</style>
