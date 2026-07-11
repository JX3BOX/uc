<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">{{ $t("vip.event.rank2Title") }}</div>
            <div class="u-content">
                <i18n-t keypath="vip.event.rank2Description" tag="p"><a href="/bbs/21805" target="_blank">{{ $t("vip.event.eventDetails") }}</a></i18n-t>
                <div class="u-options">
                    <el-select v-model="key" :placeholder="$t('vip.event.selectPrize')">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
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
        return {
            done: false,
            key: "",
        };
    },
    computed: {
        options() {
            return [
                {
                    label: this.$t("vip.event.rankTop30"),
                    value: "rank_2_top30",
                },
                {
                    label: this.$t("vip.event.rankTop100"),
                    value: "rank_2_top100",
                },
                {
                    label: this.$t("vip.event.rankSchool"),
                    value: "rank_2_school",
                },
                {
                    label: this.$t("vip.event.rankLadder"),
                    value: "rank_2_ladder",
                },
            ];
        },
    },
    methods: {
        getGift: function () {
            if (!this.key) {
                this.$alert(this.$t("vip.event.selectPrizeWarning"), this.$t("vip.common.notice"), {
                    confirmButtonText: this.$t("vip.common.confirm"),
                });
                return;
            }
            getFreeVip(this.key).then((res) => {
                this.done = true;
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
