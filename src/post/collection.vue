<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="剑三小册" :localDraft="false">
            <slot name="header"></slot>
        </publish-header>

        <el-form label-position="left" class="m-publish-collection">
            <!-- 💛 栏目字段 -->
            <div class="m-publish-title">
                <el-divider content-position="left">标题</el-divider>
                <el-input
                    v-model="collection.title"
                    placeholder="请输入小册标题"
                    maxlength="30"
                    show-word-limit
                ></el-input>
            </div>

            <div class="m-publish-primary">
                <div class="m-publish-primary-block">
                    <el-divider content-position="left">可见性</el-divider>
                    <el-radio v-model.number="collection.public" :label="this.public.PUBLIC">公开</el-radio>
                    <el-radio v-model.number="collection.public" :label="this.public.PRIVATE">私有</el-radio>
                    <el-tooltip content="私有仅使该小册不出现在公开小册大厅中" placement="top">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </div>
                <div class="m-publish-primary-block m-publish-collection-posts">
                    <el-divider content-position="left"
                        >内容
                        <el-checkbox v-model="onlyMine" style="margin-left: 12px"
                            >仅从自己作品中</el-checkbox
                        ></el-divider
                    >
                    <draggable
                        class="m-list-style"
                        tag="ul"
                        v-if="collection.posts && collection.posts.length"
                        :list="collection.posts"
                        handle=".u-move"
                    >
                        <li v-for="(item, key) in collection.posts" :key="key" class="c-posts-item">
                            <i class="u-move el-icon-more"></i>
                            <i class="u-delete el-icon-close" @click="collection.posts.splice(key, 1)"></i>
                            <el-row class="m-posts-item" :gutter="10">
                                <el-col :span="4" class="u-collection-type">
                                    <el-select class="u-item-key" v-model="item.type" placeholder="请选择作品类型">
                                        <el-option
                                            v-for="(type, k) in source_types"
                                            :label="type"
                                            :key="k"
                                            :value="k"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="20" class="u-collection-id">
                                    <el-select
                                        v-if="item.type !== 'custom'"
                                        class="u-item-value"
                                        v-model="item.id"
                                        filterable
                                        remote
                                        placeholder="通过输入作品标题进行搜索"
                                        :remote-method="
                                            (query) => {
                                                search_handle(query, item);
                                            }
                                        "
                                        @change="
                                            (post_id) => {
                                                title_fill(post_id, item);
                                            }
                                        "
                                        :disabled="!item.type"
                                        @visible-change="
                                            (visible) => {
                                                if (visible) {
                                                    search_handle(null, item);
                                                }
                                            }
                                        "
                                    >
                                        <template v-for="post in item.posts">
                                            <el-option
                                                v-if="post.id && post.title"
                                                :key="post.id"
                                                :value="post.id"
                                                :label="post.title"
                                            >
                                                <div>
                                                    <el-tag size="small" v-if="post.post_type">{{
                                                        showPostType(post.post_type)
                                                    }}</el-tag>
                                                    {{ post.title }}
                                                </div>
                                            </el-option>
                                        </template>
                                    </el-select>
                                    <el-input
                                        class="u-item-value"
                                        placeholder="请输入完整网页链接（需以HTTP或HTTPS开头）"
                                        v-else
                                        v-model.trim="item.url"
                                    ></el-input>
                                    <div class="w-select">
                                        <div class="u-select-label">图标</div>
                                        <el-select v-model="item.icon" filterable clearable popper-class="m-collection-icon__select">
                                            <el-option v-for="_icon in icons" :key="_icon.value" :value="_icon.value" :label="_icon.label">
                                                <div class="u-collection-icon">
                                                    <img class="u-icon" :src="iconUrl(_icon.value)" alt="">
                                                    {{ _icon.label }}
                                                </div>
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <el-input v-model="item.custom_title">
                                        <template #prepend>自定义标题</template>
                                    </el-input>
                                </el-col>
                                <!-- <el-col :span="12" class="u-collection-url" v-if="item.url && item.type == 'custom'">
                                    <el-input v-model="item.title" placeholder="请输入自定义标题"></el-input>
                                </el-col> -->
                            </el-row>
                        </li>
                    </draggable>
                    <div v-else class="u-posts-items-empty">暂无作品信息，请进行作品添加</div>
                    <div class="u-posts-add" @click="add_posts_item">
                        <i class="el-icon-plus"></i>
                        <span>添加作品</span>
                    </div>
                </div>

                <div class="m-publish-primary-block m-publish-description">
                    <el-divider content-position="left" @click="show_description = !show_description"
                        >描述（选填）</el-divider
                    >
                    <span v-if="!show_description" @click="show_description = true" class="u-show">▼ 展开</span>
                    <span v-if="show_description" @click="show_description = false" class="u-hide">▲ 收起</span>
                    <Tinymce
                        v-show="show_description"
                        v-model="collection.description"
                        :attachmentEnable="true"
                        :resourceEnable="true"
                        :height="300"
                    />
                </div>

                <!-- 其它 -->
                <div class="m-publish-other">
                    <publish-banner
                        v-model="collection.image"
                        :size="[128, 168]"
                        info="小册的封面尺寸为 372 * 532 ，支持JPG,PNG上传"
                    ></publish-banner>
                </div>
            </div>
            <div class="m-publish-collection-publish">
                <el-button class="u-button" type="primary" @click="submit" :loading="processing" :disabled="processing"
                    >发 &nbsp;&nbsp; 布</el-button
                >
            </div>
        </el-form>
    </div>
