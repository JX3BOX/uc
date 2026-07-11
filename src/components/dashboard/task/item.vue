<template>
    <div class="u-item" v-if="data">
        <img class="u-img" :src="data.task.task_icon || defaultTaskIcon" :alt="data.task.action_type_desc" />
        <div class="u-box">
            <div class="u-info">
                <a class="u-title" :href="data.task.task_url" target="_blank">{{ data.task.action_type_desc }}</a>
                <span class="u-desc">
                    {{ data.task.task_detail }} ∕
                    <span v-for="(attr, key) in data.attr" :key="key" class="u-attr">
                        {{ translatedAttrName[attr.name] || attr.name }} +{{ attr.count }}
                    </span>
                </span>
            </div>
            <div class="u-actions">
                <el-button
                    v-if="!data.hasFinish"
                    :disabled="!data.task.task_url"
                    icon="Right"
                    @click="goComplete(data.task.task_url)"
                    >{{ $t("dashboard.tasks.goComplete") }}</el-button
                >
                <el-button
                    :type="data.hasFinish ? 'success' : 'primary'"
                    :disabled="data.hasFinish || claimDisabled"
                    :loading="claiming"
                    :icon="data.hasFinish ? 'Check' : null"
                    @click="claimReward(data.task.id)"
                    >{{ $t("dashboard.tasks.claimReward") }}</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@/utils/config";
export default {
    name: "tasks",
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
    data: function () {
        return {
            attr_name: {},
        };
    },
    computed: {
        translatedAttrName() {
            return {
                experience: this.$t("dashboard.common.experience"),
                points: this.$t("dashboard.common.points"),
            };
        },
        defaultTaskIcon() {
            return __imgPath + "image/common/jx3box_black.svg";
        },
    },
    methods: {
        goComplete(url) {
            if (!url) return;
            window.open(url, "_blank");
        },
        claimReward(id) {
            this.$emit("claim", id);
        },
    },
};
</script>
