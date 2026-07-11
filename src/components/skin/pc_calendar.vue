<template>
    <div class="m-skin-scene-preview m-pc-calendar-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-plate__content">
                <div class="m-welcome">
                    <div class="u-pic" :style="imageStyle"></div>
                    <div class="u-hook u-hook-left"></div>
                    <div class="u-hook u-hook-right"></div>
                </div>
                <div class="m-news">
                    <div class="m-news-header">
                        <div class="u-left"></div>
                        <div class="u-right"></div>
                    </div>
                    <div class="m-news-list">
                        <div class="u-item" v-for="(width, index) in contentWidths" :key="index">
                            <div class="u-time"></div>
                            <div>/</div>
                            <div class="u-content" :style="{ width: `${width}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>{{ $t("dashboard.skin.scenes.pc_calendar") }}<SkinSceneAuthors :authors="authors" /></b>
            <span>calendar / pc_calendar</span>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
import SkinSceneAuthors from "./SkinSceneAuthors.vue";

const normalizeSkinUrl = function (url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    if (/^(https?:)?\/\//.test(raw)) return raw;
    return __cdn + raw.replace(/^\/+/, "");
};

export default {
    name: "PcCalendarSkinScene",
    props: {
        img: {
            type: String,
            default: "",
        },
        theme: {
            type: String,
            default: "all",
        },
        skinConfig: {
            type: Object,
            default: null,
        },
        authors: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        SkinSceneAuthors,
    },
    data() {
        return {
            contentWidths: [72, 78, 68, 58, 64],
        };
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.img || this.skinConfig?.image);
        },
        imageStyle() {
            if (!this.imageUrl) return {};
            return {
                backgroundImage: `url(${this.imageUrl})`,
            };
        },
    },
};
</script>

<style lang="less" scoped>
.m-skin-scene-preview {
    width: 100%;
    color: #1f2937;
}

.m-scene-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 340px;
    padding: 32px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    background: #f8fafc;
}

.m-scene-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.5;

    b {
        color: #111827;
        font-size: 14px;
    }

    span {
        text-align: right;
    }
}

.m-plate__content {
    width: 320px;
}

.Skeleton {
    background-color: #f2f2f2;
    border-radius: 4px;
}

.m-welcome {
    position: relative;
    margin-bottom: 10px;
    border-radius: 7.5px;

    .u-pic {
        width: 100%;
        aspect-ratio: 3.2 / 1;
        background-color: #eef1f5;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: 100% auto;
        border-radius: 7.5px;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.05);
    }

    .u-hook {
        .Skeleton();
        position: absolute;
        bottom: -25px;
        width: 9px;
        height: 36px;

        &.u-hook-left {
            left: 30px;
        }

        &.u-hook-right {
            right: 30px;
        }
    }
}

.m-news {
    border: 1px solid #f1f1f4;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.03);

    .m-news-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 36px;
        padding: 0 10px;
        border-bottom: 1px dashed #eee;

        .u-left {
            .Skeleton();
            width: 237px;
            height: 19px;
        }

        .u-right {
            .Skeleton();
            width: 16px;
            height: 16px;
        }
    }

    .m-news-list {
        padding: 10px;

        .u-item {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 28px;
            padding-left: 5px;
            color: #f2f2f2;

            .u-time {
                .Skeleton();
                width: 34px;
                height: 16px;
            }

            .u-content {
                .Skeleton();
                height: 16px;
            }
        }
    }
}

@media screen and (max-width: 720px) {
    .m-scene-stage {
        min-height: 320px;
        padding: 24px 16px;
    }

    .m-plate__content {
        width: 100%;
    }
}
</style>
