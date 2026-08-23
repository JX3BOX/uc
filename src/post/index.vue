<template>
    <div class="m-publish m-index">
        <header class="m-title">
            <div class="m-title-copy">
                <h1 class="u-heading"><i class="el-icon-edit-outline"></i> {{ $t("publish.nav.workbench") }}</h1>
                <p class="u-desc">{{ $t("publish.home.slogan") }}</p>
            </div>
            <div class="u-actions">
                <el-tooltip v-if="!isSuperAuthor" :content="$t('publish.home.authorBenefits')" placement="top">
                    <a
                        href="/dashboard/cooperation"
                        type="primary"
                        class="el-button el-tooltip el-button--primary el-button--small u-btn"
                        target="_blank"
                        ><el-icon><Stamp /></el-icon> {{ $t("publish.home.applyAuthor") }}</a
                    >
                </el-tooltip>
                <el-button
                    v-if="canUseSensitiveWordFilter"
                    tag="a"
                    href="/dashboard/filter"
                    type="warning"
                    size="small"
                    class="u-btn u-filter-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><el-icon><WarningFilled /></el-icon><span>{{ $t("publish.home.sensitiveWordFilter") }}</span></el-button
                >
                <el-button
                    tag="a"
                    href="/ai/editor"
                    type="success"
                    size="small"
                    class="u-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><el-icon><Cellphone /></el-icon><span>{{ $t("publish.home.mobileAdaptationCheck") }}</span></el-button
                >
            </div>
        </header>
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
                        <img :src="getAppLogo('macro')" :alt="$t('publish.types.macros')" />
                        <span>{{ $t("publish.types.macros") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/bps">
                        <img :src="getAppLogo('bps')" :alt="$t('publish.types.classGuides')" />
                        <span>{{ $t("publish.types.classGuides") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/pvp">
                        <img :src="getAppLogo('pvp')" :alt="$t('publish.types.pvpTips')" />
                        <span>{{ $t("publish.types.pvpTips") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/fb">
                        <img :src="getAppLogo('fb')" :alt="$t('publish.types.dungeonGuides')" />
                        <span>{{ $t("publish.types.dungeonGuides") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/tool">
                        <img :src="getAppLogo('tool')" :alt="$t('publish.types.tools')" />
                        <span>{{ $t("publish.types.tools") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">WIKI</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/achievement">
                        <img :src="getAppLogo('cj')" :alt="$t('publish.types.achievementWiki')" />
                        <span>{{ $t("publish.types.achievementWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/item">
                        <img :src="getAppLogo('item')" :alt="$t('publish.types.itemWiki')" />
                        <span>{{ $t("publish.types.itemWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/quest">
                        <img :src="getAppLogo('quest')" :alt="$t('publish.types.questWiki')" />
                        <span>{{ $t("publish.types.questWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/knowledge">
                        <img :src="getAppLogo('knowledge')" :alt="$t('publish.types.knowledgeWiki')" />
                        <span>{{ $t("publish.types.knowledgeWiki") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/skill">
                        <img :src="getAppLogo('skill')" :alt="$t('publish.types.skillWiki')" />
                        <span>{{ $t("publish.types.skillWiki") }}</span>
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
                        <img :src="getAppLogo('face')" :alt="$t('publish.types.faceData')" />
                        <span>{{ $t("publish.types.faceData") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/body">
                        <img :src="getAppLogo('body')" :alt="$t('publish.types.bodyData')" />
                        <span>{{ $t("publish.types.bodyData") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/question">
                        <img :src="getAppLogo('exam')" :alt="$t('publish.types.questions')" />
                        <span>{{ $t("publish.types.questions") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/paper">
                        <img :src="getAppLogo('exam')" :alt="$t('publish.types.papers')" />
                        <span>{{ $t("publish.types.papers") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">PVBB</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <router-link to="/community">
                        <img :src="getAppLogo('community')" :alt="$t('publish.types.forum')" />
                        <span>{{ $t("publish.types.forum") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/joke">
                        <img :src="getAppLogo('joke')" :alt="$t('publish.types.jokes')" />
                        <span>{{ $t("publish.types.jokes") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/emotion">
                        <img :src="getAppLogo('emotion')" :alt="$t('publish.types.emotes')" />
                        <span>{{ $t("publish.types.emotes") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/collection">
                        <img :src="getAppLogo('collection')" :alt="$t('publish.types.collection')" />
                        <span>{{ $t("publish.types.collection") }}</span>
                    </router-link>
                </el-col>
                <el-col :xs="12" :span="4">
                    <router-link to="/namespace">
                        <img :src="getAppLogo('namespace')" :alt="$t('publish.types.namespace')" />
                        <span>{{ $t("publish.types.namespace") }}</span>
                    </router-link>
                </el-col>
            </el-row>

            <el-divider content-position="left">DATA</el-divider>
            <el-row :gutter="20">
                <el-col :xs="12" :span="4">
                    <a href="/pz/" target="_blank" rel="noopener noreferrer">
                        <img :src="getAppLogo('pz')" :alt="$t('publish.types.equipmentPlan')" />
                        <span>{{ $t("publish.types.equipmentPlan") }}</span>
                    </a>
                </el-col>
                <el-col :xs="12" :span="4">
                    <a href="/dbm/" target="_blank" rel="noopener noreferrer">
                        <img :src="getAppLogo('dbm')" :alt="$t('publish.types.pluginData')" />
                        <span>{{ $t("publish.types.pluginData") }}</span>
                    </a>
                </el-col>
                <el-col :xs="12" :span="4">
                    <a href="/battle" target="_blank" rel="noopener noreferrer">
                        <img :src="getAppLogo('battle')" :alt="$t('publish.types.battleData')" />
                        <span>{{ $t("publish.types.battleData") }}</span>
                    </a>
                </el-col>
            </el-row>

            <template v-if="isAdmin">
                <el-divider content-position="left">ADMIN</el-divider>
                <el-row :gutter="20">
                    <el-col :xs="12" :span="4">
                        <router-link to="/notice">
                            <img :src="getAppLogo('home')" :alt="$t('publish.types.news')" />
                            <span>{{ $t("publish.types.news") }}</span>
                        </router-link>
                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
import { getSuperAuthorState } from "@/service/dashboard/cooperation";

export default {
    name: "index",
    props: [],
    data() {
        return {
            isSuperAuthor: false,
        };
    },
    computed: {
        profile() {
            return this.$store.state.profile;
        },
        isAuth() {
            return this.profile.user_group >= 16;
        },
        isAdmin() {
            return this.profile?.user_group >= 128;
        },
        canUseSensitiveWordFilter() {
            return User.getLevel(this.profile?.experience || 0) >= 4;
        },
    },
    mounted() {
        const uid = User.getInfo().uid;
        if (!uid) return;

        getSuperAuthorState(uid)
            .then((res) => {
                this.isSuperAuthor = !!res.data.data;
            })
            .catch(() => {
                this.isSuperAuthor = false;
            });
    },
    methods: {
        getAppLogo: function (identifier) {
            return `https://cdn.jx3box.com/logo/logo-light/${identifier}.svg`;
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/index.less";
</style>
