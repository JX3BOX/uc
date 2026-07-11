<template>
    <div class="m-page-order">
        <div class="m-batch-back" v-if="windowWidth > 750">
            <button type="button" @click="goBack">
                <ArrowLeft class="back-icon" />
                {{ $t("vip.common.back") }}
            </button>
        </div>
        <el-dialog
            v-model="isShow"
            :width="dialogWidth"
            :show-close="false"
            class="m-buy-confirm m-batch-confirm"
            @closed="handleClosed"
        >
            <button class="close" type="button" :aria-label="$t('vip.common.close')" @click="goBack">
                <Close class="close-icon" />
            </button>
            <div class="content">
                <div class="header">
                    <div class="title">{{ $t("vip.common.confirmExchange") }}</div>
                    <div class="desc">{{ needs_address ? $t("vip.mall.confirmPhysical") : $t("vip.mall.deductAssets") }}</div>
                </div>
                <div class="good-card batch-good-card">
                    <div class="cover-stack">
                        <template v-if="previewItems.length">
                            <img
                                v-for="item in previewItems"
                                :key="item.id"
                                :src="normalizeMallImage(item.goods?.goods_images?.[0])"
                                :alt="item.goods?.title || $t('vip.mall.productImage')"
                                class="cover"
                            />
                        </template>
                        <div v-else class="cover cover-null">{{ $t("vip.mall.none") }}</div>
                    </div>
                    <div class="good-info">
                        <div class="good-title">{{ $t("vip.mall.batchExchange") }}</div>
                        <div class="good-subtitle">
                            {{ $t("vip.mall.batchSelected", { types: checkedList.length, count: readyNumber }) }}
                        </div>
                        <div class="meta-line">
                            <span>{{ needs_address ? $t("vip.mall.containsPhysical") : $t("vip.mall.virtualNoAddress") }}</span>
                        </div>
                        <div class="cost-list">
                            <span v-if="all_price_boxcoin" class="cost">
                                <span class="cost-label">{{ $t("vip.mall.boxcoin") }}</span>
                                <span class="price">{{ all_price_boxcoin }}</span>
                            </span>
                            <span v-if="all_price_points" class="cost">
                                <span class="cost-label">{{ $t("vip.common.points") }}</span>
                                <span class="price">{{ all_price_points }}</span>
                            </span>
                            <span v-if="all_price_cny" class="cost">
                                <span class="cost-label">{{ $t("vip.mall.cny") }}</span>
                                <span class="price">{{ all_price_cny }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="needs_address" class="shipping-card">
                    <div class="section-head">
                        <span class="section-title">{{ $t("vip.mall.shippingAddress") }}</span>
                        <div class="section-actions">
                            <a href="/dashboard/address" target="_blank" class="manage-address">
                                <Setting class="action-icon" />
                                {{ $t("vip.mall.manageAddress") }}
                            </a>
                            <button
                                class="refresh-address"
                                type="button"
                                :title="$t('vip.mall.refreshAddress')"
                                :aria-label="$t('vip.mall.refreshAddress')"
                                :class="{ loading: addressLoading }"
                                @click="refreshAddress"
                            >
                                <Refresh class="action-icon" />
                            </button>
                        </div>
                    </div>
                    <template v-if="selectedAddress && selectedAddress.id">
                        <div class="address-info">
                            <div class="address-main">
                                <div class="address-contact">
                                    {{ selectedAddress.contact_name }} - {{ selectedAddress.contact_phone }}
                                    <span v-if="isDefaultAddress(selectedAddress)" class="default-tag">{{ $t("vip.mall.defaultAddress") }}</span>
                                </div>
                                <div class="address-detail">
                                    {{ formatAddress(selectedAddress) }}
                                </div>
                            </div>
                            <CircleCheckFilled class="selected-icon" />
                        </div>
                        <button
                            v-if="alternativeAddressList.length"
                            class="address-expand"
                            type="button"
                            :title="addressExpanded ? $t('vip.mall.collapseAddresses') : $t('vip.mall.expandAddresses')"
                            @click="addressExpanded = !addressExpanded"
                        >
                            <ArrowDown class="expand-icon" :class="{ expanded: addressExpanded }" />
                        </button>
                        <div v-if="addressExpanded && alternativeAddressList.length" class="address-list">
                            <button
                                v-for="addressItem in alternativeAddressList"
                                :key="addressItem.id"
                                type="button"
                                class="address-option"
                                @click="selectAddress(addressItem)"
                            >
                                <span class="address-option-main">
                                    <span class="address-contact">
                                        {{ addressItem.contact_name }} - {{ addressItem.contact_phone }}
                                        <span v-if="isDefaultAddress(addressItem)" class="default-tag">{{ $t("vip.mall.defaultAddress") }}</span>
                                    </span>
                                    <span class="address-detail">{{ formatAddress(addressItem) }}</span>
                                </span>
                            </button>
                        </div>
                    </template>
                    <a v-else class="address-empty" href="/dashboard/address" target="_blank">{{ $t("vip.mall.addAddressHint") }}</a>
                </div>
                <div v-else class="shipping-card no-address-card">
                    <div class="section-title">{{ $t("vip.mall.shippingAddress") }}</div>
                    <div class="address-empty-static">{{ $t("vip.mall.virtualNoAddressLong") }}</div>
                </div>
                <div class="remark-card">
                    <div class="section-title">{{ $t("vip.mall.remark") }}</div>
                    <el-input v-model="remark" :placeholder="$t('vip.mall.remarkPlaceholder')" type="textarea" :rows="2" />
                </div>
                <i18n-t keypath="vip.mall.willExchangeTypes" tag="div" class="tip">
                    <template #types><span class="em">{{ $t("vip.mall.productTypes", { count: checkedList.length }) }}</span></template>
                </i18n-t>
            </div>
            <div class="btn-box">
                <el-button class="cancel-btn" round @click="goBack">{{ $t("vip.common.cancel") }}</el-button>
                <el-button class="confirm-btn" type="primary" round :loading="loading" :disabled="!ready" @click="toBuy">
                    {{ $t("vip.mall.payOrder") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { __Root } from "@/utils/config";
import { batchMakeOrder, batchPayOrder } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
import { normalizeMallImage } from "@/utils/mallImage";
import User from "@jx3box/jx3box-common/js/user";
import { ArrowDown, ArrowLeft, CircleCheckFilled, Close, Refresh, Setting } from "@element-plus/icons-vue";
export default {
    name: "BatchOrder",
    props: {
        embedded: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ArrowDown,
        ArrowLeft,
        CircleCheckFilled,
        Close,
        Refresh,
        Setting,
    },
    data: function () {
        return {
            remark: "",
            isShow: true,
            loading: false,
            addressExpanded: false,
            addressLoading: false,
            selectedAddressId: 0,
        };
    },
    computed: {
        dialogWidth() {
            return this.needs_address ? "560px" : "460px";
        },
        windowWidth() {
            return window.innerWidth;
        },
        cart() {
            return this.$store.state.mallNew.cart;
        },
        readyNumber() {
            return this.checkedList
                .map((item) => item.amount)
                .reduce((prev, cur) => {
                    return prev + cur;
                }, 0);
        },
        previewItems() {
            return this.checkedList.filter((item) => item.goods?.goods_images?.[0]).slice(0, 3);
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
            return this.selectedAddress;
        },
        addressList() {
            return this.$store.state.mallNew.addressList || [];
        },
        defaultAddress() {
            const address = this.$store.state.mallNew.myAddress || {};
            if (address.id) return address;
            return (
                this.addressList.find(
                    (item) => item?.is_default === true || item?.is_default === 1 || item?.is_default === "1"
                ) ||
                this.addressList[0] ||
                {}
            );
        },
        selectedAddress() {
            return this.addressList.find((item) => item.id === this.selectedAddressId) || this.defaultAddress || {};
        },
        alternativeAddressList() {
            return this.addressList.filter((item) => item.id !== this.selectedAddress?.id);
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
    watch: {
        needs_address(val) {
            if (val && User.isLogin()) {
                this.loadAddress();
            }
        },
        defaultAddress: {
            handler(val) {
                if (!this.selectedAddressId && val?.id) {
                    this.selectedAddressId = val.id;
                }
            },
            immediate: true,
        },
    },
    methods: {
        normalizeMallImage,
        goBack() {
            if (this.embedded) {
                this.isShow = false;
                this.$store.dispatch("mallNew/changeBatchConfirmIsShow", false);
                return;
            }
            this.$router.go(-1);
        },
        loadAddress() {
            if (!this.needs_address) return Promise.resolve();
            this.addressLoading = true;
            return Promise.all([
                this.$store.dispatch("mallNew/getAddressList"),
                this.$store.dispatch("mallNew/getMyAddress"),
            ])
                .then(() => {
                    this.syncSelectedAddress();
                })
                .finally(() => {
                    this.addressLoading = false;
                });
        },
        refreshAddress() {
            this.loadAddress();
        },
        syncSelectedAddress() {
            const exists = this.addressList.some((item) => item.id === this.selectedAddressId);
            if (!exists) {
                this.selectedAddressId = this.defaultAddress?.id || 0;
            }
        },
        selectAddress(address) {
            this.selectedAddressId = address?.id || 0;
            this.addressExpanded = false;
        },
        isDefaultAddress(address) {
            return address?.id && address.id === this.defaultAddress?.id;
        },
        handleClosed() {
            if (this.embedded) {
                this.$store.dispatch("mallNew/changeBatchConfirmIsShow", false);
            }
        },
        formatAddress(address = {}) {
            return `${address.province || ""}${address.city || ""}${address.area || ""}${address.address || ""}`;
        },
        toBuy() {
            if (this.loading) return;
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.checkedList.length) {
                return this.$message.warning(this.$t("vip.mall.selectCheckoutProducts"));
            }
            if (this.needs_address && !this.address.id) {
                return this.$message.warning(this.$t("vip.mall.selectAddress"));
            }
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
                    return batchPayOrder({
                        order_id,
                    }).then(() => {
                        this.$message({
                            type: "success",
                            message: this.$t("vip.mall.orderSuccess"),
                        });
                        this.$store.dispatch("mallNew/getCart");
                        if (this.embedded) {
                            this.goBack();
                            this.$confirm(this.$t("vip.mall.orderSuccessPrompt"), this.$t("vip.common.prompt"), {
                                confirmButtonText: this.$t("vip.mall.viewOrders"),
                                cancelButtonText: this.$t("vip.mall.stayInStore"),
                                type: "success",
                            })
                                .then(() => {
                                    window.open(`${__Root}dashboard/mall`);
                                })
                                .catch(() => {});
                            return;
                        }
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t("vip.mall.redirecting"),
                        });
                        setTimeout(() => {
                            loading.close();
                            this.goBack();
                            window.open(location.origin + "/dashboard/mall");
                        }, 2000);
                    });
                })
                .catch((error) => handleMallExchangeError(this, error))
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    created() {
        if (!User.isLogin()) {
            User.toLogin();
        }
    },
    mounted() {
        if (User.isLogin()) this.loadAddress();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_order.less";

.m-batch-back {
    display: flex;
    justify-content: center;
    padding-top: 44px;

    button {
        border: 0;
        background: transparent;
        color: rgba(93, 99, 110, 0.78);
        font-size: 14px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;

        &:hover {
            color: rgba(255, 141, 26, 1);
        }
    }

    .back-icon {
        width: 16px;
        height: 16px;
    }
}

.m-batch-confirm {
    &.el-dialog {
        position: relative;
        padding: 0;
        border-radius: 14px;
        overflow: hidden;
        background:
            radial-gradient(circle at 50% 0%, rgba(64, 128, 255, 0.08), transparent 34%),
            #fff;
        box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22);
    }

    .el-dialog__header {
        padding: 0;
    }

    .el-dialog__body {
        padding: 30px 34px 32px;
    }

    .close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 50%;
        background: rgba(36, 41, 46, 0.06);
        color: rgba(36, 41, 46, 0.56);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            background 0.18s ease,
            color 0.18s ease;

        &:hover {
            background: rgba(36, 41, 46, 0.1);
            color: rgba(36, 41, 46, 0.82);
        }

        .close-icon {
            width: 16px;
            height: 16px;
        }
    }

    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 18px;
        color: rgba(36, 41, 46, 1);

        .header {
            text-align: center;

            .title {
                font-size: 20px;
                line-height: 28px;
                font-weight: 800;
                color: rgba(36, 41, 46, 1);
            }

            .desc {
                margin-top: 4px;
                font-size: 12px;
                line-height: 18px;
                color: rgba(36, 41, 46, 0.56);
            }
        }

        .good-card {
            width: 100%;
            box-sizing: border-box;
            border-radius: 12px;
            padding: 12px;
            background:
                linear-gradient(180deg, rgba(248, 250, 255, 0.92), rgba(244, 247, 252, 0.92)),
                rgba(64, 128, 255, 0.05);
            border: 1px solid rgba(64, 128, 255, 0.12);
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .good-info {
            flex: 1;
            min-width: 0;
        }

        .good-title {
            max-width: 100%;
            font-size: 16px;
            line-height: 22px;
            font-weight: 800;
            color: rgba(36, 41, 46, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .good-subtitle {
            margin-top: 4px;
            max-width: 100%;
            font-size: 12px;
            line-height: 18px;
            color: rgba(36, 41, 46, 0.54);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .meta-line {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 14px;
            margin-top: 8px;
            font-size: 12px;
            line-height: 18px;
            color: rgba(36, 41, 46, 0.56);
        }

        .cost-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }

        .cost {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 28px;
            padding: 0 10px;
            border-radius: 999px;
            background: rgba(64, 128, 255, 0.1);
            border: 1px solid rgba(64, 128, 255, 0.16);
        }

        .cost-label {
            font-size: 12px;
            color: rgba(36, 41, 46, 0.58);
        }

        .price {
            margin: 0;
            font-size: 13px;
            font-weight: 700;
            color: rgba(64, 128, 255, 1);
        }

        .shipping-card,
        .remark-card {
            width: 100%;
            box-sizing: border-box;
            border-radius: 12px;
            padding: 14px;
            background: #fff;
            border: 1px solid rgba(36, 41, 46, 0.1);
            box-shadow: 0 8px 22px rgba(36, 41, 46, 0.06);
        }

        .section-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }

        .section-title {
            font-size: 13px;
            line-height: 18px;
            font-weight: 800;
            color: rgba(36, 41, 46, 0.86);
        }

        .section-actions {
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .manage-address {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            line-height: 18px;
            font-weight: 700;
            color: rgba(255, 171, 0, 1);

            &:hover {
                color: rgba(239, 128, 0, 1);
            }
        }

        .refresh-address {
            width: 24px;
            height: 24px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            background: rgba(36, 41, 46, 0.06);
            color: rgba(36, 41, 46, 0.58);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition:
                background 0.18s ease,
                color 0.18s ease;

            &:hover {
                background: rgba(64, 128, 255, 0.1);
                color: rgba(64, 128, 255, 1);
            }

            &.loading .action-icon {
                animation: batch-confirm-refresh 0.8s linear infinite;
            }
        }

        .action-icon {
            width: 14px;
            height: 14px;
        }

        .address-info {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-radius: 10px;
            padding: 14px 16px;
            background: linear-gradient(180deg, rgba(248, 250, 255, 0.94), rgba(252, 253, 255, 0.94));
            border: 1px solid rgba(64, 128, 255, 0.18);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
        }

        .address-main,
        .address-option-main {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .address-contact {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            font-size: 14px;
            line-height: 20px;
            font-weight: 800;
            color: rgba(36, 41, 46, 0.9);
        }

        .default-tag {
            padding: 2px 6px;
            border-radius: 999px;
            background: rgba(34, 197, 94, 0.09);
            color: rgba(21, 128, 61, 1);
            font-size: 11px;
            line-height: 16px;
            font-weight: 800;
        }

        .address-detail {
            margin-top: 0;
            font-size: 13px;
            line-height: 20px;
            color: rgba(36, 41, 46, 0.66);
        }

        .selected-icon {
            flex: none;
            width: 24px;
            height: 24px;
            color: rgba(34, 197, 94, 1);
        }

        .address-expand {
            width: 34px;
            height: 22px;
            margin: -1px auto 0;
            border: 1px solid rgba(36, 41, 46, 0.08);
            border-top: 0;
            border-radius: 0 0 999px 999px;
            background: #fff;
            color: rgba(36, 41, 46, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 6px 12px rgba(36, 41, 46, 0.04);
            transition:
                color 0.18s ease,
                border-color 0.18s ease,
                background 0.18s ease;

            &:hover {
                border-color: rgba(64, 128, 255, 0.18);
                background: rgba(248, 250, 255, 1);
                color: rgba(64, 128, 255, 1);
            }
        }

        .expand-icon {
            width: 15px;
            height: 15px;
            transition: transform 0.18s ease;

            &.expanded {
                transform: rotate(180deg);
            }
        }

        .address-list {
            max-height: 168px;
            overflow-y: auto;
            margin-top: 10px;
            padding: 8px;
            border-radius: 10px;
            border: 1px solid rgba(36, 41, 46, 0.08);
            background: rgba(248, 250, 252, 0.72);
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .address-option {
            width: 100%;
            box-sizing: border-box;
            padding: 11px 12px;
            border: 1px solid rgba(36, 41, 46, 0.08);
            border-radius: 9px;
            background: #fff;
            color: inherit;
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            cursor: pointer;
            transition:
                border-color 0.18s ease,
                background 0.18s ease;

            &:hover {
                border-color: rgba(64, 128, 255, 0.2);
                background: rgba(248, 250, 255, 0.92);
            }
        }

        .address-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 72px;
            border-radius: 10px;
            border: 1px dashed rgba(64, 128, 255, 0.28);
            background: rgba(64, 128, 255, 0.04);
            color: rgba(64, 128, 255, 0.92);
            font-size: 13px;
            font-weight: 700;
        }

        .remark-card {
            .section-title {
                margin-bottom: 10px;
            }

            .el-textarea__inner {
                border-radius: 10px;
                border-color: rgba(36, 41, 46, 0.12);
                background: rgba(248, 250, 252, 0.72);
                box-shadow: none;
                font-size: 13px;
                line-height: 20px;

                &:focus {
                    border-color: rgba(64, 128, 255, 0.45);
                    background: #fff;
                }
            }
        }

        .tip {
            max-width: 100%;
            font-size: 13px;
            line-height: 20px;
            color: rgba(36, 41, 46, 0.68);
            text-align: center;
        }

        .em {
            margin: 0 4px;
            font-weight: 700;
            color: rgba(36, 41, 46, 0.92);
        }
    }

    .btn-box {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 24px;

        .el-button {
            width: 96px;
            height: 36px;
            font-size: 13px;
            font-weight: 700;
            transition:
                background 0.18s ease,
                border-color 0.18s ease,
                box-shadow 0.18s ease,
                transform 0.18s ease;
        }

        .cancel-btn {
            border-color: rgba(36, 41, 46, 0.12);
            color: rgba(36, 41, 46, 0.66);
            background: #fff;

            &:hover {
                border-color: rgba(64, 128, 255, 0.24);
                color: rgba(64, 128, 255, 1);
                background: rgba(64, 128, 255, 0.04);
            }
        }

        .confirm-btn {
            border: 0;
            background: linear-gradient(180deg, rgba(86, 92, 238, 1) 0%, rgba(76, 70, 230, 1) 100%);
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.16),
                0 8px 18px rgba(80, 72, 232, 0.22);

            &:hover {
                background: linear-gradient(180deg, rgba(98, 104, 246, 1) 0%, rgba(82, 76, 236, 1) 100%);
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.22),
                    0 10px 22px rgba(80, 72, 232, 0.28);
            }

            &:active {
                transform: translateY(1px);
            }
        }
    }

    .batch-good-card {
        align-items: center;
    }

    .cover-stack {
        position: relative;
        flex: none;
        width: 72px;
        height: 72px;

        .cover {
            position: absolute;
            width: 52px;
            height: 52px;
            border-radius: 14px;
            object-fit: cover;
            background: rgba(36, 41, 46, 0.08);
            border: 2px solid #fff;
            box-shadow: 0 8px 18px rgba(9, 17, 30, 0.12);

            &:nth-child(1) {
                left: 0;
                top: 10px;
                z-index: 3;
            }

            &:nth-child(2) {
                left: 12px;
                top: 4px;
                z-index: 2;
            }

            &:nth-child(3) {
                left: 24px;
                top: 16px;
                z-index: 1;
            }
        }

        .cover-null {
            left: 10px;
            top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(93, 99, 110, 0.58);
            font-size: 12px;
        }
    }

    .no-address-card {
        gap: 8px;
    }

    .address-empty-static {
        border-radius: 10px;
        padding: 12px;
        background: rgba(36, 41, 46, 0.04);
        color: rgba(93, 99, 110, 0.72);
        font-size: 13px;
        line-height: 18px;
    }
}

@keyframes batch-confirm-refresh {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media screen and (max-width: 750px) {
    .m-batch-confirm {
        &.el-dialog {
            width: calc(100vw - 2rem) !important;
            max-width: 420px;
        }

        .el-dialog__body {
            padding: 1.5rem 1rem 1.25rem;
        }

        .content {
            gap: 0.875rem;

            .good-card {
                padding: 0.75rem;
                gap: 0.75rem;
            }

            .section-head {
                align-items: flex-start;
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    }
}
</style>
