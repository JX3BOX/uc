<template>
    <div class="m-scratch-surface" @touchstart.prevent="start" @touchmove.prevent="move"
        @touchend="end" @touchcancel="end" @mousedown.prevent="start" @mousemove.prevent="move"
        @mouseup="end" @mouseleave="end">
        <slot />
        <canvas ref="canvas" class="u-surface-mask" aria-label="用手滑动刮开卡片"></canvas>
    </div>
</template>

<script>
export default {
    props: { cover: String },
    emits: ["complete"],
    mounted() {
        this.finished = new Set();
        this.paint();
        this.coverImage = new Image();
        this.coverImage.crossOrigin = "anonymous";
        this.coverImage.onload = () => {
            if (!this.disposed) this.paint(true);
        };
        this.coverImage.src = this.cover;
        window.addEventListener("resize", this.resize);
    },
    beforeUnmount() {
        this.disposed = true;
        window.removeEventListener("resize", this.resize);
        this.coverImage.onload = null;
    },
    methods: {
        resize() { this.paint(true); },
        paint(preserve = false) {
            const canvas = this.$refs.canvas;
            if (!canvas) return;
            const previous = document.createElement("canvas");
            previous.width = canvas.width;
            previous.height = canvas.height;
            previous.getContext("2d").drawImage(canvas, 0, 0);
            const rect = this.$el.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.round(rect.width * dpr));
            canvas.height = Math.max(1, Math.round(rect.height * dpr));
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            this.regions = Array.from(this.$el.querySelectorAll("[data-scratch-card]")).map((el) => {
                const box = el.getBoundingClientRect();
                return { x: (box.left - rect.left) * dpr, y: (box.top - rect.top) * dpr,
                    width: box.width * dpr, height: box.height * dpr };
            });
            this.regions.forEach(({ x, y, width, height }, index) => {
                if (this.finished.has(index)) return;
                ctx.save();
                const radius = Math.min(12 * dpr, width / 2, height / 2);
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.arcTo(x + width, y, x + width, y + height, radius);
                ctx.arcTo(x + width, y + height, x, y + height, radius);
                ctx.arcTo(x, y + height, x, y, radius);
                ctx.arcTo(x, y, x + width, y, radius);
                ctx.closePath();
                ctx.clip();
                ctx.fillStyle = "#9480e6";
                ctx.fillRect(x, y, width, height);
                if (this.coverImage?.naturalWidth) ctx.drawImage(this.coverImage, x, y, width, height);
                ctx.restore();
            });
            if (preserve) {
                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(previous, 0, 0, canvas.width, canvas.height);
            }
            ctx.globalCompositeOperation = "destination-out";
        },
        position(event) {
            const canvas = this.$refs.canvas;
            const rect = canvas.getBoundingClientRect();
            const point = event.touches?.[0] || event;
            return { x: (point.clientX - rect.left) * canvas.width / rect.width,
                y: (point.clientY - rect.top) * canvas.height / rect.height };
        },
        start(event) {
            if (this.finished.size === this.regions.length) return;
            if (event.type === "touchstart") this.lastTouch = Date.now();
            if (event.type === "mousedown" && (event.button !== 0 || Date.now() - (this.lastTouch || 0) < 700)) return;
            this.last = this.position(event);
            this.drawing = true;
        },
        move(event) {
            if (!this.drawing) return;
            const point = this.position(event);
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            // 刮层与结果加载独立，接口返回时保留当前画布和刮痕。
            ctx.save();
            ctx.beginPath();
            this.regions.forEach(({ x, y, width, height }) => {
                ctx.rect(x, y, width, height);
            });
            ctx.clip();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 38 * canvas.width / canvas.getBoundingClientRect().width;
            ctx.beginPath();
            ctx.moveTo(this.last.x, this.last.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.restore();
            this.last = point;
        },
        end() {
            if (!this.drawing) return;
            this.drawing = false;
            const ctx = this.$refs.canvas.getContext("2d");
            this.regions.forEach(({ x, y, width, height }, index) => {
                if (this.finished.has(index)) return;
                const pixels = ctx.getImageData(Math.ceil(x), Math.ceil(y), Math.floor(width), Math.floor(height)).data;
                let transparent = 0, total = 0;
                for (let i = 3; i < pixels.length; i += 40) {
                    total++;
                    if (pixels[i] < 32) transparent++;
                }
                if (transparent / total > 0.45) {
                    ctx.clearRect(x, y, width, height);
                    this.finished.add(index);
                }
            });
            if (this.finished.size === this.regions.length) this.$emit("complete");
        },
    },
};
</script>

<style scoped>
.m-scratch-surface { position: relative; touch-action: none; user-select: none; }
.u-surface-mask { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; }
</style>
