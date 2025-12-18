<template>
    <div class="m-publish-box" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="职业攻略">
            <div class="u-actions">
                <publish-revision :enable="true" :post="post"></publish-revision>
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
                <publish-client v-model="post.client" :showMobile="true" :forbid-all="true"></publish-client>
                <!-- 是否适用无界 -->
                <publish-wujie v-if="post.client == 'std'" v-model="post.is_wujie"></publish-wujie>
                <!-- 资料片 -->
                <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
                <!-- 类型 -->
                <publish-tags v-model="post.tags" :options="prefer" label="类型"></publish-tags>
                <!-- 主题 -->
                <publish-tags v-model="post.topics" :options="topics" label="主题"></publish-tags>
                <!-- 技改历史 -->
                <publish-changelog v-if="isChangelog" :post="post" ref="changelog"></publish-changelog>
                <!-- 心法 -->
                <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
                <!-- 跨心法 -->
                <publish-mix-subtype
                    v-if="post.post_subtype == '通用'"
                    v-model="post.mix_subtype"
                    :client="post.client"
                ></publish-mix-subtype>
            </div>

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
                    :subtype="post.post_subtype"
                />
            </div>

            <!-- 附加 -->
            <div class="m-publish-append">
                <el-divider content-position="left">小册</el-divider>
                <publish-collection v-model="post.post_collection" :defaultCollapse="post.collection_collapse">
                    <publish-collection-collapse v-model="post.collection_collapse"></publish-collection-collapse>
                </publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <publish-comment v-model="post.comment">
                    <el-checkbox v-model="visible_for_self" :true-label="1" :false-label="0">仅自己可见</el-checkbox>
                    <el-checkbox v-model="open_white_list" :true-label="1" :false-label="0">开启评论过滤</el-checkbox>
                </publish-comment>
                <publish-gift v-model="post.allow_gift"></publish-gift>
                <el-form-item label="匿名开关">
                    <el-switch v-model="post.anonymous" active-color="#13ce66" :active-value="1" :inactive-value="0" @change="onAnonymousChange"></el-switch>
                </el-form-item>
                <publish-visible v-model="post.visible" :disabled="!!post.anonymous"></publish-visible>
                <publish-guide :data="post"></publish-guide>
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

            <div class="m-publish-doc">
                <el-alert
                    class="u-illegal-alert"
                    v-if="is_illegal"
                    :closable="false"
                    show-icon
                    type="error"
                    title="检测到您的内容存在不合规，将无法发布成功，并有禁言风险。"
                ></el-alert>
                <el-checkbox v-model="hasRead" :true-label="1" :false-label="0"
                    >我已阅读并了解<a href="/notice/119" @click.stop target="_blank">《创作发布规范》</a></el-checkbox
                >
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button type="primary" @click="publish('publish', true)" :disabled="is_illegal || processing || !hasRead"
                    >发 &nbsp;&nbsp; 布</el-button
                >
                <el-button type="plain" @click="publish('draft', false)" :disabled="processing || !hasRead"
                    >保存为草稿</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
// 公共模块
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { bps_pve, bps_pvp } from "@jx3box/jx3box-common/data/post_topics.json";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import Markdown from "@jx3box/jx3box-editor/src/Markdown";
import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
import publish_original from "@/components/publish/publish_original.vue";
import publish_client from "@/components/publish/publish_client.vue";
import publish_zlp from "@/components/publish/publish_zlp";
import publish_xf from "@/components/publish/publish_xf";
import publish_collection from "@/components/publish/publish_collection";
import publish_collection_collapse from "@/components/publish/publish_collection_collapse";
import publish_banner from "@/components/publish/publish_banner";
import publish_comment from "@/components/publish/publish_comment";
import publish_gift from "@/components/publish/publish_gift";
import publish_visible from "@/components/publish/publish_visible";
import publish_tags from "@/components/publish/publish_tags";
import publish_authors from "@/components/publish/publish_authors";
import publish_revision from "@/components/publish/publish_revision.vue";
import publish_at_authors from "@/components/publish/publish_at_authors.vue";
import publish_changelog from "@/components/publish/publish_changelog.vue";
import publish_guide from "@/components/publish/publish_guide.vue";
import publish_mix_subtype from "@/components/publish/publish_mix_subtype.vue";
import publish_wujie from "@/components/publish/publish_wujie.vue";
import publish_reading_history from "@/components/publish/publish_reading_history.vue";

