<template>
    <div class="m-publish-box p-publish-macro" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="云端宏">
            <div class="u-actions">
                <publish-revision :enable="true" :post="post"></publish-revision>
                <publish-reading-history v-if="id" :post-id="id" category="posts"></publish-reading-history>
            </div>
        </publish-header>
        <span v-html="macro_publish_ac" v-if="macro_publish_ac"></span>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.post_title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <!-- 客户端 -->
                <!-- <publish-client v-model="post.client" :forbidAll="true"></publish-client> -->
                <!-- 是否适用无界 -->
                <publish-wujie v-if="post.client == 'std'" v-model="post.is_wujie"></publish-wujie>
                <!-- 语言：简体/繁体 -->
                <publish-lang v-model="post.lang"></publish-lang>
                <!-- 资料片 -->
                <publish-zlp v-model="post.zlp" :client="post.client"></publish-zlp>
                <!-- 心法 -->
                <publish-xf v-model="post.post_subtype" :client="post.client"></publish-xf>
            </div>

            <!-- 宏区域 -->
            <publish-macro v-if="!post.is_wujie" v-model="post.post_meta" :client="post.client">
                <!-- 配装 -->
                <publish-pz v-model="post.pz" :limit="8" :query="pz_query">
                    <span class="u-pz-tip" slot="prepend">
                        <i class="el-icon-warning-outline"></i> 展示你推荐的配装（不超过8个，非必选）
                    </span>
                </publish-pz>
                <template #pre-prepend v-if="pz_query && pz_query.mount">
                    <pz-haste :client="post.client" :mount="pz_query.mount"></pz-haste>
                </template>
            </publish-macro>

            <wujie-skill-sequence v-model="post.post_meta" :subtype="post.post_subtype" v-else></wujie-skill-sequence>

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
                    :subtype="post.post_subtype"
                    v-show="!post.post_mode || post.post_mode == 'tinymce'"
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
                <template v-if="isDraft || isRevision">
                    <el-button type="primary" @click="useDraft" :disabled="processing">使用此版本</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="publish('publish', true)" :disabled="is_illegal || processing || !hasRead"
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
import { getLink } from "@jx3box/jx3box-common/js/utils";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import User from "@jx3box/jx3box-common/js/user.js";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import Markdown from "@jx3box/jx3box-editor/src/Markdown";
import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
import publish_original from "@/components/publish/publish_original.vue";
import publish_client from "@/components/publish/publish_client.vue";
import publish_lang from "@/components/publish/publish_lang";
import publish_zlp from "@/components/publish/publish_zlp";
import publish_xf from "@/components/publish/publish_xf";
import publish_macro from "@/components/publish/publish_macro";
import wujie_skill_sequence from "@/components/publish/wujie_skill_sequence.vue";
import publish_collection from "@/components/publish/publish_collection";
import publish_collection_collapse from "@/components/publish/publish_collection_collapse";
import publish_comment from "@/components/publish/publish_comment";
import publish_gift from "@/components/publish/publish_gift";
import publish_visible from "@/components/publish/publish_visible";
import publish_authors from "@/components/publish/publish_authors";
import publish_pz from "@/components/publish/publish_pz";
import publish_revision from "@/components/publish/publish_revision.vue";
import publish_at_authors from "@/components/publish/publish_at_authors.vue";
import pz_haste from "@/components/publish/pz_haste.vue";
import publish_guide from "@/components/publish/publish_guide.vue";
import publish_wujie from "@/components/publish/publish_wujie.vue";
import publish_reading_history from "@/components/publish/publish_reading_history.vue";

// 数据逻辑
import { push, pushAdmin, getBreadCrumb } from "@/service/publish/cms.js";
import { syncRedis } from "@/service/publish/macro.js";
import { appendToCollection } from "@/service/publish/collection.js";
import { AutoSaveMixin } from "@/utils/autoSaveMixin";
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";

