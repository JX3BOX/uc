<template>
    <div class="m-plate__content">
        <div class="c-comment-cmt__box" :style="{backgroundImage:`url(${img})`}">
            <div class="c-comment-avatar">
                <div class="u-avatar__img"></div>
            </div>
            <div class="c-comment-content">
                <div class="c-comment-cmt__author"></div>
                <div class="u-cmt">
                    <div class="u-text"></div>
                    <div class="u-toolbar">
                        <div class="u-toolbar__item" v-for="item in 5" :key="item"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Calendar",
    props: {
        img: {
            type: String,
            default: "",
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/vip/mall/skeleton/comment.less";
</style>
