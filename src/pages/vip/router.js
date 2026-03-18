import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        name: "index",
        path: "/",
        component: () => import("@/views/vip/index.vue"),
        meta: {
            i18n: {
                title: "pages.vip.title",
                keywords: "pages.vip.keywords",
                description: "pages.vip.description",
            },
        },
    },
    // 货币充值
    {
        name: "boxcoin",
        path: "/boxcoin",
        component: () => import("@/views/vip/boxcoin.vue"),
        meta: {
            title: "盒币充值",
            i18n: {
                title: "pages.vip.boxcoin.title",
                keywords: "pages.vip.boxcoin.keywords",
                description: "pages.vip.boxcoin.description",
            },
        },
    },
    {
        name: "cny",
        path: "/cny",
        component: () => import("@/views/vip/cny.vue"),
        meta: {
            title: "金箔充值",
            i18n: {
                title: "pages.vip.cny.title",
                keywords: "pages.vip.cny.keywords",
                description: "pages.vip.cny.description",
            },
        },
    },
    {
        name: "lottery",
        path: "/lottery",
        component: () => import("@/views/vip/lottery/index.vue"),
        meta: {
            title: "积分抽奖",
            i18n: {
                title: "pages.vip.lottery.title",
                keywords: "pages.vip.lottery.keywords",
                description: "pages.vip.lottery.description",
            },
        },
    },

    // 系统商品
    {
        name: "premium",
        path: "/premium",
        component: () => import("@/views/vip/premium/index.vue"),
        meta: {
            title: "开通会员",
            i18n: {
                title: "pages.vip.premium.title",
                keywords: "pages.vip.premium.keywords",
                description: "pages.vip.premium.description",
            },
        },
    },
    {
        name: "rename",
        path: "/rename",
        component: () => import("@/views/vip/rename.vue"),
        meta: {
            title: "修改昵称",
            i18n: {
                title: "pages.vip.rename.title",
                keywords: "pages.vip.rename.keywords",
                description: "pages.vip.rename.description",
            },
        },
    },
    {
        name: "namespace",
        path: "/namespace",
        component: () => import("@/views/vip/namespace.vue"),
        meta: {
            title: "剑三铭牌",
            i18n: {
                title: "pages.vip.namespace.title",
                keywords: "pages.vip.namespace.keywords",
                description: "pages.vip.namespace.description",
            },
        },
    },
    {
        name: "mallNew",
        path: "/mall",
        component: () => import("@/views/vip/mallNew.vue"),
        meta: {
            title: "积分商城",
            i18n: {
                title: "pages.vip.mall.title",
                keywords: "pages.vip.mall.keywords",
                description: "pages.vip.mall.description",
            },
        },
        redirect: "mall/list",
        children: [
            {
                name: "mall_list_new",
                path: "list",
                component: () => import("@/views/vip/mallNew/Index.vue"),
                meta: {
                    keepAlive: true,
                    title: "积分商城",
                    i18n: {
                        title: "pages.vip.mall.list.title",
                        keywords: "pages.vip.mall.list.keywords",
                        description: "pages.vip.mall.list.description",
                    },
                },
            },
            {
                name: "mall_list_new_id",
                path: ":id(\\d+)",
                component: () => import("@/views/vip/mallNew/Index.vue"),
                meta: {
                    keepAlive: true,
                    title: "积分商城",
                    i18n: {
                        title: "pages.vip.mall.list.title",
                        keywords: "pages.vip.mall.list.keywords",
                        description: "pages.vip.mall.list.description",
                    },
                },
            },
            {
                name: "mall_batch_order_new",
                path: "batch",
                component: () => import("@/views/vip/mallNew/BatchOrder.vue"),
                meta: {
                    title: "积分商城 - 订单",
                    i18n: {
                        title: "pages.vip.mall.batchOrder.title",
                        keywords: "pages.vip.mall.batchOrder.keywords",
                        description: "pages.vip.mall.batchOrder.description",
                    },
                },
            },
            {
                name: "mall_order_new",
                path: "order/:id(\\d+)",
                component: () => import("@/views/vip/mallNew/Order.vue"),
                meta: {
                    title: "积分商城 - 订单",
                    i18n: {
                        title: "pages.vip.mall.order.title",
                        keywords: "pages.vip.mall.order.keywords",
                        description: "pages.vip.mall.order.description",
                    },
                },
            },
        ],
    },
    {
        name: "mallWeb",
        path: "/mallWeb",
        component: () => import("@/views/vip/mallWeb.vue"),
        meta: {
            title: "积分商城",
            i18n: {
                title: "pages.vip.mall.title",
                keywords: "pages.vip.mall.keywords",
                description: "pages.vip.mall.description",
            },
        },
        redirect: "/mallWeb/list",
        children: [
            {
                name: "mall_list_web",
                path: "list",
                component: () => import("@/views/vip/mallWeb/Index.vue"),
                meta: {
                    keepAlive: true,
                    title: "积分商城",
                    i18n: {
                        title: "pages.vip.mall.list.title",
                        keywords: "pages.vip.mall.list.keywords",
                        description: "pages.vip.mall.list.description",
                    },
                },
            },
            {
                name: "mall_detail_web",
                path: ":id(\\d+)",
                component: () => import("@/views/vip/mallWeb/Detail.vue"),
                meta: {
                    title: "积分商城 - 商品详情",
                    i18n: {
                        title: "pages.vip.mall.detail.title",
                        keywords: "pages.vip.mall.detail.keywords",
                        description: "pages.vip.mall.detail.description",
                    },
                },
            },
            {
                name: "mall_batch_order_web",
                path: "batch",
                component: () => import("@/views/vip/mallNew/BatchOrder.vue"),
                meta: {
                    title: "积分商城 - 订单",
                    i18n: {
                        title: "pages.vip.mall.batchOrder.title",
                        keywords: "pages.vip.mall.batchOrder.keywords",
                        description: "pages.vip.mall.batchOrder.description",
                    },
                },
            },
            {
                name: "mall_order_web",
                path: "order/:id(\\d+)",
                component: () => import("@/views/vip/mallNew/Order.vue"),
                meta: {
                    title: "积分商城 - 订单",
                    i18n: {
                        title: "pages.vip.mall.order.title",
                        keywords: "pages.vip.mall.order.keywords",
                        description: "pages.vip.mall.order.description",
                    },
                },
            },
            {
                name: "mall_cart_web",
                path: "cart",
                component: () => import("@/views/vip/mallWeb/Cart.vue"),
                meta: {
                    title: "积分商城 - 购物车",
                    i18n: {
                        title: "pages.vip.mall.cart.title",
                        keywords: "pages.vip.mall.cart.keywords",
                        description: "pages.vip.mall.cart.description",
                    },
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory("/vip"),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || "会员中心";
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    if ((to.name === "mall_list_new" || to.name === "mall_list_new_id") && window.innerWidth < 750) {
        next(`/mallWeb${to.params.id ? `/${to.params.id}` : ""}`);
    }
    next();
});

export default router;
