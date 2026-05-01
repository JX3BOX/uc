<template>
    <div class="cardLantern">
        <div class="u-lanternFestival-card" :class="show ? 'u-card-on' : 'u-card-off'" @click="change">
            <img class="u-card-bg" :src="imgList[0]" alt="元宵节快乐!" />
            <img class="u-card-bg02" :src="imgList[1]" alt="元宵节快乐!" />
            <img class="u-card-button" :src="imgList[2]" alt="元宵节快乐!" />
            <img class="u-card-icon" :src="imgList[3]" alt="元宵节快乐!" />
            <img class="u-card-icon02" :src="imgList[4]" alt="元宵节快乐!" />
            <img class="u-card-content" :src="imgList[5]" alt="元宵节快乐!" />
            <div class="u-card-count">{{ fontCount }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: "cardLantern",
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
            if (this.show) {
                this.$emit("close");
            }
            this.show = !this.show;
        },
    },
};
</script>
<style lang="less" scope>
.cardLantern {
    display: flex;
    align-items: center;
    justify-content: center;
    .h(100%);
    margin: 0 auto;
    .u-lanternFestival-card {
        .pr;
        zoom: 0.5;
        .pointer;

        .u-card-bg02,
        .u-card-button,
        .u-card-icon,
        .u-card-icon02,
        .u-card-content,
        .u-card-count {
            .pa;
        }

        .u-card-bg02 {
            top: 0;
            right: 0;
        }

        .u-card-button {
            .lt(50%, 50%);
            transform: translate(-50%, -50%);
            z-index: 100;
            transition: all 0.5s;
        }
        .u-card-icon,
        .u-card-icon02,
        .u-card-content,
        .u-card-count {
            opacity: 0;
            transition: all 1.8s;
        }
        .u-card-icon {
            .rt(0, 343px);
        }
        .u-card-icon02 {
            .lt(0%, 643px);
        }
        .u-card-content {
            .lt(27px, 1134px);
        }
        .u-card-count {
            .fz(65px);
            .lt(216px, 1264px);
        }
    }
    .u-card-off {
        .u-card-button {
            animation: twinkle 3s ease-out 0s infinite;
        }
    }
    .u-card-on {
        .u-card-button {
            opacity: 0;
        }
        .u-card-icon,
        .u-card-icon02,
        .u-card-content,
        .u-card-count {
            opacity: 1;
        }
        .u-card-icon02 {
            transition-delay: 0.5s;
        }
        .u-card-content,
        .u-card-count {
            transition-delay: 1s;
        }
        .u-card-count {
            animation: twinkle 1.5s ease-out 5s infinite;
        }
    }
}

@media screen and (max-width: @phone) {
    .cardLantern .u-lanternFestival-card {
        zoom: 0.4;
    }
}
</style>
