<template>
    <div class="m-skin-scene-preview m-pc-sidebar-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <aside class="c-author" :style="authorStyle">
                <div class="c-author-info">
                    <div class="u-author">
                        <div class="u-avatar"></div>
                        <div class="u-info">
                            <div class="u-displayname"></div>
                            <div class="u-level"></div>
                        </div>
                    </div>
                </div>
                <div class="u-interact">
                    <span class="u-btn"></span>
                    <span class="u-btn"></span>
                </div>
                <div class="u-block c-author-medals">
                    <div class="u-label">
                        <i></i>
                        <span></span>
                    </div>
                    <div class="u-medals">
                        <b v-for="index in 4" :key="index"></b>
                    </div>
                </div>
                <div class="u-block c-author-posts">
                    <div class="u-label">
                        <i></i>
                        <span></span>
                    </div>
                    <ul class="u-list">
                        <li v-for="width in postWidths" :key="width">
                            <em></em>
                            <span :style="{ width: `${width}%` }"></span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
        <div class="m-scene-caption">
            <b>PC作者侧栏<SkinSceneAuthors :authors="authors" /></b>
            <span>sidebar / pc_sidebar</span>
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
    ct: "center top",
    mt: "center top",
    rt: "right top",
    lc: "left center",
    ml: "left center",
    cc: "center center",
    cm: "center center",
    mm: "center center",
    o: "center center",
    rc: "right center",
    mr: "right center",
    lb: "left bottom",
    cb: "center bottom",
    mb: "center bottom",
    rb: "right bottom",
};

export default {
    name: "PcSidebarSkinScene",
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
            postWidths: [86, 76, 68, 82, 58],
        };
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.img || this.skinConfig?.image);
        },
        authorStyle() {
            const style = {};
            if (this.imageUrl) {
                style.backgroundImage = `url(${this.imageUrl})`;
            }
            if (this.skinConfig?.position) {
                style.backgroundPosition = POSITION_MAP[this.skinConfig.position] || this.skinConfig.position;
            }
            return style;
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
    align-items: flex-start;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 520px;
    padding: 28px;
    overflow: auto;
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

.c-author {
    box-sizing: border-box;
    width: 320px;
    min-height: 470px;
    padding: 15px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% auto;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.Skeleton {
    border-radius: 4px;
    background: #e5e7eb;
}

.c-author-info {
    padding-top: 26px;

    .u-author {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 5px 5px 10px;
    }

    .u-avatar {
        width: 68px;
        height: 68px;
        flex-shrink: 0;
        box-sizing: border-box;
        border: 8px solid rgba(255, 255, 255, 0.78);
        border-radius: 50%;
        background: #c8ced8;
        box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
    }

    .u-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
    }

    .u-displayname {
        .Skeleton();
        width: 86px;
        height: 18px;
    }

    .u-level {
        .Skeleton();
        width: 58px;
        height: 18px;
    }
}

.u-interact {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;

    .u-btn {
        display: block;
        width: 70px;
        height: 28px;
        border: 1px solid rgba(214, 219, 228, 0.72);
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.42);
        box-shadow: none;
        backdrop-filter: blur(4px);
    }
}

.u-block {
    margin-top: 22px;
}

.u-label {
    display: flex;
    align-items: center;
    padding: 10px 0;

    i {
        .Skeleton();
        width: 18px;
        height: 18px;
        margin-right: 5px;
        border-radius: 50%;
    }

    span {
        .Skeleton();
        width: 72px;
        height: 16px;
    }
}

.c-author-medals {
    .u-medals {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
    }

    b {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background: linear-gradient(135deg, #e5e7eb, #cbd5e1);
    }
}

.c-author-posts {
    .u-list {
        list-style: none;
        margin: 0;
        padding: 0 0 0 10px;
    }

    li {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 30px;
    }

    em {
        display: block;
        width: 8px;
        color: #c4c9d4;
        font-style: normal;
        font-size: 10px;

        &::before {
            content: "";
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: currentColor;
        }
    }

    span {
        .Skeleton();
        display: block;
        height: 14px;
    }
}

@media screen and (max-width: 720px) {
    .m-scene-stage {
        padding: 20px;
    }
}
</style>
