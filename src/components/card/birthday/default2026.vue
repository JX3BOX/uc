<template>
    <div class="p-birthday">
        <!-- <video class="u-video" :src="`${imgPath}bg.mp4`" type="video/mp4" autoplay loop muted></video> -->
        <machine :imgPath="imgPath"> </machine>
    </div>
</template>

<script>
import machine from "./machine.vue";
import { getBirthdayDetail } from "@/service/author/birthday";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@/utils/config";
export default {
    name: "Default2026",
    data: function () {
        return {
            data: "",
            imgPath: __cdn + "design/card/birthday/2026/",
            star: "baiyang",
        };
    },
    components: {
        machine,
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
    },

    mounted() {
        // this.isLogin ? this.loadData() : this.goBack();
    },
    methods: {
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
        // goBack() {
        //     this.$router.push({ name: "index", params: { id: this.uid } });
        // },
        getStar() {
            const date = new Date(this.data.birthday);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const STAR = [
                { sign: "baiyang", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
                { sign: "jiniu", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
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
    },
};
</script>
<style lang="less" scope>
@import "~@/assets/css/author/birthday2026.less";
</style>
