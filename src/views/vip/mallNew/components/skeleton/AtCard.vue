<template>
    <div class="m-plate__content">
        <div class="c-sidebar" :style="{ backgroundImage: `url(${img})` }">
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
        .size(88.8889vw, 46.2963vw);
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 0.7407vw;
        }
        .c-sidebar {
            padding: 1.8519vw;
            border-radius: 0.9259vw;
            height: 100%;
            box-sizing: border-box;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;

            .m-author {
                display: flex;
                align-items: center;
                .u-avatar__img {
                    .Skeleton();
                    .size(12.5926vw);
                    border-radius: 50%;
                    margin-right: 2.7778vw;
                }
                .u-info {
                    .u-name {
                        .Skeleton();
                        height: 3.5185vw;
                        width: 14.8148vw;
                    }
                    .u-extend {
                        height: 3.3333vw;
                        display: flex;
                        gap: 0.7407vw;
                        margin-top: 2.963vw;
                        .u-extend__item {
                            .Skeleton();
                            width: 6.8519vw;
                        }
                    }
                }
            }
            .m-author-teams {
                margin-top: 1.8519vw;
                .Skeleton();
                .size(3.3333vw);
                border-radius: 50%;
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .m-plate__content {
        .size(480px, 250px);
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 4px;
        }
        .c-sidebar {
            padding: 10px;
            border-radius: 5px;
            height: 100%;
            box-sizing: border-box;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;

            .m-author {
                display: flex;
                align-items: center;
                .u-avatar__img {
                    .Skeleton();
                    .size(68px);
                    border-radius: 50%;
                    margin-right: 15px;
                }
                .u-info {
                    .u-name {
                        .Skeleton();
                        height: 19px;
                        width: 80px;
                    }
                    .u-extend {
                        height: 18px;
                        display: flex;
                        gap: 4px;
                        margin-top: 16px;
                        .u-extend__item {
                            .Skeleton();
                            width: 37px;
                        }
                    }
                }
            }
            .m-author-teams {
                margin-top: 10px;
                .Skeleton();
                .size(18px);
                border-radius: 50%;
            }
        }
    }
}
</style>
