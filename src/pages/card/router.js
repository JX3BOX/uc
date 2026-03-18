import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/card/Index.vue";


const routes = [
    {
        path: "/",
        name: "index",
        component: Index,
        meta: {
            i18n: {
                title: "pages.card.title",
                keywords: "pages.card.keywords",
                description: "pages.card.description",
            }
        }
    },
]

const router = createRouter({
    history: createWebHistory("/card/"),
    routes,
});

export default router;
