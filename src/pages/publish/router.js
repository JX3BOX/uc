import { createRouter, createWebHashHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";
import main from "@/pages/publish/main.vue";

// COMMON
const demo = () => import("@/post/demo.vue");
const index = () => import("@/post/index.vue");
const draft = () => import("@/views/publish/draft.vue");
const union = () => import("@/views/publish/union.vue");

// CMS
const cms = () => import("@/views/publish/cms.vue");
const cms_comment = () => import("@/views/publish/cms_comment.vue");
const macro = () => import("@/post/macro.vue");
const jx3dat = () => import("@/post/jx3dat.vue");
const fb = () => import("@/post/fb.vue");
const bps = () => import("@/post/bps.vue");
const skill = () => import("@/post/skill.vue");
const tool = () => import("@/post/tool.vue");
const bbs = () => import("@/post/bbs.vue");
const community = () => import("@/post/community.vue");
const community_reply = () => import("@/post/community_reply.vue");
// const house = () => import("@/post/house.vue");
const share = () => import("@/post/share.vue");
const notice = () => import("@/post/notice.vue");
const feedback = () => import("@/views/publish/feedback.vue");
const body = () => import("@/post/body.vue");
const face = () => import("@/post/face.vue");
const pvp = () => import("@/post/pvp.vue");

// WIKI
const wiki = () => import("@/views/publish/wiki.vue");
const wiki_comment = () => import("@/views/publish/wiki_comment.vue");
const achievement = () => import("@/post/achievement.vue");
const item = () => import("@/post/item.vue");
const knowledge = () => import("@/post/knowledge.vue");
const quest = () => import("@/post/quest.vue");

// APP
const bucket = () => import("@/views/publish/bucket.vue");
const item_plan = () => import("@/post/item_plan.vue");
const exam = () => import("@/post/exam.vue");
const exam_question = () => import("@/post/exam_question.vue");
const exam_paper = () => import("@/post/exam_paper.vue");

const namespace = () => import("@/post/namespace.vue");
const bucket_namespace = () => import("@/bucket/namespace.vue");

const joke = () => import("@/post/joke.vue");
const bucket_joke = () => import("@/bucket/joke.vue");

const emotion = () => import("@/post/emotion.vue");
const bucket_emotion = () => import("@/bucket/emotion.vue");

const collection = () => import("@/post/collection.vue");
const bucket_collection = () => import("@/bucket/collection.vue");

const bucket_calendar = () => import("@/bucket/calendar.vue");
const bucket_face = () => import("@/bucket/face.vue");
const bucket_body = () => import("@/bucket/body.vue");

const cmsCommunity = () => import("@/views/publish/cms_community.vue");
const community_comment = () => import("@/views/publish/community_comment.vue");

const routes = [
    // 索引
    {
        path: "/",
        component: main,
        children: [
            {
                path: "/",
                component: index,
                meta: {
                    i18n: {
                        title: "pages.publish.title",
                        description: "pages.publish.description",
                        keywords: "pages.publish.keywords",
                    },
                },
            },
            // CMS
            // ================================
            // 查看
            {
                path: "/cms/community",
                component: cmsCommunity,
                meta: {
                    i18n: {
                        title: "pages.publish.cms_community.title",
                        description: "pages.publish.cms_community.description",
                        keywords: "pages.publish.cms_community.keywords",
                    },
                },
            },
            {
                path: "/cms/:type",
                component: cms,
                meta: {
                    i18n: {
                        title: "pages.publish.cms.title",
                        description: "pages.publish.cms.description",
                        keywords: "pages.publish.cms.keywords",
                    },
                },
            },
            // 联合创作
            {
                name: "union_active",
                path: "/union/active",
                component: union,
                meta: {
                    i18n: {
                        title: "pages.publish.union.title",
                        description: "pages.publish.union.description",
                        keywords: "pages.publish.union.keywords",
                    },
                },
            },
            {
                name: "union_passive",
                path: "/union/passive",
                component: union,
                meta: {
                    i18n: {
                        title: "pages.publish.union.title",
                        description: "pages.publish.union.description",
                        keywords: "pages.publish.union.keywords",
                    },
                },
            },

            // 发布DEMO
            {
                path: "/demo",
                component: demo,
                meta: {
                    i18n: {
                        title: "pages.publish.demo.title",
                        description: "pages.publish.demo.description",
                        keywords: "pages.publish.demo.keywords",
                    },
                },
            },
            // 宏发布
            {
                path: "/macro/:id?",
                component: macro,
                name: "macro",
                meta: {
                    i18n: {
                        title: "pages.publish.macro.title",
                        description: "pages.publish.macro.description",
                        keywords: "pages.publish.macro.keywords",
                    },
                },
            },
            // 插件数据发布
            {
                path: "/jx3dat/:id?",
                component: jx3dat,
                name: "jx3dat",
                meta: {
                    i18n: {
                        title: "pages.publish.jx3dat.title",
                        description: "pages.publish.jx3dat.description",
                        keywords: "pages.publish.jx3dat.keywords",
                    },
                },
            },
            // 副本发布
            {
                path: "/fb/:id?",
                component: fb,
                name: "fb",
                meta: {
                    i18n: {
                        title: "pages.publish.fb.title",
                        description: "pages.publish.fb.description",
                        keywords: "pages.publish.fb.keywords",
                    },
                },
            },
            // 职业发布
            {
                path: "/bps/:id?",
                component: bps,
                name: "bps",
                meta: {
                    i18n: {
                        title: "pages.publish.bps.title",
                        description: "pages.publish.bps.description",
                        keywords: "pages.publish.bps.keywords",
                    },
                },
            },
            // 技能百科
            {
                path: "/skill/:id?",
                component: skill,
                name: "skill",
                meta: {
                    i18n: {
                        title: "pages.publish.skill.title",
                        description: "pages.publish.skill.description",
                        keywords: "pages.publish.skill.keywords",
                    },
                },
            },
            // 工具发布
            {
                path: "/tool/:id?",
                component: tool,
                name: "tool",
                meta: {
                    i18n: {
                        title: "pages.publish.tool.title",
                        description: "pages.publish.tool.description",
                        keywords: "pages.publish.tool.keywords",
                    },
                },
            },
            // 茶馆闲聊
            {
                path: "/bbs/:id?",
                component: bbs,
                name: "bbs",
                meta: {
                    i18n: {
                        title: "pages.publish.bbs.title",
                        description: "pages.publish.bbs.description",
                        keywords: "pages.publish.bbs.keywords",
                    },
                },
            },
            {
                path: "/post/:id?",
                component: bbs,
                meta: {
                    i18n: {
                        title: "pages.publish.bbs.title",
                        description: "pages.publish.bbs.description",
                        keywords: "pages.publish.bbs.keywords",
                    },
                },
            },
            // 魔盒论坛
            {
                path: "/community/:id?",
                component: community,
                name: "community",
                meta: {
                    i18n: {
                        title: "pages.publish.community.title",
                        description: "pages.publish.community.description",
                        keywords: "pages.publish.community.keywords",
                    },
                },
            },
            {
                path: "/community/reply/:id",
                component: community_reply,
                name: "community_reply",
                meta: {
                    i18n: {
                        title: "pages.publish.community_reply.title",
                        description: "pages.publish.community_reply.description",
                        keywords: "pages.publish.community_reply.keywords",
                    },
                },
            },
            // 公告
            {
                path: "/notice/:id?",
                component: notice,
                meta: {
                    i18n: {
                        title: "pages.publish.notice.title",
                        description: "pages.publish.notice.description",
                        keywords: "pages.publish.notice.keywords",
                    },
                },
            },
            // 竞技技巧
            {
                path: "/pvp/:id?",
                component: pvp,
                meta: {
                    i18n: {
                        title: "pages.publish.pvp.title",
                        description: "pages.publish.pvp.description",
                        keywords: "pages.publish.pvp.keywords",
                    },
                },
            },

            // 百科=====================
            // 查看
            {
                path: "/wiki/:type",
                name: "wiki_post",
                component: wiki,
                meta: {
                    i18n: {
                        title: "pages.publish.wiki.title",
                        description: "pages.publish.wiki.description",
                        keywords: "pages.publish.wiki.keywords",
                    },
                },
            },
            {
                path: "/cj/:achievement_id(\\d+)?",
                redirect: "/achievement",
            },
            // 成就攻略发布
            {
                path: "/achievement/:achievement_id(\\d+)?",
                component: achievement,
                meta: {
                    i18n: {
                        title: "pages.publish.achievement.title",
                        description: "pages.publish.achievement.description",
                        keywords: "pages.publish.achievement.keywords",
                    },
                },
            },
            // 物品攻略发布
            {
                path: "/item/:source_id([_\\d]+)?",
                component: item,
                meta: {
                    i18n: {
                        title: "pages.publish.item.title",
                        description: "pages.publish.item.description",
                        keywords: "pages.publish.item.keywords",
                    },
                },
            },
            // 通识百科发布
            {
                path: "/knowledge/:source_id?",
                component: knowledge,
                meta: {
                    i18n: {
                        title: "pages.publish.knowledge.title",
                        description: "pages.publish.knowledge.description",
                        keywords: "pages.publish.knowledge.keywords",
                    },
                },
            },
            // 任务攻略发布
            {
                path: "/quest/:source_id([_\\d]+)?",
                component: quest,
                meta: {
                    i18n: {
                        title: "pages.publish.quest.title",
                        description: "pages.publish.quest.description",
                        keywords: "pages.publish.quest.keywords",
                    },
                },
            },

            // 应用=====================
            // 捏脸分享
            {
                path: "/share/:id?",
                component: share,
                meta: {
                    i18n: {
                        title: "pages.publish.share.title",
                        description: "pages.publish.share.description",
                        keywords: "pages.publish.share.keywords",
                    },
                },
            },
            {
                path: "/face/:id?",
                component: face,
                meta: {
                    i18n: {
                        title: "pages.publish.face.title",
                        description: "pages.publish.face.description",
                        keywords: "pages.publish.face.keywords",
                    },
                },
            },
            {
                path: "/bucket/face",
                component: bucket_face,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_face.title",
                        description: "pages.publish.bucket_face.description",
                        keywords: "pages.publish.bucket_face.keywords",
                    },
                },
            },
            // 体型分享
            {
                path: "/body/:id?",
                component: body,
                meta: {
                    i18n: {
                        title: "pages.publish.body.title",
                        description: "pages.publish.body.description",
                        keywords: "pages.publish.body.keywords",
                    },
                },
            },
            {
                path: "/bucket/body",
                component: bucket_body,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_body.title",
                        description: "pages.publish.bucket_body.description",
                        keywords: "pages.publish.bucket_body.keywords",
                    },
                },
            },
            // 家园发布
            // {
            //     path: "/house/:id?",
            //     component: house,
            // },
            // 骚话
            {
                path: "/joke/:id?",
                component: joke,
                meta: {
                    i18n: {
                        title: "pages.publish.joke.title",
                        description: "pages.publish.joke.description",
                        keywords: "pages.publish.joke.keywords",
                    },
                },
            },
            {
                path: "/bucket/joke",
                component: bucket_joke,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_joke.title",
                        description: "pages.publish.bucket_joke.description",
                        keywords: "pages.publish.bucket_joke.keywords",
                    },
                },
            },
            // 表情
            {
                path: "/emotion/:id?",
                component: emotion,
                meta: {
                    i18n: {
                        title: "pages.publish.emotion.title",
                        description: "pages.publish.emotion.description",
                        keywords: "pages.publish.emotion.keywords",
                    },
                },
            },
            {
                path: "/bucket/emotion",
                component: bucket_emotion,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_emotion.title",
                        description: "pages.publish.bucket_emotion.description",
                        keywords: "pages.publish.bucket_emotion.keywords",
                    },
                },
            },
            // 铭牌
            {
                path: "/namespace/:id?",
                component: namespace,
                meta: {
                    i18n: {
                        title: "pages.publish.namespace.title",
                        description: "pages.publish.namespace.description",
                        keywords: "pages.publish.namespace.keywords",
                    },
                },
            },
            {
                path: "/bucket/namespace",
                component: bucket_namespace,
                name: "bucket_namespace",
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_namespace.title",
                        description: "pages.publish.bucket_namespace.description",
                        keywords: "pages.publish.bucket_namespace.keywords",
                    },
                },
            },
            // 小册
            {
                path: "/collection/:collection_id(\\d+)?",
                component: collection,
                meta: {
                    i18n: {
                        title: "pages.publish.collection.title",
                        description: "pages.publish.collection.description",
                        keywords: "pages.publish.collection.keywords",
                    },
                },
            },
            {
                path: "/bucket/collection",
                component: bucket_collection,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_collection.title",
                        description: "pages.publish.bucket_collection.description",
                        keywords: "pages.publish.bucket_collection.keywords",
                    },
                },
            },

            // 日历
            {
                path: "/bucket/calendar",
                component: bucket_calendar,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket_calendar.title",
                        description: "pages.publish.bucket_calendar.description",
                        keywords: "pages.publish.bucket_calendar.keywords",
                    },
                },
            },

            // 考试
            {
                path: "/bucket/:type",
                name: "bucket",
                component: bucket,
                meta: {
                    i18n: {
                        title: "pages.publish.bucket.title",
                        description: "pages.publish.bucket.description",
                        keywords: "pages.publish.bucket.keywords",
                    },
                },
            },
            // 题目发布
            {
                name: "question",
                path: "/question/:id?",
                component: exam_question,
                meta: {
                    i18n: {
                        title: "pages.publish.question.title",
                        description: "pages.publish.question.description",
                        keywords: "pages.publish.question.keywords",
                    },
                },
            },
            // 考试
            {
                name: "exam",
                path: "/exam",
                component: exam,
                meta: {
                    i18n: {
                        title: "pages.publish.exam.title",
                        description: "pages.publish.exam.description",
                        keywords: "pages.publish.exam.keywords",
                    },
                },
            },
            // 试卷发布
            {
                name: "paper",
                path: "/paper/:id?",
                component: exam_paper,
                meta: {
                    i18n: {
                        title: "pages.publish.paper.title",
                        description: "pages.publish.paper.description",
                        keywords: "pages.publish.paper.keywords",
                    },
                },
            },
            // 物品清单发布
            {
                name: "item_plan",
                path: "/item_plan/:plan_id(\\d+)?",
                component: item_plan,
                meta: {
                    i18n: {
                        title: "pages.publish.item_plan.title",
                        description: "pages.publish.item_plan.description",
                        keywords: "pages.publish.item_plan.keywords",
                    },
                },
            },

            // 草稿=====================
            // 草稿
            {
                path: "/draft",
                component: draft,
                meta: {
                    i18n: {
                        title: "pages.publish.draft.title",
                        description: "pages.publish.draft.description",
                        keywords: "pages.publish.draft.keywords",
                    },
                },
            },

            // 评论=====================
            {
                path: "/comment/cms",
                component: cms_comment,
                meta: {
                    i18n: {
                        title: "pages.publish.comment_cms.title",
                        description: "pages.publish.comment_cms.description",
                        keywords: "pages.publish.comment_cms.keywords",
                    },
                },
            },
            {
                path: "/comment/wiki",
                component: wiki_comment,
                meta: {
                    i18n: {
                        title: "pages.publish.comment_wiki.title",
                        description: "pages.publish.comment_wiki.description",
                        keywords: "pages.publish.comment_wiki.keywords",
                    },
                },
            },
            {
                path: "/comment/feedback",
                component: feedback,
                meta: {
                    i18n: {
                        title: "pages.publish.comment_feedback.title",
                        description: "pages.publish.comment_feedback.description",
                        keywords: "pages.publish.comment_feedback.keywords",
                    },
                },
            },
            {
                path: "/comment/community",
                component: community_comment,
                meta: {
                    i18n: {
                        title: "pages.publish.comment_community.title",
                        description: "pages.publish.comment_community.description",
                        keywords: "pages.publish.comment_community.keywords",
                    },
                },
            },
        ],
    },
];

if (isMiniProgram() || isApp()) {
    routes.unshift({
        path: "/me",
        component: () => import("@/views/publish/me.vue"),
        meta: {
            i18n: {
                title: "pages.publish.me.title",
                description: "pages.publish.me.description",
                keywords: "pages.publish.me.keywords",
            },
        },
    });
}

const router = createRouter({
    history: createWebHashHistory("/publish/"),
    routes,
});

export default router;
