<template>
    <div class="p-card">
        <component :is="event_component" />
    </div>
</template>

<script>
import BirthdayCard from './BirthdayCard.vue';
import HolidayCard from './HolidayCard.vue';
export default {
    name: "CardIndex",
    components: {
        BirthdayCard,
        HolidayCard
    },
    computed: {
        type() {
            return this.$route.query.type;
        },
        event_component() {
            const data = {
                birthday: BirthdayCard,
                holiday: HolidayCard,
            };
            return data[this.type] || HolidayCard;
        },
    },
};
</script>

<style lang="less">
.p-card {
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
}

@media screen and (max-width: @phone), screen and (orientation: portrait) and (max-width: @ipad-y) {
    html,
    body,
    #app,
    .p-card {
        width: 100%;
        height: 100%;
        min-width: 0;
        overflow: hidden;
    }

    .p-card .m-index-popup {
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
    }
}
</style>
