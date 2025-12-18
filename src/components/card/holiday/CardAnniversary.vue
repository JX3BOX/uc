<template>
    <div class="Anniversary">
        <!-- 第一屏 -->
        <div class="m-card" v-if="!show">
            <img :src="oneImg[0]" alt="2025魔盒周年庆" />
            <img class="u-button" :src="oneImg[1]" alt="2025魔盒周年庆" @click="change" />
            <img class="u-close" :src="oneImg[2]" alt="2025魔盒周年庆" @click="close" />
        </div>
        <!-- 第二屏 -->
        <div class="m-anniversary" v-else>
            <img class="u-close" v-if="nextStep" :src="oneImg[2]" alt="2025魔盒周年庆" @click="close" />
            <!-- 背景 -->
            <div class="m-bg">
                <!-- 背景 -->
                <video v-if="nextStep" class="u-video" autoplay muted loop :poster="bg2Img[0]" preload="metadata">
                    <source :src="bg2Img[2]" type="video/mp4" />
                </video>
                <video v-else class="u-video" autoplay muted loop :poster="bg1Img[0]" preload="metadata">
                    <source :src="bg1Img[2]" type="video/mp4" />
                </video>
                <!-- 盒子娘小 -->
                <img class="u-box-girl-1" :src="bg1Img[1]" alt="盒子娘（小）" />
                <!-- 领取结算界面 -->
                <template v-if="nextStep">
                    <img class="u-box-girl-2" :src="bg2Img[1]" alt="盒子娘（大）" />
                    <img class="u-jx3box" :src="imgList[6]" alt="魔盒团队爱你" />
                    <span class="u-tips">已领取</span>
                </template>
            </div>
            <!-- 内容 -->
            <div class="m-star-box">
                <!-- 未领取时标题 -->
                <div :class="['m-title', { nextStep }]">
                    <img
                        :class="['u-img-title', { light: showNext }]"
                        :src="showNext ? imgList[5] : imgList[4]"
                        :alt="showNext ? '摘下来看看' : '请依次点亮所有星星'"
                    />
                    <span class="u-count">({{ starCount }}/6)</span>
                </div>
                <!-- 心形 -->
                <div class="m-heart">
                    <div :class="['u-heart u-heart-1', { nextStep }]"></div>
                    <div :class="['u-heart u-heart-2', { nextStep }, { light: showNext }]"></div>
                    <img
                        :class="['u-star', { light: starList.includes(i) }, `u-star-${i}`, { nextStep }]"
                        v-for="i in 6"
                        :src="starList.includes(i) ? imgList[3] : imgList[2]"
                        :key="i"
                        @click="clickStar(i)"
                    />
                </div>
                <!-- 未领取时内容 -->
                <template v-if="!nextStep">
                    <div
                        v-for="(item, i) in txtList"
                        :key="i"
                        :class="['u-txt', { light: starList.includes(i + 1) }, `u-txt-${i + 1}`]"
                    >
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </div>
                </template>
                <!-- 领取后内容 -->
                <template v-else>
                    <div v-for="(item, i) in txtList" :key="i" :class="['u-title', `u-title-${i + 1}`]">
                        {{ item.title == "魔盒积分" ? `${data.count || 0}魔盒积分` : item.title }}
                    </div></template
                >
            </div>
            <!-- 领取按钮 -->
            <div class="m-click" v-if="showNext && !nextStep">
                <span class="u-circle" @click="nextStep = true">摘星</span>
            </div>
        </div>
    </div>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath } from "@/utils/config";
