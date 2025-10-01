<template>
    <router-link
        :class="{
            'm-mall-item': true,
            'm-show-back-item': allowShowBackground(item),
        }"
        :style="{
            '--title-color': skin.titleColor,
            '--title-hover-color': skin.titleHoverColor,
            '--border-hover-color': skin.borderHoverColor,
            '--skin-background': skin.background ? `url(${skin.background})` : 'none',
        }"
        :to="{ name: 'mall_detail', params: { id: item.id } }"
        target="_blank"
        v-if="item"
    >
        <div class="u-img" :class="{ isAvatar }">
            <img class="u-frame" :src="showCover(item)" fit="contain" />
            <span class="u-avatar c-avatar">
                <img :src="showAvatarImg(avatar)" class="c-avatar-pic" />
                <i class="c-avatar-frame" v-if="frameUrl">
                    <img :src="frameUrl" />
                </i>
            </span>
            <!-- <Avatar class="u-avatar" size="l" :url="avatar" :frame="avatar_frame" v-if="avatar_frame" /> -->
        </div>
        <div class="u-content">
            <span class="u-title">
                <span class="u-label" v-if="item.is_only_lottery"><i class="el-icon-present"></i>抽奖限定</span>
                {{ item.title }}
            </span>
            <div class="u-desc">
                <span class="u-subtitle">
                    <span v-if="item.subtitle">{{ item.subtitle }}</span>
                </span>
                <span class="u-count"
                    >库存：<b>{{ item.stock }}</b></span
                >
            </div>

            <div class="u-exchange">
                <el-divider content-position="left"><i class="el-icon-sunny"></i> 兑换需求</el-divider>
                <span>等级： Lv.{{ showLevel(item.exp_limit) }}</span>
                <span v-show="item.vip_limit">仅会员</span>
                <span v-show="item.price_points">积分： {{ item.price_points }}</span>
                <span v-show="item.price_boxcoin">盒币： {{ item.price_boxcoin }}</span>
                <span v-show="item.price_cny">金箔： {{ item.price_cny }}</span>
            </div>
        </div>
        <div v-if="!item.taobao_link && !isVerify && !isTimeout" class="u-op">
            <!-- 已拥有 -->
            <template v-if="!isHad">
                <!-- 加入购物车 -->
                <el-button
                    :disabled="!isLogin || !item.stock"
                    icon="el-icon-shopping-cart-1"
                    circle
                    :id="`btnCart_${item.id}`"
                    size="small"
                    @click.prevent="handleAddCart"
                ></el-button>
                <!-- 购物车轨迹 -->
                <div :id="`flyItem_${item.id}`" class="c-fly-item">
                    <img :src="showAvatar(item.goods_images?.[0])" />
                </div>
            </template>
            <span v-else class="is-had">
                <el-button disabled icon="el-icon-shopping-cart-1" circle size="small"></el-button>
            </span>
        </div>
    </router-link>
</template>

