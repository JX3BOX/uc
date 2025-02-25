<template>
    <div id="app">
        <Header></Header>
        <div class="m-vip-container">
            <div class="m-vip-index">
                <!-- <el-alert title="Nothing yet" type="warning" show-icon> </el-alert> -->
                <h1 class="m-vip-index-title">我们的产品<span>Our Products List</span></h1>
                <el-row :gutter="20">
                    <el-col :span="8" v-for="item in productions" :key="item.slug"
                        ><div class="u-item">
                            <el-card class="box-card">
                                <div class="u-item">
                                    <a :href="`/vip/${item.slug}`"><i :class="item.icon"></i> {{ item.name }}</a>
                                </div>
                            </el-card>
                        </div></el-col
                    >
                </el-row>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
export default {
    name: "Index",
    props: [],
    components: {},
    data: function () {
        return {
            productions: [
                {
                    name: "积分商城",
                    slug: "mall",
                    icon: "el-icon-shopping-cart-2",
                    desc: "积分商城",
                },
                {
                    name: "积分抽奖",
                    slug: "lottery",
                    icon: "el-icon-present",
                    desc: "积分抽奖",
                },
                {
                    name: "高级会员",
                    slug: "premium",
                    icon: "el-icon-star-off",
                    desc: "高级会员",
                },
                {
                    name: "改名卡",
                    slug: "rename",
                    icon: "el-icon-postcard",
                    desc: "改名卡",
                },
                {
                    name: "铭牌空间",
                    slug: "namespace",
                    icon: "el-icon-postcard",
                    desc: "铭牌空间",
                },
                // {
                //     name: "魔盒活动",
                //     slug: "event",
                //     icon: "el-icon-present",
                //     desc: "魔盒活动",
                // },
                // {
                //     name: "盒币充值",
                //     slug: "boxcoin",
                //     icon: "el-icon-coin",
                //     desc: "盒币充值",
                // },
                // {
                //     name: "金箔充值",
                //     slug: "cny",
                //     icon: "el-icon-coin",
                //     desc: "金箔充值",
                // },
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/vip/index.less";
</style>
