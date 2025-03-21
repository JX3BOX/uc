<template>
    <div class="m-plate__content">
        <div class="m-welcome">
            <div class="u-pic" :style="{backgroundImage:`url(${img})`}"></div>
            <div class="u-hook u-hook-left"></div>
            <div class="u-hook u-hook-right"></div>
        </div>
        <div class="m-news">
            <div class="m-news-header">
                <div class="u-left"></div>
                <div class="u-right"></div>
            </div>
            <div class="m-news-list">
                <div class="u-item" v-for="item in 5" :key="item">
                    <div class="u-time"></div>
                    <div>/</div>
                    <div
                        class="u-content"
                        :style="{
                            width: `${Math.floor(Math.random() * (80 - 40 + 1) + 40)}%`,
                        }"
                    ></div>
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
@import "~@/assets/css/vip/mall/skeleton/calendar.less";
</style>
