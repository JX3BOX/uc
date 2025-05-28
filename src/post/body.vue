<template>
    <div class="m-publish-box m-publish-box-face" v-loading="loading">
        <!-- 头部 -->
        <publish-header name="体型分享"></publish-header>

        <el-form label-position="left" label-width="90px">
            <!-- 标题 -->
            <publish-title v-model="post.title"></publish-title>
            <!-- 信息 -->
            <div class="m-publish-info">
                <el-divider content-position="left">信息</el-divider>
                <el-form-item label="体型码">
                    <el-switch
                        v-model="post.code_mode"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="数据" v-if="!post.code_mode">
                    <face-attachment :body="post.body_type" type="body" @update:data="handleBodyChange" />
                    <div class="u-attachment" v-for="item in bodyAttachments" :key="item.id">
                        <el-button
                            class="u-main"
                            :type="item.file === bodyData.file ? 'warning' : ''"
                            icon="el-icon-star-off"
                            circle
                            :plain="item.file === bodyData.file ? false : true"
                            @click="setMain(item)"
                            size="mini"
                            title="设为主数据"
                        />
                        <span class="u-attachment-text"
                            >文件名: <b>{{ item.name }}</b></span
                        >
                        <span class="u-attachment-remark"
                            ><el-input v-model="item.describe" placeholder="备注" size="mini"></el-input
                        ></span>
                        <el-button
                            class="u-btn"
                            type="info"
                            icon="el-icon-delete"
                            circle
                            plain
                            @click="removeFile(item.id)"
                            size="mini"
                            title="移除"
                        />
                    </div>
                </el-form-item>
                <el-form-item prop="code" v-else>
                    <template #label>
                        <span>体型码</span>
                        <i class="el-icon-document-copy" @click="codePaste" style="margin-left: 2px; color: #c00"></i>
                    </template>
                    <el-input v-model="post.code" placeholder="请输入体型码"></el-input>
                </el-form-item>
                <!-- 客户端 -->
                <el-form-item label="版本">
                    <el-radio-group v-model="post.client">
                        <el-radio label="std">剑三</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <publish-client v-model="post.client" :forbidAll="true"></publish-client> -->
                <!-- 原创 -->
                <publish-original v-model="post.original"></publish-original>
                <el-form-item label="首发" prop="is_fr">
                    <el-switch
                        v-model="post.is_fr"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <template v-if="!post.original">
                    <el-form-item label="原作者名称" prop="author_name">
                        <el-input v-model="post.author_name" placeholder="输入原作者名称"></el-input>
                    </el-form-item>
                    <el-form-item label="原作者链接" prop="author_link">
                        <el-input v-model="post.author_link" placeholder="输入原作者链接"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="是否收费">
                    <template #label>
                        <span>是否收费</span>
                        <el-tooltip content="仅签约作者可以发布收费作品">
                            <i class="el-icon-warning-outline" style="margin-left: 2px;color: #c00;"></i>
                        </el-tooltip>
                    </template>
                    <el-radio-group v-model="post.price_type" :disabled="!isSuperAuthor">
                        <el-radio label="0">免费</el-radio>
                        <!-- <el-radio label="1">盒币</el-radio> -->
                        <el-radio label="2" v-if="cny_enable">收费(金箔)</el-radio>
                    </el-radio-group>
                    <el-input-number
                        class="u-price"
                        v-model="post.price_count"
                        v-if="post.price_type != '0'"
                        size="small"
                        :max="3000"
                        :min="0"
                    ></el-input-number>
                    <div class="u-tip-box" v-if="post.price_type != '0' && post.price_count > 0">
                        <div class="u-warning">
                            <el-checkbox v-model="promise" disabled>
                                我承诺该上传属于自己的原创作品或已得到原作者授权，且相关信息中不带有非授权的元素（比如贴图、字体）等，若违反法律规定我将承担全部责任，魔盒有权下架作品。
                            </el-checkbox>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="体型">
                    <el-radio-group v-model="post.body_type">
                        <el-radio :label="~~body_type" v-for="(body_label, body_type) in bodyMap" :key="body_type">
                            {{ body_label.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="post.remark" placeholder="请填写描述" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-divider content-position="left">扩展</el-divider>
                <el-form-item label="图片列表">
                    <UploadAlbum v-model="post.images"></UploadAlbum>
                </el-form-item>
                <publish-banner v-model="post.banner" v-if="isSuperAuthor"></publish-banner>
            </div>

            <!-- 按钮 -->
            <div class="m-publish-buttons">
                <el-button type="primary" @click="publish" :disabled="processing">发 &nbsp;&nbsp; 布</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { getAttachmentOfPost, addBody, getBody, updateBody } from "@/service/publish/body";
import publishHeader from "@/components/publish/publish_header.vue";
import publishTitle from "@/components/publish/publish_title.vue";
import publishOriginal from "@/components/publish/publish_original.vue";
import faceAttachment from "@/components/publish/face_attachment.vue";
import UploadAlbum from "@jx3box/jx3box-editor/src/UploadAlbum.vue";
import publishBanner from "@/components/publish/publish_banner.vue";
import { bodyMap } from "@jx3box/jx3box-facedat/assets/data/index.json";
import User from "@jx3box/jx3box-common/js/user.js";
import cloneDeep from "lodash/cloneDeep";
import { getConfig } from "@/service/publish/cms";
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
            let requiredMsg = ["请填写标题"];
            if (data.code_mode) {
                required.push("code");
                requiredMsg.push("请填写体型码");
            } else {
                required.push("file");
                requiredMsg.push("请上传数据");
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
                        this.$message.success("修改成功");
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
                        message: "发布成功",
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
                title: "设置成功",
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
