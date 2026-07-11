<!--
 * @Author: iRuxu
 * @Date: 2022-07-03 00:02:30
 * @LastEditTime: 2022-07-03 02:09:18
 * @Description:
-->
<template>
    <div class="m-feedback-erase" v-loading="loading">
        <div class="m-feedback-article">
            <h1 class="u-title">{{ $t("dashboard.feedback.accountDeletion") }}</h1>
            <common-article :content="article"></common-article>
        </div>
        <div class="u-tips">
            <div class="u-checkbox"><el-checkbox v-model="agree">{{ $t("dashboard.feedback.agreeRules") }}</el-checkbox></div>
            <div class="u-confirm">
                <el-button type="danger" :disabled="!agree" @click="handleConfirm">{{ $t("dashboard.feedback.confirmDeletion") }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import DOMPurify from "dompurify";
import User from "@jx3box/jx3box-common/js/user";
import { getArticle } from "@jx3box/jx3box-common/js/system";
import { leave } from "@/service/dashboard/feedback";
import CommonArticle from "@jx3box/jx3box-editor/src/Article.vue";
export default {
    name: "FeedbackErase",
    components: {
        CommonArticle,
    },
    data() {
        return {
            agree: false,
            loading: false,

            article: "",
        };
    },
    mounted() {
        this.loadAlertInfo();
    },
    methods: {
        handleConfirm() {
            this.$confirm(
                this.$t("dashboard.feedback.deletionWarning"),
                this.$t("dashboard.common.tip"),
                {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    type: "warning",
                }
            ).then(() => {
                this.$prompt(this.$t("dashboard.password.enterPassword"), this.$t("dashboard.password.confirmPassword"), {
                    confirmButtonText: this.$t("dashboard.common.confirm"),
                    cancelButtonText: this.$t("dashboard.common.cancel"),
                    inputType: "password",
                }).then(({ value }) => {
                    leave(value)
                        .then(() => {
                            this.$message({
                                type: "success",
                                message: this.$t("dashboard.feedback.deletionSuccess"),
                            });
                            User.destroy();
                            location.href = "/";
                        })
                        .catch((res) => {
                            this.$message({
                                type: "error",
                                message: res.data.msg || this.$t("dashboard.feedback.deletionFailed"),
                            });
                        });
                }).catch(() => {})
            });
        },
        loadAlertInfo() {
            this.loading = true;
            getArticle(43049)
                .then((res) => {
                    this.article = res;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        sanitizedHTML(html) {
            return DOMPurify.sanitize(html);
        },
    },
};
</script>

<style lang="less" scoped>
.m-feedback-erase {
    padding-bottom: 20px;
    
    .m-feedback-article {
        padding: 20px;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
    }
    .u-title {
        .x;
        font-size: 28px;
        font-weight: bold;
        color:@color;
    }

    .u-tips {
        margin-top: 20px;
        .x;
    }
    .u-confirm {
        .mt(10px);
    }
}
</style>
