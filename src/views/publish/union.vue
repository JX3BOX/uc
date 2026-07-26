<template>
    <div class="m-dashboard-work m-dashboard-cms m-dashboard-union">
        <div class="m-dashboard-work-header">
            <h2 class="u-title">
                {{ $t("publish.nav.collaboration") }}
                <span class="u-subtype">
                    <i class="el-icon-arrow-right"></i>
                    <span>{{ subtype }}</span>
                </span>
            </h2>
            <el-badge v-if="!isActive" :value="pendingTotal" :hidden="!pendingTotal" class="u-pending-entry">
                <el-button plain icon="Message" @click="pendingDialogVisible = true">
                    {{ $t("publish.collaboration.pendingInvitations") }}
                </el-button>
            </el-badge>
        </div>

        <el-dialog
            v-if="!isActive"
            v-model="pendingDialogVisible"
            class="m-union-pending-dialog"
            :title="$t('publish.collaboration.pendingInvitations')"
            width="700px"
            append-to-body
            destroy-on-close
        >
            <ContentSkeleton v-if="pendingLoading" variant="list" :rows="3" compact />
            <PublishListError v-else-if="pendingError" @retry="loadPendingInvitations" />
            <div v-else-if="pendingInvitations.length" class="m-union-invitation-list">
                <article v-for="item in pendingInvitations" :key="item.post_id" class="m-union-invitation-item">
                    <a class="u-inviter" :href="authorLink(inviter(item).ID)" target="_blank">
                        <img :src="showAvatar(inviter(item).user_avatar)" :alt="inviter(item).display_name" />
                        <span>
                            <small>{{ $t("publish.collaboration.invitedBy") }}</small>
                            <b>{{ inviter(item).display_name }}</b>
                        </span>
                    </a>
                    <div class="u-invitation-work">
                        <a
                            :href="postLink(item.union_post_raw.post_type, item.union_post_raw.ID)"
                            target="_blank"
                            class="u-invitation-title"
                        >{{ item.union_post_raw.post_title || $t("publish.common.untitled") }}</a>
                        <time>{{ dateFormat(item.created_at) }}</time>
                    </div>
                    <div class="u-invitation-actions">
                        <el-button
                            type="primary"
                            icon="Check"
                            :loading="actionPostId === item.post_id"
                            @click="acceptInvitation(item)"
                        >{{ $t("publish.collaboration.acceptInvitation") }}</el-button>
                        <el-popconfirm
                            :title="$t('publish.collaboration.rejectInvitationConfirm')"
                            @confirm="rejectInvitation(item)"
                        >
                            <template #reference>
                                <el-button icon="Close" :disabled="actionPostId === item.post_id">{{
                                    $t("publish.collaboration.rejectInvitation")
                                }}</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </article>
                <el-pagination
                    v-if="pendingTotal > pendingPer"
                    class="m-union-pending-pages"
                    size="small"
                    background
                    :page-size="pendingPer"
                    v-model:current-page="pendingPage"
                    layout="prev, pager, next"
                    :total="pendingTotal"
                />
            </div>
            <el-empty v-else :image-size="72" :description="$t('publish.collaboration.noPendingInvitations')" />
        </el-dialog>

        <el-dialog
            v-model="memberDialogVisible"
            class="m-union-member-dialog"
            :title="$t(isActive ? 'publish.collaboration.manageMembers' : 'publish.collaboration.viewMembers')"
            width="660px"
            append-to-body
        >
            <div v-if="selectedUnionPost" class="m-union-member-panel" :class="{ 'is-readonly': !isActive }">
                <div class="u-work-title">{{ selectedUnionPost.union_post_raw.post_title || $t("publish.common.untitled") }}</div>
                <div v-if="selectedUnionPost.union_authors.length" class="u-member-list">
                    <div v-for="author in selectedUnionPost.union_authors" :key="author.author_id" class="u-member-item">
                        <el-tag
                            class="u-member-status"
                            :type="author.status ? 'success' : 'warning'"
                            effect="plain"
                            size="small"
                        >
                            {{ author.status ? $t("publish.collaboration.acceptedMembers") : $t("publish.collaboration.pendingMembers") }}
                        </el-tag>
                        <a :href="authorLink(author.author_id)" target="_blank" class="u-member-user">
                            <img :src="showAvatar(author.post_author_info?.user_avatar)" />
                            <span>{{ author.post_author_info?.display_name || `UID ${author.author_id}` }}</span>
                        </a>
                        <div class="u-member-role">
                            <span class="u-role-label">{{ $t("publish.collaboration.roleLabel") }}</span>
                            <span class="u-role-value">{{ author.label || $t("publish.collaboration.writer") }}</span>
                            <el-button
                                v-if="isActive"
                                text
                                icon="Edit"
                                :loading="roleActionId === author.author_id"
                                :title="$t('publish.collaboration.editRole')"
                                @click="updateMemberRole(author)"
                            ></el-button>
                        </div>
                        <el-popconfirm
                            v-if="isActive"
                            :title="author.status ? $t('publish.collaboration.removeMemberConfirm') : $t('publish.collaboration.cancelInvitationConfirm')"
                            @confirm="removeMember(author)"
                        >
                            <template #reference>
                                <el-button
                                    class="u-member-remove"
                                    plain
                                    icon="Close"
                                    :loading="memberActionId === author.author_id"
                                >{{ author.status ? $t("publish.collaboration.removeMember") : $t("publish.collaboration.cancelInvitation") }}</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
                <el-empty v-else :image-size="72" :description="$t('publish.collaboration.noMembers')" />
            </div>
        </el-dialog>

        <div class="m-dashboard-box">
            <ContentSkeleton v-if="loading" variant="list" :rows="per" compact />
            <PublishListError v-else-if="loadError" @retry="loadPosts" />
            <ul class="m-dashboard-box-list" v-else-if="data && data.length">
                <li
                    v-for="(item, i) in data"
                    :key="`${isActive ? 'active' : 'passive'}-${item.union_post_raw ? item.union_post_raw.ID : i}`"
                >
                    <template v-if="item.union_post_raw">
                        <div class="u-title-row">
                            <a
                                class="u-title"
                                target="_blank"
                                :href="postLink(item.union_post_raw.post_type, item.union_post_raw.ID)"
                            >
                                <i class="u-icon">
                                    <img
                                        v-if="item.union_post_raw.visible == 0"
                                        svg-inline
                                        src="@/assets/img/publish/works/repo.svg"
                                    />
                                    <el-tooltip v-else :content="visibleFormat(item.union_post_raw.visible)" placement="top">
                                    <img
                                        src="@/assets/img/publish/works/draft.svg"
                                        :title="statusFormat(item.union_post_raw.post_status)"
                                    />
                                </el-tooltip>
                                </i>
                                {{ item.union_post_raw.post_title || $t("publish.common.untitled") }}
                            </a>
                            <div class="u-member-counters">
                                <button
                                    type="button"
                                    class="u-member-counter"
                                    :class="{ 'is-warning': acceptedAuthors(item).length !== (item.union_authors || []).length }"
                                    @click="openMemberDialog(item)"
                                >
                                    {{ $t("publish.collaboration.collaborationProgress", {
                                        accepted: acceptedAuthors(item).length,
                                        total: (item.union_authors || []).length,
                                    }) }}
                                </button>
                            </div>
                        </div>
                        <div class="u-desc">
                            <!-- <span class="u-desc-subitem">
                                <i class="el-icon-view"></i>
                                {{ visibleFormat(item.union_post_raw.visible) }}
                            </span> -->
                            <time class="u-desc-subitem">
                                <i class="el-icon-finished"></i>
                                {{ $t("publish.common.publishedAt") }} :
                                {{ dateFormat(item.union_post_raw.post_date) }}
                            </time>
                            <time class="u-desc-subitem">
                                <i class="el-icon-refresh"></i>
                                {{ $t("publish.common.updatedAt") }} :
                                {{ dateFormat(item.union_post_raw.post_modified) }}
                            </time>
                        </div>

                        <el-button-group class="u-action">
                            <el-button
                                v-if="isActive"
                                icon="Setting"
                                :title="$t('publish.collaboration.manageMembers')"
                                @click="openMemberDialog(item)"
                            ></el-button>
                            <el-button
                                v-if="isActive"
                                icon="Close"
                                :loading="actionPostId === item.union_post_raw.ID"
                                :title="$t('publish.collaboration.closeCollaboration')"
                                @click="closeCollaboration(item.union_post_raw.ID, i)"
                            ></el-button>
                            <el-button
                                v-if="!isActive && item.r_edit"
                                icon="Edit"
                                :title="$t('publish.common.edit')"
                                @click="edit(item.union_post_raw.post_type, item.union_post_raw.ID)"
                            ></el-button>
                            <el-popconfirm
                                v-if="!isActive"
                                :title="$t('publish.confirm.leaveCollaboration')"
                                @confirm="quit(item.union_post_raw.ID, i)"
                            >
                                <template #reference>
                                    <el-button
                                        class="u-quit"
                                        icon="Download"
                                        :loading="actionPostId === item.union_post_raw.ID"
                                        :title="$t('publish.common.leaveCollaboration')"
                                    ></el-button>
                                </template>
                            </el-popconfirm>
                        </el-button-group>
                    </template>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                :title="$t('publish.common.noResults')"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                v-if="!loading && !loadError"
                class="m-dashboard-box-pages"
                background
                :page-size="per"
                :hide-on-single-page="true"
                v-model:current-page="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import {
    getUnionPosts,
    quitUnionPost,
    acceptUnionInvitation,
    removeUnionAuthor,
    updateUnionAuthor,
    closeUnionPost,
} from "@/service/publish/union.js";
import { getLink, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils.js";
import dateFormat from "@/utils/dateFormat";
export default {
    name: "work",
    props: [],
    data: function () {
        return {
            loading: true,
            loadError: false,
            data: [],
            total: 1,
            page: 1,
            per: 10,
            requestId: 0,
            actionPostId: 0,
            pendingLoading: false,
            pendingError: false,
            pendingInvitations: [],
            pendingTotal: 0,
            pendingPage: 1,
            pendingPer: 5,
            pendingDialogVisible: false,
            memberDialogVisible: false,
            selectedUnionPost: null,
            memberActionId: 0,
            roleActionId: 0,
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
                is_active: ~~this.isActive,
            };
        },
        subtype: function () {
            return this.$route.name == "union_active"
                ? this.$t("publish.nav.invitedCreation")
                : this.$t("publish.nav.receivedCreation");
        },
        isActive: function () {
            return this.$route.name == "union_active";
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function (newval) {
                this.loadPosts();
            },
        },
        "$route.name": function () {
            if (this.page !== 1) this.page = 1;
            if (!this.isActive) this.loadPendingInvitations();
        },
        pendingPage: function () {
            if (!this.isActive) this.loadPendingInvitations();
        },
    },
    created: function () {
        if (!this.isActive) this.loadPendingInvitations();
    },
    methods: {
        loadPosts: function () {
            const requestId = ++this.requestId;
            this.loading = true;
            this.loadError = false;
            getUnionPosts(this.params)
                .then((res) => {
                    if (requestId !== this.requestId) return;
                    this.data = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .catch(() => {
                    if (requestId === this.requestId) this.loadError = true;
                })
                .finally(() => {
                    if (requestId === this.requestId) this.loading = false;
                });
        },
        loadPendingInvitations: function () {
            this.pendingLoading = true;
            this.pendingError = false;
            getUnionPosts({
                page: this.pendingPage,
                per: this.pendingPer,
                is_active: 0,
                status: "pending",
            })
                .then((res) => {
                    this.pendingInvitations = res.data?.data?.list || [];
                    this.pendingTotal = res.data?.data?.total || 0;
                })
                .catch(() => {
                    this.pendingError = true;
                })
                .finally(() => {
                    this.pendingLoading = false;
                });
        },
        acceptInvitation: function (item) {
            this.actionPostId = item.post_id;
            acceptUnionInvitation(item.post_id)
                .then(() => {
                    this.$notify({
                        title: this.$t("publish.message.operationSucceeded"),
                        message: this.$t("publish.collaboration.invitationAccepted"),
                        type: "success",
                    });
                    this.afterPendingAction();
                })
                .finally(() => {
                    this.actionPostId = 0;
                });
        },
        rejectInvitation: function (item) {
            this.actionPostId = item.post_id;
            quitUnionPost(item.post_id)
                .then(() => {
                    this.$notify({
                        title: this.$t("publish.message.operationSucceeded"),
                        message: this.$t("publish.collaboration.invitationRejected"),
                        type: "success",
                    });
                    this.afterPendingAction();
                })
                .finally(() => {
                    this.actionPostId = 0;
                });
        },
        afterPendingAction: function () {
            if (this.pendingInvitations.length === 1 && this.pendingPage > 1) {
                this.pendingPage -= 1;
            } else {
                this.loadPendingInvitations();
            }
            this.loadPosts();
        },
        edit: function (type, id) {
            location.href = "/publish/#/" + type + "/" + id;
        },
        postLink: function (type, id) {
            return getLink(type, id);
        },
        acceptedAuthors: function (item) {
            return (item.union_authors || []).filter((author) => !!author.status);
        },
        pendingAuthors: function (item) {
            return (item.union_authors || []).filter((author) => !author.status);
        },
        openMemberDialog: function (item) {
            if (!item.union_authors) item.union_authors = [];
            this.selectedUnionPost = item;
            this.memberDialogVisible = true;
        },
        removeMember: function (author) {
            if (!this.selectedUnionPost) return;
            this.memberActionId = author.author_id;
            removeUnionAuthor(this.selectedUnionPost.post_id, author.author_id)
                .then(() => {
                    const index = this.selectedUnionPost.union_authors.findIndex(
                        (item) => item.author_id === author.author_id
                    );
                    if (index !== -1) this.selectedUnionPost.union_authors.splice(index, 1);
                    this.$notify({
                        title: this.$t("publish.message.operationSucceeded"),
                        message: author.status
                            ? this.$t("publish.collaboration.removeSucceeded")
                            : this.$t("publish.collaboration.invitationCancelled"),
                        type: "success",
                    });
                })
                .finally(() => {
                    this.memberActionId = 0;
                });
        },
        updateMemberRole: function (author) {
            if (!this.selectedUnionPost) return;
            this.$prompt(this.$t("publish.collaboration.rolePlaceholder"), this.$t("publish.collaboration.editRole"), {
                inputValue: author.label || this.$t("publish.collaboration.writer"),
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
                inputValidator: (value) => !!value?.trim(),
                inputErrorMessage: this.$t("publish.collaboration.rolePlaceholder"),
            })
                .then(({ value }) => {
                    this.roleActionId = author.author_id;
                    return updateUnionAuthor(this.selectedUnionPost.post_id, author.author_id, {
                        label: value.trim(),
                    }).then(() => {
                        author.label = value.trim();
                        this.$notify({
                            title: this.$t("publish.message.updateSucceeded"),
                            message: this.$t("publish.collaboration.roleUpdated"),
                            type: "success",
                        });
                    });
                })
                .catch(() => {})
                .finally(() => {
                    this.roleActionId = 0;
                });
        },
        inviter: function (item) {
            return (
                item.inviter_info || {
                    ID: item.union_post_raw?.post_author,
                    display_name:
                        item.union_post_raw?.author || `UID ${item.union_post_raw?.post_author || this.$t("publish.common.unknown")}`,
                    user_avatar: "",
                }
            );
        },
        showAvatar,
        authorLink,
        quit: function (id, i) {
            this.actionPostId = id;
            quitUnionPost(id)
                .then(() => {
                    this.$notify({
                        title: this.$t("publish.message.leaveSucceeded"),
                        message: this.$t("publish.message.leftCollaboration"),
                        type: "success",
                    });
                    this.removeRow(i);
                })
                .finally(() => {
                    this.actionPostId = 0;
                });
        },
        closeCollaboration: function (id, i) {
            this.$confirm(
                this.$t("publish.collaboration.closeCollaborationConfirm"),
                this.$t("publish.collaboration.closeCollaboration"),
                {
                    type: "warning",
                    confirmButtonText: this.$t("publish.common.confirm"),
                    cancelButtonText: this.$t("publish.common.cancel"),
                }
            ).then(
                () => this.performCloseCollaboration(id, i),
                () => {}
            );
        },
        performCloseCollaboration: function (id, i) {
            this.actionPostId = id;
            closeUnionPost(id)
                .then(() => {
                    this.$notify({
                        title: this.$t("publish.message.operationSucceeded"),
                        message: this.$t("publish.collaboration.collaborationClosed"),
                        type: "success",
                    });
                    this.removeRow(i);
                })
                .finally(() => {
                    this.actionPostId = 0;
                });
        },
        removeRow: function (index) {
            this.data.splice(index, 1);
            this.total = Math.max(0, this.total - 1);
            if (!this.data.length && this.page > 1) {
                this.page -= 1;
            }
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        visibleFormat: function (val) {
            const key = ["public", "private", "friends", "password", "paid", "followers"][~~val];
            return this.$t(`publish.visibility.${key || "public"}`);
        },
        statusFormat: function (val) {
            const key = {
                publish: "published",
                draft: "draft",
                pending: "pendingReview",
                dustbin: "deleted",
                private: "private",
            }[val];
            return this.$t(`publish.status.${key || "unknown"}`);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";
.m-dashboard-union {
    .m-dashboard-work-header {
        position: relative;
    }
    .u-pending-entry {
        position: absolute;
        top: -2px;
        right: 4px;
        z-index: 1;
    }
    .u-title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        .u-title { min-width: 0; }
        .u-member-counters { display: flex; gap: 6px; }
        .u-member-counter {
            height: 22px;
            padding: 0 9px;
            border: 1px solid #b3e19d;
            border-radius: 12px;
            background: #f0f9eb;
            color: #529b2e;
            cursor: pointer;
            font-size: 12px;
            line-height: 20px;
            white-space: nowrap;
            &:hover { border-color: #67c23a; background: #e1f3d8; }
            &.is-warning {
                border-color: #f3d19e;
                background: #fdf6ec;
                color: #b88230;
                &:hover { border-color: #e6a23c; background: #faecd8; }
            }
        }
    }
    .u-quit {
        i {
            transform: rotate(-90deg);
        }
    }
    .u-subtype {
        .fz(12px);
        color: #999;
        // .ml(10px);
        font-weight: normal;
        span {
            color: #fba524;
        }
        i {
            padding-right: 10px;
        }
    }
}
.m-union-member-dialog {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 18px 48px rgba(31, 35, 41, 0.16);
    .el-dialog__header {
        margin-right: 0;
        padding: 20px 22px 16px;
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__title {
        color: #303133;
        font-size: 18px;
        font-weight: 600;
    }
    .el-dialog__headerbtn {
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        &:hover { background: #f5f7fa; }
    }
    .el-dialog__body { padding: 16px 22px 22px; }
    .u-work-title {
        margin-bottom: 14px;
        overflow: hidden;
        color: #303133;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .u-member-list {
        overflow: hidden;
        border: 1px solid #ebeef5;
        border-radius: 8px;
    }
    .u-member-item {
        display: grid;
        grid-template-columns: 52px minmax(120px, 1fr) 170px auto;
        align-items: center;
        gap: 12px;
        min-height: 66px;
        padding: 0 12px;
        border-bottom: 1px solid #ebeef5;
        transition: background-color 0.2s ease;
        &:last-child { border-bottom: 0; }
        &:hover { background: #fafbfc; }
    }
    .m-union-member-panel.is-readonly .u-member-item {
        grid-template-columns: 52px minmax(140px, 1fr) minmax(170px, 220px);
    }
    .u-member-user {
        display: flex;
        align-items: center;
        min-width: 0;
        color: #303133;
        font-weight: 500;
        img {
            width: 34px;
            height: 34px;
            margin-right: 10px;
            object-fit: cover;
            border: 1px solid #ebeef5;
            border-radius: 50%;
        }
        span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        &:hover { color: #409eff; }
    }
    .u-member-role {
        display: flex;
        align-items: center;
        min-width: 0;
        height: 32px;
        padding: 0 4px 0 10px;
        border: 1px solid transparent;
        border-radius: 6px;
        background: #f5f7fa;
        transition: border-color 0.2s ease, background-color 0.2s ease;
        .u-role-label { flex: none; color: #909399; font-size: 12px; }
        .u-role-value {
            flex: 1;
            min-width: 0;
            margin-left: 6px;
            overflow: hidden;
            color: #303133;
            font-size: 13px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .el-button {
            flex: none;
            width: 26px;
            height: 26px;
            margin-left: 2px;
            padding: 0;
            color: #909399;
            &:hover { color: #409eff; }
        }
        &:hover {
            border-color: #dcdfe6;
            background: #fff;
        }
    }
    .u-member-status {
        justify-self: start;
        height: auto;
        padding: 0;
        border: 0;
        background: transparent;
        font-size: 12px;
        line-height: 20px;
        &::before {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin-right: 6px;
            border-radius: 50%;
            background: currentColor;
            content: "";
            vertical-align: 1px;
        }
    }
    .u-member-remove {
        height: 32px;
        padding: 0 8px;
        border-color: transparent;
        background: transparent;
        color: #606266;
        font-size: 12px;
        font-weight: 400;
        .el-icon { font-size: 12px; }
        &:hover,
        &:focus {
            border-color: #fbc4c4;
            background: #fef0f0;
            color: #f56c6c;
        }
    }
    @media screen and (max-width: 768px) {
        width: 92% !important;
        .el-dialog__header { padding: 18px 18px 14px; }
        .el-dialog__body { padding: 14px 18px 18px; }
        .u-member-item {
            grid-template-columns: 52px minmax(0, 1fr) auto;
            padding: 12px;
        }
        .m-union-member-panel.is-readonly .u-member-item {
            grid-template-columns: 52px minmax(0, 1fr);
        }
        .u-member-role { grid-column: 1 / -1; width: 100%; box-sizing: border-box; }
    }
}
.m-union-pending-dialog {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 18px 48px rgba(31, 35, 41, 0.16);
    .el-dialog__header {
        margin-right: 0;
        padding: 20px 22px 16px;
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__title {
        color: #303133;
        font-size: 18px;
        font-weight: 600;
    }
    .el-dialog__headerbtn {
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        &:hover { background: #f5f7fa; }
    }
    .el-dialog__body {
        box-sizing: border-box;
        max-height: 430px;
        overflow-y: auto;
        padding: 18px 22px 22px;
    }
    .m-union-invitation-list {
        overflow: hidden;
        border: 1px solid #ebeef5;
        border-radius: 8px;
    }
    .m-union-invitation-item {
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr) auto;
        align-items: center;
        gap: 18px;
        min-height: 72px;
        padding: 0 14px;
        border-bottom: 1px solid #ebeef5;
        transition: background-color 0.2s ease;
        &:last-of-type { border-bottom: 0; }
        &:hover { background: #fafbfc; }
        .u-inviter {
            display: flex; align-items: center; min-width: 0; color: #303133;
            img {
                width: 36px;
                height: 36px;
                margin-right: 10px;
                object-fit: cover;
                border: 1px solid #ebeef5;
                border-radius: 50%;
            }
            span { min-width: 0; }
            small { display: block; color: #909399; font-size: 11px; }
            b { display: block; margin-top: 3px; overflow: hidden; color: #303133; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
            &:hover b { color: #409eff; }
        }
        .u-invitation-work {
            min-width: 0;
            .u-invitation-title {
                display: block;
                overflow: hidden;
                color: #303133;
                font-size: 14px;
                font-weight: 600;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover { color: #409eff; }
            }
            time { display: block; margin-top: 6px; color: #a8abb2; font-size: 11px; }
        }
        .u-invitation-actions {
            display: flex;
            justify-content: flex-end;
            white-space: nowrap;
            .el-button { min-width: 64px; }
        }
    }
    .m-union-pending-pages {
        justify-content: center;
        padding: 16px 0 2px;
    }
    @media screen and (max-width: 768px) {
        width: 92% !important;
        .el-dialog__header { padding: 18px 18px 14px; }
        .el-dialog__body { padding: 14px 18px 18px; }
        .m-union-invitation-item {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 14px;
        }
        .m-union-invitation-item .u-invitation-actions { justify-content: flex-start; }
    }
}
</style>
