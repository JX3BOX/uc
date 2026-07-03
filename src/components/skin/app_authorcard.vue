<template>
    <div class="m-skin-scene-preview m-app-authorcard-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone">
                <div class="m-forum">
                    <div class="u-post">
                        <i></i>
                        <div>
                            <b></b>
                            <span></span>
                        </div>
                    </div>
                    <div class="u-post is-active">
                        <i></i>
                        <div>
                            <b></b>
                            <span></span>
                        </div>
                    </div>
                    <div class="m-pop-card" :style="imageStyle">
                        <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                        <div class="u-avatar"></div>
                        <div class="u-name"></div>
                        <div class="u-meta"></div>
                        <div class="u-actions">
                            <i></i>
                            <i></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App用户卡片</b>
            <span>atcard / app_authorcard</span>
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
    name: "AppAuthorcardSkinScene",
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
    background: #f4f6fb;
}

.m-forum {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 28px 16px;
}

.u-post {
    display: flex;
    gap: 12px;
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 14px;
    background: #fff;

    i {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        border-radius: 50%;
        background: #dbe3ef;
    }

    div {
        flex: 1;
        padding-top: 4px;
    }

    b,
    span {
        display: block;
        border-radius: 999px;
        background: #e5e7eb;
    }

    b {
        width: 74%;
        height: 14px;
        margin-bottom: 10px;
    }

    span {
        width: 52%;
        height: 12px;
    }
}

.is-active {
    i {
        border: 4px solid rgba(99, 102, 241, 0.24);
        box-sizing: border-box;
    }
}

.m-pop-card {
    position: absolute;
    left: 18px;
    right: 18px;
    top: 150px;
    box-sizing: border-box;
    min-height: 210px;
    padding: 22px 18px 18px;
    overflow: hidden;
    border-radius: 18px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right top;
    background-size: cover;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.28);
    }
}

.u-animation {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

.m-pop-card .u-avatar,
.m-pop-card .u-name,
.m-pop-card .u-meta,
.m-pop-card .u-actions {
    position: relative;
    z-index: 1;
}

.m-pop-card .u-avatar {
    width: 62px;
    height: 62px;
    box-sizing: border-box;
    border: 5px solid rgba(99, 102, 241, 0.22);
    border-radius: 50%;
    background: #cbd5e1;
}

.u-name,
.u-meta {
    border-radius: 999px;
    background: #d6dbe5;
}

.u-name {
    width: 118px;
    height: 17px;
    margin-top: 16px;
}

.u-meta {
    width: 165px;
    height: 13px;
    margin-top: 10px;
}

.u-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;

    i {
        display: block;
        flex: 1;
        height: 32px;
        border-radius: 10px;
        background: #d6dbe5;
    }
}
</style>
