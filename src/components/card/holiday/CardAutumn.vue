<template>
    <div class="cardAutumn" @click.stop>
        <span class="u-close" @click="close"></span>
        <div class="u-card" @click="change">
            <img v-if="!show" :src="imgList[0]" alt="中秋节快乐！" />
            <img v-else class="animation" :class="show ? 'flipInY' : ''" :src="imgList[1]" alt="中秋节快乐！" />
            <span class="u-username" v-if="!show">{{ username }} 侠士</span>
            <span v-else class="u-fontCount animation" :class="show ? 'fadeInDown' : ''">{{ fontCount }}</span>
        </div>
    </div>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "cardAutumn",
    props: ["data"],
    data: function () {
        return {
            show: false,
        };
    },
    computed: {
        fontCount() {
            return this.data.fontCount;
        },
        imgList() {
            return this.data.imgList;
        },
        username() {
            return User.getInfo().name;
        },
    },
    watch: {},
    methods: {
        change() {
            this.show = true;
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="less" scope>
.cardAutumn {
    .w(1200px);
    .pa;
    .lt(50%);
    .pointer;
    margin: -220px 0 0 -600px;
    .u-close {
        .pa;
        .rt(40px,20px);
        .size(170px,80px);
        .z(2);
    }

    .u-card {
        .full;
        span {
            .db;
            .pa;
            .color(#C6A575);
            .x;
        }
        .u-username {
            .w(100%);
            .lt(0,50%);
            .mt(-32px);
            .fz(32px,60px);
        }
        .u-fontCount {
            .w(138px);
            .lt(50%);
            .fz(24px,40px);
            .mt(-38px);
            .ml(-6px);
        }
    }
}

@media screen and (max-width: @phone) {
    .cardAutumn {
        transform: rotate(90deg);
        zoom: 0.5;
    }
}
</style>
