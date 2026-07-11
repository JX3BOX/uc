<template>
    <a
        class="c-avatar"
        :href="authorLink(uid)"
        :class="sizeClass"
        :style="avatarStyle"
    >
        <img :src="avatarUrl" class="c-avatar-pic" alt="" />
        <i v-if="frame" class="c-avatar-frame" :style="frameStyle">
            <img :src="frameUrl" alt="" />
        </i>
        <slot></slot>
    </a>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";

const DISPLAY_STYLES = {
    xxs: { avatar: 36, frame: 48 },
    xs: { avatar: 48, frame: 68 },
    s: { avatar: 68, frame: 88 },
    m: { avatar: 88, frame: 123 },
    l: { avatar: 120, frame: 168 },
    xl: { avatar: 150, frame: 210 },
};

export default {
    name: "RetinaAvatar",
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
        url: {
            type: String,
            default: "",
        },
        frame: {
            type: String,
            default: "",
        },
        size: {
            type: [Number, String],
            default: "m",
        },
        pixelRatio: {
            type: Number,
            default: 2,
        },
    },
    computed: {
        displayStyle() {
            if (typeof this.size === "number") {
                return {
                    avatar: this.size,
                    frame: Math.round(this.size * 1.4),
                };
            }
            return DISPLAY_STYLES[this.size] || DISPLAY_STYLES.m;
        },
        sizeClass() {
            return typeof this.size === "string" ? this.size : "";
        },
        avatarUrl() {
            return showAvatar(this.url, Math.round(this.displayStyle.avatar * this.pixelRatio));
        },
        frameUrl() {
            return `${JX3BOX.__imgPath}avatar/images/${this.frame}/${this.frame}.svg`;
        },
        avatarStyle() {
            const size = `${this.displayStyle.avatar}px`;
            return { width: size, height: size };
        },
        frameStyle() {
            const avatarHalf = this.displayStyle.avatar / 2;
            const frameHalf = this.displayStyle.frame / 2;
            return {
                width: `${this.displayStyle.frame}px`,
                height: `${this.displayStyle.frame}px`,
                left: `${avatarHalf}px`,
                top: `${avatarHalf}px`,
                marginLeft: `${-frameHalf}px`,
                marginTop: `${-frameHalf}px`,
            };
        },
    },
    methods: {
        authorLink,
    },
};
</script>

<style scoped lang="less">
.c-avatar {
    position: relative;
    display: inline-block;
    border-radius: 100%;
    background-color: #fff;
}

.c-avatar-pic {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
}

.c-avatar-frame {
    position: absolute;
    box-sizing: content-box;

    img {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
