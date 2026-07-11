<template>
    <div class="m-mobile-me">
        <ContentTabList :list="filterTabs" />
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
        privateConf: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    watch: {},
    data: function () {
        return {
            tabs: [
                {
                    label: this.$t("publish.mobile.articles"),
                    value: "gl",
                    component: CmsPosts,
                    key: "article_is_public",
                    children: [
                        {
                            label: this.$t("publish.mobile.macros"),
                            value: "macro",
                        },
                        {
                            label: this.$t("publish.mobile.classes"),
                            value: "bps",
                        },
                        {
                            label: this.$t("publish.mobile.dungeons"),
                            value: "fb",
                        },
                        {
                            label: this.$t("publish.mobile.pvp"),
                            value: "pvp",
                        },
                        {
                            label: this.$t("publish.mobile.tools"),
                            value: "tool",
                        },
                        {
                            label: this.$t("publish.common.other"),
                            value: "other",
                        },
                    ],
                },
                {
                    label: this.$t("publish.mobile.wiki"),
                    value: "wiki",
                    component: WikiPosts,
                    key: "article_is_public",
                    children: [
                        {
                            label: this.$t("publish.mobile.achievements"),
                            value: "achievement",
                        },
                        {
                            label: this.$t("publish.mobile.items"),
                            value: "item",
                        },
                        {
                            label: this.$t("publish.mobile.quests"),
                            value: "quest",
                        },
                        {
                            label: this.$t("publish.mobile.knowledge"),
                            value: "knowledge",
                        },
                    ],
                },

                {
                    label: this.$t("publish.mobile.casual"),
                    value: "Data",
                    key: "make_face_is_public",
                    component: SubTabContent,
                    children: [
                        {
                            label: this.$t("publish.mobile.face"),
                            value: "face",
                            component: FaceList,
                            icon: "el-icon-grape",
                        },
                        {
                            label: this.$t("publish.mobile.body"),
                            value: "body",
                            component: BodyList,
                            icon: "el-icon-watermelon",
                        },
                    ],
                },
                {
                    label: this.$t("publish.mobile.community"),
                    value: "Other",
                    key: "community_topic_is_public",
                    component: SubTabContent,
                    children: [
                        {
                            label: this.$t("publish.mobile.topics"),
                            value: "Topic",
                            component: TopicList,
                        },
                        {
                            label: this.$t("publish.mobile.replies"),
                            value: "Reply",
                            component: ReplyList,
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        filterTabs() {
            return this.tabs.filter((i) => {
                return this.privateConf[i.key] !== 0;
            });
        },
    },
    methods: {
        onSelect(item) {
            if (item.method === "black") {
                this.joinBlacklist();
            } else if (item.method === "report") {
                // 跳转到feedback
                window.open("/feedback", "_blank");
            } else if (item.method === "close") {
                this.closeMore();
            }
        },
        closeMore() {
            this.actionShow = false;
        },

        openMore() {
            this.actionShow = true;
        },
    },
    created() {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/publish/mobile/mobile_me";
</style>
