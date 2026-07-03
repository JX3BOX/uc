<template>
    <div class="m-skin-scene-preview m-app-kv-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone" :style="phoneStyle">
                <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                <div class="m-kv"></div>
                <div class="m-content"></div>
                <div class="m-tabbar">
                    <i v-for="index in 4" :key="index"></i>
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
    height: calc(100% - 230px - 74px + 28px);
    margin-top: -28px;
    border-radius: 30px 30px 0 0;
    background: #fff;
    position: relative;
    z-index: 1;
    box-shadow: 0 -12px 28px rgba(15, 23, 42, 0.12);
}

.m-tabbar {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    height: 74px;
    padding: 12px 34px 18px;
    box-sizing: border-box;
    background: #f1f5f9;

    i {
        display: block;
        width: 34px;
        height: 34px;
        margin: 0 auto;
        border-radius: 50%;
        background: #fff;
    }
}

.is-theme-dark {
    .m-content {
        background: #171717;
    }

    .m-tabbar {
        background: #262626;
    }

    .m-tabbar i {
        background: #fff;
    }
}
</style>
