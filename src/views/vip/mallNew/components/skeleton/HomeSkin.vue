<template>
    <div class="homeSkin-bg" :style="{ backgroundImage: `url(${img.replace('homebg', 'homebg_rb@1x')})` }">
        <div class="banner" :style="{ backgroundImage: `url(${img.replace('homebg', 'homebanner')})` }">
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
@media screen and (max-width: 750px) {
    .homeSkin-bg {
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 0.3704vw;
        }
        .size(88.8889vw,50vw);
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        padding: 0.9259vw;
        border-radius: 0.463vw;
        display: flex;
        flex-direction: column;
        align-items: center;

        .banner {
            .size(50.9259vw,10.1852vw);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            margin-bottom: 0.9259vw;
            .avatar {
                .Skeleton();
                .size(6.2963vw);
                border-radius: 50%;
                margin: 0 2.3148vw 0 0.9259vw;
            }
            .name {
                .Skeleton();
                .size(7.4074vw,1.8519vw);
                margin-bottom: 0.3704vw;
            }
            .tag {
                .Skeleton();
                .size(4.6296vw,1.8519vw);
            }
        }
        .section {
            .size(50.9259vw);
            display: flex;
            .article {
                .Skeleton();
                flex: 3;
            }
            .items {
                padding-left: 0.9259vw;
                flex: 2;
                .item {
                    .Skeleton();
                    width: 100%;
                    height: 2.3148vw;
                    margin-bottom: 0.9259vw;
                }
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .homeSkin-bg {
        .Skeleton {
            background-color: #f2f2f2;
            border-radius: 2px;
        }
        .size(480px,270px);
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        padding: 5px;
        border-radius: 2.5px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .banner {
            .size(275px,55px);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            .avatar {
                .Skeleton();
                .size(34px);
                border-radius: 50%;
                margin: 0 12.5px 0 5px;
            }
            .name {
                .Skeleton();
                .size(40px,10px);
                margin-bottom: 2px;
            }
            .tag {
                .Skeleton();
                .size(25px,10px);
            }
        }
        .section {
            .size(275px);
            display: flex;
            .article {
                .Skeleton();
                flex: 3;
            }
            .items {
                padding-left: 5px;
                flex: 2;
                .item {
                    .Skeleton();
                    width: 100%;
                    height: 12.5px;
                    margin-bottom: 5px;
                }
            }
        }
    }
}
</style>
