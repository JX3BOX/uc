<template>
    <div class="m-account-msg" v-html="data" v-if="data"></div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
export default {
    data: function() {
        return {
            data: "",
        };
    },
    mounted: function() {
        getBreadcrumb("account").then((res) => {
            this.data = res
        });
    },
};
</script>

<style lang="less">
    @import '~@/assets/css/account/msg.less';
</style>
