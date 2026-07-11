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
                <template #label>
                    <i class="u-icon" :class="item.icon"></i>
                    {{ item.label }}
                </template>
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
                    label: this.$t("author.tabs.latestWorks"),
                    value: "Post",
                    component: Post,
                    icon: "el-icon-collection",
                },
                {
                    label: this.$t("author.tabs.wikiContributions"),
                    value: "Wiki",
                    component: Wiki,
                    icon: "el-icon-reading",
                },
                {
                    label: this.$t("author.tabs.builds"),
                    value: "Pz",
                    component: Pz,
                    icon: "el-icon-shopping-bag-1",
                },
                {
                    label: this.$t("author.tabs.collections"),
                    value: "Collection",
                    component: Collection,
                    icon: "el-icon-notebook-1",
                },

                { label: this.$t("author.tabs.questions"), value: "Question", component: Question, icon: "el-icon-document-checked" },
                { label: this.$t("author.tabs.papers"), value: "Paper", component: Paper, icon: "el-icon-document-checked" },
                {
                    label: this.$t("author.tabs.namespaces"),
                    value: "Namespace",
                    component: Namespace,
                    icon: "el-icon-postcard",
                },
                {
                    label: this.$t("author.tabs.images"),
                    value: "Emotions",
                    component: Emotions,
                    icon: "el-icon-sugar",
                },
                {
                    label: this.$t("author.tabs.jokes"),
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
