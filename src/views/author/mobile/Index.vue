<template>
    <AppLayout>
        <div class="c-var p-author-detail" :style="themeStyle">
            <div class="m-author" :class="isAdmin ? 'm-author-admin' : ''">
                <MobileMe :decorationMe="decorationMe" :honor="honor" :privateConf="privateConf" />
            </div>
        </div>

    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/author/AppLayout.vue";
import { getUserInfo, getDecoration, getDecorationJson } from "@/service/author/cms";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@/utils/config";
import MobileMe from "@/components/author/mobile/MobileMe.vue";
import { getPrivateConf } from "@/service/author/author";

const DECORATION_JSON = "decoration_json";
const DECORATION_KEY = "decoration_me";
export default {
    name: "Author",
    components: {
        MobileMe,
        AppLayout,
    },
    props: [],
    data: function() {
        return {
            isAdmin: User.getInfo().group >= 128,
            themeStyle: {},
            decorationMe: { status: false, },
            honor: null,
            privateConf:{}
        };
    },
    computed: {
        userdata: function() {
            return this.$store.state.userdata;
        },
        uid: function() {
            return this.$route.params.id;
        },
        root: function() {
            return "/author/" + this.uid;
        },
        name: function() {
            return this.$store.state.userdata.display_name || "魔盒";
        },
    },
    created: function() {
        if (this.uid) {
            this.$store.state.uid = ~~this.uid;
            getUserInfo(this.uid).then((res) => {
                this.$store.state.userdata = res.data.data;
            });
            getPrivateConf(this.uid).then((res)=>{
                this.privateConf = res.data.data;
            })

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
            getDecoration({ using: 1, user_id: this.uid, type: "homebg" }).then((res) => {
                let decorationList = res.data.data;
                //筛选个人装扮
                let decoration = decorationList.find((item) => item.type == "homebg");
                if (!decoration) {
                    //空 则为无主题，不再加载接口，Me界面设No
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify({ status: false }));
                    return;
                }
                let decorationJson = sessionStorage.getItem(DECORATION_JSON);
                if (!decorationJson) {
                    //加载远程json，用于颜色配置及主题存在部位判断
                    getDecorationJson().then((json) => {
                        let decoration_json = json.data;
                        let theme = JSON.parse(JSON.stringify(decoration_json[decoration.val]));
                        theme.status = true;
                        sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                        this.setDecoration(theme);
                        //缓存远程JSON文件
                        sessionStorage.setItem(DECORATION_JSON, JSON.stringify(decoration_json));
                    });
                } else {
                    let theme = JSON.parse(decorationJson)[decoration.val];
                    theme.status = true;
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                    this.setDecoration(theme);
                }
            });
        },
        showDecoration: function(val, type) {
            return __cdn + `design/decoration/images/${val}/${type}.png?${new Date().getTime()}`;
        },
        setDecoration(theme) {
            this.decorationMe = theme;
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
@import "~@/assets/css/common/var";
</style>
