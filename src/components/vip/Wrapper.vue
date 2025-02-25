<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="订购高级版" slug="vip" root="/vip/premium" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main class="m-vip-container" v-if="isLogin" :withoutRight="true">
            <slot></slot>
        </Main>
        <div class="m-vip-container" v-else>
            <el-alert title="请先登录" type="error" show-icon> </el-alert>
        </div>
        <Footer></Footer>
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
