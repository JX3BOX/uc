<template>
    <div class="circle-container">
        <img
            :src="`${imgPath}egg${index > 3 ? index - 3 : index + 1}.svg`"
            class="circle"
            v-for="(pos, index) in initPositions"
            :key="index"
            :style="{
                top: currentPositions[index].top + 'px',
                left: currentPositions[index].left + 'px',
                transform: index === 1 ? `rotate(${rotateDeg}deg)` : 'none',
                transformOrigin: index === 1 ? 'bottom center' : 'center',
            }"
        />
    </div>
</template>

<script>
export default {
    name: "CircleFallEffect",
    props: ["imgPath"],
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
            { top: 83, left: 33 },
            { top: 86, left: 92 },
            { top: 81, left: 183 },
            { top: 155, left: 72 },
            { top: 154, left: 146 },
            { top: 155, left: 10 },
            { top: 155, left: 194 },
        ];

        return {
            initPositions: circleInitPositions,
            targetPositions: circleTargetPositions,
            currentPositions: circleInitPositions,
            rotateDeg: 0,
        };
    },
    mounted() {
        this.fallToTarget();
    },
    methods: {
        fallToTarget() {
            setTimeout(() => {
                this.currentPositions = [...this.targetPositions];
                setTimeout(() => {
                    this.rotateDeg = 25;
                }, 500);
            }, 500);
        },
    },
};
</script>

<style lang="less" scoped>
.circle-container {
    width: 284px;
    height: 230px;
    .clip;
}
.circle {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    position: absolute;
    transition: top 0.8s ease-in-out, left 0.8s ease-in-out, transform 0.8s ease-in-out;
    will-change: top, left, transform;
}
</style>
