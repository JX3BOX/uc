<template>
    <div class="m-vip-namespace-event">
        <div class="m-vip-namespace-event-cont">
            <div class="u-title">{{ $t("vip.event.namespaceClaimTitle") }}</div>
            <el-input v-model="uid" :placeholder="$t('vip.event.uidPlaceholder')" :disabled="success"></el-input>
            <el-button type="primary" @click="submit" :disabled="success">{{ $t("vip.common.submit") }}</el-button>
        </div>
    </div>
</template>
<script>
import { putNamespaceKolForId } from "@/service/vip/event";
export default {
    name: "Event",
    props: [],
    data: function() {
        return {
            uid: "",
            success: false,
        };
    },
    computed: {},
    methods: {
        submit: function() {
            putNamespaceKolForId(this.uid).then((res) => {
                this.success = true;
                this.$message({
                    message: this.$t("vip.common.submitSuccess"),
                    type: "success",
                });
            });
        },
    },
    mounted: function() {},
    // components: { 'simple-header': simple_header },
};
</script>
