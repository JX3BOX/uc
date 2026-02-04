<template>
    <div class="m-lamp">
        <div class="lamp-item" v-for="i in 12" :key="i">
            <img :class="getImgClass(i)" :src="getImgSrc(i)" alt="lamp" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Lamp",
    props: {
        imgPath: { type: String, default: "" },
        reward: { type: Boolean, default: false },
        once: { type: Boolean, default: false },
    },
    data() {
        return {
            flashToggle: 0,
            activeIndex: 0,
            timer: null,
            animDuration: {
                flash: 1000,
                marquee: 70,
                fullFlash: 800,
            },
        };
    },
    watch: {
        once: {
            immediate: true,
            handler() {
                this.initAnimation();
            },
        },
        reward: {
            immediate: true,
            handler() {
                this.initAnimation();
            },
        },
    },
    beforeUnmount() {
        this.clearTimer();
    },
    destroyed() {
        this.clearTimer();
    },
    methods: {
        initAnimation() {
            this.clearTimer();
            let interval = 0;

            if (this.once) {
                interval = this.animDuration.fullFlash;
                this.timer = setInterval(() => {
                    this.flashToggle = this.flashToggle ? 0 : 1;
                }, interval);
            } else if (this.reward) {
                interval = this.animDuration.marquee;
                this.timer = setInterval(() => {
                    this.activeIndex = (this.activeIndex + 1) % 12;
                }, interval);
            } else {
                interval = this.animDuration.flash;
                this.timer = setInterval(() => {
                    this.flashToggle = this.flashToggle ? 0 : 1;
                }, interval);
            }
        },
        clearTimer() {
            this.timer && clearInterval(this.timer);
            this.timer = null;
        },
        getImgSrc(index) {
            const base = this.imgPath;
            if (this.once) {
                return this.flashToggle ? `${base}light12.png?1` : `${base}light11.png`;
            }
            if (this.reward) {
                return this.activeIndex + 1 === index ? `${base}light12.png?1` : `${base}light11.png`;
            }
            const isOdd = index % 2 === 1;
            return isOdd
                ? this.flashToggle
                    ? `${base}light02.png`
                    : `${base}light01.png`
                : this.flashToggle
                ? `${base}light01.png`
                : `${base}light02.png`;
        },
        getImgClass(index) {
            if (this.once) {
                return this.flashToggle ? "img4" : "img3";
            }
            if (this.reward) {
                return this.activeIndex + 1 === index ? "img4" : "img3";
            }
            const isOdd = index % 2 === 1;
            return isOdd ? (this.flashToggle ? "img2" : "img1") : this.flashToggle ? "img1" : "img2";
        },
    },
};
</script>

<style lang="less" scoped>
.m-lamp {
    display: flex;
    align-items: center;

    .lamp-item {
        margin-top: 10px;
        flex-shrink: 0;
    }

    img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }
}

.img1,
.img2,
.img3,
.img4 {
    transition: all 0.05s ease;
}
</style>
