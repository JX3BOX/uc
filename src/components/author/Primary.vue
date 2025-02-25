<!--
 * @Author: iRuxu
 * @Date: 2022-05-02 10:53:27
 * @LastEditTime: 2022-07-21 22:41:27
 * @Description:
-->
<template>
    <div class="m-author-body">
        <el-tabs class="m-tabs" v-model="active">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    <i class="u-icon" :class="item.icon"></i>
                    {{ item.label }}
                </span>
                <div class="m-primary">
                    <component :is="currentComponent" v-if="item.value === active" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Post from "@/components/author/Post.vue";
import Wiki from "@/components/author/Wiki.vue";
import Question from "@/components/author/Question.vue";
import Paper from "@/components/author/Paper.vue";
import Collection from "@/components/author/Collection.vue";
import Namespace from "@/components/author/Namespace.vue";
import Jokes from "@/components/author/Jokes.vue";
import Emotions from "@/components/author/Emotions.vue";
// import Plan from "@/components/author/item_plan.vue";
import Pz from "@/components/author/Pz.vue";
export default {
    name: "Primary",
    props: [],
    data: function() {
        return {
            active: "Post",
            types: [
                {
                    label: "最新作品",
                    value: "Post",
                    component: Post,
                    icon: "el-icon-collection",
                },
                {
                    label: "百科贡献",
                    value: "Wiki",
                    component: Wiki,
                    icon: "el-icon-reading",
                },
                {
                    label: "配装方案",
                    value: "Pz",
                    component: Pz,
                    icon: "el-icon-shopping-bag-1",
                },
                {
                    label: "文集小册",
                    value: "Collection",
                    component: Collection,
                    icon: "el-icon-notebook-1",
                },

                { label: "剑三题目", value: "Question", component: Question, icon: "el-icon-document-checked" },
                { label: "剑三试卷", value: "Paper", component: Paper, icon: "el-icon-document-checked" },
                {
                    label: "TA的铭牌",
                    value: "Namespace",
                    component: Namespace,
                    icon: "el-icon-postcard",
                },
                {
                    label: "TA的趣图",
                    value: "Emotions",
                    component: Emotions,
                    icon: "el-icon-sugar",
                },
                {
                    label: "TA的骚话",
                    value: "Jokes",
                    component: Jokes,
                    icon: "el-icon-cold-drink",

                }
            ],
        };
    },
    computed: {
        currentComponent: function() {
            return this.types.find((item) => item.value === this.active).component;
        },
    },
    components: {
        Post,
        Wiki,
        Question,
        Paper,
        Collection,
        Namespace,
        // Plan,
        Pz,
        Jokes,
        Emotions,
    },
};
</script>

<style lang="less" scoped>
.u-icon {
    .fz(16px);
}
</style>
