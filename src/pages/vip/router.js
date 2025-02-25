import Vue from "vue";
import VueRouter from "vue-router";

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);
const routes = [
    { name: "index", path: "/", component: () => import("@/views/vip/index.vue") },

    // 商城
    {
        path: "/mall",
        name: "mall",
        redirect: "/mall/list",
        component: () => import("@/views/vip/mall.vue"),
        meta: { title: "积分商城" },
        children: [
            {
                name: "mall_list",
                path: "list",
                component: () => import("@/views/vip/mall/Index.vue"),
                meta: { keepAlive: true, title: "积分商城" },
            },
            { name: "mall_detail", path: ":id(\\d+)", component: () => import("@/views/vip/mall/Detail.vue") },
            { name: "mall_order", path: "order", component: () => import("@/views/vip/mall/Order.vue"), title: "积分商城" },
            {
                name: "mall_batch_order",
                path: "batch",
                component: () => import("@/views/vip/mall/BatchOrder.vue"),
                meta: {
                    title: "积分商城 - 订单",
                },
            },
            // {
            //     name: "mall_cart",
            //     path: "cart",
            //     component: () => import("@/views/vip/mall/Cart.vue"),
            //     meta: {
            //         title: "积分商城 - 购物车",
            //     },
            // },
        ],
    },

    // 货币充值
    { name: "boxcoin", path: "/boxcoin", component: () => import("@/views/vip/boxcoin.vue"), meta: { title: "盒币充值" } },
    { name: "cny", path: "/cny", component: () => import("@/views/vip/cny.vue"), meta: { title: "金箔充值" } },
    {
        name: "lottery",
        path: "/lottery",
        component: () => import("@/views/vip/lottery/index.vue"),
        meta: { title: "积分抽奖" },
    },

    // 系统商品
    {
        name: "premium",
        path: "/premium",
        component: () => import("@/views/vip/premium/index.vue"),
        meta: { title: "开通会员" },
    },
    { name: "rename", path: "/rename", component: () => import("@/views/vip/rename.vue"), meta: { title: "修改昵称" } },
    {
        name: "namespace",
        path: "/namespace",
        component: () => import("@/views/vip/namespace.vue"),
        meta: { title: "剑三铭牌" },
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
    base: "/vip",
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || "会员中心";
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
