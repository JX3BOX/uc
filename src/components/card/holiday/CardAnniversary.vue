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
            <!-- 背景 -->
            <div class="m-bg">
                <video class="u-video" autoplay muted loop :poster="bgImg[0]" preload="metadata">
                    <source :src="bgImg[2]" type="video/mp4" />
                </video>
                <img class="u-box-girl" :src="bgImg[1]" alt="盒子娘" />
            </div>
            <!-- 内容 -->
            <div class="m-star-box">
                <div :class="['m-title', { nextStep }]">
                    <img
                        :class="['u-title', { light: showNext }]"
                        :src="showNext ? imgList[5] : imgList[4]"
                        :alt="showNext ? '摘下来看看' : '请依次点亮所有星星'"
                    />
                    <span class="u-count">({{ starCount }}/6)</span>
                </div>

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
            </div>
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
            show: true,
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
        bgImg() {
            return this.light ? this.data.bg2 : this.data.bg1;
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
        .u-box-girl {
            .size(88px,160px);
            .pa;
            .lb(50%,0);
            margin: -80px 0 0 -44px;
        }
    }
    .m-star-box {
        .pr;
        .size(622px,100%);
        .auto(x);
        .flex;
        flex-direction: column;
        .m-title {
            .flex;
            flex-direction: column;
            align-items: center;
            padding: 80px 0 40px 0;
            .u-title {
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
            .w(622px);
            flex: 1;
        }
        .u-heart {
            .pa;
            .size(622px,424px);
            .tm(1);
            &-1 {
                background-image: url("https://cdn.jx3box.com/design/card/festival/box2025/path0.png");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
            &-2 {
                background-image: url("https://cdn.jx3box.com/design/card/festival/box2025/path1.png");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;

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
                animation: hide 2s linear forwards;
            }
        }
        .u-star {
            .pa;
            .pointer;
            .size(120px);
            &.light {
                animation: rocking 1s ease-in-out infinite;
            }
            &.nextStep {
                top: auto;
            }
            &-1 {
                .lt(calc(50% - 60px),20px);
                &.nextStep {
                    animation: star-1 2s linear forwards;
                }
            }
            &-2 {
                .lt(536px,56px);
                &.nextStep {
                    animation: star-2 2s linear forwards;
                }
            }
            &-3 {
                .lt(490px,236px);
                &.nextStep {
                    animation: star-3 2s linear forwards;
                }
            }
            &-4 {
                .lt(50%,330px);
                &.nextStep {
                    animation: star-4 2s linear forwards;
                }
            }
            &-5 {
                .lt(34px,224px);
                &.nextStep {
                    animation: star-5 2s linear forwards;
                }
            }
            &-6 {
                &.nextStep {
                    animation: star-6 2s linear forwards;
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
    0% {
        left: calc(50% - 60px); 
        transform: rotate(0deg);
    }
    100% {
        left: calc(50% + 30px);
        bottom: 300px;
        transform: rotate(120deg);
    }
}
@keyframes star-2 {
    0% {
        left: 536px; 
        transform: rotate(0deg);
    }
    100% {
        left: 536px;
        bottom: 200px;
        transform: rotate(145deg);
    }
}
@keyframes star-3 {
    0% {
        left: 490px; 
        transform: rotate(0deg);
    }
    100% {
        left: 690px;
        bottom: 50px;
        transform: rotate(180deg);
    }
}
@keyframes star-4 {
    0% {
        left: 50%; 
        transform: rotate(0deg);
    }
    100% {
        left: calc(50% - 180px);
        bottom: 300px;
        transform: rotate(60deg);
    }
}
@keyframes star-5 {
    0% {
        left: 34px; 
        transform: rotate(0deg);
    }
    100% {
        left: -50px;
        bottom: 200px;
        transform: rotate(40deg);
    }
}
@keyframes star-6 {
    0% {
        left: 0; 
        transform: rotate(0deg);
    }
    100% {
        left: calc(-50% + 150px);
        bottom: 50px;
        transform: rotate(30deg);
    }
}
</style>
