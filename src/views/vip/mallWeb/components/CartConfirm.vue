<template>
    <el-dialog :visible.sync="isShow" width="109.8667vw" :show-close="false" custom-class="m-cart-confirm">
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
            <el-button round @click="isShow = false" size="mini" style="width: 20.5333vw; font-size: 3.2vw">再想想</el-button>
            <el-button
                round
                @click="buyGoods"
                size="mini"
                style="width: 20.5333vw; font-size: 3.2vw; background-color: rgba(255, 163, 43, 1);color: #fff;"
                >确认</el-button
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
            this.isShow = false;
            this.$router.push({ name: "mall_batch_order_web" });
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
