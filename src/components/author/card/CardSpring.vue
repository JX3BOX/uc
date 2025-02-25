<template>
    <div :class="year ? 'cardSpringYear' : 'cardSpring'" @click.stop>
        <div class="u-springFestival-card" v-if="year" :class="show ? 'u-card-on' : 'u-card-off'" @click="change">
            <img class="u-card-bg" :src="bg" alt="新年快乐" />
            <img class="u-card-cover" :src="cover" alt="新年快乐" />
            <img class="u-card-button" :src="button" alt="新年快乐" />
            <img class="u-card-content" :src="countImg" alt="新年快乐" />
        </div>
        <div class="u-springFestival-card fadeInUpBig p-animation" v-else>
            <div class="u-letter u-img m-animation" ref="letter" @click="close">
                <img class="u-img" :src="letter" alt="新年快乐" />
                <img class="u-img" :src="countImg" alt="新年快乐" />
            </div>
            <img class="u-cover u-img" ref="cover" :src="cover" alt="新年快乐" @click="open" />
        </div>
    </div>
</template>
<script>
export default {
    name: "cardSpring",
    props: ["data"],
    computed: {
        year() {
            return this.data.year;
        },
        cover() {
            return this.data.cover;
        },
        letter() {
            return this.data.letter;
        },
        countImg() {
            return this.data.countImg;
        },
        bg() {
            return this.data.bg;
        },
        button() {
            return this.data.button;
        },
    },
    data() {
        return {
            show: false,
            closeType: false,
        };
    },
    methods: {
        open() {
            const letter = this.$refs.letter;
            const cover = this.$refs.cover;
            cover.classList.add("click");
            letter.classList.add("fadeOutDownBig");
            letter.addEventListener(
                "animationend",
                () => {
                    letter.classList.remove("fadeOutDownBig");
                    letter.classList.add("fadeInDownBig");
                },
                { once: true }
            );
        },
        change() {
            if (this.show) {
                this.closeType = true;
                setTimeout(() => {
                    this.$emit("close");
                }, 1000);
            }
            this.show = !this.show;
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/author/animation.less";
.m-animation {
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
.cardSpring {
    .pf;
    .full;
    .lt(0);
    .u-springFestival-card {
        .pointer;
        .size(392px,720px);
        .ct(o,392px,720px);
        .u-img {
            .pa;
            .full;
            .lt(0);
            transition: all 0.5s;
        }
        &:hover {
            .u-letter {
                top: 5%;
            }
        }
        .u-cover {
            transition: all 1.5s;
            &.click {
                transform: rotate(5deg);
            }
        }
        .u-letter {
            .size(calc(100% - 8px));
            .ml(4px);
        }
        .u-letter.fadeInDownBig {
            .z(1);
            top: 0 !important;
        }
    }
}
@media screen and (min-width: @2k) {
    .cardSpring {
        .u-springFestival-card {
            .size(600px,1100px);
            .ct(o,600px,1100px);
        }
    }
}

.cardSpringYear {
    display: flex;
    align-items: center;
    justify-content: center;
    .h(100%);
    margin: 0 auto;
    .u-springFestival-card {
        .pr;
        .pointer;
        .u-card-bg,
        .u-card-cover,
        .u-card-content {
            height: 80vh;
        }
        .u-card-cover,
        .u-card-button,
        .u-card-content {
            .pa;
        }
        .u-card-cover {
            top: 0;
            right: 0;
            z-index: 100;
        }
        .u-card-content {
            top: 0;
            right: 5%;
            z-index: 50;
            transition: all 0.5s;
        }
        .u-card-button {
            opacity: 0;
            .lt(28%, -5%);
            transform: translate(-28%, -0%) scale(0.6);
            transition: all 0.5s;
        }
    }
    .u-card-off:hover {
        .u-card-button {
            opacity: 1;
        }
        .u-card-content {
            right: 10%;
        }
    }
    .u-card-on {
        .u-card-content {
            right: 45%;
        }
        .u-card-button {
            opacity: 0;
        }
    }
}
.u-card-close {
    opacity: 0;
    transition: all 1s;
}
@media screen and (max-width: @phone) {
    .cardSpringYear {
        .u-springFestival-card {
            .u-card-bg,
            .u-card-cover,
            .u-card-content {
                height: 70vh;
            }
            .u-card-button {
                opacity: 1;
                .lt(28%, -13%);
                transform: translate(-28%, -0%) scale(0.5);
            }
        }
    }
}
</style>
