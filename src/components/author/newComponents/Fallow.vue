<template>
    <div class="m-exam">
        <el-tabs class="m-tabs" v-model="active" type="card">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    <i :class="item.icon"></i>
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
        Body
    },
    data: function () {
        return {
            active: "Face",
            types: [
                {
                    label: "捏脸",
                    value: "Face",
                    component: Face,
                    icon:'el-icon-grape'
                },
                {
                    label: "体型",
                    value: "Body",
                    component: Body,
                    icon:'el-icon-watermelon'
                },
                {
                    label: "试卷",
                    value: "Paper",
                    component: Paper,
                    icon : 'el-icon-ice-cream-round'
                },
                {
                    label: "题目",
                    value: "Question",
                    component: Question,
                    icon : 'el-icon-lollipop'
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


