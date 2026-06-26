<template>
    <el-dialog v-model="isShow" width="420px" :show-close="false" class="m-buy-confirm">
        <button class="close" type="button" aria-label="关闭" @click="isShow = false">
            <Close class="close-icon" />
        </button>
        <div class="content">
            <div class="header">
                <div class="title">确认兑换</div>
                <div class="desc">将从你的账户扣除以下资产</div>
            </div>
            <div class="good-card">
                <div class="cover-wrap">
                    <img v-if="previewImage" :src="previewImage" :alt="item.title || '商品图片'" class="cover" />
                    <div v-else class="cover cover-null">暂无图片</div>
                </div>
                <div class="good-info">
                    <div class="good-title" :title="item.title">{{ item.title }}</div>
                    <div v-if="item.subtitle" class="good-subtitle" :title="item.subtitle">{{ item.subtitle }}</div>
                    <div class="cost">
                        <span class="cost-label">消耗</span>
                        <span class="price">{{ confirmText || "免费兑换" }}</span>
                    </div>
                </div>
            </div>
            <div class="tip">
                确认后将兑换<span class="em">{{ item.title }}</span>
            </div>
        </div>
        <div class="btn-box">
            <el-button class="cancel-btn" round @click="isShow = false">取消</el-button>
            <el-button class="confirm-btn" type="primary" round @click="buyGoods">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { Close } from "@element-plus/icons-vue";
import { __Root } from "@/utils/config";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
export default {
    name: "BuyConfirm",
    components: {
        Close,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            isShow: false,
        };
    },
    computed: {
        previewImage() {
            return this.item?.goods_images?.[0] || "";
        },
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

        .cost {
            margin-top: 12px;
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
