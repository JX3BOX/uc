<template>
    <h1 class="m-vip-title">
        <span>{{ title }}</span>
        <em>{{ desc }}</em>
        <slot></slot>
    </h1>
</template>

<script>
export default {
    name: "simple_header",
    props: ["title", "desc"],
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
.m-vip-title {
    .x;
    font-weight: 300;
    span {
        .fz(38px, 60px);
        .db;
    }
    em {
        color: #999;
        .fz(24px, 2);
        .db;
        font-style: normal;
    }
    border-bottom: 1px solid #eee;
    max-width: 1080px;
    .auto(x);
    padding-bottom: 20px;
    .mb(20px);
}
</style>
