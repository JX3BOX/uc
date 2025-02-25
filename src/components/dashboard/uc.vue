<template>
    <div class="m-dashboard-profile m-profile">
        <h2 class="u-title">
            <i :class="icon"></i> {{ title }}
            <slot name="header"></slot>
        </h2>
        <tabs :tabs="tabList" :msg-change-count="msgChangeCount" />
        <slot></slot>
    </div>
</template>

<script>
import tabs from "@/components/dashboard/tabs.vue";
import { profileTab } from "@/assets/data/dashboard/tabs.json";
export default {
    name: "uc",
    props: {
        icon: {
            type: String,
            default: "el-icon-user",
        },
        title: {
            type: String,
            default: "我的资料",
        },
        tabList: {
            type: Array,
            default: function () {
                return profileTab;
            },
        },
        msgChangeCount: {
            type: Number,
            default: 0,
        },
    },
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {
        tabs,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/uc.less";
</style>
