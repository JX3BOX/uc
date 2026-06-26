<template>
    <el-dialog v-model="isShow" :width="dialogWidth" :show-close="false" class="m-buy-confirm">
        <button class="close" type="button" aria-label="关闭" @click="isShow = false">
            <Close class="close-icon" />
        </button>
        <div class="content">
            <div class="header">
                <div class="title">确认兑换</div>
                <div class="desc">{{ needsAddress ? "确认收货信息后完成实物兑换" : "将从你的账户扣除以下资产" }}</div>
            </div>
            <div class="good-card">
                <div class="cover-wrap">
                    <img v-if="previewImage" :src="previewImage" :alt="item.title || '商品图片'" class="cover" />
                    <div v-else class="cover cover-null">暂无图片</div>
                </div>
                <div class="good-info">
                    <div class="good-title" :title="item.title">{{ item.title }}</div>
                    <div v-if="item.subtitle" class="good-subtitle" :title="item.subtitle">{{ item.subtitle }}</div>
                    <div class="meta-line">
                        <span>数量：{{ count }}件</span>
                        <span>{{ postageText }}</span>
                    </div>
                    <div class="cost-list">
                        <span v-if="item.price_boxcoin" class="cost">
                            <span class="cost-label">盒币</span>
                            <span class="price">{{ item.price_boxcoin * count }}</span>
                        </span>
                        <span v-if="item.price_points" class="cost">
                            <span class="cost-label">积分</span>
                            <span class="price">{{ item.price_points * count }}</span>
                        </span>
                        <span v-if="item.price_cny" class="cost">
                            <span class="cost-label">金箔</span>
                            <span class="price">{{ item.price_cny * count }}</span>
                        </span>
                        <span v-if="!confirmText" class="cost">
                            <span class="cost-label">消耗</span>
                            <span class="price">免费兑换</span>
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="needsAddress" class="shipping-card">
                <div class="section-head">
                    <span class="section-title">收货地址</span>
                    <div class="section-actions">
                        <a href="/dashboard/address" target="_blank" class="manage-address">
                            <Setting class="action-icon" />
                            管理地址
                        </a>
                        <button
                            class="refresh-address"
                            type="button"
                            title="刷新地址"
                            aria-label="刷新地址"
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
                                <span v-if="isDefaultAddress(selectedAddress)" class="default-tag">默认地址</span>
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
                        :title="addressExpanded ? '收起地址列表' : '展开地址列表'"
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
                                    <span v-if="isDefaultAddress(addressItem)" class="default-tag">默认地址</span>
                                </span>
                                <span class="address-detail">{{ formatAddress(addressItem) }}</span>
                            </span>
                        </button>
                    </div>
                </template>
                <a v-else class="address-empty" href="/dashboard/address" target="_blank">暂无收货地址，点击去添加</a>
            </div>
            <div class="remark-card">
                <div class="section-title">备注</div>
                <el-input v-model="remark" placeholder="可填写尺码、偏好或其他补充说明" type="textarea" :rows="2" />
            </div>
            <div class="tip">
                确认后将兑换<span class="em">{{ item.title }}</span>
            </div>
        </div>
        <div class="btn-box">
            <el-button class="cancel-btn" round @click="isShow = false">取消</el-button>
            <el-button class="confirm-btn" type="primary" round :loading="isSubmitting" @click="buyGoods">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { ArrowDown, CircleCheckFilled, Close, Refresh, Setting } from "@element-plus/icons-vue";
