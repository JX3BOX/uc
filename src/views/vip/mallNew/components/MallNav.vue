<template>
    <aside class="m-mall-nav" :class="{ 'is-collapsed': !isShowNav }">
        <nav class="mall-sidebar" aria-label="积分商城分类">
            <button class="sidebar-toggle" type="button" :title="toggleText" @click="$emit('changeNav')">
                <component :is="toggleIcon" />
                <span>{{ toggleText }}</span>
            </button>

            <a :href="lotteryLink" class="lottery-card" target="_blank" v-if="showLottery && isShowNav">
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
            aria-label="关闭分类"
            @click="$emit('changeNav')"
        ></button>

        <section class="mall-list-panel">
            <button class="mobile-filter-button" type="button" @click="$emit('changeNav')">
                <Expand />
                <span>分类</span>
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
                    <GoodItem v-for="item in list" :key="item.id" :good="item"></GoodItem>
                </template>
                <template v-else>
                    <el-empty class="u-null" description="当前条件下没有找到符合的商品"></el-empty>
                </template>
            </div>
            <div class="pagination">
                <el-pagination
                    :layout="query.pageSize == 10 ? 'total,prev, pager, next' : 'prev, pager, next'"
                    :pager-count="5"
                    :total="query.total"
                    v-model:page-size="query.pageSize"
                    v-model:current-page="query.pageIndex"
                    @current-change="handleCurrentChange"
                    hide-on-single-page
                >
                </el-pagination>
            </div>
        </section>
    </aside>
</template>

<script>
import { Box, Expand, Fold, GoodsFilled, Grid, Ticket } from "@element-plus/icons-vue";
import { getConfig } from "@/service/vip/cms";
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
    components: {
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
    emits: ["changeNav"],
    data() {
        return {
            showLottery: false,
        };
    },
    computed: {
        navTypes() {
            return types
                .filter((item) => item.key !== "system")
                .map((item) => ({
                    ...item,
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
            return this.isShowNav ? "收起分类" : "展开分类";
        },
        toggleIcon() {
            return this.isShowNav ? "Fold" : "Expand";
        },
        skeletonCount() {
            return this.query.pageSize || 6;
        },
    },
    mounted() {
        this.loadConfig();
    },
    methods: {
        isCategoryActive(item) {
            return this.query.category == item.key && !this.query.sub_category;
        },
        itemLinkClick(key) {
            this.changeQuery(["category", "sub_category"], [key, ""]);
            this.closeMobileNav();
        },
        childLinkClick(key, child) {
            this.changeQuery(["category", "sub_category"], [key, child]);
            this.closeMobileNav();
        },
        handleCurrentChange(page) {
            this.changeQuery("pageIndex", page, true);
        },
        loadConfig() {
            getConfig({ key: "mall_lottery_pic" }).then((res) => {
                this.showLottery = res?.val != "0";
            });
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
        align-items: center;
        justify-content: center;

        :deep(.el-empty__description p) {
            color: rgba(255, 255, 255, 0.72);
        }

        :deep(.el-empty__image) {
            opacity: 0.82;
        }
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
    justify-content: center;
    margin-top: 33px;

    :deep(.el-pagination) {
        font-weight: 400;
        background-color: transparent;

        button,
        .el-pagination__total,
        .el-pager li {
            background-color: transparent;
            color: white;
        }

        button,
        .el-pager li {
            color: white;
            margin: 0 12px;

            &:hover {
                color: #5cb6ff;
            }
        }

        .el-pager li.active {
            width: 24px;
            height: 24px;
            min-width: 24px;
            padding: 0;
            margin: 2px 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.75);
            color: #000;
            font-size: 18px;
            font-weight: 700;
            line-height: 24px;
        }
    }
}

@media screen and (max-width: 1550px) {
    .m-mall-nav {
        --list-width: 330px;
        --sidebar-width: 180px;
        --sidebar-collapsed-width: 56px;
    }

    .mall-list-panel {
        padding: 12px;
    }

    .category-title {
        font-size: 14px;
    }

    .subcategory-item {
        font-size: 14px;
    }

    .goods-list {
        grid-template-columns: minmax(0, 330px);
    }
}

@media screen and (max-width: 750px) {
    .m-mall-nav {
        --mobile-sticky-top: calc(60px + 2.75rem);
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
        padding-bottom: 4.5rem;
    }
}
</style>
