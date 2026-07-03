<template>
    <div class="m-skin-scene-preview" :class="sceneClass">
        <div class="m-scene-stage">
            <div v-if="layout === 'pcCalendar'" class="m-pc-calendar">
                <div class="u-calendar-art"></div>
                <div class="u-calendar-hook u-left"></div>
                <div class="u-calendar-hook u-right"></div>
                <div class="m-calendar-card">
                    <div class="u-card-title"></div>
                    <div class="u-card-action"></div>
                    <div class="u-divider"></div>
                    <div class="u-calendar-row" v-for="index in 5" :key="index">
                        <span></span>
                        <i></i>
                        <b :style="{ width: `${itemWidth(index)}%` }"></b>
                    </div>
                </div>
            </div>

            <div v-else-if="layout === 'appKv'" class="m-phone m-app-kv">
                <div class="u-phone-status"></div>
                <div class="u-kv-layer"></div>
                <div class="m-kv-search"></div>
                <div class="m-kv-grid">
                    <span v-for="index in 8" :key="index"></span>
                </div>
                <div class="m-kv-feed">
                    <i v-for="index in 3" :key="index"></i>
                </div>
            </div>

            <div v-else-if="layout === 'appHeader'" class="m-phone m-app-header">
                <div class="u-header-bg"></div>
                <div class="u-avatar"></div>
                <div class="u-name"></div>
                <div class="m-stats">
                    <span v-for="index in 3" :key="index"></span>
                </div>
                <div class="m-list">
                    <i v-for="index in 4" :key="index"></i>
                </div>
            </div>

            <div v-else-if="layout === 'appForum'" class="m-phone m-app-forum">
                <div class="u-forum-bg"></div>
                <div class="m-forum-tabs">
                    <span v-for="index in 4" :key="index"></span>
                </div>
                <div class="m-forum-card" v-for="index in 3" :key="index">
                    <i></i>
                    <div>
                        <span></span>
                        <b></b>
                    </div>
                </div>
            </div>

            <div v-else-if="layout === 'appAuthorCard'" class="m-phone m-card-list">
                <div class="m-author-card">
                    <div class="u-card-bg"></div>
                    <div class="u-avatar"></div>
                    <div class="u-name"></div>
                    <div class="u-meta"></div>
                </div>
                <div class="m-list">
                    <i v-for="index in 4" :key="index"></i>
                </div>
            </div>

            <div v-else-if="layout === 'pcAuthorCard'" class="m-pc-author-card">
                <div class="m-editor-line" v-for="index in 3" :key="index">
                    <span></span>
                </div>
                <div class="m-hover-card">
                    <div class="u-card-bg"></div>
                    <div class="u-avatar"></div>
                    <div class="u-name"></div>
                    <div class="u-meta"></div>
                </div>
            </div>

            <div v-else-if="layout === 'pcSidebar'" class="m-pc-sidebar">
                <div class="m-main-doc">
                    <span v-for="index in 6" :key="index"></span>
                </div>
                <aside class="m-sidebar-card">
                    <div class="u-sidebar-bg"></div>
                    <div class="u-avatar"></div>
                    <div class="u-name"></div>
                    <i v-for="index in 4" :key="index"></i>
                </aside>
            </div>

            <div v-else-if="layout === 'pcComment'" class="m-pc-comment">
                <div class="m-comment-main">
                    <div class="u-comment-bg"></div>
                    <div class="m-comment-item" v-for="index in 3" :key="index">
                        <i></i>
                        <div>
                            <span></span>
                            <b></b>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="layout === 'pcHomeBanner'" class="m-pc-home">
                <div class="u-home-banner"></div>
                <div class="u-home-avatar"></div>
                <div class="u-home-name"></div>
                <div class="m-home-tabs">
                    <span v-for="index in 4" :key="index"></span>
                </div>
            </div>

            <div v-else-if="layout === 'pcHomeBg'" class="m-pc-home m-pc-home-bg">
                <div class="u-home-page-bg"></div>
                <div class="m-home-card">
                    <div class="u-home-avatar"></div>
                    <div class="u-home-name"></div>
                    <span v-for="index in 3" :key="index"></span>
                </div>
            </div>

            <div v-else-if="layout === 'tabbar'" class="m-phone m-app-tabbar">
                <div class="m-tab-content">
                    <span v-for="index in 5" :key="index"></span>
                </div>
                <div class="m-tabbar">
                    <div
                        class="u-tab-item"
                        v-for="item in tabItems"
                        :key="item.key"
                        :class="{
                            'is-target': item.key === targetTab,
                            'is-active': item.active,
                        }"
                    >
                        <i></i>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>{{ title }}<SkinSceneAuthors :authors="authors" /></b>
            <span>{{ subtitle }}</span>
        </div>
    </div>
