/dashboard<template>
    <uc
        class="m-dashboard-frame m-dashboard-skin"
        icon="el-icon-bell"
        title="我的消息"
        :tab-list="tabList"
        :msg-change-count="msgChangeCount"
    >
        <div class="m-dashboard m-dashboard-work m-dashboard-msg">
            <div class="m-dashboard-msg-header">
                <el-input
                    class="m-dashboard-work-search"
                    placeholder="请输入搜索内容"
                    v-model="keyword"
                    @keyup.enter.native="changePage(1)"
                >
                    <template slot="prepend">关键词</template>
                    <el-button slot="append" icon="el-icon-search" @click="changePage(1)"></el-button>
                </el-input>
                <el-button class="u-read-all" type="primary" @click="read(null)">
                    <i class="el-icon el-icon-check"></i>
                    <span v-text="'全部设为已读'"></span>
                </el-button>
            </div>
            <ul class="m-dashboard-box-list" v-if="data.length">
                <li v-for="(item, i) in data" :key="i" :class="{ on: item.read == 1 }">
                    <div class="u-primary">
                        <span class="u-content">
                            <span class="u-label u-hasChecked" v-if="item.read == 1">已读</span>
                            <span class="u-label u-hasNotChecked" v-else>未读</span>
                            <span v-html="item.content"></span>
                            <span
                                class="u-msg-detail"
                                v-if="item.ext_type === 'comments' && item.ext_type_id > 0"
                                @click="handleDetail(item.ext_type_id)"
                            >
                                <i class="el-icon-view"></i>
                                <span>详情</span>
                            </span>
                            <a
                                :href="msgLink(item)"
                                class="u-msg-link"
                                v-if="hasLink(item)"
                                @click="read(item)"
                                target="_blank"
                            >
                                <i class="el-icon-link"></i> 查看
                            </a>
                        </span>
                        <time class="u-time">
                            <i class="el-icon-phone-outline"></i>
                            {{ dateFormat(~~item.created) }}
                        </time>
                    </div>
                    <el-button-group class="u-action">
                        <el-button
                            size="mini"
                            icon="el-icon-check"
                            title="设为已读"
                            @click="read(item)"
                            :disabled="item.read == 1"
                        ></el-button>
                        <el-button size="mini" icon="el-icon-delete" title="删除" @click="del(item)"></el-button>
                    </el-button-group>
                </li>
            </ul>
            <el-alert
                v-else
                class="m-dashboard-box-null"
                title="没有找到相关条目"
                type="info"
                center
                show-icon
            ></el-alert>
            <el-pagination
                v-if="paginationShow"
                class="m-dashboard-box-pages"
                background
                :hide-on-single-page="true"
                @current-change="changePage"
                :current-page.sync="page"
                :page-size.sync="limit"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>

        <CommentDetail v-if="visible" :visible="visible" :id="id" @close="close"></CommentDetail>
    </uc>
</template>

<script>
import { msgTab } from "@/assets/data/dashboard/tabs.json";
import { getMsgs, readMsg, removeMsg, readAll, getCommentMsgDetail } from "@/service/dashboard/msg.js";
import { showTime } from "@jx3box/jx3box-common/js/moment.js";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import mitt from "@/utils/mitt";
import { Base64 } from "js-base64";
const ignoreLinkTypes = ["namespace"];

// components
import uc from "@/components/dashboard/uc.vue";
import CommentDetail from "@/components/dashboard/msg/CommentDetail.vue";

const redirectMap = {
    team_member_list: "/team/my/org/{id}?tab=manage-member",
}

export default {
    name: "msg",
    components: {
        uc,
        CommentDetail,
    },
    data: function () {
        return {
            keyword: "",
            type: "all",
            data: [],
            unread_total: 0,
            total: 1,
            page: 1,
            limit: 15,
            paginationShow: true,

            tabList: msgTab,

            msgChangeCount: 0,

            id: "",
            visible: false,
        };
    },
    methods: {
        close() {
            this.id = "";
            this.visible = false;
        },
        handleDetail(id) {
            this.id = id;
            this.visible = true;
        },
        changePage: function (i = 1) {
            this.$router.push({
                name: "msg",
                query: {
                    page: i,
                },
            });
            this.page = i;
            this.paginationShow = false;
            getMsgs({
                content: this.keyword,
                index: i,
                pageSize: this.limit,
            })
                .then((res) => {
                    this.unread_total = res.data.data.unread_count;
                    this.total = res.data.data.page.total;
                    this.data = res.data.data.list || [];
                    this.paginationShow = true;
                })
                .catch((err) => {
                    this.$message.error(err.message);
                    this.paginationShow = true;
                });
        },
        read(item) {
            this.msgChangeCount = 0;
            if (item) {
                readMsg(item.ID).then((res) => {
                    if (res.data.code === 0) {
                        if (!item.read) {
                            this.msgChangeCount = -1;
                        }
                        item.read = 1;
                    } else {
                        this.$notify.error({ title: res.data.message });
                    }
                });
            } else {
                readAll().then((res) => {
                    if (res.data.code === 0) {
                        this.changePage(this.page);
                        this.msgChangeCount = 1; // 表示全部已读

                        mitt.emit("refresh");
                    } else {
                        this.$notify.error({ title: res.data.message });
                    }
                });
            }
        },
        del(item) {
            removeMsg(item.ID).then((res) => {
                if (res.data.code === 0) {
                    item.deleted = Math.round(new Date() / 1000);
                } else {
                    this.$notify.error({ title: res.data.message });
                }
            });
        },
        dateFormat: function (val) {
            return showTime(new Date(val * 1000));
        },
        hasLink: function (item) {
            if (ignoreLinkTypes.includes(item.source_type)) {
                return false;
            } else if (item.redirect) {
                return true;
            } else if (item.source_id && item.source_type) {
                return true;
            }
            return false;
        },
        msgLink: function (item) {
            let { source_id, source_type, type, subtype, redirect, user_id } = item;

            if (redirect) {
                if (redirect.startsWith("http") || redirect.startsWith("/")) {
                    return redirect;
                } else {
                    // 特殊处理
                    if (redirectMap[redirect]) {
                        const url = redirectMap[redirect];
                        return url.replace("{id}", source_id);
                    }
                    return "/" + redirect?.split("_")?.join("/");
                }
            } else {
                // 贺卡处理
                if (source_type == "birthday") {
                    return `/author/birthday?code=` + Base64.encode(source_id);
                    // 特殊回调
                } else if (source_type == "callback") {
                    let info = encodeURIComponent(Base64.encode(JSON.stringify(item)));
                    return `/dashboard/callback/${type}/${subtype}?info=${info}`;
                    // 通用资源
                } else {
                    return getLink(source_type, source_id);
                }
            }
        },
    },
    mounted: function () {
        this.changePage(Number(this.$route.query.page || 1));
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/dashboard/msg.less";
</style>
