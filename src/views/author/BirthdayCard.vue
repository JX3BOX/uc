<template>
    <AppLayout>
        <div class="m-main m-index-popup">
            <component :is="event_component" />
        </div>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/author/AppLayout.vue";
// 2025贺卡
import Default2025 from "@/components/author/birthday/default2025.vue";
// 2024贺卡
import Default from "@/components/author/birthday/default.vue";
export default {
    name: "BirthdayCard",
    components: {
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
        const skin = this.$route.params.skin;
        const data = {
            default2025: Default2025,
            default: Default,
        };
        this.event_component = data[skin] || Default;
    },
};
</script>
