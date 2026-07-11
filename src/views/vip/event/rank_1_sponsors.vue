<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">{{ $t("vip.event.proTitle") }}</div>
            <div class="u-content">
                <h3>{{ $t("vip.event.claimConditions") }}</h3>
                <p>{{ $t("vip.event.sponsorCondition") }}</p>
                <p>{{ $t("vip.event.sponsorReward") }}</p>
                <p class="u-misc">
                    <em>{{ $t("vip.event.sponsorNote") }}</em>
                </p>
                <el-button class="u-btn" type="warning" @click="getGift" :disabled="done" icon="Present"
                    >{{ $t("vip.event.claim") }}</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { getFreeVip } from "@/service/vip/event";
export default {
    props: [],
    data: function () {
        return { done: false };
    },
    computed: {},
    methods: {
        getGift: function () {
            getFreeVip("rank_1_sponsors").then((res) => {
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
    .h(648px);
    background: url("@{event}a.png") no-repeat center top;
    padding: 100px 0;
    .u-title {
        .fz(32px, 2);
        .x;
        color: #d2395e;
        .mb(40px);
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
