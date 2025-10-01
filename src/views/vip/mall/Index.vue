<template>
    <div class="m-mall-box">
        <div class="m-mall-search">
            <div class="m-search">
                <el-input placeholder="请输入搜索内容" v-model.trim.lazy="search" class="input-with-select" clearable>
                    <span slot="prepend">关键词</span>
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <!-- <el-badge
                    class="u-cart"
                    :class="!isLogin ? 'is-disabled' : ''"
                    :value="cartNum"
                    :max="99"
                    :hidden="!cartNum"
                >
                    <i class="el-icon-shopping-cart-full u-icon" @click="openCart"></i>
                </el-badge> -->
            </div>
            <div class="m-filter">
                <!-- 筛选 -->
                <div class="m-filter-level">
                    <span class="u-label">等级</span>
                    <el-select v-model="level" placeholder="请选择等级" @change="changeMeta('level')">
                        <el-option
                            v-for="item in levelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="m-filter-level">
                    <span class="u-label">VIP限制</span>
                    <el-select v-model="vip_limit" placeholder="请选择" @change="changeMeta('vip_limit')">
                        <el-option v-for="item in vipOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="m-mall-list" v-loading="loading" v-if="list && list.length">
            <Item v-for="item in list" :key="item.id" :isPro="isPro" :data="item" :skinJson="skinJson" :myVirtualItems="myVirtualItems" />
        </div>
        <div class="m-mall-null" v-else><el-empty description="当前条件下没有找的符合的记录"></el-empty></div>

        <el-pagination
            class="m-mall-pages m-archive-pages"
            background
            :hide-on-single-page="true"
            @current-change="changePage"
            :current-page.sync="pageIndex"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
        >
        </el-pagination>
    </div>
</template>
<script>
import { getItemList, getDecoration, getSkinJson } from "@/service/vip/mall";
import Item from "./components/Item.vue";
import { debounce } from "lodash";
import { __userLevel } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "MallList",
    data: function () {
        return {
            loading: false,
            list: [],

            pageIndex: 1, // 当前页数
            pageSize: 9, // 页码
            total: 0, // 总数
            number_queries: ["pageSize", "pageIndex"],

            // 筛选项
            search: "",
            title: "",
            category: "",
            sub_category: "",
            level: "0",
            vip_limit: "-1",

            // options
            levelOptions: [
                { label: "全部", value: "0" },
                { label: "Lv1", value: "1" },
                { label: "Lv2", value: "2" },
                { label: "Lv3", value: "3" },
                { label: "Lv4", value: "4" },
                { label: "Lv5", value: "5" },
                { label: "Lv6", value: "6" },
            ],
            vipOptions: [
                { label: "全部", value: "-1" },
                { label: "会员限定", value: "1" },
                { label: "非会员限定", value: "0" },
            ],
            isPro: false,

            myVirtualItems: [], // 我的虚拟物品 装扮 头像等
        };
    },
    computed: {
        query() {
            return {
                category: this.category,
                sub_category: this.sub_category,
                title: this.title ? this.title : this.search,
                level: this.level,
                vip_limit: this.vip_limit,
            };
        },
        cartNum() {
            return this.$store.getters["mall/cartNum"];
        },
        isLogin() {
            return User.isLogin();
        },
    },
    watch: {
        // 加载路由参数
        "$route.query": {
            deep: true,
            immediate: true,
            handler(query) {
                this.title = "";
                if (Object.keys(query).length) {
                    // console.log("[MallList]", "<route query change>", query);
                    for (let key in query) {
                        if (this.number_queries.includes(key)) {
                            this[key] = Number(query[key]);
                        } else {
                            if (key === "search") {
                                this.title = query[key];
                            } else {
                                this[key] = query[key];
                            }
                        }
                    }
                }
            },
        },

        // 监听query变化
        query: {
            immediate: true,
            deep: true,
            handler: debounce(function () {
                this.pageIndex = 1;
                this.loadData();
            }, 500),
        },
    },
    mounted() {
        if (this.isLogin) {
            this.$store.dispatch("mall/getAsset");
            User.isPRO().then((result) => {
                this.isPro = result;
            });
            this.loadDecoration();
        }
        this.loadSkinJson();
    },
    methods: {
        loadDecoration() {
            getDecoration().then((res) => {
                let data = res.data.data;
                this.myVirtualItems = data;
            });
        },
        loadSkinJson() {
            getSkinJson().then((res) => {
                this.skinJson = res.data;
            });
        },
        openCart() {
            if (this.isLogin) {
                this.$store.commit("mall/SET_STATE", {
                    key: "cartVisible",
                    value: true,
                });
            }
        },
        // 格式化参数
        buildQuery() {
            const _query = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
            };
            for (let key in this.query) {
                if (this.query[key] !== undefined && this.query[key] !== "" && this.query[key] !== null) {
                    if (key === "level" && this.query.level != 0) {
                        _query.exp_limit = __userLevel[this.query.level]?.[0];
                        _query.exp_limit_max = __userLevel[this.level]?.[1] - 1 || "";
                    } else {
                        _query[key] = this.query[key].trim();
                    }
                }
            }
            return _query;
        },
        loadData() {
            const query = this.buildQuery();
            this.loading = true;

            getItemList(query)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage(i) {
            this.loadData();
            this.replaceRoute({ pageIndex: i });
        },
        changeMeta(key) {
            this.replaceRoute({ [key]: this?.[key], pageIndex: 1 });
        },
        // 路由绑定
        replaceRoute(extend) {
            return this.$router
                .push({ query: Object.assign({}, this.$route.query, extend) })
                .then(() => {
                    window.scrollTo(0, 0);
                })
                .catch(() => {});
        },
    },
    components: { Item },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods.less";
</style>
