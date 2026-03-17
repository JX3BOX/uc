/*
 * @Author: iRuxu
 * @Date: 2022-06-09 13:55:38
 * @LastEditTime: 2022-07-05 16:42:43
 * @Description:
 */
import { createRouter, createWebHistory } from "vue-router";

const index = () => import("@/views/dashboard/index.vue");

const msg = () => import("@/views/dashboard/msg.vue");
const letter = () => import("@/views/dashboard/letter.vue");
// const feed = () => import("@/views/dashboard/feed.vue");
const fav = () => import("@/views/dashboard/fav.vue");
const purchases = () => import("@/views/dashboard/purchases.vue");
const frame = () => import("@/views/dashboard/frame.vue");
const theme = () => import("@/views/dashboard/theme.vue");
const emotion = () => import("@/views/dashboard/emotion.vue");
const honor = () => import("@/views/dashboard/honor.vue");
const certification = () => import("@/views/dashboard/certification.vue");
const holidayCard = () => import("@/views/dashboard/holidayCard.vue");
const birthdayCard = () => import("@/views/dashboard/birthdayCard.vue");
const medal = () => import("@/views/dashboard/medal.vue");

const orders = () => import("@/views/dashboard/orders.vue");
const packet = () => import("@/views/dashboard/packet.vue");
const boxcoin = () => import("@/views/dashboard/boxcoin.vue");
const points = () => import("@/views/dashboard/points.vue");
const cny = () => import("@/views/dashboard/cny.vue");
const tasks = () => import("@/views/dashboard/tasks.vue");
const card = () => import("@/views/dashboard/card.vue");
const ic = () => import("@/views/dashboard/ic.vue");

// const BindRole = () => import("@/views/dashboard/role/BindRole.vue");
const BindRole = () => import("@/views/dashboard/role/BindRole2.vue");
const ListRole = () => import("@/views/dashboard/role/ListRole.vue");
const AddRole = () => import("@/views/dashboard/role/AddRole.vue");
const EditRole = () => import("@/views/dashboard/role/EditRole.vue");
const ViewRole = () => import("@/views/dashboard/role/ViewRole.vue");
const SyncData = () => import("@/views/dashboard/role/SyncData.vue");

const profile = () => import("@/views/dashboard/profile.vue");
const avatar = () => import("@/views/dashboard/avatar.vue");
const pwd = () => import("@/views/dashboard/pwd.vue");
const notice = () => import("@/views/dashboard/notice/index.vue");
const connect = () => import("@/views/dashboard/connect.vue");
const config = () => import("@/views/dashboard/config.vue");
const privacy = () => import("@/views/dashboard/privacy.vue");
const cooperation = () => import("@/views/dashboard/cooperation.vue");
const feedback = () => import("@/views/dashboard/feedback.vue");
const auth = () => import("@/views/dashboard/auth.vue");

const address = () => import("@/views/dashboard/address.vue");
const mall = () => import("@/views/dashboard/mall.vue");
const order_detail = () => import("@/views/dashboard/order_detail.vue");
const filter = () => import("@/views/dashboard/filter.vue");

const invitation_creators = () => import("@/views/dashboard/callback/invitation_creators.vue");
const invitation_kith = () => import("@/views/dashboard/callback/invitation_kith.vue");

