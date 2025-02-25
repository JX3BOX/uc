<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">领取专属免费PRO会员</div>
            <div class="u-content">
                <h3>【领取条件】</h3>
                <p>网站前500名注册用户（UID &lt;= 500）</p>
                <p>获赠90天PRO会员</p>
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
import User from "@jx3box/jx3box-common/js/user";
export default {
    props: [],
    data: function() {
        return { done: false };
    },
    computed: {},
    methods: {
        getGift: function() {
            if (User.getInfo().uid > 500) {
                this.$alert("很遗憾，您没有活动领取资格", "消息", {
                    confirmButtonText: "确定",
                });
                return;
            }
            getFreeVip("vizir-500").then((res) => {
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
