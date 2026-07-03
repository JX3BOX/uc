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
                    <div class="m-bottom-panel" :style="imageStyle">
                        <div class="u-panel-top"></div>
                        <div class="u-panel-bottom">
                            <div class="u-panel-divider"></div>
                            <div class="u-panel-author">
                                <i></i>
                                <b></b>
                            </div>
                            <div class="u-panel-lines">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div class="m-card-list">
                        <div
                            class="m-content-card"
                            :class="{ 'is-align-right': card === 2 }"
                            v-for="card in 2"
                            :key="card"
                        >
                            <div class="u-card-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App个人名片<SkinSceneAuthors :authors="authors" /></b>
            <span>atcard / app_authorcard</span>
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
        authors: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        SkinSceneAuthors,
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.skinConfig?.image);
        },
        imageStyle() {
            return this.imageUrl ? { backgroundImage: `url(${this.imageUrl})` } : {};
        },
    },
};
</script>

<style lang="less" scoped>
@import "./mobile-scene.less";

.m-app-authorcard-skin-scene {
    .m-scene-stage {
        min-height: 740px;
        padding: 30px;
    }

    .m-phone {
        width: 375px !important;
        height: 667px !important;
        border-width: 7px;
        border-radius: 34px;
        background: #f4f6fb;
    }
}

.m-forum {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 34px 20px;
}

.u-post {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 118px;
    padding: 20px 14px;
    margin-bottom: 12px;
    border-radius: 14px;
    background: #fff;

    i {
        width: 56px;
        height: 56px;
        flex: 0 0 56px;
        box-sizing: border-box;
        border: 5px solid rgba(99, 102, 241, 0.24);
        border-radius: 50%;
        background: #dbe3ef;
    }

    div {
        flex: 1;
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

.m-card-list {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-sizing: border-box;
    margin-top: 54px;
}

.m-bottom-panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    box-sizing: border-box;
    height: 260px;
    overflow: hidden;
    border-radius: 32px 32px 0 0;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: right top;
    background-size: cover;
    box-shadow: 0 -12px 26px rgba(15, 23, 42, 0.1);
    pointer-events: none;
}

.u-panel-top {
    height: 118px;
}

.u-panel-bottom {
    position: relative;
    box-sizing: border-box;
    height: calc(100% - 118px);
    padding: 22px 28px 30px;
    background: #fff;
}

.u-panel-divider {
    height: 1px;
    margin: -22px -28px 32px;
    background: #edf0f5;
}

.u-panel-author {
    position: relative;
    display: flex;
    align-items: center;
    gap: 18px;
    height: 40px;
    margin-top: -44px;
    margin-bottom: 22px;

    i {
        width: 86px;
        height: 86px;
        flex: 0 0 86px;
        box-sizing: border-box;
        border: 6px solid rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        background: rgba(226, 232, 240, 0.9);
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
    }

    b {
        display: block;
        width: 96px;
        height: 12px;
        margin-top: 22px;
        border-radius: 999px;
        background: #d6dbe5;
    }
}

.u-panel-lines {
    padding-top: 24px;

    span {
        display: block;
        height: 10px;
        border-radius: 999px;
        background: #d6dbe5;

        & + span {
            margin-top: 20px;
        }

        &:nth-child(1) {
            width: 80%;
        }

        &:nth-child(2) {
            width: 68%;
        }
    }
}

.m-content-card {
    position: relative;
    box-sizing: border-box;
    min-height: 150px;
    padding: 34px 28px;
    overflow: hidden;
    border-radius: 22px;
    background-color: #f8fafc;
    background-repeat: no-repeat;
    background-position: right top;
    background-size: cover;
}

.u-card-lines {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    span {
        display: block;
        height: 14px;
        border-radius: 999px;
        background: rgba(214, 219, 229, 0.9);

        & + span {
            margin-top: 20px;
        }

        &:nth-child(1) {
            width: 72%;
        }

        &:nth-child(2) {
            width: 92%;
        }

        &:nth-child(3) {
            width: 78%;
        }
    }
}

.is-align-right {
    .u-card-lines {
        align-items: flex-end;
    }
}
</style>
