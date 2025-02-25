<template>
    <el-dialog :visible="visible" @close="close" class="m-page-cart" width="60%" title="购物车">
        <div class="m-carts">
            <div class="m-cart-item">
                <el-checkbox v-model="isAll" class="u-check-all" @change="allChange">全选</el-checkbox>
                <el-button v-if="number" type="info" plain size="mini" icon="el-icon-delete" @click="handleClear"
                    >清空</el-button
                >
            </div>
            <div class="m-cart-item" v-for="item in list" :key="item.id">
                <div class="m-left">
                    <el-checkbox
                        :disabled="!item.can_buy"
                        v-model="item.checked"
                        @change="itemChecked(item.goods, $event)"
                    ></el-checkbox>
                    <div @click="toItem(item.goods)" class="m-info" :class="!item.can_buy ? 'is-disabled' : ''">
                        <img class="u-frame" :src="showCover(item.goods)" fit="contain" />
                        <div class="u-info">
                            <div class="u-title">
                                {{ item.goods.title }}
                            </div>
                            <div class="u-exchange">
                                <span>等级： Lv.{{ showLevel(item.goods.exp_limit) }}</span>
                                <span v-show="item.goods.vip_limit">仅会员</span>
                                <span v-show="item.goods.price_points">积分： {{ item.goods.price_points }}</span>
                                <span v-show="item.goods.price_boxcoin">盒币： {{ item.goods.price_boxcoin }}</span>
                                <span v-show="item.goods.price_cny">金箔： {{ item.goods.price_cny }}</span>
                            </div>
                            <div class="u-tip" v-if="!item.can_buy">{{ item.cannot_buy_reason }}</div>
                        </div>
                    </div>
                </div>
                <div class="u-amount">
                    <el-input-number
                        v-model="item.amount"
                        size="small"
                        :max="item.goods.stock"
                        @change="itemChange(item, $event)"
                    ></el-input-number>
                    <el-button
                        class="u-delete"
                        circle
                        size="small"
                        icon="el-icon-delete"
                        @click.stop="deleteGoods(item)"
                    ></el-button>
                </div>
            </div>
        </div>
        <div slot="footer" class="m-footer">
            <div class="m-info">
                <div class="u-total">
                    <div class="u-total-label">合计：</div>
                    <span class="u-total-item" v-show="all_price_points">
                        <i class="el-icon-sugar"></i>
                        <span class="u-total-value">积分</span>
                        <b>{{ all_price_points }}</b>
                    </span>
                    <span class="u-total-item" v-show="all_price_boxcoin">
                        <i class="el-icon-coin"></i>
                        <span class="u-total-value">盒币</span>
                        <b>{{ all_price_boxcoin }}</b>
                    </span>
                    <span class="u-total-item" v-show="all_price_cny">
                        <i class="el-icon-wallet"></i>
                        <span class="u-total-value">金箔</span>
                        <b>{{ all_price_cny }}</b>
                    </span>
                </div>
            </div>
            <div class="u-op">
                <el-button type="primary" :disabled="!readyNumber" @click="toBuy"
                    >去结算（{{ readyNumber }}）</el-button
                >
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { __userLevel, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { forEach, cloneDeep, throttle, debounce } from "lodash";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "GoodsCart",
    data: function () {
        return {
            list: [],
            isAll: true,
        };
    },
    computed: {
        cartVisible() {
            return this.$store.state.mall.cartVisible;
        },
        visible: {
            get() {
                return this.cartVisible;
            },
            set(value) {
                this.$store.commit("mall/SET_STATE", {
                    key: "cartVisible",
                    value: value,
                });
            },
        },
        cart() {
            return this.$store.state.mall.cart;
        },
        number() {
            return this.list
                .map((item) => item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
        checkedList() {
            return this.list.filter((item) => item.checked && item.can_buy);
        },
        readyNumber() {
            return this.checkedList
                .map((item) => item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
        all_price_points() {
            return this.checkedList
                .map((item) => item.goods.price_points * item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
        all_price_boxcoin() {
            return this.checkedList
                .map((item) => item.goods.price_boxcoin * item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
        all_price_cny() {
            return this.checkedList
                .map((item) => item.goods.price_cny * item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
    },
    watch: {
        cart: {
            immediate: true,
            deep: true,
            handler(cartList) {
                const cart = cloneDeep(cartList).map((item) => {
                    return {
                        ...item,
                        checked: Object.hasOwn(item, "checked") ? item.checked : !!item.can_buy,
                    };
                });
                this.isAll = cart.filter((item) => item.can_buy).every((item) => item.checked);
                this.list = cart;
            },
        },
    },
    methods: {
        close() {
            this.visible = false;
        },
        showCover(item) {
            const img = item?.goods_images[0];
            return getThumbnail(img, 48 * 2);
        },
        showLevel(num) {
            let _key = 1;
            forEach(__userLevel, (item, key) => {
                if (num >= item[0] && num < item[1]) _key = key;
            });
            return _key;
        },
        toItem(item) {
            this.$router.push({
                name: "mall_detail",
                params: {
                    id: item.id,
                },
            });
        },
        itemChange: debounce(function (item, val) {
            this.$store.dispatch("mall/updateGoodsNum", {
                shopping_item_id: item.id,
                amount: val,
            });
        }, 500),
        itemChecked(item, val) {
            item.checked = val;
            this.$store.commit("mall/SET_STATE", {
                key: "cart",
                value: this.list,
            });
            if (!val) {
                this.isAll = false;
            } else {
                this.isAll = this.list.every((item) => item.checked);
            }
        },
        allChange(val) {
            this.list = this.list.map((item) => {
                return {
                    ...item,
                    checked: val ? !!item.can_buy : val,
                };
            });
            this.$store.commit("mall/SET_STATE", {
                key: "cart",
                value: this.list,
            });
        },
        deleteGoods(item) {
            this.$store.dispatch("mall/deleteCartGoods", item.id);
        },
        toBuy() {
            if (this.readyNumber > 15) {
                return this.$message({
                    type: "warning",
                    message: "一次性提交商品数量不得超过15个",
                });
            }
            if (!User.isLogin()) {
                this.$message.error("请先登录");
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }

            this.$store.dispatch("mall/setCart", this.list).then(() => {
                this.close();

                this.$router.push({ name: "mall_batch_order" });
            });
        },
        handleClear() {
            this.$confirm("你确定要清空购物车吗？", "温馨提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$store.dispatch("mall/clearCart");
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_cart.less";
</style>
