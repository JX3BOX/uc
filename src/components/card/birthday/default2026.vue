<template>
    <div class="p-birthday">
        <video class="u-star-video" :src="`${imgPath}bg.mp4?12`" type="video/mp4" autoplay loop muted></video>
        <template v-if="!card">
            <machine :imgPath="imgPath">
                <!-- 跑马灯 -->
                <lamp :imgPath="imgPath" :reward="reward" :once="once" />
                <!-- 抽奖球 -->
                <div class="m-ball">
                    <div class="m-ball-box">
                        <img class="u-compass" :class="{ reward }" :src="`${imgPath}compass.svg`" />
                        <ball :imgPath="imgPath" :reward="reward"></ball>
                    </div>
                </div>
                <!-- 奖励 -->
                <div class="m-reward">
                    <!-- 中奖 -->
                    <template v-if="!show">
                        <img class="u-reward" v-if="once" :src="`${imgPath}egg1.svg?jx3box`" />
                    </template>
                    <!-- 开关 -->
                    <img
                        :src="`${imgPath}finger.svg`"
                        :class="`u-finger ${reward || once ? 'hide' : ''}`"
                        @click="toggleReward"
                    />
                    <img
                        :src="`${imgPath}knob.svg`"
                        :class="`u-switch ${reward ? 'reward' : ''}`"
                        @click="toggleReward"
                    />
                </div>
                <div class="u-txt">
                    <template v-if="!reward && !once">点击旋钮开启</template>
                    <template v-if="once">
                        <span class="u-open">点击开启</span>
                    </template>
                </div>
            </machine>
            <!-- 展示奖励 -->
            <div class="m-show" v-if="show">
                <div class="m-show-content" @click="card = true">
                    <img :src="`${imgPath}halo.svg`" class="u-halo" />
                    <img class="u-icon" :src="`${imgPath}egg1.svg`" />
                </div>
            </div>
        </template>
        <div class="m-card" v-else>
            <span class="u-name">祝：{{ name }} </span>
            <img class="u-star" :src="`${imgPath}star/${star}/date.svg`" />
            <img :src="`${imgPath}card.png`" />
            <img class="u-girl" :src="`${imgPath}star/${star}/girl.png`" />
            <span class="u-date">
                {{ date }}
            </span>
        </div>
    </div>
</template>

<script>
import machine from "./components/machine.vue";
import ball from "./components/ball.vue";
import lamp from "./components/lamp.vue";
import { getBirthdayDetail } from "@/service/author/birthday";
import User from "@jx3box/jx3box-common/js/user";
import dayjs from "dayjs";
import { __cdn } from "@/utils/config";
export default {
    name: "Default2026",
    data: function () {
        return {
            data: "",
            imgPath: __cdn + "design/card/birthday/2026/",
            star: "jinniu",
            reward: false,
            once: false,
            show: false,
            card: false,
        };
    },
    components: {
        machine,
        ball,
        lamp,
    },
    computed: {
        isLogin() {
            return User.isLogin();
        },
        user() {
            return User.getInfo();
        },
        id: function () {
            return this.$route.query.id;
        },
        uid: function () {
            return this.$route.query.uid || 0;
        },
        isMine: function () {
            return this.uid == this.user.uid;
        },
        name: function () {
            return this.user.name;
        },
        date() {
            return this.dateFormat(this.data.birthday);
        },
    },

    mounted() {
        this.isLogin ? this.loadData() : this.goBack();
    },
    methods: {
        dateFormat: function (val) {
            return dayjs(val).format("YYYY.MM.DD");
        },
        loadData() {
            if (!this.isMine) return this.goBack();
            getBirthdayDetail(this.id)
                .then((res) => {
                    this.data = res.data.data;
                    this.getStar();
                })
                .catch(() => {
                    this.goBack();
                });
        },
        goBack() {
            this.$router.push({ name: "index", params: { id: this.uid } });
        },
        getStar() {
            const date = new Date(this.data.birthday);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const STAR = [
                { sign: "baiyang", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
                { sign: "jinniu", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
                { sign: "shuangzi", start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
                { sign: "juxie", start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
                { sign: "shizi", start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
                { sign: "chunv", start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
                { sign: "tiancheng", start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
                { sign: "tianxie", start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
                { sign: "sheshou", start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
                { sign: "mojie", start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
                { sign: "shuiping", start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
                { sign: "shuangyu", start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
            ];
            for (const { sign, start, end } of STAR) {
                if (
                    (month === start.month && day >= start.day) ||
                    (month === end.month && day <= end.day) ||
                    (month > start.month && month < end.month) ||
                    (month === end.month && day <= end.day) ||
                    (month === start.month && day >= start.day && end.month === start.month)
                ) {
                    this.star = sign;
                    return;
                }
            }
            this.star = "baiyang";
        },
        toggleReward() {
            if (this.once) return;
            this.reward = true;
            setTimeout(() => {
                this.reward = false;
                this.once = true;
                setTimeout(() => {
                    this.show = true;
                }, 2200);
            }, 2000);
        },
    },
};
</script>
<style lang="less" scope>
@import "~@/assets/css/author/birthday2026.less";
</style>
