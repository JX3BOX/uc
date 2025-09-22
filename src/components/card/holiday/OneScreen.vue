<template>
    <div class="OneScreen" @click.stop>
        <div class="m-card animation a-zoomInDown" :class="text ? 'm-duanwu' : ''">
            <img :src="imgLink" :alt="text" />
            <span class="u-count">{{ fontCount }}</span>
            <span class="u-user">{{ user }}</span>
            <span class="u-close" @click="close"><i class="el-icon-close"></i> <span>关闭</span></span>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "oneScreen",
    props: ["data"],
    data: function () {
        return {
            visible: true,
        };
    },
    computed: {
        fontCount() {
            return this.data.fontCount;
        },
        imgLink() {
            return this.data.imgLink;
        },
        text() {
            return this.data.text;
        },
        user() {
            return User.getInfo().name;
        },
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style lang="less" scope>
.OneScreen {
    .pf;
    .full;
    .lt(0, 0);
    .z(10);
    background-color: rgba(36, 41, 46, 0.8);
    .m-card {
        .size(400px, 600px);
        // display: flex;
        // align-items: center;
        // justify-content: center;
        .pa;
        .lt(50%, 50%);
        transform: translate(-50%, -50%);
    }
    .u-close {
        .pa;
        .rt(0, -30px);
        .db;
        .x;
        .fz(12px, 1.8em);
        text-align: right;
        color: #3d454d;
        text-shadow: -1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff;
        .pointer;
    }
    img {
        user-select: none;
        box-shadow: 0px 0px 20px #000;
    }
    .u-count {
        position: absolute;
        right: 208px;
        bottom: 32px;
        font-size: 64px;
        color: #ffc04a;
        text-shadow: 2px 2px 0 #fff;
        font-family: "comic sans ms";
    }
    .m-duanwu {
        .u-user,
        .u-count {
            .db;
            .pa;
            .x;
            .break;
            .fz(18px);
            font-family: "KaiTi,Microsoft YaHei";
            writing-mode: vertical-rl;
            color: #a00e22;
            text-shadow: 0;
        }
        .u-user {
            .lt(166px,108px);
        }
        .u-count {
            .lt(132px,296px);
            .rb(auto);
            .h(70px);
            text-align: center;
        }
    }
}

/* 动画 */
.animation {
    -webkit-animation-duration: 1.5s;
    animation-duration: 1.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.a-zoomInDown {
    -webkit-animation-name: zoomInDown;
    animation-name: zoomInDown;
}
.a-jackInTheBox {
    -webkit-animation-name: jackInTheBox;
    animation-name: jackInTheBox;
}
.a-flipInX {
    -webkit-backface-visibility: visible !important;
    backface-visibility: visible !important;
    -webkit-animation-name: flipInX;
    animation-name: flipInX;
}

@keyframes zoomInDown {
    0% {
        opacity: 0;
        -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
        transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
        -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    60% {
        opacity: 1;
        -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
        transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
        -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
}

@keyframes jackInTheBox {
    0% {
        opacity: 0;
        -webkit-transform: scale(0.1) rotate(30deg);
        transform: scale(0.1) rotate(30deg);
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
    }
    50% {
        -webkit-transform: rotate(-10deg);
        transform: rotate(-10deg);
    }
    70% {
        -webkit-transform: rotate(3deg);
        transform: rotate(3deg);
    }
    to {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}
@keyframes flipInX {
    0% {
        -webkit-transform: perspective(400px) rotateX(90deg);
        transform: perspective(400px) rotateX(90deg);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
        opacity: 0;
    }
    40% {
        -webkit-transform: perspective(400px) rotateX(-20deg);
        transform: perspective(400px) rotateX(-20deg);
        -webkit-animation-timing-function: ease-in;
        animation-timing-function: ease-in;
    }
    60% {
        -webkit-transform: perspective(400px) rotateX(10deg);
        transform: perspective(400px) rotateX(10deg);
        opacity: 1;
    }
    80% {
        -webkit-transform: perspective(400px) rotateX(-5deg);
        transform: perspective(400px) rotateX(-5deg);
    }
    to {
        -webkit-transform: perspective(400px);
        transform: perspective(400px);
    }
}
</style>
