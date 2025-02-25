<template>
    <div class="u-item" v-if="data">
        <img class="u-img" :src="data.task.task_icon || defaultTaskIcon" :alt="data.task.action_type_desc" />
        <div class="u-box">
            <div class="u-info">
                <a class="u-title" :href="data.task.task_url" target="_blank">{{ data.task.action_type_desc }}</a>
                <span class="u-desc">
                    {{ data.task.task_detail }} ∕
                    <span v-for="(attr, key) in data.attr" :key="key" class="u-attr">
                        {{ attr_name[attr.name] }} +{{ attr.count }}
                    </span>
                </span>
            </div>
            <div class="u-btn">
                <el-button
                    size="small"
                    :type="data.hasFinish ? 'success' : 'warning'"
                    :disabled="data.hasFinish"
                    :icon="(data.hasFinish && 'el-icon-check') || ''"
                    @click="checkFinish(data.task.id)"
                    >{{ data.hasFinish ? "已完成" : "领取奖励" }}</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "tasks",
    props: ["data"],
    data: function () {
        return {
            attr_name: {
                experience: "经验",
                points: "积分",
            },
        };
    },
    computed: {
        defaultTaskIcon() {
            return __imgPath + "image/common/jx3box_black.svg";
        },
    },
    methods: {
        checkFinish(id) {
            this.$emit("update", id);
        },
    },
};
</script>
