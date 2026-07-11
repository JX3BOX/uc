<template>
    <div >
        <CommonHeader></CommonHeader>
        <div class="m-vip-container">
            <div class="m-vip-index">
                <!-- <el-alert title="Nothing yet" type="warning" show-icon> </el-alert> -->
                <h1 class="m-vip-index-title">{{ $t("vip.home.title") }}<span>{{ $t("vip.home.subtitle") }}</span></h1>
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
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
export default {
    name: "Index",
    props: [],
    components: {},
    data: function () {
        return {
        };
    },
    computed: {
        productions() {
            return [
                {
                    name: this.$t("vip.home.mall"),
                    slug: "mall",
                    icon: "el-icon-shopping-cart-2",
                    desc: this.$t("vip.home.mall"),
                },
                {
                    name: this.$t("vip.home.lottery"),
                    slug: "lottery",
                    icon: "el-icon-present",
                    desc: this.$t("vip.home.lottery"),
                },
                {
                    name: this.$t("vip.home.premium"),
                    slug: "premium",
                    icon: "el-icon-star-off",
                    desc: this.$t("vip.home.premium"),
                },
                {
                    name: this.$t("vip.home.renameCard"),
                    slug: "rename",
                    icon: "el-icon-postcard",
                    desc: this.$t("vip.home.renameCard"),
                },
                {
                    name: this.$t("vip.home.namespace"),
                    slug: "namespace",
                    icon: "el-icon-postcard",
                    desc: this.$t("vip.home.namespace"),
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
            ];
        },
    },
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/vip/index.less";
</style>