</template>

<script>
import SkinSceneAuthors from "./SkinSceneAuthors.vue";

const TAB_ITEM_KEYS = ["home", "nav", "forum", "dashboard"];

export default {
    name: "SkinScenePreview",
    components: {
        SkinSceneAuthors,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            default: "",
        },
        layout: {
            type: String,
            required: true,
        },
        targetTab: {
            type: String,
            default: "home",
        },
        activeTab: {
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
    computed: {
        sceneClass() {
            return [`is-${this.layout}`, `is-target-${this.targetTab}`, `is-theme-${this.theme}`];
        },
        tabItems() {
            return TAB_ITEM_KEYS.map((key) => ({
                key,
                active: this.activeTab ? key === this.activeTab : key === this.targetTab,
            }));
        },
    },
    methods: {
        itemWidth(index) {
            return [74, 75, 80, 66, 58][index - 1] || 70;
        },
    },
};
</script>

<style lang="less" scoped>
@stage-bg: #0b1728;
@skin-blue: #2563eb;
@skin-pink: #f472b6;

.m-skin-scene-preview {
    width: 100%;
    color: #1f2937;
}

.m-scene-stage {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 260px;
    padding: 32px;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 8px;
    background:
        radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.25), transparent 36%),
        linear-gradient(180deg, #07111f 0%, @stage-bg 100%);
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

.m-phone {
    position: relative;
    width: 180px;
    height: 320px;
    margin: 0 auto;
    overflow: hidden;
    border: 6px solid #111827;
    border-radius: 28px;
    background: #f8fafc;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.28);
}

.u-phone-status {
    position: absolute;
    top: 8px;
    left: 64px;
    z-index: 2;
    width: 52px;
    height: 5px;
    border-radius: 99px;
    background: rgba(15, 23, 42, 0.24);
}

.m-pc-calendar {
    position: relative;
    width: min(76%, 560px);
    height: 300px;
    margin: 0 auto;
}

.u-calendar-art {
    position: absolute;
    top: 18px;
    left: 44px;
    right: 44px;
    height: 124px;
    border-radius: 8px;
    background:
        radial-gradient(circle at 42% 6%, rgba(255, 255, 255, 0.9), transparent 15%),
        linear-gradient(135deg, #111827, #475569);
    opacity: 0.88;
}

.u-calendar-hook {
    position: absolute;
    top: 108px;
    z-index: 2;
    width: 10px;
    height: 36px;
    border-radius: 99px;
    background: #f8fafc;

    &.u-left {
        left: 82px;
    }

    &.u-right {
        right: 82px;
    }
}

.m-calendar-card {
    position: absolute;
    left: 44px;
    right: 44px;
    bottom: 12px;
    height: 180px;
    padding: 18px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.18);
}

.u-card-title,
.u-card-action,
.u-calendar-row span,
.u-calendar-row b,
.m-kv-search,
.m-kv-grid span,
.m-kv-feed i,
.u-name,
.m-stats span,
.m-list i,
.m-forum-tabs span,
.m-forum-card i,
.m-forum-card span,
.m-forum-card b,
.u-meta,
.m-editor-line span,
.m-main-doc span,
.m-sidebar-card i,
.m-tab-content span,
.u-tab-item i,
.u-tab-item span,
.m-comment-item i,
.m-comment-item span,
.m-comment-item b,
.u-home-name,
.m-home-tabs span,
.m-home-card span {
    display: block;
    border-radius: 6px;
    background: #e5e7eb;
}

.u-card-title {
    width: 48%;
    height: 20px;
}

.u-card-action {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 18px;
    height: 18px;
}

.u-divider {
    height: 1px;
    margin: 14px -18px;
    border-top: 1px dashed #e5e7eb;
}

.u-calendar-row {
    display: grid;
    grid-template-columns: 40px 10px 1fr;
    align-items: center;
    gap: 8px;
    margin-top: 13px;

    span,
    b {
        height: 16px;
    }

    i {
        height: 18px;
        border-left: 3px solid #f1f5f9;
        transform: rotate(14deg);
    }
}

.u-kv-layer,
.u-header-bg,
.u-forum-bg,
.u-card-bg,
.u-sidebar-bg,
.u-comment-bg,
.u-home-banner,
.u-home-page-bg {
    background:
        radial-gradient(circle at 78% 22%, rgba(255, 255, 255, 0.45), transparent 16%),
        linear-gradient(135deg, #0f172a, #1d4ed8);
}

.u-kv-layer {
    height: 120px;
}

.m-kv-search {
    width: 132px;
    height: 22px;
    margin: -14px auto 14px;
    background: #fff;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.16);
}

.m-kv-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 0 16px;

    span {
        height: 32px;
        border-radius: 10px;
        background: #dbeafe;
    }
}

.m-kv-feed,
.m-list,
.m-tab-content {
    padding: 16px;

    i,
    span {
        height: 22px;
        margin-bottom: 10px;
    }
}

.u-header-bg {
    height: 104px;
}

.u-avatar {
    width: 48px;
    height: 48px;
    border: 4px solid #fff;
    border-radius: 50%;
    background: #cbd5e1;
}

.m-app-header .u-avatar {
    margin: -24px auto 8px;
}

.u-name {
    width: 72px;
    height: 16px;
    margin: 0 auto;
}

.m-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;

    span {
        height: 28px;
        background: #e0f2fe;
    }
}

