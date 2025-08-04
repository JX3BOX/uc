<template>
    <div class="m-mall-web">
        <SearchBox></SearchBox>
        <GoodList :list="list"></GoodList>
        <Nav></Nav>
    </div>
</template>

<script>
import SearchBox from "./components/SearchBox.vue";
import GoodList from "./components/GoodList.vue";
import { getItemList } from "@/service/vip/mall";
import { __userLevel } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import { debounce } from "lodash";
import Nav from "./components/Nav.vue";
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
                total: 0,
            },
            goodsList: [],
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
        buildQuery() {
            const _query = {};
            for (let key in this.query) {
                if (this.query[key] !== undefined && this.query[key] !== "" && this.query[key] !== null) {
                    if (key === "level" && this.query.level != 0) {
                        _query.exp_limit = __userLevel[this.query.level]?.[0];
                        _query.exp_limit_max = __userLevel[this.query.level]?.[1] - 1 || "";
                    } else {
                        _query[key] = this.query[key];
                    }
                }
            }
            delete _query.total;
            return _query;
        },
        loadData() {
            const query = this.buildQuery();
            getItemList(query).then((res) => {
                this.goodsList = res.data.data?.list || [];
                this.query.total = res.data.data.page?.total || 0;
                if (res.data.data.page) {
                    this.query.pageIndex = res.data.data.page.index;
                    this.query.pageSize = res.data.data.page.pageSize;
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
            this.loadData();
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
            if (item.on_selling === 0) {
                obj.canBuy = false;
                obj.buy_time = false;
            }
            return obj;
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
