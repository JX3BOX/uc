<template>
    <div class="m-vip-result">
        <img class="u-icon" svg-inline src="@/assets/img/vip/common/done.svg" />
        <div class="u-title"><slot name="title"></slot></div>
        <div class="u-desc"><slot name="desc"></slot></div>
        <slot class="u-btns" name="btns"></slot>
    </div>
</template>

<script>
export default {
    name: "result",
    props: [],
    data: function() {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
.m-vip-result {
    .u-icon {
        fill: #52c41a;
        .size(72px);
        .auto(x);
        .db;
    }
    .u-title {
        color: rgba(0, 0, 0, 0.85);
        font-size: 24px;
        line-height: 1.8;
        text-align: center;
        .mt(20px);
    }
    .u-desc {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.6;
        text-align: center;
    }
    .u-btns {
    }
}
</style>
