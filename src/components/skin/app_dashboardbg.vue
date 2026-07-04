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
            <b>App个人中心头部<SkinSceneAuthors :authors="authors" /></b>
            <span>homebg / app_dashboardbg</span>
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
    name: "AppDashboardbgSkinScene",
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

.m-app-dashboardbg-skin-scene {
    .m-scene-stage {
        min-height: 740px;
        padding: 30px;
    }

    .m-phone {
        width: 375px !important;
        height: 667px !important;
        border-width: 7px;
        border-radius: 34px;
    }

    .m-header {
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
        padding: 0 26px 26px;
    }

    .u-avatar {
        margin: 0 0 12px;
    }

    .u-info {
        flex: 0 0 auto;
        width: 100%;
        padding-bottom: 0;

        b {
            width: 160px;
        }

        span {
            width: 200px;
        }
    }
}
</style>
