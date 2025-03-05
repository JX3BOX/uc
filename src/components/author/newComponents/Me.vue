<template>
    <div>
        <div class="m-author-header" :style="{ backgroundImage: `url(${userDefinedStyle.banner})` }">
            <div class="u-header-info">
                <Avatar class="u-author-avatar" :uid="uid" :url="avatar" :size="avatarSize" :frame="avatar_frame" />
                <div class="u-author-info">
                    <span class="u-name" :style="userDefinedStyle.userName">
                        <span @click="copyData(data.display_name || '匿名')">{{ data.display_name || "匿名" }}</span
                        ><span class="u-uid" @click="copyData(data.ID || 0)">（UID : {{ data.ID || 0 }}）</span>
                        <el-tag type="info" class="u-mute-tag" v-if="data.user_status" size="small" effect="dark"
                            >已禁言</el-tag
                        >
                    </span>
                    <div class="u-tips">
                        <el-tooltip :content="`当前经验 ${data.experience || 0}`" placement="top">
                            <span
                                class="u-level"
                                :class="'lv-' + level"
                                :style="{ backgroundColor: showLevelColor(level) }"
                                >Lv.{{ level }}</span
                            >
                        </el-tooltip>
                        <el-tooltip :content="vipTypeTitle" v-if="isPRO || isVIP" placement="top">
                            <a class="u-vip" href="/vip/premium?from=user_homepage" target="_blank">
                                <i class="u-icon vip">{{ vipType }}</i>
                            </a>
                        </el-tooltip>
                        <el-tooltip content="签约作者" v-if="isSuperAuthor" placement="top">
                            <span class="u-superauthor">
                                <i class="u-icon superauthor">签约作者</i>
                            </span>
                        </el-tooltip>
                    </div>

                    <Honor :uid="uid"></Honor>
                </div>
            </div>
        </div>
        <!-- 手机端显示此加入时间，隐藏原有 -->
        <div class="m-join-phone">
            <div class="m-author-primary">
                <div class="m-right">
                    <!-- 关注 -->
                    <div class="m-focus" v-if="!isSelf && isLogin">
                        <div class="u-btn-box">
                            <el-button
                                icon="el-icon-plus"
                                class="u-btn-attention"
                                v-if="!subscribed"
                                @click="follow"
                                size="mini"
                                >关注TA</el-button
                                >
                                <!-- :style="userDefinedStyle.btn" -->
                            <div class="u-already-attention" v-else>
                                <el-button
                                    class="u-btn"
                                    size="mini"
                                    @mouseenter.native="attentionText = '取消关注'"
                                    @mouseleave.native="attentionText = '已关注'"
                                    @click="unfollow"
                                    >{{ attentionText }}</el-button
                                >
                                <a :href="sendLink" target="_blank" v-if="canSendLetter">
                                    <el-button class="u-btn u-send-msg" size="mini" :style="userDefinedStyle.sendMsg"
                                        >发消息</el-button
                                    ></a
                                >
                                <el-button class="u-btn u-btn-disabled" size="mini" :disabled="true" v-else
                                    >发消息</el-button
                                >
                            </div>
                        </div>
                        <div class="u-more" :style="userDefinedStyle.btn">
                            <el-popover placement="bottom-end" trigger="click" width="90" v-model="moreOperatePhone">
                                <a href="/feedback" target="_blank">
                                    <el-button size="mini" class="u-more-btn">举报</el-button> </a
                                ><br />
                                <el-button size="mini" class="u-more-btn" @click="joinBlacklist">拉黑</el-button>
                                <img
                                    src="@/assets/img/author/more.svg"
                                    svg-inline
                                    slot="reference"
                                    class="u-more-img"
                                    :style="userDefinedStyle.btn"
                                />
                            </el-popover>
                        </div>
                    </div>
                    <!--        加入时间-->
                    <div class="m-common-box m-join-box">
                        <div class="u-join">
                            <i class="u-icon u-icon-join">
                                <img svg-inline src="@/assets/img/author/join.svg" />
                            </i>
                            <span>加入于 {{ data.user_registered | time }}</span>
                        </div>
                        <div
                            class="u-fans"
                            :class="isSelf ? 'self' : ''"
                            :style="userDefinedStyle.fans"
                            v-if="diffYearText"
                        >
                            <el-tag type="primary" size="small">{{ diffYearText }}</el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-author-primary">
            <!--    左右分栏模式，左侧作品，右侧相关信息-->
            <div class="m-left">
                <Left class="m-common-box u-content"></Left>
            </div>
            <div class="m-right">
                <!-- 关注 -->
                <div class="m-focus u-in-phone" v-if="!isSelf && isLogin">
                    <div v-if="!hadDeny" class="u-btn-box">
                        <el-button
                            icon="el-icon-plus"
                            class="u-btn-attention"
                            v-if="!subscribed"
                            @click="follow"
                            size="mini"
                            >关注TA</el-button
                            >
                            <!-- :style="userDefinedStyle.btn" -->
                        <div class="u-already-attention" v-else>
                            <el-button
                                class="u-btn"
                                size="mini"
                                @mouseenter.native="attentionText = '取消关注'"
                                @mouseleave.native="attentionText = '已关注'"
                                @click="unfollow"
                                >{{ attentionText }}</el-button
                            >
                            <a :href="sendLink" target="_blank" v-if="canSendLetter">
                                <el-button class="u-btn u-send-msg" size="mini" :style="userDefinedStyle.sendMsg"
                                    >发消息</el-button
                                ></a
                            >
                            <el-button class="u-btn u-btn-disabled" size="mini" :disabled="true" v-else
                                >发消息</el-button
                            >
                        </div>
                    </div>
                    <div class="u-btn-box" v-else>
                        <el-button type="info" class="u-btn-cancel-deny" @click="handleUnDeny">取消拉黑</el-button>
                    </div>
                    <el-popover placement="bottom-end" trigger="click" width="90" v-model="moreOperate">
                        <a href="/feedback" target="_blank">
                            <el-button size="mini" class="u-more-btn">举报</el-button> </a
                        ><br />
                        <el-button v-if="!hadDeny" size="mini" class="u-more-btn" @click="joinBlacklist"
                            >拉黑</el-button
                        >
                        <div class="u-more" :style="userDefinedStyle.btn" slot="reference">
                            <img
                                src="@/assets/img/author/more.svg"
                                svg-inline
                                class="u-more-img"
                                :style="userDefinedStyle.btn"
                            /></div
                    ></el-popover>
                </div>
                <!--        加入时间-->
                <div class="m-common-box m-join-box u-in-phone">
                    <div class="u-join">
                        <i class="u-icon u-icon-join">
                            <img svg-inline src="@/assets/img/author/join.svg" />
                        </i>
                        <span>加入于 {{ data.user_registered | time }}</span>
                    </div>
                    <div v-if="diffYearText" class="u-fans" :class="isSelf ? 'self' : ''" :style="userDefinedStyle.fans">
                        <el-tag type="primary" size="small">{{ diffYearText }}</el-tag>
                    </div>
                </div>

                <Primary @authorInfo="getAuthorInfo"></Primary>
            </div>
        </div>
    </div>
