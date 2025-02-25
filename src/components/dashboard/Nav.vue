<template>
    <nav class="m-nav">
        <a class="m-nav-publish el-button el-button--primary" href="/publish" target="_blank">
            <!-- <i class="el-icon-edit-outline"></i> -->
            <span>前往创作中心</span>
        </a>

        <div v-for="item in navList" :key="item.group_name">
            <h5 class="u-title">{{ item.group_name }}</h5>
            <div class="m-nav-group">
                <router-link
                    v-for="child in item.children"
                    :to="child.path"
                    :key="child.path"
                    :class="isProfile(child.path) || isTheme(child.path) || isMall(child.path) || isMsg(child.path)"
                >
                    <i :class="child.icon"></i>
                    <span>{{ child.name }}</span>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
import { feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import dashboardLink from "@/utils/dashboardLink.js";
import navList from "@/assets/data/dashboard/nav.json";
const profile_routes = ["profile", "avatar", "pwd", "connect", "email", "address", "notice"];
const theme_routes = ["theme", "frame", "emotion", "honor"];
const mall_routes = ["mall", "orders"];
const msg_routes = ["msg", "letter"]
export default {
    name: "Nav",
    data: function () {
        return {
            feedback,
            navList,
        };
    },
    computed: {
        // isProfile: function () {
        //     return profile_routes.includes(this.$route.name) ? "on" : "";
        // },
    },
    methods: {
        catg_url: function (val) {
            return dashboardLink(`#/${val}`);
        },
        isProfile: function (val) {
            return val === "/profile" && profile_routes.includes(this.$route.name) ? "on" : "";
        },
        isTheme: function (val) {
            return val === "/frame" && theme_routes.includes(this.$route.name) ? "on" : "";
        },
        isMall: function (val) {
            return val === "/mall" && mall_routes.includes(this.$route.name) ? "on" : "";
        },
        isMsg: function (val) {
            return val === '/msg' && msg_routes.includes(this.$route.name) ? "on" : "";
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/components/nav.less";
</style>
