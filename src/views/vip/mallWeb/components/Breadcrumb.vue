<template>
    <div class="breadcrumb-container" :style="{ overflow: $store.state.mallNew.assetIsShow ? 'visible' : 'hidden' }">
        <div class="m-mall-breadcrumb">
            <div class="left">
                <i class="el-icon-arrow-left" v-if="$route.path !== '/mallWeb/list'" @click="$router.back()"></i
                ><img class="icon" :src="imgurl + 'mall.svg'" alt="" />积分商城
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
                    <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" class="icon" svg-inline />
                    <div class="text">盒币<span>（=通宝）</span>：{{ asset.box_coin }}</div>
                </div>
                <div class="item">
                    <img src="@/assets/img/vip/vip2/points.svg" alt="" class="icon" svg-inline />
                    <div class="text">积分<span>（=积分）</span>：{{ asset.points }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "MallBreadcrumb",
    data() {
        return {
            imgurl: "https://cdn.jx3box.com/design/mall/",
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
    top: 0;
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
        border-bottom: 0.2667vw solid rgba(255, 255, 255, 0.5);
        box-sizing: border-box;
        .left {
            padding-left: 3.2vw;
            display: flex;
            align-items: center;
            font-size: 5.3333vw;
            font-weight: 700;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 9.6vw;
            .icon {
                width: 7.4667vw;
                height: 7.4667vw;
                margin-right: 1.0667vw;
            }
        }
        .right {
            width: 14.9333vw;
            height: 5.8667vw;
            border-radius: 0.5333vw;
            border: 0.2667vw solid rgba(255, 255, 255, 0.25);
            text-align: center;
            line-height: 5.8667vw;
            font-size: 3.2vw;
            color: rgba(255, 255, 255, 1);
            margin-right: 3.2vw;
        }
        .asset-container {
            position: absolute;
            top: 12.8vw;
            left: 43.7333vw;
            width: 53.0667vw;
            height: 28.2667vw;
            border-radius: 0.5333vw;
            background: rgba(0, 0, 0, 1);
            border: 0.2667vw solid rgba(255, 255, 255, 0.2);
            padding: 3.2vw;
            box-sizing: border-box;
            transition: transform 0.3s ease-in-out;
            transform: translateX(56.8vw);
            z-index: 100000;
            &.is-show {
                transform: translateX(0);
            }
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            gap: 3.2vw;
            .item {
                width: 46.6667vw;
                height: 5.3333vw;
                border-radius: 1.0667vw;
                background: rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                padding-left: 3.2vw;
                box-sizing: border-box;
                .icon {
                    width: 3.2vw;
                    height: 3.2vw;
                    margin-right: 1.0667vw;
                }
                .text {
                    font-size: 3.2vw;
                    line-height: 5.3333vw;
                    color: rgba(255, 255, 255, 1);
                    span {
                        color: #656463;
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
                line-height: 4.8vw;
                color: rgba(255, 255, 255, 1);
                .button-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3.2vw;
                    .button {
                        width: 8.5333vw;
                        height: 4.8vw;
                        border-radius: 0.5333vw;
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
