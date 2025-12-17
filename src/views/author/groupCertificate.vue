<template>
    <AppLayout>
        <div class="m-main">
            <el-image class="u-img" :fit="'contain'" :src="treasureImg" :preview-src-list="[treasureImg]"> </el-image>
            <button @click="print" class="u-btn m-hide el-button el-button--primary">打印证书</button>

            <canvas id="canvas" ref="canvas"></canvas>
        </div>
    </AppLayout>
</template>

<script>
import { __cdn } from "@/utils/config";
import AppLayout from "@/layouts/author/AppLayout.vue";
import tianTuanCertificateCode from "@/assets/data/author/tianTuan_certificate_code.json";
import { getCertification } from "@/service/author/cms";
export default {
    name: "Author",
    components: { AppLayout },
    props: [],
    data: function () {
        return {
            drawCtx: {},
            treasureImg: "",
            treasureInfo: false,
            contentData: {},
            tianTuanCertificateCode,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                val ? this.load() : this.$router.push({ name: "index" });
            },
        },
    },
    methods: {
        load() {
            if (!this.id) return
            getCertification(this.id).then((res) => {
                this.contentData = res.data.data;
                this.draw();
            });
        },
        draw() {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            this.drawCtx = ctx;
            this.$refs.canvas.width = 1520;
            this.$refs.canvas.height = 1060;
            const newImg = new Image();
            newImg.setAttribute("crossOrigin", "anonymous");
            newImg.src = require("@/assets/img/author/groupCertificate/bg.png");
            newImg.onload = () => {
                this.drawImg(newImg, 0, 0, 1520, 1060);
                // 团队名
                this.drawText(ctx, {
                    type: "text",
                    content: this.contentData.team_certificate.team_name,
                    style: {
                        textAlign: "center",
                        fontSize: 36,
                        left: 712,
                        top: 479,
                        color: "#756538",
                    },
                });
                // 门派/心法
                this.drawText(ctx, {
                    type: "text",
                    content: this.tianTuanCertificateCode[this.contentData.team_certificate.sort_no],
                    style: {
                        textAlign: "center",
                        fontSize: 36,
                        left: 981,
                        top: 545,
                        color: "#756538",
                    },
                });
                // 团队
                this.drawText(ctx, {
                    type: "text",
                    content: this.contentData.team_certificate.teammate,
                    key: "team",
                    style: {
                        textAlign: "left",
                        fontSize: 17,
                        left: 262,
                        top: 640,
                        color: "#756538",
                        width: 996,
                        height: 27,
                    },
                });
                // 赛事组
                this.drawText(ctx, {
                    type: "text",
                    content: "剑网3魔盒门派天团赛事组",
                    style: {
                        textAlign: "right",
                        fontSize: 28,
                        left: 1257,
                        top: 810,
                        color: "#000000",
                    },
                });
                // 时间
                this.drawText(ctx, {
                    type: "text",
                    content: this.formatTimeString("yyyy年MM月dd日", this.contentData.team_certificate.time),
                    style: {
                        textAlign: "right",
                        fontSize: 28,
                        left: 1257,
                        top: 850,
                        color: "#000000",
                    },
                });

                this.canvasExport();
            };
        },
        loadDrawImage(src) {
            const newImg = new Image();
            newImg.setAttribute("crossOrigin", "anonymous");
            newImg.src = require(src);
            return new Promise((resolve, reject) => {
                newImg.onload = () => {
                    resolve(newImg);
                };
            });
        },
        drawImg(img, left, top, width, height) {
            this.drawCtx.drawImage(img, left, top, width, height);
        },
        drawText(ctx, data) {
            let style = data.style;
            ctx.font = `${style.fontSize}px Arial`;
            ctx.textAlign = style.textAlign;
            ctx.fillStyle = style.color;
            if (data.key != "team") {
                ctx.fillText(data.content, style.left, style.top);
            } else {
                this.drawWrappedText(ctx, data.content, style);
            }
        },
        drawWrappedText(ctx, text, style) {
            let words = text.split(";");
            let line = "";
            for (let i = 0; i < words.length; i++) {
                let name = words[i].split(",")[0];
                let testLine = line + name;
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > style.width && i > 0) {
                    ctx.fillText(line, style.left, style.top);
                    line = name += "，";
                    style.top += style.height;
                } else {
                    testLine += "，";
                    line = testLine;
                }
            }
            ctx.fillText(line, style.left, style.top);
        },
        canvasExport() {
            clearTimeout(this.exportImgTime);
            const canvas = document.getElementById("canvas");
            this.exportImgTime = setTimeout(() => {
                this.treasureImg = canvas.toDataURL("image/png");
            }, 100);
        },
        formatTimeString(timeString, dateTimeString) {
            const date = new Date(dateTimeString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");
            timeString = timeString
                .replace(/yyyy/, year)
                .replace(/MM/, month)
                .replace(/dd/, day)
                .replace(/hh/, hours)
                .replace(/mm/, minutes)
                .replace(/ss/, seconds);
            return timeString;
        },
        print() {
            window.print();
        },
    },
};
</script>

<style lang="less" scoped>
.m-main {
    &::after {
        content: "";
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #24292e;
        z-index: -1;
    }
    .mt(@header-height);
    .pt(50px);
    .pb(50px);
    .x();
    .u-title {
        .fz(28px);
        .bold();
        .color(#ffffff);
    }
    .u-time {
        .mt(10px);
        .fz(14px);
        .color(#999999);
    }
    .u-img {
        .db();
        .w(800px);
        .pointer();
        margin: 0 auto;
        .mt(10px);
        box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.1);
        .r(5px);
    }
    #canvas {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        transform: translateX(-110%) translateY(-110%);
    }
    .u-btn {
        .db();
        .w(200px);
        margin: 0 auto;
        .mt(50px);
    }
}
@media print {
    .c-header {
        .none();
    }
    .m-main {
        margin: 0;
        padding: 0;
        &::after {
            .none();
        }

        .u-img {
            .w(auto);
            margin: 0;
        }
    }
    .m-hide {
        .none() !important;
    }
}
</style>
