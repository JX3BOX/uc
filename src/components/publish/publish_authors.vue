<template>
    <div class="m-publish-authors" v-if="id && isSuper">
        <el-form-item label="联合创作">
            <div class="u-list">
                <div class="u-item" v-for="(item,i) in list" :key="i">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="等待被邀请者确认"
                        placement="top"
                        v-if="!item.status"
                    >
                        <i class="u-status el-icon-loading"></i>
                    </el-tooltip>
                    <img class="u-avatar" :src="item.post_author_info.user_avatar | showAvatar" />
                    <span class="u-name">
                        {{item.post_author_info.display_name}}
                        <span
                            class="u-label"
                        >({{item.label || '撰稿'}})</span>
                    </span>
                    <el-tooltip class="item" effect="dark" content="修改备注" placement="top">
                        <i class="u-edit el-icon-edit" @click="update(item)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="移除" placement="top">
                        <i class="u-delete el-icon-delete" @click="remove(item,i)"></i>
                    </el-tooltip>
                </div>
                <el-button plain size="small" @click="openPop" type="primary">+ 添加联合创作者</el-button>
            </div>
            <UserPop title="添加用户" v-model="visible" @confirm="addAuthor" />
        </el-form-item>
    </div>
</template>

<script>
import UserPop from "@jx3box/jx3box-common-ui/src/author/UserPop.vue";
import {
    addUnionAuthor,
    getUnionAuthors,
    updateUnionAuthor,
    removeUnionAuthor,
} from "@/service/publish/union.js";
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
                    title: "添加成功",
                    message: "联合创作者添加成功",
                    type: "success",
                });
                this.list.push({
                    post_author_info: userdata,
                    label: "撰稿",
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
            this.$prompt("修改展示项，例如：撰稿/修订/主创/校稿..", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                updateUnionAuthor(this.id, item.post_author_info.ID, {
                    label: value,
                    r_edit: 1,
                }).then(() => {
                    item.label = value;
                    this.$notify({
                        title: "修改成功",
                        message: "备注更新成功",
                        type: "success",
                    });
                });
            });
        },
        remove: function (item, i) {
            removeUnionAuthor(this.id, item.post_author_info.ID).then((res) => {
                this.$notify({
                    title: "删除成功",
                    message: "成功移除联合创作者",
                    type: "success",
                });
                this.list.splice(i, 1);
            });
        },
    },
    filters: {
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
        .el-button,.u-item{
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

        .u-status{
            .mr(5px);
            color:@primary;
        }
    }
}
</style>
