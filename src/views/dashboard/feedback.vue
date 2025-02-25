<!--
 * @Author: iRuxu
 * @Date: 2022-07-03 00:02:30
 * @LastEditTime: 2022-07-03 02:14:33
 * @Description:
-->
<template>
    <div class="m-credit m-feedback">
        <h2 class="u-title">
            <i class="el-icon-phone-outline"></i> 反馈中心
            <el-button class="u-back" size="mini" plain icon="el-icon-arrow-left" @click="goBack">返回</el-button>
        </h2>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "Feedback",
    props: [],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        goBack() {
            if (window.history.length > 1) {
                this.$router.go(-1);
            } else {
                this.$router.push({ path: '/feedback?tab=pending' });
            }
        },
    },
    created: function () {},
    mounted: function () {
        this.$store.dispatch('getIsTeammate')
    },
};

</script>


<style scoped lang="less">
.m-feedback{
    .u-title{
        .pr;
    }
    .u-back{
        position: absolute;
        bottom: 10px;
        right: 0;
    }
}
</style>
