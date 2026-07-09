<template>
    <div class="m-notice-email u-notice-box">
        <div class="u-notice-value">
            <span class="u-address">{{ blurAddress(currentEmail) }}</span>
            <el-tag class="u-notice-status" v-if="!!currentEmail" :type="verified ? 'success' : 'warning'">{{
                verified ? "已验证" : "未验证"
            }}</el-tag>
        </div>
        <el-button type="primary" :circle="isPhone" size="large" class="u-button" @click="visible = true" icon="Edit">{{
            currentEmail && verified ? "修改邮箱" : "绑定邮箱"
        }}</el-button>

        <email-dialog v-model="visible" :email="currentEmail" :verified="verified" @update="onUpdate" />
    </div>
</template>

<script>
import { getProfile } from "@/service/dashboard/profile";
import EmailDialog from "./email_dialog.vue";
export default {
    name: "email",
    components: {
        EmailDialog,
    },
    data: function () {
        return {
            visible: false,
            verified: false,

            currentEmail: "",

            isPhone: window.innerWidth < 768,
        };
    },
    methods: {
        handleClose() {
            this.visible = false;
        },
        // 模糊地址
        blurAddress(text) {
            return String(text || "").replace(/(.{2}).*(.{0}@.*)/, "$1****$2");
        },
        load() {
            getProfile().then((res) => {
                const data = res.data.data;
                this.currentEmail = data?.user_email || "";
                this.verified = !!data?.verify_email;
            });
        },
        onUpdate() {
            this.load();
        },
    },
    mounted: function () {
        this.load();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/profile/email.less";
.m-notice-email__dialog {
    .el-dialog__body {
        .pt(10px);
        .pb(60px);
    }
    .m-profile-email .u-pic {
        .size(100px);
    }
    .m-dashboard-content-list img,
    .m-dashboard-content-list svg {
        .size(24px);
    }

    .u-code {
        margin-bottom: 20px;
        .x;
    }
    .u-address {
        color: #606266;
    }
    .u-current-email {
        color: orange;
    }
}
.m-notice-email {
    .flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
@media screen and (max-width: @phone) {
    .m-notice-email {
        .u-address {
            // .none;

            font-size: 12px;
        }

        .u-button {
            span {
                .none;
            }
        }
    }
}
</style>
