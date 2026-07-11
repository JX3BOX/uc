<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.itemWiki')">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">{{ $t("publish.wiki.selectItem") }} *</el-divider>
                <el-select
                    class="u-source-id"
                    v-model="post.source_id"
                    filterable
                    remote
                    :disabled="!!post.id"
                    :placeholder="$t('publish.wiki.itemSearchPlaceholder')"
                    :remote-method="search_handle"
                    :loading="options.loading"
                    size="large"
                >
                    <el-option v-for="item in options.sources" :key="item.id" :label="item.Name" :value="item.id">
                        <div class="m-selector-item">
                            <img class="u-icon" :src="icon_url_filter(item.IconID)" :alt="item.Name" />
                            <span class="u-name" v-text="item.Name"></span>
                        </div>
                    </el-option>
                </el-select>
            </div>

            <div class="m-publish-level">
                <el-divider content-position="left">{{ $t("publish.wiki.overallDifficulty") }} *</el-divider>
                <el-rate v-model="post.level" class="u-level"></el-rate>
            </div>

            <div class="m-publish-remark">
                <el-divider content-position="left">{{ $t("publish.form.revisionNotes") }} *</el-divider>
                <el-input v-model="post.remark" size="large" :placeholder="$t('publish.form.revisionNotesPlaceholder')"></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">{{ $t("publish.wiki.guideBody") }} *</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" :height="400">
                    <el-alert
                        type="warning"
                        class="m-latest-check"
                        show-icon
                        v-if="!isLatest && latest.post && current.post"
                    >
                        <template #title>
                            <span class="u-alert-title"
                                >{{ $t("publish.wiki.newerVersionWarning") }}</span
                            >
                            <el-link
                                type="primary"
                                icon="Link"
                                :href="getLink(post.source_id)"
                                target="_blank"
                                class="u-view-latest"
                                >{{ $t("publish.wiki.viewLatestGuide") }}</el-link
                            >
                            <el-link
                                @click="getLatest"
                                icon="Download"
                                class="u-get-latest"
                                type="primary"
                                v-if="latest.post"
                                >{{ $t("publish.wiki.loadLatestGuide") }}</el-link
                            >
                        </template>
                    </el-alert>
                </Tinymce>
            </div>

            <el-divider content-position="left"></el-divider>
            <div class="m-publish-commit">
                <el-button class="u-publish" size="large" icon="Promotion" type="primary" @click="toPublish" :disabled="processing"
                    >{{ $t("publish.wiki.submitGuide") }}</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish/publish_header.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
import { wiki } from "@jx3box/jx3box-common/js/wiki";

import User from "@jx3box/jx3box-common/js/user";
import { search_items } from "@/service/publish/item";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";

