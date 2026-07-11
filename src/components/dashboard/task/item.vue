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
            <div class="u-btn">
                <el-button
                    :type="data.hasFinish ? 'success' : 'default'"
                    :disabled="data.hasFinish"
                    :icon="(data.hasFinish && 'Check') || 'Right'"
                    @click="checkFinish(data)"
                    >{{ data.hasFinish ? $t("dashboard.common.completed") : $t("dashboard.tasks.goComplete") }}</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@/utils/config";
export default {
    name: "tasks",
    props: ["data"],
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
        checkFinish({ hasFinish, task }) {
            if (hasFinish) {
                this.$emit("update", task.id);
            } else {
                window.open(task.task_url, "_blank");
            }
        },
    },
};
</script>
