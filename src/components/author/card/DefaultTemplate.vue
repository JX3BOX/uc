<template>
    <div :class="count ? 'defaultTemplateCount' : 'defaultTemplate'">
        <template v-if="!count">
            <div class="m-count" :class="{ flipper }">
                <img :src="countImg" v-if="countImg" class="u-count" />
            </div>
            <img :src="countBg" v-if="countBg" class="u-img u-bg" :class="{ flipper }" @click="close" />
            <div class="u-img u-img-cover" @click.stop="hide" :class="{ active, flipper }">
                <img :src="item" v-for="(item, i) in imgList" :key="i" :class="`u-pic u-pic-${2 - i}`" />
            </div>
        </template>
        <template v-else>
            <div class="m-count">
                <img :src="item" v-for="(item, index) in countImgList" :key="index" class="u-count" />
            </div>
            <img :src="imgList[1]" class="u-img" @click="close" />
            <img
                :src="imgList[0]"
                class="u-img u-img-cover"
                :class="['animation', { fadeOutUp: flipper }, { none: active }]"
                @click.stop="hide"
            />
        </template>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
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
    },
    data() {
        return {
            active: false,
            flipper: false,
        };
    },

    methods: {
        close() {
            this.active = false;
            this.$emit("checked");
            this.$emit("close");
        },
        hide() {
            this.flipper = true;

            setTimeout(() => {
                this.active = true;
                this.$emit("checked");
            }, 600);
        },
    },
};
</script>
<style lang="less" scope>
.defaultTemplate {
    .pr;
    .pointer;
    .auto(x);
    .ct(o,360px,610px);
    .size(360px,610px);
    .u-img {
        .full;
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
    @media screen and (max-width: @phone) {
        zoom: 0.8;
    }
}
.defaultTemplateCount {
    .pr;
    .pointer;
    .auto(x);
    .ct(o,420px,720px);
    .size(420px,720px);
    .u-img {
        .full;
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
    @media screen and (max-width: @phone) {
        zoom: 0.8;
    }
}
</style>
