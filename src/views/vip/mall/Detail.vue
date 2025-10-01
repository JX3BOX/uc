<template>
    <div class="p-detail" v-loading="loading" v-if="item">
        <div class="m-breadcrumb">
            <span class="u-router">
                <a class="u-link" href="/vip/mall"><i class="el-icon-s-goods"></i> 积分商城</a>
                <em><i class="el-icon-arrow-right"></i></em>
                <a class="u-link" :href="`/vip/mall?category=${item.category}`">{{
                    showCategoryLabel(item.category)
                }}</a>
                <em><i class="el-icon-arrow-right"></i></em>
                <a class="u-link" :href="`/vip/mall?category=${item.category}&sub_category=${item.sub_category}`">{{
                    showSubCategoryLabel(item.sub_category)
                }}</a>
            </span>

            <div class="u-op">
                <a
                    @click="goBack"
                    class="u-back"
                    :href="`/vip/mall?category=${item.category}&sub_category=${item.sub_category}`"
                    ><i class="el-icon-right"></i> 返回</a
                >
                <!--
                <el-badge
                    class="u-cart"
                    :class="!isLogin ? 'is-disabled' : ''"
                    :value="cartNum"
                    :max="99"
                    :hidden="!cartNum"
                    id="shopCart"
                >
                    <i class="el-icon-shopping-cart-full u-icon" @click="openCart"></i>
                </el-badge> -->
            </div>

            <!-- <a class="u-link" href="/about/incentives" target="_blank"
                ><i class="el-icon-link"></i>《魔盒创作激励方案》</a
            > -->
        </div>

        <div class="wp">
            <div class="m-banner" v-if="item.goods_banner">
                <img :src="resolveImagePath(item.goods_banner)" alt="" />
            </div>

            <div class="m-content">
                <Picture :list="item.goods_images" :item="item" />
                <div class="m-info">
                    <span class="u-title">
                        <span class="u-label" v-if="item.is_only_lottery"><i class="el-icon-present"></i>抽奖限定</span>
                        {{ item.title }}
                    </span>
                    <span class="u-subtitle"
                        ><span v-if="item.subtitle">{{ item.subtitle }}</span></span
                    >
                    <!-- <span class="u-tag">
                            <el-tag>{{ showType(item.category) }}</el-tag>
                            <el-tag type="warning">{{ showType(item.sub_category) }}</el-tag>
                        </span> -->
                    <div class="u-price">
                        <span class="u-show" v-show="item.price_for_show">
                            价值：<b>￥{{ item.price_for_show / 100 }}元</b>
                        </span>
                        <!-- <span>邮费：{{ item.postage ? `${item.postage / 100} 元` : "包邮" }}</span> -->
                    </div>
                    <div class="u-limit">
                        <el-divider content-position="left"><i class="el-icon-unlock"></i> 兑换需求</el-divider>
                        <span class="u-line" v-if="item.end_sell_time">
                            <i class="el-icon-time"></i> 可兑换时间：
                            <el-tag :type="isExpire(item.end_sell_time) ? 'success' : 'warning'" size="mini">{{
                                item.start_sell_time
                            }}</el-tag>
                            -
                            <el-tag :type="isExpire(item.end_sell_time) ? 'success' : 'warning'" size="mini">{{
                                item.end_sell_time
                            }}</el-tag>
                        </span>
                        <span :class="{ active: !isPro }">
                            <i class="el-icon-star-off"></i> 会员：
                            <span>{{ item.vip_limit ? "仅会员可购买" : "不限" }}</span>
                        </span>
                        <span :class="{ active: isCheck(showLevel(asset.experience), showLevel(item.exp_limit)) }">
                            <i class="el-icon-sunny"></i> 等级： <span> Lv. {{ showLevel(item.exp_limit) }}</span>
                        </span>
                        <span v-show="item.price_cny" :class="{ active: isCheck(asset.cny, item.price_cny * number) }">
                            <i class="el-icon-wallet"></i> 金箔： <b>{{ item.price_cny * number }}</b>
                        </span>
                        <span
                            v-show="item.price_points"
                            :class="{ active: isCheck(asset.points, item.price_points * number) }"
                        >
                            <i class="el-icon-sugar"></i> 积分：<b> {{ item.price_points * number }}</b>
                        </span>
                        <span
                            v-show="item.price_boxcoin"
                            :class="{ active: isCheck(asset.box_coin, item.price_boxcoin * number) }"
                        >
                            <i class="el-icon-coin"></i> 盒币： <b>{{ item.price_boxcoin * number }}</b>
                        </span>
                    </div>

                    <el-divider content-position="left"><i class="el-icon-shopping-bag-1"></i> 兑换详情</el-divider>
                    <div class="u-count">
                        <span class="u-number" v-if="item.stock">
                            数量：<el-input-number v-model="number" :min="1" :max="maxNumber" size="small" />
                        </span>
                        <span class="u-stock"
                            >库存：<b>{{ item.stock }}</b></span
                        >
                    </div>
                    <span
                        class="u-limit-tips"
                        v-if="item.once_buy_count_limit || item.cooldown_day_limit || item.everyone_buy_frequency_limit"
                    >
                        * 兑换限制：
                        <span v-if="item.once_buy_count_limit">
                            每次最多只能兑换{{ item.once_buy_count_limit }}个
                        </span>
                        <span v-if="item.cooldown_day_limit">
                            <b>{{ item.cooldown_day_limit }}</b
                            >天冷却时间
                        </span>
                        <span v-if="item.everyone_buy_frequency_limit">
                            累计最多可兑换{{ item.everyone_buy_frequency_limit }}次
                        </span>
                    </span>
                    <div class="u-buttons" v-if="!isHad">
                        <template v-if="!item.is_only_lottery">
                            <span class="u-button" v-if="paluHas(item)" @click="toBuy"> 立即兑换 </span>
                            <a :href="getLink(item.sub_category)" target="_blank" v-else-if="isHave">
                                <span class="u-button u-btn-use">立即使用</span>
                            </a>
                            <span
                                class="u-button"
                                :class="isTimeout ? 'u-danger' : 'u-disabled'"
                                v-else-if="isVerify || isTimeout || item.stock == 0"
                            >
                                {{ isTimeout ? "尚未开启兑换" : item.stock == 0 ? "商品库存不足" : "不符合兑换需求" }}
                            </span>
                            <span class="u-button" v-else @click="toBuy">立即兑换</span>
                        </template>
                        <a :href="lotteryLink" target="_blank" v-else>
                            <span class="u-button u-btn-use">积分抽奖限定</span>
                        </a>
                        <template
                            v-if="
                                item.category === 'virtual' &&
                                item.as_gift_allow &&
                                !isTimeout &&
                                !isVerify &&
                                item.stock != 0
                            "
                        >
                            <span class="u-button" @click="presented(true)">赠送</span>
                        </template>

                        <!-- 加入购物车 -->
                        <el-button
                            v-if="!item.taobao_link && !isVerify && !isTimeout && !isHad"
                            :disabled="!isLogin || !item.stock"
                            icon="el-icon-shopping-cart-1"
                            circle
                            id="btnCart"
                            @click.prevent="handleAddCart"
                        ></el-button>
                        <!-- 购物车轨迹 -->
                        <div id="flyItem" class="c-fly-item"><img :src="showAvatar(item.goods_images?.[0])" /></div>

                        <a class="u-button" v-if="item.taobao_link" :href="item.taobao_link" target="_blank">
                            链接购买
                        </a>
                    </div>
                    <span v-else class="is-had">
                        <span class="el-button el-button--info is-disabled is-plain"> 已拥有 </span>
                    </span>
                </div>
            </div>
            <!-- 赠送 -->
            <UserPop title="赠送" :show="visible" @switchUserPop="presented" @confirm="presentedConfirm"></UserPop>
            <!-- 装扮步骤条 -->
            <!-- <div class="m-step" v-if="showStep">
                <div class="u-title">虚拟装扮使用步骤</div>
                <el-steps align-center :active="3">
                    <el-step>
                        <template slot="description">
                            <a :href="getLink()" target="_blank">
                                <span class="u-step-desc">打开主题风格</span>
                                <img src="../../assets/img/common/step1.png" />
                            </a>
                        </template>
                    </el-step>
                    <el-step>
                        <template slot="description">
                            <a :href="getLink()" target="_blank">
                                <span class="u-step-desc">在主题装扮内找到对应菜单 </span>
                                <img src="../../assets/img/common/step2.png" />
                            </a>
                        </template>
                    </el-step>
                </el-steps>
            </div> -->
            <!-- 内容 -->
            <div class="m-extend">
                <div class="m-tabs">
                    <span
                        class="u-tab"
                        :class="tabKey == item.key ? 'active' : ''"
                        v-for="item in tabs"
                        :key="item.key"
                        @click="changeTab(item.key)"
                    >
                        {{ item.label }}
                    </span>
                </div>
                <template v-if="tabKey == 'info'">
                    <Skeleton :category="skeletonInfo.category" :img="skeletonInfo.img" />
                    <Article v-if="item.describe" :content="item.describe" @directoryRendered="updateDirectory" />
                    <span v-else class="u-none">~ 暂无商品详情 ~</span>
                </template>

                <div class="m-comment" v-else>
                    <!-- <el-divider content-position="left">评论</el-divider> -->
                    <Comment :id="id" />
                </div>
            </div>

            <div class="m-top" @click="goTop">
                <i class="el-icon-upload2"></i>
                <span>回到顶部</span>
            </div>
        </div>

        <Order :id="id" v-model="showOrder" />
    </div>
