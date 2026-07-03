<template>
    <div class="m-skin-scene-preview m-app-authorbg-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone">
                <div class="m-header" :style="imageStyle">
                    <video v-if="animationUrl" class="u-animation" :src="animationUrl" autoplay muted loop playsinline></video>
                    <div class="u-avatar"></div>
                    <div class="u-info">
                        <b></b>
                        <span></span>
                    </div>
                </div>
                <div class="m-body">
                    <div class="u-tabs"><i v-for="index in 2" :key="index"></i></div>
                    <div class="u-list" v-for="index in 4" :key="index">
                        <b></b>
                        <div>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App个人主页头部<SkinSceneAuthors :authors="authors" /></b>
            <span>homebg / app_authorbg</span>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
import SkinSceneAuthors from "./SkinSceneAuthors.vue";
const normalizeSkinUrl = (url) => {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};
export default {
    name: "AppAuthorbgSkinScene",
    props: {
        theme: { type: String, default: "all" },
        skinConfig: { type: Object, default: null },
        authors: { type: Array, default: () => [] },
    },
    components: {
        SkinSceneAuthors,
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
@import "./mobile-header-scene.less";

.m-app-authorbg-skin-scene {
    .m-scene-stage {
        min-height: 740px;
        padding: 30px;
    }

    .m-phone {
        width: 375px !important;
        height: 667px !important;
        border-width: 7px;
        border-radius: 34px;
        background: #f8fafc;
    }

    .m-header {
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        height: 282px;
        padding: 74px 28px 36px;
        background-position: center top;
        background-size: cover;
    }

    .u-avatar {
        width: 78px;
        height: 78px;
        flex: 0 0 78px;
        margin: 0 0 16px;
        border-width: 6px;
        background: rgba(226, 232, 240, 0.86);
    }

    .u-info {
        width: 100%;
        padding-bottom: 0;

        b {
            width: 118px;
            height: 16px;
            background: rgba(255, 255, 255, 0.86);
        }

        span {
            width: 72px;
            height: 12px;
            margin-top: 10px;
            background: rgba(255, 255, 255, 0.78);
        }
    }

    .m-body {
        position: relative;
        z-index: 2;
        box-sizing: border-box;
        min-height: calc(100% - 250px);
        margin-top: -32px;
        padding: 30px 28px 26px;
        border-radius: 32px 32px 0 0;
        background: #fff;
        box-shadow: 0 -12px 26px rgba(15, 23, 42, 0.1);
    }

    .u-tabs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
        margin: 0 -28px 22px;
        padding: 0 28px 16px;
        border-bottom: 1px solid #edf0f5;

        i {
            height: 18px;
            border-radius: 999px;
            background: #e5e7eb;
        }
    }

    .u-list {
        display: grid;
        grid-template-columns: 96px 1fr;
        align-items: center;
        gap: 14px;
        padding: 12px 0;
        margin-bottom: 0;
        border-radius: 0;
        border-bottom: 1px solid #f1f3f6;
        box-shadow: none;

        b {
            width: 96px;
            height: 52px;
            margin-bottom: 0;
            border-radius: 8px;
            background: #e5e7eb;
        }

        span {
            height: 14px;
            background: #e5e7eb;
        }

        div {
            min-width: 0;

            span {
                display: block;

                &:first-child {
                    width: 58%;
                }

                &:last-child {
                    width: 88%;
                    margin-top: 12px;
                }
            }
        }
    }
}
</style>
