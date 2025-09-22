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
