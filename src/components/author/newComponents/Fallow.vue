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
                    label: "捏脸",
                    value: "Face",
                    component: Face,
                    icon: "el-icon-grape",
                },
                {
                    label: "体型",
                    value: "Body",
                    component: Body,
                    icon: "el-icon-watermelon",
                },
                {
                    label: "试卷",
                    value: "Paper",
                    component: Paper,
                    icon: "el-icon-ice-cream-round",
                },
                {
                    label: "题目",
                    value: "Question",
                    component: Question,
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
    .m-segmented, .el-segmented {
        .x;
    }
}
</style>