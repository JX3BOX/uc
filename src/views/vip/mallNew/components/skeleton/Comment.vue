<template>
    <div class="m-plate__content">
        <div class="c-comment-cmt__box" :style="{ backgroundImage: `url(${img})` }">
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
@media screen and (max-width: 750px) {
    .m-plate__content {
    .size(88.8889vw,25vw);
    .Skeleton {
        background-color: #c2c6cc;
        border-radius: .7407vw;
    }
    .c-comment-cmt__box {
        border-radius: 1.4815vw;
        display: flex;
        padding-top: .9259vw;
        background-size: 100% 100%;
        background-position: center;
        .c-comment-avatar {
            margin-right: 3.7037vw;
            padding-left: 1.1111vw;
            .u-avatar__img {
                .Skeleton();
                .size(8.8889vw);
                border-radius: 50%;
            }
        }
        .c-comment-content {
            .c-comment-cmt__author {
                .Skeleton();
                .size(9.2593vw,3.5185vw);
            }
            .u-cmt {
                .u-text {
                    .Skeleton();
                    .size(9.2593vw,3.5185vw);
                    margin-top: 1.8519vw;
                }
                .u-toolbar {
                    display: flex;
                    gap: 3.7037vw;
                    margin-top: 11.1111vw;
                    padding-bottom: 1.8519vw;
                    .u-toolbar__item {
                        .Skeleton();
                        .size(5.5556vw,2.963vw);
                    }
                }
            }
        }
    }
}
}
@media screen and (min-width: 750px) {
    .m-plate__content {
    .size(480px,135px);
    .Skeleton {
        background-color: #c2c6cc;
        border-radius: 4px;
    }
    .c-comment-cmt__box {
        border-radius: 8px;
        display: flex;
        padding-top: 5px;
        background-size: 100% 100%;
        background-position: center;
        .c-comment-avatar {
            margin-right: 20px;
            padding-left: 6px;
            .u-avatar__img {
                .Skeleton();
                .size(48px);
                border-radius: 50%;
            }
        }
        .c-comment-content {
            .c-comment-cmt__author {
                .Skeleton();
                .size(50px,19px);
            }
            .u-cmt {
                .u-text {
                    .Skeleton();
                    .size(50px,19px);
                    margin-top: 10px;
                }
                .u-toolbar {
                    display: flex;
                    gap: 20px;
                    margin-top: 60px;
                    padding-bottom: 10px;
                    .u-toolbar__item {
                        .Skeleton();
                        .size(30px,16px);
                    }
                }
            }
        }
    }
}
}
</style>
