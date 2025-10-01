

<template>
    <div v-if="uid" v-loading="loading" class="m-qy-card">
        <div class="m-overview">
            <div class="m-left">
                <div class="u-name">
                    {{name}}
                    <img
                        :src="require(`@/assets/img/author/mobile/mounts/${icon}.svg`)"
                        class="u-mount-icon"
                    />
                </div>

                <div class="u-progress">
                    <div class="u-line" :style="`width: ${userAchievement.progress}%`"></div>
                    <div class="u-text">奇遇总进度：{{ userAchievement.progress }}%</div>
                </div>

                <div class="u-time">
                    记录时间：{{ userAchievement.updated_at }}
                </div>
            </div>

            <div class="m-right">
                <img  :src="require(`@/assets/img/author/mobile/juan${isDark?'-dark':''}.png`)" />
            </div>
        </div>

        <div class="m-qy-box">
            <div class="m-counter m-world-count">
                <div>绝世奇遇</div>
                <div class="m-count-info">
                    {{ userAchievement.perfectNowNum + "/" + userAchievement.perfectAllNum }}
                </div>
            </div>

            <div class="u-trans-display" @click="()=>showCard = !showCard">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10" fill="none">
                    <path d="M6.75 8.54999L8.25 7.04999M8.25 7.04999L6.75 5.54999M8.25 7.04999H0.75" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.25 4.04999L0.75 2.54999M0.75 2.54999L2.25 1.04999M0.75 2.54999L8.25 2.54999" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{showCard ? "展示立绘" : "展示名牌"}}
            </div>

            <div v-if="!showCard" class="m-world"  :style="{zoom: contentZoom,}">
                <img class="u-world__bg" :src="getCdnImgUrl('world/world_bg.svg')" />

                <div
                    class="m-world-item"
                    v-for="(item, index) in userAchievement.perfect"
                    :key="index"
                    :class="item.hasClass"
                    :style="{zIndex: item.zIndex,}"
                >
                    <img
                        class="u-item__img"
                        :src="getCdnImgUrl(`world/${item.dwID}${item.isAct ? '_act' : ''}.png`)"
                    />
                    <div class="m-item__text">
                        <img
                            class="u-item__bg"
                            :src="getCdnImgUrl(`world/text_bg${item.isAct ? '_act' : ''}.png`)"
                        />
                        <span class="u-item__text">{{ item.szName }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="m-qy m-world-qy">
                <div class="m-qy-list" v-if="userAchievement.perfect?.filter(i=>i.isAct)?.length">
                    <div
                        class="m-qy__item"
                        v-for="(item, index) in userAchievement.perfect.filter(i=>i.isAct)"
                        :key="item.dwID || index"
                    >
                        <el-image  class="u-qy__img"  :src="getCdnImgUrl(`world/${item.dwID}_act.png`)">
                            <el-image
                                slot="error"
                                class="u-qy__img"
                                :src="getCdnImgUrl(`pt/default.png`)"
                            >
                            </el-image>
                        </el-image>
                        <div class="u-bg"></div>
                        <div class="m-qy__text">
                            <!--                            <img class="u-qy__bg" :src="getCdnImgUrl('pt/text_bg.png')" />-->
                            <span class="u-qy__text">{{ item.szName }}</span>
                        </div>
                    </div>
                </div>
                <div class="u-no-qy" v-else>
                    <img :src="getCdnImgUrl('portrait/no_qy.png')" />
                </div>
            </div>

        </div>

        <div class="m-qy-box">
            <div class="m-counter m-normal-count">
                <div>普通奇遇</div>
                <div class="m-count-info">
                    {{ userAchievement.normalNowNum + "/" + userAchievement.normalAllNum }}
                </div>
            </div>
            <div class="m-qy m-ordinary">
                <div class="m-qy-list" v-if="userAchievement?.normal?.length">
                    <div
                        class="m-qy__item"
                        v-for="(item, index) in userAchievement.normal"
                        :key="index"
                    >
                        <div class="u-black"></div>
                        <template v-if="[4, 118].indexOf(item.dwID) > -1">
                            <img
                                v-show="currentCamp == 'hq'"
                                class="u-qy__img"
                                :src="getCdnImgUrl(`pt/${item.dwID}_hq.png`)"
                            />
                            <img
                                v-show="currentCamp == 'er'"
                                class="u-qy__img"
                                :src="getCdnImgUrl(`pt/${item.dwID}_er.png`)"
                            />
                        </template>
                        <el-image v-else class="u-qy__img" style="object-fit: cover" :src="getCdnImgUrl(`pt/${item.dwID}.png`)">
                            <el-image
                                slot="error"
                                class="u-qy__img"
                                :src="getCdnImgUrl(`pt/default.png`)"
                            >
                            </el-image>
                        </el-image>
                        <div class="u-bg"></div>
                        <div class="m-qy__text">
<!--                            <img class="u-qy__bg" :src="getCdnImgUrl('pt/text_bg.png')" />-->
                            <span class="u-qy__text">{{ item.szName }}</span>
                        </div>
                    </div>
                </div>
                <div class="u-no-qy" v-else>
                    <img :src="getCdnImgUrl('portrait/no_qy.png')" />
                </div>
            </div>
        </div>
        <!-- 宠物奇遇 -->
        <div class="m-qy-box">
            <div class="m-counter m-qy-count">
                <div>宠物奇遇</div>
                <div class="m-count-info">
                    {{ userAchievement.petNowNum + "/" + userAchievement.petAllNum }}
                </div>
            </div>
            <div class="m-qy m-pet">
                <div class="m-qy-list" v-if="userAchievement.pet?.length">
                    <div class="m-qy__item" v-for="(item, index) in userAchievement.pet" :key="index">
                        <img class="u-qy__img" :src="getImgUrl(item)" />
                        <img v-if="showBorder" class="u-qy__border" :src="getCdnImgUrl('pet_img_border.png')" />
                        <div class="u-bg"></div>
                    </div>
                </div>
                <div class="u-no-qy" v-else>
                    <img :src="getCdnImgUrl('portrait/no_qy.png')" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { __cdn, __imgPath } from "@/utils/config";
import getData from "@/assets/js/treasure";
import { __Links } from "@/utils/config";

export default {
    name:"QyCard",
    props:{
        uid: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        }
    },
    data(){
        return {
            addClass: false,
            isOver: false,
            contentZoom: "0.4",
            userAchievement: {},
            roleList: [],
            noRole: false,
            currentRole: "",
            currentCamp: "hq",
            roleInfo: {},
            isSync: false,
            showBorder: false,
            showCard: false,
            loading: false,
            login_url: __Links.account.login + "?redirect=" + location.href,
            imgRoot: __imgPath + "adventure/",
        }
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        isDark(){
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    },
    watch: {
        uid: {
            immediate: true,
            handler(v){
                if (v){
                    this.loadRole(v);
                }
            }
        }

    },
    methods:{
        getCdnImgUrl(img) {
            return `${__cdn}design/treasure/${img}`;
        },
        getImgUrl(item) {
            const client = "std"; // 怀旧服的奇遇图片先取正式服的
            let tgaPath = item.szOpenRewardPath?.toLowerCase();
            if (!tgaPath) return "";
            tgaPath = tgaPath.replace(/\\/g, "/").replace("ui/image/adventure/", "");
            if (!item.szRewardType) {
                let pngPath = tgaPath.replace(/\.tga$/, ".png");
                return `${this.imgRoot}adventure/${client}/${pngPath}`;
            }
            // 传给组件的数据是修改过的
            tgaPath = tgaPath.replace(/\/[^\/]+?\.tga$/, "");
            if (item.szRewardType === "camp")
                return `${this.imgRoot}adventure/${client}/${tgaPath}/camp_${this.camp}_open.png`;
            if (item.szRewardType === "school")
                return `${this.imgRoot}adventure/${client}/${tgaPath}/school_${this.force}_open.png`;
            return defaultImg;
        },
        start() {
            this.addClass = true;
            setTimeout(() => {
                this.addClass = false;
                this.isOver = true;
            }, 2000);
            window.addEventListener("resize", this.handleScreenWidthChange);
            window.addEventListener("load", this.handleScreenWidthChange);
            this.handleScreenWidthChange();
        },
        handleScreenWidthChange() {
            var screenWidth = window.innerWidth - 40;
            var boxWidth = 750;
            var scale = screenWidth / boxWidth;
            var zoom = 0.4;
            if (screenWidth <= boxWidth) {
                zoom = scale;
            }
            this.contentZoom = zoom;
        },
        loadRole() {
            this.loading = true;
            getData(this.uid, true).then((res) => {
                console.log(res);
                this.isSync = !!this.uid; // 是否在游戏中同步
                this.userAchievement = res;
                this.addClass = false;
                this.isOver = false;
                this.$nextTick((_) => {
                    this.start();
                });
            }).finally(()=>{
                this.loading = false;
            });
        },
    }
}
</script>


<style  lang="less">


.m-qy-card{
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    @pvx_img: "https://img.jx3box.com/image/pvx/";
    @pet_root: "https://img.jx3box.com/pet/";
    @game_icons: "https://img.jx3box.com/image/game/";
    @img_path: "https://img.jx3box.com/";
    @design_url: "https://cdn.jx3box.com/design/";


    .m-overview {
        display: flex;
        padding: 12px;
        align-items: center;
        gap: 20px;
        border-radius: 12px;
        background: linear-gradient(0deg, #FAF5ED 0%, #FAF5ED 100%), linear-gradient(180deg, #F9F1E4 0%, rgba(249, 246, 242, 0.00) 100%);

        @media (prefers-color-scheme: dark) {
            background: var(--black-5, rgba(255, 255, 255, 0.10));
        }

        .m-left {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            gap: 4px;
            .u-name {
                display: flex;
                align-items: center;
                gap:4px;
                color: var(--black-80, rgba(0, 0, 0, 0.80));

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */

                .u-mount-icon {
                    display: flex;
                    width: 24px;
                    height: 24px;
                    justify-content: center;
                    align-items: center;

                    fill: var(--black-80);

                    @media (prefers-color-scheme: dark) {
                        // filter 出颜色 rgba(#ffffff, 0.8)
                        filter: invert(0.8) hue-rotate(180deg);

                    }
                }
            }

            .u-progress {
                display: flex;
                width: 174px;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
                border-radius: 9px;
                height: 18px;
                background: black;
                overflow: hidden;
                position: relative;
                .u-text{
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    text-align: center;

                    color: #FFF;

                    /* 12 Regular */
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    z-index: 2;
                }

                .u-line{
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 18px;
                    border-radius: 9px;
                    background: linear-gradient(90deg, #000 0%, #B23030 100%);
                }
            }

            .u-time {
                color: var(--black-40, rgba(28, 28, 28, 0.40));

                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .m-right {
            width: 118px;
            height: 78px;
            aspect-ratio: 59/39;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }


    .m-qy-box {
        box-sizing: border-box;
        display: flex;
        padding-bottom: 12px;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        align-self: stretch;
        position: relative;

        border-radius: 12px;
        background: linear-gradient(0deg, #FAF5ED 0%, #FAF5ED 100%), linear-gradient(180deg, #F9F1E4 0.01%, rgba(255, 255, 255, 0.00) 100%);
        @media (prefers-color-scheme: dark) {
            background: var(--black-20, rgba(255, 255, 255, 0.20));
        }
        .u-trans-display{
            color: var(--black-100, #1C1C1C);

            /* 14 Bold */
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 20px; /* 142.857% */
        }

        .m-counter{
            display: flex;
            padding: 0px 12px;
            align-items: center;
            gap: 4px;

            border-radius: 0px 0px 12px 12px;
            background: #D9A256;
            color: #FFF;

            /* 14 Regular */
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */

            &.m-qy-count{
                border-radius: 0px 0px 12px 12px;
                background: #A91515;
            }

            &.m-normal-count{
                border-radius: 0px 0px 12px 12px;
                background: #A91515;
            }
        }

        .m-qy {
            display: flex;
            padding-bottom: 12px;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            align-self: stretch;
            .m-qy-list {
                display: flex;
                padding: 0px 12px;
                flex-direction: row;
                align-items: center;
                gap: 4px;
                align-self: stretch;
                flex-wrap: wrap;
                .m-qy__item {
                    position: relative;
                    width: 47px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #000;
                    background: black;
                    .u-qy__img{
                        opacity: 0.5;
                    }
                    .u-qy__border {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .u-bg{
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33%, #A91515 100%);
                        background-size: 50%;
                    }
                    .m-qy__text {
                        display: flex;
                        align-items: center; /* 垂直居中 */
                        justify-content: center; /* 水平居中 */
                        height: 100%; /* 使容器占满视口高度 */
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        .u-qy__text {
                            width: 12px;
                            color: var(--primary-white, #FFF);
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: 14px; /* 140% */
                        }
                    }
                }
            }
            .u-no-qy {
                width: 200px;
                margin: 8px 0;
            }

            &.m-world-qy{
                .m-qy-list {
                    display: flex;
                    gap: 5.6px;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    align-content: flex-start;

                    .m-qy__item {
                        width: calc(100%/10);
                        margin-left: 0;
                        min-height: 74px;
                        max-width: 24px;
                        border-radius: 8px;
                        overflow: hidden;
                        .u-bg{
                            background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33%,#C28A3A 100%);
                        }
                        .u-qy__img{
                            width: 130%;
                            height: 110%;
                            object-fit: cover;
                            position: absolute;
                            top: -10%;
                            left: -15%;
                            background: #000;
                            border-radius: inherit;
                        }
                    }
                }
            }
            &.m-ordinary {
                .m-qy-list {
                    display: flex;
                    gap: 5.6px;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    align-content: flex-start;


                    .m-qy__item {
                        width: calc(100%/10);
                        margin-left: 0;
                        min-height: 74px;
                        max-width: 24px;
                        border-radius: 8px;
                        overflow: hidden;

                        background: black;


                        .u-qy__img{
                            width: 130%;
                            height: 110%;
                            object-fit: cover;
                            position: absolute;
                            top: -10%;
                            left: -15%;
                            background: #000;
                            border-radius: inherit;
                        }
                    }


                }
            }
            &.m-pet {
                .m-qy-list {
                    display: flex;
                    gap: 5.6px;
                    flex-wrap: wrap;
                    align-items: flex-start;
                    align-content: flex-start;
                    .m-qy__item {
                        width: calc(100%/9 - 5px);
                        margin-left: 0;
                        max-width: 26px;
                        max-height: 26px;
                        min-height: 26px;
                        border-radius: 50%;
                        overflow: hidden;
                        .u-qy__img{
                            opacity: 1;
                        }
                        .u-bg{
                            background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 33%, #A91515 100%);
                            background-size: 50%;
                        }
                        .u-qy__img{
                            width: 150%;
                            height: 150%;
                            object-fit: cover;
                            position: absolute;
                            top: -25%;
                            left: 0;
                            background: #000;
                            border-radius: inherit;
                        }
                    }
                }
            }
        }

        .m-world {
            position: relative;
            width: 700px;
            height: 700px;
            margin: 0 auto;
            .u-world__bg {
                position: absolute;
                left: 55px;
                bottom: 36px;
                width: 579px;
            }
            .m-world-count {
                position: absolute;
                top: 82px;
                left: -23px;
                .u-count__img {
                    width: 184px;
                }
                .m-count-info {
                    position: absolute;
                    top: 7px;
                    right: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #995115;
                    text-align: center;
                    opacity: 0.5;
                    line-height: 1;
                }
            }
            .m-world-item {
                position: absolute;
                .m-item__text {
                    position: absolute;
                    .u-item__bg {
                        width: 20px;
                    }
                    .u-item__text {
                        position: absolute;
                        top: 4px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 12px;
                        color: white;
                        line-height: 12px;
                    }
                }
                &.wldg {
                    top: 462px;
                    left: 293px;
                    .u-item__img {
                        width: 108px;
                    }
                    .m-item__text {
                        top: 27px;
                        left: -5px;
                    }
                }
                &.sssh {
                    top: 1px;
                    left: 261px;
                    .u-item__img {
                        width: 168px;
                    }
                    .m-item__text {
                        top: 77px;
                        left: 50px;
                    }
                }
                &.zhg {
                    top: 66px;
                    left: 325px;
                    .u-item__img {
                        width: 314px;
                    }
                    .m-item__text {
                        top: 114px;
                        left: 196px;
                    }
                }
                &.lnrh {
                    top: 63px;
                    left: 345px;
                    .u-item__img {
                        width: 149px;
                    }
                    .m-item__text {
                        top: 40px;
                        left: 55px;
                    }
                }
                &.yylj {
                    top: 56px;
                    left: 67px;
                    .u-item__img {
                        width: 325px;
                    }
                    .m-item__text {
                        top: 99px;
                        left: 169px;
                    }
                }
                &.swbj {
                    top: 162px;
                    left: 71px;
                    .u-item__img {
                        width: 276px;
                    }
                    .m-item__text {
                        top: 85px;
                        left: 109px;
                    }
                }
                &.xxjt {
                    top: 126px;
                    left: 198px;
                    .u-item__img {
                        width: 314px;
                    }
                    .m-item__text {
                        top: 144px;
                        left: 84px;
                    }
                }
                &.qqj {
                    top: 231px;
                    left: 456px;
                    .u-item__img {
                        width: 206px;
                    }
                    .m-item__text {
                        top: 109px;
                        left: 162px;
                    }
                }
                &.swxf {
                    top: 276px;
                    left: 27px;
                    .u-item__img {
                        width: 321px;
                    }
                    .m-item__text {
                        top: 126px;
                        left: 65px;
                    }
                }
                &.jcs {
                    top: 317px;
                    left: 304px;
                    .u-item__img {
                        width: 185px;
                    }
                    .m-item__text {
                        top: 112px;
                        left: 72px;
                    }
                }
                &.zzwg {
                    top: 327px;
                    left: 467px;
                    .u-item__img {
                        width: 165px;
                    }
                    .m-item__text {
                        top: 111px;
                        left: 125px;
                    }
                }
                &.tjh {
                    top: 338px;
                    left: 124px;
                    .u-item__img {
                        width: 176px;
                    }
                    .m-item__text {
                        top: 155px;
                        left: -16px;
                    }
                }
                &.scqf {
                    top: 355px;
                    left: 398px;
                    .u-item__img {
                        width: 142px;
                    }
                    .m-item__text {
                        top: 125px;
                        left: 38px;
                    }
                }
                &.rjg {
                    top: 500px;
                    left: 198px;
                    .u-item__img {
                        width: 436px;
                    }
                    .m-item__text {
                        top: 103px;
                        left: 172px;
                    }
                }
                &.kwyh {
                    top: 295px;
                    left: 400px;
                    .u-item__img {
                        width: 144px;
                    }
                    .m-item__text {
                        top: -6px;
                        right: 12px;
                    }
                }
                &.fgzm {
                    top: 110px;
                    left: 302px;
                    .u-item__img {
                        width: 211px;
                    }
                    .m-item__text {
                        top: 48px;
                        left: 6px;
                    }
                }
                &.gsyj {
                    top: 319px;
                    left: 273px;
                    .u-item__img {
                        width: 180px;
                    }
                    .m-item__text {
                        top: 0px;
                        left: 70px;
                    }
                }
            }
        }

    }
}

</style>
