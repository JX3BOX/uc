<template>
    <el-dialog v-model="isShow" width="85%" :show-close="false" class="m-buy-confirm">
        <div class="content">
            <img
                :src="item?.goods_images?.[0] ? normalizeMallImage(item.goods_images[0]) : require('@/assets/img/publish/logo.svg')"
                style="width: 32vw; height: 32vw"
            />
            <i18n-t keypath="vip.mall.buyConfirmMessage" tag="div" class="text">
                <template #cost><span class="price">{{ confirmText }}</span></template>
                <template #product><span class="title">{{ item.title }}</span></template>
            </i18n-t>
        </div>
        <div class="btn-box">
            <el-button round @click.stop="isShow = false" style="width: 20.5333vw; font-size: 3.2vw">{{ $t("vip.common.cancel") }}</el-button>
            <el-button type="primary" round @click.stop="buyGoods" style="width: 20.5333vw; font-size: 3.2vw"
                >{{ $t("vip.common.confirm") }}</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { __Root } from "@/utils/config";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
import { normalizeMallImage } from "@/utils/mallImage";
export default {
    name: "BuyConfirm",
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            isShow: false,
        };
    },
    computed: {
        confirmText() {
            if (this.item.price_points && this.item.price_boxcoin) {
                return this.$t("vip.mall.boxcoinAndPoints", { boxcoin: this.item.price_boxcoin, points: this.item.price_points });
            }
            if (this.item.price_points) {
                return this.$t("vip.common.pointsAmount", { amount: this.item.price_points });
            }
            if (this.item.price_boxcoin) {
                return this.$t("vip.common.boxcoinAmount", { amount: this.item.price_boxcoin });
            }
            return "";
        },
    },
    methods: {
        normalizeMallImage,
        buyGoods() {
            if (!User.isLogin()) {
                this.$message.error(this.$t("vip.common.loginRequired"));
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }
            this.isShow = false;
            const { category, is_virtual, id } = this.item;
            if (is_virtual && category == "virtual") {
                return this.$store
                    .dispatch("mallNew/buyGoods", {
                        id,
                        count: 1,
                        addressId: 0,
                        remark: "虚拟商品购买",
                    })
                    .then(() => {
                        this.$confirm(this.$t("vip.mall.goDecoratePrompt"), this.$t("vip.common.prompt"), {
                            confirmButtonText: this.$t("vip.common.confirm"),
                            cancelButtonText: this.$t("vip.common.cancel"),
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

            this.$router.push({
                name: "mall_order_new",
                params: { id },
            });
        },
    },
};
</script>

<style lang="less">
.m-buy-confirm {
    &.el-dialog {
        padding: 0;
    }
    .el-dialog__header {
        padding: 0;
    }
    .el-dialog__body {
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
            color: rgba(64, 128, 255, 1);
        }
        .title {
            margin: 0 1.0667vw;
            font-weight: 700;
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
