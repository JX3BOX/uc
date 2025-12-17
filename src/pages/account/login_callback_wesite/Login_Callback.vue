<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />

            <main class="m-main">
                <el-alert title="登录成功" type="success" description="欢迎回来(#^.^#)" show-icon :closable="false"> </el-alert>
                <a class="u-skip el-button u-button el-button--primary" :href="redirect">{{ redirect_button }}</a>
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __OriginRoot } from "@/utils/config";
const client = location.host.includes("origin") ? "origin" : "std";
import { directMixins } from "@/utils/direct_mixins";

export default {
    name: "Login_Callback",
    mixins: [directMixins],
    data: function () {
        return {
            success: null,
            redirect: client =='origin' ? __OriginRoot : __Root,
        };
    },
    methods: {
        init() {
            const params = new URLSearchParams(location.search);
            const _userdata = params.get("userdata");
            if (_userdata) {
                const data = JSON.parse(decodeURIComponent(atob(_userdata)));

                const _data = {
                    token: data.token,
                    uid: data.ID,
                    name: data?.display_name,
                    avatar: data?.user_avatar || '',
                    group: data?.user_group || 8,
                    status: data?.status || 0
                }

                User.update(_data).then(() => {

                    if (this.isAlternate) {
                        localStorage.setItem(`jx3box-alternate-${_data.uid}`, JSON.stringify({
                            ..._data,
                            created_at: Number(localStorage.getItem("created_at")),
                        }));
                    }

                    sessionStorage.removeItem("alternate");
                    this.skip();
                });
            }
        },
    },
    mounted: function () {
        this.init();
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
