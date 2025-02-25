<template>
    <AppLayout>
        <div class="m-main">
            <template v-if="treasureInfo.team_certificate">
                <div class="u-title m-hide">{{ treasureInfo.team_certificate.rank_name }}</div>
                <div class="u-time m-hide">获得时间：{{ treasureInfo.team_certificate.awardtime }}</div>
                <el-image class="u-img" :fit="'contain'" :src="treasureImg" :preview-src-list="[treasureImg]">
                </el-image>
                <button @click="print" class="u-btn m-hide el-button el-button--primary">打印证书</button>
            </template>

            <canvas id="canvas" ref="canvas"></canvas>
        </div>
    </AppLayout>
</template>

<script>
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import AppLayout from "@/layouts/author/AppLayout.vue";
import { getCertification } from "@/service/author/cms";
import CI from "@/assets/data/author/certificate.json";
export default {
    name: "Author",
    components: { AppLayout },
    props: [],
    data: function () {
        return {
            drawConfig: {},
            drawCtx: {},
            treasureImg: "",
            exportImgTime: "",
            treasureInfo: false,
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
            if (!this.id) return;
            getCertification(this.id)
                .then((res) => {
                    this.treasureInfo = res.data.data;
                    const { team_certificate } = res.data.data;
                    let {
                        rank_id,
                        time,
                        team_name,
                        sort_no,
                        teammate,
                        awardtime,
                        leader,
                        duration,
                        team_server,
                        rank_name,
                    } = team_certificate;
                    let drawConfig = CI[rank_id];
                    let { element } = drawConfig;

                    element.mapTime.content = this.formatTimeString(element.mapTime.content, time);
                    element.name.content = team_name;
                    element.rank.content = sort_no;
                    element.team.content = teammate;
                    if (element.colonel) {
                        element.colonel.content = `团长：${leader}`;
                    }
                    if (element.signTime) {
                        element.signTime.content = this.formatTimeString(element.signTime.content, awardtime);
                    }
                    if (element.time) {
                        element.time.content = this.takeTimeCalc(element.time.content, duration);
                    }
                    if (element.server) {
                        element.server.content = team_server;
                    }
                    if (element.qrSubTitle) {
                        element.qrSubTitle.content = rank_name;
                    } else if (element.mapName) {
                        element.mapName.content = `副本名称：${rank_name}`;
                    }
                    this.drawConfig = drawConfig;
                    this.draw();
                })
                .catch((err) => {
                    console.log(err);
                    this.$router.push({ name: "index" });
                });
        },
        draw() {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            this.drawCtx = ctx;
            this.loadDrawImage(this.drawConfig.key, "bg").then((img) => {
                const targetWidth = 1280; // 目标宽度
                const aspectRatio = img.width / img.height;
                const targetHeight = targetWidth / aspectRatio;
                this.$refs.canvas.width = targetWidth;
                this.$refs.canvas.height = targetHeight;
                this.$nextTick(() => {
                    this.drawImg(img, 0, 0, canvas.width, canvas.height);
                    for (const key in this.drawConfig.element) {
                        let item = this.drawConfig.element[key];
                        if (item.style) {
                            if (item.type == "text") {
                                item.key = key;
                                this.drawText(ctx, item);
                            } else if (item.type == "rank") {
                                this.drawRank(item);
                            } else if (item.type == "qr") {
                                this.drawQr(ctx, item);
                            }
                        }
                    }
                });
            });
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
                if (this.drawConfig.element.colonel) {
                    if (name == this.treasureInfo.team_certificate.leader) {
                        continue;
                    }
                }
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
        drawRank(data) {
            let imgType = 1;
            let rankSrc = "";
            let numArray = [];
            if (data.content == 1) {
                rankSrc = "first";
            } else if (data.content == 2) {
                rankSrc = "second";
            } else if (data.content == 3) {
                rankSrc = "third";
            } else if (data.content == 100) {
                imgType = 3;
                numArray = [1, 100];
            } else if (data.content == null) {
                rankSrc = "hundred";
            } else if (data.content <= 10) {
                imgType = 2;
                rankSrc = data.content;
            } else if (data.content > 10) {
                imgType = 3;
                numArray = data.content
                    .toString()
                    .split("")
                    .map((num) => (num === "0" ? 10 : parseInt(num)));
            }
            if (imgType == 1) {
                this.loadDrawImage(rankSrc).then((img) => {
                    const targetWidth = data.style.topWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(img, data.style.left - targetWidth / 2, data.style.top, targetWidth, targetHeight);
                    } else if (data.style.type == "left") {
                        this.drawImg(img, data.style.left, data.style.top, targetWidth, targetHeight);
                    }
                });
            } else if (imgType == 2) {
                this.loadDrawImage("before").then((img) => {
                    const targetWidth = data.style.otherWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(
                            img,
                            data.style.left - targetWidth * 1.5 - data.style.spaceWidth,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    } else if (data.style.type == "left") {
                        this.drawImg(img, data.style.left, data.style.top, targetWidth, targetHeight);
                    }
                });
                this.loadDrawImage("after").then((img) => {
                    const targetWidth = data.style.otherWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(
                            img,
                            data.style.left + targetWidth / 2 + data.style.spaceWidth,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    } else if (data.style.type == "left") {
                        this.drawImg(
                            img,
                            data.style.left + targetWidth * 2 + data.style.spaceWidth * 2,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    }
                });
                this.loadDrawImage(rankSrc).then((img) => {
                    const targetWidth = data.style.otherWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(img, data.style.left - targetWidth / 2, data.style.top, targetWidth, targetHeight);
                    } else if (data.style.type == "left") {
                        this.drawImg(
                            img,
                            data.style.left + targetWidth + data.style.spaceWidth,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    }
                });
            } else if (imgType == 3) {
                this.loadDrawImage("before").then((img) => {
                    const targetWidth = data.style.otherWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(
                            img,
                            data.style.left - targetWidth * 2 - data.style.spaceWidth,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    } else if (data.style.type == "left") {
                        this.drawImg(img, data.style.left, data.style.top, targetWidth, targetHeight);
                    }
                });
                this.loadDrawImage("after").then((img) => {
                    const targetWidth = data.style.otherWidth; // 目标宽度
                    const aspectRatio = img.width / img.height;
                    const targetHeight = targetWidth / aspectRatio;
                    if (data.style.type == "center") {
                        this.drawImg(
                            img,
                            data.style.left + targetWidth + data.style.spaceWidth,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    } else if (data.style.type == "left") {
                        this.drawImg(
                            img,
                            data.style.left + targetWidth * 3 + data.style.spaceWidth * 3,
                            data.style.top,
                            targetWidth,
                            targetHeight
                        );
                    }
                });
                numArray.map((item, index) => {
                    this.loadDrawImage(item).then((img) => {
                        const targetWidth = data.style.otherWidth; // 目标宽度
                        const aspectRatio = img.width / img.height;
                        const targetHeight = targetWidth / aspectRatio;
                        if (data.style.type == "center") {
                            this.drawImg(
                                img,
                                data.style.left -
                                    targetWidth -
                                    data.style.spaceWidth / 2 +
                                    index * (targetWidth + data.style.spaceWidth / 2),
                                data.style.top,
                                targetWidth,
                                targetHeight
                            );
                        } else if (data.style.type == "left") {
                            this.drawImg(
                                img,
                                data.style.left +
                                    targetWidth +
                                    data.style.spaceWidth +
                                    index * (targetWidth + data.style.spaceWidth),
                                data.style.top,
                                targetWidth,
                                targetHeight
                            );
                        }
                    });
                });
            }
        },
        loadDrawImage(src, type = "rank") {
            const newImg = new Image();
            newImg.setAttribute("crossOrigin", "anonymous");
            newImg.src = this.getImgPath(src, type);
            return new Promise((resolve, reject) => {
                newImg.onload = () => {
                    resolve(newImg);
                };
            });
        },
        drawQr(ctx, data) {
            this.loadDrawImage(null, "qr").then((img) => {
                this.drawImg(img, 150, 1490, 100, 100);
            });
        },
        drawImg(img, left, top, width, height) {
            this.drawCtx.drawImage(img, left, top, width, height);
            this.canvasExport();
        },
        getImgPath(id, type) {
            let imgUrl = "";
            if (type == "bg") {
                imgUrl = `${__cdn}/design/certification/CertBG_jdt${id < 10 ? "0" + id : id}.png`;
            } else if (type == "rank") {
                imgUrl = require(`@/assets/img/author/cert/${this.drawConfig.key}/rank/${id}.png`);
            } else if (type == "qr") {
                imgUrl = require(`@/assets/img/author/cert/${this.treasureInfo.team_certificate.rank_id}/qr.png`);
            }
            return imgUrl;
        },
        canvasExport() {
            clearTimeout(this.exportImgTime);
            const canvas = document.getElementById("canvas");
            this.exportImgTime = setTimeout(() => {
                this.treasureImg = canvas.toDataURL("image/png");
            }, 100);
        },
        takeTimeCalc(timeString, seconds) {
            let hours = Math.floor(seconds / 3600);
            let minutes = Math.floor((seconds % 3600) / 60);
            let remainingSeconds = seconds % 60;
            timeString = timeString.replace(/hh/, hours).replace(/mm/, minutes).replace(/ss/, remainingSeconds);
            return timeString;
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
        .w(400px);
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
