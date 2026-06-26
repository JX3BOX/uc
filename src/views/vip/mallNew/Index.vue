<template>
    <div class="m-mall-box" :class="{ 'right-collapsed': !isShowRight, 'right-open': isShowRight }">
        <MallNav
            :list="list"
            :loading="isLoading"
            @changeNav="isShowNav = !isShowNav"
            @exchanged="markGoodOwned"
            :isShowNav="isShowNav"
        ></MallNav>
        <GoodDetail
            v-if="showMainDetail"
            :good="selectItem || {}"
            :isShowNav="isShowNav"
            @exchanged="markGoodOwned"
        ></GoodDetail>
        <div v-else-if="showMainEmpty" class="mall-detail-empty">
            <div class="mall-detail-empty-card">
                <div class="mall-detail-empty-icon" aria-hidden="true">
                    <span class="u-null-bag"></span>
                    <span class="u-null-ticket"></span>
                    <span class="u-null-dot is-left"></span>
                    <span class="u-null-dot is-right"></span>
                </div>
                <div class="mall-detail-empty-title">{{ detailEmptyText.title }}</div>
                <div class="mall-detail-empty-desc">{{ detailEmptyText.desc }}</div>
            </div>
        </div>
        <aside class="box-right">
            <button class="right-toggle" type="button" :title="rightToggleText" @click="isShowRight = !isShowRight">
                <span class="right-toggle-icon">{{ isShowRight ? "›" : "‹" }}</span>
                <span class="right-toggle-text">{{ rightToggleText }}</span>
            </button>
            <div class="right-scroll">
                <div class="right-detail-panel" v-if="isDetailInRight && selectItem">
                    <GoodDetail
                        :good="selectItem || {}"
                        :isShowNav="isShowNav"
                        @exchanged="markGoodOwned"
                    ></GoodDetail>
                </div>
                <div class="right-cart-panel">
                    <div class="cart">
                        <div class="cart-container">
                            <div class="cart-content">
                                <div class="cart-text">
                                    欢迎光临魔盒积分商城！~<br />你可以<span class="blue">单独兑换</span>或<span class="orange"
                                        >放入购物车</span
                                    >一并结算！
                                </div>
                                <div class="cart-btn">
                                    <div class="text">
                                        <div>当前购物车</div>
                                        <div>合计：{{ $store.getters["mallNew/checked_num"] }}件</div>
                                    </div>
                                    <div class="btn" id="cartBtn" @click="$store.dispatch('mallNew/changeCartIsShow', true)">
                                        <img :src="imgUrl + 'cart.svg'" alt="" class="cart-icon" />
                                        查看购物车
                                    </div>
                                </div>
                                <div class="total">
                                    <div class="total-item">
                                        <div class="right">
                                            <img
                                                src="@/assets/img/vip/vip2/box_icon.svg"
                                                alt=""
                                                svg-inline
                                                style="fill: rgba(56, 56, 56, 1)"
                                                class="total-icon"
                                            />
                                            <div>盒币<span class="quilt-text">（=通宝）</span></div>
                                        </div>
                                        <div class="left">{{ $store.getters["mallNew/all_price_boxcoin"] }}</div>
                                    </div>
                                    <div class="total-item">
                                        <div class="right">
                                            <img
                                                src="@/assets/img/vip/vip2/points.svg"
                                                alt=""
                                                svg-inline
                                                style="fill: rgba(56, 56, 56, 1)"
                                                class="total-icon"
                                            />
                                            <div>银铛<span class="quilt-text">（=积分）</span></div>
                                        </div>
                                        <div class="left">{{ $store.getters["mallNew/all_price_points"] }}</div>
                                    </div>
                                </div>
                                <div class="total-btn" @click="$store.dispatch('mallNew/changeCartIsShow', true)">结算</div>
                            </div>
                            <div class="arrow"></div>
                        </div>
                    </div>
                    <img :src="imgUrl + 'girl.png'" alt="" class="girl" />
                </div>
            </div>
        </aside>
        <button
            v-if="isShowRight"
            class="mobile-right-backdrop"
            type="button"
            aria-label="关闭右侧信息"
            @click="isShowRight = false"
        ></button>
        <Cart></Cart>
        <button class="mobile-right-button" type="button" @click="isShowRight = true">
            <span>购物</span>
        </button>
        <button class="mobile-cart-button" type="button" @click="$store.dispatch('mallNew/changeCartIsShow', true)">
            <img :src="imgUrl + 'cart.svg'" alt="" />
        </button>
        <CartConfirm></CartConfirm>
    </div>
