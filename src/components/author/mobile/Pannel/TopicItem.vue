<template>
    <div v-if="item" class="m-topic-item" @click="toDetail" @contextmenu.prevent="openMore">
        <div class="m-ext-info">
            <div class="u-tag">
                {{ item.category }}
            </div>
            <div class="m-ext-list">
                <div class="m-item">
                    <div class="u-text">
                        {{ formatCreatedAt }}
                    </div>
                </div>
            </div>
        </div>
        <div class="m-content" :class="{'has-bg': bg}">
            <div v-if="bg" class="m-bg-wrapper">
                <img class="m-bg" loading="lazy" :src="bg">
                <div class="m-bg-back"></div>
            </div>
            <div class="m-detail-preview">
                <div class="u-title">{{ item.title }}</div>

                <div v-if="item.visible === 5" class="m-lock follow">
                    <img class="icon" src="@/assets/img/author/mobile/eye.svg">
                    内容仅粉丝可见
                </div>

                <div v-else-if="item.visible === 3" class="m-lock password">
                    <img class="icon" src="@/assets/img/author/mobile/lock.svg">
                    内容被密码锁住啦
                </div>

                <template v-else>
                    <div v-if="item.introduction" class="u-text">
                        {{ item.introduction }}
                    </div>
                    <div v-if="item.extra_images?.length" class="m-img-list">
                        <img
                            v-for="(img, index) in item?.extra_images.slice(0,3)"
                            :key="index"
                            loading="lazy"
                            class="u-img"
                            :src="img"
                            style="height: 60px; width: 60px; object-fit: cover;"
                        />
                        <div class="u-more" v-if="item.extra_images.length > 3">
                            <div class="u-count">
                                +{{ item.extra_images.length - 3 }}
                            </div>
                            <img
                                loading="lazy"
                                class="u-img"
                                :src="item.extra_images[4] || ''"
                                style="height: 60px; width: 60px; object-fit: cover;"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box";
import wx from "weixin-js-sdk";


export default {
    name: 'TopicItem',
    props: {
        item: {
            type: Object,
            default: null
        },
        likeMap: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        likeCount() {
            if (this.likeMap?.[`community_topic-${this.item?.id}`]?.likes != null) {
                return this.likeMap[`community_topic-${this.item.id}`].likes;
            }
            return this.item?.favorite_count || 0;
        },
        formatCreatedAt() {
            return dayjs(this.item.created_at).format('YYYY-M-DD HH:mm:ss');
        },
        bg(){
            return this.getDecorationImage(this.item?.decoration?.type, this.item?.decoration?.val);
        }
    },
    methods: {
        getLink,
        openImg(index) {
            // In Vue you would use a modal or lightbox component instead
            console.log('Open image at index', index);
        },
        openMore(e) {
            // checkLongPress(e);
            this.$emit("openMore", this.item);
        },
        toDetail() {
            const wx = require('weixin-js-sdk');

            wx.miniProgram?.navigateTo({url: `/pages/publish/detail/detail?id=${this.item.id}`})
        },
        getDecorationImage(t, m) {
            if (!t || !m) {
                return "";
            }
            return __cdn + `design/decoration/${t}/${m}.png`;
        },
        timeAgo(item){
            return this.getTimeAgo(item?.latest_reply_at || item?.created_at);
        },
        getTimeAgo(dateString) {
            // 使用dayjs解析传入的日期字符串
            const date = dayjs(dateString);
            const now = dayjs();

            // 计算当前时间与给定日期之间的差异
            const diff = now.diff(date, "day");
            if (diff === 0) {
                if (now.diff(date, "minute") <= 60) {
                    return { text: "刚刚", icon: "el-icon-loading" };
                } else if (now.diff(date, "minute") <= 120) {
                    return { text: "2小时内", icon: "el-icon-time" };
                } else {
                    return { text: `${now.diff(date, "hour")}小时`, icon: "el-icon-time" };
                }
            } else if (diff === 1) {
                return { text: "昨天", icon: "el-icon-time" };
            } else if (diff >= 2 && diff <= 365) {
                return { text: date.format("MM-DD"), icon: "el-icon-date" };
            } else {
                // 如果时间差超过1年
                return { text: date.format("YYYY-MM-DD HH:mm:ss"), icon: "el-icon-date" };
            }
        },
    }
};
</script>

