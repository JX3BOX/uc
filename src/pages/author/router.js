import Vue from "vue";
import VueRouter from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

Vue.use(VueRouter);

const isMini = isMiniProgram() || isApp();

const routes = [
    { path: "/:id(\\d+)", name: "index", component: isMini? ()=> import("@/views/author/mobile/Index.vue"): () => import("@/views/author/Index.vue") },
    { path: "/birthday", name: "birthday", component: () => import("@/views/author/Birthday.vue") },
    { path: "/:uid(\\d+)/certificate/:id(\\d+)", name: "certificate", component: () => import("@/views/author/certificate.vue") },
    { path: "/:uid(\\d+)/groupCertificate/:id(\\d+)", name: "groupCertificate", component: () => import("@/views/author/groupCertificate.vue") },
    { path: "/:uid(\\d+)/holiday-card/:event_id(\\d+)", name: "holidayCard", component: () => import("@/views/card/HolidayCard.vue") },
    { path: "/:uid(\\d+)/birthday-card/:skin(\\w+)?", name: "birthdayCard", component: () => import("@/views/card/BirthdayCard.vue") },
];

const router = new VueRouter({
    routes,
    mode: "history",
    base: "/author"
});

export default router;
