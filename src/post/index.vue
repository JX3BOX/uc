<template>
    <div class="m-publish m-index">
        <h1 class="m-title">
            <i class="el-icon-edit-outline"></i> {{ $t("publish.nav.workbench") }}<span class="u-desc">{{ $t("publish.home.slogan") }}</span>
            <el-tooltip :content="$t('publish.home.authorBenefits')" placement="top" v-if="!isSuperAuthor">
                <a
                    href="/dashboard/cooperation"
                    type="primary"
                    class="el-button el-tooltip el-button--primary el-button--small u-btn"
                    target="_blank"
                    ><el-icon><Stamp /></el-icon> {{ $t("publish.home.applyAuthor") }}</a
                >
            </el-tooltip>
        </h1>
        <el-alert type="warning" v-if="!isAuth">
            <template #title>
                <div class="m-index-warning">
                    <span
                        ><i class="el-icon-warning-outline"></i>
                        {{ $t("publish.home.verificationRequired") }}</span
                    >
                    <a href="/dashboard/auth"><i class="el-icon-link"></i>{{ $t("publish.home.verifyNow") }}</a>
                </div>
            </template>
        </el-alert>
        <div class="u-nav">
            <el-divider content-position="left">PVE / PVP</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/macro">
                        <img svg-inline src="@/assets/img/publish/channel/macro.svg" />
                        <span>{{ $t("publish.types.macros") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/bps">
                        <img svg-inline src="@/assets/img/publish/channel/bps.svg" />
                        <span>{{ $t("publish.types.classGuides") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/pvp">
                        <img svg-inline class="u-icon" :src="getAppIcon('pvp')" />
                        <span>{{ $t("publish.types.pvpTips") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/fb">
                        <img svg-inline src="@/assets/img/publish/channel/fb.svg" />
                        <span>{{ $t("publish.types.dungeonGuides") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/tool">
                        <img svg-inline src="@/assets/img/publish/channel/tool.svg" />
                        <span>{{ $t("publish.types.tools") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVA</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/achievement">
                        <img svg-inline src="@/assets/img/publish/channel/achievement.svg" />
                        <span>{{ $t("publish.types.achievementWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/item">
                        <img svg-inline src="@/assets/img/publish/channel/item.svg" />
                        <span>{{ $t("publish.types.itemWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/quest">
                        <img svg-inline src="@/assets/img/publish/channel/quest.svg" />
                        <span>{{ $t("publish.types.questWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/knowledge">
                        <img svg-inline src="@/assets/img/publish/channel/knowledge.svg" />
                        <span>{{ $t("publish.types.knowledgeWiki") }}</span>
                    </router-link>
                </el-col>
                <!-- <el-col :xs="12" :span="4">
                    <router-link to="/item_plan">
                        <i class="el-icon-folder"></i>
                        <span>{{ $t("publish.types.itemList") }}</span>
                    </router-link>
                </el-col> -->
            </el-row>

            <el-divider content-position="left">PVX</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/face">
                        <img svg-inline src="@/assets/img/publish/channel/share.svg" />
                        <span>{{ $t("publish.types.faceData") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/body">
                        <img svg-inline src="@/assets/img/publish/channel/body.svg" />
                        <span>{{ $t("publish.types.bodyData") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/question">
                        <el-icon><Opportunity /></el-icon>
                        <span>{{ $t("publish.types.questions") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/paper">
                        <img svg-inline src="@/assets/img/publish/channel/100.svg" />
                        <span>{{ $t("publish.types.papers") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVBB</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/community">
                        <img svg-inline src="@/assets/img/publish/channel/community.svg" />
                        <span>{{ $t("publish.types.forum") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/joke">
                        <img svg-inline src="@/assets/img/publish/channel/joke.svg" />
                        <span>{{ $t("publish.types.jokes") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/emotion">
                        <img svg-inline src="@/assets/img/publish/channel/emotion.svg" />
                        <span>{{ $t("publish.types.emotes") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/collection">
                        <el-icon><Notebook /></el-icon>
                        <span>{{ $t("publish.types.collection") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/namespace">
                        <el-icon><Postcard /></el-icon>
                        <span>{{ $t("publish.types.namespace") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <template v-if="isAdmin">
                <el-divider content-position="left">{{ $t("publish.home.management") }}</el-divider>
                <el-row :gutter="20">
                    <el-col :xs="12" :span="4">
                        <router-link to="/notice">
                            <el-icon><Bell /></el-icon>
                            <span>{{ $t("publish.types.news") }}</span>
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
import {getSuperAuthorState} from "@/service/dashboard/cooperation";
export default {
    name: "index",
    props: [],
    data: function () {
        return {
            isAdmin: User.isAdmin(),

            isSuperAuthor: false, // 是否为签约作者
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
    watch: {
        profile: {
            handler(newVal) {
                this.checkSuperUser();
            },
            immediate: true,
        }
    },
    methods: {
        getAppIcon,
        // 是否为签约作者
        checkSuperUser: function () {
            this.profile?.ID && getSuperAuthorState(this.profile?.ID).then((res) => {
                this.isSuperAuthor = res.data.data;
            });
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/index.less";
</style>
