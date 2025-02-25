<template>
    <div class="m-author-info">
        <div class="m-top">
            <div class="u-title">
                TA的作品
            </div>
            <el-tabs class="m-tabs" v-model="active" stretch>
                <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    {{ item.label }}
                </span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active"/>
        </div>

    </div>
</template>

<script>
import Post from "@/components/author/Post.vue";
import Wiki from "@/components/author/Wiki.vue";
import Exam from "@/components/author/newComponents/Exam";
import Collection from "@/components/author/Collection.vue";
import Namespace from "@/components/author/Namespace.vue";
import Jokes from "@/components/author/Jokes.vue";
import Emotions from "@/components/author/Emotions.vue";
import Data from "@/components/author/newComponents/Data.vue";
import Fallow from "@/components/author/newComponents/Fallow";
import Other from "@/components/author/newComponents/Other";
export default {
    name: "Left",
    components: {
        Post,
        Wiki,
        Exam,
        Collection,
        Namespace,
        Data,
        Jokes,
        Emotions,
        Fallow
    },
    data: function () {
        return {
            active: "Post",
            types: [
                {
                    label: "作品",
                    value: "Post",
                    component: Post,
                },
                {
                    label: "百科",
                    value: "Wiki",
                    component: Wiki,
                },
                {
                    label: "论坛",
                    value: "Other",
                    component: Other,
                },
                {
                    label: "数据",
                    value: "Data",
                    component: Data,
                },
                {
                    label: "休闲",
                    value: "Fallow",
                    component: Fallow,
                },
            ],
        };
    },
    computed: {
        currentComponent: function () {
            return this.types.find((item) => item.value === this.active)?.component;
        },
        activeType: function () {
            return this.types.find((item) => item.value === this.active)?.value;
        },
    },

}
</script>

<style lang="less">
@import "~@/assets/css/author/newCss/left.less";
@import "~@/assets/css/author/newCss/content.less";
.m-empty{
    text-align: center;
}
</style>
