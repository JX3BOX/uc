<template>
    <div >
        <CommonHeader></CommonHeader>
        <Breadcrumb :name="$t('vip.common.orderPremium')" slug="vip" root="/vip/premium" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <template #logo><img svg-inline src="@/assets/img/vip/logo.svg" /></template>
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main class="m-vip-container" v-if="isLogin" :withoutRight="true">
            <slot></slot>
        </Main>
        <div class="m-vip-container" v-else>
            <el-alert :title="$t('vip.common.loginRequired')" type="error" show-icon> </el-alert>
        </div>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import Nav from "@/components/vip/Nav.vue";
export default {
    props: ["slug", "slug_root"],
    data: function() {
        return {
            isLogin: User.isLogin(),
        };
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {
        Nav,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/app.less";
</style>
