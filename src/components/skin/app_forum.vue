<template>
    <div class="m-skin-scene-preview m-app-forum-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone" :style="imageStyle">
                <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                <div class="u-top">
                    <i></i>
                    <span></span>
                </div>
                <div class="u-tabs">
                    <b v-for="index in 4" :key="index"></b>
                </div>
                <div class="m-post" v-for="index in 4" :key="index">
                    <i></i>
                    <div>
                        <b></b>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App论坛背景</b>
            <span>comment / app_forum</span>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";

const normalizeSkinUrl = function (url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};

export default {
    name: "AppForumSkinScene",
    props: {
        theme: {
            type: String,
            default: "all",
        },
        skinConfig: {
            type: Object,
            default: null,
        },
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.skinConfig?.image);
        },
        animationUrl() {
            return normalizeSkinUrl(this.skinConfig?.animation);
        },
        imageStyle() {
            return this.imageUrl ? { backgroundImage: `url(${this.imageUrl})` } : {};
        },
    },
};
</script>

<style lang="less" scoped>
@import "./mobile-scene.less";

.m-phone {
    box-sizing: border-box;
    padding: 26px 16px;
    background-color: #f2f5fa;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
}

.u-animation {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

.u-top,
.u-tabs,
.m-post {
    position: relative;
    z-index: 1;
}

.u-top {
    display: flex;
    align-items: center;
    gap: 10px;

    i {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.82);
    }

    span {
        width: 118px;
        height: 18px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.82);
    }
}

.u-tabs {
    display: flex;
    gap: 12px;
    margin: 24px 0 18px;

    b {
        width: 42px;
        height: 20px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.82);
    }
}

.m-post {
    display: flex;
    gap: 12px;
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(3px);

    i {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        border-radius: 12px;
        background: #dbe3ef;
    }

    div {
        flex: 1;
    }

    b,
    span {
        display: block;
        border-radius: 999px;
        background: #e5e7eb;
    }

    b {
        width: 80%;
        height: 14px;
        margin-bottom: 10px;
    }

    span {
        width: 56%;
        height: 12px;
    }
}
</style>