</template>
<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "./components/comment.vue";
import UserPop from "@jx3box/jx3box-common-ui/src/author/UserPop.vue";
import Picture from "./components/Picture.vue";
import Order from "./components/Order.vue";
import Skeleton from "./components/skeleton/index.vue";

import types from "@/assets/data/vip/goods_types.json";
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __OriginRoot } from "@/utils/config";
import { throttle } from "lodash";
import { resolveImagePath, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { checkOwnedStatus, getItem, toPay, toPayOrder, giveAway, getDecoration } from "@/service/vip/mall";

export default {
    name: "GoodsDetail",
    components: {
        Picture,
        Article,
        Comment,
        UserPop,
        Order,
        Skeleton,
    },
    data: function () {
        return {
            loading: false,
            tabs: [
                { label: "商品详情", key: "info" },
                { label: "商品评价", key: "comment" },
            ],
            tabKey: "info",
            number: 1,

            post: {},
            stat: {},

            checkList: [],
            isHave: false,
            item: {},
            visible: false,

            showOrder: false,
            showStep: false,

            isPro: false,
            myVirtualItems: [],
        };
    },
    computed: {
        skeletonInfo() {
            if (this.item && this.item.category === "virtual") {
                if (this.item.sub_category === "skin") {
                    return {
                        category: this.item.virtual_stock_item_details.category,
                        img: `https://cdn.jx3box.com/design/decoration/images/${this.item.remark}/${this.item.virtual_stock_item_details.category}.png`,
                    };
                }
                if (this.item.sub_category === "palu") {
                    return {
                        category: "palu",
                        img: `https://cdn.jx3box.com/design/decoration/palu/${this.item.remark}.png`,
                    };
                }
            }
            return {};
        },
        id() {
            return this.$route.params.id;
        },

        asset() {
            return this.$store.state.mall.asset || {};
        },
        typeList() {
            let list = [];
            types.forEach((item) => {
                list.push({ name: item.name, key: item.key });
                if (item.subtype) list.push(...item.subtype);
            });
            return list;
        },
        maxNumber() {
            return this.item.once_buy_count_limit || this.item.stock;
        },
        isVerify() {
            const { experience, cny, points, box_coin } = this.asset;
            const { exp_limit, price_cny, price_points, price_boxcoin, vip_limit } = this.item;
            if (this.showLevel(experience) < this.showLevel(exp_limit)) return true;
            if (cny < price_cny) return true;
            if (points < price_points) return true;
            if (box_coin < price_boxcoin) return true;
            if (vip_limit && !this.isPro) return true;
            return false;
        },
        isTimeout() {
            const { start_sell_time, end_sell_time } = this.item;
            if (start_sell_time && this.isExpire(start_sell_time)) return true;
            if (end_sell_time && !this.isExpire(end_sell_time)) return true;
            return false;
        },
        lotteryLink() {
            return __Root + "vip/lottery";
        },
        cartNum() {
            return this.$store.getters["mall/cartNum"];
        },
        isLogin() {
            return User.isLogin();
        },
        // 已拥有 虚拟商品且限制只能拥有一个时
        isHad() {
            const item = this.item;
            return !!this.myVirtualItems.find(
                (v) =>
                    item.category === "virtual" &&
                    item.sub_category !== "palu" &&
                    item.vip_limit === 1 &&
                    v.type === item.sub_category &&
                    v.val === item.remark
            );
        },
    },
    watch: {
        id(val) {
            val && this.getData();
        },
    },
    methods: {
        loadDecoration() {
            getDecoration().then((res) => {
                let data = res.data.data;
                this.myVirtualItems = data;
            });
        },
        showAvatar,
        handleAddCart: throttle(function () {
            if (!this.item.stock) return;
            const num = this.$store.state.mall.cart?.find((item) => item.goods_id === this.item.id)?.amount || 0;
            if (this.number + num > this.item.stock) {
                return this.$message({
                    type: "warning",
                    message: "可兑换库存不足",
                });
            }
            this.$store
                .dispatch("mall/addCart", {
                    id: this.item.id,
                    amount: this.number,
                })
                .then((bol) => {
                    if (bol) {
                        this.fly();
                    }
                });
        }, 1000),
        fly() {
            var eleBtn = document.getElementById("btnCart");
            var eleFlyItem = document.getElementById("flyItem");
            var eleFlyImg = eleFlyItem.querySelector("img");

            const imgOffset = 40;

            var isRunning = false;
            // 现在按钮距离购物车的距离
            var boundBtn = eleBtn.getBoundingClientRect();
            var boundCart = this.$store.state.mall.boundCart;
            // 中心点的水平垂直距离
            var offsetX = boundCart.left + boundCart.width / 2 - (boundBtn.left + boundBtn.width / 2);
            var offsetY = boundCart.top + boundCart.height / 2 - (boundBtn.top + boundBtn.height / 2);
            if (isRunning == false) {
                // 购物车图形出现与初始定位
                eleFlyItem.style.visibility = "visible";
                eleFlyItem.style.left = boundBtn.left + imgOffset / 2 + "px";
                eleFlyItem.style.top = boundBtn.top + imgOffset / 2 + "px";
                // 开始动画
                eleFlyItem.style.transform = "translateX(" + offsetX + "px)";
                eleFlyImg.style.transform = "translateY(" + offsetY + "px)";
                // // 动画标志量
                isRunning = true;
                setTimeout(function () {
                    eleFlyItem.style.visibility = "hidden";
                    eleFlyItem.style.transform = "translateX(0)";
                    eleFlyImg.style.transform = "translateY(0)";
                    isRunning = false;
                }, 490);
            }
        },
        openCart() {
            if (this.isLogin) {
                this.$store.commit("mall/SET_STATE", {
                    key: "cartVisible",
                    value: true,
                });
            }
        },
        paluHas(item) {
            const { stock, sub_category } = item;
            if (sub_category !== "palu") {
                return false;
            } else {
                if (this.isVerify || this.isTimeout || stock == 0) return false;
            }
            return true;
        },
        goBack() {
            this.$router.push({ name: "mall_list" });
        },
        showLevel(num) {
            return User.getLevel(num);
        },
        isCheck(myAsset, asset) {
            return myAsset < asset;
        },
        isExpire(time) {
            return Date.parse(new Date()) < Date.parse(new Date(time));
        },
        showType(key) {
            if (!key) return;
            let _key = key;
            this.typeList.forEach((item) => {
                if (item.key == key) return (_key = item.name);
            });
            return _key;
        },
        changeTab(key) {
            this.tabKey = key;
        },
        updateDirectory: function (val) {
            this.directory = val;
        },
        toBuy: throttle(function () {
            if (!User.isLogin()) {
                this.$message.error("请先登录");
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }
            const { category, is_virtual, id } = this.item;
            if (is_virtual && category == "virtual") {
                return this.payVirtual({
                    id,
                    count: this.number,
                    addressId: 0,
                    remark: "虚拟商品购买",
                }).then((res) => {
                    this.item.stock -= 1;
                    this.isHave = true;
                    this.$confirm("购买成功，是否跳转至订单界面?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            const url = `${__Root}dashboard/mall`;
                            window.open(url);
                        })
                        .catch(() => {});
                });
            }

            this.showOrder = true;
        }, 2000),
        //虚拟商品
        async payVirtual({ id, count, addressId, remark }) {
            return new Promise((resolve) => {
                toPayOrder(id, count, addressId, remark).then((res) => {
                    toPay(res.data.data.id).then((data) => {
                        resolve(data);
                    });
                });
            });
        },
        goTop() {
            window.scroll(0, 0);
        },
        resolveImagePath,
        getCheckOwnedStatus() {
            // category=virtual且sub_category!=code 或 misc时
            let type = this.item.category,
                subtype = this.item.sub_category,
                subtypeArr = ["codesn", "keycode", "misc", "rename", "namespace"];
            if (type == "virtual" && subtypeArr.indexOf(subtype) == -1) {
                this.showStep = true;
                checkOwnedStatus(this.id).then((res) => {
                    this.isHave = res.data.data.own;
                });
            }
        },
        getLink(sub_category) {
            const describeForNameMap = {
                skin: "theme",
                avatar: "frame",
                honor: "honor",
                emotion: "emotion",
                codesn: "card?tab=virtual&page=1",
                keycode: "card?tab=virtual&page=1",
            };
            return `/dashboard/${describeForNameMap[sub_category]}`;
        },
        getData() {
            this.loading = true;
            getItem(this.id)
                .then((res) => {
                    this.item = res.data.data || {};
                    document.title = this.item.title || "积分商城";
                })
                .then(() => {
                    User.isLogin() && this.getCheckOwnedStatus();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        presented(status) {
            this.visible = status;
        },
        presentedConfirm(val) {
            giveAway(this.id, val.ID, this.number, { remark: "" }).then((res) => {
                toPay(res.data.data.id).then((data) => {
                    this.$message.success("赠送成功");
                });
            });
        },
        showCategoryLabel() {
            return this.item.category == "virtual" ? "虚拟商品" : "实物商品";
        },
        showSubCategoryLabel() {
            return types
                .find((item) => item.key == this.item.category)
                ?.["sub_category"].find((item) => item.key == this.item.sub_category)?.name;
        },
    },
    mounted() {
        this.getData();
        window.scrollTo(0, 0);
        if (User.isLogin()) {
            this.$store.dispatch("mall/getMyAddress");
            this.$store.dispatch("mall/getAsset");
            User.isPRO().then((result) => {
                this.isPro = result;
            });
            this.loadDecoration();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_detail.less";
</style>
