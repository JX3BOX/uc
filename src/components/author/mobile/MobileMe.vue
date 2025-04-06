<template>
    <div class="m-mobile-me">
        <div class="m-user-header" :style="{ backgroundColor: userDefinedStyle.bgColor, backgroundImage: `url(${userDefinedStyle.banner || ''})` }">
            <div class="m-bg"></div>
            <div class="m-header">
                <div class="m-name-avatar">
                    <div class="m-avatar-box" :class="{'no-frame':!avatar_frame}" >
                        <Avatar :uid="uid" :url="avatar" :size="80" />
                        <img  class="u-frame" :src="frameUrl" />
                    </div>
                    <div class="u-name-uid">
                        {{name}}
                        <div class="u-uid">UID {{uid}}</div>
                    </div>
                </div>
                <div class="m-info-box">
                    <div v-if="uid" class="u-info">
                        <div class="u-level u-value" >Lv.{{ level }} <span class="u-tip">用户</span></div>
                        <div class="u-fans u-value"> {{ fansNum }} <span class="u-tip">粉丝</span></div>
                        <div class="u-gift u-value"> {{ boxcoin_count | formatBoxcoin }} <span class="u-tip">累计打赏</span></div>
                    </div>
                    <div v-if="data.user_bio" class="m-signature">
                        {{ data.user_bio || "这个人太懒了~没有写签名。" }}
                    </div>
                    <div v-if="isSuperAuthor || isPRO" class="m-ext-info">
                        <div v-if="isSuperAuthor" class="u-author">签约作者</div>
                        <div v-if="isPRO"  class="u-pro"><span>Pro 专业版</span> </div>
                    </div>
                    <div class="m-op">
                        <button class="u-btn u-subscribe" :class="{ 'is-subscribe': subscribed }" @click="follow">
                            {{ hadDeny?"已拉黑":subscribed ? (isFollower?'互相关注':'已关注') : '关注TA' }}
                        </button>
                        <div class="u-more" @click="openMore">
                            <img class="u-icon" svg-inline src="@/assets/img/author/mobile/nav_more.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ContentTabList :list="filterTabs"/>
        <simple-more-action  :show.sync="actionShow" :actions="actions" @close="closeMore" @select="onSelect" />
    </div>
</template>