const routes = [
    {
        name: "index",
        path: "/",
        component: index,
        meta: {
            i18n: {
                title: "pages.dashboard.index.title",
                description: "pages.dashboard.index.description",
                keywords: "pages.dashboard.index.keywords",
            },
        },
    },

    {
        name: "msg",
        path: "/msg",
        component: msg,
        meta: {
            i18n: {
                title: "pages.dashboard.msg.title",
                description: "pages.dashboard.msg.description",
                keywords: "pages.dashboard.msg.keywords",
            },
        },
    },
    {
        name: "letter",
        path: "/letter",
        component: letter,
        meta: {
            i18n: {
                title: "pages.dashboard.letter.title",
                description: "pages.dashboard.letter.description",
                keywords: "pages.dashboard.letter.keywords",
            },
        },
    },
    // { name: "feed", path: "/feed", component: feed },
    {
        name: "fav",
        path: "/fav/:subtype?",
        component: fav,
        meta: {
            i18n: {
                title: "pages.dashboard.fav.title",
                description: "pages.dashboard.fav.description",
                keywords: "pages.dashboard.fav.keywords",
            },
        },
    },
    {
        name: "purchases",
        path: "/purchases",
        component: purchases,
        meta: {
            i18n: {
                title: "pages.dashboard.purchases.title",
                description: "pages.dashboard.purchases.description",
                keywords: "pages.dashboard.purchases.keywords",
            },
        },
    },
    {
        name: "frame",
        path: "/frame",
        component: frame,
        meta: {
            i18n: {
                title: "pages.dashboard.frame.title",
                description: "pages.dashboard.frame.description",
                keywords: "pages.dashboard.frame.keywords",
            },
        },
    },
    {
        name: "theme",
        path: "/theme",
        component: theme,
        meta: {
            i18n: {
                title: "pages.dashboard.theme.title",
                description: "pages.dashboard.theme.description",
                keywords: "pages.dashboard.theme.keywords",
            },
        },
    },
    {
        name: "emotion",
        path: "/emotion",
        component: emotion,
        meta: {
            i18n: {
                title: "pages.dashboard.emotion.title",
                description: "pages.dashboard.emotion.description",
                keywords: "pages.dashboard.emotion.keywords",
            },
        },
    },
    {
        name: "honor",
        path: "/honor",
        component: honor,
        meta: {
            i18n: {
                title: "pages.dashboard.honor.title",
                description: "pages.dashboard.honor.description",
                keywords: "pages.dashboard.honor.keywords",
            },
        },
    },
    {
        name: "medal",
        path: "/medal",
        component: medal,
        meta: {
            i18n: {
                title: "pages.dashboard.medal.title",
                description: "pages.dashboard.medal.description",
                keywords: "pages.dashboard.medal.keywords",
            },
        },
    },
    {
        name: "treasure",
        path: "/treasure",
        redirect: {
            name: "certification",
        },
        meta: {
            i18n: {
                title: "pages.dashboard.treasure.title",
                description: "pages.dashboard.treasure.description",
                keywords: "pages.dashboard.treasure.keywords",
            },
        },
    },
    {
        name: "certification",
        path: "/treasure/certification",
        component: certification,
        meta: {
            i18n: {
                title: "pages.dashboard.certification.title",
                description: "pages.dashboard.certification.description",
                keywords: "pages.dashboard.certification.keywords",
            },
        },
    },
    {
        name: "holidayCard",
        path: "/treasure/holiday-card",
        component: holidayCard,
        meta: {
            i18n: {
                title: "pages.dashboard.holiday_card.title",
                description: "pages.dashboard.holiday_card.description",
                keywords: "pages.dashboard.holiday_card.keywords",
            },
        },
    },
    {
        name: "birthdayCard",
        path: "/treasure/birthday-card",
        component: birthdayCard,
        meta: {
            i18n: {
                title: "pages.dashboard.birthday_card.title",
                description: "pages.dashboard.birthday_card.description",
                keywords: "pages.dashboard.birthday_card.keywords",
            },
        },
    },

    {
        name: "mall",
        path: "/mall",
        component: mall,
        meta: {
            i18n: {
                title: "pages.dashboard.mall.title",
                description: "pages.dashboard.mall.description",
                keywords: "pages.dashboard.mall.keywords",
            },
        },
    },
    {
        name: "orders",
        path: "/orders",
        component: orders,
        meta: {
            i18n: {
                title: "pages.dashboard.orders.title",
                description: "pages.dashboard.orders.description",
                keywords: "pages.dashboard.orders.keywords",
            },
        },
    },
    {
        name: "packet",
        path: "/packet",
        component: packet,
        meta: {
            i18n: {
                title: "pages.dashboard.packet.title",
                description: "pages.dashboard.packet.description",
                keywords: "pages.dashboard.packet.keywords",
            },
        },
    },
    {
        name: "boxcoin",
        path: "/boxcoin",
        component: boxcoin,
        meta: {
            i18n: {
                title: "pages.dashboard.boxcoin.title",
                description: "pages.dashboard.boxcoin.description",
                keywords: "pages.dashboard.boxcoin.keywords",
            },
        },
    },
    {
        name: "cny",
        path: "/cny",
        component: cny,
        meta: {
            i18n: {
                title: "pages.dashboard.cny.title",
                description: "pages.dashboard.cny.description",
                keywords: "pages.dashboard.cny.keywords",
            },
        },
    },
    {
        name: "points",
        path: "/points",
        component: points,
        meta: {
            i18n: {
                title: "pages.dashboard.points.title",
                description: "pages.dashboard.points.description",
                keywords: "pages.dashboard.points.keywords",
            },
        },
    },
    {
        name: "tasks",
        path: "/tasks",
        component: tasks,
        meta: {
            i18n: {
                title: "pages.dashboard.tasks.title",
                description: "pages.dashboard.tasks.description",
                keywords: "pages.dashboard.tasks.keywords",
            },
        },
    },
    {
        name: "card",
        path: "/card",
        component: card,
        meta: {
            i18n: {
                title: "pages.dashboard.card.title",
                description: "pages.dashboard.card.description",
                keywords: "pages.dashboard.card.keywords",
            },
        },
    },
    {
        name: "ic",
        path: "/ic",
        component: ic,
        meta: {
            i18n: {
                title: "pages.dashboard.ic.title",
                description: "pages.dashboard.ic.description",
                keywords: "pages.dashboard.ic.keywords",
            },
        },
    },

    {
        name: "bind_role",
        path: "/role/bind",
        component: BindRole,
        meta: {
            i18n: {
                title: "pages.dashboard.bind_role.title",
                description: "pages.dashboard.bind_role.description",
                keywords: "pages.dashboard.bind_role.keywords",
            },
        },
    },
    {
        name: "sync_data",
        path: "/role/sync",
        component: SyncData,
        meta: {
            i18n: {
                title: "pages.dashboard.sync_data.title",
                description: "pages.dashboard.sync_data.description",
                keywords: "pages.dashboard.sync_data.keywords",
            },
        },
    },
    {
        name: "list_role",
        path: "/role",
        component: ListRole,
        meta: {
            i18n: {
                title: "pages.dashboard.list_role.title",
                description: "pages.dashboard.list_role.description",
                keywords: "pages.dashboard.list_role.keywords",
            },
        },
    },
    {
        name: "add_role",
        path: "/role/add",
        component: AddRole,
        meta: {
            i18n: {
                title: "pages.dashboard.add_role.title",
                description: "pages.dashboard.add_role.description",
                keywords: "pages.dashboard.add_role.keywords",
            },
        },
    },
    {
        name: "edit_role",
        path: "/role/edit/:id",
        component: EditRole,
        meta: {
            i18n: {
                title: "pages.dashboard.edit_role.title",
                description: "pages.dashboard.edit_role.description",
                keywords: "pages.dashboard.edit_role.keywords",
            },
        },
    },
    {
        name: "view_role",
        path: "/role/:id",
        component: ViewRole,
        meta: {
            i18n: {
                title: "pages.dashboard.view_role.title",
                description: "pages.dashboard.view_role.description",
                keywords: "pages.dashboard.view_role.keywords",
            },
        },
    },

    {
        name: "profile",
        path: "/profile",
        component: profile,
        meta: {
            i18n: {
                title: "pages.dashboard.profile.title",
                description: "pages.dashboard.profile.description",
                keywords: "pages.dashboard.profile.keywords",
            },
        },
    },
    {
        name: "avatar",
        path: "/avatar",
        component: avatar,
        meta: {
            i18n: {
                title: "pages.dashboard.avatar.title",
                description: "pages.dashboard.avatar.description",
                keywords: "pages.dashboard.avatar.keywords",
            },
        },
    },
    {
        name: "pwd",
        path: "/pwd",
        component: pwd,
        meta: {
            i18n: {
                title: "pages.dashboard.pwd.title",
                description: "pages.dashboard.pwd.description",
                keywords: "pages.dashboard.pwd.keywords",
            },
        },
    },
    {
        name: "notice",
        path: "/notice",
        component: notice,
        meta: {
            i18n: {
                title: "pages.dashboard.notice.title",
                description: "pages.dashboard.notice.description",
                keywords: "pages.dashboard.notice.keywords",
            },
        },
    },
    {
        name: "connect",
        path: "/connect",
        component: connect,
        meta: {
            i18n: {
                title: "pages.dashboard.connect.title",
                description: "pages.dashboard.connect.description",
                keywords: "pages.dashboard.connect.keywords",
            },
        },
    },
    {
        name: "config",
        path: "/config",
        component: config,
        meta: {
            i18n: {
                title: "pages.dashboard.config.title",
                description: "pages.dashboard.config.description",
                keywords: "pages.dashboard.config.keywords",
            },
        },
    },
    {
        name: "cooperation",
        path: "/cooperation",
        component: cooperation,
        meta: {
            i18n: {
                title: "pages.dashboard.cooperation.title",
                description: "pages.dashboard.cooperation.description",
                keywords: "pages.dashboard.cooperation.keywords",
            },
        },
    },
    {
        name: "privacy",
        path: "/privacy",
        component: privacy,
        meta: {
            i18n: {
                title: "pages.dashboard.privacy.title",
                description: "pages.dashboard.privacy.description",
                keywords: "pages.dashboard.privacy.keywords",
            },
        },
    },
    {
        name: "filter",
        path: "/filter",
        component: filter,
        meta: {
            i18n: {
                title: "pages.dashboard.filter.title",
                description: "pages.dashboard.filter.description",
                keywords: "pages.dashboard.filter.keywords",
            },
        },
    },

    {
        name: "address",
        path: "/address",
        component: address,
        meta: {
            i18n: {
                title: "pages.dashboard.address.title",
                description: "pages.dashboard.address.description",
                keywords: "pages.dashboard.address.keywords",
            },
        },
    },
    {
        name: "auth",
        path: "/auth",
        component: auth,
        meta: {
            i18n: {
                title: "pages.dashboard.auth.title",
                description: "pages.dashboard.auth.description",
                keywords: "pages.dashboard.auth.keywords",
            },
        },
    },
    {
        name: "order-detail",
        path: "/mall-detail/:id",
        component: order_detail,
        meta: {
            i18n: {
                title: "pages.dashboard.order_detail.title",
                description: "pages.dashboard.order_detail.description",
                keywords: "pages.dashboard.order_detail.keywords",
            },
        },
    },

    {
        name: "feedback",
        path: "/feedback",
        component: feedback,
        redirect: {
            name: "feedback_index",
        },
        meta: {
            i18n: {
                title: "pages.dashboard.feedback.title",
                description: "pages.dashboard.feedback.description",
                keywords: "pages.dashboard.feedback.keywords",
            },
        },
        children: [
            {
                name: "feedback_index",
                path: "/feedback",
                component: () => import("@/components/dashboard/feedback/index.vue"),
                meta: {
                    i18n: {
                        title: "pages.dashboard.feedback_index.title",
                        description: "pages.dashboard.feedback_index.description",
                        keywords: "pages.dashboard.feedback_index.keywords",
                    },
                },
            },
            {
                name: "feedback_erase",
                path: "/feedback/erase",
                component: () => import("@/components/dashboard/feedback/erase.vue"),
                meta: {
                    i18n: {
                        title: "pages.dashboard.feedback_erase.title",
                        description: "pages.dashboard.feedback_erase.description",
                        keywords: "pages.dashboard.feedback_erase.keywords",
                    },
                },
            },
            {
                name: "feedback_single",
                path: "/feedback/:id",
                component: () => import("@/components/dashboard/feedback/single.vue"),
                meta: {
                    i18n: {
                        title: "pages.dashboard.feedback_single.title",
                        description: "pages.dashboard.feedback_single.description",
                        keywords: "pages.dashboard.feedback_single.keywords",
                    },
                },
            },
        ],
    },

    {
        name: "invitation_creators",
        path: "/callback/invitation/creators",
        component: invitation_creators,
        meta: {
            i18n: {
                title: "pages.dashboard.invitation_creators.title",
                description: "pages.dashboard.invitation_creators.description",
                keywords: "pages.dashboard.invitation_creators.keywords",
            },
        },
    },
    {
        name: "invitation_kith",
        path: "/callback/invitation/kith",
        component: invitation_kith,
        meta: {
            i18n: {
                title: "pages.dashboard.invitation_kith.title",
                description: "pages.dashboard.invitation_kith.description",
                keywords: "pages.dashboard.invitation_kith.keywords",
            },
        },
    },
];

const router = createRouter({
    routes,
    history: createWebHistory("/dashboard"),
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
