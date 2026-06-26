<template>
    <div class="m-mall-breadcrumb">
        <div class="left">
            <img class="icon" :src="imgUrl + 'mall.svg'" alt="" />
            <a href="/vip/mall" class="title">积分商城</a>
        </div>
        <div class="right">
            <span class="asset-title">我的资产</span>
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
import { __cdn } from "@/utils/config";
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
    min-width: 920px;
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
        flex: none;
        height: 100%;
        padding: 0 18px 0 14px;
        background: linear-gradient(90deg, rgba(255, 143, 26, 0.42), rgba(255, 143, 26, 0));
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 0px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 36px;
        white-space: nowrap;
        .icon {
            width: 24px;
            height: 24px;
            margin: 0 8px 0 0;
        }
        .title {
            color: #fff;
            text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
            &:hover {
                color: rgba(255, 236, 190, 1);
            }
        }
    }
    .right {
        height: 100%;
        opacity: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        flex: none;
        padding-right: 18px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0px;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
        white-space: nowrap;
        .asset-title {
            color: rgba(255, 255, 255, 0.94);
        }
        .button {
            min-width: 40px;
            height: 18px;
            border-radius: 2px;
            text-align: center;
            line-height: 18px;
            padding: 0 6px;
            box-sizing: border-box;
        }
        .lv {
            background: rgba(255, 167, 57, 1);
        }
        .pro {
            background: rgba(111, 66, 193, 1);
        }
        .asset-continer {
            display: flex;
            gap: 12px;
            align-items: center;
            .item {
                min-width: 175px;
                height: 22px;
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