export default {
    name: "cardAnniversary",
    props: ["data"],
    data: function () {
        return {
            show: false,
            light: false,
            starCount: 0,
            starList: [],
            nextStar: 1,
            nextStep: false,
        };
    },
    computed: {
        showNext() {
            return this.starCount == 6;
        },
        oneImg() {
            return this.data.oneImg;
        },
        bg1Img() {
            return this.data.bg1;
        },
        bg2Img() {
            return this.data.bg2;
        },
        imgList() {
            return this.data.imgList;
        },
        txtList() {
            return this.data.txtList;
        },
    },
    watch: {},
    methods: {
        change() {
            this.show = true;
        },
        close() {
            this.$emit("close");
        },
        clickStar(i) {
            if (this.nextStar != i) return;
            if (this.showNext) return;
            this.starCount++;
            this.nextStar++;
            this.starList.push(i);
        },
    },
};
</script>
<style lang="less">
.Anniversary {
    .m-card {
        .pf;
        .pointer;
        .lt(50%);
        .size(960px,540px);
        margin: -270px 0 0 -480px;
        .u-button {
            .pa;
            .size(270px,88px);
            .lb(60px,56px);
            transition: transform 0.3s ease;
            &:hover {
                transform: scale(1.03);
            }
        }
        .u-close {
            .pa;
            .rt(0);
            .size(50px);
            .z(1);
            transition: transform 0.5s ease-in-out;
            &:hover {
                transform: rotate(90deg);
            }
        }
    }
    .m-anniversary {
        .pf;
        .size(100%);
        .lt(0);
        .rb(0);
        .z(9);
        .u-close {
            .pa;
            .pointer;
            .size(60px);
            .rt(60px);
        }
    }
    .m-bg {
        .pa;
        .size(100%);
        .lt(0);
        .z(-1);
        .u-video {
            .pa;
            .w(100%);
            .lb(0);
        }
        .u-box-girl-1 {
            .pa;
            .size(88px,160px);
            .lb(50%,0);
            margin: 0 0 0 -44px;
        }
        .u-box-girl-2 {
            .pa;
            .lb(50%);
            .size(864px,639px);
            margin: 0 0 -100px -432px;
            animation: girl 1.5s linear forwards;
        }
        .u-jx3box {
            .pa;
            .lt(220px,120px);
            .size(438px,auto);
            animation: down 1.5s linear forwards;
        }
        .u-tips {
            .pa;
            .color(#fff);
            .fz(36px,60px);
            .lb(50%,180px);
            margin: 0 0 0 -1.5em;
            animation: show 1.5s linear forwards;
        }
    }
    .m-star-box {
        .pr;
        .size(750px,100%);
        .auto(x);
        .flex;
        flex-direction: column;
        .m-title {
            .flex;
            flex-direction: column;
            align-items: center;
            padding: 80px 0 40px 0;
            .u-img-title {
                .size(420px,45px);
                transition: all 0.5s ease-in-out;
                &.light {
                    .size(254px,45px);
                }
            }
            .u-count {
                .fz(24px,60px);
                color: #fff;
            }
            &.nextStep {
                .tm(0);
            }
        }

        .m-heart {
            .pr;
            .w(750px);
            flex: 1;
        }
        .u-heart {
            .pa;
            .size(750px,560px);
            .tm(1);
            &-1 {
                background-image: url("https://cdn.jx3box.com/design/card/festival/box2025/path0@2x.png");
                background-size: 750px 560px;
                background-repeat: no-repeat;
                background-position: center center;
            }
            &-2 {
                background-image: url("https://cdn.jx3box.com/design/card/festival/box2025/path1@2x.png");
                background-size: 750px 560px;
                background-repeat: no-repeat;
                background-position: center center;

                transform: translateZ(0);
                will-change: transform, opacity;

                -webkit-mask-image: radial-gradient(circle 0px at center, transparent 0%, transparent 100%);
                mask-image: radial-gradient(circle 0px at center, transparent 0%, transparent 100%);
                transition: -webkit-mask-image 1s linear, mask-image 1s linear;
                &.light {
                    animation: maskAnimation 1s linear forwards;
                    -webkit-mask-image: radial-gradient(circle 150px at center, transparent 0%, black 100%);
                    mask-image: radial-gradient(circle 150px at center, transparent 0%, black 100%);
                }
            }
            &.nextStep {
                animation: hide 1.5s linear forwards;
            }
        }
        .u-star {
            .pa;
            .pointer;
            .size(120px);
            &.light {
                animation: rocking 1s ease-in-out infinite;
            }
            &-1 {
                .lt(calc(50% - 60px),95px);
                &.nextStep {
                    animation: star-1 1.5s linear forwards;
                }
            }
            &-2 {
                .lt(540px,30px);
                &.nextStep {
                    animation: star-2 1.5s linear forwards;
                }
            }
            &-3 {
                .lt(560px,280px);
                &.nextStep {
                    animation: star-3 1.5s linear forwards;
                }
            }
            &-4 {
                .lt(calc(50% - 74px),414px);
                &.nextStep {
                    animation: star-4 1.5s linear forwards;
                }
            }
            &-5 {
                .lt(60px,270px);
                &.nextStep {
                    animation: star-5 1.5s linear forwards;
                }
            }
            &-6 {
                .lt(54px);
                &.nextStep {
                    animation: star-6 1.5s linear forwards;
                }
            }
        }
    }
    .u-txt {
        .pa;
        .r(12px);
        background: rgba(255, 255, 255, 0.2);
        padding: 20px;
        color: #fff;
        user-select: none;
        pointer-events: none;
        opacity: 0;
        transition: all 0.5s ease-in-out;
        h3 {
            .fz(24px);
            .nobreak;
            margin: 0 0 20px 0;
        }
        p {
            .fz(16px);
            .nobreak;
        }
        &.light {
            opacity: 1;
        }
        &-1 {
            .rt(-340px,120px);
        }
        &-2 {
            .rt(-340px,420px);
        }
        &-3 {
            .lt(70%,700px);
        }
        &-4 {
            .rt(70%,700px);
        }
        &-5 {
            .lt(-420px,420px);
        }
        &-6 {
            .lt(-440px,120px);
        }
    }
    .u-title {
        .pa;
        .nobreak;
        .r(12px);
        .fz(24px);
        user-select: none;
        pointer-events: none;
        color: #fff;
        padding: 10px 40px;
        border: 1px solid #fff;
        background-color: rgba(0, 0, 0, 0.75);
        animation: show 1.5s linear forwards;
        &-1 {
            .rt(50%,calc(100% - 480px));
            .mr(300px);
        }
        &-2 {
            .lt(50%,calc(100% - 240px));
            .ml(700px);
        }
        &-3 {
            .rt(50%,calc(100% - 380px));
            .mr(500px);
        }
        &-4 {
            .rt(50%,calc(100% - 240px));
            .mr(700px);
        }
        &-5 {
            .lt(50%,calc(100% - 480px));
            .ml(300px);
        }
        &-6 {
            .lt(50%,calc(100% - 380px));
            .ml(500px);
        }
    }
    .m-click {
        .pf;
        .size(120px);
        .rb(120px);
        .u-circle {
            .flex;
            .pr;
            .pointer;
            .size(120px);
            .r(50%);
            .z(2);
            .fz(36px);
            user-select: none;
            color: #fff;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.3);
            animation: pulse 2s linear infinite;
            transition: all 0.3s ease-in-out;
            &:hover {
                background-color: #fff;
                color: #000;
            }
        }
    }
}
@keyframes rocking {
    0%,
    100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-2deg);
    }
    75% {
        transform: rotate(2deg);
    }
}
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 50px rgba(255, 255, 255, 0.15);
    }
}
@keyframes maskAnimation {
    0% {
        -webkit-mask-image: radial-gradient(circle 0px at center top, transparent 0%, transparent 100%);
        mask-image: radial-gradient(circle 0px at center top, transparent 0%, transparent 100%);
    }
    25% {
        -webkit-mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 90deg,
            transparent 90deg,
            transparent 360deg
        );
        mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 90deg,
            transparent 90deg,
            transparent 360deg
        );
    }
    50% {
        -webkit-mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 180deg,
            transparent 180deg,
            transparent 360deg
        );
        mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 180deg,
            transparent 180deg,
            transparent 360deg
        );
    }
    75% {
        -webkit-mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 270deg,
            transparent 270deg,
            transparent 360deg
        );
        mask-image: conic-gradient(
            from 0deg at 50% 50%,
            black 0deg,
            black 270deg,
            transparent 270deg,
            transparent 360deg
        );
    }
    100% {
        -webkit-mask-image: none;
        mask-image: none;
    }
}
@keyframes hide {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
@keyframes star-1 {
    to {
        .lt(calc(50% + 50px),calc(100% - 480px));
        transform: rotate(120deg);
    }
}
@keyframes star-2 {
    to {
        .lt(640px, calc(100% - 380px));
        transform: rotate(145deg);
    }
}
@keyframes star-3 {
    to {
        .lt(800px,calc(100% - 240px));
        transform: rotate(180deg);
    }
}
@keyframes star-4 {
    to {
        .lt(calc(50% - 190px),calc(100% - 480px));
        transform: rotate(60deg);
    }
}
@keyframes star-5 {
    to {
        .lt(-20px,calc(100% - 380px));
        transform: rotate(40deg);
    }
}
@keyframes star-6 {
    to {
        .lt(calc(-50% + 180px),calc(100% - 240px));
        transform: rotate(30deg);
    }
}
@keyframes girl {
    0% {
        transform: translateY(100%) scale(1);
        opacity: 0;
    }
    100% {
        transform: translateY(0%) scale(1.2);
        opacity: 1;
    }
}
@keyframes down {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }
    to {
        opacity: 1;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}
@keyframes show {
    0% {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
