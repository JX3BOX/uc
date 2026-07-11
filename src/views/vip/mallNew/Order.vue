<template>
    <div class="m-page-order">
        <div class="m-breadcrumb" v-if="windowWidth > 750">
            <span @click="goBack" class="u-back"><i class="el-icon-arrow-left"></i> {{ $t("vip.common.back") }}</span>
        </div>
        <div class="m-order-shell">
            <div class="m-order-header">
                <div>
                    <h1>{{ $t("vip.common.confirmExchange") }}</h1>
                    <p>{{ $t("vip.mall.orderReviewHint") }}</p>
                </div>
                <span class="u-order-tag">{{ $t("vip.mall.title") }}</span>
            </div>
            <div class="m-goods el-card">
                <div class="m-product">
                    <img v-if="previewImage" class="u-img" :src="previewImage" />
                    <div v-else class="u-img u-img-placeholder">{{ $t("vip.mall.noImage") }}</div>
                    <div class="m-product-info">
                        <span class="u-title">{{ item.title }}</span>
                        <div class="m-line">
                            <span class="u-span">{{ $t("vip.mall.exchangeQuantity", { count }) }}</span>
                            <span class="u-span">{{ item.postage ? $t("vip.mall.postageAmount", { amount: item.postage / 100 }) : $t("vip.mall.freeShipping") }}</span>
                        </div>
                    </div>
                </div>
                <div class="m-info">
                    <section class="m-order-section">
                        <div class="u-section-title">{{ $t("vip.mall.exchangeCost") }}</div>
                        <div class="m-cost-list">
                            <span v-show="item.price_cny" class="u-cost"
                                ><span>{{ $t("vip.mall.cny") }}</span><b>{{ item.price_cny * count }}</b></span
                            >
                            <span v-show="item.price_points" class="u-cost"
                                ><span>{{ $t("vip.common.points") }}</span><b>{{ item.price_points * count }}</b></span
                            >
                            <span v-show="item.price_boxcoin" class="u-cost"
                                ><span>{{ $t("vip.mall.boxcoin") }}</span><b>{{ item.price_boxcoin * count }}</b></span
                            >
                            <span v-if="!item.price_cny && !item.price_points && !item.price_boxcoin" class="u-cost"
                                ><span>{{ $t("vip.mall.cost") }}</span><b>{{ $t("vip.common.freeExchange") }}</b></span
                            >
                        </div>
                    </section>

                    <section class="m-order-section">
                        <div class="u-section-row">
                            <div class="u-section-title">{{ $t("vip.mall.shippingInfo") }}</div>
                            <div class="m-button" v-if="show_address">
                                <el-button type="primary" text @click="visible = true">{{ $t("vip.mall.switchAddress") }}</el-button>
                                <a class="u-address-link" href="/dashboard/address" target="_blank">{{ $t("vip.mall.manageAddress") }}</a>
                            </div>
                        </div>
                        <div class="m-address" v-if="show_address">
                            <template v-if="address && address.id">
                                <div class="u-my-address">
                                    <span class="u-name">{{ address.contact_name }} - {{ address.contact_phone }} </span>
                                    <span class="u-address">
                                        {{ address.province }}{{ address.city }}{{ address.area }}{{ address.address }}
                                    </span>
                                </div>
                            </template>
                            <a v-else class="u-empty-address" href="/dashboard/address" target="_blank">
                                {{ $t("vip.mall.addAddressHint") }}
                            </a>
                        </div>
                        <div class="u-no-address" v-else>{{ $t("vip.mall.virtualNoAddress") }}</div>
                    </section>

                    <section class="m-order-section">
                        <div class="u-section-title">{{ $t("vip.mall.remark") }}</div>
                        <el-input
                            v-model="remark"
                            :placeholder="$t('vip.mall.remarkPlaceholder')"
                            type="textarea"
                            :rows="3"
                        ></el-input>
                    </section>

                    <div class="m-order-footer">
                        <span class="u-submit-tip">
                            {{ $t("vip.mall.willExchange") }}
                            <span>{{ item.title }}</span>
                        </span>
                        <el-button class="u-button" type="primary" @click="toBuy">{{ $t("vip.mall.confirmOrder") }}</el-button>
                    </div>
                </div>
            </div>
        </div>
        <Address :visible="visible" @close="closeAddress" />
    </div>
</template>
<script>
import { __userLevel, __Root } from "@/utils/config";
import Address from "./components/address.vue";
import { forEach } from "lodash";
import { getItem } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "GoodsOrder",
    data: function () {
        return {
            active: null,
            remark: "",
            visible: false,
            item: {
                goods_images: [],
            },
        };
    },
    components: { Address },
    computed: {
        id() {
            return this.$route.params.id;
        },
        count() {
            return this.$route.params.count || 1;
        },
        previewImage() {
            return this.item.goods_images?.[0] || "";
        },
        pay_status() {
            return this.$store.state.mallNew.pay_status;
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
        needs_address() {
            return this.item.category !== "virtual";
        },
        show_address() {
            return this.needs_address || !!this.address?.id;
        },
        windowWidth() {
            return window.innerWidth;
        },
    },
    watch: {
        pay_status(val) {
            if (val) {
                this.$store.commit("mallNew/toState", { pay_status: false });
                this.$router.go(-1);
                const url = `${__Root}dashboard/mall`;
                window.open(url);
            }
        },
    },

    methods: {
        goBack() {
            // window.history.length ?
            this.$router.go(-1);
            // : this.$router.push('/mall');
        },
        load() {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            this.$store.dispatch("mallNew/getAddressList");
            this.$store.dispatch("mallNew/getMyAddress");
            if (this.id) this.getData();
        },
        showLevel(num) {
            let _key = 1;
            forEach(__userLevel, (item, key) => {
                if (num >= item[0] && num < item[1]) _key = key;
            });
            return _key;
        },
        toBuy() {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            const addressId = this.address?.id || 0;
            if (this.needs_address && !addressId) {
                return this.$message.warning(this.$t("vip.mall.selectAddress"));
            }
            this.$store
                .dispatch("mallNew/buyGoods", {
                    id: this.id,
                    count: this.count,
                    addressId,
                    remark: this.remark,
                })
                .catch((error) => handleMallExchangeError(this, error));
        },
        change(i) {
            this.active = i;
        },
        closeAddress() {
            this.visible = false;
        },
        getData() {
            getItem(this.id).then((res) => {
                this.item = res.data.data || {};
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_order.less";
</style>
