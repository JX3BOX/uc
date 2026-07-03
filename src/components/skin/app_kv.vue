<template>
    <div class="m-skin-scene-preview m-app-kv-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone" :style="phoneStyle">
                <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                <div class="m-kv"></div>
                <div class="m-content">
                    <div class="u-quick-list">
                        <div class="u-quick-row" v-for="index in 4" :key="index">
                            <i></i>
                            <span></span>
                        </div>
                    </div>
                    <div class="u-divider-line"></div>
                    <div class="u-feed-list">
                        <div class="u-feed-row" v-for="index in 2" :key="index">
                            <i></i>
                            <div>
                                <b></b>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App首屏KV</b>
            <span>calendar / app_kv</span>
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
    name: "AppKvSkinScene",
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
        phoneStyle() {
            return this.imageUrl ? { backgroundImage: `url(${this.imageUrl})` } : {};
        },
    },
};
</script>

<style lang="less" scoped>
@import "./mobile-scene.less";

.m-app-kv-skin-scene {
    .m-scene-stage {
        min-height: 740px;
        padding: 30px;
    }

    .m-phone {
        width: 375px !important;
        height: 667px !important;
        border-width: 7px;
        border-radius: 34px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: right top;
        background-size: 100% auto;
    }
}

.m-kv {
    position: relative;
    height: 230px;
    overflow: hidden;
}

.u-animation {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
}

.m-content {
    box-sizing: border-box;
    height: calc(100% - 230px + 28px);
    margin-top: -28px;
    padding: 48px 38px 30px;
    border-radius: 30px 30px 0 0;
    background: #fff;
    position: relative;
    z-index: 1;
    box-shadow: 0 -12px 28px rgba(15, 23, 42, 0.12);
}

.u-quick-row {
    display: grid;
    grid-template-columns: 16px 1fr;
    align-items: center;
    gap: 26px;
    margin-bottom: 14px;

    i,
    span {
        display: block;
        background: #edf2f7;
    }

    i {
        width: 16px;
        height: 16px;
        border-radius: 5px;
    }

    span {
        height: 10px;
        border-radius: 999px;
    }
}

.u-divider-line {
    width: 132px;
    height: 12px;
    margin: 42px auto 36px;
    border-radius: 999px;
    background: #edf2f7;
}

.u-feed-row {
    display: grid;
    grid-template-columns: 124px 1fr;
    align-items: center;
    gap: 18px;
    margin-bottom: 18px;

    i,
    b,
    span {
        display: block;
        background: #edf2f7;
    }

    i {
        height: 72px;
        border-radius: 6px;
    }

    b,
    span {
        height: 10px;
        border-radius: 999px;
    }

    b {
        width: 92%;
        margin-bottom: 16px;
    }

    span {
        width: 74%;
    }
}

.is-theme-dark {
    .m-content {
        background: #171717;
    }

    .u-quick-row i,
    .u-quick-row span,
    .u-divider-line,
    .u-feed-row i,
    .u-feed-row b,
    .u-feed-row span {
        background: #303030;
    }
}
</style>
