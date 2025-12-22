<template>
    <div class="m-publish-box p-community" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="魔盒论坛">
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
                <el-divider content-position="left">信息</el-divider>
                <!-- 客户端 -->
                <publish-client v-model="post.client" :showMobile="true"></publish-client>
                <!-- 类型 -->
                <publish-category v-model="post.category" :options="tags"></publish-category>
            </div>

            <div class="m-publish-info m-publish-extraimg">
                <el-divider content-position="left"
                    >魔卡
                    <el-tooltip class="box-item" effect="dark" content="使用魔卡让你的贴贴闪闪发光!" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                    <a
                        class="u-buy el-button el-button--primary el-button--mini is-round"
                        href="/vip/mall/list?category=virtual&sub_category=palu"
                        target="_blank"
                        ><i class="el-icon-shopping-cart-full"></i> 兑换魔卡</a
                    >
                </el-divider>
                <div class="u-imgs u-skin-imgs" v-if="skins.length">
                    <div
                        @click="setSkin(item)"
                        :class="`u-imgs-item u-skin ${post.decoration_id === item.id && 'active'}`"
                        v-for="(item, i) in skins"
                        :key="i"
                        title="点击使用卡片皮肤，再次点击取消选择"
                    >
                        <el-image :src="item.url" fit="fill" />
                        <div class="u-mark"><i class="el-icon-check"></i> 已选择</div>
                        <div class="u-amount">数量 : {{ item.amount }}</div>
                    </div>
                </div>
                <div v-else class="u-null">
                    你还没有任何魔卡，<a href="/vip/mall/list?category=virtual&sub_category=palu" target="_blank"
                        >点击前往</a
                    >使用积分兑换。
                </div>
            </div>

            <!-- 正文 -->
            <div class="m-publish-content">
                <el-divider content-position="left">正文</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" v-show="'tinymce'" />
            </div>

            <!-- 附加 -->

            <div class="m-publish-append">
                <el-divider content-position="left">小册</el-divider>
                <publish-collection v-model="post.collection_id" :defaultCollapse="post.collection_collapse">
                </publish-collection>
            </div>

            <!-- 扩展 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">设置</el-divider>
                <el-form-item label="评论开关">
                    <!-- 默认应该是可以评论，但是是开的 -->
                    <el-switch v-model="post.disable_comment" active-color="#13ce66" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                <el-form-item label="礼物开关">
                    <el-switch v-model="post.disable_inspire_boxcoin" active-color="#13ce66" :active-value="0" :inactive-value="1"></el-switch>
                </el-form-item>
                <el-form-item label="匿名开关">
                    <el-switch v-model="post.anonymous" active-color="#13ce66" :active-value="1" :inactive-value="0" @change="onAnonymousChange"></el-switch>
                </el-form-item>
                <el-form-item label="阅读权限">
                    <el-radio-group v-model="post.visible">
                        <el-radio :label="0">公开</el-radio>
                        <el-radio :label="1" :disabled="!!post.anonymous">仅自己可见</el-radio>
                        <el-radio :label="2" :disabled="!!post.anonymous">仅亲友可见</el-radio>
                        <el-radio :label="3" :disabled="!!post.anonymous">密码可见</el-radio>
                        <!-- <el-radio label="4" disabled>付费可见</el-radio> -->
                        <el-radio :label="5" :disabled="!!post.anonymous">粉丝可见</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码" v-if="post.visible == 3">
                    <el-input v-model="post.password" placeholder="请输入密码" />
                </el-form-item>
            </div>

            <!-- 临时 -->
            <div class="m-publish-extend">
                <el-divider content-position="left">临时</el-divider>
                <publish-at-authors></publish-at-authors>
            </div>

            <!-- 附图 -->
            <div class="m-publish-extraimg" v-show="extraImages.length">
                <el-divider content-position="left">附图</el-divider>
                <div class="u-imgs">
                    <div :class="`u-imgs-item`" v-for="(item, i) in extraImages" :key="i">
                        <el-image
                            :src="item"
                            fit="cover"
                            style="width: 148px; height: 148px"
                            :preview-src-list="[item]"
                        />
                        <div class="u-mark">封面</div>
                    </div>
                </div>
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
                <template>
                    <el-button type="primary" @click="publish('publish', true)" :disabled="is_illegal || processing || !hasRead"
                        >发 &nbsp;&nbsp; 布</el-button
                    >
                </template>
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

// 数据逻辑
import { getTopicBucket } from "@/service/publish/cms.js";
import { cmsMetaMixin } from "@/utils/cmsMetaMixin";
import { atAuthorMixin } from "@/utils/atAuthorMixin";
import { getDecoration } from "@jx3box/jx3box-common-ui/service/cms";
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
        goShopping(e) {
            window.open("/vip/mall/list?category=virtual&sub_category=palu", "_blank");
            e.preventDefault();
            e.stopPropagation();
        },
        setSkin(data) {
            if (data.amount <= 0 && data.id != this.currentDecorationId) {
                this.$message({
                    message: "该皮肤已经被使用完了",
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
            if (this.data.id) {
                const fn = this.from === "admin" ? updateAdmin : update;
                const data = {
                    ...this.data,
                }
                if (!isMiniProgram()) {
                    data.is_wx_audit = 0;
                }
                fn(this.data.id, data)
                    .then((res) => {
                        this.$message({
                            message: "更新成功",
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
                    });
            } else {
                const data = {
                    ...this.data,
                }
                if (this.category == '求助') {
                    data.tags = ["未解决"]
                }
                if (!isMiniProgram()) {
                    data.is_wx_audit = 0;
                }
                push(data)
                    .then((res) => {
                        const result = res.data.data;
                        this.$message({
                            message: "发布成功",
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
    .u-buy {
        margin-left: 10px;
        padding: 5px 8px;
        background-color: #444;
        border-color: #444;
    }
    .u-null {
        .fz(12px);
        color: #999;
        a {
            text-decoration: underline;
        }
    }
    .u-imgs {
        display: flex;
        overflow-x: auto;
        gap: 8px;
    }
    .u-imgs-item {
        min-width: 148px;
        overflow: hidden;
        border-radius: 6px;
        box-sizing: border-box;
        height: 148px;
        cursor: pointer;
        position: relative;
        border: 2px solid transparent;
        transition: 0.35s;
        background-color: @bg-light;
        &:hover {
            border-color: #0366d6;
        }
        &.active {
            border-color: #0366d6;
            .u-mark {
                display: block;
            }
        }
        img {
            width: 100%;
        }
        .u-mark {
            display: none;
            position: absolute;
            top: 2px;
            right: 2px;
            padding: 4px 8px;
            font-size: 12px;
            background-color: #0366d6;
            color: white;
            border-radius: 4px;
        }
    }
    .u-skin-imgs {
        overflow-x: scroll;
        padding-bottom: 20px;
        .u-imgs-item {
            position: relative;
            width: 260px;
            height: 50px;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
            .el-image {
                width: 100%;
                height: 100%;
            }
            .u-mark {
                left: 2px;
                right: initial !important;
            }
        }
        .u-amount {
            font-size: 12px;
            position: absolute;
            .rb(0);
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 2px 2px 2px 6px;
            border-bottom-right-radius: 2px;
        }
    }
}
</style>
