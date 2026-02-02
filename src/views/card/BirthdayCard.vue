<template>
    <AppLayout>
        <div class="m-main m-index-popup">
            <component :is="event_component" />
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/author/AppLayout.vue";
// 2026贺卡
import Default2026 from "@/components/card/birthday/default2026.vue";
// 2025贺卡
import Default2025 from "@/components/card/birthday/default2025.vue"; 
// 2024贺卡
import Default from "@/components/card/birthday/default.vue";
export default {
    name: "BirthdayCard",
    components: {
        Default2026,
        Default2025,
        Default,
        AppLayout,
    },
    data: function () {
        return {
            event_component: Default,
        };
    },
    mounted() {
        const skin = this.$route.query.skin;
        const data = {
            default2026: Default2026,
            default2025: Default2025,
            default: Default,
        };
        this.event_component = data[skin] || Default;
    },
};
</script>
