<template>
    <div class="m-skin-scene-preview m-app-forum-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone" :style="imageStyle">
                <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                <div class="m-forum-feed">
                    <article class="m-forum-post" v-for="post in 2" :key="post">
                        <div class="u-post-head">
                            <i></i>
                            <div>
                                <b></b>
                                <span></span>
                            </div>
                        </div>
                        <div class="u-post-body">
                            <span v-for="line in 4" :key="line"></span>
                        </div>
                    </article>
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

.m-app-forum-skin-scene {
    .m-scene-stage {
        min-height: 740px;
        padding: 30px;
    }
}

.m-phone {
    box-sizing: border-box;
    width: 375px !important;
    height: 667px !important;
    padding: 34px 22px;
    border-width: 7px;
    border-radius: 34px;
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

.m-forum-feed {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.m-forum-post {
    box-sizing: border-box;
    padding: 22px 20px 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(3px);

    &:nth-child(2) {
        opacity: 0.92;
    }
}

.u-post-head {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 28px;

    i {
        width: 54px;
        height: 54px;
        flex: 0 0 54px;
        box-sizing: border-box;
        border: 7px solid rgba(255, 255, 255, 0.72);
        border-radius: 50%;
        background: rgba(226, 232, 240, 0.82);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    }

    div {
        flex: 1;
        min-width: 0;
    }

    b,
    span {
        display: block;
        border-radius: 999px;
        background: rgba(226, 232, 240, 0.88);
    }

    b {
        width: 112px;
        height: 8px;
        margin-bottom: 14px;
    }

    span {
        width: 88px;
        height: 8px;
    }
}

.u-post-body {
    display: flex;
    flex-direction: column;
    gap: 14px;

    span {
        display: block;
        height: 10px;
        border-radius: 999px;
        background: rgba(226, 232, 240, 0.9);
    }

    span:nth-child(1),
    span:nth-child(2) {
        width: 100%;
    }

    span:nth-child(3) {
        width: 96%;
    }

    span:nth-child(4) {
        width: 86%;
    }
}

.is-theme-dark {
    .m-forum-post {
        background: rgba(17, 24, 39, 0.72);
    }

    .u-post-head i,
    .u-post-head b,
    .u-post-head span,
    .u-post-body span {
        background: rgba(71, 85, 105, 0.86);
    }
}
</style>
