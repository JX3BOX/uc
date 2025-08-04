<template>
    <el-dialog :visible.sync="$store.state.mallNew.cartConfirmIsShow" width="412px" :show-close="false" custom-class="m-cart-confirm">
        <div class="content">
            <div class="title">购物车结算</div>
            <div class="text">
                确认使用<span class="price boxcoin">{{ $store.getters["mallNew/all_price_boxcoin"] || 0 }}盒币</span
                >+<span class="price points">{{ $store.getters["mallNew/all_price_points"] || 0 }}积分</span>兑换<span
                    class="prrice"
                    >勾选的<span class="num">{{ $store.getters["mallNew/checked_num"] || 0 }}</span
                    >件商品</span
                >吗？
            </div>
        </div>
        <div class="btn-box">
            <el-button round @click="$store.dispatch('mallNew/changeCartConfirmIsShow', false)" size="mini" style="width: 77px; font-size: 12px">再想想</el-button>
            <el-button
                round
                @click="buyGoods"
                size="mini"
                style="width: 77px; font-size: 12px; background-color: rgba(255, 163, 43, 1);color: #fff;"
                >确认</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
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
            this.$store.dispatch("mallNew/changeCartConfirmIsShow", false);
            this.$router.push({ name: "mall_batch_order_new" });
        },
    },
};
</script>

<style scoped lang="less">
/deep/.m-cart-confirm {
    .el-dialog__header {
        padding: 0;
    }
    .el-dialog__body {
        padding: 28px;
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        font-size: 12px;
        color: rgba(56, 56, 56, 1);
        .price {
            margin: 0 4px;
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
        gap: 10px;
        margin-top: 21px;
    }
}
</style>
