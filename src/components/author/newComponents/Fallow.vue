<template>
    <div class="m-exam">
       <div class="m-segmented">
            <el-segmented
                v-model="active"
                :options="types.map((item) => ({ label: item.label, value: item.value, icon: item.icon }))"
            >
                <template #default="scope">
                    <div class="flex items-center gap-1 p-2">
                        <i :class="scope.item.icon"></i>
                        <div>{{ scope.item.label }}</div>
                    </div>
                </template>
            </el-segmented>
        </div>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active" />
        </div>
    </div>
</template>

<script>
import { markRaw } from "vue";
import Face from "@/components/author/newComponents/Face";
import Paper from "@/components/author/Paper.vue";
import Question from "@/components/author/Question.vue";
import Body from "@/components/author/newComponents/Body.vue";

export default {
    name: "Fallow",
    components: {
        Face,
        Paper,
        Question,
        Body,
    },
    data: function () {
        return {
            active: "Face",
            types: [
                {
                    label: this.$t("author.tabs.faces"),
                    value: "Face",
                    component: markRaw(Face),
                    icon: "el-icon-grape",
                },
                {
                    label: this.$t("author.tabs.bodyTypes"),
                    value: "Body",
                    component: markRaw(Body),
                    icon: "el-icon-watermelon",
                },
                {
                    label: this.$t("author.tabs.paper"),
                    value: "Paper",
                    component: markRaw(Paper),
                    icon: "el-icon-ice-cream-round",
                },
                {
                    label: this.$t("author.tabs.question"),
                    value: "Question",
                    component: markRaw(Question),
                    icon: "el-icon-lollipop",
                },
            ],
        };
    },
    computed: {
        currentComponent: function () {
            return this.types.find((item) => item.value === this.active).component;
        },
        activeType: function () {
            return this.types.find((item) => item.value === this.active).value;
        },
    },
};
</script>
<style lang="less">
.m-exam {
    min-width: 0;

    .m-segmented,
    .el-segmented {
        .x;
    }
}

@media screen and (max-width: @phone) {
    .m-exam {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        box-sizing: border-box;

        .m-segmented {
            width: 100%;
            min-width: 0;
            overflow: hidden;
        }

        .el-segmented {
            display: flex;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            padding: 3px;
            box-sizing: border-box;
        }

        .el-segmented__group {
            display: flex;
            width: 100%;
            min-width: 0;
        }

        .el-segmented__item {
            flex: 1 1 0;
            min-width: 0;
        }

        .el-segmented__item-label {
            width: 100%;
            min-width: 0;
        }

        .el-segmented__item-label > div {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            min-width: 0;
            padding: 8px 2px;
            white-space: nowrap;
            box-sizing: border-box;
        }

        .m-primary .m-empty {
            display: flex;
            min-height: 180px;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                max-width: 200px;
                height: auto;
            }
        }
    }
}
</style>
