<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">领取专属免费PRO会员</div>
            <div class="u-content">
                <h3>【领取条件】</h3>
                <p>第一届「奉天证道·秘境百强榜」赛事赞助单位（任意价值）</p>
                <p>获赠1年PRO会员</p>
                <p class="u-misc">
                    <em>需在赞助时有提供网站UID,如需补录请提供支付凭证</em>
                </p>
                <el-button
                    class="u-btn"
                    type="warning"
                    @click="getGift"
                    :disabled="done"
                    icon="el-icon-present"
                    >点击领取</el-button
                >
            </div>
        </div>
    </div>
</template>
<script>
import { getFreeVip } from "@/service/vip/event";
export default {
    props: [],
    data: function() {
        return { done: false };
    },
    computed: {},
    methods: {
        getGift: function() {
            getFreeVip('rank_1_sponsors').then((res) => {
                this.done = true;
                this.$message({
                    message: "领取成功",
                    type: "success",
                });
                this.$alert("领取成功", "提醒", {
                    confirmButtonText: "确定",
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
