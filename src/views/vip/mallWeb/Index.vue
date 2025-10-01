<template>
    <div class="m-mall-web" v-loading="isLoading">
        <SearchBox></SearchBox>
        <GoodList :list="list" :noData="noData"></GoodList>

        <Nav></Nav>
    </div>
</template>

<script>
import SearchBox from "./components/SearchBox.vue";
import GoodList from "./components/GoodList.vue";
import { getItemList } from "@/service/vip/mall";
import { __userLevel } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import { debounce, unionBy } from "lodash";
import Nav from "./components/Nav.vue";
import { removeEmpty } from "@/utils/index";
export default {
    name: "Index",
    data() {
        return {
            query: {
                pageSize: 10,
                pageIndex: 1,
                level: null,
                vip_limit: null,
                title: "",
                category: "",
                sub_category: "",
            },
            goodsList: [],
            hasMore: true,
            isLoading: false,
            noData: false,
        };
    },
    components: {
        SearchBox,
        GoodList,
        Nav,
    },
    provide() {
        return {
            query: this.query,
            changeQuery: this.changeQuery,
            hasMore: this.hasMore,
            isLoading: this.isLoading,
            noData: this.noData,
        };
    },
    computed: {
        asset() {
            return this.$store.state.mallNew.asset;
        },
        list() {
            return this.goodsList?.map((item) => {
                return {
                    ...item,
                    canBuy: this.checkCanBuy(item),
                };
            });
        },
    },
    methods: {
        async loadData() {
            try {
                if (this.query.pageIndex === 1) this.noData = false;
                if (this.noData) return;
                this.isLoading = true;
                const res = await getItemList(removeEmpty(this.query));
                const list = res.data.data?.list || [];
                const all = [...this.goodsList, ...list];
                this.goodsList = this.query.pageIndex == 1 ? list : unionBy(all, "id");
                const pageTotal = res.data.data?.page.pageTotal;
                this.hasMore = this.query.pageIndex < pageTotal;
                if (!list.length) this.noData = true;
            } catch (error) {
                console.error("加载数据失败", error);
            } finally {
                this.isLoading = false;
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
            this.loadData();
        },
        // 判断是否可以购买
        checkCanBuy(item) {
            const result = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                points: true,
                level: true,
                user_level: User.getLevel(item.exp_limit),
                buy_time: true,
            };
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                result.canBuy = false;
                result.vip_limit = false;
            }
            if (this.asset.box_coin < item.price_boxcoin) {
                result.canBuy = false;
                result.box_coin = false;
            }
            if (this.asset.points < item.price_points) {
                result.canBuy = false;
                result.points = false;
            }
            if (this.asset.experience < item.exp_limit) {
                result.canBuy = false;
                result.level = false;
            }
            if (item.on_selling === 0) {
                result.canBuy = false;
                result.buy_time = false;
            }
            return result;
        },
        getBoundCart: debounce(function () {
            const { left, top } = document.getElementById("cartBtn").getBoundingClientRect();
            this.$store.dispatch("mallNew/setBoundCart", { left: left, top: top });
        }, 500),
    },
    created() {
        this.loadData();
    },
    mounted() {
        this.getBoundCart();
        window.addEventListener("resize", this.getBoundCart);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.getBoundCart);
    },
};
</script>

<style lang="less" scoped>
.m-mall-web {
    width: 100%;
    height: calc(100vh - 64px - 9.6vw);
    background: #070f1c;
    padding: 3.2vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 3.2vw;
}
</style>
