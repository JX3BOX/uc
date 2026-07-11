<template>
    <div class="m-publish-box m-publish-box-face" v-loading="loading">
        <!-- 头部 -->
        <publish-header :name="$t('publish.types.faceShare')"></publish-header>

        <el-form label-position="left" label-width="90px">
            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>
            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">{{ $t("publish.common.information") }}</el-divider>
                <el-form-item :label="$t('publish.face.code')">
                    <el-switch
                        v-model="post.code_mode"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                    ></el-switch>
                </el-form-item>
                <el-form-item :label="$t('publish.common.data')" v-if="!post.code_mode">
                    <face-attachment :body="post.body_type" type="face" @update:data="handleFaceChange" />
                    <div class="u-attachment" v-for="item in faceAttachments" :key="item.id">
                        <el-button
                            class="u-main"
                            :type="item.file === faceData.file ? 'warning' : ''"
                            icon="Star"
                            circle
                            :plain="item.file === faceData.file ? false : true"
                            @click="setMain(item)"
                            :title="$t('publish.face.setPrimary')"
                        />
                        <span class="u-attachment-text">
                            {{ $t("publish.common.fileName") }}: <b>{{ item.name }}</b>
                        </span>
                        <!-- <span class="u-attachment-key">唯一标识符：<b>{{ item.file }}</b></span> -->
                        <span class="u-attachment-remark">
                            <el-input v-model="item.describe" :placeholder="$t('publish.common.note')"></el-input>
                        </span>
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
                        <span>{{ $t("publish.face.code") }}</span>
                        <i class="el-icon-document-copy" @click="codePaste" style="margin-left: 2px; color: #c00"></i>
                    </template>
                    <el-input v-model="post.code" :placeholder="$t('publish.face.codePlaceholder')"></el-input>
                </el-form-item>
                <!-- <div class="u-face-info" v-if="faceData"> -->
                <!-- {{
                    `${maps.client[post.client]}·${maps.roleType[post.body_type]}·${
                        post.is_new_face === 1 ? $t("publish.face.realistic") : $t("publish.face.stylized")
                    }·${post.is_unlimited === 1 ? $t("publish.face.canCreate") : $t("publish.face.cannotCreate")}`
                }} -->
                <!-- <el-button @click="editDetail = !editDetail">手动修改</el-button> -->

                <!-- 自动解析 -->
                <!-- 体型 -->
                <el-form-item :label="$t('publish.face.bodyShape')" v-if="faceData || post.code_mode">
                    <el-radio-group v-model="post.body_type">
                        <el-radio
                            :label="~~body_type"
                            v-for="(body_info, body_type) in options.bodyMap"
                            :key="body_type"
                            >{{ body_info.label }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <!-- 客户端 -->
                <publish-client
                    v-if="faceData || post.code_mode"
                    v-model="post.client"
                    :forbidAll="true"
                ></publish-client>
                <!-- 画风 -->
                <el-form-item :label="$t('publish.face.style')" v-if="(faceData || post.code_mode) && post.client === 'std'">
                    <el-radio-group v-model="post.is_new_face">
                        <el-radio :value="1">{{ $t("publish.face.realistic") }}</el-radio>
                        <el-radio :value="0">{{ $t("publish.face.stylized") }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 可新建 -->
                <el-form-item v-if="faceData || post.code_mode" :label="$t('publish.face.canCreate')">
                    <el-switch v-model="post.is_unlimited" :active-value="1" :inactive-value="0"> </el-switch>
                </el-form-item>

                <!-- 原创 -->
                <el-form-item :label="$t('publish.form.firstPublished')" prop="is_fr">
                    <el-switch
                        v-model="post.is_fr"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <publish-original v-model="post.original"></publish-original>
                <template v-if="!post.original">
                    <el-form-item :label="$t('publish.form.originalAuthorName')" prop="author_name">
                        <el-input v-model="post.author_name" :placeholder="$t('publish.form.originalAuthorNamePlaceholder')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('publish.form.originalAuthorLink')" prop="author_link">
                        <el-input v-model="post.author_link" :placeholder="$t('publish.form.originalAuthorLinkPlaceholder')"></el-input>
                    </el-form-item>
                </template>

                <el-form-item>
                    <template #label>
                        <span>{{ $t("publish.form.price") }}</span>
                        <el-tooltip :content="$t('publish.form.paidAuthorHintWithRate')">
                            <i class="el-icon-warning-outline" style="margin-left: 2px; color: #c00"></i>
                        </el-tooltip>
                    </template>
                    <el-radio-group v-model="post.price_type" :disabled="!isSuperAuthor" @change="changePriceType">
                        <el-radio value="0">{{ $t("publish.form.free") }}</el-radio>
                        <!-- <el-radio value="1">盒币</el-radio> -->
                        <el-radio v-if="isSuperAuthor && cny_enable" value="2">{{ $t("publish.form.paidGoldLeaf") }}</el-radio>
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

                <el-form-item :label="$t('publish.common.instructions')">
                    <el-input v-model="post.remark" :placeholder="$t('publish.form.instructionsPlaceholder')" type="textarea" :rows="3"></el-input>
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
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getAttachmentOfPost, addFace, getFace, updateFace } from "@/service/publish/face";
import publishHeader from "@/components/publish/publish_header.vue";
import publishTitle from "@/components/publish/publish_title.vue";
import publishOriginal from "@/components/publish/publish_original.vue";
import publishClient from "@/components/publish/publish_client.vue";
import faceAttachment from "@/components/publish/face_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish/publish_banner.vue";
import { DecalDatabase } from "@jx3box/jx3box-facedat/src/DecalDatabase";
import User from "@jx3box/jx3box-common/js/user.js";
import cloneDeep from "lodash/cloneDeep";
import { __clients } from "@/utils/config";
import faceData from "@jx3box/jx3box-facedat/assets/data/index.json";
const { bodyMap, majorMap, faceSubtype } = faceData;
import { getConfig } from "@/service/publish/cms";
export default {
    name: "face",
    components: {
        publishHeader,
        publishTitle,
        publishOriginal,
        publishClient,
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
                is_new_face: 0,
                data: "", // 解析lua的json数据
                file: "", // 关联的附件表uuid
                // 作者扩展
                cover: "", // 封面
                images: [], // 图片列表
                related: [], // 相关作品
                // 价格
                price_type: "0", // 价格类型 0:免费 1:盒币 2:金箔
                price_count: 0, // 数量
                is_unlimited: 0, // 可新建
                // 从文件中读取的信息
                // 捏脸码
                code_mode: 0, // 是否是捏脸码
                code: "", // 捏脸码
            },
            options: {
                bodyMap,
                majorMap,
                faceSubtype,
                clients: __clients,
            },
            editDetail: false,
            loading: false,
            processing: false,
            isSuperAuthor: false,
            postId: "", // 帖子id
            postType: "face", // 帖子类型
            promise: true,
            faceAttachments: [],
            faceData: "",

            decalDb: null,

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
    },
    methods: {
        init() {
            if (this.id) {
                this.getData();
            } else {
                this.post.client = this.client;
            }
            this.decalDb = new DecalDatabase(this.client);
            User.isSuperAuthor().then((res) => {
                this.isSuperAuthor = res;
            });

            getConfig("cny_enable").then((res) => {
                this.cny_enable = Number(res.data.data.val);
            });
        },
        getData() {
            this.loading = true;
            getFace(this.id).then((res) => {
                this.post = res.data.data;

                if (this.isOldPost(this.post.updated_at)) {
                    this.showWarning();
                }

                this.post.images = this.post.images.map((item) => {
                    return {
                        name: item,
                        url: item,
                    };
                });
                User.isSuperAuthor().then((res) => {
                    this.isSuperAuthor = res;
                    if (this.isSuperAuthor === false) {
                        this.post.price_type = "0";
                        this.post.price_count = 0;
                    }
                });
                getAttachmentOfPost(this.id).then((res) => {
                    let result = res.data;
                    if (result && result.data) {
                        this.faceAttachments = result.data.map((item) => {
                            return {
                                id: item.id,
                                file: item.uuid,
                                name: item.name,
                                describe: item.describe || "",
                                data: item.data || "",
                            };
                        });

                        this.faceData = this.faceAttachments.find((item) => {
                            return item.file == this.post.file;
                        });
                    }
                    this.loading = false;
                });
            });
        },
        handleFaceChange({ object = null, json = "", uuid = "", id = "", name = "" }) {
            this.faceAttachments.push({
                id: id,
                file: uuid,
                name: name,
                data: json,
                body_type: object["nRoleType"],
                describe: "",
            });
            if (true || !this.faceData) {
                this.faceData = {
                    id: id,
                    file: uuid,
                    name: name,
                    data: json,
                    body_type: object["nRoleType"],
                };
                this.autoParse(object);
            }
        },
        validator(data) {
            // 必填字段 title file
            let required = ["title"];
            let requiredMsg = [this.$t("publish.validation.titleRequired")];
            if (data.code_mode) {
                required.push("code");
                requiredMsg.push(this.$t("publish.validation.faceCodeRequired"));
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
            let faceAttachmentIds = this.faceAttachments.map((item) => {
                return {
                    id: item.id,
                    describe: item.describe,
                    data: item.data,
                };
            });

            if (this.faceData) {
                // 如果第一个附件有data，证明这个附件是新上传的，那么更新face使用这个data
                // 如果第一个附件没有data，那么表示第一个附件是以前的，是通过init()获取的，那么更新face使用原来的data
                if (this.faceData.data) {
                    data.data = JSON.stringify(this.faceData.data);
                }
                data.body_type = this.faceData.body_type || this.post.body_type;
                data.file = this.faceData.file;
            }

            data.attachments = faceAttachmentIds;
            if (!this.validator(data)) {
                this.processing = false;
                return;
            }
            if (this.id) {
                updateFace(this.id, data)
                    .then((res) => {
                        this.$message.success(this.$t("publish.message.updateSucceeded"));
                        this.processing = false;
                        // 跳转
                        setTimeout(() => {
                            location.href = getLink("face", this.id);
                        }, 500);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                addFace(data).then((res) => {
                    this.$message({
                        message: this.$t("publish.message.publishSucceeded"),
                        type: "success",
                    });
                    this.processing = false;
                    // 跳转
                    setTimeout(() => {
                        location.href = getLink("face", res.data.data.id);
                    }, 500);
                });
            }
        },
        // 移除文件标识
        removeFile(id) {
            let newQueue = [];
            for (let i = 0; i < this.faceAttachments.length; i++) {
                if (this.faceAttachments[i].id == id) {
                    continue;
                }
                newQueue.push(this.faceAttachments[i]);
            }
            this.faceAttachments = newQueue;
            if (this.faceData.id == id) {
                this.faceData = "";
            }
        },
        // 设置主要文件
        setMain(item) {
            this.faceData = cloneDeep(item);
            try {
                const object = JSON.parse(item.data);
                this.autoParse(object);
                this.$notify({
                    title: this.$t("publish.message.setSucceeded"),
                    type: "success",
                    duration: 2000,
                });
            } catch (e) {
                console.error("[文件解析失败]", e);
                this.$notify({
                    title: this.$t("publish.message.parseFailed"),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        // 自动解析数据
        autoParse(object) {
            this.post.client = majorMap[object.nMajorVersion];
            this.post.is_new_face = object.bNewFace ? 1 : 0;
            this.post.body_type = object["nRoleType"];
            this.decalDb = new DecalDatabase(this.post.client, object.bNewFace);
            this.decalDb.setBodyType(this.post.body_type);
            this.post.is_unlimited = ~~this.decalDb.canUseInCreate(object);
            this.post.game_price = ~~this.decalDb.getTotalPrice(object, object.bNewFace);
        },
        // 是否收费选项变更时
        changePriceType(val) {
            if (Number(val) === 0) {
                this.post.price_count = 0;
            }
        },
        // 指定时间范围
        isOldPost(datetime) {
            return new Date(datetime) < new Date("2023-11-13 00:00:00");
        },
        // 警告
        showWarning() {
            this.$confirm(
                this.$t("publish.form.paidAuthorNoticeHtml"),
                this.$t("publish.common.notice"),
                {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t("publish.common.discardChanges"),
                    // confirmButtonClass: "u-btn-ok",
                    cancelButtonText: this.$t("publish.form.acknowledge"),
                    // cancelButtonClass: "u-btn-cancel",
                    dangerouslyUseHTMLString: true,
                    callback: (action) => {
                        if (action == "confirm") {
                            window.location.href = location.origin + getLink("face", this.id);
                        }
                    },
                }
            ).catch((action) => {});
        },
        // 粘贴捏脸码
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
// .el-message-box{
//     .u-btn-ok{
//         background-color:#fff;
//         border:1px solid #eee;
//     }
//     .u-btn-cancel{
//         background-color:#c00;
//     }
// }
</style>
