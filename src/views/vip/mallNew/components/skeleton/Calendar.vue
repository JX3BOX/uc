<template>
    <div class="m-plate__content">
        <div class="m-welcome">
            <div class="u-pic" :style="{ backgroundImage: `url(${img})` }"></div>
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
@media screen and (max-width: 750px) {
    .m-plate__content {
        width: 88.8889vw;
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: .7407vw;
        }
        .m-welcome {
            height: 22.2222vw;
            position: relative;
            margin-bottom: 1.8519vw;
            .u-pic {
                width: 100%;
                height: 22.2222vw;
                background-repeat: no-repeat;
                background-size: 100% auto;
                -webkit-box-shadow: 0 .1852vw .1852vw .1852vw rgba(0, 0, 0, 0.05);
                box-shadow: 0 .1852vw .1852vw .1852vw rgba(0, 0, 0, 0.05);
            }
            .u-hook {
                .Skeleton();
                .size(1.6667vw,6.6667vw);
                position: absolute;
                bottom: -2.7778vw;
                &.u-hook-left {
                    left: 5.5556vw;
                }
                &.u-hook-right {
                    right: 5.5556vw;
                }
            }
        }
        .m-news {
            background-color: white;
            border-radius: .9259vw;
            border: .1852vw solid #f1f1f4;
            box-shadow: 0 .5556vw .7407vw 0 rgba(0, 0, 0, 0.03);
            .m-news-header {
                height: 6.6667vw;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 1.8519vw;
                border-bottom: .1852vw dashed #eee;
                .u-left {
                    .Skeleton();
                    height: 3.5185vw;
                    width: 43.8889vw;
                }
                .u-right {
                    .Skeleton();
                    height: 2.963vw;
                    width: 2.963vw;
                }
            }
            .m-news-list {
                padding: 1.8519vw;
                .u-item {
                    height: 5.1852vw;
                    display: flex;
                    align-items: center;
                    padding-left: .9259vw;
                    gap: .7407vw;
                    color: #f2f2f2;
                    .u-time {
                        .Skeleton();
                        width: 6.2963vw;
                        height: 2.963vw;
                    }
                    .u-content {
                        .Skeleton();
                        height: 2.963vw;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .m-plate__content {
        width: 480px;
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 4px;
        }
        .m-welcome {
            height: 120px;
            position: relative;
            margin-bottom: 10px;
            .u-pic {
                width: 100%;
                height: 120px;
                background-repeat: no-repeat;
                background-size: 100% auto;
                -webkit-box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.05);
                box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.05);
            }
            .u-hook {
                .Skeleton();
                .size(9px,36px);
                position: absolute;
                bottom: -15px;
                &.u-hook-left {
                    left: 30px;
                }
                &.u-hook-right {
                    right: 30px;
                }
            }
        }
        .m-news {
            background-color: white;
            border-radius: 5px;
            border: 1px solid #f1f1f4;
            box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.03);
            .m-news-header {
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;
                border-bottom: 1px dashed #eee;
                .u-left {
                    .Skeleton();
                    height: 19px;
                    width: 237px;
                }
                .u-right {
                    .Skeleton();
                    height: 16px;
                    width: 16px;
                }
            }
            .m-news-list {
                padding: 10px;
                .u-item {
                    height: 28px;
                    display: flex;
                    align-items: center;
                    padding-left: 5px;
                    gap: 4px;
                    color: #f2f2f2;
                    .u-time {
                        .Skeleton();
                        width: 34px;
                        height: 16px;
                    }
                    .u-content {
                        .Skeleton();
                        height: 16px;
                    }
                }
            }
        }
    }
}
</style>
