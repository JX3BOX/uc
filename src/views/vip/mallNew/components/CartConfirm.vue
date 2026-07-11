<template>
    <el-dialog
        v-model="$store.state.mallNew.cartConfirmIsShow"
        width="412px"
        :show-close="false"
        class="m-cart-confirm"
    >
        <div class="content">
            <div class="title">{{ $t("vip.mall.cartCheckout") }}</div>
            <div class="desc">{{ $t("vip.mall.confirmSelected") }}</div>
            <div class="summary">
                <div class="summary-row">
                    <span class="summary-label">
                        <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" svg-inline />
                        {{ $t("vip.mall.boxcoin") }}
                    </span>
                    <span class="summary-value boxcoin">{{ $store.getters["mallNew/all_price_boxcoin"] || 0 }}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">
                        <img src="@/assets/img/vip/vip2/points.svg" alt="" svg-inline />
                        {{ $t("vip.common.points") }}
                    </span>
                    <span class="summary-value points">{{ $store.getters["mallNew/all_price_points"] || 0 }}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">
                        <i class="el-icon-shopping-cart-2"></i>
                        {{ $t("vip.mall.products") }}
                    </span>
                    <span class="summary-value num">{{ $t("vip.mall.pieces", { count: $store.getters["mallNew/checked_num"] || 0 }) }}</span>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <el-button round class="btn-cancel" @click="$store.dispatch('mallNew/changeCartConfirmIsShow', false)">
                {{ $t("vip.mall.thinkAgain") }}
            </el-button>
            <el-button round class="btn-confirm" @click="buyGoods">{{ $t("vip.common.confirmExchange") }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "CartConfirm",
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        buyGoods() {
            if (!User.isLogin()) {
                return User.toLogin();
            }
            if (!this.$store.getters["mallNew/checked_num"]) {
                return this.$message.warning(this.$t("vip.mall.selectCheckoutProducts"));
            }
            this.$store.dispatch("mallNew/changeCartConfirmIsShow", false);
            this.$store.dispatch("mallNew/changeBatchConfirmIsShow", true);
        },
    },
};
</script>

<style lang="less">
.m-cart-confirm {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
        padding: 0;
    }
    .el-dialog__body {
        width: 100%;
        padding: 26px 30px 28px;
        box-sizing: border-box;
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 8px;
        color: rgba(56, 56, 56, 1);

        .title {
            font-size: 16px;
            font-weight: 800;
            line-height: 22px;
            color: rgba(36, 41, 46, 1);
        }

        .desc {
            font-size: 12px;
            line-height: 18px;
            color: rgba(93, 99, 110, 0.72);
        }

        .summary {
            width: 100%;
            margin-top: 8px;
            padding: 10px 14px;
            box-sizing: border-box;
            border-radius: 12px;
            background: #f7f8fb;
            border: 1px solid rgba(36, 41, 46, 0.06);
        }

        .summary-row {
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            line-height: 18px;
        }

        .summary-label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: rgba(36, 41, 46, 0.78);

            svg,
            i {
                width: 14px;
                height: 14px;
                font-size: 14px;
                color: rgba(36, 41, 46, 0.58);
            }
        }

        .summary-value {
            font-size: 14px;
            font-weight: 800;
            color: rgba(255, 141, 26, 1);

            &.num {
                color: rgba(255, 141, 26, 1);
            }
        }
    }
    .btn-box {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 20px;

        .el-button {
            width: 104px;
            height: 34px;
            padding: 0;
            font-size: 13px;
            font-weight: 800;
        }

        .btn-cancel {
            color: rgba(93, 99, 110, 0.88);
            border-color: rgba(36, 41, 46, 0.16);
            background: #fff;
        }

        .btn-confirm {
            border-color: rgba(255, 141, 26, 1);
            background: linear-gradient(180deg, rgba(255, 176, 63, 1) 0%, rgba(255, 150, 35, 1) 100%);
            color: #fff;
            box-shadow: 0 8px 16px rgba(255, 145, 31, 0.22);
        }
    }
}
</style>
