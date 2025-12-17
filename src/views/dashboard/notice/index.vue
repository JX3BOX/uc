<template>
    <uc class="m-dashboard-notice">
        <div class="m-dashboard-content">
            <el-alert class="u-tip" title="配置你的联系方式以接收魔盒通知" type="warning" show-icon> </el-alert>
            <div class="m-dashboard-content-list">
                <div class="m-item" v-for="(item, i) in list" :key="i">
                    <span class="u-notice-item">
                        <img class="u-icon" svg-inline :src="icon(item.key)" />
                        <span class="u-label">{{ item.name }}</span>
                    </span>
                    <component :is="item.component" />
                </div>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { __imgPath } from "@/utils/config";
import wechat from "./wechat.vue";
import email from "./email.vue";
import phone from "./phone.vue";
export default {
    name: "notice",
    components: { uc, wechat, email },
    data: function () {
        return {
            list: [
                { key: "email", name: "邮箱", component: email },
                { key: "wechat", name: "微信", component: wechat },
                { key: "phone", name: "手机", component: phone },
            ],
        };
    },
    methods: {
        icon: function (type) {
            return __imgPath + "image/connect/" + type + ".svg";
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
.m-dashboard-content-list {
    .flex;
    box-sizing: border-box;
    flex-direction: column;
    gap: 20px;
    .m-item {
        .flex;
        padding: 30px 10px 10px 10px;
        box-sizing: border-box;
        gap: 60px;
        border-top: 1px dashed #ddd;
        &:first-child {
            border: 0;
        }
    }
    img,
    svg {
        .size(40px);
    }
}
.m-dashboard-notice {
    .u-notice-item {
        .flex;
        align-items: center;
        gap: 20px;
        padding: 0 20px;
        .bold;
    }
    .u-notice-value {
        width: 200px;
    }
    .u-notice-status {
        margin-left: 5px;
    }
}

@media screen and (max-width: @phone) {
    .m-dashboard-content-list {
        .m-item {
            gap: 20px;
        }
    }
    .m-dashboard-notice {
        img {
            min-width: 40px;
        }
        .u-notice-item {
            flex-direction: column;
            padding: 0;
            gap: 10px;
        }
        .u-notice-box {
            flex: 1;
        }
    }
}
</style>
