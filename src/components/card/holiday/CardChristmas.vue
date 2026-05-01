<template>
    <div class="cardChristmas" @click.stop>
        <div class="christmas-card" @click="change">
            <template v-if="!show">
                <img class="christmas-card__img" :src="imgList[0]" alt="圣诞节快乐" />
                <img class="christmas-card__open" :src="imgList[1]" alt="圣诞节快乐" />
            </template>
            <div v-else :style="`background:url(${imgList[2]}) top center no-repeat;background-size: cover;`">
                <img
                    @click.stop="close"
                    class="animation christmas-card__content christmas-card__img"
                    :class="show ? 'flipInY' : ''"
                    :src="countImg"
                    alt="圣诞节快乐"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "cardChristmas",
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
.cardChristmas {
    display: flex;
    align-items: center;
    justify-content: center;
    .h(100%);
    margin: 0 auto;

    .christmas-card {
        .pr;
        .pointer;

        .christmas-card__img {
            .size(auto, 80vh) !important;
        }

        .christmas-card__open {
            .pa;
            .lt(50%, 92%);
            .w(35%) !important;
            transform: translate(-50%, -92%);
            animation: twinkle 2s ease-out 0s infinite;
        }
    }
}

@media screen and (max-width: @phone) {
    .christmas {
        padding: 0;

        .christmas-card {
            .christmas-card__img {
                .size(auto, 60vh) !important;
            }
        }
    }
}
</style>
