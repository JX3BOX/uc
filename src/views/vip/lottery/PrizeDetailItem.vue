<template>
    <div class="m-detail-item" :class="{ 'is-top': isActive }" @click="$emit('click', $event)">
        <div class="u-img-wrap"><img :src="item.img" :alt="item.name" /></div>
        <div class="u-info">
            <div class="u-row">
                <span class="u-name">{{ item.name }}</span>
                <div class="u-stars">
                    <img
                        v-for="n in item.stars || 1"
                        :key="n"
                        :src="starSrc"
                        class="u-star-icon"
                    />
                </div>
            </div>
            <p class="u-rate">中奖率：{{ item.rate || "0.0" }}%</p>
            <p class="u-desc">{{ item.desc || "奖品介绍" }}</p>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";

export default {
    name: "PrizeDetailItem",
    props: {
        item: { type: Object, required: true },
        isActive: { type: Boolean, default: false },
    },
    emits: ["click"],
    computed: {
        starSrc() {
            const suffix = this.isActive ? "2" : "1";
            return `${__cdn}design/event/lottery/app/star${suffix}.svg`;
        },
    },
};
</script>