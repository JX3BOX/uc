<template>
    <div class="breadcrumb-container" :style="{ overflow: $store.state.mallNew.assetIsShow ? 'visible' : 'hidden' }">
        <div class="m-mall-breadcrumb">
            <div class="left">
                <i class="el-icon-arrow-left" v-if="$route.path !== '/mallWeb/list'" @click="$router.back()"></i
                ><img class="icon" :src="imgUrl + 'mall.svg'" alt="" />积分商城
            </div>
            <div
                class="right"
                @click="$store.commit('mallNew/toState', { assetIsShow: !$store.state.mallNew.assetIsShow })"
            >
                我的资产
            </div>
            <div class="asset-container" :class="{ 'is-show': $store.state.mallNew.assetIsShow }">
                <div class="user-info">
                    UID:{{ asset.user_id }}
                    <div class="button-container">
                        <div class="lv button">Lv.{{ level }}</div>
                        <div class="pro button" v-if="isPro">PRO</div>
                    </div>
                </div>
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
            isShowAsset: false,
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
.breadcrumb-container {
    width: 100%;
    height: 9.6vw;
    background-color: black;
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 602;
    .m-mall-breadcrumb {
        width: 100%;
        height: 9.6vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(
            90deg,
            rgba(255, 141, 26, 1) 0%,
            rgba(196, 98, 0, 0.39) 52.36%,
            rgba(56, 43, 0, 0) 100%
        );
        border-bottom: 0.2vw solid rgba(255, 255, 255, 0.5);
        box-sizing: border-box;
        .left {
            padding-left: 3vw;
            display: flex;
            align-items: center;
            font-size: 5vw;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 9vw;
            .icon {
                width: 7vw;
                height: 7vw;
                margin-right: 1vw;
            }
        }
        .right {
            padding: 0 2vw;
            border-radius: 0.5333vw;
            border: 0.2vw solid rgba(255, 255, 255, 0.25);
            text-align: center;
            line-height: 5.8vw;
            font-size: 3vw;
            color: rgba(255, 255, 255, 1);
            margin-right: 3vw;
        }
        .asset-container {
            position: absolute;
            top: 12vw;
            left: 43.5vw;
            border-radius: 0.5vw;
            background: rgba(0, 0, 0, 1);
            border: 0.2vw solid rgba(255, 255, 255, 0.2);
            padding: 3vw;
            box-sizing: border-box;
            transition: transform 0.3s ease-in-out;
            transform: translateX(56.8vw);
            z-index: 100;
            &.is-show {
                transform: translateX(0);
            }
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            gap: 3vw;
            .item {
                min-width: 46vw;
                height: 5vw;
                border-radius: 1vw;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                padding-left: 3vw;
                box-sizing: border-box;
                .icon {
                    width: 3vw;
                    height: 3vw;
                    margin-right: 1vw;
                }
                .text {
                    font-size: 3vw;
                    line-height: 5vw;
                    color: rgba(255, 255, 255, 1);
                    span {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }
            .user-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align: center;
                line-height: 4.8vw;
                font-size: 3.2vw;
                font-weight: 700;
                color: rgba(255, 255, 255, 1);
                .button-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3vw;
                    .button {
                        width: 8vw;
                        height: 5vw;
                        border-radius: 0.5vw;
                    }
                    .lv {
                        background: rgba(255, 167, 57, 1);
                    }
                    .pro {
                        background: rgba(111, 66, 193, 1);
                    }
                }
            }
        }
    }
}
</style>