.u-forum-bg {
    position: absolute;
    inset: 0 0 auto;
    height: 150px;
}

.m-forum-tabs,
.m-forum-card {
    position: relative;
    z-index: 1;
}

.m-forum-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 70px 14px 12px;

    span {
        height: 18px;
        background: rgba(255, 255, 255, 0.75);
    }
}

.m-forum-card {
    display: flex;
    gap: 10px;
    margin: 0 14px 10px;
    padding: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);

    i {
        flex: 0 0 30px;
        height: 30px;
        border-radius: 50%;
    }

    div {
        flex: 1;
    }

    span,
    b {
        height: 10px;
        margin: 4px 0;
    }

    b {
        width: 68%;
    }
}

.m-card-list {
    padding: 14px;
    background: #eef2ff;
}

.m-author-card {
    position: relative;
    height: 142px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
}

.m-author-card .u-card-bg,
.m-hover-card .u-card-bg {
    height: 78px;
}

.m-author-card .u-avatar,
.m-hover-card .u-avatar {
    position: relative;
    margin: -22px auto 8px;
}

.u-meta {
    width: 96px;
    height: 12px;
    margin: 8px auto 0;
}

.m-pc-author-card {
    position: relative;
    width: min(74%, 520px);
    margin: 0 auto;
    padding: 48px 44px;
    border-radius: 8px;
    background: #fff;
}

.m-editor-line span {
    width: 76%;
    height: 18px;
    margin-bottom: 16px;
}

.m-hover-card {
    position: absolute;
    top: 36px;
    right: 40px;
    width: 178px;
    height: 170px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.24);
}

.m-pc-sidebar {
    display: grid;
    grid-template-columns: 1fr 180px;
    gap: 24px;
    width: min(78%, 620px);
    margin: 0 auto;
}

.m-main-doc {
    padding: 24px;
    border-radius: 8px;
    background: #fff;

    span {
        height: 18px;
        margin-bottom: 16px;
    }

    span:nth-child(2n) {
        width: 82%;
    }
}

