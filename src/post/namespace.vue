<template>
    <div class="m-dashboard-publish-namespace m-publish-box">
        <pubheader :name="name" :localDraft="false">
            <slot name="header"></slot>
        </pubheader>
        <div class="m-publish-namespace-box">
            <header class="m-publish-namespace-header">
                <div class="u-tip">
                    铭牌是一个可以通过关键词快速访问的功能，例如定义铭牌 "某某气纯宏"，则可以在浏览器地址栏中通过快速输入
                    <a
                        href="https://剑网3.com/某某气纯宏"
                        target="_blank"
                    >
                        <b>剑网3.com/某某气纯宏</b>
                    </a>
                    访问你输入的链接
                </div>
                <div class="u-count">
                    <span class="u-count-txt">
                        当前可建铭牌数：
                        <b>{{ count }}</b> 个
                    </span>
                    <a
                        href="/vip/namespace?from=dashboard_namespace_create"
                        target="_blank"
                        class="u-btn-buy el-button el-button--primary el-button--mini"
                    >
                        <span class="el-icon-shopping-cart-2"></span>购买铭牌
                    </a>
                    <!-- <a
                        href="/vip/namespace/?from=dashboard_namespace_create"
                        class="u-skip"
                        target="_blank"
                    >
                        <span class="el-icon-connection"></span>限时0.99元抢注10个铭牌
                    </a> -->
                </div>
            </header>
            <div class="m-namspace-tips" v-if="success">
                <el-alert title="提交成功，请等待审核" type="success" show-icon></el-alert>
            </div>
            <el-form class="m-publish-namespace-form" :rules="rules" :model="form">
                <el-form-item label="关键词" prop="key">
                    <el-input v-model="form.key" placeholder="全局唯一关键词"></el-input>
                    <el-alert style="margin-top: 5px;" v-if="!available" title="已有关键词，请重新输入" type="error" show-icon />
                </el-form-item>
                <el-form-item label="链接" prop="link">
                    <el-input v-model="form.link" placeholder="请输入跳转地址">
                        <template slot="prepend">https://</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                        v-model="form.desc"
                        placeholder="请输入关于铭牌的描述"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-button
                        class="u-submit"
                        type="primary"
                        :disabled="!ready || processing"
                        @click="onSubmit"
                    >提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { sterilizer } from "sterilizer/index.js";
import pubheader from "@/components/publish/publish_header.vue";
import {
    getNamespaceByKey,
    getNamespaceById,
    createNamespace,
    updateNamespace,
} from "@/service/publish/namespace";
import User from "@jx3box/jx3box-common/js/user";
import lodash from "lodash";
const default_form = {
    key: "",
    desc: "",
    link: "",
};
export default {
    name: "namespace",
    props: [],
    data: function () {
        return {
            name: "剑三铭牌",
            form: lodash.cloneDeep(default_form),
            count: 0,
            available: false,
            success: false,
            processing: false,
            rules: {
                key: [
                    {
                        required: true,
                        message: "请输入铭牌名称",
                        trigger: "blur",
                    },
                ],
                link: [
                    {
                        required: true,
                        message: "请输入链接网址",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    computed: {
        data: function () {
            return {
                key: this.form.key,
                desc: this.form.desc,
                link: "https://" + this.form.link,
                // source_type: "custom",
            };
        },
        isEditMode: function () {
            return !!this.$route.params.id;
        },
        ready: function () {
            if (this.isEditMode) {
                return this.available && this.form.link;
            }
            return this.available && this.form.link && this.count;
        },
    },
    methods: {
        checkKey: function (val) {
            if (!val) {
                this.available = true;
                return;
            }
            this.form.key = sterilizer(this.form.key)
                .kill()
                .removeSpace()
                .toString();
            if (this.form.key == this.key_cache) {
                this.available = true;
                return;
            }
            this.checkAvailable();
        },
        checkLink: function (val) {
            if (!val) return;

            const link = this.form.link;
            if (link.includes("http://") || link.includes("https://")) {
                this.form.link = link.replace(/https?\:\/\//, "");
            }
        },

        checkAvailable: function () {
            getNamespaceByKey(this.form.key).then((res) => {
                if (!res.data.data) {
                    this.available = true;
                } else {
                    this.available = false;
                }
            });
        },
        onSubmit: function () {
            if (this.form.desc == "") {
                let profile = User.getInfo();
                this.data.desc = profile.name + "创建";
            }
            this.processing = true;
            if (this.isEditMode) {
                updateNamespace(this.namespace_id, this.data)
                    .then(() => {
                        this.onSuccess();
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            } else {
                createNamespace(this.data)
                    .then(() => {
                        this.onSuccess();
                        this.count -= 1;
                        this.form = lodash.cloneDeep(default_form);
                    })
                    .finally(() => {
                        this.processing = false;
                    });
            }
        },
        onSuccess() {
            this.success = true;
            this.$notify.success({title: "成功", message: "提交成功", showClose: false});
            setTimeout(() => {
                this.$router.push({name: 'bucket_namespace'})
            }, 500);
        },
    },
    watch: {
        "form.key": function (val) {
            this.checkKey(val);
        },
        "form.link": function (val) {
            this.checkLink(val);
        },
    },
    created() {
        User.getAsset().then((data) => {
            this.count = data.namespace_card_count;
        });
    },
    mounted: function () {
        this.namespace_id = this.$route.params.id;
        if (this.namespace_id) {
            getNamespaceById(this.namespace_id).then((res) => {
                const { key, desc, link } = res.data.data;
                this.key_cache = key;
                this.form = {
                    key,
                    desc,
                    link,
                };
            });
        }
        if (this.form.key == "") {
            this.available = true;
        }
    },

    components: {
        pubheader,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/namespace.less";
</style>
