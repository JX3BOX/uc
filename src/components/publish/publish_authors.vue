<template>
    <div class="m-publish-authors" v-if="id && isSuper">
        <el-form-item :label="$t('publish.nav.collaboration')">
            <div class="u-list">
                <div class="u-item" v-for="(item, i) in list" :key="i">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('publish.collaboration.pendingConfirmation')"
                        placement="top"
                        v-if="!item.status"
                    >
                        <i class="u-status el-icon-loading"></i>
                    </el-tooltip>
                    <img class="u-avatar" :src="showAvatar(item.post_author_info.user_avatar)" />
                    <span class="u-name">
                        {{ item.post_author_info.display_name }}
                        <span class="u-label">({{ item.label || $t("publish.collaboration.writer") }})</span>
                    </span>
                    <el-tooltip class="item" effect="dark" :content="$t('publish.collaboration.editRole')" placement="top">
                        <i class="u-edit el-icon-edit" @click="update(item)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('publish.common.remove')" placement="top">
                        <i class="u-delete el-icon-delete" @click="remove(item, i)"></i>
                    </el-tooltip>
                </div>
                <el-button plain @click="openPop" type="primary" size="small">+ {{ $t("publish.collaboration.addAuthor") }}</el-button>
            </div>
            <UserPop :title="$t('publish.collaboration.addUser')" v-model="visible" @confirm="addAuthor" />
        </el-form-item>
    </div>
</template>

<script>
import UserPop from "@jx3box/jx3box-ui/src/author/UserPop.vue";
import { addUnionAuthor, getUnionAuthors, updateUnionAuthor, removeUnionAuthor } from "@/service/publish/union.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "PublishAuthors",
    props: ["id", "uid"],
    components: {
        UserPop,
    },
    data: function () {
        return {
            list: [],
            visible: false,
        };
    },
    computed: {
        isSuper: function () {
            return User.getInfo().uid == this.uid;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                val && this.loadAuthors();
            },
        },
    },
    methods: {
        openPop: function () {
            this.visible = true;
        },
        addAuthor: function (userdata) {
            addUnionAuthor(this.id, userdata.ID).then((res) => {
                this.$notify({
                    title: this.$t("publish.message.addSucceeded"),
                    message: this.$t("publish.collaboration.addSucceeded"),
                    type: "success",
                });
                this.list.push({
                    post_author_info: userdata,
                    label: this.$t("publish.collaboration.writer"),
                    status: 0,
                });
            });
        },
        loadAuthors: function () {
            getUnionAuthors(this.id).then((res) => {
                this.list = res.data?.data?.other_authors;
            });
        },
        update: function (item) {
            this.$prompt(this.$t("publish.collaboration.rolePlaceholder"), this.$t("publish.common.prompt"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                cancelButtonText: this.$t("publish.common.cancel"),
            }).then(({ value }) => {
                updateUnionAuthor(this.id, item.post_author_info.ID, {
                    label: value,
                    r_edit: 1,
                }).then(() => {
                    item.label = value;
                    this.$notify({
                        title: this.$t("publish.message.updateSucceeded"),
                        message: this.$t("publish.collaboration.roleUpdated"),
                        type: "success",
                    });
                });
            }).catch(() => {});
        },
        remove: function (item, i) {
            removeUnionAuthor(this.id, item.post_author_info.ID).then((res) => {
                this.$notify({
                    title: this.$t("publish.message.deleteSucceeded"),
                    message: this.$t("publish.collaboration.removeSucceeded"),
                    type: "success",
                });
                this.list.splice(i, 1);
            });
        },
        showAvatar: function (val) {
            return showAvatar(val);
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.m-publish-authors {
    .el-form-item__content {
        .fz(14px,16px) !important;
    }

    .u-list {
        padding: 6px 0;
        // display: flex;
        .clearfix;
        .el-button,
        .u-item {
            .fl;
        }
        .u-item {
            border: 1px solid #dcdfe6;
            padding: 2px 8px;
            // background-color: #f5f7fa;
            .r(3px);
            .mr(10px);
            // flex-shrink: 0;
            .mb(10px);
            .h(32px);
            box-sizing: border-box;
        }
        .u-avatar {
            .size(24px);
            .y;
            .mr(5px);
            .r(100%);
        }
        .u-name {
            .mr(5px);
            .bold;
        }
        .u-label {
            .fz(12px);
            color: #6f81fb;
            font-weight: normal;
        }
        .u-delete,
        .u-edit {
            // .ml(10px);
            color: #888;
            .pointer;
            padding: 5px 4px;
        }
        .u-edit:hover {
            color: @color-link;
        }
        .u-delete:hover {
            color: #f00;
        }

        .u-status {
            .mr(5px);
            color: @primary;
        }
    }
}
</style>
