<template>
    <div class="m-mall-box">
        <MallNav :list="list" :loading="isLoading" @changeNav="isShowNav = !isShowNav" :isShowNav="isShowNav"></MallNav>
        <GoodDetail v-if="selectItem" :good="selectItem || {}" :isShowNav="isShowNav"></GoodDetail>
        <div v-else class="mall-detail-empty">
            <el-empty description="请选择左侧商品查看详情"></el-empty>
        </div>
        <aside class="box-right">
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
        </aside>
        <Cart></Cart>
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
export default {
    name: "MallList",
    data: function () {
        return {
            imgUrl: __cdn + "design/mall/",
            goodsList: [],
            selectItem: null,
            isLoading: false,
            loadSeq: 0,

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
    },
    provide() {
        return {
            query: this.query,
            changeQuery: this.changeQuery,
            changeSelectItem: this.changeSelectItem,
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
        this.handleResize(false);
        window.addEventListener("resize", this.handleResize);
        this.loadData();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("resize", this.getBoundCart);
    },
    methods: {
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
            if (this.query.only_unowned) params.no_buy = 1;

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
        decorateGood(item = {}) {
            const good = this.normalizeGood(item);
            good.canBuy = this.checkCanBuy(good);
            good.isHave = good.has_owned;
            return good;
        },
        async loadData() {
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
                if (!this.id) {
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
        changeQuery(key, value, isChangePage) {
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
            this.syncRouteQuery();
            this.loadData();
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
            if (this.query.only_unowned) routeQuery.no_buy = 1;
            if (this.query.pageIndex > 1) routeQuery.pageIndex = this.query.pageIndex;
            return routeQuery;
        },
        syncRouteQuery() {
            const query = this.buildRouteQuery();
            const name = this.id ? "mall_list_new_id" : "mall_list_new";
            const params = this.id ? { id: this.id } : {};
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
        changeSelectItem(item) {
            if (item.id === this.selectItem?.id) return;
            this.$router.push({ name: "mall_list_new_id", params: { id: item.id }, query: this.buildRouteQuery() });
        },
        handleResize(shouldLoad = true) {
            const width = window.innerWidth < 751 ? 10 : window.innerWidth < 1550 ? 5 : 10;
            if (width !== this.query.pageSize) {
                this.query.pageSize = width;
                if (shouldLoad) {
                    this.loadData();
                }
            }
        },
        getBoundCart: debounce(function () {
            const cartBtn = Array.from(document.querySelectorAll("#cartBtn, .mobile-cart-button")).find((item) => {
                const rect = item.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
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
    width: 100%;
    min-height: calc(100vh - 96px);
    background: url("@{design}mall/bg.png") no-repeat center center;
    background-size: 100% 100%;
    display: grid;
    grid-template-columns: auto minmax(500px, 1fr) 292px;
    align-items: start;
    overflow-x: auto;
    scrollbar-width: none;
    position: relative;
    isolation: isolate;

    .mall-detail-empty {
        min-height: calc(100vh - 96px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.72);

        .el-empty__description p {
            color: rgba(255, 255, 255, 0.72);
        }
    }

    .box-right {
        width: 292px;
        position: sticky;
        top: 96px;
        align-self: end;
        z-index: 2;
        min-height: calc(100vh - 96px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
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
                        .size(160px,50px);
                        .pointer;
                        .fz(18px,50px);
                        .r(25px);
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
}

@media screen and (max-width: 1550px) {
    .m-mall-box {
        grid-template-columns: auto minmax(500px, 1fr) 292px;
    }
}

@media screen and (max-width: 750px) {
    .m-mall-box {
        min-height: calc(100vh - 6.5rem);
        display: block;
        overflow-x: hidden;
        background: #070f1c;
        padding: 0.75rem;
        box-sizing: border-box;

        .good-detail,
        .mall-detail-empty,
        .box-right {
            display: none;
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
