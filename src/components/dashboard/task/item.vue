<template>
    <div v-if="task" class="u-item">
        <img class="u-img" :src="task.task_icon || defaultTaskIcon" :alt="task.action_type_desc" @error="useDefaultIcon" />
        <div class="u-box">
            <div class="u-info">
                <a
                    v-if="taskUrl"
                    class="u-title"
                    :href="taskUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ task.action_type_desc }}
                </a>
                <span v-else class="u-title">{{ task.action_type_desc }}</span>
                <span class="u-desc">
                    <template v-if="task.task_detail">{{ task.task_detail }} ∕ </template>
                    <span v-for="reward in rewards" :key="reward.key" class="u-attr">
                        {{ reward.label }} {{ reward.amount }}
                    </span>
                </span>
            </div>
            <div class="u-actions">
                <el-button v-if="!isFinished" :disabled="!taskUrl" icon="Right" @click="goComplete">
                    {{ $t("dashboard.tasks.goComplete") }}
                </el-button>
                <el-button
                    :type="isFinished ? 'success' : 'primary'"
                    :disabled="isFinished || claimDisabled"
                    :loading="claiming"
                    :icon="isFinished ? 'Check' : null"
                    @click="claimReward"
                >
                    {{ $t("dashboard.tasks.claimReward") }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { __imgPath } from "@/utils/config";

export default {
    name: "TaskItem",
    props: {
        data: {
            type: Object,
            default: null,
        },
        claiming: {
            type: Boolean,
            default: false,
        },
        claimDisabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["claim"],
    computed: {
        task() {
            return this.data?.task || null;
        },
        taskUrl() {
            return this.task?.task_url || "";
        },
        isFinished() {
            return !!this.data?.hasFinish;
        },
        translatedAttrName() {
            return {
                experience: this.$t("dashboard.common.experience"),
                points: this.$t("dashboard.common.points"),
                mall_goods: this.$t("dashboard.common.mallGoods"),
            };
        },
        rewards() {
            if (!Array.isArray(this.data?.attr)) return [];
            return this.data.attr.map((reward, index) => {
                const name = reward?.name || "unknown";
                const count = Number(reward?.count) || 0;
                return {
                    key: `${name}-${index}`,
                    name,
                    label: this.translatedAttrName[name] || name,
                    amount: name === "mall_goods" ? `×${count}` : `+${count}`,
                };
            });
        },
        defaultTaskIcon() {
            return __imgPath + "image/common/jx3box_black.svg";
        },
    },
    methods: {
        useDefaultIcon(event) {
            if (event.target.src === this.defaultTaskIcon) return;
            event.target.src = this.defaultTaskIcon;
        },
        goComplete() {
            if (!this.taskUrl) return;
            window.open(this.taskUrl, "_blank", "noopener,noreferrer");
        },
        claimReward() {
            if (!this.task?.id || this.isFinished || this.claimDisabled) return;
            this.$emit("claim", this.task.id);
        },
    },
};
</script>