</template>
<script>
import { getItemList, getItem } from "@/service/vip/mall";
import { __userLevel } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import MallNav from "@/views/vip/mallNew/components/MallNav.vue";
import GoodDetail from "@/views/vip/mallNew/components/GoodDetail.vue";
import Cart from "@/views/vip/mallNew/components/Cart.vue";
import { debounce } from "lodash";
import CartConfirm from "@/views/vip/mallNew/components/CartConfirm.vue";
import { __cdn } from "@/utils/config";

const UNOWNED_FILTER_SUB_CATEGORIES = ["skin", "avatar", "emotion"];

export default {
    name: "MallList",
    data: function () {
        return {
            imgUrl: __cdn + "design/mall/",
            goodsList: [],
            selectItem: null,
            isLoading: false,
            loadSeq: 0,
            isShowRight:
                typeof window === "undefined" ? true : !window.matchMedia || window.matchMedia("(min-width: 751px)").matches,
            isMobileLayout: false,
            isMediumLayout: false,

            query: {
                pageSize: 10,
                pageIndex: 1,
                level: 0,
                vip_limit: -1,
                title: "",
                category: "",
                sub_category: "",
                only_unowned: false,
                total: 0,
            },
            isShowNav:
                typeof window === "undefined" ? true : !window.matchMedia || window.matchMedia("(min-width: 751px)").matches,
        };
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.getData({ id: val });
                } else if (this.goodsList.length) {
                    this.selectFirstGood();
                }
            },
        },
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        asset() {
            return this.$store.state.mallNew.asset;
        },
        list() {
            return this.goodsList?.map((item) => {
                return {
                    ...item,
                    canBuy: this.checkCanBuy(item),
                    isHave: item.has_owned,
                };
            });
        },
        rightToggleText() {
            if (this.isDetailInRight) return this.isShowRight ? "收起详情" : "查看详情";
            return this.isShowRight ? "收起侧栏" : "展开侧栏";
        },
        isDetailInRight() {
            return this.isMediumLayout;
        },
        showMainDetail() {
            return !!this.selectItem && !this.isDetailInRight && !this.isMobileLayout;
        },
        showMainEmpty() {
            return !this.isDetailInRight && !this.isMobileLayout;
        },
        isListEmpty() {
            return !this.isLoading && this.goodsList.length === 0;
        },
        detailEmptyText() {
            if (this.isListEmpty) {
                return {
                    title: "这里暂时没有可查看的商品",
                    desc: "可以换个分类、等级或清空筛选条件再看看",
                };
            }
            return {
                title: "请选择一个商品",
                desc: "在左侧列表点击商品后，这里会展示预览、兑换条件和操作按钮",
            };
        },
    },
    provide() {
        return {
            query: this.query,
            changeQuery: this.changeQuery,
            changeSelectItem: this.changeSelectItem,
            canUseOnlyUnowned: this.canUseOnlyUnowned,
        };
    },
    mounted() {
        this.getBoundCart();
        window.addEventListener("resize", this.getBoundCart);
    },
    created() {
        Object.entries(this.$route.query).forEach(([key, value]) => {
            if (key === "search") {
                this.query.title = value;
                return;
            }
            if (key === "no_buy" || key === "only_unowned") {
                this.query.only_unowned = value === "1" || value === "true";
                return;
            }
            if (Object.prototype.hasOwnProperty.call(this.query, key) && value !== undefined && value !== "") {
                this.query[key] = ["pageIndex", "pageSize", "level", "vip_limit"].includes(key) ? Number(value) : value;
            }
        });
        const shouldSyncRoute = this.sanitizeOnlyUnowned();
        this.handleResize(false);
        if (shouldSyncRoute) {
            this.syncRouteQuery();
        }
        window.addEventListener("resize", this.handleResize);
        this.loadData();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("resize", this.getBoundCart);
    },
    methods: {
        canUseOnlyUnowned() {
            return this.query.category === "virtual" && UNOWNED_FILTER_SUB_CATEGORIES.includes(this.query.sub_category);
        },
        shouldForceNoBuyForRequest() {
            return this.query.category === "entity";
        },
        sanitizeOnlyUnowned() {
            if (!this.canUseOnlyUnowned()) {
                const changed = this.query.only_unowned;
                this.query.only_unowned = false;
                return changed;
            }
            return false;
        },
        // 格式化参数
        buildQuery() {
            const params = {
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize,
            };
            const title = String(this.query.title || "").trim();

            if (title) params.title = title;
            if (this.query.category) params.category = this.query.category;
            if (this.query.sub_category) params.sub_category = this.query.sub_category;
            if (this.shouldForceNoBuyForRequest() || (this.query.only_unowned && this.canUseOnlyUnowned())) params.no_buy = 1;

            if (this.query.level && this.query.level != 0) {
                params.exp_limit = __userLevel[this.query.level]?.[0];
                params.exp_limit_max = __userLevel[this.query.level]?.[1] - 1 || "";
            }

            if (this.query.vip_limit !== null && this.query.vip_limit !== "" && this.query.vip_limit != -1) {
                params.vip_limit = this.query.vip_limit;
            }

            return params;
        },
        hasOwnedGood(item = {}) {
            if (!User.isLogin()) return false;
            const raw = item.ext_info?.has_buy;

            if (raw !== undefined && raw !== null) {
                return raw === true || raw === 1 || raw === "1" || raw === "true";
            }

            return false;
        },
        normalizeGood(item = {}) {
            return {
                ...item,
                goods_images: Array.isArray(item.goods_images) ? item.goods_images : [],
                has_owned: this.hasOwnedGood(item),
            };
        },
        markOwnedGood(item = {}) {
            return {
                ...item,
                has_owned: true,
                isHave: true,
                ext_info: {
                    ...(item.ext_info || {}),
                    has_buy: true,
                },
            };
        },
        decorateGood(item = {}) {
            const good = this.normalizeGood(item);
            good.canBuy = this.checkCanBuy(good);
            good.isHave = good.has_owned;
            return good;
        },
        async loadData(forceListState = false) {
            const seq = ++this.loadSeq;
            const query = this.buildQuery();
            this.isLoading = true;

            try {
                const res = await getItemList(query);
                if (seq !== this.loadSeq) return;

                const data = res.data.data || {};
                this.goodsList = (data.list || []).map((item) => this.normalizeGood(item));
                this.query.total = data.page?.total || 0;
                if (data.page) {
                    this.query.pageIndex = data.page.index;
                    this.query.pageSize = data.page.pageSize;
                }
                if (!this.id || forceListState) {
                    this.selectFirstGood();
                }
            } catch (err) {
                if (seq !== this.loadSeq) return;
                this.goodsList = [];
                this.query.total = 0;
                this.$message.error("商品列表加载失败");
            } finally {
                if (seq === this.loadSeq) {
                    this.isLoading = false;
                }
            }
        },
        changeQuery(key, value, isChangePage, forceListState = false) {
            if (Array.isArray(key)) {
                key.forEach((item, index) => {
                    this.query[item] = value[index];
                });
            } else {
                this.query[key] = value;
            }
            if (!isChangePage) {
                this.query.pageIndex = 1;
            }
            this.sanitizeOnlyUnowned();
            this.syncRouteQuery(forceListState);
            this.loadData(forceListState);
        },
        buildRouteQuery() {
            const routeQuery = {};
            if (this.query.title) routeQuery.search = this.query.title;
            if (this.query.category) routeQuery.category = this.query.category;
            if (this.query.sub_category) routeQuery.sub_category = this.query.sub_category;
            if (this.query.level && this.query.level != 0) routeQuery.level = this.query.level;
            if (this.query.vip_limit !== null && this.query.vip_limit !== "" && this.query.vip_limit != -1) {
                routeQuery.vip_limit = this.query.vip_limit;
            }
            if (this.query.only_unowned && this.canUseOnlyUnowned()) routeQuery.no_buy = 1;
            if (this.query.pageIndex > 1) routeQuery.pageIndex = this.query.pageIndex;
            return routeQuery;
        },
        syncRouteQuery(forceListState = false) {
            const query = this.buildRouteQuery();
            const name = this.id && !forceListState ? "mall_list_new_id" : "mall_list_new";
            const params = this.id && !forceListState ? { id: this.id } : {};
            this.$router.replace({ name, params, query }).catch(() => {});
        },
        selectFirstGood() {
            const first = this.goodsList[0];
            this.selectItem = first ? this.decorateGood(first) : null;
        },
        checkCanBuy(item) {
            const obj = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                points: true,
                level: true,
                user_level: User.getLevel(item.exp_limit),
                buy_time: true,
            };
            const time = new Date().getTime();
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                obj.canBuy = false;
                obj.vip_limit = false;
            }
            if (this.asset.box_coin < item.price_boxcoin) {
                obj.canBuy = false;
                obj.box_coin = false;
            }
            if (this.asset.points < item.price_points) {
                obj.canBuy = false;
                obj.points = false;
            }
            if (this.asset.experience < item.exp_limit) {
                obj.canBuy = false;
                obj.level = false;
            }
            if (time < new Date(item.start_sell_time).getTime() || time > new Date(item.end_sell_time).getTime()) {
                obj.canBuy = false;
                obj.buy_time = false;
            }
            return obj;
        },
        getData(item) {
            getItem(item.id).then((res) => {
                this.selectItem = this.decorateGood(res.data.data || {});
            });
        },
        markGoodOwned(payload = {}) {
            const id = payload.id || payload.item?.id;
            if (!id) return;

            this.goodsList = this.goodsList.map((item) => {
                return String(item.id) === String(id) ? this.markOwnedGood(item) : item;
            });

            if (String(this.selectItem?.id) === String(id)) {
                this.selectItem = this.decorateGood(this.markOwnedGood(this.selectItem));
            }

            this.$store.dispatch("mallNew/getAsset").catch(() => {});
        },
        changeSelectItem(item) {
            if (this.isDetailInRight) {
                this.isShowRight = true;
            }
            if (item.id === this.selectItem?.id) return;
            this.$router.push({ name: "mall_list_new_id", params: { id: item.id }, query: this.buildRouteQuery() });
        },
        handleResize(shouldLoad = true) {
            const isMobile = window.innerWidth < 751;
            this.isMobileLayout = isMobile;
            this.isMediumLayout = window.innerWidth >= 751 && window.innerWidth < 1550;
            // The mall API filters a few first-page rows after pagination; pageSize 5 can return only 2 visible items.
            const pageSize = isMobile ? 8 : 10;

            if (isMobile && this.isShowNav) {
                this.isShowNav = false;
            }
            if (isMobile && this.isShowRight) {
                this.isShowRight = false;
            }

            if (pageSize !== this.query.pageSize) {
                this.query.pageSize = pageSize;
                if (shouldLoad) {
                    this.loadData();
                }
            }
        },
        getBoundCart: debounce(function () {
            const cartBtn = Array.from(document.querySelectorAll(".mobile-cart-button, #cartBtn, .right-toggle")).find((item) => {
                const rect = item.getBoundingClientRect();
                const style = window.getComputedStyle(item);
                const isHiddenInCollapsedRight =
                    item.id === "cartBtn" && item.closest(".m-mall-box")?.classList.contains("right-collapsed");
                return (
                    !isHiddenInCollapsedRight &&
                    rect.width > 0 &&
                    rect.height > 0 &&
                    rect.right > 0 &&
                    rect.left < window.innerWidth &&
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    Number(style.opacity) !== 0
                );
            });
            if (!cartBtn) return;
            const { left, top } = cartBtn.getBoundingClientRect();
            this.$store.dispatch("mallNew/setBoundCart", { left: left + 10, top: top });
        }, 500),
    },
    components: {
        MallNav,
        GoodDetail,
        Cart,
        CartConfirm,
    },
};
</script>

