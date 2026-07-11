<template>
    <div class="m-publish-box m-publish-box-face" v-loading="loading">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.bodyShare')"></publish-header>

        <el-form label-position="left" label-width="90px">
            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>
            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">{{ $t("publish.common.information") }}</el-divider>
                <el-form-item :label="$t('publish.face.bodyCode')">
                    <el-switch
                        v-model="post.code_mode"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                    ></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.common.data')" v-if="!post.code_mode">
                    <face-attachment :body="post.body_type" type="body" @update:data="handleBodyChange" />
                    <div class="u-attachment" v-for="item in bodyAttachments" :key="item.id">
                        <el-button
                            class="u-main"
                            :type="item.file === bodyData.file ? 'warning' : ''"
                            icon="Star"
                            circle
                            :plain="item.file === bodyData.file ? false : true"
                            @click="setMain(item)"
                            :title="$t('publish.face.setPrimary')"
                        />
                        <span class="u-attachment-text"
                            >{{ $t("publish.common.fileName") }}: <b>{{ item.name }}</b></span
                        >
                        <span class="u-attachment-remark"
                            ><el-input v-model="item.describe" :placeholder="$t('publish.common.note')"></el-input
                        ></span>
                        <el-button
                            class="u-btn"
                            type="info"
                            icon="Delete"
                            circle
                            plain
                            @click="removeFile(item.id)"
                            :title="$t('publish.common.remove')"
                        />
                    </div>
                </el-form-item>
                <el-form-item prop="code" v-else>
                    <template #label>
                        <span>{{ $t("publish.face.bodyCode") }}</span>
                        <i class="el-icon-document-copy" @click="codePaste" style="margin-left: 2px; color: #c00"></i>
                    </template>
                    <el-input v-model="post.code" :placeholder="$t('publish.face.bodyCodePlaceholder')"></el-input>
                </el-form-item>
                <!-- 客户端 -->
                <el-form-item :label="$t('publish.form.client')">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std">{{ $t("publish.form.standardServer") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <publish-client v-model="post.client" :forbidAll="true"></publish-client> -->
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <el-form-item :label="$t('publish.form.firstPublished')" prop="is_fr">
                    <el-switch
                        v-model="post.is_fr"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <template v-if="!post.original">
                    <el-form-item :label="$t('publish.form.originalAuthorName')" prop="author_name">
                        <el-input v-model="post.author_name" :placeholder="$t('publish.form.originalAuthorNamePlaceholder')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('publish.form.originalAuthorLink')" prop="author_link">
                        <el-input v-model="post.author_link" :placeholder="$t('publish.form.originalAuthorLinkPlaceholder')"></el-input>
                    </el-form-item>
                </template>

                <el-form-item :label="$t('publish.form.isPaid')">
                    <template #label>
                        <span>{{ $t("publish.form.isPaid") }}</span>
                        <el-tooltip :content="$t('publish.form.paidAuthorHint')">
                            <i class="el-icon-warning-outline" style="margin-left: 2px; color: #c00"></i>
                        </el-tooltip>
                    </template>
                    <el-radio-group v-model="post.price_type" :disabled="!isSuperAuthor">
                        <el-radio value="0">{{ $t("publish.form.free") }}</el-radio>
                        <!-- <el-radio value="1">盒币</el-radio> -->
                        <el-radio value="2" v-if="cny_enable">{{ $t("publish.form.paidGoldLeaf") }}</el-radio>
                    </el-radio-group>
                    <el-input-number
                        class="u-price"
                        v-model="post.price_count"
                        v-if="post.price_type != '0'"
                        :max="3000"
                        :min="0"
                    ></el-input-number>
                    <div class="u-tip-box" v-if="post.price_type != '0' && post.price_count > 0">
                        <div class="u-warning">
                            <el-checkbox v-model="promise" disabled>
                                {{ $t("publish.form.originalityPledge") }}
                            </el-checkbox>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item :label="$t('publish.face.bodyShape')">
                    <el-radio-group v-model="post.body_type">
                        <el-radio :value="~~body_type" v-for="(body_label, body_type) in bodyMap" :key="body_type">
                            {{ body_label.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="$t('publish.common.description')">
                    <el-input v-model="post.remark" :placeholder="$t('publish.form.descriptionPlaceholder')" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-divider content-position="left">{{ $t("publish.form.extension") }}</el-divider>
                <el-form-item :label="$t('publish.form.imageList')">
                    <UploadAlbum v-model="post.images"></UploadAlbum>
                </el-form-item>
                <publish-banner v-model="post.banner" v-if="isSuperAuthor"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button type="primary" @click="publish" :disabled="processing" size="large">{{ $t("publish.common.publish") }}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getAttachmentOfPost, addBody, getBody, updateBody } from "@/service/publish/body";
import publishHeader from "@/components/publish/publish_header.vue";
import publishTitle from "@/components/publish/publish_title.vue";
import publishOriginal from "@/components/publish/publish_original.vue";
import faceAttachment from "@/components/publish/face_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish/publish_banner.vue";
import faceData from "@jx3box/jx3box-facedat/assets/data/index.json";
import User from "@jx3box/jx3box-common/js/user.js";
import cloneDeep from "lodash/cloneDeep";
import { getConfig } from "@/service/publish/cms";
const { bodyMap } = faceData;
export default {
    name: "pvxbody",
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        faceAttachment,
        UploadAlbum,
        publishBanner,
    },
    data() {
        return {
            post: {
                // 用户信息
                original: 1, // 是否原创
                is_fr: 1, // 是否首发
                author_name: "", // 原作者名称
                author_link: "", // 原作者链接
                // 作品信息
                title: "", // 标题
                remark: "", // 描述
                banner: "", // 海报图
                // 数据信息
                client: "std", // 客户端
                body_type: 1, // 体型
                data: "", // 解析lua的json数据
                file: "", // 关联的附件表uuid
                // 作者扩展
                cover: "", // 封面
                images: [], // 图片列表
                related: [], // 相关作品
                // 价格
                price_type: "0", // 价格类型 0:免费 1:盒币 2:金箔
                price_count: 0, // 数量
                // 体型码
                code_mode: 0, // 是否是体型码
                code: "", // 体型码
            },

            loading: false,
            processing: false,
            postId: "", // 帖子id
            postType: "body", // 帖子类型
            bodyMap,
            promise: true,
            bodyAttachments: [],
            bodyData: "",

            isSuperAuthor: false,

            cny_enable: 0,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        client() {
            return this.$store.state.client;
        },
    },
    async mounted() {
        this.init();

        this.isSuperAuthor = await User.isSuperAuthor();
    },
    methods: {
        init() {
            if (this.id) {
                this.getData();
            } else {
                this.post.client = this.client;
            }

            getConfig("cny_enable").then((res) => {
                this.cny_enable = Number(res.data.data.val);
            });
        },
        getData() {
            this.loading = true;
            getBody(this.id).then((res) => {
                this.post = res.data.data;
                this.post.images = this.post.images.map((item) => {
                    return {
                        name: item,
                        url: item,
                    };
                });
                getAttachmentOfPost(this.id).then((res) => {
                    let result = res.data;
                    if (result && result.data) {
                        this.bodyAttachments = result.data.map((item) => {
                            return {
                                id: item.id,
                                file: item.uuid,
                                name: item.name,
                                describe: item.describe || "",
                                data: item.data || "",
                            };
                        });

                        this.bodyData = this.bodyAttachments.find((item) => {
                            return item.file == this.post.file;
                        });
                    }
                    this.loading = false;
                });
            });
        },
        handleBodyChange({ object = null, json = "", uuid = "", id = "", name = "" }) {
            this.bodyAttachments.push({
                id: id,
                file: uuid,
                name: name,
                data: json,
                body_type: object["nRoleType"],
                describe: "",
            });
            if (!this.bodyData) {
                this.bodyData = {
                    id: id,
                    file: uuid,
                    name: name,
                    data: json,
                    body_type: object["nRoleType"],
                };
                this.post.body_type = object["nRoleType"];
            }
        },
        validator(data) {
            // 必填字段 title file
            let required = ["title"];
            let requiredMsg = [this.$t("publish.validation.titleRequired")];
            if (data.code_mode) {
                required.push("code");
                requiredMsg.push(this.$t("publish.validation.bodyCodeRequired"));
            } else {
                required.push("file");
                requiredMsg.push(this.$t("publish.validation.uploadDataRequired"));
            }
            let message;
            for (let i = 0; i < required.length; i++) {
                if (!data[required[i]]) {
                    message = requiredMsg[i];
                    break;
                }
            }
            if (message) {
                this.$message.warning(message);
                return false;
            }
            return true;
        },
        publish() {
            this.processing = true;
            const data = {
                ...this.post,
                //data: this.post.data,
                images: this.post.images.map((item) => item.url || item),
            };
            let bodyAttachmentIds = this.bodyAttachments.map((item) => {
                return {
                    id: item.id,
                    describe: item.describe,
                    data: item.data,
                };
            });

            if (this.bodyData) {
                // 如果第一个附件有data，证明这个附件是新上传的，那么更新body使用这个data
                // 如果第一个附件没有data，那么表示第一个附件是以前的，是通过init()获取的，那么更新body使用原来的data
                if (this.bodyData.data) {
                    data.data = JSON.stringify(this.bodyData.data);
                }
                data.body_type = this.bodyData.body_type || this.post.body_type;
                data.file = this.bodyData.file;
            }

            data.attachments = bodyAttachmentIds;
            if (!this.validator(data)) {
                this.processing = false;
                return;
            }
            if (this.id) {
                updateBody(this.id, data)
                    .then((res) => {
                        this.$message.success(this.$t("publish.message.updateSucceeded"));
                        this.processing = false;
                        // 跳转
                        setTimeout(() => {
                            location.href = `/body/${this.id}`;
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                addBody(data).then((res) => {
                    this.$message({
                        message: this.$t("publish.message.publishSucceeded"),
                        type: "success",
                    });
                    this.processing = false;
                    // 跳转
                    setTimeout(() => {
                        location.href = `/body/${res.data.data.id}`;
                    }, 500);
                });
            }
        },
        // 移除文件标识
        removeFile(id) {
            let newQueue = [];
            for (let i = 0; i < this.bodyAttachments.length; i++) {
                if (this.bodyAttachments[i].id == id) {
                    continue;
                }
                newQueue.push(this.bodyAttachments[i]);
            }
            this.bodyAttachments = newQueue;
            if (this.bodyData.id == id) {
                this.bodyData = "";
            }
        },
        // 设置主要文件
        setMain(item) {
            this.bodyData = cloneDeep(item);
            this.$notify({
                title: this.$t("publish.message.setSucceeded"),
                type: "success",
                duration: 2000,
            });
        },
        // 粘贴体型码
        async codePaste() {
            try {
                const text = await navigator.clipboard.readText();
                this.post.code = text;
            } catch (err) {
                console.error("Failed to read clipboard contents: ", err);
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/face.less";
</style>
