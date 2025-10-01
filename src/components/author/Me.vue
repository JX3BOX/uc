<template>
    <div class="m-author-header">
        <Avatar class="m-author-avatar" :uid="uid" :url="avatar" size="l" :frame="avatar_frame" />
        <div class="m-author-info">
            <span class="u-name">
                {{ data.display_name || "匿名" }}
                <el-tooltip content="签约作者" v-if="isSuperAuthor" placement="top">
                    <span class="u-superauthor">
                        <img :src="super_author_icon" alt="superauthor" />
                    </span>
                </el-tooltip>
            </span>
            <div>
                <span class="u-uid">UID : {{ data.ID || 0 }}</span>
                <el-tooltip :content="`当前经验 ${data.experience || 0}`" placement="top">
                    <span class="u-level" :class="'lv-' + level" :style="{backgroundColor:showLevelColor(level)}">Lv.{{ level }}</span>
                </el-tooltip>
                <el-tooltip :content="vipTypeTitle" v-if="isPRO || isVIP" placement="top">
                    <a class="u-vip" href="/vip/premium?from=user_homepage" target="_blank">
                        <i class="i-icon-vip on">{{ vipType }}</i>
                    </a>
                </el-tooltip>
            </div>
            <span class="u-join" v-if="data.user_registered">
                <i class="u-icon u-icon-join">
                    <img svg-inline src="../assets/img/join.svg" />
                </i>
                <span>加入于 {{ time(data.user_registered) }}</span>
            </span>
            <div class="u-medals" v-if="medals && medals.length">
                <medal :medals="medals" :showIcon="showMedalIcon"></medal>
            </div>
            <div class="u-bio">{{ data.user_bio }}</div>

            <div class="u-links-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div>
                            <a
                                v-if="data.weibo_name"
                                class="u-weibo"
                                :href="getWeiboLink(data.weibo_id)"
                                target="_blank"
                            >
                                <img svg-inline src="../assets/img/weibo.svg" />
                                {{ data.weibo_name }}
                            </a>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <a
                                v-if="data.github_name"
                                class="u-github"
                                :href="getGithubLink(data.github_name)"
                                target="_blank"
                            >
                                <img svg-inline src="../assets/img/github.svg" />
                                {{ data.github_name }}
                            </a>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <span v-if="data.tuilan_id" class="u-tuilan" title="推栏ID">
                                <img src="../assets/img/tuilan.png" />
                                推栏ID：{{ data.tuilan_id }}
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <a v-if="data.tv_type && data.tv_id" class="u-tv" :href="tv_link" target="_blank">
                                <img :src="tv_img" />
                                直播间：{{ data.tv_id }}
                            </a>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <div class="u-teams">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="(item, i) in teams" :key="i">
                        <div>
                            <a class="u-team" :href="teamLink(item.team_id)">
                                <img class="u-team-logo" :src="showTeamLogo(item.team_logo)" />
                                <span class="u-team-name">{{ item.team_name }}</span>
                            </a>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { showAvatar, tvLink, getLink } from "@jx3box/jx3box-common/js/utils";
import { __imgPath,__userLevelColor } from "@/utils/config";
import dateFormat from "@/utils/dateFormat";
import { getUserMedals, getFrames, getUserPublicTeams } from "@/service/author/author";
import { user as medal_map } from "@jx3box/jx3box-common/data/medals.json";
import frames from "@jx3box/jx3box-common/data/user_avatar_frame.json";
import User from "@jx3box/jx3box-common/js/user";
import Medal from '@jx3box/jx3box-common-ui/src/medal/medal.vue'
export default {
    name: "Me",
    props: [],
    components: {
        Medal
    },
    data: function () {
        return {
            medals: [],
            medal_map,
            frames,
            teams: [],
            isVIP: false,
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
        tv_link: function () {
            return tvLink(this.data.tv_type, this.data.tv_id) || "";
        },
        tv_img: function () {
            return __imgPath + "image/tv/" + this.data.tv_type + ".png";
        },
        frameUrl: function () {
            return __imgPath + `image/avatar/${this.avatar_frame}/${this.avatar_frame}.svg`;
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
        super_author_icon: function () {
            return __imgPath + "image/user/" + "superauthor.svg";
        },
        level: function () {
            return User.getLevel(this.data?.experience || 0);
        },
    },
    methods: {
        getWeiboLink: function (val) {
            return "https://weibo.com/" + val;
        },
        getGithubLink: function (val) {
            return "https://github.com/" + val;
        },
        init: function () {
            this.loadFrames();
            this.loadMedals();
            this.loadTeams();
        },
        time: (val) => {
            return dateFormat(new Date(val));
        },
        showTeamLogo: function (val) {
            return showAvatar(val, 32);
        },
        teamLink: function (val) {
            return getLink("org", val);
        },
        loadMedals: function () {
            if (!this.uid) return;
            getUserMedals(this.uid).then((res) => {
                this.medals = res.data.data;
            });
        },
        loadFrames: function () {
            getFrames().then((res) => {
                if (res.data) {
                    this.frames = res.data || [];
                }
            });
        },
        loadTeams: function () {
            if (!this.uid) return;
            getUserPublicTeams(this.uid).then((data) => {
                this.teams = data || [];
            });
        },
        showLevelColor : function (level){
            return __userLevelColor[level]
        },
        showMedalIcon: function (val) {
            return __imgPath + "image/medals/user/" + val + ".gif";
        },
    },
    mounted: function () {
        if (this.uid) {
            this.init();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/author/top.less";
</style>
