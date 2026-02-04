<template>
    <div class="circle-container">
        <img
            :src="`${imgPath}egg${index > 3 ? index - 3 : index + 1}.svg`"
            class="circle"
            v-for="(pos, index) in currentPositions"
            :key="index"
            :style="{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                transform: `rotate(${index === 1 ? stepRotateDeg : randomDeg[index]}deg)`,
                transformOrigin: 'center center',
            }"
        />
    </div>
</template>

<script>
export default {
    name: "CircleFallEffect",
    props: {
        imgPath: {
            type: String,
            required: true,
        },
        reward: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const circleInitPositions = [
            { top: 10, left: 24 },
            { top: 10, left: 102 },
            { top: 10, left: 180 },
            { top: 69, left: 58 },
            { top: 70, left: 140 },
            { top: 95, left: -12 },
            { top: 76, left: 216 },
        ];
        const circleTargetPositions = [
            { top: 89, left: 36 },
            { top: 86, left: 98 },
            { top: 83, left: 180 },
            { top: 155, left: 72 },
            { top: 154, left: 146 },
            { top: 155, left: 10 },
            { top: 155, left: 194 },
        ];
        const finalPosForIndex1 = { top: 91, left: 108 };

        return {
            initPositions: circleInitPositions,
            circleTargetPositions,
            finalPosForIndex1,
            currentPositions: JSON.parse(JSON.stringify(circleInitPositions)), // 深拷贝隔离初始基准
            stepRotateDeg: 0,
            randomDeg: Array(7).fill(0),
            animationId: null,
            fallAnimationId: null,
            ballSpeeds: [],
            ballSize: 75,
            containerWidth: 284,
            containerHeight: 230,
            elasticity: 0.8,
            fallElasticity: 0.4,
            minSpeed: 2,
            gravity: 0.4,
            isFalling: false, // 新增：动画锁，防止重复触发
        };
    },

    mounted() {
        this.fallToTarget();
    },

    watch: {
        reward(newVal) {
            if (newVal) {
                this.startCollisionAnimation();
            } else {
                this.stopCollisionAndFall();
            }
        },
    },

    beforeUnmount() {
        this.stopCollisionAnimation();
        this.stopFallAnimation();
        this.isFalling = false;
    },

    methods: {
        fallToTarget() {
            if (this.isFalling) return;
            this.isFalling = true;
            const firstStepRandomDeg = this.randomDeg.map(() => Math.floor(Math.random() * 50) - 12);
            const firstStepStepRotate = -8;
            const secondStepStepRotate = 38;
            this.animateSmoothFall(
                JSON.parse(JSON.stringify(this.initPositions)),
                this.circleTargetPositions,
                JSON.parse(JSON.stringify(this.randomDeg)),
                firstStepRandomDeg,
                this.stepRotateDeg,
                firstStepStepRotate,
                800,
                () => {
                    const targetPos = this.currentPositions.map((pos, idx) =>
                        idx === 1 ? this.finalPosForIndex1 : { ...pos }
                    );
                    this.animateSmoothFall(
                        JSON.parse(JSON.stringify(this.currentPositions)),
                        targetPos,
                        JSON.parse(JSON.stringify(firstStepRandomDeg)),
                        firstStepRandomDeg,
                        firstStepStepRotate,
                        secondStepStepRotate,
                        500,
                        () => {
                            this.isFalling = false;
                        }
                    );
                }
            );
        },

        animateSmoothFall(fromPos, toPos, fromRandomDeg, toRandomDeg, fromStepRot, toStepRot, duration, callback) {
            const startTime = performance.now();
            const getLinearProgress = (progress) => progress;

            const animateStep = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const linearProgress = getLinearProgress(progress);

                const newPositions = fromPos.map((pos, idx) => {
                    const target = toPos[idx];
                    const topOffset = (target.top - pos.top) * linearProgress;
                    const leftOffset = (target.left - pos.left) * linearProgress;
                    return {
                        top: Math.round(pos.top + topOffset),
                        left: Math.round(pos.left + leftOffset),
                    };
                });
                this.currentPositions = newPositions;

                this.randomDeg = fromRandomDeg.map((deg, idx) => {
                    return deg + (toRandomDeg[idx] - deg) * linearProgress;
                });

                this.stepRotateDeg = fromStepRot + (toStepRot - fromStepRot) * linearProgress;

                if (progress < 1) {
                    this.animationId = requestAnimationFrame(animateStep);
                } else {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                    callback && callback();
                }
            };
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.animationId = requestAnimationFrame(animateStep);
        },

        stopCollisionAndFall() {
            this.stopCollisionAnimation();
            this.initFallState();
            this.animateVerticalFall();
        },

        initFallState() {
            if (!this.ballSpeeds.length) {
                this.ballSpeeds = Array(7)
                    .fill()
                    .map(() => ({ dx: 0, dy: 3, angularSpeed: (Math.random() - 0.5) * 0.8 }));
            } else {
                this.ballSpeeds = this.ballSpeeds.map((speed) => ({
                    dx: 0,
                    dy: speed.dy + this.gravity,
                    angularSpeed: speed.angularSpeed * 0.5,
                }));
            }
        },

        animateVerticalFall() {
            const circles = this.currentPositions.map((pos, index) => ({
                ...pos,
                index,
                radius: this.ballSize / 2,
            }));

            circles.forEach((circle, i) => {
                const speed = this.ballSpeeds[i];
                speed.dy += this.gravity;
                circle.top += speed.dy;

                if (circle.top >= this.containerHeight - this.ballSize) {
                    speed.dy = -speed.dy * this.fallElasticity;
                    circle.top = Math.min(circle.top, this.containerHeight - this.ballSize);
                    speed.angularSpeed += (Math.random() - 0.5) * 0.2;
                }

                this.randomDeg[i] += speed.angularSpeed * 0.6 + Math.abs(speed.dy) * 0.2;
                if (i === 1) this.stepRotateDeg += Math.abs(speed.dy) * 0.02;
            });

            this.currentPositions = circles.map(({ top, left }) => ({ top, left }));

            const isAllStop = this.ballSpeeds.every((speed, i) => {
                const circle = this.currentPositions[i];
                return Math.abs(speed.dy) < 0.25 && circle.top >= this.containerHeight - this.ballSize - 1;
            });

            if (isAllStop) {
                this.stopFallAnimation();
                this.ballSpeeds = this.ballSpeeds.map((s) => ({ ...s, angularSpeed: 0 }));
            } else {
                this.fallAnimationId = requestAnimationFrame(this.animateVerticalFall);
            }
        },

        stopFallAnimation() {
            if (this.fallAnimationId) {
                cancelAnimationFrame(this.fallAnimationId);
                this.fallAnimationId = null;
            }
        },

        startCollisionAnimation() {
            this.stopCollisionAnimation();
            this.stopFallAnimation();
            this.isFalling = false;
            this.breakStackedPosition();
            this.generateHighEnergySpeed();
            this.animateCollision();
        },

        stopCollisionAnimation() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        },

        breakStackedPosition() {
            this.currentPositions = this.currentPositions.map((pos) => ({
                top: pos.top + (Math.random() - 0.5) * 30,
                left: pos.left + (Math.random() - 0.5) * 30,
            }));
        },

        generateHighEnergySpeed() {
            this.ballSpeeds = Array(7)
                .fill()
                .map(() => {
                    const dx = (Math.random() - 0.5) * 10;
                    const dy = (Math.random() - 0.5) * 10;
                    return {
                        dx: Math.abs(dx) < 2 ? (dx > 0 ? 2 : -2) : dx,
                        dy: Math.abs(dy) < 2 ? (dy > 0 ? 2 : -2) : dy,
                        angularSpeed: (Math.random() - 0.5) * 3,
                    };
                });
        },

        keepMinSpeed(speed) {
            if (Math.abs(speed.dx) < this.minSpeed) {
                speed.dx = speed.dx > 0 ? this.minSpeed : -this.minSpeed;
            }
            if (Math.abs(speed.dy) < this.minSpeed) {
                speed.dy = speed.dy > 0 ? this.minSpeed : -this.minSpeed;
            }
        },

        animateCollision() {
            const circles = this.currentPositions.map((pos, index) => ({
                ...pos,
                index,
                radius: this.ballSize / 2,
            }));

            circles.forEach((circle, i) => {
                const speed = this.ballSpeeds[i];
                this.keepMinSpeed(speed);

                circle.left += speed.dx;
                circle.top += speed.dy;

                if (circle.left <= 0 || circle.left >= this.containerWidth - this.ballSize) {
                    speed.dx = -speed.dx * this.elasticity;
                    circle.left = Math.max(0, Math.min(circle.left, this.containerWidth - this.ballSize));
                    circle.left += (Math.random() - 0.5) * 3;
                }
                if (circle.top <= 0 || circle.top >= this.containerHeight - this.ballSize) {
                    speed.dy = -speed.dy * this.elasticity;
                    circle.top = Math.max(0, Math.min(circle.top, this.containerHeight - this.ballSize));
                    circle.top += (Math.random() - 0.5) * 3;
                }

                this.randomDeg[i] += speed.angularSpeed * 1.0 + Math.abs(speed.dx) * 0.6 + Math.abs(speed.dy) * 0.6;
            });

            for (let i = 0; i < circles.length; i++) {
                for (let j = i + 1; j < circles.length; j++) {
                    const c1 = circles[i];
                    const c2 = circles[j];
                    const s1 = this.ballSpeeds[i];
                    const s2 = this.ballSpeeds[j];

                    const dx = c2.left - c1.left;
                    const dy = c2.top - c1.top;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = c1.radius + c2.radius;

                    if (distance < minDistance) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const tx = -ny;
                        const ty = nx;

                        const v1n = s1.dx * nx + s1.dy * ny;
                        const v1t = s1.dx * tx + s1.dy * ty;
                        const v2n = s2.dx * nx + s2.dy * ny;
                        const v2t = s2.dx * tx + s2.dy * ty;

                        const v1nAfter = v2n * this.elasticity;
                        const v2nAfter = v1n * this.elasticity;

                        s1.dx = v1nAfter * nx + v1t * tx;
                        s1.dy = v1nAfter * ny + v1t * ty;
                        s2.dx = v2nAfter * nx + v2t * tx;
                        s2.dy = v2nAfter * ny + v2t * ty;

                        const overlap = minDistance - distance;
                        c1.left -= overlap * nx * 1.8;
                        c1.top -= overlap * ny * 1.8;
                        c2.left += overlap * nx * 1.8;
                        c2.top += overlap * ny * 1.8;

                        s1.angularSpeed += s2.dx * 0.3;
                        s2.angularSpeed += s1.dx * 0.3;
                    }
                }
            }

            this.currentPositions = circles.map(({ top, left }) => ({ top, left }));
            this.animationId = requestAnimationFrame(this.animateCollision);
        },
    },
};
</script>

<style lang="less" scoped>
.circle-container {
    position: relative;
    width: 284px;
    height: 230px;
    overflow: hidden;
    will-change: transform;
    transform: translateZ(0);
}
.circle {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    position: absolute;
    will-change: top, left, transform;
    pointer-events: none;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: none !important;
}
</style>