<script>
import { getAuthorRss, subscribeAuthor, unsubscribeAuthor } from "@jx3box/jx3box-common/js/rss";
import { __userLevelColor, __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box";
import { user as medal_map } from "@jx3box/jx3box-common/data/medals.json";
import frames from "@jx3box/jx3box-common/data/user_avatar_frame.json";
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar, tvLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { deny, undeny, hadDenyUser, isFollower } from "@/service/author/author";
import { getFansList, getSummary } from "@jx3box/jx3box-common-ui/service/author";

import ContentTabList from "@/components/author/mobile/ContentTabList.vue";
import RoleInfo from "@/components/author/mobile/Pannel/RoleInfo.vue";
import BoxMoment from "@/components/author/mobile/Pannel/BoxMoment.vue";
import CmsPosts from "@/components/author/mobile/Pannel/CmsPosts.vue";
import SubTabContent from "@/components/author/mobile/Pannel/SubTabContent.vue";
import TopicList from "@/components/author/mobile/Pannel/TopicList.vue";
import ReplyList from "@/components/author/mobile/Pannel/ReplyList.vue";
import FaceList from "@/components/author/mobile/Pannel/FaceList.vue";
import BodyList from "@/components/author/mobile/Pannel/BodyList.vue";
import SimpleMoreAction from "@/components/author/mobile/MoreAction.vue";
import wx from "weixin-js-sdk";


export default {
    name: "MobileMe",
    components: {
        SimpleMoreAction,
        ContentTabList,
    },
    props: {
        decorationMe: {
            type: Object,
            default: function () {
                return {};
            },
        },
        privateConf:{
            type: Object,
            default: function () {
                return {};
            },
        }
    },
    watch: {
        decorationMe: {
            handler(val) {
                this.setDecorationStyle();
            },
            immediate: true,
            deep: true,
        },
        display_name: {
            immediate: true,
            handler(display_name) {
                if (display_name && this.isLogin) {
                    hadDenyUser(display_name).then((res) => {
                        const list = res.data?.data?.list || [];
                        this.hadDeny = !!list.length;
                    });
                    isFollower(display_name).then((res) => {
                        console.log(res?.data?.data?.list);
                        this.isFollower = !!res?.data?.data?.list?.length;
                    });
                }
            },
        },
    },
    data: function () {
        return {
            medals: [],
            medal_map,
            frames,
            isVIP: false,
            attentionText: "已关注",
            moreOperate: false,
            moreOperatePhone: false,
            authorInfo: {},
            avatarSize: "l",
            fansLink: "/dashboard/privacy?tab=myfans",
            userDefinedStyle: {
                fans: {},
                btn: {},
                userName: {},
                honor: {},
                sendMsg: {},
                banner: `${__cdn}design/decoration/images/0_TESTSAMPLE/homebanner.png?${new Date().getTime()}`,
            },
            // honor: null, //称号
            canSendLetter: false,
            //是否拉黑
            hadDeny: false,
            // 关注
            subscribed: false,
            fansNum: 0,
            fans_count:0,
            boxcoin_count:0,
            isFollower: false,
            actionShow: false,

            tabs: [
                {
                    label: "角色",
                    value: "UserInfo",
                    component: RoleInfo,
                    key:'role_is_public',
                },
                {
                    label: "动态",
                    value: "BoxMoment",
                    component: BoxMoment,
                    key:'personal_activities_is_public',

                },
                {
                    label: "文章",
                    value: "Works",
                    component: CmsPosts,
                    key:'article_is_public',

                    children:[
                        {
                            label: "宏库",
                            value: "macro",
                        },
                        {
                            label: "职业",
                            value: "bps",
                        },
                        {
                            label: "副本",
                            value: "fb",
                        },
                        {
                            label: "竞技",
                            value: "pvp",
                        },
                        {
                            label: "工具",
                            value: "tool",
                        },
                    ]
                },
                {
                    label: "帖子",
                    value: "Other",
                    key: 'community_topic_is_public',
                    component: SubTabContent,
                    children:[
                        {
                            label: "发帖",
                            value: "Topic",
                            component: TopicList,
                        },
                        {
                            label: "回帖",
                            value: "Reply",
                            component: ReplyList,
                        },
                    ]
                },
                {
                    label: "捏脸",
                    value: "Data",
                    key: 'make_face_is_public',
                    component: SubTabContent,
                    children:[
                        {
                            label: "捏脸",
                            value: "face",
                            component: FaceList,
                            icon:'el-icon-grape'
                        },
                        {
                            label: "体型",
                            value: "body",
                            component: BodyList,
                            icon:'el-icon-watermelon'
                        },
                    ]
                },
                // {
                //     label: "配装",
                //     value: "Pz",
                //     component: Pz,
                // key: 'pz_info_is_public',
                //     icon: "el-icon-sugar",
                // },
            ],
        };
    },
    computed: {
        name(){
            return this.data?.display_name || "匿名";
        },
        uid: function () {
            return ~~this.$store.state.uid;
        },
        data: function () {
            return this.$store.state.userdata;
        },
        isDarkMode(){
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        },
        avatar: function () {
            return this.data.user_avatar || "";
        },
        avatar_frame: function () {
            return this.data.user_avatar_frame || "";
        },
        isPRO: function () {
            return this.data?.is_pro;
        },
        isSuperAuthor: function () {
            return !!this.data?.sign;
        },
        vipType: function () {
            return this.isPRO ? "PRO" : "PRE";
        },
        vipTypeTitle: function () {
            return this.isPRO ? "专业版会员用户" : "高级版会员用户";
        },
        level: function () {
            return User.getLevel(this.data?.experience || 0);
        },
        tv_link: function () {
            return tvLink(this.data.tv_type, this.data.tv_id) || "";
        },
        tv_img: function () {
            return __imgPath + "image/tv/" + this.data.tv_type + ".png";
        },
        frameUrl: function () {
            if (!this.avatar_frame){
                return require(`@/assets/img/author/mobile/default_${this.isDarkMode?'dark':'light'}.svg`)
            }

            return __imgPath +`avatar/images/${this.avatar_frame}/${this.avatar_frame}.svg`;
        },
        isLogin: function () {
            return User.isLogin();
        },
        isSelf: function () {
            return User.getInfo().uid == this.uid;
        },
        sendLink: function () {
            return "/dashboard/letter?receiver=" + this.uid;
        },
        display_name() {
            return this.data?.display_name;
        },
        diffYear() {
            return this.getYearDiff(this.data.user_registered);
        },
        filterTabs(){
            return this.tabs.filter(i=>{
                return this.privateConf[i.key]!==0
            })
        },
        // TODO: 后续改成图片
        diffYearText() {
            const obj = {
                "3": "三年老粉",
                "5": "五年元老",
                "10": "十年长者",
            }

            if (this.diffYear >= 10) {
                return obj["10"];
            } else if (this.diffYear >= 5) {
                return obj["5"];
            } else if (this.diffYear >= 3) {
                return obj["3"];
            } else {
                return "";
            }
        },
        actions(){
            const res = [
                {
                    list: [

                    ],
                },
                {
                    list: [
                        {
                            method: "close",
                            name: "取消",
                        },
                    ],
                },
            ]
            if (!this.hadDeny){
                res[0].list.push({
                    method: "black",
                    name: this.hadDeny ? "取消拉黑" : "拉黑",
                });
            }

            res[0].list.push({
                method: "report",
                name:  "举报",
            });

            return res;
        }
    },
    filters: {
        time: (val) => {
            return dateFormat(new Date(val));
        },
        formatBoxcoin(val){
            if(val > 10000){
                return `${(val /10000).toFixed(2)}w`
            }
            return val;
        }
    },
    methods: {
        showAvatar,
        onSelect(item){
            if (item.method === "black") {
                this.joinBlacklist();
            } else if (item.method === "report") {
                // 跳转到feedback
                window.open("/feedback", "_blank");
            } else if (item.method === "close") {
                this.closeMore();
            }
        },

        closeMore(){
            this.actionShow = false;
        },
        copyData(text) {
            let _this = this;
            this.$copyText(String(text)).then(
                function (e) {
                    _this.$notify({
                        title: "复制成功",
                        message: "复制内容：" + text,
                        type: "success",
                    });
                },
                function (e) {
                    _this.$notify({
                        title: "复制失败",
                        message: "请手动复制",
                        type: "warning",
                    });
                }
            );
        },
        setDecorationStyle() {
            let decoration = {
                textColor: "#744444",
                bgColor: "#f9d196",
                decoration: "",
                ...this.decorationMe,
            };

            this.userDefinedStyle.bgColor =decoration.bgColor;
            if (!decoration.status) return;
            if (decoration.highlightcolor) {
                this.userDefinedStyle.fans = {
                    color: decoration.highlightcolor,
                    fill: decoration.highlightcolor,
                };
            }
            if (decoration.textcolor) {
                this.userDefinedStyle.userName = {
                    color: decoration.textcolor,
                };
            }
            if (decoration.buttoncolor) {
                this.userDefinedStyle.btn = {
                    "background-color": decoration.buttoncolor,
                    fill: decoration.buttontextcolor,
                };
                this.userDefinedStyle.sendMsg = {
                    "background-color": decoration.buttoncolor,
                    "border-color": decoration.buttoncolor,
                    color: decoration.buttontextcolor,
                };
            }

            if (decoration?.textcolor) {
                this.userDefinedStyle.textColor = decoration.textcolor;
            }
            if (decoration?.miniprogrambgcolor) {
                this.userDefinedStyle.bgColor = decoration.miniprogrambgcolor;
            }

            this.userDefinedStyle.bgColor = decoration.bgColor;
            const webp = ["jx3box-birthday-5"];
            this.userDefinedStyle.banner =
                __cdn +
                `design/decoration/images/${decoration.name}/homebanner.${
                    webp.includes(decoration.name) ? "webp" : "png"
                }`;
        },
        openMore(){
           this.actionShow = true
        },
        // 关注
        follow() {
            if (!this.isLogin) {
                User.toLogin();
                return;
            }
            if (!this.uid) {
                return;
            }
            if (this.subscribed){
                this.$confirm("确定不再关注此人？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        unsubscribeAuthor({ id: this.uid })
                            .then((res) => {
                                this.$message.success("操作成功");
                                this.subscribed = false;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch((_) => {});
            }else{
                subscribeAuthor({ id: this.uid, data: { title: this.display_name } })
                    .then((res) => {
                        this.subscribed = true;
                        this.$message.success("关注成功");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }


        },
        showLevelColor(level) {
            return __userLevelColor[level];
        },
        // 格式化粉丝数
        formatFansNum(num) {
            if (num < 10000) {
                return num === 0 ? "" : num;
            } else {
                return (num / 10000).toFixed(1) + "万";
            }
        },
        loadFans() {
            if (!this.uid) {
                return;
            }
            getAuthorRss({ id: this.uid })
                .then((res) => {
                    this.fansNum = res.data.data.total || 0;
                    this.subscribed = res.data.data.subscribed;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });

            getSummary(this.uid).then((res) => {
                this.fans_count = res.data.data?.fans_count || 0;
                this.boxcoin_count = res.data.data?.boxcoin_count || 0;
            });

            getFansList(this.uid, this.fansLimit).then((res) => {
                this.list = res.data.data.list || [];
            });
        },

        avatarSizeChange() {
            let w = document.body.clientWidth || document.documentElement.clientWidth;
            if (w > 720) {
                this.avatarSize = "l";
            } else if (w > 500) {
                this.avatarSize = "m";
            } else {
                this.avatarSize = "s";
            }
        },
        getAuthorInfo(v) {
            this.authorInfo = v;
        },
        //拉黑
        joinBlacklist() {
            this.$confirm("确定要拉黑此人？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deny(this.uid)
                        .then(() => {
                            this.hadDeny = true;
                            this.$message.success("拉黑成功");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((_) => {});
        },
        // 取消拉黑
        handleUnDeny() {
            undeny(this.uid)
                .then(() => {
                    this.hadDeny = false;
                    this.$message.success("操作成功");
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        toFans() {
            if (this.isSelf) {
                window.open(this.fansLink, "_blank");
            }
        },
        // 距离现在多久
        getYearDiff(dateStr) {
            const past = new Date(dateStr);
            const now = new Date();

            // 获取时间差的毫秒数
            const diffTime = now - past;

            // 转换为年
            // 用毫秒数除以一年的毫秒数 (365.25天以考虑闰年)
            const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);

            return Math.floor(years);
        },

    },
    created() {
        this.avatarSizeChange();
    },
    mounted: function () {
        if (this.uid) {
            this.loadFans();
        }
        let _this = this;
        window.onresize = function () {
            _this.avatarSizeChange();
        };

        User.getAsset().then((data) => {
            let exp = data.experience;
            this.canSendLetter = !!(User.getLevel(exp) > 3);
            // this.canSendLetter = true;
        });
    },
};
</script>

<style  lang="less">
@import "~@/assets/css/author/mobile/mobile_me";
</style>
