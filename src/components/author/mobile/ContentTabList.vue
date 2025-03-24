<template>
    <div class="m-content-tab-list">
        <el-tabs ref="tabList" class="m-tabs" :class="{fixed:navBarFixed}" v-model="active" stretch>
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" >
                <span slot="label">
                    {{ item.label }}
                </span>
            </el-tab-pane>
        </el-tabs>
        <div class="m-primary">
            <component v-bind:is="currentComponent" v-if="activeType === active" :list="currentChildren"/>
        </div>
    </div>
</template>

<script>

import CmsPosts from "./Pannel/CmsPosts.vue";
import BodyList from "./Pannel/BodyList.vue";

import Data from "@/components/author/newComponents/Data.vue";
import RoleInfo from "@/components/author/mobile/Pannel/RoleInfo.vue";
import BoxMoment from "@/components/author/mobile/Pannel/BoxMoment.vue";
import SubTabContent from "@/components/author/mobile/Pannel/SubTabContent.vue";
import FaceList from "@/components/author/mobile/Pannel/FaceList.vue";
import ReplyList from "@/components/author/mobile/Pannel/ReplyList.vue";
import TopicList from "@/components/author/mobile/Pannel/TopicList.vue";


export default {
    name: "ContentTabList",
    components: {
        SubTabContent,
        Data,
        RoleInfo,
        BoxMoment,
    },
    data: function () {
        return {
            active: "UserInfo",
            navBarFixed: false,
            types: [
                {
                    label: "角色",
                    value: "UserInfo",
                    component: RoleInfo,
                },
                {
                    label: "动态",
                    value: "BoxMoment",
                    component: BoxMoment,
                },
                {
                    label: "文章",
                    value: "Works",
                    component: CmsPosts,
                    children:[
                        {
                            label: "宏库",
                            value: "macro",
                        },
                        {
                            label: "职业",
                            value: "bps",
                        },
                        {
                            label: "副本",
                            value: "fb",
                        },
                        {
                            label: "竞技",
                            value: "pvp",
                        },
                        {
                            label: "工具",
                            value: "tool",
                        },
                    ]
                },
                {
                    label: "帖子",
                    value: "Other",
                    component: SubTabContent,
                    children:[
                        {
                            label: "发帖",
                            value: "Topic",
                            component: TopicList,
                        },
                        {
                            label: "回帖",
                            value: "Reply",
                            component: ReplyList,
                        },
                    ]
                },
                {
                    label: "捏脸",
                    value: "Data",
                    component: SubTabContent,
                    children:[
                        {
                            label: "捏脸",
                            value: "face",
                            component: FaceList,
                            icon:'el-icon-grape'
                        },
                        {
                            label: "体型",
                            value: "body",
                            component: BodyList,
                            icon:'el-icon-watermelon'
                        },
                    ]
                },
                // {
                //     label: "配装",
                //     value: "Pz",
                //     component: Pz,
                //     icon: "el-icon-sugar",
                // },
            ],
        };
    },
    computed: {
        current(){
            return this.types.find((item) => item.value === this.active);
        },
        currentComponent: function () {
            return this.current?.component;
        },
        activeType: function () {
            return this.current?.value;
        },
        currentChildren: function () {
            return this.current?.children || [];
        }
    },
    methods:{
        watchScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.navBarFixed = scrollTop >= this.tabListOffsetTop;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.tabListOffsetTop = this.$refs.tabList.$el.offsetTop;
            window.addEventListener("scroll", this.watchScroll);
        });
    },
    destroyed() {
        window.removeEventListener("scroll", this.watchScroll);
    }

}
</script>

<style lang="less">
.m-empty{
    text-align: center;
}
</style>
