<template>
    <div class="m-mall-breadcrumb">
        <div class="left"><img class="icon" :src="imgUrl + 'mall.svg'" alt="" />积分商城</div>
        <div class="right">
            我的资产
            <div class="lv button">Lv.{{ level }}</div>
            <div class="pro button" v-if="isPro">PRO</div>
            <div class="asset-continer">
                <div class="item">
                    <img src="@/assets/img/vip/vip2/points.svg" alt="" class="icon" svg-inline />
                    <div class="text">积分<span>（=银铛）</span>：{{ asset.points }}</div>
                </div>
                <div class="item">
                    <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" class="icon" svg-inline />
                    <div class="text">盒币<span>（=通宝）</span>：{{ asset.box_coin }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "MallBreadcrumb",
    data() {
        return {
            imgUrl: __cdn + "design/mall/",
        };
    },
    methods: {
        changeQuery(key, value) {
            this.query[key] = value;
        },
    },
    computed: {
        level() {
            return User.getLevel(this.asset.experience);
        },
        isPro() {
            return User._isPRO(this.asset);
        },
        asset() {
            return this.$store.state.mallNew.asset;
        },
    },
};
</script>

<style scoped lang="less">
.m-mall-breadcrumb {
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, rgba(255, 141, 26, 1) 0%, rgba(196, 98, 0, 0.39) 16.2%, rgba(56, 43, 0, 0) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    .left {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0px;
        line-height: 24px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 36px;
        .icon {
            width: 28px;
            height: 28px;
            margin: 0 4px 0 12px;
        }
    }
    .right {
        height: 20px;
        opacity: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
        .button {
            width: 32px;
            height: 18px;
            border-radius: 2px;
            text-align: center;
            line-height: 18px;
        }
        .lv {
            background: rgba(255, 167, 57, 1);
            margin: 0 12px;
        }
        .pro {
            background: rgba(111, 66, 193, 1);
            margin-right: 12px;
        }
        .asset-continer {
            display: flex;
            gap: 12px;
            align-items: center;
            .item {
                min-width: 175px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                padding: 0 12px;
                box-sizing: border-box;
                .icon {
                    width: 12px;
                    height: 12px;
                    margin-right: 4px;
                }
                .text {
                    font-size: 12px;
                    line-height: 20px;
                    color: rgba(255, 255, 255, 1);
                    span {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }
        }
    }
}
</style>
