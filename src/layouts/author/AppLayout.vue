<template>
    <div v-show="!isAppEnv" class="m-app-layout-header">
        <CommonHeader></CommonHeader>
    </div>
    <slot></slot>
</template>

<script>
import { isAppWebview } from "@/utils/app-env";

export default {
    name: "AppLayout",
    computed: {
        isAppEnv() {
            return isAppWebview(this.$route);
        },
    },
};
</script>