import { __Root } from "@/utils/config";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
export default {
    name: "BuyConfirm",
    components: {
        ArrowDown,
        CircleCheckFilled,
        Close,
        Refresh,
        Setting,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        count: {
            type: [Number, String],
            default: 1,
        },
    },
    data() {
        return {
            isShow: false,
            addressExpanded: false,
            addressLoading: false,
            isSubmitting: false,
            remark: "",
            selectedAddressId: 0,
        };
    },
    computed: {
        dialogWidth() {
            return this.needsAddress ? "560px" : "420px";
        },
        previewImage() {
            return this.item?.goods_images?.[0] || "";
        },
        needsAddress() {
            return this.item.category !== "virtual";
        },
        addressList() {
            return this.$store.state.mallNew.addressList || [];
        },
        defaultAddress() {
            const address = this.$store.state.mallNew.myAddress || {};
            if (address.id) {
                return address;
            }
            const addressList = this.addressList;
            return (
                addressList.find(
                    (item) => item?.is_default === true || item?.is_default === 1 || item?.is_default === "1"
                ) ||
                addressList[0] ||
                {}
            );
        },
        selectedAddress() {
            return this.addressList.find((item) => item.id === this.selectedAddressId) || this.defaultAddress || {};
        },
        alternativeAddressList() {
            return this.addressList.filter((item) => item.id !== this.selectedAddress?.id);
        },
        postageText() {
            return this.item.postage ? `邮费：${this.item.postage / 100}元` : "邮费：包邮";
        },
        confirmText() {
            if (this.item.price_points && this.item.price_boxcoin) {
                return `${this.item.price_boxcoin}盒币和${this.item.price_points}积分`;
            }
            if (this.item.price_cny) {
                return `${this.item.price_cny}金箔`;
            }
            if (this.item.price_points) {
                return `${this.item.price_points}积分`;
            }
            if (this.item.price_boxcoin) {
                return `${this.item.price_boxcoin}盒币`;
            }
            return "";
        },
    },
    watch: {
        isShow(val) {
            if (val && this.needsAddress) {
                this.loadAddress();
            }
            if (!val) {
                this.addressExpanded = false;
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
        loadAddress() {
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
        },
        isDefaultAddress(address) {
            return address?.id && address.id === this.defaultAddress?.id;
        },
        formatAddress(address = {}) {
            return `${address.province || ""}${address.city || ""}${address.area || ""}${address.address || ""}`;
        },
        buyGoods() {
            if (this.isSubmitting) return;
            if (!User.isLogin()) {
                return User.toLogin();
            }
            const { category, is_virtual, id } = this.item;
            if (is_virtual && category == "virtual") {
                this.isShow = false;
                return this.$store
                    .dispatch("mallNew/buyGoods", {
                        id,
                        count: 1,
                        addressId: 0,
                        remark: "虚拟商品购买",
                    })
                    .then(() => {
                        this.$store.commit("mallNew/toState", { pay_status: false });
                        this.$emit("exchanged", {
                            id,
                            item: this.item,
                        });
                        this.$confirm("兑换成功，是否立即前往装扮？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                const url = `${__Root}dashboard/frame`;
                                window.open(url);
                            })
                            .catch(() => {});
                    })
                    .catch((error) => handleMallExchangeError(this, error));
            }

            const addressId = this.selectedAddress?.id || 0;
            if (this.needsAddress && !addressId) {
                return this.$message.warning("请选择收货地址");
            }
            this.isSubmitting = true;
            this.$store
                .dispatch("mallNew/buyGoods", {
                    id,
                    count: this.count,
                    addressId,
                    remark: this.remark,
                })
                .then(() => {
                    this.$store.commit("mallNew/toState", { pay_status: false });
                    this.isShow = false;
                    this.$emit("exchanged", {
                        id,
                        item: this.item,
                    });
                    this.$confirm("兑换成功，是否查看订单记录？", "提示", {
                        confirmButtonText: "查看订单",
                        cancelButtonText: "留在商城",
                        type: "success",
                    })
                        .then(() => {
                            window.open(`${__Root}dashboard/mall`);
                        })
                        .catch(() => {});
                })
                .catch((error) => handleMallExchangeError(this, error))
                .finally(() => {
                    this.isSubmitting = false;
                });
        },
    },
};
</script>

<style lang="less">
.m-buy-confirm {
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

        .cover-wrap {
            position: relative;
            flex: none;
            width: 92px;
            height: 92px;
            border-radius: 10px;
            overflow: hidden;
            background: rgba(36, 41, 46, 0.08);
            box-shadow:
                0 8px 22px rgba(36, 41, 46, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);

            &::after {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent 48%);
                pointer-events: none;
            }
        }

        .cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .cover-null {
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(36, 41, 46, 0.48);
            font-size: 12px;
            font-weight: 600;
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

        .tip {
            max-width: 100%;
            font-size: 13px;
            line-height: 20px;
            color: rgba(36, 41, 46, 0.68);
            text-align: center;
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

            .el-button {
                min-height: 0;
                height: auto;
                padding: 0;
                font-size: 12px;
                font-weight: 700;
            }
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
                animation: buy-confirm-refresh 0.8s linear infinite;
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
                background 0.18s ease,
                box-shadow 0.18s ease;

            &:hover {
                border-color: rgba(64, 128, 255, 0.2);
                background: rgba(248, 250, 255, 0.92);
            }

            .address-detail {
                margin-top: 0;
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
}

@keyframes buy-confirm-refresh {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media screen and (max-width: 750px) {
    .m-buy-confirm {
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

            .cover-wrap {
                width: 5rem;
                height: 5rem;
            }

            .good-title {
                font-size: 0.9rem;
                line-height: 1.25rem;
            }

            .cost {
                margin-top: 0.625rem;
            }

            .section-head {
                align-items: flex-start;
                flex-direction: column;
                gap: 0.5rem;
            }
        }

        .btn-box {
            margin-top: 1.125rem;

            .el-button {
                width: 6rem;
                height: 2.25rem;
            }
        }
    }
}
</style>
