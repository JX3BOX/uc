/*
 * @Author: iRuxu
 * @Date: 2022-06-09 13:55:38
 * @LastEditTime: 2022-07-05 16:42:43
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

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

const BindRole = () => import("@/views/dashboard/role/BindRole.vue");
const ListRole = () => import("@/views/dashboard/role/ListRole.vue");
const AddRole = () => import("@/views/dashboard/role/AddRole.vue");
const EditRole = () => import("@/views/dashboard/role/EditRole.vue");
const ViewRole = () => import("@/views/dashboard/role/ViewRole.vue");

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

Vue.use(VueRouter);

const routes = [
    { name: "index", path: "/", component: index },

    { name: "msg", path: "/msg", component: msg },
    { name: "letter", path: "/letter", component: letter },
    // { name: "feed", path: "/feed", component: feed },
    { name: "fav", path: "/fav/:subtype?", component: fav },
    { name: "purchases", path: "/purchases", component: purchases },
    { name: "frame", path: "/frame", component: frame },
    { name: "theme", path: "/theme", component: theme },
    { name: "emotion", path: "/emotion", component: emotion },
    { name: "honor", path: "/honor", component: honor },
    { name: "medal", path: "/medal", component: medal },
    {
        name: "treasure",
        path: "/treasure",
        redirect: {
            name: "certification",
        },
    },
    { name: "certification", path: "/treasure/certification", component: certification },
    { name: "holidayCard", path: "/treasure/holiday-card", component: holidayCard },
    { name: "birthdayCard", path: "/treasure/birthday-card", component: birthdayCard },

    { name: "mall", path: "/mall", component: mall },
    { name: "orders", path: "/orders", component: orders },
    { name: "packet", path: "/packet", component: packet },
    { name: "boxcoin", path: "/boxcoin", component: boxcoin },
    { name: "cny", path: "/cny", component: cny },
    { name: "points", path: "/points", component: points },
    { name: "tasks", path: "/tasks", component: tasks },
    { name: "card", path: "/card", component: card },
    { name: "ic", path: "/ic", component: ic },

    { name: "bind_role", path: "/role/bind", component: BindRole },
    { name: "list_role", path: "/role", component: ListRole },
    { name: "add_role", path: "/role/add", component: AddRole },
    { name: "edit_role", path: "/role/edit/:id", component: EditRole },
    { name: "view_role", path: "/role/:id", component: ViewRole },

    { name: "profile", path: "/profile", component: profile },
    { name: "avatar", path: "/avatar", component: avatar },
    { name: "pwd", path: "/pwd", component: pwd },
    { name: "notice", path: "/notice", component: notice },
    { name: "connect", path: "/connect", component: connect },
    { name: "config", path: "/config", component: config },
    { name: "cooperation", path: "/cooperation", component: cooperation },
    { name: "privacy", path: "/privacy", component: privacy },
    { name: "filter", path: "/filter", component: filter },

    { name: "address", path: "/address", component: address },
    { name: "auth", path: "/auth", component: auth },
    { name: "order-detail", path: "/mall-detail/:id", component: order_detail },

    {
        name: "feedback",
        path: "/feedback",
        component: feedback,
        redirect: {
            name: "feedback_index",
        },
        children: [
            {
                name: "feedback_index",
                path: "/feedback",
                component: () => import("@/components/dashboard/feedback/index.vue"),
            },
            {
                name: "feedback_erase",
                path: "/feedback/erase",
                component: () => import("@/components/dashboard/feedback/erase.vue"),
            },
            {
                name: "feedback_single",
                path: "/feedback/:id",
                component: () => import("@/components/dashboard/feedback/single.vue"),
            },
        ],
    },

    { name: "invitation_creators", path: "/callback/invitation/creators", component: invitation_creators },
    { name: "invitation_kith", path: "/callback/invitation/kith", component: invitation_kith },
];

const router = new VueRouter({
    routes,
    mode: "history",
    // base: "/dashboard",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
