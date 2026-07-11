<template>
    <div>
        <div
            class="m-author-header"
            :style="{
                backgroundImage: `url(${userDefinedStyle.banner})`,
                backgroundPosition: userDefinedStyle.bannerPosition,
            }"
        >
            <div class="u-header-info">
                <RetinaAvatar
                    class="u-author-avatar"
                    :uid="uid"
                    :url="avatar"
                    :size="avatarSize"
                    :frame="avatar_frame"
                />
                <div class="u-author-info">
                    <span class="u-name" :style="userDefinedStyle.userName">
                        <span @click="copyData(data.display_name || $t('author.common.anonymous'))">{{ data.display_name || $t("author.common.anonymous") }}</span
                        ><span class="u-uid" :style="userDefinedStyle.uid" @click="copyData(data.ID || 0)">（UID : {{ data.ID || 0 }}）</span>
                        <el-tag type="info" class="u-mute-tag" v-if="data.user_status" effect="dark">{{ $t("author.profile.muted") }}</el-tag>
                    </span>
                    <div class="u-tips">
                        <el-tooltip :content="$t('author.profile.currentExperience', { count: data.experience || 0 })" placement="top">
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
                        <el-tooltip :content="$t('author.profile.signedAuthor')" v-if="isSuperAuthor" placement="top">
                            <span class="u-superauthor">
                                <i class="u-icon superauthor">{{ $t("author.profile.signedAuthor") }}</i>
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
                            <el-button icon="Plus" class="u-btn-attention" v-if="!subscribed" @click="follow"
                                >{{ $t("author.profile.follow") }}</el-button
                            >
                            <!-- :style="userDefinedStyle.btn" -->
                            <div class="u-already-attention" v-else>
                                <el-button
                                    class="u-btn"
                                    @mouseenter="attentionText = $t('author.profile.unfollow')"
                                    @mouseleave="attentionText = $t('author.profile.following')"
                                    @click="unfollow"
                                    >{{ attentionText }}</el-button
                                >
                                <a :href="sendLink" target="_blank" v-if="canSendLetter">
                                    <el-button class="u-btn u-send-msg" :style="userDefinedStyle.sendMsg"
                                        >{{ $t("author.profile.sendMessage") }}</el-button
                                    ></a
                                >
                                <el-button class="u-btn u-btn-disabled" :disabled="true" v-else>{{ $t("author.profile.sendMessage") }}</el-button>
                            </div>
                        </div>
                        <div class="u-more" :style="userDefinedStyle.btn">
                            <el-popover placement="bottom-end" trigger="click" width="90" v-model="moreOperatePhone">
                                <a href="/feedback" target="_blank"> <el-button class="u-more-btn">{{ $t("author.profile.report") }}</el-button> </a
                                ><br />
                                <el-button class="u-more-btn" @click="joinBlacklist">{{ $t("author.profile.block") }}</el-button>
                                <template #reference>
                                    <img
                                        src="@/assets/img/author/more.svg"
                                        svg-inline
                                        class="u-more-img"
                                        :style="userDefinedStyle.btn"
                                    />
                                </template>
                            </el-popover>
                        </div>
                    </div>
                    <!--  加入时间-->
                    <div class="m-common-box m-join-box">
                        <div class="u-join">
                            <i class="u-icon u-icon-join">
                                <img svg-inline src="@/assets/img/author/join.svg" />
                            </i>
                            <span>{{ $t("author.profile.joinedAt", { time: time(data.user_registered) }) }}</span>
                        </div>
                        <!-- <div
                            class="u-fans"
                            :class="isSelf ? 'self' : ''"
                            :style="userDefinedStyle.fans"
                            v-if="diffYearText"
                        >
                            <el-tag type="primary">{{ diffYearText }}</el-tag>
                        </div> -->
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
                        <el-button icon="Plus" class="u-btn-attention" v-if="!subscribed" @click="follow"
                            >{{ $t("author.profile.follow") }}</el-button
                        >
                        <!-- :style="userDefinedStyle.btn" -->
                        <div class="u-already-attention" v-else>
                            <el-button
                                class="u-btn"
                                @mouseenter="attentionText = $t('author.profile.unfollow')"
                                @mouseleave="attentionText = $t('author.profile.following')"
                                @click="unfollow"
                                >{{ attentionText }}</el-button
                            >
                            <a :href="sendLink" target="_blank" v-if="canSendLetter">
                                <el-button class="u-btn u-send-msg" :style="userDefinedStyle.sendMsg"
                                    >{{ $t("author.profile.sendMessage") }}</el-button
                                ></a
                            >
                            <el-button class="u-btn u-btn-disabled" :disabled="true" v-else>{{ $t("author.profile.sendMessage") }}</el-button>
                        </div>
                    </div>
                    <div class="u-btn-box" v-else>
                        <el-button type="info" class="u-btn-cancel-deny" @click="handleUnDeny">{{ $t("author.profile.unblock") }}</el-button>
                    </div>
                    <el-popover placement="bottom-end" trigger="click" width="90" v-model="moreOperate">
                        <a href="/feedback" target="_blank"> <el-button class="u-more-btn">{{ $t("author.profile.report") }}</el-button> </a><br />
                        <el-button v-if="!hadDeny" class="u-more-btn" @click="joinBlacklist">{{ $t("author.profile.block") }}</el-button>
                        <template #reference>
                            <div class="u-more" :style="userDefinedStyle.btn">
                                <img
                                    src="@/assets/img/author/more.svg"
                                    svg-inline
                                    class="u-more-img"
                                    :style="userDefinedStyle.btn"
                                />
                            </div>
                        </template>
                    </el-popover>
                </div>
                <!-- 加入时间-->
                <div class="m-common-box m-join-box u-in-phone">
                    <div class="u-join">
                        <i class="u-icon u-icon-join">
                            <img svg-inline src="@/assets/img/author/join.svg" />
                        </i>
                        <span>{{ $t("author.profile.joinedAt", { time: time(data.user_registered) }) }}</span>
                    </div>
                    <!-- <div
                        v-if="diffYearText"
                        class="u-fans"
                        :class="isSelf ? 'self' : ''"
                        :style="userDefinedStyle.fans"
                    >
                        <el-tag type="primary">{{ diffYearText }}</el-tag>
                    </div> -->
                </div>

                <Primary @authorInfo="getAuthorInfo"></Primary>
            </div>
        </div>
    </div>
