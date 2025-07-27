<template>
    <el-dialog :visible.sync="isShow" width="77.3333vw" :show-close="false" custom-class="m-buy-confirm">
        <div class="content">
            <img :src="item.goods_images[0]" alt="" style="width: 32vw; height: 32vw" />
            <div class="text">
                确认使用<span class="price">{{ confirmText }}</span
                >兑换<span class="title">{{ item.title }}</span
                >嘛？
            </div>
        </div>
        <div class="btn-box">
            <el-button round @click.stop="isShow = false" size="mini" style="width: 20.5333vw; font-size: 3.2vw">取消</el-button>
            <el-button type="primary" round @click.stop="buyGoods" size="mini" style="width: 20.5333vw; font-size: 3.2vw"
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";

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
                return `${this.item.price_boxcoin}盒币和${this.item.price_points}积分`;
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
    methods: {
        buyGoods() {
            if (!User.isLogin()) {
                this.$message.error("请先登录");
                setTimeout(() => {
                    User.toLogin();
                }, 1000);
                return;
            }
            const { category, is_virtual, id } = this.item;
            if (is_virtual && category == "virtual") {
                return this.$store
                    .dispatch("mallNew/buyGoods", {
                        id,
                        count: 1,
                        addressId: 0,
                        remark: "虚拟商品购买",
                    })
                    .then((res) => {
                        this.isShow = false;
                        this.$confirm("购买成功，是否跳转至订单界面?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                const url = `${this.root}dashboard/mall`;
                                window.open(url);
                            })
                            .catch(() => {});
                    });
            }

            this.$router.push({
                name: "mall_order_new",
                params: { id },
            });
        },
    },
};
</script>

<style scoped lang="less">
/deep/.m-buy-confirm {
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
