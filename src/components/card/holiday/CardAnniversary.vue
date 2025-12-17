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
                <img class="u-box-woman" :src="bgImg[1]" alt="盒子娘" />
            </div>
            <!-- 内容 -->
            <div class="m-star-box">
                <img
                    :class="['u-title', { light: showNext }]"
                    :src="showNext ? imgList[5] : imgList[4]"
                    :alt="showNext ? '摘下来看看' : '请依次点亮所有星星'"
                />
                <span class="u-count">({{ starCount }}/6)</span>
                <div class="m-heart">
                    <img class="u-heart u-heart-1" :src="imgList[0]" />
                    <img class="u-heart u-heart-2" :src="imgList[1]" />
                    <img
                        :class="['u-star', { light: starList.includes(i) }, `u-star-${i}`]"
                        v-for="i in 6"
                        :src="starList.includes(i) ? imgList[3] : imgList[2]"
                        :key="i"
                        @click="clickStar(i)"
                    />
                </div>
                <div
                    v-for="(item, i) in txtList"
                    :key="i"
                    :class="['u-txt', { light: starList.includes(i + 1) }, `u-txt-${i + 1}`]"
                >
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.desc }}</p>
                </div>
            </div>
            <div class="m-click" v-if="showNext">
                <span class="u-circle">摘星</span>
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
            if (this.showNext) return;
            this.starCount++;
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
        .u-box-woman {
            .size(88px,160px);
            .pa;
            .lb(50%,0);
            margin: -80px 0 0 -44px;
        }
    }
    .m-star-box {
        .pr;
        .pt(80px);
        .size(622px,100%);
        .auto(x);
        .flex;
        flex-direction: column;
        align-items: center;
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
        .m-heart {
            .pr;
            .size(622px,424px);
        }
        .u-heart {
            .pa;
            .size(100%);
        }
        .u-star {
            .pa;
            .pointer;
            .size(120px);
            &.light {
                animation: rocking 1s ease-in-out infinite;
            }
            &-1 {
                .lt(50%,0);
                margin: 50px 0 0 -60px;
            }
            &-2 {
                .rt(0,0);
                margin: -24px 54px 0 0;
            }
            &-3 {
                .rb(0,54px);
                margin: 0px 54px 0 0;
            }
            &-4 {
                .lb(50%,0);
                margin: 0 0 -20px -60px;
            }
            &-5 {
                .lb(0,84px);
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
</style>
