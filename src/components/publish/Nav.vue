<template>
    <nav class="m-nav">
        <router-link class="el-button el-button--large el-button--primary m-nav-publish" to="/">
            <i class="el-icon-edit-outline"></i>
            <span>{{ $t("publish.nav.workbench") }}</span>
        </router-link>
        <router-link class="el-button el-button--large el-button--primary is-plain m-nav-bucket" to="/draft">
            <i class="el-icon-receiving"></i>
            <span>{{ $t("publish.nav.drafts") }}</span>
        </router-link>

        <el-collapse v-model="group" class="m-nav-group" @click.stop>
            <el-collapse-item :title="$t('publish.nav.independent')" name="cms">
                <template #title>
                    <span class="u-title">{{ $t("publish.nav.independent") }}</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in cms" :key="key" @click="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span v-if="countLoading" class="u-count-skeleton" aria-hidden="true"></span>
                    <span v-else class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
                <template v-if="isAdmin">
                    <router-link :to="item.path" v-for="(item, key) in ads" :key="key" @click="closeSidebar">
                        <i class="el-icon-collection"></i>
                        <span>{{ item.name }}</span>
                        <span v-if="countLoading" class="u-count-skeleton" aria-hidden="true"></span>
                        <span v-else class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                    </router-link>
                </template>
            </el-collapse-item>
            <el-collapse-item :title="$t('publish.nav.collaboration')" name="union">
                <template #title>
                    <span class="u-title">{{ $t("publish.nav.collaboration") }}</span>
                </template>
                <router-link to="/union/active">
                    <i class="el-icon-collection"></i>
                    <span>{{ $t("publish.nav.invitedCreation") }}</span>
                    <!-- <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span> -->
                </router-link>
                <router-link to="/union/passive">
                    <i class="el-icon-collection"></i>
                    <span>{{ $t("publish.nav.receivedCreation") }}</span>
                    <!-- <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span> -->
                </router-link>
            </el-collapse-item>
            <el-collapse-item :title="$t('publish.nav.multiAuthor')" name="wiki">
                <template #title>
                    <span class="u-title">{{ $t("publish.nav.multiAuthorWiki") }}</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in wiki" :key="key" @click="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span v-if="countLoading" class="u-count-skeleton" aria-hidden="true"></span>
                    <span v-else class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item :title="$t('publish.nav.otherCreation')" name="app">
                <template #title>
                    <span class="u-title">{{ $t("publish.nav.otherCreation") }}</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in app" :key="key" @click="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span v-if="countLoading" class="u-count-skeleton" aria-hidden="true"></span>
                    <span v-else class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item :title="$t('publish.nav.comments')" name="comment">
                <template #title>
                    <span class="u-title">{{ $t("publish.nav.comments") }}</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in comment" :key="key" @click="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span v-if="countLoading" class="u-count-skeleton" aria-hidden="true"></span>
                    <span v-else class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
        </el-collapse>
    </nav>
</template>

