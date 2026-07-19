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

            <div class="m-publish-info m-publish-extraimg">
                <el-divider content-position="left"
                    >{{ $t("publish.community.magicCard") }}
                    <el-tooltip class="box-item" effect="dark" :content="$t('publish.community.magicCardHint')" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-divider>
                <div class="m-palu-picker">
                    <section class="m-palu-section m-palu-current" :class="{ 'is-empty': !selectedSkin }">
                        <header class="m-palu-section-header">
                            <div class="u-section-title">
                                <span class="u-step">1</span>
                                <div>
                                    <strong>{{ $t("publish.community.currentDecoration") }}</strong>
                                </div>
                            </div>
                            <div v-if="selectedSkin" class="u-current-actions">
                                <button v-if="hasReplacedDecoration" type="button" class="u-reset" @click="resetDecoration">
                                    <el-icon><RefreshLeft /></el-icon>
                                    {{ $t("publish.common.reset") }}
                                </button>
                                <button type="button" class="u-remove" @click="setSkin(selectedSkin)">
                                    <i class="el-icon-close"></i>
                                    {{ $t("publish.community.removeDecoration") }}
                                </button>
                            </div>
                        </header>

                        <div v-if="selectedSkin" class="m-palu-current-body">
                            <div class="u-palu-card is-current">
                                <el-image :src="selectedSkin.url" fit="fill" />
                                <span class="u-current-badge">
                                    <i class="el-icon-check"></i>
                                    <template v-if="isOriginalDecoration(selectedSkin)">
                                        {{ $t("publish.community.decorated") }}
                                    </template>
                                    <template v-else>{{ $t("publish.common.selected") }}</template>
                                </span>
                            </div>
                            <div class="u-current-status">
                                <i class="el-icon-circle-check"></i>
                                <span v-if="isOriginalDecoration(selectedSkin)">{{ $t("publish.community.currentApplied") }}</span>
                                <span v-else>{{ $t("publish.community.useOnPublish") }}</span>
                            </div>
                        </div>
                        <div v-else class="u-current-empty">
                            <i class="el-icon-magic-stick"></i>
                            <div>
                                <strong>
                                    {{ $t("publish.community.noCurrentDecoration") }}
                                    <small class="u-section-summary">{{ $t("publish.community.chooseBelow") }}</small>
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section class="m-palu-section m-palu-available">
                        <header class="m-palu-section-header">
                            <div class="u-section-title">
                                <span class="u-step">2</span>
                                <div>
                                    <strong>
                                        {{ $t("publish.community.currentOwned") }}
                                        <small class="u-section-summary">
                                            {{
                                                $t("publish.community.ownedSummary", {
                                                    types: ownedSkinCount,
                                                    count: ownedCardAmount,
                                                })
                                            }}
                                        </small>
                                    </strong>
                                </div>
                            </div>
                        </header>

                        <div v-if="displaySkins.length" class="u-palu-grid">
                            <button
                                v-for="item in displaySkins"
                                :key="item.id"
                                type="button"
                                class="u-palu-card"
                                @click="setSkin(item)"
                            >
                                <el-image :src="item.url" fit="fill" />
                                <span class="u-use">{{ $t("publish.community.useThisCard") }}</span>
                                <span v-if="isOriginalDecoration(item) && item.amount <= 0" class="u-amount u-restore">
                                    {{ $t("publish.community.restoreDecoration") }}
                                </span>
                                <span v-else class="u-amount">{{ $t("publish.community.remaining", { count: item.amount }) }}</span>
                            </button>
                        </div>
                        <div v-else class="u-available-empty">
                            <i class="el-icon-box"></i>
                            {{ $t("publish.community.noAvailableCards") }}
                        </div>
                    </section>

                    <a
                        class="m-palu-more"
                        href="/vip/mall/list?category=virtual&sub_category=palu"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span class="u-more-icon"><i class="el-icon-shopping-cart-full"></i></span>
                        <span class="u-more-content">
                            <strong>{{ $t("publish.community.getMoreCards") }}</strong>
                            <small>{{ $t("publish.community.getMoreCardsHint") }}</small>
                        </span>
                        <span class="u-more-action">
                            {{ $t("publish.community.goRedeem") }}
                            <i class="el-icon-arrow-right"></i>
                        </span>
                    </a>
                </div>
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
import { __imgPath, __cdn } from "@/utils/config";
// 公共模块
import community_types from "@/assets/data/publish/community.json";

