<template>
    <AppLayout>
        <div class="m-theme" :style="themeStyle">
            <div class="m-author" :class="isAdmin ? 'm-author-admin' : ''">
                <Me :decorationMe="decorationMe" :honor="honor" :medals="medals" />
            </div>
        </div>
        <CommonFooter></CommonFooter>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/author/AppLayout.vue";
import Me from "@/components/author/newComponents/Me.vue";
import { getUserInfo, getUserSkin } from "@/service/author/cms";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@/utils/config";

const HOMEBG_TYPE = "homebg";
const PC_PAGE_BG_SUBTYPE = "pc_homebg";
const PC_BANNER_SUBTYPE = "pc_homebanner";
const SKIN_POSITION_MAP = {
    lt: "left top",
    mt: "center top",
    ct: "center top",
    rt: "right top",
    lm: "left center",
    ml: "left center",
    mm: "center center",
    cm: "center center",
    o: "center center",
    rm: "right center",
    mr: "right center",
    lb: "left bottom",
    mb: "center bottom",
    cb: "center bottom",
    rb: "right bottom",
};

export default {
    name: "Author",
    components: {
        Me,
        AppLayout,
    },
    props: [],
    data: function () {
        return {
            isAdmin: User.getInfo().group >= 128,
            themeStyle: {},
            decorationMe: { status: false },
            honor: null,
            medals: [],
        };
    },
    computed: {
        userdata: function () {
            return this.$store.state.userdata;
        },
        uid: function () {
            return this.$route.params.id;
        },
        root: function () {
            return "/author/" + this.uid;
        },
        name: function () {
            return this.$store.state.userdata.display_name || this.$t("author.common.jx3box");
        },
    },
    created: function () {
        if (this.uid) {
            this.$store.state.uid = ~~this.uid;
            getUserInfo(this.uid).then((res) => {
                this.$store.state.userdata = res.data.data;
            });
            this.loadSkin();
        }
    },
    methods: {
        loadSkin() {
            this.themeStyle = {};
            this.decorationMe = { status: false };
            this.honor = null;
            this.medals = [];

            getUserSkin({
                user_id: this.uid,
            })
                .then((res) => {
                    const rows = Array.isArray(res.data?.data) ? res.data.data : [];
                    const skins = this.flattenUserSkinRows(rows.filter((item) => item?.type === HOMEBG_TYPE));
                    this.honor = rows.find((item) => item?.type === "honor")?.honor || null;
                    this.medals = rows.find((item) => item?.type === "medals")?.medals || [];
                    this.applyPageSkin(this.selectSkinBySubtype(skins, PC_PAGE_BG_SUBTYPE));
                    this.applyBannerSkin(this.selectSkinBySubtype(skins, PC_BANNER_SUBTYPE));
                })
                .catch(() => {});
        },
        flattenUserSkinRows(rows = []) {
            return (Array.isArray(rows) ? rows : []).flatMap((row) => (Array.isArray(row?.skins) ? row.skins : []));
        },
        selectSkinBySubtype(list = [], subtype) {
            const items = (Array.isArray(list) ? list : []).filter((item) => item?.subtype === subtype && item?.image);
            if (!items.length) return null;

            const currentTheme = this.getCurrentSkinTheme();
            const getTheme = (item) =>
                String(item?.theme || "")
                    .trim()
                    .toLowerCase();

            return (
                items.find((item) => getTheme(item) === currentTheme) ||
                items.find((item) => getTheme(item) === "all") ||
                null
            );
        },
        getCurrentSkinTheme() {
            if (typeof window === "undefined") return "light";
            return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
        },
        normalizeSkinImage(image = "") {
            const raw = String(image || "").trim();
            if (!raw) return "";
            if (/^(https?:)?\/\//.test(raw)) return raw;
            return `${__cdn}${raw.replace(/^\/+/, "")}`;
        },
        resolveSkinPosition(position, fallback = "right top") {
            const raw = String(position || "").trim();
            if (!raw) return fallback;

            const key = raw.toLowerCase();
            if (SKIN_POSITION_MAP[key]) return SKIN_POSITION_MAP[key];

            const cssPositionPattern =
                /^(?:(?:left|center|right)(?:\s+(?:top|center|bottom))?|(?:top|center|bottom)(?:\s+(?:left|center|right))?)$/i;
            return cssPositionPattern.test(raw) ? raw : fallback;
        },
        applyPageSkin(skin) {
            const image = this.normalizeSkinImage(skin?.image);
            if (!image) {
                this.themeStyle = {};
                return;
            }

            this.decorationMe = {
                ...this.decorationMe,
                uidTextcolor: skin?.textcolor,
            };
            this.themeStyle = {
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundPosition: this.resolveSkinPosition(skin?.position, "center top"),
                backgroundSize: "cover",
            };
        },
        applyBannerSkin(skin) {
            const banner = this.normalizeSkinImage(skin?.image);
            if (!banner) return;

            this.decorationMe = {
                ...this.decorationMe,
                status: true,
                banner,
                bannerPosition: this.resolveSkinPosition(skin?.position, "right top"),
                highlightcolor: skin?.highlightcolor,
                textcolor: skin?.textcolor,
                buttoncolor: skin?.buttoncolor,
                buttontextcolor: skin?.buttontextcolor,
            };
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/author/app.less";
@import "~@/assets/css/author/post.less";
.m-theme {
    min-height: calc(100vh - @header-height);
}
</style>
