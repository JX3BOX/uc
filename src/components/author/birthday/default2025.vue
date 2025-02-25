<template>
    <div class="p-birthday" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <video class="u-video" :src="`${imgPath}bg.mp4`" type="video/mp4" autoplay loop muted></video>
        <div :class="letterClass" @click="openLetter">
            <!-- 内页背景 -->
            <img :src="`${imgPath}pack_in.png`" class="u-img u-pack-in" />
            <!-- 外信封下部 -->
            <img :src="`${imgPath}pack_out.png`" class="u-img u-pack-out" />
            <!-- 外信封上三角 -->
            <img :src="`${imgPath}pack_topout.png`" class="u-img u-pack-top-out" />
            <img :src="`${imgPath}pack_topin.png`" class="u-img u-pack-top-in" />
            <!-- 信封内容 -->
            <div class="m-content" :style="transformStyle">
                <img :src="`${imgPath}${star}/girl.png`" class="u-img u-girl" />
                <div class="m-paper">
                    <img :src="`${imgPath}paper.png`" class="u-bg" />
                    <span class="u-text name">{{ name }}</span>
                    <span class="u-text date">{{ date }}</span>
                </div>
                <img :src="`${imgPath}${star}/icon.png`" class="u-img u-icon" />
                <img :src="`${imgPath}girlQ.png`" class="u-img u-cake" />
                <img :src="`${imgPath}ground.png`" class="u-img u-ground" />
            </div>
            <img :src="`${imgPath}${star}/txt.png`" class="u-img u-txt" />
            <img :src="`${imgPath}${star}/img.png`" class="u-img u-star" />
            <!-- 漆封 -->
            <div :class="`u-paint ${clickCount == 1 ? 'animation' : ''}`">
                <img :src="`${imgPath}paint.png`" class="u-pack-paint" />
                <img :src="`${imgPath}ok.png`" class="u-pack-ok" />
            </div>
            <!-- hi -->
            <img :src="`${imgPath}hi.png`" class="u-img u-hi" />
        </div>
    </div>
</template>

<script>
import { getBirthdayDetail } from "@/service/author/birthday";
import User from "@jx3box/jx3box-common/js/user";
import dayjs from "dayjs";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Default2025",
    data: function () {
        return {
            data: "",
            imgPath: __cdn + "design/card/birthday/default2025/",
            star: "SY",
            // 状态
            start: false,
            open: false,
            diffuse: false,
            clickCount: 0,
            // 鼠标位置
            mouseX: 0,
            mouseY: 0,
            isMouseOver: false,
        };
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
            return this.$route.params.uid || 0;
        },
        isMine: function () {
            return this.uid == this.user.uid;
        },
        name: function () {
            return this.user.name;
        },
        date() {
            return this.dateFormat(this.data.created_at);
        },
        letterClass() {
            return {
                "m-letter": true,
                open: this.open,
                diffuse: this.diffuse,
            };
        },
        transformStyle() {
            if (this.isMouseOver)
                return {
                    transform: `perspective(2000px) translate3d(${this.mouseY}px,${this.mouseX}px, 0px) rotateY(${this.mouseX}deg) rotateX(${this.mouseY}deg)`,
                };
            return {
                transform: `perspective(2000px) translate(${this.mouseY}px,${this.mouseX}px, 0px) rotateY(${this.mouseX}deg) rotateX(${this.mouseY}deg)`,
            };
        },
    },

    mounted() {
        this.isLogin ? this.loadData() : this.goBack();
    },
    methods: {
        dateFormat: function (val) {
            return dayjs(val).format("YYYY年MM月DD日");
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
        openLetter() {
            this.clickCount++;
            if (this.clickCount == 1) {
                setTimeout(() => {
                    this.open = true;
                }, 500);
            }
            if (this.clickCount == 2) {
                this.diffuse = true;
            }
        },
        handleMouseMove(event) {
            if (this.clickCount < 2) return;
            const mouseX = event.clientX / 200;
            const mouseY = event.clientY / 100;
            this.mouseX = mouseX;
            this.mouseY = mouseY;
            this.isMouseOver = true;
        },
        handleMouseLeave() {
            if (this.clickCount < 2) return;
            this.isMouseOver = false;
        },
        goBack() {
            this.$router.push({ name: "index", params: { id: this.uid } });
        },
        getStar() {
            const date = new Date(this.data.birthday);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const STAR = [
                { sign: "BY", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
                { sign: "JN", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
                { sign: "SZ", start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
                { sign: "JX", start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
                { sign: "LEO", start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
                { sign: "CN", start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
                { sign: "TC", start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
                { sign: "TX", start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
                { sign: "SS", start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
                { sign: "MJ", start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
                { sign: "SP", start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
                { sign: "SY", start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
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
            this.star = "SY";
        },
    },
};
</script>
<style lang="less" scope>
@import "~@/assets/css/author/birthday2025.less";
</style>
