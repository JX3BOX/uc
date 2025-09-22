<template>
    <div class="cardChildren" @click.stop>
        <div class="children-card" @click="change">
            <template v-if="!show">
                <img :class="`children-card__img animation ${show ? '' : 'fadeInUp'}`" :src="bgImg" />
                <div :class="`u-img animation ${show ? '' : 'fadeInDown'}`">
                    <img class="children-card__open" :src="buttonImg" />
                </div>
            </template>
            <div v-else @click.stop="close">
                <img class="children-card__img animation" :class="show ? 'flipInY' : ''" :src="bg2Img" />
                <img class="animation children-card__content" :class="show ? 'flipInY' : ''" :src="countImg" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "CardChildren",
    props: ["data"],
    computed: {
        bgImg() {
            return this.data.bgImg;
        },
        bg2Img() {
            return this.data.bg2Img;
        },
        buttonImg() {
            return this.data.buttonImg;
        },
        countImg() {
            return this.data.countImg;
        },
    },
    data() {
        return {
            show: false,
        };
    },
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
.cardChildren {
    .pr;
    display: flex;
    align-items: center;
    justify-content: center;
    .h(100%);
    margin: 0 auto;

    .children-card {
        .pr;
        .pointer;

        .children-card__img {
            .size(auto, 80vh) !important;
        }
        .u-img {
            .pa;
            .flex;
            .w(100%);
            .lt(0,78%);
            justify-content: center;
            &.animation {
                -webkit-animation-duration: 1.5s;
                animation-duration: 1.5s;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
            }
        }
        .children-card__open {
            .w(35%) !important;
            animation: twinkle 2s ease-out 0s infinite;
        }
        .children-card__content {
            .pa;
            .lb(0);
        }
    }
}

@media screen and (max-width: @phone) {
    .children {
        padding: 0;

        .children-card {
            .children-card__img {
                .size(auto, 60vh) !important;
            }
        }
    }
}
</style>
