<template>
    <div class="homeSkin-bg" :style="{backgroundImage:`url(${img.replace('homebg','homebg_rb@1x')})`}">
        <div class="banner" :style="{backgroundImage:`url(${img.replace('homebg','homebanner')})`}">
            <div class="avatar"></div>
            <div class="text">
                <div class="name"></div>
                <div class="tag"></div>
            </div>
        </div>
        <div class="section">
            <div class="article"></div>
            <div class="items">
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeSkin",
    props: {
        img: {
            type: String,
            default: "",
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/vip/mall/skeleton/homeSkin.less";
</style>
