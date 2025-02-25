<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">领取专属免费铭牌</div>
            <div class="u-content">
                <h3>【领取条件】</h3>
                <p>魔盒KOL/作者群专属提前批</p>
                <p>获赠10个铭牌</p>
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
import { getFreeNamespace } from "@/service/vip/event";
export default {
    props: [],
    data: function() {
        return { done: false };
    },
    computed: {},
    methods: {
        getGift: function() {
            getFreeNamespace("kol-1").then((res) => {
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
