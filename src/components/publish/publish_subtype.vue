<template>
    <div class="m-publish-subtype">
        <el-form-item :label="$t('publish.common.type')">
            <el-radio-group v-model="subtype">
                <el-radio
                    v-for="(name, key) in subtypes"
                    :value="key"
                    border
                    :key="key"
                    :disabled="frozen && $route.params.id && subtype != key"
                    >{{ optionLabel(name) }}</el-radio
                >
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_subtype",
    props: {
        modelValue: {
            type: [String, Number],
            default: undefined,
        },
        data: {
            type: [String, Number],
            default: "",
        },
        options: {
            type: [Array, Object],
            default: () => [],
        },
        lock: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            subtype: this.modelValue !== undefined ? this.modelValue : this.data,
            subtypes: this.options || [],
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.subtype = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.subtype = newval;
            }
        },
        subtype: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        options: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.subtypes = newval;
                }
            },
        },
    },
    computed: {
        // 是否可以变更类型
        frozen: function () {
            return this.lock;
        },
    },
    methods: {
        optionLabel(name) {
            const key = {
                攻略心得: "guide",
                萌新指南: "beginnerGuide",
                江湖故事: "story",
                煮酒论剑: "discussion",
                运营活动: "operations",
                公告动态: "announcements",
                功能更新: "featureUpdates",
                兑换通知: "redemptionNotice",
                工具资源: "tools",
                插件数据: "pluginData",
                学习笔札: "studyNotes",
                魔盒文档: "boxDocs",
                团队监控数据: "teamMonitorData",
                目标监控数据: "targetMonitorData",
                团队面板数据: "teamPanelData",
                其它插件数据: "otherPluginData",
            }[name];
            return key ? this.$t(`publish.optionLabels.${key}`) : name;
        },
    },
    mounted: function () {},
    components: {},
};
</script>
