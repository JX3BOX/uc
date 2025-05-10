<template>
    <div class="c-var p-publish-me">
        <mobile-me />
    </div>
</template>

<script>
import MobileMe from "@/components/publish/me/MobileMe.vue";

export default {
    name: "me",
    components: { MobileMe },
    mounted() {
        console.log(1111);
    }
};
</script>

<style  lang="less">
@import "~@/assets/css/common/var";
</style>