<script>
import { getMyPostsCount } from "@/service/publish/cms.js";
import { getNextStat } from "@/service/publish/next.js";
import Bus from "@jx3box/jx3box-ui/utils/bus.js";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Nav",
    data: function () {
        return {
            group: [],
            countLoading: true,
            cms: {
                macro: { path: "/cms/macro", name: this.$t("publish.types.macros"), count: 0 },
                bps: { path: "/cms/bps", name: this.$t("publish.types.classGuides"), count: 0 },
                pvp: { path: "/cms/pvp", name: this.$t("publish.types.pvpGuides"), count: 0 },
                fb: { path: "/cms/fb", name: this.$t("publish.types.dungeonGuides"), count: 0 },
                tool: { path: "/cms/tool", name: this.$t("publish.types.tools"), count: 0 },
                // bbs: { path: "/cms/bbs", name: "竹林茶馆", count: 0 },
                community: { path: "/cms/community", name: this.$t("publish.types.forumDiscussion"), count: 0 },
            },
            ads: {
                notice: { path: "/cms/notice", name: this.$t("publish.types.news"), count: 0 },
            },
            wiki: {
                achievement: {
                    path: "/wiki/achievement",
                    name: this.$t("publish.types.achievementWiki"),
                    count: 0,
                },
                item: { path: "/wiki/item", name: this.$t("publish.types.itemWiki"), count: 0 },
                quest: { path: "/wiki/quest", name: this.$t("publish.types.questWiki"), count: 0 },
                knowledge: {
                    path: "/wiki/knowledge",
                    name: this.$t("publish.types.knowledgeWiki"),
                    count: 0,
                },
                skill: {
                    path: "/wiki/skill",
                    name: this.$t("publish.types.skillWiki"),
                    count: 0,
                },
            },
            app: {
                face: { path: "/bucket/face", name: this.$t("publish.types.faceData"), count: 0 },
                body: { path: "/bucket/body", name: this.$t("publish.types.bodyData"), count: 0 },
                // blueprint: { path: "/bucket/blueprint", name: "家园蓝图", count: 0 },
                joke: { path: "/bucket/joke", name: this.$t("publish.types.jokes"), count: 0 },
                emotion: { path: "/bucket/emotion", name: this.$t("publish.types.emotes"), count: 0 },
                exam_question: {
                    path: "/bucket/question",
                    name: this.$t("publish.types.questions"),
                    count: 0,
                },
                exam_paper: {
                    path: "/bucket/paper",
                    name: this.$t("publish.types.papers"),
                    count: 0,
                },
                // item_plan: {
                //     path: "/bucket/item_plan",
                //     name: "物品清单",
                //     count: 0,
                // },
                // calendar: {
                //     path: "/bucket/calendar",
                //     name: "日历记录",
                //     count: 0,
                // },
                collection: {
                    path: "/bucket/collection",
                    name: this.$t("publish.types.collection"),
                    count: 0,
                },
                namespace: {
                    path: "/bucket/namespace",
                    name: this.$t("publish.types.namespace"),
                    count: 0,
                },
            },
            comment: {
                comment_cms: {
                    path: "/comment/cms",
                    name: this.$t("publish.types.cmsComments"),
                    count: 0,
                },
                my_comment: {
                    path: "/comment/community",
                    name: this.$t("publish.types.postComments"),
                    count: 0,
                },
                wiki_comment: {
                    path: "/comment/wiki",
                    name: this.$t("publish.types.wikiComments"),
                    count: 0,
                },
                // feedback: {
                //     path: "/comment/feedback",
                //     name: "反馈建议",
                //     count: 0,
                // },
            },
            isAdmin: User.isAdmin(),
        };
    },
    computed: {},
    methods: {
        closeSidebar: function () {
            if (window.innerWidth < 1280) {
                Bus.emit("toggleLeftSide", false);
            }
        },
        loadMyCount: function () {
            return getMyPostsCount().then((res) => {
                let count = res.data.data;
                for (let key in count) {
                    if (this.cms[key]) {
                        this.cms[key]["count"] = count[key];
                    }
                    if (this.ads[key]) {
                        this.ads[key]["count"] = count[key];
                    }
                    if (this.comment[key]) {
                        this.comment[key]["count"] = count[key];
                    }
                    if (this.app[key]) {
                        this.app[key]["count"] = count[key];
                    }
                    if (this.wiki[key]) {
                        this.wiki[key]["count"] = count[key];
                    }
                }
            });
        },
        loadNextCount() {
            return getNextStat().then((res) => {
                let { comment, question, paper, face, pvxbody, community_topic, community_topic_reply } = res.data.data;
                this.comment.comment_cms.count = comment;
                this.app.exam_question.count = question;
                this.app.exam_paper.count = paper;
                this.app.face.count = face;
                this.app.body.count = pvxbody;
                this.cms.community.count = community_topic;
                this.comment.my_comment.count = community_topic_reply;
            });
        },
        init: function () {
            this.countLoading = true;
            const requests = [this.loadMyCount(), this.loadNextCount()].map((request) => request.catch(() => null));
            Promise.all(requests).finally(() => {
                this.countLoading = false;
            });
        },
    },
    created: function () {
        this.init();
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/publish/nav.less";
</style>
