<template>
    <div class="m-card" id="app">
        <el-card class="box-card">
            <CardHeader />

            <main class="m-main">
                <el-alert title="注册成功" type="success" description="恭喜，您现在已经是「魔盒」的一员啦！" show-icon :closable="false"> </el-alert>
                <Union mode="login" :includes="[from]" />
            </main>
        </el-card>
        <Bottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import { __Root, __OriginRoot } from "@/utils/config";
const client = location.host.includes("origin") ? "origin" : "std";
import Union from "@/components/account/Union.vue";

export default {
    name: "Login_Callback",
    data: function () {
        return {
            success: null,
            redirect: client =='origin' ? __OriginRoot : __Root,
        };
    },
    computed: {
        from() {
            const params = new URLSearchParams(location.search);
            return params.get("from");
        },
    },
    components: {
        CardHeader,
        Union,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";
</style>
