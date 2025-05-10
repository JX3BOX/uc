<template>
    <div class="m-mobile-me">
        <ContentTabList :list="filterTabs"/>
    </div>
</template>

<script>

import ContentTabList from "@/components/publish/me/ContentTabList.vue";
import CmsPosts from "@/components/publish/me/Pannel/CmsPosts.vue";
import SubTabContent from "@/components/publish/me/Pannel/SubTabContent.vue";
import TopicList from "@/components/publish/me/Pannel/TopicList.vue";
import ReplyList from "@/components/publish/me/Pannel/ReplyList.vue";
import FaceList from "@/components/publish/me/Pannel/FaceList.vue";
import BodyList from "@/components/publish/me/Pannel/BodyList.vue";
import WikiPosts from "@/components/publish/me/Pannel/WikiPosts.vue";


export default {
    name: "MobileMe",
    components: {
        ContentTabList,
    },
    props: {
        decorationMe: {
            type: Object,
            default: function () {
                return {};
            },
        },
        privateConf:{
            type: Object,
            default: function () {
                return {};
            },
        }
    },
    watch: {

    },
    data: function () {
        return {
            tabs: [

                {
                    label: "文章",
                    value: "gl",
                    component: CmsPosts,
                    key:'article_is_public',
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
                        {
                            label: "其他",
                            value: "other",
                        },
                    ]
                },
                {
                    label: "百科",
                    value: "wiki",
                    component: WikiPosts,
                    key:'article_is_public',
                    children:[
                        {
                            label: "成就",
                            value: "achievement",
                        },
                        {
                            label: "物品",
                            value: "item",
                        },
                        {
                            label: "任务",
                            value: "quest",
                        },
                        {
                            label: "通识",
                            value: "knowledge",
                        },
                    ]
                },

                {
                    label: "休闲",
                    value: "Data",
                    key: 'make_face_is_public',
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
                {
                    label: "魔吧",
                    value: "Other",
                    key: 'community_topic_is_public',
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

            ],

        };
    },
    computed: {
        filterTabs(){
            return this.tabs.filter(i=>{
                return this.privateConf[i.key]!==0
            })
        },
    },
    filters: {

    },
    methods: {
        onSelect(item){
            if (item.method === "black") {
                this.joinBlacklist();
            } else if (item.method === "report") {
                // 跳转到feedback
                window.open("/feedback", "_blank");
            } else if (item.method === "close") {
                this.closeMore();
            }
        },
        closeMore(){
            this.actionShow = false;
        },

        openMore(){
            this.actionShow = true
        },
    },
    created() {
    },
    mounted: function () {

    },
};
</script>

<style  lang="less">
@import "~@/assets/css/publish/mobile/mobile_me";
</style>
