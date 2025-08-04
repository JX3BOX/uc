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
            <div class="m-topic-box__content" :style="{ backgroundImage: `url(${img})` }">
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
@media screen and (max-width: 750px) {
    .m-plate__content {
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 0.7407vw;
        }
        .size(88.8889vw, 40.9259vw);
        .m-topic-box {
            border-radius: 1.8519vw;
            .m-topic-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 4.8148vw;
                .m-topic-top__time {
                    .Skeleton();
                    .size(9.8148vw, 2.963vw);
                }
                .m-topic-top_right {
                    display: flex;
                    gap: 4.4444vw;
                    padding: 0.7407vw 0.7407vw 0.7407vw 16.6667vw;
                    position: relative;
                    .u-item {
                        .Skeleton();
                        .size(7.4074vw, 3.3333vw);
                        position: relative;
                        z-index: 1;
                    }
                    .u-mocha {
                        width: 48.1481vw;
                        height: 100%;
                        position: absolute;
                        right: 0;
                        bottom: -0.1852vw;
                        z-index: 0;
                    }
                }
            }
            .m-topic-box__content {
                display: flex;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
                padding: 3.7037vw;
                border-radius: 1.1111vw;
                border-top-right-radius: 0;
                border: 0.1852vw solid #e8e8e8;
                .u-content-aside {
                    width: 31.1111vw;
                    padding-right: 4.4444vw;
                    border-right: 0.1852vw dotted #e5e5e5;
                    margin-right: 3.7037vw;
                    .u-cover {
                        .Skeleton();
                        height: 16.2963vw;
                        border-radius: 0.7407vw;
                        margin-bottom: 2.7778vw;
                        box-shadow: 0.7407vw 0.7407vw 0 hsla(0, 0%, 100%, 0.6);
                    }
                    .m-topic-tag {
                        .Skeleton();
                        .size(31.1111vw ,4.0741vw);
                        margin-bottom: 1.8519vw;
                    }
                    .m-topic-userInfo {
                        display: flex;
                        gap: 1.1111vw;
                        .m-topic-userInfo__avatar {
                            .Skeleton();
                            .size(3.3333vw);
                            border-radius: 50%;
                        }
                        .m-topic-userInfo__name {
                            .Skeleton();
                            .size(12.037vw , 3.1481vw);
                        }
                    }
                }
                .u-box-content {
                    padding: 1.8519vw 2.7778vw;
                    flex: 1;
                    justify-content: space-between;
                    overflow: hidden;
                    background: hsla(0, 0%, 100%, 0.5);
                    border-radius: 0.7407vw;
                    .m-topic-title {
                        display: flex;
                        gap: 1.8519vw;
                        flex-direction: column;
                        .u-item {
                            .Skeleton();
                            height: 3.1481vw;
                            &:last-child {
                                width: 14.8148vw;
                            }
                        }
                    }
                    .u-introduction {
                        display: flex;
                        gap: 1.4815vw;
                        flex-direction: column;
                        margin-top: 1.8519vw;
                        .u-item {
                            .Skeleton();
                            height: 2.2222vw;
                            &:last-child {
                                width: 14.8148vw;
                            }
                        }
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .m-plate__content {
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 4px;
        }
        .size(480px, 221px);
        .m-topic-box {
            border-radius: 10px;
            .m-topic-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 26px;
                .m-topic-top__time {
                    .Skeleton();
                    .size(53px, 16px);
                }
                .m-topic-top_right {
                    display: flex;
                    gap: 24px;
                    padding: 4px 4px 4px 90px;
                    position: relative;
                    .u-item {
                        .Skeleton();
                        .size(40px, 18px);
                        position: relative;
                        z-index: 1;
                    }
                    .u-mocha {
                        width: 260px;
                        height: 100%;
                        position: absolute;
                        right: 0;
                        bottom: -1px;
                        z-index: 0;
                    }
                }
            }
            .m-topic-box__content {
                display: flex;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center;
                padding: 20px;
                border-radius: 6px;
                border-top-right-radius: 0;
                border: 1px solid #e8e8e8;
                .u-content-aside {
                    width: 168px;
                    padding-right: 24px;
                    border-right: 1px dotted #e5e5e5;
                    margin-right: 20px;
                    .u-cover {
                        .Skeleton();
                        height: 88px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        box-shadow: 4px 4px 0 hsla(0, 0%, 100%, 0.6);
                    }
                    .m-topic-tag {
                        .Skeleton();
                        .size(168px ,22px);
                        margin-bottom: 10px;
                    }
                    .m-topic-userInfo {
                        display: flex;
                        gap: 6px;
                        .m-topic-userInfo__avatar {
                            .Skeleton();
                            .size(18px);
                            border-radius: 50%;
                        }
                        .m-topic-userInfo__name {
                            .Skeleton();
                            .size(65px , 17px);
                        }
                    }
                }
                .u-box-content {
                    padding: 10px 15px;
                    flex: 1;
                    justify-content: space-between;
                    overflow: hidden;
                    background: hsla(0, 0%, 100%, 0.5);
                    border-radius: 4px;
                    .m-topic-title {
                        display: flex;
                        gap: 10px;
                        flex-direction: column;
                        .u-item {
                            .Skeleton();
                            height: 17px;
                            &:last-child {
                                width: 80px;
                            }
                        }
                    }
                    .u-introduction {
                        display: flex;
                        gap: 8px;
                        flex-direction: column;
                        margin-top: 10px;
                        .u-item {
                            .Skeleton();
                            height: 12px;
                            &:last-child {
                                width: 80px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
