<template>
    <div class="m-machine">
        <div class="m-decoration m-decoration-left">
            <img
                :class="`u-img u-img-left${i}`"
                :src="`${imgPath}left${i}.svg`"
                v-for="i in 4"
                :key="i"
                :style="{
                    '--shake-x': `${Math.random() * 5 + 2}px`,
                    '--rotate': `${Math.random() * 3 + 1}deg`,
                    '--duration': `${Math.random() * 1 + 2}s`,
                }"
            />
        </div>
        <div class="m-box">
            <slot></slot>
        </div>
        <div class="m-decoration m-decoration-right">
            <img
                :class="`u-img u-img-right${i}`"
                :src="`${imgPath}right${i}.svg`"
                v-for="i in 4"
                :key="i"
                :style="{
                    '--shake-x': `${Math.random() * 5 + 2}px`,
                    '--rotate': `${Math.random() * 3 + 1}deg`,
                    '--duration': `${Math.random() * 1 + 2}s`,
                }"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: ["imgPath", "reward"],
};
</script>

<style lang="less" scoped>
@birthday2026: "https://cdn.jx3box.com/design/card/birthday/2026/";
.m-machine {
    .pr;
    .size(556px,774px);

    .m-box {
        .pr;
        .size(100%);
        .z(2);
        background: url("@{birthday2026}box.png") no-repeat center top;
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 170px 186px 68px 86px;
    }

    .m-decoration {
        .pa;
        bottom: 86px;
        &-left {
            .size(280px,466px);
            left: -168px;
        }
        &-right {
            .size(300px,438px);
            right: -72px;
        }

        .u-img {
            .pa;
            bottom: 0;
            transform-origin: center bottom;
            animation: balloonShake infinite ease-in-out;
            animation-duration: var(--duration);
            &-left1 {
                .size(282px,328px);
            }
            &-left2 {
                .size(262px,466px);
                left: 42px;
                bottom: -44px;
            }
            &-left3 {
                .size(236px,349px);
                left: 52px;
                bottom: -16px;
            }
            &-left4 {
                .size(180px,406px);
                left: 132px;
                bottom: 4px;
            }
            &-right1 {
                .size(300px,302px);
            }
            &-right2 {
                .size(288px,438px);
                right: 20px;
                bottom: -28px;
            }
            &-right3 {
                .size(212px,390px);
                right: 124px;
            }
            &-right4 {
                .size(260px,326px);
                right: 46px;
                bottom: -16px;
            }
        }
    }
}

@keyframes balloonShake {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }
    50% {
        transform: translate(var(--shake-x), 0) rotate(var(--rotate));
    }
    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}
</style>
