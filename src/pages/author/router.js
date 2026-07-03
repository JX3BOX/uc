import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";
import { searchUser } from "@/service/author/cms";

const isMini = isMiniProgram() || isApp();
const isNumericId = (value) => /^\d+$/.test(String(value || ""));

const resolveAuthorNickname = async (to) => {
    const author = String(to.params.id || "").trim();
    if (!author || isNumericId(author)) return true;

    const res = await searchUser(author).catch(() => null);
    const uid = res?.data?.data?.ID;
    if (!uid) return true;

    return {
        name: "index",
        params: {
            id: String(uid),
        },
        query: to.query,
        hash: to.hash,
        replace: true,
    };
};

const routes = [
    {
        path: "/:id",
        name: "index",
        component: isMini ? () => import("@/views/author/mobile/Index.vue") : () => import("@/views/author/Index.vue"),
        beforeEnter: resolveAuthorNickname,
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
                title: "pages.author.birthday.title",
                keywords: "pages.author.birthday.keywords",
                description: "pages.author.birthday.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/certificate/:id(\\d+)",
        name: "certificate",
        component: () => import("@/views/author/certificate.vue"),
        meta: {
            i18n: {
                title: "pages.author.certificate.title",
                keywords: "pages.author.certificate.keywords",
                description: "pages.author.certificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/groupCertificate/:id(\\d+)",
        name: "groupCertificate",
        component: () => import("@/views/author/groupCertificate.vue"),
        meta: {
            i18n: {
                title: "pages.author.groupCertificate.title",
                keywords: "pages.author.groupCertificate.keywords",
                description: "pages.author.groupCertificate.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/holiday-card/:event_id(\\d+)",
        name: "holidayCard",
        component: () => import("@/views/card/HolidayCard.vue"),
        meta: {
            i18n: {
                title: "pages.author.holidayCard.title",
                keywords: "pages.author.holidayCard.keywords",
                description: "pages.author.holidayCard.description",
            },
        },
    },
    {
        path: "/:uid(\\d+)/birthday-card/:skin(\\w+)?",
        name: "birthdayCard",
        component: () => import("@/views/card/BirthdayCard.vue"),
        meta: {
            i18n: {
                title: "pages.author.birthdayCard.title",
                keywords: "pages.author.birthdayCard.keywords",
                description: "pages.author.birthdayCard.description",
            },
        },
    },
];

const router = createRouter({
    routes,
    history: createWebHistory("/author"),
});

export default router;
