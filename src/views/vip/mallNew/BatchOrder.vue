<template>
    <div class="m-page-order">
        <div class="m-breadcrumb" v-if="windowWidth > 750">
            <span @click="goBack" class="u-back"><i class="el-icon-arrow-left"></i> 返回</span>
        </div>
        <div class="m-goods el-card">
            <div class="m-info">
                <div class="m-order-step">
                    <el-divider content-position="left">1. 兑换消耗</el-divider>
                    <!-- <span class="u-coin"
                        >数量:<b>{{ readyNumber }}</b></span
                    > -->
                    <span class="u-coin" v-show="all_price_points"
                        >积分:<b>{{ all_price_points }}</b></span
                    >
                    <span class="u-coin" v-show="all_price_boxcoin"
                        >盒币:<b>{{ all_price_boxcoin }}</b></span
                    >
                    <span class="u-coin" v-show="all_price_cny"
                        >金箔:<b>{{ all_price_cny }}</b></span
                    >
                </div>

                <div class="m-order-step">
                    <el-divider content-position="left">2. 选择地址</el-divider>
                    <div class="m-address" v-if="show_address">
                        <div class="m-button">
                            <el-button plain type="primary" icon="Sort" @click="visible = true">选择地址</el-button>
                            <a class="el-button is-plain" href="/dashboard/address" target="_blank"
                                ><i class="el-icon-setting"></i> 管理地址</a
                            >
                        </div>
                        <template v-if="address && address.id">
                            <div class="u-my-address">
                                <span class="u-label"><i class="el-icon-s-home"></i> 收货地址</span>
                                <div class="u-addr">
                                    <span class="u-name"
                                        >{{ address.contact_name }} - {{ address.contact_phone }}
                                    </span>
                                    <span class="u-address">
                                        - {{ address.province }}{{ address.city }}{{ address.area
                                        }}{{ address.address }}
                                    </span>
                                </div>
                            </div>
                        </template>
                        <div v-else><el-button type="success" icon="Plus">添加地址</el-button></div>
                    </div>
                    <div class="u-no-address" v-else>虚拟物品无需地址</div>
                </div>

                <div class="m-order-step">
                    <el-divider content-position="left">3. 备注</el-divider>
                    <el-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>
                </div>

                <div class="m-op">
                    <el-button class="u-buy" type="primary" :loading="loading" @click="toBuy" :disabled="!ready"
                        >支付订单</el-button
                    >
                </div>
            </div>
        </div>
        <Address :visible="visible" @close="closeAddress" />
    </div>
</template>
<script>
import { __userLevel, __Root } from "@/utils/config";
import Address from "./components/address.vue";
import { batchMakeOrder, batchPayOrder } from "@/service/vip/mall";
export default {
    name: "BatchOrder",
    data: function () {
        return {
            remark: "",
            visible: false,
            loading: false,
        };
    },
    components: { Address },
    computed: {
        windowWidth() {
            return window.innerWidth;
        },
        cart() {
            if (this.$store.state.mallNew.cart.length === 0) {
                this.$store.dispatch("mallNew/getCart");
            }
            return this.$store.state.mallNew.cart;
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
        show_address() {
            return this.needs_address || !!this.address?.id;
        },
        needs_address() {
            return this.checkedList.some((item) => item.goods?.category !== "virtual");
        },
        address() {
            const address = this.$store.state.mallNew.myAddress || {};
            if (address.id) return address;
            const addressList = this.$store.state.mallNew.addressList || [];
            return (
                addressList.find(
                    (item) => item?.is_default === true || item?.is_default === 1 || item?.is_default === "1"
                ) ||
                addressList[0] ||
                {}
            );
        },
        asset() {
            return this.$store.state.mallNew.asset || {};
        },
        ready() {
            const hasAddress = !!this.address?.id;
            return (
                this.checkedList.length > 0 &&
                (!this.show_address || hasAddress) &&
                this.asset.box_coin >= this.all_price_boxcoin &&
                this.asset.points >= this.all_price_points &&
                this.asset.cny >= this.all_price_cny
            );
        },
        checkedList() {
            return this.cart.filter((item) => {
                if (item.checked === undefined) {
                    return item.can_buy;
                }
                return item.checked && item.can_buy;
            });
        },
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        toBuy() {
            if (!this.checkedList.length) {
                return this.$message.warning("请先选择要结算的商品");
            }
            if (this.needs_address && !this.address.id) {
                return this.$message.warning("请选择收货地址");
            }
            this.$alert("你确定支付该订单吗？如需取消可前往个人中心-订单中心处理。", "支付确认", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        const data = {
                            remark: this.remark,
                            shopping_car_item_ids: this.checkedList.map((item) => item.id),
                        };
                        if (this.address?.id) {
                            data.addr_id = this.address.id;
                        }
                        this.loading = true;
                        batchMakeOrder(data)
                            .then((res) => {
                                const orderList = res.data?.data?.order_list || [];
                                const order_id = orderList.map((item) => item.id);
                                batchPayOrder({
                                    order_id,
                                }).then(() => {
                                    this.$message({
                                        type: "success",
                                        message: "下单成功",
                                    });
                                    this.$store.dispatch("mallNew/getCart");
                                    const loading = this.$loading({
                                        lock: true,
                                        text: "跳转中...",
                                    });
                                    setTimeout(() => {
                                        loading.close();
                                        this.goBack();
                                        window.open(location.origin + "/dashboard/mall");
                                    }, 2000);
                                });
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    }
                },
            });
        },
        closeAddress() {
            this.visible = false;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_order.less";
</style>