import { push, pull, update, setVisibility, pullAdmin, updateAdmin } from "@/service/publish/community.js";

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

// 数据逻辑
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";
import { getDecoration } from "@jx3box/jx3box-ui/service/cms";
import { appendToCollection } from "@/service/publish/collection.js";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";
import { RefreshLeft } from "@element-plus/icons-vue";

export default {
    name: "community",
    mixins: [cmsMetaMixin, atAuthorMixin],
    components: {
        Tinymce,
        RefreshLeft,
        "publish-header": publish_header,
        "publish-title": publish_title,
        "publish-collection": publish_collection,
        "publish-revision": publish_revision,
        "publish-category": publish_category,
        "publish-client": publish_client,
        "publish-at-authors": publish_at_authors,
        "publish-reading-history": publish_reading_history,
        "publish-headline-notice": publish_headline_notice,
    },
    data: function () {
        return {
            skins: [],
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
        selectedSkin: function () {
            return this.skins.find((item) => this.isSameSkin(item.id, this.post.decoration_id)) || null;
        },
        hasReplacedDecoration: function () {
            return (
                !!this.id &&
                !!this.currentDecorationId &&
                !!this.post.decoration_id &&
                !this.isSameSkin(this.post.decoration_id, this.currentDecorationId)
            );
        },
        displaySkins: function () {
            return this.skins.filter((item) => {
                const hasStock = Number(item.amount) > 0;
                const canRestoreOriginal =
                    this.isOriginalDecoration(item) && !this.isSameSkin(item.id, this.post.decoration_id);
                return hasStock || canRestoreOriginal;
            });
        },
        ownedSkinCount: function () {
            return this.skins.filter((item) => Number(item.amount) > 0).length;
        },
        ownedCardAmount: function () {
            return this.skins.reduce((total, item) => total + Math.max(Number(item.amount) || 0, 0), 0);
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
        isSameSkin(left, right) {
            return String(left || "") === String(right || "");
        },
        isOriginalDecoration(item) {
            return !!item && this.isSameSkin(item.id, this.currentDecorationId);
        },
        resetDecoration() {
            this.post.decoration_id = this.currentDecorationId;
        },
        setSkin(data) {
            if (data.amount <= 0 && data.id != this.currentDecorationId) {
                this.$message({
                    message: this.$t("publish.community.cardUsedUp"),
                    type: "warning",
                });
                return;
            }
            if (this.post.decoration_id == data.id) {
                this.post.decoration_id = "";
            } else {
                this.post.decoration_id = data.id;
            }
        },
        getDecoration() {
            getDecoration({ type: "palu" })
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
    .m-palu-picker {
        margin-top: 4px;
        overflow: hidden;
        border: 1px solid #e4e7ed;
        border-radius: 10px;
        background-color: #f8f9fb;

        .u-step {
            display: inline-flex;
            flex: 0 0 24px;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: fade(@v4primary, 12%);
            color: @v4primary;
            font-size: 12px;
            font-weight: 700;
        }
        .u-section-summary {
            margin-left: 6px;
            color: #909399;
            font-size: 12px;
            font-weight: 400;
        }
    }
    .m-palu-section {
        padding: 16px 18px;
    }
    .m-palu-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        .u-section-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        strong {
            display: block;
            color: #303133;
            font-size: 14px;
            line-height: 20px;
        }
        p {
            margin: 2px 0 0;
            color: #909399;
            font-size: 12px;
            line-height: 18px;
        }
    }
    .m-palu-current {
        border-bottom: 1px solid #ebeef5;
        background: linear-gradient(135deg, fade(@v4primary, 8%) 0%, #ffffff 62%);

        &.is-empty {
            background: #ffffff;
        }
        .u-current-actions {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .u-current-actions button {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 5px 0;
            border: 0;
            background: none;
            cursor: pointer;
            font-size: 12px;
            transition: color 0.2s ease;
        }
        .u-reset {
            color: @v4primary;

            &:hover {
                color: darken(@v4primary, 10%);
            }
        }
        .u-remove {
            color: #909399;

            &:hover {
                color: #f56c6c;
            }
        }
    }
    .m-palu-current-body {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 14px;
    }
    .u-palu-card {
        position: relative;
        display: block;
        width: 100%;
        height: 58px;
        overflow: hidden;
        padding: 0;
        border: 2px solid #dcdfe6;
        border-radius: 7px;
        box-sizing: border-box;
        background-color: @bg-light;
        box-shadow: 0 2px 7px rgba(31, 35, 41, 0.08);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

        .el-image {
            width: 100%;
            height: 100%;
        }
        .u-amount,
        .u-use,
        .u-current-badge {
            position: absolute;
            font-size: 12px;
            line-height: 20px;
        }
        .u-amount {
            right: 5px;
            bottom: 5px;
            z-index: 2;
            padding: 0 8px;
            border: 1px solid rgba(255, 255, 255, 0.55);
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.86);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
            color: #303133;
            font-weight: 600;
            -webkit-backdrop-filter: blur(4px);
            backdrop-filter: blur(4px);
        }
        .u-restore {
            background-color: @v4primary;
            border-color: @v4primary;
            color: #ffffff;
        }
        .u-use {
            top: 50%;
            left: 50%;
            z-index: 3;
            padding: 2px 12px;
            border-radius: 13px;
            background-color: @v4primary;
            box-shadow: 0 3px 10px fade(@v4primary, 35%);
            color: #ffffff;
            font-weight: 600;
            opacity: 0;
            transform: translate(-50%, -42%);
            transition: opacity 0.2s ease, transform 0.2s ease;
            white-space: nowrap;
        }
        .u-current-badge {
            top: 4px;
            left: 4px;
            z-index: 2;
            padding: 0 8px;
            border-radius: 4px;
            background-color: @v4primary;
            color: #ffffff;
        }
        &:not(.is-current)::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            background-color: rgba(20, 24, 31, 0.12);
            content: "";
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        &:not(.is-current):hover {
            border-color: @v4primary;
            box-shadow: 0 5px 14px fade(@v4primary, 16%);
            transform: translateY(-1px);

            .u-use {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            &::after {
                opacity: 1;
            }
        }
        &:focus-visible {
            outline: 2px solid fade(@v4primary, 35%);
            outline-offset: 2px;
        }
        &.is-current {
            width: 420px;
            max-width: 100%;
            height: 72px;
            border-color: @v4primary;
            box-shadow: 0 5px 16px fade(@v4primary, 18%);
            cursor: default;
        }
    }
    .u-current-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 10px;
        border-radius: 6px;
        background-color: fade(#67c23a, 10%);
        color: #529b2e;
        font-size: 12px;
        white-space: nowrap;
    }
    .u-current-empty {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 14px;
        padding: 13px 14px;
        border: 1px dashed #dcdfe6;
        border-radius: 7px;
        background-color: #fafafa;
        color: #909399;

        > i {
            color: #c0c4cc;
            font-size: 22px;
        }
        strong {
            display: block;
            color: #606266;
            font-size: 13px;
        }
    }
    .m-palu-available .m-palu-section-header {
        margin-bottom: 12px;
    }
    .u-palu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 10px;
    }
    .u-available-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 54px;
        border: 1px dashed #dcdfe6;
        border-radius: 7px;
        background-color: #ffffff;
        color: #a8abb2;
        font-size: 12px;
    }
    .m-palu-more {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 18px 18px;
        padding: 12px 14px;
        border: 1px dashed #c6ccd5;
        border-radius: 8px;
        box-sizing: border-box;
        background-color: #ffffff;
        color: #606266;
        text-decoration: none;
        transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

        .u-more-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background-color: fade(@v4primary, 10%);
            color: @v4primary;
            font-size: 18px;
        }
        .u-more-content {
            display: flex;
            flex: 1;
            flex-direction: column;
            min-width: 0;

            strong {
                color: #303133;
                font-size: 13px;
                line-height: 20px;
            }
            small {
                color: #909399;
                font-size: 12px;
                line-height: 18px;
            }
        }
        .u-more-action {
            color: @v4primary;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
        }
        &:hover {
            border-color: @v4primary;
            background-color: fade(@v4primary, 4%);
            box-shadow: 0 4px 12px fade(@v4primary, 10%);
        }
    }

    @media screen and (max-width: 768px) {
        .m-palu-section {
            padding: 14px;
        }
        .m-palu-current-body {
            align-items: stretch;
            flex-direction: column;
        }
        .u-palu-grid {
            grid-template-columns: 1fr;
        }
        .m-palu-more {
            flex-wrap: wrap;
            margin: 0 14px 14px;
        }
    }
}
</style>
