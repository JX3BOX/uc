<template>
    <ContentSkeleton v-if="loading" variant="list" :rows="1" compact />
    <div v-else class="m-notice-email u-notice-box">
        <div class="u-notice-value">
            <span class="u-address" v-if="currentEmail">{{ blurAddress(currentEmail) }}</span>
            <el-tag class="u-notice-status" :type="currentEmail ? (verified ? 'success' : 'warning') : 'info'">{{
                currentEmail
                    ? verified
                        ? $t("dashboard.common.verified")
                        : $t("dashboard.common.unverified")
                    : $t("dashboard.common.unbound")
            }}</el-tag>
        </div>
        <el-button type="primary" :circle="isPhone" size="large" class="u-button" @click="visible = true" icon="Edit">{{
            currentEmail && verified ? $t("dashboard.email.change") : $t("dashboard.email.bind")
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
            loading: true,
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
            this.loading = true;
            return getProfile()
                .then((res) => {
                    const data = res.data.data;
                    this.currentEmail = data?.user_email || "";
                    this.verified = !!data?.verify_email;
                })
                .finally(() => {
                    this.loading = false;
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
