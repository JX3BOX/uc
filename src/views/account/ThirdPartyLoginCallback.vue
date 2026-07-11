<template>
    <div class="m-card">
        <el-card class="box-card">
            <CardHeader />

            <main v-if="success == null" class="m-main">
                <el-alert :title="$t('account.thirdPartyLogin.processingTitle')" type="info" :description="$t('account.thirdPartyLogin.processingDescription')" show-icon :closable="false"> </el-alert>
            </main>

            <main v-if="success == true" class="m-main">
                <el-alert :title="$t('account.login.successTitle')" type="success" :description="$t('account.login.successDescription')" show-icon :closable="false"> </el-alert>
                <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" :href="redirect">{{ redirect_button }}</a>
            </main>

            <main v-if="success == false" class="m-main">
                <el-alert :title="$t('account.login.failureTitle')" type="error" :description="errors" show-icon :closable="false"> </el-alert>
                <a class="u-skip u-submit el-button u-button el-button--primary el-button--large" href="/account/login">{{ $t("account.thirdPartyLogin.backToLogin") }}</a>
            </main>
        </el-card>
        <CommonBottom />
    </div>
</template>

<script>
import CardHeader from "@/components/account/CardHeader.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __OriginRoot } from "@/utils/config";
const client = location.host.includes("origin") ? "origin" : "std";
import { directMixins } from "@/utils/direct_mixins";

export default {
    name: "ThirdPartyLoginCallback",
    mixins: [directMixins],
    data: function () {
        return {
            success: null,
            redirect: client == "origin" ? __OriginRoot : __Root,
            errors: this.$t("account.thirdPartyLogin.invalidToken"),
        };
    },
    methods: {
        fail(message) {
            this.errors = message || this.$t("account.thirdPartyLogin.invalidToken");
            this.success = false;
        },
        init() {
            const params = new URLSearchParams(location.search);
            const userdata = params.get("userdata");
            if (!userdata) {
                this.fail();
                return;
            }

            try {
                const data = JSON.parse(decodeURIComponent(atob(userdata)));
                if (!data?.token || !data?.ID) {
                    this.fail();
                    return;
                }

                const user = {
                    token: data.token,
                    uid: data.ID,
                    name: data?.display_name,
                    avatar: data?.user_avatar || "",
                    group: data?.user_group || 8,
                    status: data?.status || 0,
                };

                User.update(user)
                    .then(() => {
                        if (this.isAlternate) {
                            localStorage.setItem(
                                `jx3box-alternate-${user.uid}`,
                                JSON.stringify({
                                    ...user,
                                    created_at: Number(localStorage.getItem("created_at")),
                                })
                            );
                        }

                        sessionStorage.removeItem("alternate");
                        this.success = true;
                        this.skip();
                    })
                    .catch(() => {
                        this.fail(this.$t("account.thirdPartyLogin.sessionSaveFailed"));
                    });
            } catch (err) {
                this.fail();
            }
        },
    },
    mounted: function () {
        this.init();
    },
    components: {
        CardHeader,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/account/common.less";
@import "~@/assets/css/account/card.less";
@import "~@/assets/css/account/register.less";
</style>
