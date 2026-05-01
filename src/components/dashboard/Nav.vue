<template>
    <nav class="m-nav">
        <a class="m-nav-publish el-button el-button--large el-button--primary" href="/publish" target="_blank">
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
                    :class="isProfile(child.path) || isTheme(child.path) || isMall(child.path) || isMsg(child.path) || isFavor(child.path) || isTreasure(child.path)"
                >
                    <i :class="child.icon"></i>
                    <span>{{ child.name }}</span>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
import { feedback } from "@/utils/config";
import dashboardLink from "@/utils/dashboardLink.js";
import navList from "@/assets/data/dashboard/nav.json";
const profile_routes = ["profile", "avatar", "pwd", "connect", "email", "address", "notice", "auth"];
const theme_routes = ["theme", "frame", "emotion", "honor", "medal"];
const mall_routes = ["mall", "orders"];
const msg_routes = ["msg", "letter"];
const fav_routes = ["fav"];
const treasure_routes = ["certification", "holidayCard", "birthdayCard"];
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
            return val === "/msg" && msg_routes.includes(this.$route.name) ? "on" : "";
        },
        isFavor: function (val) {
            return val === "/fav" && fav_routes.includes(this.$route.name) ? "on" : "";
        },
        isTreasure: function (val) {
            return val === "/treasure" && treasure_routes.includes(this.$route.name) ? "on" : "";
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/components/nav.less";
</style>
