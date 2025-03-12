<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />

            <main v-if="success == true" class="m-main">
                <el-alert title="登录成功" type="success" description="欢迎回来(#^.^#)" show-icon :closable="false"> </el-alert>
                <a class="u-skip el-button u-button el-button--primary" :href="redirect">即将跳转</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert title="登录失败" type="error" description="令牌不合法或已过期" show-icon :closable="false"> </el-alert>
                <a class="u-skip el-button u-button el-button--primary" :href="login_url">返回登录</a>
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __OriginRoot, __Links } from "@jx3box/jx3box-common/data/jx3box.json";
const client = location.host.includes("origin") ? "origin" : "std";

export default {
    name: "Login_Callback",
    data: function () {
        return {
            success: null,
            redirect: client =='origin' ? __OriginRoot : __Root,
            login_url: __Links.account.login
        };
    },
    methods: {},
    filters: {},
    mounted: function () {
        let params = new URLSearchParams(location.search);
        let data = {};
        if (params) {
            // 缓存数据至localStorage
            for (let pair of params.entries()) {
                data[pair[0]] = pair[1];
            }

            // 如果指定回调
            let redirect = params.get("redirect");
            if (redirect) this.redirect = redirect;
        }

        // 更新成功后跳转
        User.update(data).then(() => {
            this.success = true;
            // hack:怀旧服第三方登录问题
            location.href = decodeURIComponent(this.redirect);
        });
    },
    components: {
        CardHeader,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";
</style>
