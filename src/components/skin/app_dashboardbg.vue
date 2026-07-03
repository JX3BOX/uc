<template>
    <div class="m-skin-scene-preview m-app-dashboardbg-skin-scene" :class="`is-theme-${theme}`">
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
                    <div class="u-stats">
                        <i v-for="index in 3" :key="index"></i>
                    </div>
                    <div class="u-list" v-for="index in 4" :key="index">
                        <b></b>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App个人中心头部</b>
            <span>homebg / app_dashboardbg</span>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
const normalizeSkinUrl = (url) => {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};
export default {
    name: "AppDashboardbgSkinScene",
    props: {
        theme: { type: String, default: "all" },
        skinConfig: { type: Object, default: null },
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
</style>
