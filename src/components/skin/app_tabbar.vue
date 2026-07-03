<template>
    <div class="m-skin-scene-preview m-app-tabbar-skin-scene" :class="`is-theme-${theme}`">
        <div class="m-scene-stage">
            <div class="m-phone">
                <div class="m-phone-content">
                    <div class="u-search"></div>
                    <div class="u-grid">
                        <i v-for="index in 8" :key="index"></i>
                    </div>
                    <div class="u-card" v-for="index in 3" :key="index">
                        <b></b>
                        <span></span>
                    </div>
                </div>
                <div class="m-tabbar" :style="tabbarStyle">
                    <button
                        v-for="item in tabs"
                        :key="item.key"
                        type="button"
                        class="u-tab"
                        :class="{ active: activeTab === item.key }"
                        @click="activeTab = item.key"
                    >
                        <img v-if="tabIcon(item)" :src="tabIcon(item)" alt="" />
                        <i v-else></i>
                        <span>{{ item.label }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="m-scene-caption">
            <b>App底部导航</b>
            <span>sidebar / app_tabbar</span>
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

const getImage = function (config) {
    return normalizeSkinUrl(config?.image);
};

export default {
    name: "AppTabbarSkinScene",
    props: {
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
            activeTab: "home",
            tabs: [
                { key: "home", label: "首页", normal: "home", active: "homeActive" },
                { key: "nav", label: "导航", normal: "nav", active: "navActive" },
                { key: "forum", label: "论坛", normal: "forum", active: "forumActive" },
                { key: "dashboard", label: "我的", normal: "dashboard", active: "dashboardActive" },
            ],
        };
    },
    computed: {
        bgUrl() {
            return getImage(this.skinConfig?.bg);
        },
        tabbarStyle() {
            return this.bgUrl ? { backgroundImage: `url(${this.bgUrl})` } : {};
        },
    },
    methods: {
        tabIcon(item) {
            const key = this.activeTab === item.key ? item.active : item.normal;
            return getImage(this.skinConfig?.[key]);
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
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 540px;
    padding: 30px;
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
}

.m-phone {
    position: relative;
    width: 260px;
    height: 470px;
    overflow: hidden;
    border: 10px solid #111827;
    border-radius: 30px;
    background: #fff;
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
}

.m-phone-content {
    box-sizing: border-box;
    height: 100%;
    padding: 28px 18px 84px;
    background: linear-gradient(180deg, #eef4ff, #fff 38%);
}

.u-search {
    width: 150px;
    height: 24px;
    margin: 0 auto 22px;
    border-radius: 999px;
    background: #e5e7eb;
}

.u-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    i {
        display: block;
        height: 38px;
        border-radius: 12px;
        background: #eef2f7;
    }
}

.u-card {
    margin-top: 18px;
    padding: 14px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);

    b,
    span {
        display: block;
        border-radius: 999px;
        background: #e5e7eb;
    }

    b {
        width: 45%;
        height: 14px;
        margin-bottom: 12px;
    }

    span {
        width: 82%;
        height: 12px;
    }
}

.m-tabbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    height: 76px;
    padding: 8px 6px 10px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.94);
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100% 100%;
}

.u-tab {
    appearance: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    min-width: 0;
    border: 0;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    cursor: pointer;

    img,
    i {
        display: block;
        width: 30px;
        height: 30px;
        object-fit: contain;
    }

    i {
        border-radius: 9px;
        background: #dbe3ef;
    }

    &.active {
        color: #635bff;
        font-weight: 600;
    }
}
</style>
