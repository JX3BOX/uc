<template>
    <el-dialog :visible.sync="isShow" width="380px" :show-close="false" custom-class="m-buy-confirm">
        <div class="content">
            <img :src="item.goods_images[0]" alt="" style="width: 120px; height: 120px" />
            <div class="text">
                确认使用<span class="price">{{ confirmText }}</span
                >兑换<span class="title">{{ item.title }}</span
                >嘛？
            </div>
        </div>
        <div class="btn-box">
            <el-button round @click="isShow = false" size="mini" style="width: 77px; font-size: 12px">取消</el-button>
            <el-button type="primary" round @click="buyGoods" size="mini" style="width: 77px; font-size: 12px"
                >确定</el-button
            >
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { __Root } from "@/utils/config";
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
                    .then((res) => {
                        this.$confirm("购买成功，是否跳转至订单界面?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                const url = `${__Root}dashboard/mall`;
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
        padding: 28px;
    }
    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        font-size: 12px;
        color: rgba(56, 56, 56, 1);
        .price {
            margin: 0 4px;
            font-weight: 700;
            color: rgba(64, 128, 255, 1);
        }
        .title {
            margin: 0 4px;
            font-weight: 700;
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
