<template>
    <div class="m-publish-box p-publish-macro" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="竞技技巧">
            <div class="u-actions">
                <publish-revision :enable="true" :post-id="id"></publish-revision>
                <publish-reading-history v-if="id" :post-id="id" category="posts"></publish-reading-history>
            </div>
        </publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <!-- 客户端 -->
                <publish-client v-model="post.client" :forbidAll="true" :showMobile="true"></publish-client>
                <!-- 是否适用无界 -->
                <publish-wujie v-if="post.client == 'std'" v-model="post.is_wujie"></publish-wujie>
                <!-- 资料片 -->
                <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
                <!-- 心法 -->
                <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
                <!-- 跨心法 -->
                <publish-mix-subtype v-model="post.mix_subtype" :client="post.client" v-if="post.post_subtype == '通用'"></publish-mix-subtype>
                <!-- 其他 -->
                <publish-extend v-model="post"></publish-extend>
            </div>

            <!-- 技能区域 -->
            <publish-pvp v-model="post.post_meta" :client="post.client" :subtype="post.post_subtype" :is-wujie="post.is_wujie"></publish-pvp>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">正文</el-divider>
                <el-radio-group class="m-publish-editormode" size="small" v-model="post.post_mode">
                    <el-radio-button label="tinymce">可视化编辑器</el-radio-button>
                    <el-radio-button label="markdown">Markdown</el-radio-button>
                </el-radio-group>
                <Markdown
                    v-model="post.post_content"
                    :editable="true"
                    :readOnly="false"
                    v-show="post.post_mode == 'markdown'"
                ></Markdown>
                <Tinymce
                    v-model="post.post_content"
                    :attachmentEnable="true"
                    :resourceEnable="true"
                    v-show="!post.post_mode || post.post_mode == 'tinymce'"
                />
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <publish-comment v-model="post.comment">
                    <el-checkbox v-model="visible_for_self" :true-label="1" :false-label="0">仅自己可见</el-checkbox>
                    <el-checkbox v-model="open_white_list" :true-label="1" :false-label="0">开启评论过滤</el-checkbox>
                </publish-comment>
                <publish-visible v-model="post.visible"></publish-visible>
                <publish-guide :data="post"></publish-guide>
                <publish-authors :id="id" :uid="post.post_author"></publish-authors>
            </div>

            <!-- 其它 -->
            <div class="m-publish-other" v-if="isSuperAuthor">
                <cms-banner v-model="post.post_banner"></cms-banner>
                <publish-design-task :data="post"></publish-design-task>
            </div>

            <div class="m-publish-doc">
                <el-alert class="u-illegal-alert" v-if="is_illegal" :closable="false" show-icon type="warning" title="检测到您的内容存在不合规，将无法发布成功，并有禁言风险。"></el-alert>
                <el-checkbox v-model="hasRead" :true-label="1" :false-label="0"
                    >我已阅读并了解<a href="/notice/119" @click.stop target="_blank">《创作发布规范》</a></el-checkbox
                >
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <template v-if="isDraft || isRevision">
                    <el-button type="primary" @click="useDraft" :disabled="processing">使用此版本</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="publish('publish', true)" :disabled="processing || !hasRead"
                        >发 &nbsp;&nbsp; 布</el-button
                    >
                    <el-button type="plain" @click="publish('draft', false)" :disabled="processing || !hasRead"
                        >保存为草稿</el-button
                    >
                </template>
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import lodash from "lodash";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import User from "@jx3box/jx3box-common/js/user.js";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import Markdown from "@jx3box/jx3box-editor/src/Markdown";

// 本地模块
import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
import publish_original from "@/components/publish/publish_original.vue";
import publish_client from "@/components/publish/publish_client.vue";
import publish_zlp from "@/components/publish/publish_zlp";
import publish_xf from "@/components/publish/publish_xf";
import publish_pvp from "@/components/publish/publish_pvp";
import publish_banner from "@/components/publish/publish_banner";
import publish_comment from "@/components/publish/publish_comment";
import publish_visible from "@/components/publish/publish_visible";
import publish_authors from "@/components/publish/publish_authors";
import publish_revision from "@/components/publish/publish_revision.vue";
import publish_extend from "@/components/publish/publish_extend.vue";
import publish_guide from "@/components/publish/publish_guide.vue";
import publish_mix_subtype from "@/components/publish/publish_mix_subtype.vue";
import publish_wujie from "@/components/publish/publish_wujie.vue";
import publish_reading_history from "@/components/publish/publish_reading_history.vue";