import { uniqBy, pick } from "lodash";
export default {
    name: "item",
    data() {
        return {
            //选项 - 加载可选项
            options: {
                sources: [],
            },

            //文章 - 主表数据
            post: {
                id: "", // 文章ID
                content: "",
                source_id: "",
                level: 0,
                remark: "",
            },

            // 状态控制
            loading: false,
            processing: false,

            compatible: false, // 是否兼容模式

            latest: {},
            current: {},
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        id: function () {
            return this.$route.query?.post_id;
        },
        // 当前比最新的攻略是否更新
        isLatest: function () {
            if (!this.current?.post?.id || !this.latest?.post?.id) return false;
            return this.current.post.id == this.latest.post.id;
        },
    },
    methods: {
        toPublish: function () {
            if (!this.post.source_id) {
                this.$message({
                    message: this.$t("publish.wiki.selectItemRequired"),
                    type: "warning",
                });
                return;
            }

            if (!this.post.content) {
                this.$message({ message: this.$t("publish.validation.guideBodyRequired"), type: "warning" });
                return;
            }

            if (!(this.post.level >= 1 && this.post.level <= 5)) {
                this.$message({
                    message: this.$t("publish.validation.difficultyRequired"),
                    type: "warning",
                });
                return;
            }

            if (!this.post.remark) {
                this.$message({
                    message: this.$t("publish.validation.revisionNotesRequired"),
                    type: "warning",
                });
                return;
            }

            this.processing = true;
            const data = {
                source_id: String(this.post.source_id),
                level: this.post.level,
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
            };
            if (this.id) {
                const _data = pick(data, ["level", "content", "remark"]);
                wiki.update(this.id, { ..._data, client: this.client })
                    .then((data) => {
                        data = data.data;
                        this.$message({
                            message: this.$t("publish.message.submittedForReview"),
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "item" } });
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                wiki.post({ type: "item", ...data, client: this.client })
                    .then((data) => {
                        data = data.data;
                        this.$message({
                            message: this.$t("publish.message.submittedForReview"),
                            type: "success",
                        });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "item" } });
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            }
        },
        icon_url_filter(icon_id) {
            return iconLink(icon_id);
        },
        // 物品搜索
        search_handle(keyword = "") {
            this.loading = true;
            search_items(keyword, 10).then((res) => {
                res = res.data;
                this.options.sources = res.data.data;
                this.loading = false;
            });
        },
        loadData: function (client) {
            if (!this.post.source_id) return;
            this.loading = true;
            return wiki
                .get({ type: "item", id: this.post.source_id }, { client })
                .then((res) => {
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let item = data.data.source;

                    if (post) {
                        this.post.source_id = post.source_id;
                        this.post.level = post.level || 1;
                        this.post.remark = post.remark || "";
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? this.post.source_id : "";
                        this.post.level = 0;
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (item) {
                        // 将选择项恢复至下拉框
                        if (this.compatible) {
                            // 兼容模式下，客户端为正式服的物品，不放入下拉框
                            if (client !== "std") this.options.sources = uniqBy([this.options.sources, item], "id");
                        } else {
                            // 非兼容模式下的物品直接放入下拉框
                            this.options.sources = uniqBy([this.options.sources, item], "id");
                        }
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadDataByPostId: function () {
            this.loading = true;
            return wiki
                .getById(this.id)
                .then((res) => {
                    this.current = res.data.data;
                    let data = res.data;
                    // 数据填充
                    let post = data.data.post;
                    let item = data.data.source;

                    if (post) {
                        this.post.source_id = post.source_id;
                        this.post.level = post.level || 1;
                        this.post.remark = post.remark || "";
                        this.post.content = post.content;
                    } else {
                        this.post.source_id = this.post.source_id ? this.post.source_id : "";
                        this.post.level = 0;
                        this.post.remark = "";
                        this.post.content = "";
                    }

                    if (item) {
                        // 将选择项恢复至下拉框
                        if (this.compatible) {
                            // 兼容模式下，客户端为正式服的物品，不放入下拉框
                            if (client !== "std") this.options.sources = uniqBy([this.options.sources, item], "id");
                        } else {
                            // 非兼容模式下的物品直接放入下拉框
                            this.options.sources = uniqBy([this.options.sources, item], "id");
                        }
                    }

                    return post;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取最新的攻略
        loadLatest() {
            if (!this.post.source_id) return;
            wiki.get({ type: "item", id: this.post.source_id }).then((res) => {
                this.latest = res.data.data;
            });
        },
        getLink(id) {
            return getLink("item", id);
        },
        getLatest() {
            this.post.content = this.latest.post?.content || "";
        },
    },
    created() {
        // 初始化搜索列表
        this.search_handle("");

        // 获取物品ID并通过watch获取攻略
        let id = this.$route.params.source_id;
        this.post.source_id = id ? id : null;

        // 获取最新的攻略
        this.loadLatest();
    },
    watch: {
        "post.source_id": {
            handler: function () {
                if (this.id) {
                    this.loadDataByPostId();
                    return;
                }
                if (this.client == "std") {
                    this.loadData("std");
                } else {
                    this.loadData("origin").then((post) => {
                        this.compatible = true;
                        console.log("兼容获取");
                        if (!post) {
                            this.loadData("std");
                        }
                    });
                }
            },
        },
    },
    components: {
        "publish-header": header,
        Tinymce,
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/item.less";
@import "~@/assets/css/publish/wiki.less";
</style>
