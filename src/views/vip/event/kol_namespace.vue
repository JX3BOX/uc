<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">{{ $t("vip.event.kolTitle") }}</div>
            <div class="u-content">
                <h3>{{ $t("vip.event.claimConditions") }}</h3>
                <p>{{ $t("vip.event.kolCondition") }}</p>
                <p>{{ $t("vip.event.kolReward") }}</p>
                <el-button class="u-btn" type="warning" @click="getGift" :disabled="done" icon="Present"
                    >{{ $t("vip.event.claim") }}</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { getFreeNamespace } from "@/service/vip/event";
export default {
    props: [],
    data: function () {
        return { done: false };
    },
    computed: {},
    methods: {
        getGift: function () {
            getFreeNamespace("kol-1").then((res) => {
                this.done = true;
                this.$message({
                    message: this.$t("vip.event.claimSuccess"),
                    type: "success",
                });
                this.$alert(this.$t("vip.event.claimSuccess"), this.$t("vip.common.notice"), {
                    confirmButtonText: this.$t("vip.common.confirm"),
                });
            });
        },
    },
};
</script>
<style scoped lang="less">
.u-box {
    background: url("@{event}b.png") no-repeat center top;
    padding: 100px 0;
    color: #727176;
    .h(720px);
    .u-title {
        .fz(24px, 2);
        .x;
        color: #577a65;
        .mb(20px);
        .mt(120px);
    }

    .u-content {
        .x;
    }

    .u-misc {
        .fz(12px);
        color: #999;
    }

    .u-btn {
        .mt(40px);
        .w(120px);
    }
}
</style>
