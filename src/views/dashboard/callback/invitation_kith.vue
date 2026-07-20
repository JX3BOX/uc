<template>
    <InvitationCard
        type="kith"
        icon="el-icon-user"
        :title="$t('dashboard.invitationCallback.friendTitle')"
        :description="$t('dashboard.invitationCallback.friendReceived')"
        :avatar="avatarSrc"
        :user-name="userdata.display_name || `UID ${uid}`"
        :user-link="authorLink(uid)"
        :time="dateFormat(info.created || info.updated)"
        :loading="loading"
        :valid="!!record"
        :finished="alreadyAccept"
    >
            <el-button type="primary" :disabled="alreadyAccept" @click="accept">{{
                alreadyAccept ? $t("dashboard.common.accepted") : $t("dashboard.common.accept")
            }}</el-button>
            <el-button type="info" @click="confirmQuit" :disabled="alreadyAccept">{{
                alreadyAccept ? $t("dashboard.invitationCallback.removeFriend") : $t("dashboard.common.reject")
            }}</el-button>
    </InvitationCard>
</template>

<script>
import { Base64 } from "js-base64";
import {
    getUser,
    isExistKithInvitation,
    refuseKithInvitation,
    acceptKithInvitation,
    removeKith,
} from "@/service/dashboard/callback.js";
import { getLink, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import InvitationCard from "@/components/dashboard/callback/InvitationCard.vue";
export default {
    name: "InvitationKith",
    props: [],
    components: { InvitationCard },
    data: function () {
        return {
            userdata: "",
            record: null,
            loading: true,
        };
    },
    computed: {
        info: function () {
            if (this.isMock) return { source_id: 168, created: 1784512800 };
            try {
                return JSON.parse(Base64.decode(decodeURIComponent(this.$route.query.info || "")));
            } catch (e) {
                return {};
            }
        },
        isMock: function () {
            return process.env.NODE_ENV === "development" && this.$route.query.mock === "1";
        },
        uid: function () {
            return this.info?.source_id;
        },
        isNotExist: function () {
            return !this.record;
        },
        alreadyAccept: function () {
            return !!(this.record && this.record.status);
        },
        avatarSrc: function () {
            return this.isMock ? require("@/assets/img/author/null.png") : showAvatar(this.userdata.user_avatar);
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    this.loadData();
                    this.check();
                }
            },
        },
    },
    methods: {
        loadData: function () {
            if (this.isMock) {
                this.userdata = {
                    display_name: "凌雪阁的小信使",
                    user_avatar: "https://cdn.jx3box.com/upload/avatar/2024/4/168.png",
                };
                return;
            }
            getUser(this.uid).then((res) => {
                this.userdata = res.data?.data;
            });
        },
        check: function () {
            if (this.isMock) {
                this.record = { status: 0 };
                this.loading = false;
                return;
            }
            isExistKithInvitation(this.uid)
                .then((res) => {
                    this.record = res.data?.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        confirmQuit: function () {
            this.$confirm(this.$t("dashboard.invitationCallback.removeFriendConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    this.refuse();
                })
                .catch(() => {});
        },
        refuse: function () {
            const request = this.alreadyAccept ? removeKith : refuseKithInvitation;
            request(this.uid).then(() => {
                this.$message({
                    message: this.$t("dashboard.common.operationSuccess"),
                    type: "success",
                });
                this.$router.push("/privacy?tab=whitelist");
            });
        },
        accept: function () {
            acceptKithInvitation(this.uid).then((res) => {
                this.$message({
                    message: this.$t("dashboard.common.operationSuccess"),
                    type: "success",
                });
                this.$router.push("/privacy?tab=whitelist");
            });
        },
        authorLink,
        showAvatar,
        dateFormat: function (val) {
            const timestamp = Number(val);
            if (!Number.isFinite(timestamp) || timestamp <= 0) return "-";
            return dateFormat(new Date(timestamp > 1e12 ? timestamp : timestamp * 1000));
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>