<script>
import { getThumbnail, showAvatar, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __userLevel, __cdn, __imgPath } from "@/utils/config";
import { forEach, throttle } from "lodash";
import User from "@jx3box/jx3box-common/js/user";
import { addGoodsToCart } from "@/service/vip/cart";
export default {
    name: "GoodsIndexItem",
    props: ["data", "isPro", "myVirtualItems", "skinJson"],
    data: function () {
        return {
            item: {},
            // 部位名称映射
            skinPartMap: {
                侧边栏: "sidebar",
                名片: "atcard",
                评论: "comment",
                日历: "calendar",
                主页: "homebanner",
            },
        };
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                this.item = val;
            },
        },
    },
    computed: {
        isLogin() {
            return User.isLogin();
        },
        skin() {
            const skinJson = this.skinJson;
            const item = this.item;
            const val = item.remark;
            if (item.sub_category == "palu" && val) {
                if (skinJson[val]) {
                    return {
                        background: this.getSkinBackgroundUrl(item),
                        titleColor: skinJson[val].titleColor,
                        titleHoverColor: skinJson[val].titleHoverColor,
                        borderHoverColor: skinJson[val].borderHoverColor,
                    };
                }
            } else if (item.sub_category == "skin") {
                return {
                    background: this.getSkinBackgroundUrl(item),
                    titleColor: "#0366d6",
                    titleHoverColor: "rgba(255, 64, 128, 1)",
                    borderHoverColor: "#0366d6",
                };
            }
            return {
                titleColor: "#0366d6",
                titleHoverColor: "rgba(255, 64, 128, 1)",
                borderHoverColor: "#0366d6",
            };
        },
        uid() {
            const uid = localStorage.getItem("uid");
            return uid ? uid : 0;
        },
        isAvatar() {
            return this.item.sub_category === "avatar";
        },
        avatar() {
            const link = localStorage.getItem("avatar") || "";
            return link ? this.resolveImagePath(link) : this.showCover(this.item);
        },
        frameUrl() {
            const url = __imgPath + `avatar/images/${this.item.remark}/${this.item.remark}.svg`;
            return this.isAvatar && this.item.remark ? url : "";
        },
        asset() {
            return this.$store.state.mall.asset || {};
        },
        isVerify() {
            const { experience, cny, points, box_coin } = this.asset;
            const { exp_limit, price_cny, price_points, price_boxcoin, vip_limit } = this.item;
            if (this.showDetailLevel(experience) < this.showDetailLevel(exp_limit)) return true;
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
        // 已拥有
        isHad() {
            const item = this.data;
            return !!this.myVirtualItems.find(
                (v) =>
                    item.category === "virtual" &&
                    item.vip_limit === 1 &&
                    v.type === item.sub_category &&
                    v.val === item.remark
            );
        },
    },
    methods: {
        fly() {
            var eleBtn = document.getElementById(`btnCart_${this.item.id}`);
            var eleFlyItem = document.getElementById(`flyItem_${this.item.id}`);
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
        handleAddCart() {
            if (!User.isLogin()) {
                this.$message.error("请先登录");
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }
            if (!this.item.stock) return;
            this.addCart();
            // const cart = this.$store.state.mall.cart;
            // if (cart.length >= 15) {
            //     return this.$message({
            //         message: "购物车商品数量不能超过15个",
            //         type: "warning",
            //     });
            // }
            // this.$store.dispatch("mall/addCart", this.item);
        },
        addCart: throttle(function () {
            const num = this.$store.state.mall.cart?.find((item) => item.goods_id === this.item.id)?.amount || 0;
            if (1 + num > this.item.stock) {
                return this.$message({
                    type: "warning",
                    message: "可兑换库存不足",
                });
            }
            this.$store
                .dispatch("mall/addCart", {
                    id: this.item.id,
                    amount: 1,
                })
                .then((bol) => {
                    if (bol) {
                        this.fly();
                    }
                });
        }, 1000),
        allowShowBackground(item) {
            return item.sub_category === "palu" || item.sub_category === "skin";
        },
        getSkinBackgroundUrl(item) {
            switch (item.sub_category) {
                case "palu":
                    return __cdn + `design/decoration/${item.sub_category}/${item.remark}.png`;
                case "skin":
                    // 循环partmap 如果 item.title 是否包含部位名称  是的话返回部位名称对应的val
                    for (const key in this.skinPartMap) {
                        if (item.title.includes(key)) {
                            return __cdn + `design/decoration/images/${item.remark}/${this.skinPartMap[key]}.png`;
                        }
                    }
                    return "none";
                default:
                    return "none";
            }
        },
        resolveImagePath,
        showAvatarImg: function (val) {
            return showAvatar(val, 120 * 3);
        },
        showAvatar,
        showLevel(num) {
            let _key = 1;
            forEach(__userLevel, (item, key) => {
                if (num >= item[0] && num < item[1]) _key = key;
            });
            return _key;
        },
        // skip(id) {
        //     let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        //     sessionStorage.setItem("VIP_LIST_SCROLLTOP", scrollTop);

        //     const query = {}
        //     if (this.$route.query.search) {
        //         query.search = this.$route.query.search
        //     }
        //     this.$router.push({
        //         name: "detail",
        //         params: {
        //             id,
        //         },
        //         query,
        //     });
        // },
        showCover(item) {
            const img = item?.goods_images[0];
            return img && getThumbnail(img, 360);
        },
        showDetailLevel(num) {
            return User.getLevel(num);
        },
        isExpire(time) {
            return Date.parse(new Date()) < Date.parse(new Date(time));
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_item.less";
</style>
