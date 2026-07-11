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
            i18n: {
                title: "pages.ai.editor.title",
                description: "pages.ai.editor.description",
                keywords: "pages.ai.editor.keywords",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory("/ai/"),
    routes,
});

export default router;
