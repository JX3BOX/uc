<template>
    <div class="m-event-item">
        <div class="u-box">
            <div class="u-title">第二届秘境百强榜魔盒会员奖励</div>
            <div class="u-content">
                <p>根据不同奖项奖励有所不同，详见<a href="/bbs/21805" target="_blank">活动说明</a></p>
                <div class="u-options">
                    <el-select v-model="key" placeholder="请选择领取奖项">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <el-button
                    class="u-btn"
                    type="warning"
                    @click="getGift"
                    :disabled="done"
                    icon="el-icon-present"
                >点击领取</el-button>
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
            options: [
                {
                    label : '11-30名竞速排名（1年专业会员）',
                    value : 'rank_2_top30'
                },
                {
                    label : '31-100名竞速排名（1月专业会员）',
                    value : 'rank_2_top100'
                },
                {
                    label : '门派天团（1年高级会员）',
                    value : 'rank_2_school'
                },
                {
                    label : '个人天梯（1年高级会员）',
                    value : 'rank_2_ladder'
                },
            ],
            key : ''
        };
    },
    computed: {},
    methods: {
        getGift: function () {
            if(!this.key){
                this.$alert("请选择需要领取的奖项", "提醒", {
                    confirmButtonText: "确定",
                });
                return
            }
            getFreeVip(this.key).then((res) => {
                this.done = true;
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