.m-sidebar-card {
    position: relative;
    overflow: hidden;
    padding: 70px 18px 18px;
    border-radius: 8px;
    background: #fff;

    .u-sidebar-bg {
        position: absolute;
        inset: 0 0 auto;
        height: 96px;
    }

    .u-avatar {
        position: relative;
        margin: -26px auto 10px;
    }

    i {
        height: 14px;
        margin-top: 10px;
    }
}

.m-pc-comment {
    width: min(76%, 620px);
    margin: 0 auto;
    padding: 26px;
    border-radius: 8px;
    background: #fff;
}

.m-comment-main {
    position: relative;
    overflow: hidden;
    padding: 92px 22px 18px;
    border-radius: 8px;
    background: #f8fafc;
}

.u-comment-bg {
    position: absolute;
    inset: 0 0 auto;
    height: 118px;
}

.m-comment-item {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);

    i {
        flex: 0 0 36px;
        height: 36px;
        border-radius: 50%;
    }

    div {
        flex: 1;
    }

    span,
    b {
        height: 12px;
        margin: 5px 0;
    }

    b {
        width: 72%;
    }
}

.m-pc-home {
    position: relative;
    width: min(78%, 620px);
    height: 300px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
}

.u-home-banner {
    height: 132px;
}

.u-home-page-bg {
    position: absolute;
    inset: 0;
}

.u-home-avatar {
    position: relative;
    width: 58px;
    height: 58px;
    margin: -29px auto 10px;
    border: 4px solid #fff;
    border-radius: 50%;
    background: #cbd5e1;
}

.u-home-name {
    position: relative;
    width: 92px;
    height: 16px;
    margin: 0 auto 24px;
}

.m-home-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 0 40px;

    span {
        height: 30px;
        background: #dbeafe;
    }
}

.m-home-card {
    position: absolute;
    top: 64px;
    left: 50%;
    width: 230px;
    min-height: 174px;
    padding: 0 22px 22px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
    transform: translateX(-50%);

    span {
        height: 16px;
        margin-top: 12px;
    }
}

.m-app-tabbar {
    background: #f8fafc;
}

.m-tab-content {
    padding-top: 28px;

    span {
        height: 28px;
        margin-bottom: 14px;
    }
}

.m-tabbar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 10px 8px 8px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), #e0f2fe);
    box-shadow: 0 -8px 20px rgba(15, 23, 42, 0.14);
}

.u-tab-item {
    text-align: center;

    i {
        width: 22px;
        height: 22px;
        margin: 0 auto 5px;
        border-radius: 8px;
    }

    span {
        width: 28px;
        height: 6px;
        margin: 0 auto;
    }

    &.is-active i,
    &.is-active span {
        background: @skin-blue;
    }

    &.is-target {
        outline: 2px solid @skin-pink;
        outline-offset: 4px;
        border-radius: 8px;
    }
}

.is-target-app_tabbar_bg .m-tabbar {
    outline: 3px solid @skin-pink;
    outline-offset: -3px;
}

.is-appForum .m-scene-stage,
.is-appHeader .m-scene-stage,
.is-appAuthorCard .m-scene-stage,
.is-appKv .m-scene-stage,
.is-pcComment .m-scene-stage,
.is-pcHomeBanner .m-scene-stage,
.is-pcHomeBg .m-scene-stage,
.is-tabbar .m-scene-stage {
    min-height: 380px;
}

@media (max-width: 720px) {
    .m-scene-stage {
        padding: 24px 16px;
    }

    .m-pc-calendar,
    .m-pc-author-card,
    .m-pc-sidebar,
    .m-pc-comment,
    .m-pc-home {
        width: 100%;
    }

    .m-pc-sidebar {
        grid-template-columns: 1fr;
    }

    .m-sidebar-card {
        display: none;
    }

    .m-scene-caption {
        display: block;

        span {
            display: block;
            margin-top: 4px;
            text-align: left;
        }
    }
}
</style>
