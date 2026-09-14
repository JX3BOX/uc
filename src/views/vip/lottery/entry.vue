<template>
    <component :is="view" :key="$route.query.__env || 'default'" />
</template>
<script>
import { defineAsyncComponent } from "vue";
import { isApp } from "@jx3box/jx3box-common/js/utils";
const AppLottery = defineAsyncComponent(() => import("./index-app.vue"));
const WebLottery = defineAsyncComponent(() => import("./index.vue"));
export default {
    data() {
        return {
            isNarrowScreen: window.innerWidth < 1280,
        };
    },
    computed: {
        view() {
            const env = this.$route.query.__env;
            return this.isNarrowScreen || (env ? env === "app" : isApp()) ? AppLottery : WebLottery;
        },
    },
    mounted() {
        window.addEventListener("resize", this.updateScreenWidth);
        this.updateScreenWidth();
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateScreenWidth);
    },
    methods: {
        updateScreenWidth() {
            this.isNarrowScreen = window.innerWidth < 1280;
        },
    },
};
</script>
