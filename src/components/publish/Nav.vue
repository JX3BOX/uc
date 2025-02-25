<template>
    <nav class="m-nav">
        <router-link class="m-nav-publish el-button el-button--primary" to="/">
            <i class="el-icon-edit-outline"></i>
            <span>创作台</span>
        </router-link>
        <router-link class="m-nav-bucket el-button el-button--primary is-plain" to="/draft">
            <i class="el-icon-receiving"></i>
            <span>草稿箱</span>
        </router-link>

        <el-collapse v-model="group" class="m-nav-group" @click.native.stop>
            <el-collapse-item title="独立创作" name="cms">
                <template slot="title">
                    <span class="u-title">独立创作</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in cms" :key="key" @click.native="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
                <template v-if="isAdmin">
                    <router-link :to="item.path" v-for="(item, key) in ads" :key="key" @click.native="closeSidebar">
                        <i class="el-icon-collection"></i>
                        <span>{{ item.name }}</span>
                        <span class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                    </router-link>
                </template>
            </el-collapse-item>
            <el-collapse-item title="联合创作" name="union">
                <template slot="title">
                    <span class="u-title">联合创作</span>
                </template>
                <router-link to="/union/active">
                    <i class="el-icon-collection"></i>
                    <span>邀请创作</span>
                    <!-- <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span> -->
                </router-link>
                <router-link to="/union/passive">
                    <i class="el-icon-collection"></i>
                    <span>受邀创作</span>
                    <!-- <span class="u-count" :class="{isNull:!item.count}">{{item.count}}</span> -->
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="多人创作" name="wiki">
                <template slot="title">
                    <span class="u-title">多人百科</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in wiki" :key="key" @click.native="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="其它创作" name="app">
                <template slot="title">
                    <span class="u-title">其它创作</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in app" :key="key" @click.native="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
            <el-collapse-item title="评论留言" name="comment">
                <template slot="title">
                    <span class="u-title">评论留言</span>
                </template>
                <router-link :to="item.path" v-for="(item, key) in comment" :key="key" @click.native="closeSidebar">
                    <i class="el-icon-collection"></i>
                    <span>{{ item.name }}</span>
                    <span class="u-count" :class="{ isNull: !item.count }">{{ item.count }}</span>
                </router-link>
            </el-collapse-item>
        </el-collapse>
    </nav>
</template>

<script>
import { getMyPostsCount } from "@/service/publish/cms.js";
import { get_my_post_total } from "@/service/publish/post.js";
import { getNextStat } from "@/service/publish/next.js";
import Bus from "@jx3box/jx3box-common-ui/service/bus";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Nav",
    data: function () {
        return {
            group: [],
            cms: {
                macro: { path: "/cms/macro", name: "剑三宏库", count: 0 },
                bps: { path: "/cms/bps", name: "职业攻略", count: 0 },
                pvp: { path: "/cms/pvp", name: "竞技攻略", count: 0 },
                fb: { path: "/cms/fb", name: "副本攻略", count: 0 },
                tool: { path: "/cms/tool", name: "工具资源", count: 0 },
                // bbs: { path: "/cms/bbs", name: "竹林茶馆", count: 0 },
                community: { path: "/cms/community", name: "论坛交流", count: 0 },
            },
            ads: {
                notice: { path: "/cms/notice", name: "公告资讯", count: 0 },
            },
            wiki: {
                achievement: {
                    path: "/wiki/achievement",
                    name: "成就百科",
                    count: 0,
                },
                item: { path: "/wiki/item", name: "物品百科", count: 0 },
                quest: { path: "/wiki/quest", name: "任务百科", count: 0 },
                knowledge: {
                    path: "/wiki/knowledge",
                    name: "通识百科",
                    count: 0,
                },
                skill: {
                    path: "/wiki/skill",
                    name: "技能百科",
                    count: 0,
                },
            },
            app: {
                face: { path: "/bucket/face", name: "捏脸数据", count: 0 },
                body: { path: "/bucket/body", name: "体型数据", count: 0 },
                // blueprint: { path: "/bucket/blueprint", name: "家园蓝图", count: 0 },
                joke: { path: "/bucket/joke", name: "剑三骚话", count: 0 },
                emotion: { path: "/bucket/emotion", name: "剑三表情", count: 0 },
                exam_question: {
                    path: "/bucket/question",
                    name: "剑三题目",
                    count: 0,
                },
                exam_paper: {
                    path: "/bucket/paper",
                    name: "剑三试卷",
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
                    name: "剑三小册",
                    count: 0,
                },
                namespace: {
                    path: "/bucket/namespace",
                    name: "剑三铭牌",
                    count: 0,
                },
            },
            comment: {
                comment_cms: {
                    path: "/comment/cms",
                    name: "通用评论",
                    count: 0,
                },
                wiki_comment: {
                    path: "/comment/wiki",
                    name: "百科评论",
                    count: 0,
                },
                my_comment: {
                    path: "/comment/community",
                    name: "帖子评论",
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
                Bus.$emit("toggleLeftSide", false);
            }
        },
        loadMyCount: function () {
            getMyPostsCount().then((res) => {
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
        loadHelperCount() {
            get_my_post_total().then((res) => {
                res = res.data;
                if (res.code === 200) {
                    let count = res.data;

                    for (let key in this.wiki) {
                        let tmp = count[`${key}_post`];
                        if (tmp) this.wiki[key]["count"] = tmp;
                    }

                    for (let key in this.app) {
                        let tmp = count[key];
                        if (tmp) this.app[key]["count"] = tmp;
                    }

                    for (let key in this.comment) {
                        let k = key;
                        if (k === "comment_wiki") k = "wiki_comment";
                        let tmp = count[k];
                        if (tmp) this.comment[key]["count"] = tmp;
                    }
                }
            });
        },
        loadNextCount() {
            getNextStat().then((res) => {
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
            this.loadMyCount();
            // this.loadHelperCount();
            this.loadNextCount();
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
