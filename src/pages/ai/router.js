import { createRouter, createWebHistory } from "vue-router";

const Editor = () => import("@/views/ai/Editor.vue");

const routes = [
    {
        path: "/",
        redirect: "/editor",
    },
    {
        name: "ai_editor",
        path: "/editor",
        component: Editor,
        meta: {
            title: "AI 编辑器预览",
        },
    },
];

const router = createRouter({
    history: createWebHistory("/ai/"),
    routes,
});

export default router;
