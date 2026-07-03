<template>
    <div class="m-skin-scene-preview m-pc-authorcard-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-editor-mock">
                <div class="u-toolbar">
                    <i v-for="index in 8" :key="index"></i>
                </div>
                <div class="u-content">
                    <p><span></span><span class="is-short"></span></p>
                    <p>
                        <span class="is-mid"></span>
                        <b>@you</b>
                        <em></em>
                    </p>
                    <p><span class="is-long"></span></p>
                </div>
                <div class="w-author">
                    <div class="w-author-wrapper" :style="authorCardStyle">
                        <div class="u-author">
                            <div class="u-avatar"></div>
                            <div class="u-info">
                                <div class="u-displayname"></div>
                                <div class="u-extend">
                                    <i></i>
                                    <i></i>
                                </div>
                            </div>
                        </div>
                        <div class="u-trophy">
                            <div class="m-medal">
                                <b v-for="index in 5" :key="index"></b>
                            </div>
                        </div>
                        <div class="u-author-role">
                            <div class="u-author-role-label"></div>
                            <div class="u-author-role-item" v-for="width in roleWidths" :key="width">
                                <i></i>
                                <span :style="{ width: `${width}px` }"></span>
                                <em></em>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>PC个人名片</b>
            <span>atcard / pc_authorcard</span>
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
    name: "PcAuthorcardSkinScene",
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
    },
    data() {
        return {
            roleWidths: [92, 112],
        };
    },
    computed: {
        imageUrl() {
            return normalizeSkinUrl(this.img || this.skinConfig?.image);
        },
        authorCardStyle() {
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
    min-height: 500px;
    padding: 34px;
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

.Skeleton {
    border-radius: 999px;
    background: #e5e7eb;
}

.m-editor-mock {
    position: relative;
    box-sizing: border-box;
    width: 760px;
    max-width: 100%;
    min-height: 390px;
    margin: 0 auto;
    padding: 22px 26px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.u-toolbar {
    display: flex;
    gap: 10px;
    padding-bottom: 18px;
    border-bottom: 1px solid #edf0f5;

    i {
        .Skeleton();
        width: 28px;
        height: 22px;
        border-radius: 5px;
        background: #f0f2f7;
    }
}

.u-content {
    padding-top: 26px;

    p {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 32px;
        margin: 0 0 14px;
    }

    span,
    em {
        .Skeleton();
        display: block;
        height: 15px;
    }

    span {
        width: 180px;
    }

    .is-short {
        width: 96px;
    }

    .is-mid {
        width: 140px;
    }

    .is-long {
        width: 420px;
    }

    em {
        width: 155px;
    }

    b {
        position: relative;
        z-index: 2;
        color: #635bff;
        font-size: 15px;
        line-height: 24px;
        cursor: default;
    }
}

.w-author {
    position: absolute;
    left: 170px;
    top: 170px;
    z-index: 1;
}

.w-author-wrapper {
    box-sizing: border-box;
    width: 300px;
    min-width: 300px;
    max-width: 300px;
    padding: 12px;
    border: 1px solid rgba(132, 146, 166, 0.28);
    border-radius: 8px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: top right;
    background-size: 100% auto;
    box-shadow:
        0 14px 34px rgba(31, 41, 55, 0.16),
        0 2px 8px rgba(31, 41, 55, 0.08);

}

.u-author {
    display: flex;
    align-items: center;
    padding: 4px 10px 12px 5px;
}

.u-avatar {
    width: 60px;
    height: 60px;
    flex: 0 0 60px;
    box-sizing: border-box;
    margin-right: 12px;
    border: 4px solid rgba(99, 102, 241, 0.24);
    border-radius: 50%;
    background: #cbd5e1;
}

.u-info {
    flex: 1;
    min-width: 0;
}

.u-displayname {
    .Skeleton();
    width: 118px;
    height: 17px;
    background: #d6dbe5;
}

.u-extend {
    display: flex;
    gap: 7px;
    margin-top: 10px;

    i {
        display: block;
        width: 46px;
        height: 18px;
        border-radius: 3px;
        background: #d6dbe5;

        &:first-child {
            background: #e2e5ec;
        }
    }
}

.u-trophy {
    padding: 2px 0 8px;
}

.m-medal {
    display: flex;
    gap: 6px;

    b {
        display: block;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: #d6dbe5;
    }
}

.u-author-role {
    margin-top: 8px;
}

.u-author-role-label {
    height: 1px;
    margin: 0 0 8px;
    background-color: rgba(154, 167, 181, 0.28);
}

.u-author-role-item {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 22px;

    i {
        display: block;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        border-radius: 50%;
        background: #d6dbe5;
    }

    span {
        .Skeleton();
        display: block;
        height: 12px;
    }

    em {
        .Skeleton();
        display: block;
        width: 42px;
        height: 12px;
        background: #d6dbe5;
    }
}

@media screen and (max-width: 720px) {
    .m-scene-stage {
        padding: 24px;
    }

    .w-author {
        left: 120px;
    }
}
</style>
