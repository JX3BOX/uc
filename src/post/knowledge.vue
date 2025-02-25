<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header name="通识百科">
            <slot name="header"></slot>
        </publish-header>

        <el-form class="m-publish-post">
            <div class="m-publish-source">
                <el-divider content-position="left">选择通识 *</el-divider>
                <el-radio-group class="m-publish-action" v-model="action">
                    <el-radio-button label="new" :disabled="isEditMode">新建词条</el-radio-button>
                    <el-radio-button label="update">维护已有词条</el-radio-button>
                </el-radio-group>

                <!-- 编辑模式 -->
                <el-input class="u-current-source" v-if="isEditMode" v-model="currentSource" disabled></el-input>

                <!-- 创建模式 -->
                <template v-else>
                    <template v-if="action == 'new'">
                        <!-- 创建词条 -->
                        <div class="u-create-source">
                            <el-select class="u-source-type" placeholder="选择通识类型" v-model="knowledge.type">
                                <el-option
                                    v-for="type in types"
                                    :key="type.name"
                                    :value="type.name"
                                    :label="type.label"
                                ></el-option>
                            </el-select>
                            <el-input
                                class="u-source-name"
                                placeholder="请输入通识名称"
                                v-model="knowledge.name"
                            ></el-input>
                        </div>
                        <p class="u-source-add-tip">
                            <span>Note：添加完成后的通识需要经过管理员审核通过后才会在通识百科上展示哦</span>
                        </p>
                    </template>
                    <template v-else>
                        <!-- 更新词条 -->
                        <el-select
                            class="u-source-id"
                            v-model.lazy="post.source_id"
                            filterable
                            remote
                            placeholder="通过输入通识名称进行搜索"
                            :remote-method="loadSources"
                            :loading="options.loading"
                            clearable
                            @change="selectSource"
                        >
                            <el-option
                                v-for="item in options.sources"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                                <div class="u-option">
                                    <span class="u-type">{{ showType(item.type) }}</span>
                                    <span class="u-name" v-text="item.name"></span>
                                </div>
                            </el-option>
                        </el-select>
                    </template>
                </template>
            </div>

            <div class="m-publish-remark">
                <el-divider content-position="left">修订说明 *</el-divider>
                <el-input
                    v-model="post.remark"
                    :maxlength="200"
                    :minlength="1"
                    show-word-limit
                    required
                    placeholder="请简单描述一下本次修订说明"
                ></el-input>
            </div>

            <div class="m-publish-content">
                <el-divider content-position="left">通识正文 *</el-divider>
                <Tinymce v-model="post.content" :attachmentEnable="true" :resourceEnable="true" :height="600">
                    <el-alert type="warning" class="m-latest-check" show-icon v-if="!isLatest && latest.post && current.post">
                        <template #title>
                            <span class="u-alert-title">当前百科已经有更新的版本，你的攻略可能已经失效，请先进行比对。</span>
                            <el-link type="primary" icon="el-icon-link" :href="getLink(post.source_id)" target="_blank" class="u-view-latest">查看最新攻略</el-link>
                            <el-link @click="getLatest" icon="el-icon-download" class="u-get-latest" type="primary" v-if="latest.post">获取最新攻略</el-link>
                        </template>
                    </el-alert>
                </Tinymce>
            </div>

            <div class="m-publish-tags">
                <el-divider content-position="left">通识标签</el-divider>
                <el-tag
                    :key="key"
                    v-for="(tag, key) in post.tags"
                    closable
                    :disable-transitions="false"
                    @close="post.tags.splice(key, 1)"
                    >{{ tag }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    placeholder="回车以添加"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签 </el-button>
            </div>

            <div class="m-publish-commit">
                <el-divider content-position="left"></el-divider>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="handleSubmit"
                    :disabled="processing"
                    >提交通识
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import header from "@/components/publish/publish_header.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";

// 本地依赖
// import { WikiPost } from "@jx3box/jx3box-common/js/helper";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import User from "@jx3box/jx3box-common/js/user";
import { get_menus, get_list, create_knowledge } from "@/service/publish/knowledge";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "knowledge",
    data() {
        return {
            // 用户动作
            // ================
            action: "new",
            isEditMode: false,

            // 通识信息
            // =================
            // 通识类别
            types: [],
            options: {
                sources: [],
                loading: false,
            },
            // 新建模式
            knowledge: {
                type: "",
                name: "",
            },
            // 编辑模式
            currentSource: "",

            // 文章内容
            // =================
            processing: false,
            post: {
                id: "",
                content: "",
                source_id: "",
                remark: "",
                tags: [],
                client: ""
            },

            // 杂项
            // =================
            // 标签
            inputVisible: false,
            inputValue: "",

            latest: {},
            current: {}
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        id : function (){
            return this.$route.query?.post_id
        },
        // 当前比最新的攻略是否更新
        isLatest : function (){
            if(!this.current?.post?.id || !this.latest?.post?.id) return false
            return this.current.post.id == this.latest.post.id
        },
    },
    methods: {
        // 加载指定通识
        loadData: function (id) {
            if (!id) return;
            wiki.get({ type: "knowledge", id }, { client: 'all' }).then((res) => {
                // 设置通识
                let source = res.data?.data?.source;
                this.currentSource = source?.name;
                this.post.source_id = source?.id;

                this.latest = res.data.data

                // 设置初始文章内容（基于最新审核版本）
                let post = res.data?.data?.post;
                this.post.remark = post?.remark;
                this.post.content = post?.content || "";
                this.post.tags = post?.tags?.split(",") || [];
            });
        },
        loadDataByPostId() {
            return wiki.getById(this.id).then(res => {
                let source = res.data?.data?.source;
                this.currentSource = source?.name;
                this.post.source_id = source?.id;

                this.current = res.data.data
                this.post.content = this.current.post.content
                this.post.remark = this.current.post.remark
                this.post.tags = this.current.post.tags.split(',') || []
            })
        },
        // 加载可选类型
        loadTypes: function () {
            get_menus().then((res) => {
                this.types = res.data.data;
            });
        },
        // 加载通识列表
        loadSources(keyword = "") {
            this.options.loading = true;
            get_list({
                _search: keyword,
                per: 10,
            })
                .then((res) => {
                    this.options.sources = res.data.data.list;
                })
                .finally(() => {
                    this.options.loading = false;
                });
        },
        // 模式切换
        resetSource: function () {
            if (this.action == "new") {
                // 重置通识
                this.post.source_id = "";
                this.currentSource = "";

                // 重置内容
                this.post.content = "";
                this.post.tags = [];
                this.post.remark = "";
            }
        },

        // 发布流程
        // ======================
        handleSubmit: function () {
            if (this.action == "new" && !this.post.source_id) {
                this.createSource().then(() => {
                    // 当通识已存在时，后端会自动识别为同一条词条
                    this.createPost();
                });
            } else {
                this.createPost();
            }
        },

        // 1.创建通识词条
        createSource() {
            this.processing = true;
            return create_knowledge({
                type: this.knowledge.type,
                name: this.knowledge.name,
            })
                .then((res) => {
                    this.post.source_id = res.data.data.id;
                    // this.$message({
                    //     message: `${res.message}`,
                    //     type: "warning",
                    // });
                })
                .finally(() => {
                    this.processing = false;
                });
        },

        // 2.维护已有通识
        selectSource: function (source_id) {
            this.loadData(source_id);
        },

        // 3.校验字段
        validate() {
            let result = ["source_id", "content", "remark"].every((prop) => {
                return !!this.post[prop];
            });
            if (!result) this.$message.error("请完成必填项");
            return result;
        },
        // 4.发布作品
        createPost: function () {
            // 表单校验
            if (!this.validate()) return;
            this.processing = true;
            const data = {
                source_id: String(this.post.source_id),
                user_nickname: User.getInfo().name,
                content: this.post.content,
                remark: this.post.remark,
                tags: this.post.tags.join(","),
            };
            wiki.post({ type: "knowledge", ...data, client: "all" })
                .then(() => {
                        this.$message({ message: "提交成功，请等待审核", type: "success" });
                        setTimeout(() => {
                            this.$router.push({ name: "wiki_post", params: { type: "knowledge" } });
                        }, 500);
                })
                .finally(() => {
                    this.processing = false;
                });
        },

        // 标签
        // =========================
        handleInputConfirm() {
            let inputValue = this.inputValue.trim();
            if (inputValue) {
                this.post.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        showType(val) {
            return this.types.find((item) => {
                return item.name == val;
            }).label;
        },
        getLink(id) {
            return getLink('knowledge', id)
        },
        getLatest() {
            this.post.content = this.latest.post?.content || ''
        }
    },
    watch: {
        // 根据路由判定进入的模式
        "$route.params.source_id": {
            immediate: true,
            handler: function (val) {
                // 编辑模式
                if (val) {
                    this.action = "update";
                    this.isEditMode = true;
                    this.post.source_id = ~~val;
                    this.loadData(val);

                    if (this.id) {
                        this.loadDataByPostId()
                    }
                    // 创建模式
                } else {
                    this.action = "new";
                    // 获取类型
                    this.loadTypes();
                    // 获取列表
                    this.loadSources();
                }
            },
        },
        // 创建模式切换action
        action: {
            handler: function () {
                if (!this.isEditMode) {
                    this.resetSource();
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
@import "~@/assets/css/publish/knowledge.less";
@import "~@/assets/css/publish/wiki.less";
</style>
