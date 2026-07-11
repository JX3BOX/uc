<template>
    <el-dialog v-model="isShow" :show-close="false" class="m-cart-confirm">
        <div class="content">
            <div class="title">{{ $t("vip.mall.cartCheckout") }}</div>
            <i18n-t keypath="vip.mall.cartConfirmMessage" tag="div" class="text">
                <template #boxcoin>
                    <span class="price boxcoin">{{ $t("vip.common.boxcoinAmount", { amount: $store.getters["mallNew/all_price_boxcoin"] || 0 }) }}</span>
                </template>
                <template #points>
                    <span class="price points">{{ $t("vip.common.pointsAmount", { amount: $store.getters["mallNew/all_price_points"] || 0 }) }}</span>
                </template>
                <template #products>
                    <span class="prrice">{{ $t("vip.mall.productsCount", { count: $store.getters["mallNew/checked_num"] || 0 }) }}</span>
                </template>
            </i18n-t>
        </div>
        <div class="btn-box">
            <el-button round @click="isShow = false" style="width: 20.5333vw; font-size: 3.2vw">{{ $t("vip.mall.thinkAgain") }}</el-button>
            <el-button
                round
                @click="buyGoods"
                style="width: 20.5333vw; font-size: 3.2vw; background-color: rgba(255, 163, 43, 1); color: #fff"
                >{{ $t("vip.common.confirm") }}</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: "CartConfirm",
    data() {
        return {
            isShow: false,
        };
    },
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        buyGoods() {
            if (!this.$store.getters["mallNew/checked_num"]) {
                return this.$message.warning(this.$t("vip.mall.selectCheckoutProducts"));
            }
            this.isShow = false;
            this.$router.push({ name: "mall_batch_order_web" });
        },
    },
};
</script>

<style scoped lang="less">
 :deep(.m-cart-confirm) {
    width: 90%;
    .el-dialog__header {
        padding: 0;
    }
    .el-dialog__body {
        width: 100%;
        box-sizing: border-box;
        padding: 7.4667vw;
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 2.6667vw;
        font-size: 3.2vw;
        color: rgba(56, 56, 56, 1);
        .price {
            margin: 0 1.0667vw;
            font-weight: 700;
            .num {
                color: rgba(255, 163, 43, 1);
            }
            &.boxcoin {
                color: rgba(64, 128, 255, 1);
            }
            &.points {
                color: rgba(116, 120, 237, 1);
            }
        }
    }
    .btn-box {
        display: flex;
        justify-content: center;
        gap: 2.6667vw;
        margin-top: 5.6vw;
    }
}
</style>
