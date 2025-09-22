import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/card/Index.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "index",
        component: Index,
    },
]

const router = new VueRouter({
    routes,
    mode: "history",
    base: "/card/",
});

router.beforeEach((to, from, next) => {
    console.log('Router navigation:', to.path);
    next();
});

export default router;
