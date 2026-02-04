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
            currentPositions: JSON.parse(JSON.stringify(circleInitPositions)),
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
            isFalling: false,
            // 强化版逆时针力场参数
            forceField: {
                centerX: 142,
                centerY: 115,
                forceStrength: 0.7, // 适度降低向心力，避免过快吸中心
                angularForce: 0.2, // 核心提升：切向力翻倍，旋转更明显
                drag: 1, // 无阻尼，速度不衰减
                activeDuration: 2000, // 力场持续2秒
            },
            forceFieldStartTime: 0,
            motionMode: "forceField", // 'forceField' | 'collision'
        };
    },

    mounted() {
        this.fallToTarget();
    },

    watch: {
        reward(newVal) {
            if (newVal) {
                this.startForceFieldMotion();
            } else {
                this.stopCollisionAndFall();
            }
        },
    },

    beforeUnmount() {
        this.stopAllAnimation();
        this.isFalling = false;
    },

    methods: {
        stopAllAnimation() {
            if (this.animationId) cancelAnimationFrame(this.animationId);
            if (this.fallAnimationId) cancelAnimationFrame(this.fallAnimationId);
            this.animationId = null;
            this.fallAnimationId = null;
        },

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

        // 启动：先逆时针力场运动（优化初速度，更偏向逆时针）
        startForceFieldMotion() {
            this.stopAllAnimation();
            this.isFalling = false;
            this.motionMode = "forceField";
            this.forceFieldStartTime = performance.now();

            // 优化初速度：增加逆时针初始角速度，向中心的速度更柔和
            this.ballSpeeds = this.currentPositions.map((pos) => {
                const cx = this.forceField.centerX;
                const cy = this.forceField.centerY;
                // 小球中心坐标
                const ballCx = pos.left + this.ballSize / 2;
                const ballCy = pos.top + this.ballSize / 2;
                // 指向中心的向量
                const dx = cx - ballCx;
                const dy = cy - ballCy;
                // 叠加逆时针切向初速度（核心：让初始就有旋转趋势）
                const tanDx = -dy * 0.02; // 逆时针切向X初速度
                const tanDy = dx * 0.02; // 逆时针切向Y初速度

                return {
                    dx: dx * 0.02 + tanDx + (Math.random() - 0.5) * 0.2,
                    dy: dy * 0.02 + tanDy + (Math.random() - 0.5) * 0.2,
                    angularSpeed: -2 + (Math.random() - 0.5) * 0.5, // 强制初始逆时针自旋转
                };
            });

            this.animationLoop();
        },

        // 主循环（强化力场阶段自旋转）
        animationLoop() {
            const now = performance.now();
            if (this.motionMode === "forceField") {
                if (now - this.forceFieldStartTime >= this.forceField.activeDuration) {
                    this.motionMode = "collision";
                } else {
                    this.updateForceFieldMotion();
                }
            } else {
                this.updateCollisionMotion();
            }

            // 强化自旋转：力场阶段旋转速度翻倍，碰撞阶段恢复
            this.currentPositions.forEach((pos, i) => {
                const sp = this.ballSpeeds[i];
                if (this.motionMode === "forceField") {
                    this.randomDeg[i] += sp.angularSpeed * 1.6;
                    if (i === 1) this.stepRotateDeg += sp.angularSpeed * 0.16;
                } else {
                    this.randomDeg[i] += sp.angularSpeed * 0.8;
                    if (i === 1) this.stepRotateDeg += sp.angularSpeed * 0.08;
                }
            });

            this.animationId = requestAnimationFrame(this.animationLoop);
        },

        // 阶段1：强逆时针力场运动（向心力 + 切向力 + 边界限制）
        updateForceFieldMotion() {
            const { centerX, centerY, forceStrength, angularForce, drag } = this.forceField;
            const r = this.ballSize / 2;
            const minX = 0;
            const maxX = this.containerWidth - this.ballSize;
            const minY = 0;
            const maxY = this.containerHeight - this.ballSize;

            this.currentPositions = this.currentPositions.map((pos, i) => {
                const sp = this.ballSpeeds[i];
                const cx = pos.left + r;
                const cy = pos.top + r;

                // 指向中心的向量
                const dx = centerX - cx;
                const dy = centerY - cy;
                const dist = Math.hypot(dx, dy) || 1;

                // 向心力
                const fx = (dx / dist) * forceStrength;
                const fy = (dy / dist) * forceStrength;

                // 逆时针切向力（强化版）
                const tanX = -dy / dist;
                const tanY = dx / dist;
                const tfx = tanX * angularForce;
                const tfy = tanY * angularForce;

                // 速度更新
                sp.dx = (sp.dx + fx + tfx) * drag;
                sp.dy = (sp.dy + fy + tfy) * drag;

                // 位置更新 + 边界限制（防止飞出容器）
                let newLeft = pos.left + sp.dx;
                let newTop = pos.top + sp.dy;
                // 边界柔和回弹
                if (newLeft <= minX || newLeft >= maxX) {
                    sp.dx *= -0.5;
                    newLeft = Math.max(minX, Math.min(newLeft, maxX));
                }
                if (newTop <= minY || newTop >= maxY) {
                    sp.dy *= -0.5;
                    newTop = Math.max(minY, Math.min(newTop, maxY));
                }

                return {
                    left: newLeft,
                    top: newTop,
                };
            });
        },

        // 阶段2：无规则碰撞
        updateCollisionMotion() {
            const circles = this.currentPositions.map((pos, i) => ({
                ...pos,
                index: i,
                radius: this.ballSize / 2,
            }));
            const w = this.containerWidth;
            const h = this.containerHeight;
            const r = this.ballSize / 2;

            // 边界反弹
            circles.forEach((c, i) => {
                const sp = this.ballSpeeds[i];
                c.left += sp.dx;
                c.top += sp.dy;

                if (c.left <= 0 || c.left >= w - this.ballSize) {
                    sp.dx *= -0.8;
                    c.left = Math.max(0, Math.min(c.left, w - this.ballSize));
                }
                if (c.top <= 0 || c.top >= h - this.ballSize) {
                    sp.dy *= -0.8;
                    c.top = Math.max(0, Math.min(c.top, h - this.ballSize));
                }
            });

            // 球间碰撞
            for (let i = 0; i < circles.length; i++) {
                for (let j = i + 1; j < circles.length; j++) {
                    const c1 = circles[i],
                        c2 = circles[j];
                    const s1 = this.ballSpeeds[i],
                        s2 = this.ballSpeeds[j];
                    const dx = c2.left - c1.left;
                    const dy = c2.top - c1.top;
                    const dist = Math.hypot(dx, dy);
                    const minDist = c1.radius + c2.radius;
                    if (dist < minDist && dist > 0) {
                        const nx = dx / dist,
                            ny = dy / dist;
                        const tx = -ny,
                            ty = nx;
                        const v1n = s1.dx * nx + s1.dy * ny;
                        const v1t = s1.dx * tx + s1.dy * ty;
                        const v2n = s2.dx * nx + s2.dy * ny;
                        const v2t = s2.dx * tx + s2.dy * ty;

                        const m1 = 1,
                            m2 = 1;
                        const v1nNew = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
                        const v2nNew = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

                        s1.dx = v1nNew * nx + v1t * tx;
                        s1.dy = v1nNew * ny + v1t * ty;
                        s2.dx = v2nNew * nx + v2t * tx;
                        s2.dy = v2nNew * ny + v2t * ty;

                        const sep = (minDist - dist) * 0.5;
                        c1.left -= nx * sep;
                        c1.top -= ny * sep;
                        c2.left += nx * sep;
                        c2.top += ny * sep;
                    }
                }
            }

            this.currentPositions = circles.map(({ left, top }) => ({ left, top }));
        },

        stopCollisionAndFall() {
            this.stopAllAnimation();
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

                const ballCenterX = circle.left + this.ballSize / 2;
                const ballCenterY = circle.top + this.ballSize / 2;
                const forceAngularSpeed = this.calcCounterClockwiseAngularSpeed(ballCenterX, ballCenterY);
                this.randomDeg[i] += (speed.angularSpeed + forceAngularSpeed) * 0.6 + Math.abs(speed.dy) * 0.2;
                if (i === 1) {
                    this.stepRotateDeg += (speed.angularSpeed + forceAngularSpeed) * 0.02 + Math.abs(speed.dy) * 0.02;
                }
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

        calcCounterClockwiseAngularSpeed(ballX, ballY) {
            const { centerX, centerY, radius, maxAngularSpeed, decay } = {
                centerX: 142,
                centerY: 115,
                radius: 120,
                maxAngularSpeed: 0.6,
                decay: 2,
            };
            const dx = ballX - centerX;
            const dy = ballY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance >= radius) return 0;
            const ratio = distance / radius;
            const factor = 1 - Math.pow(ratio, decay);
            return -maxAngularSpeed * factor;
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
