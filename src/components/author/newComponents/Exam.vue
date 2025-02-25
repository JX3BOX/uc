<template>
    <div class="m-exam">
        <el-tabs class="m-tabs" v-model="active" type="card">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    {{ item.label }}
                </span>
            </el-tab-pane>
        </el-tabs>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active"/>
        </div>

    </div>
</template>

<script>
import Question from "@/components/author/Question.vue";
import Paper from "@/components/author/Paper.vue";

export default {
    name: "Exam",
    components: {
        Question,
        Paper,

    },
    data: function () {
        return {
            active: "Question",
            types: [
                {
                    label: "题目",
                    value: "Question",
                    component: Question
                },
                {
                    label: "试卷",
                    value: "Paper",
                    component: Paper
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

}
</script>

<style lang="less">
@import "~@/assets/css/author/newCss/exam.less";
</style>