</template>

<script>
import { follow, unfollow } from "@jx3box/jx3box-ui/service/follow";
import { getAuthorRss, subscribeAuthor, unsubscribeAuthor } from "@jx3box/jx3box-common/js/rss";
import { __userLevelColor, __imgPath, __cdn } from "@/utils/config";
import medalData from "@jx3box/jx3box-common/data/medals.json";
const { user: medal_map } = medalData;
import frames from "@jx3box/jx3box-common/data/user_avatar_frame.json";
import User from "@jx3box/jx3box-common/js/user";
import { tvLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { deny, undeny, hadDenyUser } from "@/service/author/author";
import Left from "./Left";
import Primary from "./Primary";
import Honor from "@jx3box/jx3box-ui/src/author/AuthorHonor.vue";
import RetinaAvatar from "@/components/author/RetinaAvatar.vue";

const DEFAULT_BANNER_STYLE = {
    fans: {},
    btn: {},
    userName: {},
    honor: {},
    sendMsg: {},
    uid: {},
    banner: `${__cdn}design/skin/default/pc_homebanner.png`,
    bannerPosition: "right top",
};

export default {
    name: "Me",
    components: {
        Left,
        Primary,
        Honor,
        RetinaAvatar,
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
            attentionText: this.$t("author.profile.following"),
            moreOperate: false,
            moreOperatePhone: false,
            authorInfo: {},
            avatarSize: "l",
            fansLink: "/dashboard/privacy?tab=myfans",
            userDefinedStyle: { ...DEFAULT_BANNER_STYLE },
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
            return this.isPRO ? this.$t("author.profile.proMember") : this.$t("author.profile.premiumMember");
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
                3: this.$t("author.profile.threeYearFan"),
                5: this.$t("author.profile.fiveYearVeteran"),
                10: this.$t("author.profile.tenYearVeteran"),
            };

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
    },
    methods: {
        time: (val) => {
            return dateFormat(new Date(val));
        },
        copyData(text) {
            let _this = this;
            this.$copyText(String(text)).then(
                function (e) {
                    _this.$notify({
                        title: _this.$t("author.common.copySuccess"),
                        message: _this.$t("author.common.copiedContent", { content: text }),
                        type: "success",
                    });
                },
                function (e) {
                    _this.$notify({
                        title: _this.$t("author.common.copyFailed"),
                        message: _this.$t("author.common.copyManually"),
                        type: "warning",
                    });
                }
            );
        },
        setDecorationStyle() {
            let decoration = this.decorationMe;
            this.userDefinedStyle = { ...DEFAULT_BANNER_STYLE };
            if (decoration.uidTextcolor) {
                this.userDefinedStyle.uid = {
                    color: decoration.uidTextcolor,
                };
            }
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
            if (decoration.banner) {
                this.userDefinedStyle.banner = decoration.banner;
                this.userDefinedStyle.bannerPosition = decoration.bannerPosition || DEFAULT_BANNER_STYLE.bannerPosition;
            }
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
                    this.$message.success(this.$t("author.profile.followSuccess"));
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 取消关注
        unfollow() {
            this.$confirm(this.$t("author.profile.unfollowConfirm"), this.$t("author.common.notice"), {
                confirmButtonText: this.$t("author.common.confirm"),
                cancelButtonText: this.$t("author.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    unsubscribeAuthor({ id: this.uid })
                        .then((res) => {
                            this.$message.success(this.$t("author.common.operationSuccess"));
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
            }
            return new Intl.NumberFormat(this.$i18n.locale, {
                notation: "compact",
                maximumFractionDigits: 1,
            }).format(num);
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
            this.$confirm(this.$t("author.profile.blockConfirm"), this.$t("author.common.notice"), {
                confirmButtonText: this.$t("author.common.confirm"),
                cancelButtonText: this.$t("author.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    deny(this.uid)
                        .then(() => {
                            this.hadDeny = true;
                            this.$message.success(this.$t("author.profile.blockSuccess"));
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
                    this.$message.success(this.$t("author.common.operationSuccess"));
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