<style lang="less">
.m-mall-box {
    --right-width: 292px;
    --right-collapsed-width: 56px;
    width: 100%;
    min-height: calc(100vh - 96px);
    background: url("@{design}mall/bg.png") no-repeat center center;
    background-size: 100% 100%;
    display: grid;
    grid-template-columns: auto minmax(500px, 1fr) var(--right-width);
    align-items: start;
    overflow-x: auto;
    scrollbar-width: none;
    position: relative;
    isolation: isolate;
    transition: grid-template-columns 0.2s ease;

    &.right-collapsed {
        --right-width: var(--right-collapsed-width);

        .box-right {
            align-items: center;
            justify-content: flex-start;
        }

        .box-right .cart,
        .box-right .girl,
        .box-right .right-detail-panel {
            opacity: 0;
            pointer-events: none;
            transform: translateX(16px);
        }

        .right-toggle {
            width: 40px;
            height: 40px;
            margin: 16px auto 0;
            padding: 0;
            justify-content: center;

            .right-toggle-text {
                opacity: 0;
                width: 0;
                overflow: hidden;
            }
        }
    }

    .mall-detail-empty {
        min-height: calc(100vh - 96px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        box-sizing: border-box;
        color: rgba(255, 255, 255, 0.82);

        .mall-detail-empty-card {
            width: min(420px, 100%);
            min-height: 300px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            background:
                radial-gradient(circle at 50% 28%, rgba(255, 163, 43, 0.16), rgba(255, 163, 43, 0) 34%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 24px 60px rgba(0, 0, 0, 0.24);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 36px 28px;
            box-sizing: border-box;
            text-align: center;
        }

        .mall-detail-empty-icon {
            position: relative;
            width: 164px;
            height: 124px;
            margin-bottom: 24px;

            &::after {
                content: "";
                position: absolute;
                left: 50%;
                bottom: 4px;
                width: 124px;
                height: 20px;
                transform: translateX(-50%);
                border-radius: 50%;
                background: radial-gradient(ellipse at center, rgba(255, 171, 45, 0.24), rgba(255, 171, 45, 0));
                filter: blur(1px);
            }

            .u-null-bag {
                position: absolute;
                left: 50%;
                bottom: 17px;
                width: 84px;
                height: 78px;
                transform: translateX(-50%);
                border: 1px solid rgba(255, 186, 76, 0.42);
                border-radius: 20px 20px 24px 24px;
                background: linear-gradient(180deg, rgba(255, 186, 76, 0.2), rgba(255, 171, 45, 0.06));
                box-shadow: 0 24px 68px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.1);

                &::before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: -20px;
                    width: 40px;
                    height: 32px;
                    transform: translateX(-50%);
                    border: 3px solid rgba(255, 205, 112, 0.5);
                    border-bottom: 0;
                    border-radius: 22px 22px 0 0;
                }

                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 26px;
                    width: 31px;
                    height: 8px;
                    transform: translateX(-50%);
                    border-radius: 999px;
                    background: rgba(255, 213, 121, 0.28);
                }
            }

            .u-null-ticket {
                position: absolute;
                right: 22px;
                bottom: 46px;
                width: 50px;
                height: 33px;
                transform: rotate(-12deg);
                border: 1px solid rgba(255, 215, 130, 0.42);
                border-radius: 9px;
                background: linear-gradient(135deg, rgba(255, 213, 121, 0.2), rgba(255, 171, 45, 0.06));
                box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
            }

            .u-null-ticket::before,
            .u-null-ticket::after {
                content: "";
                position: absolute;
                top: 50%;
                width: 9px;
                height: 9px;
                transform: translateY(-50%);
                border-radius: 50%;
                background: #101827;
            }

            .u-null-ticket::before {
                left: -5px;
            }

            .u-null-ticket::after {
                right: -5px;
            }

            .u-null-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ffd768;
                box-shadow: 0 0 22px rgba(255, 215, 104, 0.76);
            }

            .u-null-dot.is-left {
                left: 22px;
                top: 38px;
            }

            .u-null-dot.is-right {
                right: 31px;
                top: 20px;
                width: 6px;
                height: 6px;
            }
        }

        .mall-detail-empty-title {
            font-size: 18px;
            font-weight: 700;
            line-height: 26px;
            color: #fff;
        }

        .mall-detail-empty-desc {
            width: min(320px, 100%);
            margin-top: 8px;
            font-size: 13px;
            line-height: 20px;
            color: rgba(255, 255, 255, 0.56);
        }
    }

    .box-right {
        width: var(--right-width);
        position: sticky;
        top: 96px;
        align-self: end;
        z-index: 2;
        min-height: calc(100vh - 96px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        box-sizing: border-box;
        overflow: hidden;
        transition: width 0.2s ease;

        .right-scroll {
            width: 100%;
            min-height: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            overflow: hidden;
        }

        .right-toggle {
            flex: none;
            width: calc(100% - 24px);
            height: 36px;
            margin: 16px 12px auto;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.78);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 0 12px;
            box-sizing: border-box;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            transition:
                width 0.18s ease,
                margin 0.18s ease,
                background 0.18s ease,
                color 0.18s ease;

            &:hover {
                color: #fff;
                background: rgba(255, 163, 43, 0.18);
                border-color: rgba(255, 163, 43, 0.34);
            }

            .right-toggle-icon {
                font-size: 22px;
                line-height: 1;
                flex: none;
            }

            .right-toggle-text {
                transition:
                    opacity 0.16s ease,
                    width 0.16s ease;
            }
        }

        .cart,
        .girl,
        .right-detail-panel {
            transition:
                opacity 0.18s ease,
                transform 0.18s ease;
        }

        .right-cart-panel {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .girl {
            width: 220px;
            height: 265px;
        }
        .cart {
            .cart-container {
                .cart-content {
                    width: 280px;
                    height: 267px;
                    box-sizing: border-box;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 1);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: center;
                    gap: 12px;
                    .cart-text {
                        font-size: 12px;
                        line-height: 17.38px;
                        color: rgba(56, 56, 56, 1);
                        .blue {
                            color: rgba(64, 128, 255, 1);
                            font-weight: 700;
                        }
                        .orange {
                            color: rgba(255, 163, 43, 1);
                            font-weight: 700;
                        }
                    }
                    .cart-btn {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .text {
                            font-size: 12px;
                        }
                        .btn {
                            cursor: pointer;
                            width: 115px;
                            height: 28px;
                            border-radius: 8px;
                            background: rgba(36, 41, 46, 1);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 12px;
                            color: rgba(255, 255, 255, 1);
                            .cart-icon {
                                width: 16px;
                                height: 16px;
                                margin-right: 6px;
                            }
                        }
                    }
                    .total {
                        width: 232px;
                        height: 61px;
                        border-radius: 8px;
                        background: rgba(242, 242, 242, 1);
                        .total-item {
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            font-size: 12px;
                            padding: 0 12px;
                            color: rgba(0, 0, 0, 1);
                            .right {
                                display: flex;
                                align-items: center;
                                .total-icon {
                                    margin-right: 4px;
                                }
                                .quilt-text {
                                    color: rgba(153, 153, 153, 1);
                                }
                            }
                        }
                    }
                    .total-btn {
                        .size(160px,44px);
                        .pointer;
                        .fz(18px,44px);
                        .r(22px);
                        .bold;
                        .x;
                        background: rgba(255, 163, 43, 1);
                        align-self: center;
                        color: rgba(255, 255, 255, 1);
                        &:hover {
                            box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
                        }
                    }
                }
                .arrow {
                    border-top: 11px solid rgba(255, 255, 255, 1);
                    border-left: 7px solid transparent;
                    border-right: 7px solid transparent;
                    width: 0;
                    margin: 0 auto;
                }
            }
        }
    }

    .mobile-cart-button {
        display: none;
    }

    .mobile-right-button,
    .mobile-right-backdrop {
        display: none;
    }
}

