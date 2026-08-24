<template>
    <div class="m-default-template-stage">
        <div :class="count ? 'defaultTemplateCount' : 'defaultTemplate'" :style="cardStyle" @click="clickStep">
            <template v-if="!count">
                <div class="m-count" :class="{ flipper }">
                    <img
                        :src="countImg"
                        v-if="countImg"
                        class="u-count"
                        :style="percentage ? `width:${percentage}` : ''"
                    />
                </div>
                <img :src="countBg" v-if="countBg" class="u-img u-bg" :class="{ flipper }" />
                <div class="u-img u-img-cover" :class="{ active, flipper }">
                    <img :src="item" v-for="(item, i) in imgList" :key="i" :class="`u-pic u-pic-${2 - i}`" />
                </div>
            </template>
            <template v-else>
                <div @click="close">
                    <div class="m-count">
                        <img :src="item" v-for="(item, index) in countImgList" :key="index" class="u-count" />
                    </div>
                    <img :src="imgList[1]" class="u-img" />
                </div>
                <img
                    :src="imgList[0]"
                    class="u-img u-img-cover"
                    :class="['animation', { fadeOutUp: flipper }, { none: active }]"
                />
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name: "DefaultTemplate",
    props: ["data"],
    computed: {
        imgList() {
            return this.data.imgList;
        },
        countBg() {
            return this.data.countBg;
        },
        countImg() {
            return this.data.countImg;
        },
        countImgList() {
            return this.data.countImgList;
        },
        count() {
            return this.data.count;
        },
        size() {
            return this.data.size;
        },
        percentage() {
            return this.data.percentage;
        },
        baseCardWidth() {
            return this.readPixelSize(this.size?.width) || (this.count ? 420 : 360);
        },
        baseCardHeight() {
            return this.readPixelSize(this.size?.height) || (this.count ? 720 : 610);
        },
        mobileCardScale() {
            if (!this.viewportWidth || !this.viewportHeight) return 0.8;
            const availableWidth = Math.max(0, this.viewportWidth - 24);
            const availableHeight = Math.max(0, this.viewportHeight - 24);
            return Math.min(1, availableWidth / this.baseCardWidth, availableHeight / this.baseCardHeight);
        },
        cardStyle() {
            return {
                ...(this.size || {}),
                "--holiday-card-mobile-scale": String(this.mobileCardScale),
            };
        },
    },
    data() {
        return {
            active: false,
            flipper: false,
            one: true,
            viewportWidth: typeof window === "undefined" ? 0 : window.innerWidth,
            viewportHeight: typeof window === "undefined" ? 0 : window.innerHeight,
        };
    },
    mounted() {
        window.addEventListener("resize", this.updateViewport, { passive: true });
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateViewport);
    },
    methods: {
        readPixelSize(value) {
            const result = Number.parseFloat(value);
            return Number.isFinite(result) && result > 0 ? result : 0;
        },
        updateViewport() {
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;
        },
        close() {
            this.$emit("close");
        },
        hide() {
            this.flipper = true;

            setTimeout(() => {
                this.active = true;
                this.$emit("checked");
            }, 600);
        },
        clickStep() {
            if (!this.count) {
                if (this.one) {
                    this.hide();
                    this.one = false;
                } else {
                    this.close();
                }
            } else {
                this.hide();
            }
        },
    },
};
</script>
<style lang="less" scope>
.m-default-template-stage {
    width: 100%;
    height: 100%;
}

.defaultTemplate {
    .pr;
    .pointer;
    .auto(x);
    //.ct(o,360px,610px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .size(360px,610px);
    .u-img {
        .size(100%);
        perspective: 1000px;
        transform-style: preserve-3d;
        transition: all 2s;
        &.u-bg {
            opacity: 0;
        }
        &.flipper {
            opacity: 1;
            transform: rotateY(180deg);
        }
    }
    .u-pic {
        .pa;
        .lb(0);
        transition: all 0.5s ease;
    }
    .u-pic-2 {
        z-index: 2;
        width: 720px;
        max-width: 720px;
        .lb(50%,0);
        .ml(-420px);
    }
    .u-img-cover {
        .pa;
        .lt(0);
        .u-pic-1 {
            transform: scale(0.95);
        }

        &:hover {
            .u-pic-1 {
                transform: scale(1);
                transform-origin: bottom center;
            }
        }

        &.active {
            .none;
        }
    }
    .m-count {
        .pa;
        .lb(0,30px);
        .flex;
        .tm(0);
        z-index: 2;
        transition: opacity 1.5s ease 1s;
        justify-content: center;
        gap: 2px;
        &.flipper {
            .tm(1);
        }
        .u-count {
            .w(80%);
        }
    }
}
.defaultTemplateCount {
    .pr;
    .pointer;
    .auto(x);
    //.ct(o,420px,720px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .size(420px,720px);
    .u-img {
        .size(100%);
    }
    .u-img-cover {
        .pa;
        .lt(0);
        transition-duration: 0.8s;
        &:hover {
            top: -20px;
        }
        &.active {
            .none;
        }
    }
    .m-count {
        .pa;
        .lt(152px,430px);
        .flex;
        .w(100px);
        justify-content: center;
        gap: 2px;
        .u-count {
            .h(16px);
        }
    }
}

@media screen and (max-width: @phone) {
    .m-default-template-stage {
        position: absolute;
        inset: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
    }

    .defaultTemplate,
    .defaultTemplateCount {
        position: relative;
        top: auto;
        left: auto;
        flex: 0 0 auto;
        margin: 0 !important;
        transform: scale(var(--holiday-card-mobile-scale, 0.8));
        transform-origin: center;
    }
}
</style>
