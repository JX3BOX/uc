<template>
    <div class="m-skin-scene-preview m-pc-home-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage" :style="pageStyle">
            <div class="m-author-page">
                <div class="m-author-header" :style="bannerStyle">
                    <div class="u-avatar"></div>
                    <div class="u-user">
                        <div class="u-name"></div>
                        <div class="u-honor"></div>
                    </div>
                </div>
                <div class="m-author-primary">
                    <div class="m-left">
                        <div class="u-tabs">
                            <i v-for="index in 4" :key="index"></i>
                        </div>
                        <div class="u-post" v-for="width in postWidths" :key="width">
                            <b></b>
                            <span :style="{ width: `${width}%` }"></span>
                            <em></em>
                        </div>
                    </div>
                    <div class="m-right">
                        <div class="u-button"></div>
                        <div class="u-card" v-for="index in 3" :key="index">
                            <b></b>
                            <span></span>
                            <i></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>{{ $t("dashboard.skin.scenes.pc_home") }}<SkinSceneAuthors :authors="authors" /></b>
            <span>homebg / pc_homebg + pc_homebanner</span>
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

const POSITION_MAP = {
    lt: "left top",
    mt: "center top",
    ct: "center top",
    centop: "center top",
    rt: "right top",
    lm: "left center",
    lc: "left center",
    ml: "left center",
    mm: "center center",
    cm: "center center",
    o: "center center",
    cc: "center center",
    rm: "right center",
    mr: "right center",
    rc: "right center",
    lb: "left bottom",
    mb: "center bottom",
    cb: "center bottom",
    rb: "right bottom",
};

const resolvePosition = function (position, fallback) {
    const raw = String(position || "").trim();
    if (!raw) return fallback;
    return POSITION_MAP[raw.toLowerCase()] || raw;
};

export default {
    name: "PcHomeSkinScene",
    props: {
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
            postWidths: [72, 58, 84],
        };
    },
    computed: {
        pageConfig() {
            return this.skinConfig?.page || null;
        },
        bannerConfig() {
            return this.skinConfig?.banner || null;
        },
        pageImage() {
            return normalizeSkinUrl(this.pageConfig?.image);
        },
        bannerImage() {
            return normalizeSkinUrl(this.bannerConfig?.image);
        },
        pageStyle() {
            if (!this.pageImage) return {};
            return {
                backgroundImage: `url(${this.pageImage})`,
                backgroundPosition: resolvePosition(this.pageConfig?.position, "center top"),
            };
        },
        bannerStyle() {
            if (!this.bannerImage) return {};
            return {
                backgroundImage: `url(${this.bannerImage})`,
                backgroundPosition: resolvePosition(this.bannerConfig?.position, "right top"),
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
    box-sizing: border-box;
    width: 100%;
    min-height: 540px;
    padding: 34px;
    overflow: auto;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    background-color: #f4f6fb;
    background-repeat: no-repeat;
    background-size: cover;
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

.m-author-page {
    width: 900px;
    max-width: 100%;
    margin: 0 auto;
}

.Skeleton {
    border-radius: 6px;
    background: #e5e7eb;
}

.m-author-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 180px;
    padding: 38px 42px;
    border-radius: 5px;
    background-color: #dfe7f5;
    background-repeat: no-repeat;
    background-size: cover;
}

.u-avatar {
    width: 82px;
    height: 82px;
    flex: 0 0 82px;
    box-sizing: border-box;
    margin-right: 34px;
    border: 8px solid rgba(255, 255, 255, 0.78);
    border-radius: 50%;
    background: rgba(226, 232, 240, 0.86);
}

.u-user {
    flex: 1;
}

.u-name {
    width: 150px;
    height: 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
}

.u-honor {
    width: 180px;
    height: 16px;
    margin-top: 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
}

.m-author-primary {
    display: flex;
    gap: 18px;
    margin-top: 18px;
}

.m-left,
.m-right {
    box-sizing: border-box;
    border: 1px solid rgba(63, 68, 72, 0.14);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.94);
}

.m-left {
    flex: 1;
    min-width: 0;
    padding: 18px;
}

.m-right {
    width: 270px;
    padding: 14px;
}

.u-tabs {
    display: flex;
    gap: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf0f5;

    i {
        .Skeleton();
        width: 72px;
        height: 18px;
    }
}

.u-post {
    display: grid;
    grid-template-columns: 120px 1fr 80px;
    align-items: center;
    gap: 14px;
    padding: 18px 0;
    border-bottom: 1px solid #edf0f5;

    b {
        .Skeleton();
        display: block;
        width: 120px;
        height: 66px;
    }

    span {
        .Skeleton();
        display: block;
        height: 18px;
    }

    em {
        .Skeleton();
        display: block;
        width: 76px;
        height: 14px;
    }
}

.u-button {
    height: 34px;
    border-radius: 6px;
    background: #ff70b2;
}

.u-card {
    margin-top: 14px;
    padding: 14px 0 2px;
    text-align: left;

    b,
    span,
    i {
        .Skeleton();
        display: block;
    }

    b {
        width: 78px;
        height: 18px;
        margin-bottom: 12px;
    }

    span {
        width: 100%;
        height: 12px;
        margin-bottom: 8px;
    }

    i {
        width: 68%;
        height: 12px;
    }
}

@media screen and (max-width: 720px) {
    .m-scene-stage {
        padding: 24px;
    }

    .m-author-primary {
        display: block;
    }

    .m-right {
        width: 100%;
        margin-top: 18px;
    }
}
</style>
