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
                transform: `rotate(${index === 1 ? stepRotateDeg : randomDeg[index]}deg)`,
                transformOrigin: 'center',
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
            { top: 86, left: 98 },
            { top: 81, left: 183 },
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
            currentPositions: circleInitPositions,
            stepRotateDeg: 0,
            randomDeg: Array(7).fill(0),
        };
    },
    mounted() {
        this.fallToTarget();
    },
    methods: {
        fallToTarget() {
            setTimeout(() => {
                this.currentPositions = [...this.circleTargetPositions];
                this.randomDeg = this.randomDeg.map(() => Math.floor(Math.random() * 100) - 25);
                this.stepRotateDeg = -15;

                setTimeout(() => {
                    this.currentPositions = this.currentPositions.map((pos, idx) =>
                        idx === 1 ? this.finalPosForIndex1 : pos
                    );
                    this.stepRotateDeg = 45;
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
