<template>
    <div class="m-card">
        <el-card class="box-card">
            <CardHeader />

            <main v-if="success == true" class="m-main">
                <el-alert
                    title="注册成功"
                    type="success"
                    description="恭喜，您现在已经是「魔盒」的一员啦！"
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <Union mode="login" :includes="[from]" />
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert title="注册失败" type="error" :description="errors" show-icon :closable="false"> </el-alert>
                <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" href="/account/register">返回注册</a>
            </main>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import Union from "@/components/account/Union.vue";

const unionSources = ["qq", "wechat", "weibo"];

export default {
    name: "ThirdPartyRegisterCallback",
    data: function () {
        return {
            from: "",
            success: null,
            errors: "授权来源不合法或已过期",
        };
    },
    methods: {
        init() {
            const params = new URLSearchParams(location.search);
            const from = params.get("from");
            if (!unionSources.includes(from)) {
                this.success = false;
                return;
            }

            this.from = from;
            this.success = true;
        },
    },
    mounted: function () {
        this.init();
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
