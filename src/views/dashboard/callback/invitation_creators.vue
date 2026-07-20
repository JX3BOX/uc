<template>
    <InvitationCard
        type="creators"
        icon="el-icon-edit-outline"
        :title="$t('dashboard.invitationCallback.coCreationTitle')"
        :description="$t('dashboard.invitationCallback.coCreationReceived')"
        :avatar="avatarSrc"
        :user-name="userdata.display_name || `UID ${uid}`"
        :user-link="authorLink(uid)"
        :subject="data.post_title"
        :subject-link="postLink(data)"
        :time="dateFormat(info.created || info.updated)"
        :loading="loading"
        :valid="!!record"
        :finished="alreadyAccept"
    >
            <el-button type="primary" :loading="actionLoading" :disabled="isNotExist || alreadyAccept || actionLoading" @click="accept">{{
                alreadyAccept ? $t("dashboard.common.accepted") : $t("dashboard.common.accept")
            }}</el-button>
            <el-button type="info" @click="confirmQuit" :disabled="isNotExist || actionLoading">{{
                alreadyAccept ? $t("dashboard.invitationCallback.leaveCoCreation") : $t("dashboard.common.reject")
            }}</el-button>
    </InvitationCard>
</template>

<script>
import { Base64 } from "js-base64";
import {
    getPost,
    getUser,
    quitUnionPost,
    isExistPostInvitation,
    acceptPostInvitation,
} from "@/service/dashboard/callback.js";
import { getLink, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import InvitationCard from "@/components/dashboard/callback/InvitationCard.vue";
export default {
    name: "CallbackCreators",
    props: [],
    components: { InvitationCard },
    data: function () {
        return {
            data: "",
            userdata: "",
            record: null,
            loading: true,
            actionLoading: false,
        };
    },
    computed: {
        info: function () {
            if (this.isMock) return { source_id: 943, created: 1784512800 };
            try {
                return JSON.parse(Base64.decode(decodeURIComponent(this.$route.query.info || "")));
            } catch (e) {
                return {};
            }
        },
        isMock: function () {
            return process.env.NODE_ENV === "development" && this.$route.query.mock === "1";
        },
        id: function () {
            return ~~this.info.source_id;
        },
        uid: function () {
            return this.data?.post_author;
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
        post_link: function () {
            return getLink(this.data?.post_type, this.data?.ID);
        },
    },
    watch: {
        id: {
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
                this.data = { ID: 943, post_author: 168, post_type: "collection", post_title: "江湖生存指南 · 新人入门合集" };
                this.userdata = {
                    display_name: "凌雪阁的小信使",
                    user_avatar: "https://cdn.jx3box.com/upload/avatar/2024/4/168.png",
                };
                return;
            }
            getPost(this.id)
                .then((res) => {
                    this.data = res.data?.data;
                })
                .then(() => {
                    getUser(this.uid).then((res) => {
                        this.userdata = res.data?.data;
                    });
                });
        },
        confirmQuit: function () {
            this.$confirm(this.$t("dashboard.invitationCallback.leaveConfirm"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                type: "warning",
            })
                .then(() => {
                    this.quit();
                })
                .catch(() => {});
        },
        quit: async function () {
            this.actionLoading = true;
            try {
                await quitUnionPost(this.id);
                this.$message({
                    message: this.$t("dashboard.common.operationSuccess"),
                    type: "success",
                });
                this.$router.push("/msg");
            } finally {
                this.actionLoading = false;
            }
        },
        check: function () {
            if (this.isMock) {
                this.record = { status: 0 };
                this.loading = false;
                return;
            }
            isExistPostInvitation(this.id)
                .then((res) => {
                    this.record = res.data?.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        accept: async function () {
            this.actionLoading = true;
            try {
                await acceptPostInvitation(this.id);
                this.$message({
                    message: this.$t("dashboard.common.operationSuccess"),
                    type: "success",
                });
                location.href = this.post_link;
            } finally {
                this.actionLoading = false;
            }
        },
        postLink: function (post) {
            return getLink(post.post_type, post.ID);
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
