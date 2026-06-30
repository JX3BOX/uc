<template>
    <AppLayout>
        <div class="m-theme" :style="themeStyle">
            <div class="m-author" :class="isAdmin ? 'm-author-admin' : ''">
                <Me :decorationMe="decorationMe" :honor="honor" />
            </div>
        </div>
        <CommonFooter></CommonFooter>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/author/AppLayout.vue";
import Me from "@/components/author/newComponents/Me.vue";
import { getUserInfo, getDecorationV2 } from "@/service/author/cms";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@/utils/config";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
const DECORATION_KEY = "decoration_me_pc_home_v2";
const DECORATION_POSITION = {
    lt: "top left",
    rt: "top right",
    lb: "bottom left",
    rb: "bottom right",
    ct: "top center",
    cc: "center center",
    cb: "bottom center",
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
            return this.$store.state.userdata.display_name || "魔盒";
        },
    },
    created: function () {
        if (this.uid) {
            this.$store.state.uid = ~~this.uid;
            getUserInfo(this.uid).then((res) => {
                this.$store.state.userdata = res.data.data;
            });
            this.getDecoration();
        }
    },
    methods: {
        //获取装扮,动态获取uid的装扮，缓存指定UID
        getDecoration() {
            let decoration_local = sessionStorage.getItem(DECORATION_KEY + this.uid);
            if (decoration_local) {
                //解析本地缓存
                let decoration_parse = JSON.parse(decoration_local);
                if (!decoration_parse.status) return;

                if (decoration_parse) {
                    this.setDecoration(decoration_parse);
                    return;
                }
            }
            Promise.all([
                getDecorationV2({ type: "homebg", subtype: "pc_homebanner", using: 1 }),
                getDecorationV2({ type: "homebg", subtype: "pc_homebg", using: 1 }),
            ]).then(([bannerRes, backgroundRes]) => {
                const bannerDecoration = bannerRes?.data?.data?.[0];
                const backgroundDecoration = backgroundRes?.data?.data?.[0];
                const decorationItem = this.resolveDecorationItem(bannerDecoration);
                const backgroundItem = this.resolveDecorationItem(backgroundDecoration);
                const banner = this.resolveDecorationImage(decorationItem?.image);
                const themeBackground = this.resolveThemeBackgroundImage(backgroundItem?.image);
                if (!banner && !themeBackground) {
                    //空 则为无主题，不再加载接口，Me界面设No
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify({ status: false }));
                    return;
                }
                const theme = {
                    ...bannerDecoration,
                    ...decorationItem,
                    banner: this.resolveDecorationImage(decorationItem?.image),
                    bannerPosition: this.resolveDecorationPosition(decorationItem?.postion || decorationItem?.position),
                    themeBackground: this.resolveThemeBackgroundImage(backgroundItem?.image),
                    themeBackgroundPosition: this.resolveDecorationPosition(backgroundItem?.postion || backgroundItem?.position),
                    status: true,
                };
                sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                this.setDecoration(theme);
            });
        },
        resolveDecorationItem(decoration) {
            const decorations = Array.isArray(decoration?.decorations)
                ? decoration.decorations
                : Array.isArray(decoration?.decoration)
                ? decoration.decoration
                : [];
            if (decorations.length) {
                return {
                    ...decoration,
                    ...(decorations.find((item) => item?.image) || decorations[0]),
                };
            }
            return {
                ...decoration,
                ...decoration?.decoration,
            };
        },
        resolveDecorationImage(image) {
            if (!image) {
                return "";
            }
            const markdownLink = String(image).match(/\]\(([^)]+)\)/);
            const url = markdownLink?.[1] || image;
            if (url.startsWith("//")) return resolveImagePath(`https:${url}`);
            if (/^https?:\/\//i.test(url)) return resolveImagePath(url);
            return resolveImagePath(__cdn + url.replace(/^\/+/, ""));
        },
        resolveThemeBackgroundImage(image) {
            const url = this.resolveDecorationImage(image);
            if (!url || document.body.offsetWidth <= 2560 || /x-oss-process=/.test(url)) {
                return url;
            }
            const joiner = url.includes("?") ? "&" : "?";
            return `${url}${joiner}x-oss-process=image/resize,w_2560`;
        },
        resolveDecorationPosition(position) {
            if (!position) {
                return "center center";
            }
            return DECORATION_POSITION[position] || position;
        },
        showDecoration: function (val, type) {
            return __cdn + `design/decoration/images/${val}/${type}.png`;
        },
        setDecoration(theme) {
            this.decorationMe = theme;
            if (theme.themeBackground) {
                this.themeStyle = {
                    backgroundImage: `url(${theme.themeBackground})`,
                    backgroundPosition: theme.themeBackgroundPosition || "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    backgroundSize: "cover",
                };
                return;
            }
            let bgImg = [],
                w = document.body.offsetWidth;
            // if(!theme.homebg_rb){
            //     bgImg.push('url('+this.showDecoration('0_TESTSAMPLE','homebg_rb')+') bottom right no-repeat fixed')
            // }
            // 背景进行4位置判断,homebg_lt>homebg_rt>homebg_lb>homebg_rb
            let size = 1;
            if (w > 1920) {
                size = 2;
            }
            if (theme.homebg_lt) {
                bgImg.push(`url(${this.showDecoration(theme.name, `homebg_lt@${size}x`)}) no-repeat fixed top left / cover`);
            }
            if (theme.homebg_rt) {
                bgImg.push(`url( ${this.showDecoration(theme.name, `homebg_rt@${size}x`)}) no-repeat fixed top right / cover`);
            }
            if (theme.homebg_lb) {
                bgImg.push(`url(${this.showDecoration(theme.name, `homebg_lb@${size}x`)}) no-repeat fixed bottom left / cover`);
            }
            if (theme.homebg_rb) {
                bgImg.push(`url(${this.showDecoration(theme.name, `homebg_rb@${size}x`)})  no-repeat fixed bottom right / cover`);
            }
            this.themeStyle = {
                background: bgImg.toString(),
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
