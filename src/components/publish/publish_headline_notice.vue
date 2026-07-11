<template>
    <div class="m-publish-headline-notice" v-if="visible">
        <div class="m-publish-headline-notice__card">
            <div class="u-accent-line"></div>
            <div class="u-left">
                <span class="u-status" :class="statusClass">
                    <span class="u-pulse-dot"></span>
                    <span>{{ statusText }}</span>
                </span>
                <p class="u-title">
                    <span>{{ $t("publish.headline.yourWorkWill") }}</span>
                    <span class="u-time">{{ publishTime }}</span
                    >{{ $t("publish.headline.appearOn") }}<span class="u-highlight">{{ $t("publish.headline.name") }}</span>
                </p>
            </div>
            <div class="u-right">
                <span class="u-suffix">{{ $t("publish.headline.mayAdjust") }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { getUpcomingDesignTask } from "@/service/publish/cms";

export default {
    name: "PublishHeadlineNotice",
    props: {
        sourceType: {
            type: String,
            default: "",
        },
        sourceId: {
            type: [String, Number],
            default: "",
        },
        client: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            task: null,
        };
    },
    computed: {
        visible() {
            return !!this.task?.published_at;
        },
        title() {
            if (!this.visible) return "";
            return this.$t("publish.headline.fullNotice", { time: this.publishTime });
        },
        publishTime() {
            if (!this.visible) return "";
            return dayjs(this.task.published_at).format("YYYY-MM-DD HH:mm:ss");
        },
        statusText() {
            const map = {
                0: "pending",
                1: "progress",
                2: "ready",
            };
            return this.$t(`publish.headline.status.${map[this.task?.flow] || "pending"}`);
        },
        statusClass() {
            const map = {
                0: "is-pending",
                1: "is-progress",
                2: "is-ready",
            };
            return map[this.task?.flow] || "is-pending";
        },
        queryKey() {
            return [this.sourceType, this.sourceId, this.client].join("|");
        },
        isMock() {
            const query = `${location.search}&${location.hash.split("?")[1] || ""}`;
            return new URLSearchParams(query).get("headline_mock") === "1";
        },
    },
    watch: {
        queryKey: {
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        loadData() {
            if (this.isMock) {
                this.task = {
                    id: 0,
                    flow: 2,
                    published_at: dayjs().add(3, "day").format("YYYY-MM-DD HH:mm:ss"),
                };
                return;
            }

            if (!this.sourceType || !this.sourceId) {
                this.task = null;
                return;
            }

            getUpcomingDesignTask({
                source_type: this.sourceType,
                source_id: String(this.sourceId),
                client: this.client || undefined,
            })
                .then((res) => {
                    const data = res.data.data;
                    this.task = data?.exists ? data.task : null;
                })
                .catch(() => {
                    this.task = null;
                });
        },
    },
};
</script>

<style lang="less">
.m-publish-headline-notice {
    margin-top: 12px;

    &__card {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        max-width: 100%;
        min-height: 48px;
        padding: 10px 20px 10px 24px;
        box-sizing: border-box;
        border: 1px solid #f1f5f9;
        border-radius: 6px;
        background-color: #f8fafc;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .u-accent-line {
        position: absolute;
        left: 0;
        top: 8px;
        bottom: 8px;
        width: 4px;
        border-top-right-radius: 999px;
        border-bottom-right-radius: 999px;
        background: linear-gradient(180deg, #ec4899 0%, #f43f5e 100%);
        box-shadow: 1px 0 6px rgba(236, 72, 153, 0.3);
    }

    .u-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    .u-right {
        flex-shrink: 0;
    }

    .u-suffix {
        white-space: nowrap;
        font-size: 12px;
        font-weight: 500;
        color: #94a3b8;
    }

    .u-title {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        line-height: 1.5;
        letter-spacing: 0.025em;
        color: #475569;
    }

    .u-time {
        font-weight: 750;
        color: #1e293b;
    }

    .u-highlight {
        font-weight: 750;
        color: #db2777;
    }

    .u-status {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 28px;
        padding: 0 10px;
        border: 1px solid rgba(251, 207, 232, 0.8);
        border-radius: 999px;
        background-color: #fdf2f8;
        color: #be185d;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 600;
        line-height: 28px;
    }

    .u-status.is-pending {
        color: #475569;
        background-color: #f8fafc;
        border-color: #cbd5e1;
    }

    .u-status.is-progress {
        color: #c2410c;
        background-color: #fff7ed;
        border-color: #fed7aa;
    }

    .u-status.is-ready {
        color: #be185d;
        background-color: #fdf2f8;
        border-color: rgba(251, 207, 232, 0.8);
    }

    .u-pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: currentColor;
        animation: headline-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes headline-pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }
}
</style>
