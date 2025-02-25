<template>
    <div class="cardDragonBoat" @click.stop>
        <div :class="['u-count', { show }]" :style="{ backgroundImage: `url('${countImg}')` }"></div>
        <div class="u-img mark" :class="{ show }"></div>
        <el-image
            v-for="(item, i) in imgList"
            :key="i"
            :src="item"
            fit="cover"
            class="u-img"
            :class="{ text: i == 1, show }"
            @click="showText"
        />
    </div>
</template>
<script>
export default {
    name: "cardDragonBoat",
    props: ["data"],
    computed: {
        countImg() {
            return this.data.countImg;
        },
        imgList() {
            return this.data.imgList;
        },
    },
    data() {
        return {
            list: ["bg", "text", "cover"],
            show: false,
        };
    },
    methods: {
        close() {
            this.$emit("close");
        },
        showText() {
            this.show ? this.close() : (this.show = true);
        },
    },
};
</script>
<style lang="less" scope>
.cardDragonBoat {
    .pr;
    .size(282px,100%);
    .auto(x);
    .u-count {
        .pa;
        .size(30px,82px);
        .lt(0,50%);
        .z(3);
        opacity: 0;
        margin: -174px 0 0 84px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 23px auto;
        transition: all 0.8s ease-in-out;
        &.show {
            opacity: 1;
        }
    }
    .u-img {
        .pa;
        .pointer;
        .size(282px,640px);
        .lt(0,50%);
        .mt(-320px);
        transition: all 0.3s ease-in-out;
        &.mark {
            .none;
            .z(1);
            .tm(0.5);
            background: #000;
            &.show {
                .db;
            }
        }
        &.text {
            .size(213px,610px);
            .mt(-305px);
            .ml(22px);
            &.show {
                .z(2);
                margin: -305px 0 0 50px;
            }
        }
    }
    &:hover {
        .u-img:not(.show).text {
            .ml(-12px);
        }
    }
}
</style>
