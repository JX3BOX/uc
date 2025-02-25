<template>
    <div class="cardQixi" @click.stop>
        <div
            v-if="fontCount"
            :class="['u-count', { active }]"
            :style="{ backgroundImage: `url('${countImg}')` }"
        ></div>
        <div v-else :class="['u-count', { active }]">零</div>
        <img :src="imgList[0]" class="u-img u-text" :class="{ active }" @click="close" />
        <img :src="imgList[1]" class="u-img u-bg" :class="{ active }" />
        <img :src="imgList[2]" class="u-img u-line" @click="open" />
    </div>
</template>
<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "cardQixi",
    props: ["data"],
    computed: {
        fontCount() {
            return this.data?.fontCount;
        },
        imgList() {
            return this.data?.imgList;
        },
        countImg(){
            return this.data?.countImg;
        }
    },
    data() {
        return {
            active: false,
        };
    },
    methods: {
        close() {
            this.active = false;
            this.$emit("close");
        },
        open() {
            this.active = true;
            this.$emit("checked");
        },
    },
};
</script>
<style lang="less" scope>
.cardQixi {
    .pr;
    .size(420px,596px);
    .auto(x);
    .u-count {
        .pa;
        .size(30px,86px);
        .lt(50%);
        .z(3);
        .mt(100px);
        .ml(56px);
        .x;
        .lh(86px);
        .fz(22px);
        opacity: 0;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 23px auto;
        transition: all 0.5s ease-in-out;
        color: #ff236b;
        &.active {
            opacity: 1;
        }
    }
    .u-img {
        .pa;
        .full;
        .pointer;
        .lt(0,120px);
        transition: all 0.3s ease-in-out;
        &.u-bg.active {
            opacity: 0.8;
            filter: grayscale(50%);
        }
        &.u-line:hover {
            filter: brightness(120%);
        }
        &.u-text {
            .none;
            .z(1);
            &.active {
                .db;
            }
        }
    }
}
</style>