@media screen and (max-width: 1550px) {
    .m-mall-box {
        grid-template-columns: minmax(0, 1fr);
        padding-right: var(--right-collapsed-width);
        box-sizing: border-box;

        .box-right {
            position: fixed;
            right: 0;
            top: 96px;
            height: calc(100vh - 96px);
            z-index: 90;
            background: linear-gradient(180deg, rgba(7, 15, 28, 0.72), rgba(7, 15, 28, 0.18));
            backdrop-filter: blur(6px);
        }

        &.right-open {
            .box-right {
                width: min(560px, 46vw);
                box-shadow: -18px 0 40px rgba(0, 0, 0, 0.28);
            }
        }

        .box-right {
            justify-content: flex-start;
            border-left: 1px solid rgba(255, 255, 255, 0.08);

            .right-scroll {
                justify-content: flex-start;
                gap: 16px;
                padding: 0 12px 24px;
                box-sizing: border-box;
                overflow: hidden auto;
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            .right-detail-panel {
                width: 100%;
                flex: none;

                .good-detail {
                    min-width: 0;
                    min-height: auto;
                    padding: 8px 0 0;
                    margin-left: 0;

                    &.without-nav {
                        margin-left: 0;
                    }

                    .canBuy-text {
                        height: 22px;
                        font-size: 12px;
                        line-height: 22px;
                    }

                    .title-card {
                        width: 100%;
                        height: auto;
                        min-height: 50px;
                        padding: 6px 8px;

                        .title {
                            font-size: 18px;
                            line-height: 24px;
                        }

                        .apply {
                            font-size: 12px;
                            line-height: 18px;
                        }
                    }

                    .card {
                        width: 100%;
                        height: auto;
                        min-height: 0;
                        padding: 14px 0 12px;
                        box-sizing: border-box;

                        .m-good-preview {
                            width: 100%;
                            justify-content: center;
                        }

                        .skeleton-container {
                            max-width: 100%;
                            box-sizing: border-box;
                            transform: scale(0.82);
                            transform-origin: center center;
                        }

                        .u-good-image {
                            width: min(100%, 320px);
                            height: min(58vw, 320px);
                            min-height: 220px;
                        }
                    }

                    .buy-detail {
                        width: 100%;
                        min-height: 0;

                        .detail-card {
                            min-height: 0;

                            .condition {
                                gap: 8px;
                            }

                            .buy-time {
                                height: auto;
                                min-height: 18px;
                                padding: 0 8px;
                                box-sizing: border-box;
                            }

                            .buttons {
                                gap: 8px;
                                flex-wrap: wrap;

                                .button {
                                    width: 92px;
                                }
                            }
                        }

                        .good-comment {
                            height: auto;
                            max-height: 120px;
                            padding: 10px 16px;
                        }
                    }
                }
            }

            .right-cart-panel {
                flex: none;
                padding-bottom: 16px;
            }
        }
    }
}

@media screen and (max-width: 750px) {
    .m-mall-box {
        min-height: calc(100vh - 60px);
        display: block;
        overflow-x: hidden;
        background: #070f1c;
        padding: 0.75rem;
        box-sizing: border-box;

        .good-detail,
        .mall-detail-empty {
            display: none;
        }

        .box-right {
            width: min(18.5rem, calc(100vw - 3rem));
            max-width: calc(100vw - 3rem);
            min-height: 0;
            height: calc(100vh - 60px);
            position: fixed;
            right: 0;
            top: 60px;
            z-index: 121;
            padding: 0.75rem 0.75rem 5.25rem;
            box-sizing: border-box;
            align-items: center;
            justify-content: flex-end;
            transform: translateX(100%);
            transition: transform 0.2s ease;
            overflow: hidden;

            .right-toggle {
                width: 100%;
                height: 2.25rem;
                margin: 0 0 auto;
                border-radius: 0.5rem;

                .right-toggle-text {
                    opacity: 1;
                    width: auto;
                }
            }

            .cart,
            .girl {
                opacity: 1;
                pointer-events: auto;
                transform: none;
            }

            .girl {
                width: 12.5rem;
                height: auto;
                max-height: 14rem;
                object-fit: contain;
            }

            .cart {
                width: 100%;

                .cart-container {
                    .cart-content {
                        width: 100%;
                        max-width: 17rem;
                    }
                }
            }
        }

        &.right-open {
            .box-right {
                transform: translateX(0);
            }
        }

        .mobile-right-backdrop {
            display: block;
            position: fixed;
            left: 0;
            right: 0;
            top: 60px;
            bottom: 0;
            z-index: 120;
            border: 0;
            padding: 0;
            background: rgba(0, 0, 0, 0.46);
        }

        .mobile-cart-button {
            width: 3.75rem;
            height: 3.75rem;
            border: 0;
            border-radius: 50%;
            background: rgba(255, 163, 43, 1);
            position: fixed;
            left: 0.875rem;
            bottom: 0.875rem;
            z-index: 80;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.24);

            img {
                width: 1.875rem;
                height: 1.875rem;
            }
        }
    }
}
</style>
