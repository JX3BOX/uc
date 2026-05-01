<template>
    <div class="m-oauth">
        <el-divider class="u-title">OR</el-divider>
        <el-row :gutter="20">
            <el-col :span="span" v-if="includes.includes('qq')"
                ><a class="u-item" :href="getUnionLink('api/cms/user/union/qqsite/')">
                    <i class="u-oauth-logo"><img svg-inline src="@/assets/img/account/qq.svg" /></i>
                    <span class="u-oauth-name">QQ</span>
                </a></el-col
            >
            <el-col :span="span" v-if="includes.includes('wechat')"
                ><a class="u-item" :href="getUnionLink('api/cms/user/union/wesite/')">
                    <i class="u-oauth-logo"><img svg-inline src="@/assets/img/account/wechat.svg" /></i>
                    <span class="u-oauth-name">微信</span>
                </a></el-col
            >
            <el-col :span="span" v-if="includes.includes('weibo')"
                ><a class="u-item" :href="getUnionLink('api/cms/user/union/weibosite/')">
                    <i class="u-oauth-logo"><img svg-inline src="@/assets/img/account/weibo.svg" /></i>
                    <span class="u-oauth-name">微博</span>
                </a></el-col
            >
        </el-row>
    </div>
</template>

<script>
import connect from "@jx3box/jx3box-common/js/connect.js";
const client = location.href.includes('origin') ? 'origin' : 'std'
import {__cms} from "@/utils/config";
export default {
    name: "LoginWith",
    props: {
        mode: {
            type: String,
            default: "login",
        },
        includes: {
            type: Array,
            default: () => [],
        },
    },
    data: function () {
        return {
            github: this.buildState(connect.github),
            qq: this.buildState(connect.qq),
            weibo: this.buildState(connect.weibo),
            wechat: this.buildState(connect.wechat),
        };
    },
    computed: {
        unionLinkSuffix() {
            return "?client=" + client;
        },
        span() {
            return 24 / this.includes.length;
        },
    },
    methods: {
        buildState : function (val){
            return val.replace('state=login',`state=login_${client}`)
        },
        getUnionLink(path) {
            const cms = __cms;
            // const cms = 'http://localhost:7100/'
            return cms + path + this.mode + this.unionLinkSuffix;
        }
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/account/oauth.less";
</style>
