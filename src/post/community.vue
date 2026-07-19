<template>
    <div class="m-publish-box p-community" v-loading="loading">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.forum')">
            <div class="u-actions">
                <publish-revision :enable="true" :post="post"></publish-revision>
                <publish-reading-history v-if="id" :post-id="id" category="communicate"></publish-reading-history>
            </div>
        </publish-header>

        <el-form label-position="left" label-width="80px">
            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>

            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">{{ $t("publish.common.information") }}</el-divider>
                <!-- 客户端 -->
                <publish-client v-model="post.client" :showMobile="true"></publish-client>
                <!-- 类型 -->
                <publish-category v-model="post.category" :options="tags"></publish-category>
            </div>

            <div class="m-publish-info">
                <publish-palu-picker
                    v-model="post.decoration_id"
                    :cards="paluCards"
                    :current-value="currentDecorationId"
                    :loading="decorationLoading"
                    :load-failed="decorationLoadFailed"
                    :disabled="processing"
                    :hint="$t('publish.community.magicCardHint')"
                    :consume-hint="$t('publish.community.useOnPublish')"
                    :remove-hint="$t('publish.community.removeOnPublish')"
                    test-id="community-palu"
                    @retry="getDecoration"
                ></publish-palu-picker>
            </div>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">{{ $t("publish.common.body") }}</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" v-show="'tinymce'" />
            </div>

            <!-- 附加 -->

            <div class="m-publish-append">
                <el-divider content-position="left">{{ $t("publish.types.collection") }}</el-divider>
                <publish-collection v-model="post.collection_id" :defaultCollapse="post.collection_collapse">
                </publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">{{ $t("publish.common.settings") }}</el-divider>
                <el-form-item :label="$t('publish.form.comments')">
                    <!-- 默认应该是可以评论，但是是开的 -->
                    <el-switch
                        v-model="post.disable_comment"
                        active-color="#13ce66"
                        :active-value="0"
                        :inactive-value="1"
                    ></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.form.gifts')">
                    <el-switch
                        v-model="post.disable_inspire_boxcoin"
                        active-color="#13ce66"
                        :active-value="0"
                        :inactive-value="1"
                    ></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.form.anonymous')">
                    <el-switch
                        v-model="post.anonymous"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="onAnonymousChange"
                    ></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.form.visibility')">
                    <el-radio-group v-model="post.visible">
                        <el-radio :value="0">{{ $t("publish.visibility.public") }}</el-radio>
                        <el-radio :value="1" :disabled="!!post.anonymous">{{ $t("publish.visibility.private") }}</el-radio>
                        <el-radio :value="2" :disabled="!!post.anonymous">{{ $t("publish.visibility.friends") }}</el-radio>
                        <el-radio :value="3" :disabled="!!post.anonymous">{{ $t("publish.visibility.password") }}</el-radio>
                        <!-- <el-radio :value="4" disabled>付费可见</el-radio> -->
                        <el-radio :value="5" :disabled="!!post.anonymous">{{ $t("publish.visibility.followers") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('publish.form.password')" v-if="post.visible == 3">
                    <el-input v-model="post.password" :placeholder="$t('publish.form.passwordPlaceholder')" />
                </el-form-item>
            </div>

            <!-- 临时 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">{{ $t("publish.common.temporary") }}</el-divider>
                <publish-at-authors></publish-at-authors>
            </div>

            <!-- 附图 -->
            <div class="m-publish-extraimg" v-show="extraImages.length">
                <el-divider content-position="left">{{ $t("publish.community.images") }}</el-divider>
                <div class="u-imgs">
                    <div :class="`u-imgs-item`" v-for="(item, i) in extraImages" :key="i">
                        <el-image
                            :src="item"
                            fit="cover"
                            style="width: 148px; height: 148px"
                            :preview-src-list="[item]"
                        />
                        <div class="u-mark">{{ $t("publish.community.cover") }}</div>
                    </div>
                </div>
            </div>
            <publish-headline-notice
                source-type="community"
                :source-id="id"
                :client="post.client"
            ></publish-headline-notice>

            <div class="m-publish-doc">
                <el-alert
                    class="u-illegal-alert"
                    v-if="is_illegal"
                    :closable="false"
                    show-icon
                    type="error"
                    :title="$t('publish.message.contentViolation')"
                ></el-alert>
                <el-checkbox v-model="hasRead" :true-value="1" :false-value="0"
                    >{{ $t("publish.form.readAndUnderstand") }}<a href="/notice/119" @click.stop target="_blank">{{ $t("publish.form.publishingGuidelines") }}</a></el-checkbox
                >
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button
                    size="large"
                    type="primary"
                    @click="publish('publish', true)"
                    :disabled="is_illegal || processing || !hasRead"
                    >{{ $t("publish.common.publish") }}</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
// 公共模块
import community_types from "@/assets/data/publish/community.json";

import { push, pull, update, pullAdmin, updateAdmin } from "@/service/publish/community.js";

// 本地模块
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
import publish_collection from "@/components/publish/publish_collection";
import publish_revision from "@/components/publish/publish_revision.vue";
import publish_category from "@/components/publish/publish_category.vue";
import publish_at_authors from "@/components/publish/publish_at_authors.vue";
import publish_reading_history from "@/components/publish/publish_reading_history.vue";
import publish_client from "@/components/publish/publish_client.vue";
import publish_headline_notice from "@/components/publish/publish_headline_notice.vue";
import publish_palu_picker from "@/components/publish/publish_palu_picker.vue";

// 数据逻辑
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";
import { getDecoration } from "@jx3box/jx3box-ui/service/cms";
import { appendToCollection } from "@/service/publish/collection.js";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "community",
    mixins: [cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-collection": publish_collection,
        "publish-revision": publish_revision,
        "publish-category": publish_category,
        "publish-client": publish_client,
        "publish-at-authors": publish_at_authors,
        "publish-reading-history": publish_reading_history,
        "publish-headline-notice": publish_headline_notice,
        "publish-palu-picker": publish_palu_picker,
    },
    data: function () {
        return {
            skins: [],
            decorationLoading: false,
            decorationLoadFailed: false,
            // 加载状态
            loading: false,
            // 发布状态
            processing: false,

            // 内容
            post: {
                // 文章ID
                id: "",
                client: "all",
                // 皮肤id
                decoration_id: "",
                // 分类
                category: "",
                // 标题
                title: "",
                // 内容
                content: "",

                // 小册id
                collection_id: "",

                visible: 0,
                password: "",

                is_from_phone: 0,
                anonymous: 0,

                disable_inspire_boxcoin: 0,
                disable_comment: 0,
            },
            currentDecorationId: "",
            // 选项
            community_types,
            tags: [],
            buckets: [],

            post_type: "community",
            extraImages: [],
        };
    },
    computed: {
        // extraImages() {
        //     const imgs = this.getImgSrc(this.post.content);

        //     return [...new Set(imgs)];
        // },

        id: function () {
            return ~~this.post.id || ~~this.$route.params.id;
        },
        paluCards: function () {
            return this.skins.map((item) => ({
                value: item.id,
                amount: item.amount,
                url: item.url,
            }));
        },
        data: function () {
            return {
                ...this.post,
                category: this.post.category,
                collection_id: this.post.collection_id || undefined,
                decoration_id: this.post.decoration_id || undefined,
                extra_images: this.extraImages,
                introduction: this.getIntroduction(this.post.content),
            };
        },
    },
    mounted() {
        this.getTopicBucket();
        const id = this.$route.params.id;
        if (id) {
            this.post.id = id;
            this.loadCommentConfig("community", id);
        }
        this.post.client = "all";

        // 判断提交是否来自手机
        if (window.navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) && !this.post.is_from_phone) {
            this.post.is_from_phone = 1;
        }
    },
    methods: {
        getDecoration() {
            this.decorationLoading = true;
            this.decorationLoadFailed = false;
            return getDecoration({ type: "palu" })
                .then((res) => {
                    const list = res.data.data || [];
                    const skins = list.filter((item) => item.amount > 0 || item.id == this.currentDecorationId);
                    this.skins = skins.map((item) => {
                        return {
                            val: item.val,
                            id: item.id,
                            amount: item.amount,
                            url: __cdn + `design/decoration/palu/${item.val}.png`,
                        };
                    });
                })
                .catch(() => {
                    this.skins = [];
                    this.decorationLoadFailed = true;
                })
                .finally(() => {
                    this.decorationLoading = false;
                });
        },
        getIntroduction(str) {
            // 使用正则表达式匹配HTML标签并将其替换为空字符串
            const withoutTags = str.replace(/<[^>]*>|\n|&nbsp;| &nbsp;/g, "");

            // 获取前100个字符，如果字符串长度小于200，则获取全部字符
            return withoutTags.slice(0, 200);
        },
        // 初始化
        init: function () {
            // 尝试加载
            sessionStorage.removeItem("atAuthor");
            const id = this.$route.params.id;
            if (!id) {
                this.getDecoration();
                return;
            }
            const fn = this.from === "admin" ? pullAdmin : pull;
            fn(id).then((res) => {
                const data = res.data.data;
                this.currentDecorationId = data.decoration_id;
                this.post = {
                    ...data,
                    title: data.title,
                    content: data.content,
                    collection_id: data.collection_id,
                };
                this.getDecoration();
            });
        },
        // 发布
        publish: function () {
            this.loading = true;
            this.processing = true;
            if (!this.post.title || !this.post.content) {
                this.$message({
                    message: this.$t("publish.validation.titleAndContentRequired"),
                    type: "warning",
                });
                this.loading = false;
                this.processing = false;
                return;
            }
            if (this.data.id) {
                const fn = this.from === "admin" ? updateAdmin : update;
                const data = {
                    ...this.data,
                };
                if (!isMiniProgram()) {
                    data.is_wx_audit = 0;
                }
                fn(this.data.id, data)
                    .then((res) => {
                        this.$message({
                            message: this.$t("publish.message.updateSucceeded"),
                            type: "success",
                        });

                        this.atUser(this.data.id);
                        // 设置可见性
                        // setVisibility(this.data.id, this.post.is_self_visit);
                    })
                    .then(() => {
                        this.afterPublish({
                            id: this.data.id,
                            collection_id: this.data.collection_id,
                            title: this.data.title,
                        }).then(() => {
                            // 跳转
                            setTimeout(() => {
                                location.href = `/community/${this.post.id}`;
                            }, 500);
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                        this.processing = false;
                    });
            } else {
                const data = {
                    ...this.data,
                };
                if (this.post.category == "求助") {
                    data.tags = ["未解决"];
                }
                if (!isMiniProgram()) {
                    data.is_wx_audit = 0;
                }
                push(data)
                    .then((res) => {
                        const result = res.data.data;
                        this.$message({
                            message: this.$t("publish.message.publishSucceeded"),
                            type: "success",
                        });

                        const id = res.data.data.id;

                        // setVisibility(id, this.post.is_self_visit);

                        this.atUser(id);

                        return result;
                        // 跳转
                    })
                    .then((result) => {
                        this.afterPublish(result).then(() => {
                            setTimeout(() => {
                                location.href = `/community/${result.id}`;
                            }, 500);
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                        this.processing = false;
                    });
            }

            // t
        },
        getImgSrc: function (htmlString) {
            // 创建一个正则表达式来匹配没有class属性的<img>标签，并且捕获src属性的值
            const imgSrcRegex = /<img\s+(?![^>]*\bclass\b)[^>]*?src="([^"]*)"/g;
            let matches;
            const imgSrcs = [];

            // 使用正则表达式全局匹配HTML字符串中的所有<img>标签
            while ((matches = imgSrcRegex.exec(htmlString)) !== null) {
                // matches[1] 是正则表达式中捕获组的内容，即src的值
                imgSrcs.push(matches[1]);
            }

            return imgSrcs;
        },
        getTopicBucket() {
            // getTopicBucket({ type: "community" }).then((res) => {
            //     const data = res.data.data;
            //     this.tags = [...data];
            // });
            this.tags = community_types;
        },
        // 跳转前操作
        afterPublish: function (result) {
            if (!~~result.collection_id) {
                return new Promise((resolve, reject) => {
                    resolve(true);
                });
            }
            return appendToCollection({
                post_type: "community",
                post_id: result.id,
                post_collection: result.collection_id,
                post_title: result.title,
            });
        },
    },
    watch: {
        "post.content": {
            handler: function (val) {
                const imgs = this.getImgSrc(val);

                this.extraImages = [...new Set(imgs)];
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.p-community {
    .u-actions {
        .flex;
        gap: 10px;
    }
}

.m-publish-extraimg {
    .u-imgs {
        display: flex;
        overflow-x: auto;
        gap: 8px;
    }

    .u-imgs-item {
        position: relative;
        min-width: 148px;
        height: 148px;
        overflow: hidden;
        border: 2px solid transparent;
        border-radius: 6px;
        box-sizing: border-box;
        background-color: @bg-light;
        cursor: pointer;
        transition: 0.35s;

        &:hover,
        &.active {
            border-color: @v4primary;
        }

        &.active .u-mark {
            display: block;
        }

        img {
            width: 100%;
        }

        .u-mark {
            position: absolute;
            top: 2px;
            right: 2px;
            display: none;
            padding: 2px 8px;
            border-radius: 4px;
            background-color: @v4primary;
            color: white;
            font-size: 10px;
        }
    }
}
</style>
