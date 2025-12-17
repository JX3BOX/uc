<template>
    <div class="newYearsDay" @click.stop>
        <div @click="change" class="newYearsDay-card" :class="show ? 'newYearsDay-card__on' : 'newYearsDay-card__off'">
            <!-- v-if="!show" -->
            <img class="newYearsDay-card__img newYearsDay-card__cover" :src="imgList[0]" alt="元旦节快乐" />
            <img class="newYearsDay-card__img newYearsDay-card__content" :src="imgList[1]" alt="元旦节快乐" />
            <img class="newYearsDay-card__click" v-if="!show" :src="imgList[2]" />
            <img class="newYearsDay-card__close" @click.stop="close" :src="imgList[3]" />
            <span class="newYearsDay-card__fontCount">{{ fontCount }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "newYearsDay",
    props: ["data"],
    computed: {
        fontCount() {
            return this.data.fontCount;
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
.newYearsDay {
    display: flex;
    align-items: center;
    justify-content: center;
    .h(100%);
    margin: 0 auto;

    .newYearsDay-card {
        .pr;
        .pointer;

        .newYearsDay-card__img {
            .size(auto, 70vh) !important;
            transition: all 1s;
            box-sizing: 10px 10px 10px #eee;
        }

        .newYearsDay-card__fontCount,
        .newYearsDay-card__close {
            opacity: 0;
            transition: all 2s;
        }

        .newYearsDay-card__fontCount {
            .pa;
            .lt(45%, 35%);
            transform: translate(-45%, -5%);
            font-size: 23px;
            color: #cea062;
        }

        .newYearsDay-card__click {
            .pa;
            .lt(50%, 68%);
            .w(8%) !important;
            transform: translate(-50%, -68%);
            animation: twinkle 2s ease-out 0s infinite;
            z-index: 30;
        }

        .newYearsDay-card__close {
            .pa;
            .lt(88%, 95%);
            .w(45%) !important;
            transform: translate(-90%, -90%);
        }
    }

    .newYearsDay-card__off {
        .newYearsDay-card__close,
        .newYearsDay-card__content {
            z-index: -1;
        }

        .newYearsDay-card__content {
            .pa;
            .lt(50%, 50%);
            transform: translate(-50%, -50%);
            opacity: 0;
        }
    }

    .newYearsDay-card__off:hover {
        .newYearsDay-card__content {
            .lt(13%, -3%);
            transform: translate(-20%, 0%);
            opacity: 1;
        }
    }

    .newYearsDay-card__on {
        .newYearsDay-card__cover {
            .pa;
            .lt(13%, -3%);
            transform: translate(-20%, 0%);
            z-index: -1;
        }

        .newYearsDay-card__close,
        .newYearsDay-card__fontCount {
            opacity: 1;
        }
    }
}

@media screen and (max-width: @phone) {
    .newYearsDay-card__fontCount {
        font-size: 18px !important;
    }
}
</style>