</template>

<script>
import { follow, unfollow } from "@jx3box/jx3box-common-ui/service/follow";
import { getAuthorRss, subscribeAuthor, unsubscribeAuthor } from "@jx3box/jx3box-common/js/rss";
import { __userLevelColor, __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box";
import { user as medal_map } from "@jx3box/jx3box-common/data/medals.json";
import frames from "@jx3box/jx3box-common/data/user_avatar_frame.json";
import User from "@jx3box/jx3box-common/js/user";
import { getFansCount } from "@jx3box/jx3box-common-ui/service/follow";
import { tvLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { deny, undeny, hadDenyUser } from "@/service/author/author";
import Left from "./Left";
import Primary from "./Primary";
import Honor from "@jx3box/jx3box-common-ui/src/author/AuthorHonor.vue";
export default {
    name: "Me",
    components: {
        Left,
        Primary,
        Honor,
    },
    props: {
        decorationMe: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    watch: {
        decorationMe: {
            handler(val) {
                // console.log(val);
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
        };
    },
    computed: {
        uid: function () {
            return ~~this.$store.state.uid;
        },
        data: function () {
            return this.$store.state.userdata;
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
            return __imgPath + `image/avatar/${this.avatar_frame}/${this.avatar_frame}.svg`;
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
            return this.authorInfo?.display_name;
        },
        diffYear() {
            return this.getYearDiff(this.data.user_registered);
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
        }
    },
    filters: {
        time: (val) => {
            return dateFormat(new Date(val));
        },
    },
    methods: {
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
            let decoration = this.decorationMe;
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
            const webp = ["jx3box-birthday-5"];
            this.userDefinedStyle.banner =
                __cdn +
                `design/decoration/images/${decoration.name}/homebanner.${
                    webp.includes(decoration.name) ? "webp" : "png"
                }`;
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
            subscribeAuthor({ id: this.uid, data: { title: this.display_name } })
                .then((res) => {
                    this.subscribed = true;
                    this.$message.success("关注成功");
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 取消关注
        unfollow() {
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
        },
        showLevelColor: function (level) {
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
        // 跳转粉丝界面
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

<style scoped lang="less">
@import "~@/assets/css/author/newCss/me.less";
@import "~@/assets/css/author/newCss/primary.less";
</style>