export default {
    name: "macro",
    mixins: [AutoSaveMixin, cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        Markdown,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-original": publish_original,
        // "publish-client": publish_client,
        "publish-lang": publish_lang,
        "publish-zlp": publish_zlp,
        "publish-xf": publish_xf,
        "publish-macro": publish_macro,
        "publish-collection": publish_collection,
        "publish-collection-collapse": publish_collection_collapse,
        // "publish-banner": publish_banner,
        "publish-comment": publish_comment,
        "publish-gift": publish_gift,
        "publish-visible": publish_visible,
        "publish-authors": publish_authors,
        "publish-pz": publish_pz,
        "publish-revision": publish_revision,
        "publish-at-authors": publish_at_authors,
        "pz-haste": pz_haste,
        "publish-guide": publish_guide,
        "publish-wujie": publish_wujie,
        "wujie-skill-sequence": wujie_skill_sequence,
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
                post_type: "macro",

                // 标题
                post_title: "",
                // 子类型：心法、副本名等
                post_subtype: "通用",
                // 自定义字段
                post_meta: {
                    data: [
                        {
                            name: "",
                            icon: 13,
                            talent: "",
                            macro: "",
                            speed: "",
                            equip: "",
                            equip_type: "jx3box",
                            desc: "",
                            sq: [],
                            mark: "",
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
                // 匿名开关（0关闭|默认，1开启）
                anonymous: 0,

                is_wujie: 0,
            },
            macro_publish_ac: "",
        };
    },
    computed: {
        id: function () {
            return ~~this.post.ID || ~~this.$route.params.id;
        },
        pz_query: function () {
            let mount_id = xfmap[this.post.post_subtype]?.id;
            let _query = {};
            if (mount_id) _query = { mount: mount_id };
            return _query;
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
        // 宏数据验证
        checkMacro: function () {
            let data = this.post.post_meta.data;
            let result = true;
            const str = this.post?.is_wujie ? "序列" : "宏";
            data.forEach((item, index) => {
                if (!item.name) {
                    this.$notify({
                        title: "提醒",
                        message: `第${index + 1}个${str}没有填写名称`,
                        type: "warning",
                    });
                    result = false;
                }
            });
            return result;
        },
        // 发布
        publish: function (status, skip) {
            this.post.post_status = status;
            this.processing = true;

            // 验证
            if (!this.checkMacro()) {
                this.processing = false;
                return;
            }

            // 补充心法id
            this.build();

            const data = this.buildExtend(lodash.cloneDeep(this.post));
            let _post = [];

            if (this.id) {
                _post = [this.id, data];
            } else {
                _post = [data];
            }

            const fn = this.from === "admin" ? pushAdmin : push;

            return fn(..._post)
                .then((res) => {
                    let result = res.data.data;
                    syncRedis({ ...result, ...data }).catch((err) => {
                        console.log("[Redis同步作业失败]", err);
                    });
                    this.atUser(result.ID || this.id);
                    this.setHasRead();
                    return result;
                })
                .then((result) => {
                    this.afterPublish({ ...result, ID: result.ID || this.id, post_type: "macro" }).finally(() => {
                        this.done(skip, { ...result, ID: result.ID || this.id, post_type: "macro" });
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
        // 扩展内容
        buildExtend: function (data) {
            // 包含 “自用”，修改visible为1
            if (
                !data.post_title ||
                data.post_title?.indexOf("自用") > -1 ||
                (!data.is_wujie && data.post_meta?.data?.every((item) => !item.macro)) ||
                (data.is_wujie && data.post_meta?.data?.every((item) => !item.sq?.length))
            ) {
                data.visible = 1;
            }
            return data;
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
        loadAc() {
            getBreadCrumb("macro_publish_ac").then((res) => {
                this.macro_publish_ac = res.data?.data?.html || "";
            });
        },
    },
    created: function () {
        this.loadAc();
        // this.init().then((data) => {
        //     if (!data) return;
        //     // 迁移兼容
        //     if (!this.post.zlp && data.meta_1) {
        //         this.post.zlp = data.meta_1;
        //     }
        //     if (!this.post.lang && data.meta_4) {
        //         this.post.lang = data.meta_4;
        //     }
        // });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/macro.less";
</style>