<style lang="less" scoped>
.m-topic-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    position: relative;
    // 清理a标签样式
    text-decoration: none;
    color: var(--black-40, rgba(28, 28, 28, 0.40));


    .m-ext-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .u-tag {
            display: flex;
            padding: 3px 16px 2.5px;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px;
            border-radius: 8px;
            color: var(--black-40, rgba(28, 28, 28, 0.40));
            border: 1px solid rgba(40, 40, 40, 0.05);
            background: var(--primary-brand-4, #FFF);
        }
        .m-ext-list {
            display: flex;
            align-items: center;
            gap: 10px;
            .m-item {
                display: flex;
                align-items: center;
                gap: 4px;

                .u-icon {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    line-height: 18px;
                    color: var(--black-40, rgba(28, 28, 28, 0.40));
                }

                .u-text {
                    color: var(--black-40, rgba(28, 28, 28, 0.40));
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18px;
                }
            }
        }
    }

    .m-content {
        display: flex;
        padding: 16px 12px 16px;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
        border-radius: 8px;
        border: 1px solid rgba(40, 40, 40, 0.05);
        background: var(--primary-brand-4);
        position: relative;
        overflow: hidden;

        .m-bg-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 800px;
            height: 141.94px;
            background: white;
            @media (prefers-color-scheme: dark) {
                background: black;
            }
            .m-bg {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 800px;
                height: 141.94px;
            }
        }

        .m-header {
            --avatar-frame-size: 42px;
            --avatar-size: 30px;
            display: flex;
            align-items: center;
            gap: 12px;
            align-self: stretch;
            z-index: 1;
            margin-bottom: 16px;

            .m-title {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex: 1 0 0;
                gap: 4px;

                .u-author-name {
                    color: var(--black-80);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18px;
                }
                .u-created-at {
                    color: var(--black-40);
                    font-size: 10px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18px;
                }
            }
            .u-more-wrapper {
                display: flex;
                justify-content: flex-start;
                align-content: flex-start;
                height: 39px;
                margin-right: 4px;
                .u-more {
                    width: 18px;
                    height: 18px;
                    padding: 0 0 10px 10px;
                    filter: brightness(0) saturate(100%) invert(12%) sepia(6%) saturate(750%) hue-rotate(170deg) brightness(95%) contrast(85%) opacity(0.4);
                    @media (prefers-color-scheme: dark) {
                        filter: brightness(0) saturate(100%) invert(100%) opacity(0.4);
                    }
                }
            }
        }

        .m-detail-preview {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            align-self: stretch;
            border-radius: 8px;
            z-index: 1;
            box-sizing: border-box;
            padding: 0 8px;

            .u-title {
                color: var(--primary-brand-2, #24292E);
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .u-text {
                color: var(--black-80, rgba(255, 255, 255, 0.80));
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .m-img-list {
                display: flex;
                align-items: center;
                gap: 12px;
                border-radius: 5px;
                overflow: hidden;
                .u-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 5px;
                    object-fit: cover;
                    background: #E7E7E7;
                    overflow: hidden;
                    -webkit-backface-visibility: hidden;
                    -webkit-mask-image: --webkit-radial-gradient(white, black);
                }

                .u-more {
                    display: flex;
                    width: 60px;
                    height: 60px;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    border-radius: 5px;

                    .u-count {
                        position: absolute;
                        background: rgba(0, 0, 0, 0.4);
                        color: #FFF;
                        width: 60px;
                        height: 60px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 5px;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 24px;
                        z-index: 2;
                    }
                    .u-img {
                        border-radius: 5px;
                        width: 60px;
                        height: 60px;
                        overflow: hidden;
                        -webkit-backface-visibility: hidden;
                        -webkit-mask-image: --webkit-radial-gradient(white, black);
                    }
                }
            }
        }

        &.has-bg {
            padding: 12px;
            .m-header {
                .m-title {
                    .u-title {
                        color: var(--primary-black);
                        @media (prefers-color-scheme: dark) {
                            color: var(--primary-white);
                        }
                    }
                    .u-author-name {
                        color: var(--primary-black);
                        @media (prefers-color-scheme: dark) {
                            color: var(--primary-white);
                        }
                    }
                    .u-created-at {
                        color: var(--primary-black);
                        @media (prefers-color-scheme: dark) {
                            color: var(--primary-white);
                        }
                    }
                }

                .u-more {
                    filter: brightness(0) saturate(100%) invert(100%);
                }
            }
            .m-detail-preview {
                margin-top: 0;
                border-radius: 4px;
                background: var(--white-80);
                padding-top: 4px;
                padding-bottom: 4px;

                .u-title {
                    color: var(--primary-black);
                    @media (prefers-color-scheme: dark) {
                        color: var(--primary-white);
                    }
                }
                .u-text {
                    color: var(--primary-black);
                    @media (prefers-color-scheme: dark) {
                        color: var(--primary-white);
                    }
                }
            }
        }
    }

    .m-lock {
        display: flex;
        height: 108px;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-radius: 8px;
        background: var(--black-10, rgba(28, 28, 28, 0.10));
        &.password {
            gap: 4px;
        }
        &.follow {
            gap: 8px;
        }

        .icon {
            width: 22px;
            height: 15px;
            flex-shrink: 0;
            filter: brightness(0) saturate(100%) invert(12%) sepia(6%) saturate(750%) hue-rotate(170deg) brightness(95%) contrast(85%);

            @media (prefers-color-scheme: dark) {
                filter: brightness(0) saturate(100%) invert(100%) opacity(0.9);
            }
        }
    }
}
</style>
