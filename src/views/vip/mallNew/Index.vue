<template>
    <div class="m-mall-box">
        <MallNav :list="list" @changeNav="isShowNav = !isShowNav" :isShowNav="isShowNav"></MallNav>
        <GoodDetail v-if="selectItem" :good="selectItem || {}" :isShowNav="isShowNav"></GoodDetail>
        <div class="box-right">
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
            <Cart></Cart>
            <img :src="imgUrl + 'girl.png'" alt="" class="girl" />
        </div>
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

            query: {
                pageSize: 10,
                pageIndex: 1,
                level: null,
                vip_limit: null,
                title: "",
                category: "",
                sub_category: "",
                only_unowned: false,
                total: 0,
            },
            isShowNav: true,
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
            const _query = {};
            for (let key in this.query) {
                if (this.query[key] !== undefined && this.query[key] !== "" && this.query[key] !== null) {
                    if (key === "only_unowned") {
                        const onlyUnowned = this.query.only_unowned;
                        _query.no_buy = onlyUnowned ? 1 : "";
                    } else if (key === "level" && this.query.level != 0) {
                        _query.exp_limit = __userLevel[this.query.level]?.[0];
                        _query.exp_limit_max = __userLevel[this.query.level]?.[1] - 1 || "";
                    } else {
                        _query[key] = this.query[key];
                    }
                }
            }
            delete _query.total;
            if (_query.no_buy === "") delete _query.no_buy;
            return _query;
        },
        hasOwnedGood(item = {}) {
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
        loadData() {
            const query = this.buildQuery();
            getItemList(query).then((res) => {
                this.goodsList = (res.data.data?.list || []).map((item) => this.normalizeGood(item));
                this.query.total = res.data.data.page?.total || 0;
                if (res.data.data.page) {
                    this.query.pageIndex = res.data.data.page.index;
                    this.query.pageSize = res.data.data.page.pageSize;
                }
                if (!this.id) {
                    this.selectFirstGood();
                }
            });
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
                owned: true,
            };
            const time = new Date().getTime();
            if (item.has_owned) {
                obj.canBuy = false;
                obj.owned = false;
            }
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
            const width = window.innerWidth < 1550 ? 5 : 10;
            if (width !== this.query.pageSize) {
                this.query.pageSize = width;
                if (shouldLoad) {
                    this.loadData();
                }
            }
        },
        getBoundCart: debounce(function () {
            const { left, top } = document.getElementById("cartBtn").getBoundingClientRect();
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
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    scrollbar-width: none;
    .box-right {
        width: 292px;
        position: fixed;
        right: 0;
        bottom: 0;
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
}
</style>