// 数据逻辑
import { push, pushAdmin } from "@/service/publish/cms.js";
import { appendToCollection } from "@/service/publish/collection.js";
import { AutoSaveMixin } from "@/utils/autoSaveMixin";
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";

export default {
    name: "pvp_skill",
    mixins: [AutoSaveMixin, cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        Markdown,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
        "publish-pvp": publish_pvp,
        // "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-visible": publish_visible,
        "publish-authors": publish_authors,
        "publish-revision": publish_revision,
        "publish-client": publish_client,
        "publish-extend": publish_extend,
        "publish-guide": publish_guide,
        "publish-mix-subtype": publish_mix_subtype,
        "publish-wujie": publish_wujie,
        "publish-reading-history": publish_reading_history,
    },
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
                post_type: "pvp",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "通用",
                // 自定义字段
                post_meta: {
                    talent: "",
                    talent_desc: "", // 奇穴讲解
                    content: "",
                    data: [
                        {
                            name: "",
                            sq: [],
                            desc: "",
                        },
                    ],
                },
                // 关联的配装
                pz: [],
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
                collection_collapse: 0,

                // 评论开关（0开启|默认，1关闭）
                comment: 0,
                // 评论是否自己可见（0否|默认，1是）
                comment_visible: 0,
                // 礼物开关（0关闭|默认，1开启）
                allow_gift: 1,

                // 阅读权限（0公开，1仅自己，2亲友，3密码，4付费，5粉丝）
                visible: 0,

                // 是否包含视频
                include_video: 0,

                mix_subtype: [],
                is_wujie: 0,
            },
        };
    },
    computed: {
        id: function () {
            return this.isRevision ? ~~this.post.post_id : ~~this.post.ID;
        },
        data: function () {
            if (this.id) {
                return [this.id, {...this.post, post_content: this.removeBase64Img(this.post.post_content)}];
            } else {
                return [{...this.post, post_content: this.removeBase64Img(this.post.post_content)}];
            }
        },
        pz_query: function () {
            let mount_id = xfmap[this.post.post_subtype]?.id;
            let _query = {};
            if (mount_id) _query = { mount: mount_id };
            return _query;
        },
    },
    watch: {
        "$route.query": {
            handler: function (val) {
                if (val?.subtype) {
                    this.post.post_subtype = val.subtype;
                }
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        const id = this.$route.params.id;
        id && this.loadCommentConfig("post", id);
    },
    methods: {
        // 初始化
        init: function () {
            sessionStorage.removeItem("atAuthor");
            // 尝试加载
            return this.loadData().then(() => {
                // 加载成功后执行自动保存逻辑（含本地草稿、本地缓存、云端历史版本）
                this.autoSave();
            });
        },
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;

            // 补充心法id
            this.build();

            this.post.post_meta.talent_desc = this.post.post_meta?.talent_desc?.replace(/\n{2,}/g, "\n") || "";
            this.post.post_meta.content = this.post.post_meta?.content?.replace(/\n{2,}/g, "\n") || "";
            this.post.post_meta?.data.forEach((item) => {
                item.desc = item.desc.replace(/\n{2,}/g, "\n") || "";
            });

            const fn = this.from === "admin" ? pushAdmin : push;

            return fn(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    this.setHasRead();
                    return result;
                })
                .then((result) => {
                    this.afterPublish({...result, ID: result.ID || this.id, post_type: "pvp"}).finally(() => {
                        this.done(skip, {...result, ID: result.ID || this.id, post_type: "pvp"});
                    });
                    this.setCommentConfig("post", result.ID || this.id);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        // 搜索扩展
        build: function () {
            this.post.meta_2 = ~~lodash.get(xfmap[this.post.post_subtype], "id") || 0;
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
                    location.href = "/pvp/" + result?.ID;
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
        // 跳转前操作
        afterPublish: function (result) {
            if (!~~result.post_collection)
                return new Promise((resolve, reject) => {
                    resolve(true);
                });
            return appendToCollection({
                post_type: result.post_type,
                post_id: result.ID,
                post_collection: result.post_collection,
                post_title: result.post_title,
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/pvp.less";
</style>
