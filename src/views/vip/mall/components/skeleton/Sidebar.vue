<template>
    <div class="m-plate__content">
        <div class="c-sidebar" :style="{backgroundImage:`url(${img})`}">
            <div class="m-author">
                <div class="u-avatar__img"></div>
                <div class="u-info">
                    <div class="u-name"></div>
                    <div class="u-extend">
                        <div class="u-extend__item"></div>
                        <div class="u-extend__item"></div>
                    </div>
                </div>
            </div>
            <div class="u-bio"></div>
            <div class="u-interact">
                <div class="u-interact__item"></div>
                <div class="u-interact__item"></div>
            </div>
            <div class="c-author-link">
                <div class="u-link"></div>
                <div class="u-link"></div>
            </div>
            <div class="c-author-label"></div>
            <div class="m-author-teams"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Sidebar",
    props: {
        img: {
            type: String,
            default: "",
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/vip/mall/skeleton/sidebar.less";
</style>
