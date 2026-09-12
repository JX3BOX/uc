<template>
    <component :is="view" :key="$route.query.__env || 'default'" />
</template>
<script>
import { defineAsyncComponent } from "vue";
import { isApp } from "@jx3box/jx3box-common/js/utils";
const AppLottery = defineAsyncComponent(() => import("./index-app.vue"));
const WebLottery = defineAsyncComponent(() => import("./index.vue"));
export default {
    computed: {
        view() {
            const env = this.$route.query.__env;
            return (env ? env === "app" : isApp()) ? AppLottery : WebLottery;
        },
    },
};
</script>
