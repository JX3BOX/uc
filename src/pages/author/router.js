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
                title: "page.author.title",
                keywords: "page.author.keywords",
                description: "page.author.description",
            },
        },
    },
    {
        path: "/birthday",
        name: "birthday",
        component: () => import("@/views/author/Birthday.vue"),
        meta: {
            i18n: {
                title: "page.birthday.title",
                keywords: "page.birthday.keywords",
                description: "page.birthday.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/certificate/:id(\\d+)",
        name: "certificate",
        component: () => import("@/views/author/certificate.vue"),
        meta: {
            i18n: {
                title: "page.certificate.title",
                keywords: "page.certificate.keywords",
                description: "page.certificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/groupCertificate/:id(\\d+)",
        name: "groupCertificate",
        component: () => import("@/views/author/groupCertificate.vue"),
        meta: {
            i18n: {
                title: "page.groupCertificate.title",
                keywords: "page.groupCertificate.keywords",
                description: "page.groupCertificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/holiday-card/:event_id(\\d+)",
        name: "holidayCard",
        component: () => import("@/views/card/HolidayCard.vue"),
        meta: {
            i18n: {
                title: "page.holidayCard.title",
                keywords: "page.holidayCard.keywords",
                description: "page.holidayCard.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/birthday-card/:skin(\\w+)?",
        name: "birthdayCard",
        component: () => import("@/views/card/BirthdayCard.vue"),
        meta: {
            i18n: {
                title: "page.birthdayCard.title",
                keywords: "page.birthdayCard.keywords",
                description: "page.birthdayCard.description",
            },
        },
    },
];

const router = createRouter({
    routes,
    history: createWebHistory("/author"),
});

export default router;
