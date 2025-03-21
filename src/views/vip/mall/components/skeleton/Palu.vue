<template>
    <div class="m-plate__content">
        <div class="m-topic-box">
            <div class="m-topic-top">
                <div class="m-topic-top__time"></div>
                <div class="m-topic-top_right">
                    <div class="u-item"></div>
                    <div class="u-item"></div>
                    <div class="u-item"></div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="272.114"
                        height="27"
                        viewBox="0 0 272.114 27"
                        fill="none"
                        svg-inline=""
                        role="presentation"
                        focusable="false"
                        tabindex="-1"
                        class="u-mocha"
                    >
                        <path
                            fill="#FFF"
                            d="M4.334 26.5h267.28v-16c0-5.523-4.576-10-10.099-10H93.264c-42.018 0-47.452 26-88.93 26z"
                        ></path>
                        <path
                            fill="rgba(236, 236, 236, 1)"
                            d="M93.264 0H261.515c5.799 0 10.599 4.701 10.599 10.5V27h-.5.5H.5v-1h3.834q7.342 0 13.883-1.103 5.824-.983 11.37-2.908 4.627-1.606 9.723-4.12 2.042-1.007 4.511-2.33 1.484-.796 4.42-2.414 2.961-1.632 4.462-2.436 2.505-1.343 4.584-2.367 5.206-2.565 9.956-4.208Q72.95 2.139 78.956 1.13 85.696 0 93.264 0v1q-7.485 0-14.142 1.117-5.925.994-11.552 2.942-4.691 1.623-9.841 4.16-2.064 1.017-4.553 2.351-1.496.802-4.453 2.43-2.94 1.621-4.43 2.42-2.483 1.331-4.54 2.346-5.153 2.54-9.838 4.167-5.625 1.953-11.532 2.95Q11.76 27 4.333 27H.5c-.667 0-.667-1 0-1h271.114v.5-.5.5h-.5v-16c0-5.247-4.352-9.5-9.599-9.5H93.264V0z"
                        ></path>
                    </svg>
                </div>
            </div>
            <div class="m-topic-box__content" :style="{backgroundImage:`url(${img})`}">
                <div class="u-content-aside">
                    <div class="u-cover"></div>
                    <div class="m-topic-tag"></div>
                    <div class="m-topic-userInfo">
                        <div class="m-topic-userInfo__avatar"></div>
                        <div class="m-topic-userInfo__name"></div>
                    </div>
                </div>
                <div class="u-box-content">
                    <div class="m-topic-title">
                        <div class="u-item"></div>
                        <div class="u-item"></div>
                        <div class="u-item"></div>
                    </div>
                    <div class="u-introduction">
                        <div class="u-item"></div>
                        <div class="u-item"></div>
                        <div class="u-item"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Palu",
    props: {
        img: {
            type: String,
            default: "",
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/vip/mall/skeleton/palu.less";
</style>