// 数据逻辑
import { push, pull, setPostMeta, pushAdmin } from "@/service/publish/cms.js";
import { appendToCollection } from "@/service/publish/collection.js";
import { AutoSaveMixin } from "@/utils/autoSaveMixin";
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";

export default {
    name: "bps",
    mixins: [AutoSaveMixin, cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        Markdown,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        "publish-client": publish_client,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
        "publish-collection": publish_collection,
        "publish-collection-collapse": publish_collection_collapse,
        // "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-gift": publish_gift,
        "publish-visible": publish_visible,
        "publish-tags": publish_tags,
        "publish-authors": publish_authors,
        "publish-revision": publish_revision,
        "publish-at-authors": publish_at_authors,
        "publish-changelog": publish_changelog,
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
                post_type: "bps",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "通用",
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
                // 标签
                tags: ["PVE"],
                // 主题
                topics: [],

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
                // 匿名发布（0否，1是）
                anonymous: 0,

                mix_subtype: [],
                is_wujie: 0,
            },

            // 选项
            prefer: ["PVE", "PVP"],
        };
    },
    computed: {
        id: function () {
            return ~~this.post.ID || ~~this.$route.params.id;
        },
        data: function () {
            if (this.id) {
                return [this.id, { ...this.post, post_content: this.removeBase64Img(this.post.post_content) }];
            } else {
                return [{ ...this.post, post_content: this.removeBase64Img(this.post.post_content) }];
            }
        },
        topics: function () {
            let topics = [];
            if (this.post.tags?.includes("PVE")) {
                topics.push(...bps_pve);
            }
            if (this.post.tags?.includes("PVP")) {
                topics.push(...bps_pvp);
            }
            let _topics = new Set(topics);
            return Array.from(_topics);
        },
        isChangelog() {
            return this.post?.topics?.some((item) => {
                return item.includes("技改");
            });
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
            const fn = this.from === "admin" ? pushAdmin : push;
            return fn(...this.data)
                .then((res) => {
                    let result = res.data.data;
                    this.atUser(result.ID || this.id);
                    this.setHasRead();

                    if (this.isChangelog) {
                        this.$refs.changelog?.setPostMeta(result.ID || this.id);
                    } else {
                        setPostMeta(result.ID || this.id, "link_changelog", "");
                    }

                    return result;
                })
                .then((result) => {
                    this.afterPublish({ ...result, ID: result.ID || this.id, post_type: "bps" }).finally(() => {
                        this.done(skip, { ...result, ID: result.ID || this.id, post_type: "bps" });
                    });
                    this.setCommentConfig("post", result.ID || this.id);
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
        // 跳转前操作
        afterPublish: function (result) {
            if (!~~result.post_collection) {
                return new Promise((resolve, reject) => {
                    resolve(true);
                });
            }
            return appendToCollection({
                post_type: result.post_type,
                post_id: result.ID,
                post_collection: result.post_collection,
                post_title: result.post_title,
            });
        },
    },
    created: function () {
        const tags = this.$route.query.tags;
        const topics = this.$route.query.topics;
        if (tags) {
            this.post.tags = tags.split(",");
        }
        if (topics) {
            this.post.topics = topics.split(",");
        }
        this.init().then((data) => {
            if (!data) return;
            if (!this.post.tags || !this.post.tags.length) {
                this.post.tags = [];
            }
        });
    },
};
</script>