</template>

<script>
import { __Root, __postType, __wikiType, __appType, __imgPath } from "@/utils/config";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
import CollectionPublic from "@jx3box/jx3box-editor/service/enum/CollectionPublic";
import header from "@/components/publish/publish_header.vue";
import publish_banner from "@/components/publish/publish_banner.vue";
import draggable from "vuedraggable";

// 本地依赖
import { createCollection, updateCollection, getCollectionRaw } from "@/service/publish/collection";
import { getMyPosts, getAllPosts } from "@/service/publish/cms";
import { getMyList, getAllCommunity } from "@/service/publish/community";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import lodash from "lodash";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import schoolid from "@jx3box/jx3box-data/data/xf/schoolid.json";

export default {
    name: "collection",
    props: [],
    data() {
        // 作品类型加载
        let source_types = Object.assign({ custom: "自定义" }, __postType, { community: "论坛" });
        delete source_types.jx3dat;
        delete source_types.notice;

        return {
            source_types: source_types,
            public: CollectionPublic,
            // 剑三小册主体
            collection: {
                id: "",
                title: "",
                public: 1,
                image: "",
                description: "",
                tags: [],
                posts: [],
            },
            tag: "",
            legal_tags: null,
            show_description: true,
            processing: false,

            onlyMine: true,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.collection_id;
        },
        icons: function() {
            const icons = [];
            for (let key in xfid) {
                icons.push({
                    value: `xf_${key}`,
                    label: xfid[key],

                });
            }
            for (let key in schoolid) {
                icons.push({
                    value: `school_${key}`,
                    label: schoolid[key],
                });
            }
            return icons;
        }
    },
    methods: {
        tags_filters(query) {
            let output = [];
            for (let tag of this.legal_tags) {
                if (tag.split(query).length > 1) output.push({ value: tag });
            }
            return output;
        },
        // 帖子标题填充
        title_fill(post_id, item) {
            let post = item.posts[post_id];
            item.title = post && post.title ? post.title : "";
            item.post_type = post && post.post_type ? post.post_type : "";
        },
        add_posts_item() {
            this.collection.posts.push({
                title: "",
                type: "",
                id: "",
                url: "",
                posts: null,
                post_type: "",
                custom_title: "",
                icon: "",
            });
        },
        search_handle(queryString, item) {
            if (queryString === null) item.id = queryString = "";
            if (this.onlyMine) {
                const params = {};
                if (queryString) {
                    params.title = queryString;
                }
                if (!["custom", "community"].includes(item.type)) {
                    item.type !== "custom" && (params.type = item.type);
                    getMyPosts(params).then((res) => {
                        item.posts =
                            res.data.data.list?.reduce((acc, cur) => {
                                acc[cur.ID] = {
                                    id: cur.ID,
                                    title: cur.post_title,
                                    post_type: cur.post_type,
                                };
                                return acc;
                            }, {}) || {};
                    });
                } else if (item.type === "community") {
                    getMyList(params).then((res) => {
                        item.posts =
                            res.data.data.list?.reduce((acc, cur) => {
                                acc[cur.id] = {
                                    id: cur.id,
                                    title: cur.title,
                                    post_type: "community",
                                };
                                return acc;
                            }, {}) || {};
                    });
                }
            } else {
                const params = {};
                if (queryString) {
                    params.title = queryString;
                }
                if (!["custom", "community"].includes(item.type)) {
                    item.type !== "custom" && (params.type = item.type);
                    getAllPosts(params).then((res) => {
                        item.posts =
                            res.data.data.list?.reduce((acc, cur) => {
                                acc[cur.ID] = {
                                    id: cur.ID,
                                    title: cur.post_title,
                                    post_type: cur.post_type,
                                };
                                return acc;
                            }, {}) || {};
                    });
                } else if (item.type === "community") {
                    getAllCommunity(params).then((res) => {
                        item.posts =
                            res.data.data.list?.reduce((acc, cur) => {
                                acc[cur.id] = {
                                    id: cur.id,
                                    title: cur.title,
                                    post_type: "community",
                                };
                                return acc;
                            }, {}) || {};
                    });
                }
            }
        },
        init: function () {
            getCollectionRaw(this.id).then((res) => {
                let collection = res.data.data;
                if (collection) {
                    for (let i in collection.posts) {
                        let item = collection.posts[i];
                        collection.posts[i].posts =
                            item.type === "custom"
                                ? null
                                : [{ id: item.id, title: item.title, post_type: item.post_type }];
                        // if (!['mine','all','custom'].includes(item.type)) {
                        //     item.type = 'all';
                        //     item.post_type = item.post_type;
                        // }
                    }
                    this.collection = collection;
                } else {
                    this.$message({
                        message: "该剑三小册已被删除或无权限访问",
                        type: "warning",
                    });
                }
            });
        },
        submit: function () {
            let collection = JSON.parse(JSON.stringify(this.collection));

            if (!collection.posts) {
                collection.posts = [];
            }

            // 校验posts
            let message = "";
            for (const i in collection.posts) {
                const item = collection.posts[i];
                if (!item.type) {
                    message = "文章类型不能为空哦";
                    break;
                }
                if (item.type === "custom") {
                    if (!item.url) {
                        message = "请填写正确的小册文章链接（http或https开头）";
                        break;
                    }
                    if (!item.title) {
                        message = "请填写自定义链接的标题";
                        break;
                    }
                } else {
                    if (!item.id) {
                        message = "请选择对应的文章";
                        break;
                    }
                }
            }
            // 更新sort字段
            collection.posts.forEach((item, index) => {
                item.sort = index;
            });
            if (message) {
                this.$message({
                    message: message,
                    type: "warning",
                });
                return;
            }

            // 去除多余字段
            for (let i in collection.posts) delete collection.posts[i].posts;
            collection.posts = JSON.stringify(collection.posts);

            this.processing = true;
            let fn = "";
            if (this.id) {
                collection = lodash.pick(collection, ["title", "public", "image", "description", "mark", "posts"]);
                fn = updateCollection(this.id, collection);
            } else {
                collection = lodash.omit(collection, ["id", "tags"]);
                fn = createCollection(collection);
            }
            fn.then((res) => {
                this.$message({
                    message: this.id ? "更新成功" : "创建成功",
                    type: "success",
                });
                let id = this.id || res.data.data.id;
                setTimeout(() => {
                    location.href = getLink("collection", id);
                }, 500);
            }).finally(() => {
                this.processing = false;
            });
        },

        showPostType: function (type) {
            return this.source_types[type];
        },
        iconUrl: function (icon) {
            const key = icon.replace("_", '/')
            return `${__imgPath}image/${key}.png`;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                val && this.init();
                // if (!val) {
                //     this.source_types = {
                //         mine: '我的作品',
                //         all: '全部作品',
                //         custom: '自定义',
                //     }
                // }
            },
        },
    },
    components: {
        Tinymce,
        draggable,
        "publish-header": header,
        "publish-banner": publish_banner,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/collection.less";
</style>
