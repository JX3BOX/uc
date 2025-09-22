<template>
    <div class="doubleScreen" @click.stop :style="{ backgroundImage: `url(${bgImg})` }">
        <!-- 第一屏 -->
        <div class="m-first" v-show="!show" @click="showSecond">
            <img class="u-petal animation" :class="change ? 'fadeOut' : 'fadeIn'" :src="imgList[0]" />
            <img class="u-look animations fadeInOut" :class="change ? 'none' : ''" :src="imgList[1]" />
        </div>
        <!-- 第二屏 -->
        <div class="m-second" v-show="show">
            <img class="u-left animation fadeInLeft" :src="imgList[2]" />
            <img class="u-right animation fadeInRight" :src="imgList[3]" />
            <img class="u-good animation fadeInDown" :src="vImg" />
            <img class="u-txt animation fadeInUp" :src="countImg" />
            <div class="u-boxcion animation fadeInDown">
                <span class="u-cion">{{ fontCount }}</span>
                <img class="u-img" :src="imgList[4]" />
            </div>
            <img class="u-close animation fadeInUp" :src="imgList[5]" @click="closePop" />
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "doubleScreen",
    props: ["data"],
    data: function () {
        return {
            show: false,
            change: false,
        };
    },
    computed: {
        fontCount() {
            return this.data.fontCount;
        },
        bgImg() {
            return this.data.bgImg;
        },
        countImg() {
            return this.data.countImg;
        },
        imgList() {
            return this.data.imgList;
        },
        vImg() {
            return this.data.vImg;
        },
    },
    methods: {
        showSecond() {
            this.change = true;
            setTimeout(() => {
                this.show = true;
            }, 1000);
        },
        closePop() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="less">
.doubleScreen {
    .size(1200px, 600px);
    .pa;
    .lt(50%, 50%);
    .r(3px);
    transform: translate(-50%, -50%);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    // 第一屏
    .m-first {
        .pr;
        .pointer;
        .u-look {
            .pa;
            .h(30px);
            .lb(50%,130px);
            .ml(-110px);
        }
    }
    // 第二屏
    .m-second {
        .pr;
        .full;
        .animation {
            .h(100%);
            .pa;
        }
        .u-left {
            .lt(0);
        }
        .u-right {
            .rt(0);
        }
        .u-good {
            .h(60px);
            .lt(50%,130px);
            .ml(-80px);
        }
        .u-txt {
            .h(24px);
            .lt(50%,240px);
            .ml(-200px);
        }
        .u-boxcion {
            .lt(50%,340px);
            .ml(-120px);
            .u-img {
                .h(24px);
            }
            .u-cion {
                .db;
                .w(140px);
                .x;
                .pa;
                .bold;
                .lt(130px,0);
                .fz(24px,1);
                color: #3d454d;
            }
        }
        .u-close {
            .h(24px);
            .lb(50%,120px);
            .pointer;
            .ml(220px);
        }
    }
}
@media screen and (max-width: @phone) {
    .doubleScreen .m-second {
        .u-txt {
            .none;
        }
        .u-good {
            .ml(-65px);
        }
        .u-boxcion {
            top: 300px;
            margin-left: -170px;
        }
        .u-close {
            .lb(50%,120px);
            .ml(-50px);
        }
    }
}
</style>
