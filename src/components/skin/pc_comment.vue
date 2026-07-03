<template>
    <div class="m-skin-scene-preview m-pc-comment-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-comment-list">
                <div class="c-comment-cmt">
                    <div class="c-comment-cmt__box" :style="commentStyle">
                        <div class="c-comment-avatar">
                            <span class="u-avatar">
                                <i class="u-avatar-pic"></i>
                                <i class="u-avatar-frame"></i>
                            </span>
                        </div>
                        <div class="u-flex-1">
                            <div class="c-comment-cmt__author">
                                <span class="u-name"></span>
                            </div>
                            <div class="u-cmt">
                                <div class="u-text"></div>
                                <div class="u-toolbar">
                                    <span v-for="item in actions" :key="item" class="u-action">
                                        <i></i>
                                        <b :style="{ width: `${item}px` }"></b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c-comment-cmt is-secondary">
                    <div class="c-comment-cmt__box">
                        <div class="c-comment-avatar">
                            <span class="u-avatar">
                                <i class="u-avatar-pic"></i>
                                <i class="u-avatar-frame"></i>
                            </span>
                        </div>
                        <div class="u-flex-1">
                            <div class="c-comment-cmt__author">
                                <span class="u-name"></span>
                            </div>
                            <div class="u-cmt">
                                <div class="u-text"></div>
                                <div class="u-toolbar">
                                    <span v-for="item in actions.slice(0, 4)" :key="item" class="u-action">
                                        <i></i>
                                        <b :style="{ width: `${item}px` }"></b>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>PC评论背景<SkinSceneAuthors :authors="authors" /></b>
            <span>comment / pc_comment</span>
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

export default {
    name: "PcCommentSkinScene",
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
            actions: [32, 32, 32, 32, 32, 36],
        };
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.img || this.skinConfig?.image);
        },
        commentStyle() {
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
    box-sizing: border-box;
    width: 100%;
    min-height: 420px;
    padding: 34px 42px;
    overflow: auto;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    background: #fff;
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

.m-comment-list {
    width: 920px;
    max-width: 100%;
    margin: 0 auto;
    background: #fff;
}

.Skeleton {
    border-radius: 999px;
    background: #dfe3eb;
}

.c-comment-cmt {
    border-bottom: 1px solid #edf0f5;

    &.is-secondary {
        opacity: 0.64;
    }
}

.c-comment-cmt__box {
    display: flex;
    box-sizing: border-box;
    min-height: 118px;
    padding: 18px 18px 16px 20px;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: right top;
    border-radius: 8px;
}

.c-comment-avatar {
    width: 86px;
    flex: 0 0 86px;
    padding-top: 4px;
}

.u-avatar {
    position: relative;
    display: block;
    width: 48px;
    height: 48px;
    margin-left: 0;
}

.u-avatar-pic {
    position: absolute;
    inset: 0;
    display: block;
    border-radius: 50%;
    background: #d7dce6;
}

.u-avatar-frame {
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    width: 68px;
    height: 68px;
    box-sizing: border-box;
    border: 4px solid rgba(99, 102, 241, 0.35);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.u-flex-1 {
    flex: 1;
    min-width: 0;
}

.c-comment-cmt__author {
    display: flex;
    align-items: center;
    height: 18px;
}

.u-name {
    display: block;
    width: 66px;
    height: 14px;
    border-radius: 5px;
    background: #d1d5db;
}

.u-cmt {
    padding: 10px 0 0;
}

.u-text {
    width: 320px;
    max-width: 55%;
    height: 18px;
    border-radius: 999px;
    background: #d1d5db;
}

.u-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 22px;
    margin-top: 20px;
}

.u-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    i,
    b {
        display: block;
        background: #b7bfce;
    }

    i {
        width: 13px;
        height: 13px;
        border-radius: 50%;
    }

    b {
        height: 13px;
        border-radius: 999px;
    }
}

@media screen and (max-width: 720px) {
    .m-scene-stage {
        padding: 26px;
    }

    .u-toolbar {
        gap: 14px;
    }
}
</style>
