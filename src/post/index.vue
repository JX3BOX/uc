<template>
    <div class="m-publish m-index">
        <h1 class="m-title">
            <i class="el-icon-edit-outline"></i> 创作台<span class="u-desc">丹青著华年，墨香漫天下</span>
            <el-tooltip content="成为签约作者，获取更多福利与权益" placement="top">
                <a
                    href="/dashboard/cooperation"
                    size="mini"
                    type="primary"
                    class="el-button el-tooltip el-button--primary el-button--mini u-btn"
                    target="_blank"
                    >申请签约作者</a
                >
            </el-tooltip>
        </h1>
        <el-alert type="warning" v-if="!isAuth">
            <template #title>
                <div class="m-index-warning">
                    <span
                        ><i class="el-icon-warning-outline"></i>
                        应有关单位要求，现在需要进行账号认证后才可执行“发布”操作，</span
                    >
                    <a href="/dashboard/auth"><i class="el-icon-link"></i>前往认证</a>
                </div>
            </template>
        </el-alert>
        <div class="u-nav">
            <el-divider content-position="left">PVE / PVP</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/macro">
                        <img svg-inline src="@/assets/img/publish/channel/macro.svg" />
                        <span>剑三宏</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/bps">
                        <img svg-inline src="@/assets/img/publish/channel/bps.svg" />
                        <span>职业攻略</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/pvp">
                        <img svg-inline class="u-icon" :src="getAppIcon('pvp')" />
                        <span>竞技技巧</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/fb">
                        <img svg-inline src="@/assets/img/publish/channel/fb.svg" />
                        <span>副本攻略</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/tool">
                        <img svg-inline src="@/assets/img/publish/channel/tool.svg" />
                        <span>工具资源</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVA</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/achievement">
                        <img svg-inline src="@/assets/img/publish/channel/achievement.svg" />
                        <span>成就百科</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/item">
                        <img svg-inline src="@/assets/img/publish/channel/item.svg" />
                        <span>物品百科</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/quest">
                        <img svg-inline src="@/assets/img/publish/channel/quest.svg" />
                        <span>任务百科</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/knowledge">
                        <img svg-inline src="@/assets/img/publish/channel/knowledge.svg" />
                        <span>通识百科</span>
                    </router-link>
                </el-col>
                <!-- <el-col :span="4">
                    <router-link to="/item_plan">
                        <i class="el-icon-folder"></i>
                        <span>物品清单</span>
                    </router-link>
                </el-col> -->
            </el-row>

            <el-divider content-position="left">PVX</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/face">
                        <img svg-inline src="@/assets/img/publish/channel/share.svg" />
                        <span>捏脸数据</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/body">
                        <img svg-inline src="@/assets/img/publish/channel/body.svg" />
                        <span>体型数据</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/question">
                        <i class="el-icon-s-opportunity"></i>
                        <span>剑三题目</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/paper">
                        <img svg-inline src="@/assets/img/publish/channel/100.svg" />
                        <span>剑三试卷</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVBB</el-divider>
            <el-row :gutter="20">
                <el-col :span="4">
                    <router-link to="/community">
                        <img svg-inline src="@/assets/img/publish/channel/community.svg" />
                        <span>魔盒论坛</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/joke">
                        <img svg-inline src="@/assets/img/publish/channel/joke.svg" />
                        <span>剑三骚话</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/emotion">
                        <img svg-inline src="@/assets/img/publish/channel/emotion.svg" />
                        <span>剑三表情</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/collection">
                        <i class="el-icon-notebook-1"></i>
                        <span>剑三小册</span>
                    </router-link>
                </el-col>
                <el-col :span="4">
                    <router-link to="/namespace">
                        <i class="el-icon-postcard"></i>
                        <span>剑三铭牌</span>
                    </router-link>
                </el-col>
            </el-row>

            <template v-if="isAdmin">
                <el-divider content-position="left">管理</el-divider>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <router-link to="/notice">
                            <i class="el-icon-bell"></i>
                            <span>公告资讯</span>
                        </router-link>
                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils.js";
export default {
    name: "index",
    props: [],
    data: function () {
        return {
            isAdmin: User.isAdmin(),
        };
    },
    computed: {
        profile() {
            return this.$store.state.profile;
        },
        isAuth() {
            return this.profile.user_group >= 16;
        },
    },
    methods: {
        getAppIcon,
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/index.less";
</style>
