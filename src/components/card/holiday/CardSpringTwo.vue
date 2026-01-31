<template>
    <div class="cardSpringTwo" @click.stop>
        <img class="cover" :class="{ active: click }" :src="cover" alt="" @click.stop="clickCover" />
        <img
            v-if="activeIndex <= 1"
            class="money"
            :src="money1"
            :class="{ 'shoot-animation': click, active: activeIndex }"
            @click.stop="clickCover"
        />
        <img
            v-if="activeIndex >= 2"
            class="money"
            :src="money2"
            :class="{ 'shoot-animation': activeIndex == 3, active: activeIndex }"
            @click.stop="clickCover"
        />
        <img
            class="title"
            :class="{ active: click, 'flash-effect': isFlashing }"
            :src="titleList[activeIndex]"
            alt=""
        />
    </div>
</template>
<script>
export default {
    name: "cardSpringTwo",
    props: ["data"],
    computed: {
        cover() {
            return this.data.cover;
        },
        count() {
            return this.data.count;
        },
        titleList() {
            return this.data.titleList;
        },
        imgLink() {
            return this.data.imgLink;
        },
        money1() {
            return this.imgLink + "20.jpg";
        },
        money2() {
            const count = ~~this.count - 20;
            return this.imgLink + `${count}.jpg`;
        },
    },
    data() {
        return {
            activeIndex: 0,
            click: false,
            isFlashing: false,
        };
    },

    methods: {
        clickCover() {
            this.triggerFlash();

            if (this.activeIndex < this.titleList.length) {
                this.activeIndex++;
            }
            this.click = true;

            if (this.activeIndex == 1) {
                setTimeout(() => {
                    const img = document.querySelector(".money1");
                    if (img) {
                        img.classList.remove("shoot-animation");
                    }
                }, 1000);
            }
            if (this.activeIndex > 3) {
                this.close();
                return;
            }
        },
        triggerFlash() {
            if (this.activeIndex < 3) {
                this.isFlashing = true;
                setTimeout(() => {
                    this.isFlashing = false;
                }, 1000);
            }
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/author/animation.less";
.m-animation {
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
.cardSpringTwo {
    .pa;
    .lt(50%);
    .flex;
    .w(570px);
    margin: -222px 0 0 -285px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 80px;
    .cover {
        .z(2);
        cursor: pointer;
        .size(570px,294px);
        transition: transform 0.3s ease;
        transform-origin: center center;
        &.active {
            transform: rotate(-10deg);
        }
    }
    .title {
        .none;
        height: 30px;
        transition: opacity 0.3s ease;
        &.active {
            .db;
        }
    }
    &:hover {
        .cover,
        .money {
            transform: rotate(-10deg);
        }
        .title {
            .db;
        }
    }
    .money {
        .pa;
        .lt(10px,5px);
        cursor: pointer;
        transition: all 0.3s ease;
        &.active {
            transform: rotate(-10deg);
        }
    }

    .shoot-animation {
        animation: shootReturn 1s ease-in-out forwards;
    }
    .flash-effect {
        animation: flash 1s ease-in-out;
    }
}
@keyframes shootReturn {
    0% {
        transform: rotate(-10deg) translateX(0);
    }
    50% {
        transform: rotate(-5deg) translateX(1200px);
        z-index: 3;
    }
    100% {
        transform: rotate(0deg) translateX(0);
        z-index: 3;
    }
}
@keyframes flash {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
