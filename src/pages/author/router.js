import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

const isMini = isMiniProgram() || isApp();

const routes = [
    {
        path: "/:id(\\d+)",
        name: "index",
        component: isMini ? () => import("@/views/author/mobile/Index.vue") : () => import("@/views/author/Index.vue"),
        meta: {
            i18n: {
                title: "pages.author.title",
                keywords: "pages.author.keywords",
                description: "pages.author.description",
            },
        },
    },
    {
        path: "/birthday",
        name: "birthday",
        component: () => import("@/views/author/Birthday.vue"),
        meta: {
            i18n: {
                title: "pages.birthday.title",
                keywords: "pages.birthday.keywords",
                description: "pages.birthday.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/certificate/:id(\\d+)",
        name: "certificate",
        component: () => import("@/views/author/certificate.vue"),
        meta: {
            i18n: {
                title: "pages.certificate.title",
                keywords: "pages.certificate.keywords",
                description: "pages.certificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/groupCertificate/:id(\\d+)",
        name: "groupCertificate",
        component: () => import("@/views/author/groupCertificate.vue"),
        meta: {
            i18n: {
                title: "pages.groupCertificate.title",
                keywords: "pages.groupCertificate.keywords",
                description: "pages.groupCertificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/holiday-card/:event_id(\\d+)",
        name: "holidayCard",
        component: () => import("@/views/card/HolidayCard.vue"),
        meta: {
            i18n: {
                title: "pages.holidayCard.title",
                keywords: "pages.holidayCard.keywords",
                description: "pages.holidayCard.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/birthday-card/:skin(\\w+)?",
        name: "birthdayCard",
        component: () => import("@/views/card/BirthdayCard.vue"),
        meta: {
            i18n: {
                title: "pages.birthdayCard.title",
                keywords: "pages.birthdayCard.keywords",
                description: "pages.birthdayCard.description",
            },
        },
    },
];

const router = createRouter({
    routes,
    history: createWebHistory("/author"),
});

export default router;
