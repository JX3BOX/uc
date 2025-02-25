<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="公告资讯"></publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 客户端 -->
                <publish-client v-model="post.client"></publish-client>
                <publish-subtype v-model="post.post_subtype" :options="notice_types"></publish-subtype>
            </div>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">正文</el-divider>
                <Tinymce
                    v-model="post.post_content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    v-show="!post.post_mode || post.post_mode == 'tinymce'"
                />
            </div>

            <!-- 附加 -->
            <div class="m-publish-append">
                <el-divider content-position="left">附加</el-divider>
                <publish-excerpt v-model="post.post_excerpt"></publish-excerpt>
                <!-- <publish-collection v-model="post.post_collection"></publish-collection> -->
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <publish-comment v-model="post.comment"></publish-comment>
                <publish-gift v-model="post.allow_gift"></publish-gift>
                <publish-visible v-model="post.visible"></publish-visible>
                <publish-authors :id="id" :uid="post.post_author"></publish-authors>
            </div>

            <!-- 临时 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">临时</el-divider>
                <publish-at-authors></publish-at-authors>
            </div>

            <!-- 其它 -->
            <div class="m-publish-other" v-if="isSuperAuthor">
                <cms-banner v-model="post.post_banner"></cms-banner>
                <publish-design-task :data="post"></publish-design-task>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button
                    type="primary"
                    @click="publish('publish',true)"
                    :disabled="processing"
                >发 &nbsp;&nbsp; 布</el-button>
                <el-button type="plain" @click="publish('draft',false)" :disabled="processing">保存为草稿</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import { getLink } from "@jx3box/jx3box-common/js/utils";
import notice_types from '@/assets/data/publish/notice.json'

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
import publish_client from "@/components/publish/publish_client.vue";
import publish_excerpt from "@/components/publish/publish_excerpt";
import publish_banner from "@/components/publish/publish_banner";
import publish_comment from "@/components/publish/publish_comment";
import publish_gift from "@/components/publish/publish_gift";
import publish_visible from "@/components/publish/publish_visible";
import publish_subtype from "@/components/publish/publish_subtype";
import publish_authors from "@/components/publish/publish_authors";
import publish_at_authors from "@/components/publish/publish_at_authors";

import { atAuthorMixin } from "@/utils/atAuthorMixin";

// 数据逻辑
import { push, pull } from "@/service/publish/cms.js";

export default {
    name: "notice",
    components: {
        Tinymce,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-client": publish_client,
        "publish-excerpt": publish_excerpt,
        // "publish-collection": publish_collection,
        // "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-gift": publish_gift,
        "publish-visible": publish_visible,
        "publish-subtype": publish_subtype,
        "publish-authors": publish_authors,
        "publish-at-authors": publish_at_authors
    },
    mixins: [atAuthorMixin],
    data: function () {
        return {
            // 加载状态
            loading: false,
            // 发布状态
            processing: false,

            // 内容
            post: {
                // 文章ID
                ID: "",
                // 状态：publish公开、private私有、draft草稿、dustbin删除
                post_status: "publish",
                // 类型
                post_type: "notice",

                // 标题
                post_title: "",
                // 子类型
                post_subtype: "1",
                // 自定义字段
                post_meta: {},
                // 内容
                post_content: "",
                // 编辑模式(会影响文章详情页渲染规则)
                post_mode: "tinymce",

                // 是否原创
                original: 0,
                // 客户端：std正式服、origin怀旧服
                client: "std",
                // 语言：cn简体、tr繁体
                lang: "cn",
                // 资料片
                zlp: "",

                // 摘要
                post_excerpt: "",
                // 海报
                post_banner: "",
                // 小册
                post_collection: "",

                // 评论开关（0开启|默认，1关闭）
                comment: 0,
                // 礼物开关（0关闭|默认，1开启）
                allow_gift: 1,

                // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
                visible: 0,
            },

            // 选项
            notice_types,
        };
    },
    computed: {
        id: function () {
            return this.isRevision ? ~~this.post.post_id : ~~this.post.ID;
        },
        data: function () {
            if (this.id) {
                return [this.id, this.post];
            } else {
                return [this.post];
            }
        },
    },
    methods: {
        // 加载
        init: function () {
            this.loading = true;
            sessionStorage.removeItem("atAuthor")
            // 加载文章
            if (this.$route.params.id) {
                return pull(this.$route.params.id)
                    .then((res) => {
                        this.post = res.data.data;
                        return res.data.data;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                return new Promise((resolve, reject) => {
                    resolve();
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;
            push(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    this.atUser(result.ID)
                    this.done(skip, result);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 完成
        done: function (skip, result) {
            if (skip) {
                // 提醒
                this.$message({
                    message: "发布成功",
                    type: "success",
                });
                // 跳转
                setTimeout(() => {
                    location.href = getLink(result.post_type, result.ID);
                }, 500);
            } else {
                // 提醒
                this.$notify({
                    title: "保存成功",
                    message: "云端草稿保存成功",
                    type: "success",
                });
                // 路由
                this.post = result;
                if (!this.$route.params.id) {
                    this.$router.push({
                        params: {
                            id: result.ID,
                        },
                    });
                }
            }
        },
    },
    created: function () {
        this.post.client = this.$store.state.client;
        this.init()
    },
    watch: {
        "$route.params.id": function (val) {
            val && this.init();
        },
    },
};
</script>

