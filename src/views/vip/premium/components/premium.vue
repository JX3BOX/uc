<template>
    <div class="m-premium-status">
        <img :src="require(`@/assets/img/vip/vip2/badge-${data.expireDate ? 'vip' : 'common'}.png`)" />
        <div class="u-title">
            <span>专业账号</span>
            <em>Professional</em>
        </div>

        <div :class="`u-expire ${data.expireDate ? '' : 'u-null'}`">
            {{ data.expireDate ? "已开通" : "尚未开通" }}
        </div>
        <div class="u-time" v-if="data.expireDate">{{ `到期时间：${data.expireDate}` }}</div>
        <div class="u-teammate" v-if="data.isTeammate" @click="getFreePro">团队成员免费续期</div>
    </div>
</template>

<script>
import { getFreePro } from "@/service/vip/premium.js";
export default {
    name: "premiumStatus",
    props: ["data"],
    data: function () {
        return {};
    },
    computed: {
        status() {
            return this.isLogin;
        },
    },
    methods: {
        getFreePro() {
            getFreePro().then(() => {
                this.$message({
                    message: "亲爱的魔盒团队成员，续期成功",
                    type: "success",
                });
                window.location.reload();
            });
        },
    },
};
</script>

<style lang="less" scope>
.m-premium-status {
    width: 180px;
    color: #343543;
    img {
        .db;
        .auto(x);
        max-width: 150px;
    }
    .u-title {
        .x;
        .bold;
        .fz(16px);
        .pt(8px);
        letter-spacing: 1px;
        span,
        em {
            .db;
            .lh(24px);
        }
        em {
            font-weight: 300;
            color: #24292e4d;
            font-style: normal;
        }
    }
    .u-expire {
        .x;
        .bold;
        .size(100%,50px);
        .mt(15px);
        .r(4px);
        .fz(14px,50px);
        background-color: #343543;
        color: #f9d8a7;
        &.u-null {
            background-color: #ebebeb;
            color: #8e8e8e;
        }
    }
    .u-time {
        .x;
        .fz(12px);
        .mt(10px);
    }
    .u-teammate {
        .x;
        .pointer;
        .mt(15px);
        .r(4px);
        .fz(14px,26px);
        color: #fff;
        background-color: #fba524;
        &:hover {
            filter: brightness(1.1);
        }
    }
}
</style>
