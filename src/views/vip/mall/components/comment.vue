<template>
    <div class="m-good-comment">
        <template v-if="list && list.length">
            <div class="m-item" v-for="(item, i) in list" :key="i">
                <a class="m-comment-avatar" :href="userHref(item.user_info)" target="_blank">
                    <el-avatar
                        class="u-avatar-pic"
                        shape="circle"
                        :size="48"
                        :src="(item.user_info && item.user_info.avatar) || default_avatar"
                    ></el-avatar>
                    <i class="u-avatar-frame xs" v-if="item.user_info && item.user_info.user_avatar_frame">
                        <img :src="frameUrl(item.user_info.user_avatar_frame)" />
                    </i>
                </a>
                <div class="m-comment-info">
                    <div class="m-user-comment">
                        <a :href="userHref(item.user_info)" target="_blank">
                            {{ (item.user_info && item.user_info.display_name) || "匿名" }}
                        </a>
                        <div class="u-comment">
                            <span class="u-content">{{ item.comment }}</span>
                            <span class="u-time"><i class="el-icon-time"></i> {{ item.comment_time }}</span>
                        </div>
                        <div class="u-append-comment" v-if="item.add_comment">
                            <span class="u-label">追评: </span>
                            <span>{{ item.add_comment }}</span>
                            <span class="u-time"><i class="el-icon-time"></i>{{ item.add_comment_time }} </span>
                        </div>
                    </div>
                    <div class="m-admin-comment">
                        <el-button
                            type="text"
                            icon="el-icon-chat-round"
                            size="mini"
                            @click="showInput = !showInput"
                            v-if="!item.reply && is_admin"
                        >
                            盒子娘回复
                        </el-button>
                        <el-button
                            type="text"
                            v-if="is_admin"
                            icon="el-icon-delete"
                            size="mini"
                            @click="delComment(item.id)"
                        >
                            删除
                        </el-button>
                        <div class="m-input" v-if="showInput">
                            <el-input type="textarea" placeholder="请输入回复内容" v-model="content"> </el-input>
                            <div class="m-button">
                                <el-button type="primary" size="mini" @click="reply(item.id)">提交</el-button>
                                <el-button type="text" size="mini" @click="showInput = false">收起</el-button>
                            </div>
                        </div>
                        <div class="m-reply" v-if="item.reply">
                            <el-avatar class="u-avatar-pic" shape="circle" :size="36" :src="admin_avatar"></el-avatar>
                            <div class="u-comment">
                                <span class="u-content"> {{ item.reply }}</span>
                                <span class="u-time"><i class="el-icon-time"></i> {{ item.reply_time }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="m-no-item">~ 暂无评论 ~</div>
    </div>
</template>

<script>
import { __imgPath, __cdn, __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { getGoodsRate, delGoodsRate, goodsRate } from "@/service/vip/mall";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "GoodsComment",
    props: ["id"],

    data: function () {
        return {
            list: [],
            pageSize: 10,
            index: 1,
            total: 0,

            showInput: false,
            content: "",
        };
    },
    computed: {
        default_avatar() {
            return __cdn + "/image/common/avatar.png";
        },
        admin_avatar() {
            return __cdn + "upload/post/2022/5/18/8_2301067.png";
        },
        is_admin() {
            return User.isLogin() && User.isEditor();
        },
    },

    methods: {
        frameUrl(frame) {
            return frame ? __imgPath + `avatar/images/${frame}/${frame}.svg` : "";
        },
        userHref(user_info) {
            return user_info ? __Root + "author/" + user_info.id : "";
        },
        load() {
            getGoodsRate({ goods_id: this.id }).then((res) => {
                this.list = res.data.data.list;
            });
        },
        reply(id) {
            goodsRate(id, { content: this.content }).then((res) => {
                this.$message({
                    message: "盒子娘评论成功",
                    type: "success",
                });
                this.showInput = false
                this.list = this.list.map((item) => {
                    if (item.id == id) item.reply = this.content;
                    return item;
                });
            });
        },
        delComment(id) {
            this.$confirm("确定删除该评论吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delGoodsRate(id).then(() => {
                        this.$message({
                            message: "删除评论成功",
                            type: "success",
                        });
                        this.list = this.list.filter((item) => item.id !== id);
                    });
                })
                .catch(() => {});
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_comment.less";
</style>
