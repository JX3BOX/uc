<template>
    <div class="m-dashboard-publish-namespace m-publish-box">
        <pubheader :name="name" :localDraft="false">
            <slot name="header"></slot>
        </pubheader>
        <div class="m-publish-namespace-box">
            <header class="m-publish-namespace-header">
                <div class="u-tip">
                    {{ $t("publish.namespace.descriptionPrefix") }}
                    <a href="https://剑网3.com/某某气纯宏" target="_blank">
                        <b>剑网3.com/某某气纯宏</b>
                    </a>
                    {{ $t("publish.namespace.descriptionSuffix") }}
                </div>
                <div class="u-count">
                    <span class="u-count-txt">
                        {{ $t("publish.namespace.availablePrefix") }}
                        <b>{{ count }}</b> {{ $t("publish.namespace.availableSuffix") }}
                    </span>
                    <a
                        href="/vip/namespace?from=dashboard_namespace_create"
                        target="_blank"
                        class="u-btn-buy el-button el-button--primary el-button--small"
                    >
                        <span class="el-icon-shopping-cart-2"></span>{{ $t("publish.namespace.buy") }}
                    </a>
                    <!-- <a
                        href="/vip/namespace/?from=dashboard_namespace_create"
                        class="u-skip"
                        target="_blank"
                    >
                        <span class="el-icon-connection"></span>{{ $t("publish.namespace.promotion") }}
                    </a> -->
                </div>
            </header>
            <div class="m-namspace-tips" v-if="success">
                <el-alert :title="$t('publish.message.submittedForReview')" type="success" show-icon></el-alert>
            </div>
            <el-form class="m-publish-namespace-form" :rules="rules" :model="form" label-width="80px">
                <el-form-item :label="$t('publish.common.keyword')" prop="key">
                    <el-input v-model="form.key" :placeholder="$t('publish.namespace.keywordPlaceholder')" size="large"></el-input>
                    <el-alert
                        style="margin-top: 5px"
                        v-if="!available"
                        :title="$t('publish.namespace.keywordExists')"
                        type="error"
                        show-icon
                    />
                </el-form-item>
                <el-form-item :label="$t('publish.common.link')" prop="link">
                    <el-input v-model="form.link" size="large" :placeholder="$t('publish.namespace.linkPlaceholder')">
                        <template #prepend>https://</template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('publish.common.description')">
                    <el-input
                        v-model="form.desc"
                        :placeholder="$t('publish.namespace.descriptionPlaceholder')"
                        maxlength="30"
                        show-word-limit
                        size="large"
                    ></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-button
                        class="u-submit"
                        size="large"
                        type="primary"
                        :disabled="!ready || processing"
                        @click="onSubmit"
                        >{{ $t("publish.common.submit") }}</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { sterilizer } from "sterilizer/index.js";
import pubheader from "@/components/publish/publish_header.vue";
import { getNamespaceByKey, getNamespaceById, createNamespace, updateNamespace } from "@/service/publish/namespace";
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
            name: this.$t("publish.types.namespace"),
            form: lodash.cloneDeep(default_form),
            count: 0,
            available: false,
            success: false,
            processing: false,
            rules: {
                key: [
                    {
                        required: true,
                        message: this.$t("publish.validation.namespaceNameRequired"),
                        trigger: "blur",
                    },
                ],
                link: [
                    {
                        required: true,
                        message: this.$t("publish.validation.linkRequired"),
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
            this.form.key = sterilizer(this.form.key).kill().removeSpace().toString();
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
                this.data.desc = this.$t("publish.namespace.createdBy", { name: profile.name });
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
            this.$notify.success({
                title: this.$t("publish.common.success"),
                message: this.$t("publish.message.submitSucceeded"),
                showClose: false,
            });
            setTimeout(() => {
                this.$router.push({ name: "bucket_namespace" });
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
